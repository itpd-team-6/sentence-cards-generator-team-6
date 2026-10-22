"""The API calls that turn the marked words of a text into cards, and let the learner review them."""

import re
import sqlite3
from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, ConfigDict, Field, StringConstraints, model_validator

from app.database import (
    add_card,
    delete_card,
    delete_cards,
    get_card,
    get_connection,
    get_text,
    list_all_cards,
    list_cards,
    set_hidden,
    update_card,
)
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
    translation_locked: bool
    flagged: bool
    hidden: bool
    due_date: str
    # Set only when cards were just generated and the model gave no sentence for this word.
    error: str | None = None


class CardChange(BaseModel):
    """What the learner changes on a card. Only the fields that are sent are changed.

    The translation follows the sentence unless the learner writes it or locks it (DEC-014).
    """

    model_config = ConfigDict(extra="forbid")

    sentence: Sentence | None = None
    translation: Sentence | None = None
    translation_locked: bool | None = None
    flagged: bool | None = None
    hidden: bool | None = None

    @model_validator(mode="after")
    def something_changes(self) -> "CardChange":
        if not self.model_fields_set:
            raise ValueError("Send at least one of: sentence, translation, translation_locked, flagged, hidden.")
        return self


class CardIds(BaseModel):
    """The cards an action on several cards is for."""

    card_ids: list[int] = Field(min_length=1)


class HiddenCards(CardIds):
    """The cards to hide from study, or to show again."""

    hidden: bool


def card_response(card: dict, error: str | None = None) -> CardResponse:
    return CardResponse(
        **{
            **card,
            "translation_locked": bool(card["translation_locked"]),
            "flagged": bool(card["flagged"]),
            "hidden": bool(card["hidden"]),
        },
        error=error,
    )


def passage_around(text: str, word: str) -> str | None:
    """The part of the text around the first appearance of the word, or None when the word is not found.

    A card word of several words, such as "stimmt zu", may have other words between its parts in the text, so
    its passage runs from the first part to the last one, found in this order (see `parts_span`).
    """
    parts = word.split()
    if len(parts) > 1:
        span = parts_span(text, parts)
        if span is None:
            return None
        start, end = span
        return text[max(0, start - PASSAGE_RADIUS) : end + PASSAGE_RADIUS].strip()
    position = text.lower().find(word.lower())
    if position == -1:
        return None
    return text[max(0, position - PASSAGE_RADIUS) : position + len(word) + PASSAGE_RADIUS].strip()


def parts_span(text: str, parts: list[str]) -> tuple[int, int] | None:
    """Where the first part of a card word starts and the last one ends, with the parts in this order in the text.

    Each part is a whole word, whatever its case. The first appearance of the first part that has all the other
    parts after it is the one used. None when the parts do not all appear in this order.
    """
    patterns = [re.compile(rf"(?<!\w){re.escape(part)}(?!\w)", re.IGNORECASE) for part in parts]
    for first in patterns[0].finditer(text):
        end = first.end()
        for pattern in patterns[1:]:
            found = pattern.search(text, end)
            if found is None:
                break
            end = found.end()
        else:
            return first.start(), end
    return None


def ask_model(
    client: LlmClient, text: dict, card_or_word: dict | str, previous_sentence: str | None = None
) -> GeneratedSentence:
    """Ask for a sentence. For a card whose translation is locked, the sentence is written to fit that translation."""
    if isinstance(card_or_word, dict):
        word = card_or_word["word"]
        locked = card_or_word["translation"] if card_or_word["translation_locked"] else None
    else:
        word, locked = card_or_word, None
    extra = {"locked_translation": locked} if locked else {}
    return client.write_sentence(
        word,
        text["text_language"],
        text["first_language"],
        passage_around(text["text"], word),
        previous_sentence,
        **extra,
    )


def new_sentence_fields(card: dict, result: GeneratedSentence) -> dict:
    """What a new sentence changes on a card: the sentence, and the translation too unless it is locked."""
    fields: dict = {"sentence": result.sentence, "flagged": 0}
    if not card["translation_locked"]:
        fields["translation"] = result.translation
    return fields


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


@router.get("/api/cards")
def read_all_cards(connection: Annotated[sqlite3.Connection, Depends(get_connection)]) -> list[CardResponse]:
    """Every card of every text, so the learner can review the cards they study, whatever text they came from."""
    return [card_response(card) for card in list_all_cards(connection)]


@router.post("/api/cards/new-sentences")
def replace_sentences(
    chosen: CardIds,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    client: Annotated[LlmClient, Depends(get_llm_client)],
) -> list[CardResponse]:
    """Ask the model for another sentence for each of the chosen cards, one after the other.

    A card the model gives no sentence for keeps its sentence and carries an `error`; the other cards get theirs.
    When a card does not exist, nothing changes. When the model is not set up, no card changes either.
    """
    ids = list(dict.fromkeys(chosen.card_ids))
    cards = [find_card(connection, card_id) for card_id in ids]
    errors: dict[int, str] = {}
    for card in cards:
        text = get_text(connection, card["text_id"])
        try:
            result = ask_model(client, text, card, card["sentence"])
        except LlmNotConfigured as error:
            raise HTTPException(status_code=503, detail=str(error)) from None
        except LlmError as error:
            errors[card["id"]] = str(error)
            continue
        update_card(connection, card["id"], **new_sentence_fields(card, result))
    return [card_response(get_card(connection, card_id), errors.get(card_id)) for card_id in ids]


@router.post("/api/cards/hidden")
def hide_cards(
    chosen: HiddenCards, connection: Annotated[sqlite3.Connection, Depends(get_connection)]
) -> list[CardResponse]:
    """Hide the chosen cards from study, or show them again, in one step. When a card does not exist, none changes."""
    if not set_hidden(connection, chosen.card_ids, chosen.hidden):
        raise HTTPException(status_code=404, detail="There is no card with one of these ids.")
    ids = list(dict.fromkeys(chosen.card_ids))
    return [card_response(get_card(connection, card_id)) for card_id in ids]


@router.post("/api/cards/delete", status_code=204)
def remove_cards(chosen: CardIds, connection: Annotated[sqlite3.Connection, Depends(get_connection)]) -> Response:
    """Delete the chosen cards in one step. When a card does not exist, none is deleted."""
    if not delete_cards(connection, chosen.card_ids):
        raise HTTPException(status_code=404, detail="There is no card with one of these ids.")
    return Response(status_code=204)


@router.patch("/api/cards/{card_id}")
def change_card(
    card_id: int,
    change: CardChange,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    client: Annotated[LlmClient, Depends(get_llm_client)],
) -> CardResponse:
    """Edit the sentence or the translation, lock the translation, set the flag, or hide the card from study.

    The translation follows the sentence (DEC-014): when the sentence changes, the model translates the new one before
    anything is saved, unless the learner sends a translation in the same request, or the translation is locked, in
    which case it stays. A translation the learner sends is saved as it is. A card needs a translation to be locked.
    When the model does not answer, nothing changes. Editing a card clears its flag unless the request sets it.
    """
    card = find_card(connection, card_id)
    fields = change.model_dump(exclude_unset=True)
    for name in ("flagged", "hidden", "translation_locked"):
        if name in fields:
            fields[name] = int(fields[name])
    for name in ("sentence", "translation"):
        if name in fields and fields[name] == card[name]:
            del fields[name]
    locked = bool(fields.get("translation_locked", card["translation_locked"]))
    if locked and not (fields.get("translation") or card["translation"]):
        raise HTTPException(status_code=422, detail="A card without a translation cannot have its translation locked.")
    if "sentence" in fields and "translation" not in fields and not locked:
        text = get_text(connection, card["text_id"])
        try:
            fields["translation"] = client.translate_sentence(
                fields["sentence"], text["text_language"], text["first_language"]
            )
        except LlmNotConfigured as error:
            raise HTTPException(status_code=503, detail=str(error)) from None
        except LlmError as error:
            raise HTTPException(status_code=502, detail=str(error)) from None
    if "sentence" in fields or "translation" in fields:
        fields.setdefault("flagged", 0)
    update_card(connection, card_id, **fields)
    return card_response(get_card(connection, card_id))


@router.post("/api/cards/{card_id}/new-sentence")
def replace_sentence(
    card_id: int,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    client: Annotated[LlmClient, Depends(get_llm_client)],
) -> CardResponse:
    """Ask the model for another sentence for the card's word, and its translation, unless the translation is locked.

    A locked translation stays, and the model writes a sentence that means the same. When the model does not answer,
    the card stays as it is.
    """
    card = find_card(connection, card_id)
    text = get_text(connection, card["text_id"])
    try:
        result = ask_model(client, text, card, card["sentence"])
    except LlmNotConfigured as error:
        raise HTTPException(status_code=503, detail=str(error)) from None
    except LlmError as error:
        raise HTTPException(status_code=502, detail=str(error)) from None
    update_card(connection, card_id, **new_sentence_fields(card, result))
    return card_response(get_card(connection, card_id))


@router.delete("/api/cards/{card_id}", status_code=204)
def remove_card(card_id: int, connection: Annotated[sqlite3.Connection, Depends(get_connection)]) -> Response:
    """Delete one card. The other cards of the text stay."""
    if not delete_card(connection, card_id):
        raise HTTPException(status_code=404, detail="There is no card with this id.")
    return Response(status_code=204)
