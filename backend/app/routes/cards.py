"""The API calls that turn the marked words of a text into cards, and let the learner review them."""

import sqlite3
from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, ConfigDict, StringConstraints, model_validator

from app.database import add_card, delete_card, get_card, get_connection, get_text, list_cards, update_card
from app.llm import GeneratedSentence, LlmClient, LlmError, LlmNotConfigured, get_llm_client

router = APIRouter()

# How many characters of the text around a word are sent to the model, so it picks the meaning used in the text.
PASSAGE_RADIUS = 200

Sentence = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


def get_today() -> date:
    """Today's date. Tests replace it with `app.dependency_overrides` so they do not depend on the real clock."""
    return date.today()


class CardResponse(BaseModel):
    id: int
    text_id: int
    word: str
    sentence: str | None
    translation: str | None
    flagged: bool
    due_date: str
    # Set only when cards were just generated and the model gave no sentence for this word.
    error: str | None = None


class CardChange(BaseModel):
    """What the learner changes on a card. Only the fields that are sent are changed.

    There is no `translation`: it is made by the model from the sentence, so it always matches it.
    """

    model_config = ConfigDict(extra="forbid")

    sentence: Sentence | None = None
    flagged: bool | None = None

    @model_validator(mode="after")
    def something_changes(self) -> "CardChange":
        if not self.model_fields_set:
            raise ValueError("Send at least one of: sentence, flagged.")
        return self


def card_response(card: dict, error: str | None = None) -> CardResponse:
    return CardResponse(**{**card, "flagged": bool(card["flagged"])}, error=error)


def passage_around(text: str, word: str) -> str | None:
    """The part of the text around the first appearance of the word, or None when the word is not found."""
    position = text.lower().find(word.lower())
    if position == -1:
        return None
    return text[max(0, position - PASSAGE_RADIUS) : position + len(word) + PASSAGE_RADIUS].strip()


def ask_model(client: LlmClient, text: dict, word: str, previous_sentence: str | None = None) -> GeneratedSentence:
    return client.write_sentence(
        word,
        text["text_language"],
        text["first_language"],
        passage_around(text["text"], word),
        previous_sentence,
    )


def find_card(connection: sqlite3.Connection, card_id: int) -> dict:
    card = get_card(connection, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="There is no card with this id.")
    return card


@router.post("/api/texts/{text_id}/cards")
def create_cards(
    text_id: int,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    client: Annotated[LlmClient, Depends(get_llm_client)],
    today: Annotated[date, Depends(get_today)],
) -> list[CardResponse]:
    """A card for each marked word of the text that has none yet, with a sentence and its translation.

    The cards exist at once, without the learner confirming them. When the model gives no sentence for a word,
    that card has no sentence and carries an `error`; the other words keep their sentences. Calling this again
    does not touch the cards that exist, so a word without a sentence is retried with the card's own call.
    """
    text = get_text(connection, text_id)
    if text is None:
        raise HTTPException(status_code=404, detail="There is no text with this id.")
    have_a_card = {card["word"] for card in list_cards(connection, text_id)}
    errors: dict[str, str] = {}
    for word in text["words"]:
        if word in have_a_card:
            continue
        try:
            result = ask_model(client, text, word)
            add_card(connection, text_id, word, result.sentence, result.translation, today)
        except LlmError as error:
            add_card(connection, text_id, word, None, None, today)
            errors[word] = str(error)
    return [card_response(card, errors.get(card["word"])) for card in list_cards(connection, text_id)]


@router.get("/api/texts/{text_id}/cards")
def read_cards(text_id: int, connection: Annotated[sqlite3.Connection, Depends(get_connection)]) -> list[CardResponse]:
    if get_text(connection, text_id) is None:
        raise HTTPException(status_code=404, detail="There is no text with this id.")
    return [card_response(card) for card in list_cards(connection, text_id)]


@router.patch("/api/cards/{card_id}")
def change_card(
    card_id: int,
    change: CardChange,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    client: Annotated[LlmClient, Depends(get_llm_client)],
) -> CardResponse:
    """Edit the sentence or set the flag.

    A new sentence is translated by the model before anything is saved, so the translation always matches it.
    When the model does not answer, nothing changes. Editing a card clears its flag unless the request sets it.
    """
    card = find_card(connection, card_id)
    fields = change.model_dump(exclude_unset=True)
    if "flagged" in fields:
        fields["flagged"] = int(fields["flagged"])
    if fields.get("sentence") == card["sentence"]:
        del fields["sentence"]
    if "sentence" in fields:
        text = get_text(connection, card["text_id"])
        try:
            fields["translation"] = client.translate_sentence(
                fields["sentence"], text["text_language"], text["first_language"]
            )
        except LlmNotConfigured as error:
            raise HTTPException(status_code=503, detail=str(error)) from None
        except LlmError as error:
            raise HTTPException(status_code=502, detail=str(error)) from None
        fields.setdefault("flagged", 0)
    update_card(connection, card_id, **fields)
    return card_response(get_card(connection, card_id))


@router.post("/api/cards/{card_id}/new-sentence")
def replace_sentence(
    card_id: int,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    client: Annotated[LlmClient, Depends(get_llm_client)],
) -> CardResponse:
    """Ask the model for another sentence for the card's word. When it does not answer, the card stays as it is."""
    card = find_card(connection, card_id)
    text = get_text(connection, card["text_id"])
    try:
        result = ask_model(client, text, card["word"], card["sentence"])
    except LlmNotConfigured as error:
        raise HTTPException(status_code=503, detail=str(error)) from None
    except LlmError as error:
        raise HTTPException(status_code=502, detail=str(error)) from None
    update_card(connection, card_id, sentence=result.sentence, translation=result.translation, flagged=0)
    return card_response(get_card(connection, card_id))


@router.delete("/api/cards/{card_id}", status_code=204)
def remove_card(card_id: int, connection: Annotated[sqlite3.Connection, Depends(get_connection)]) -> Response:
    """Delete one card. The other cards of the text stay."""
    if not delete_card(connection, card_id):
        raise HTTPException(status_code=404, detail="There is no card with this id.")
    return Response(status_code=204)
