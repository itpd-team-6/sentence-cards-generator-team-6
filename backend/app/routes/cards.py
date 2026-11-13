"""The API calls that turn the marked words of a text into cards, and let the learner review them."""

import sqlite3
from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    StringConstraints,
    field_validator,
    model_validator,
)

from app.analytics import Tracker, get_tracker
from app.database import (
    DeckPairMismatch,
    UncategorizedDeck,
    UnknownDeck,
    add_card,
    add_cards_to_decks,
    card_of_marked_word,
    change_card_decks,
    delete_card,
    delete_cards,
    find_card_by_phrase,
    get_card,
    get_connection,
    get_deck,
    get_text,
    link_word_to_card,
    list_all_cards,
    list_cards,
    meanings_of_word,
    set_hidden,
    text_for_card,
    update_card,
)
from app.llm import (
    CardExists,
    GeneratedSentence,
    LlmClient,
    LlmError,
    LlmNotConfigured,
    get_llm_client,
)
from app.phrases import parts_span, phrase_problem

router = APIRouter()

# How many characters of the text around a word are sent to the model, so it picks the meaning used in the text.
PASSAGE_RADIUS = 200

Sentence = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


def get_today() -> date:
    """Today's date. Tests replace it with `app.dependency_overrides` so they do not depend on the real clock."""
    return date.today()


class DeckRef(BaseModel):
    """A deck a card is in."""

    id: int
    title: str


class TextRef(BaseModel):
    """A text that still has the word of a card (DEC-064)."""

    id: int
    title: str


class CardResponse(BaseModel):
    id: int
    # A card has its own language pair and no text (DEC-020); the decks it is in say where it belongs.
    text_language: str
    first_language: str
    decks: list[DeckRef]
    # The texts that still have the word marked; empty for a card whose texts are gone.
    texts: list[TextRef] = []
    word: str
    # The context phrase that, with the word, identifies the card (DEC-013); None for a card made before phrases existed.
    phrase: str | None
    sentence: str | None
    translation: str | None
    translation_locked: bool
    flagged: bool
    hidden: bool
    due_date: str
    # Set only when cards were just generated and the model gave no sentence for this word.
    error: str | None = None


class ExistingCard(BaseModel):
    """A word that got no card because the learner already has one for it with the same meaning."""

    word: str
    phrase: str


class CreatedCards(BaseModel):
    # Every card of the text, not only the new ones.
    cards: list[CardResponse]
    existing: list[ExistingCard]
    # How many cards this call made. A word that already had a card, or that took the card the learner has with the same
    # meaning, is not counted.
    made: int = 0


class CardsRequest(BaseModel):
    """The decks the new cards go in. A card the learner already has for a word of the text is added to them too."""

    deck_ids: list[int] = Field(min_length=1)

    @field_validator("deck_ids")
    @classmethod
    def decks_appear_once(cls, deck_ids: list[int]) -> list[int]:
        return list(dict.fromkeys(deck_ids))


class CardChange(BaseModel):
    """What the learner changes on a card. Only the fields that are sent are changed.

    The translation follows the sentence unless the learner writes it or locks it (DEC-014).
    """

    model_config = ConfigDict(extra="forbid")

    sentence: Sentence | None = None
    translation: Sentence | None = None
    phrase: Sentence | None = None
    translation_locked: bool | None = None
    flagged: bool | None = None
    hidden: bool | None = None

    @model_validator(mode="after")
    def something_changes(self) -> "CardChange":
        if not self.model_fields_set:
            raise ValueError(
                "Send at least one of: sentence, translation, phrase, translation_locked, flagged, hidden."
            )
        return self


class CardIds(BaseModel):
    """The cards an action on several cards is for."""

    card_ids: list[int] = Field(min_length=1)


class HiddenCards(CardIds):
    """The cards to hide from study, or to show again."""

    hidden: bool


class CardDecks(CardIds):
    """The decks to put the cards in and the decks to take them out of. At least one deck is needed, and a deck cannot be
    both."""

    add_deck_ids: list[int] = []
    remove_deck_ids: list[int] = []

    @model_validator(mode="after")
    def at_least_one_change(self) -> "CardDecks":
        if not self.add_deck_ids and not self.remove_deck_ids:
            raise ValueError("Send at least one deck to add or to remove.")
        if set(self.add_deck_ids) & set(self.remove_deck_ids):
            raise ValueError("A deck cannot be added and removed in the same step.")
        return self


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


def ask_model(
    client: LlmClient,
    text: dict,
    card_or_word: dict | str,
    previous_sentence: str | None = None,
    known_phrases: "list[str] | dict[str, str] | None" = None,
) -> GeneratedSentence:
    """Ask for a sentence. For a card whose translation is locked, the sentence is written to fit that translation.

    A word that has no card yet, and a card that has no sentence and no phrase, are also asked for the phrase that
    identifies the card, with `known_phrases`, the phrases of the other cards for the word: when the word has the same
    meaning as one of them, `CardExists` is raised. A card that has a phrase gets a sentence that keeps its meaning.
    """
    extra: dict = {}
    if isinstance(card_or_word, dict):
        word = card_or_word["word"]
        if card_or_word["translation_locked"] and card_or_word["translation"]:
            extra["locked_translation"] = card_or_word["translation"]
        if card_or_word["phrase"]:
            extra["meaning_phrase"] = card_or_word["phrase"]
        elif card_or_word["sentence"] is None:
            extra.update(ask_phrase=True, known_phrases=known_phrases)
    else:
        word = card_or_word
        extra.update(ask_phrase=True, known_phrases=known_phrases)
    return client.write_sentence(
        word,
        text["text_language"],
        text["first_language"],
        passage_around(text["text"], word),
        previous_sentence,
        **extra,
    )


def new_sentence_fields(card: dict, result: GeneratedSentence) -> dict:
    """What a new sentence changes on a card: the sentence, and the translation too unless it is locked.

    A card that had no phrase gets the one the model wrote with the sentence, if it was asked for one.
    """
    fields: dict = {"sentence": result.sentence, "flagged": 0}
    if not card["translation_locked"]:
        fields["translation"] = result.translation
    if result.phrase and not card["phrase"]:
        fields["phrase"] = result.phrase
    return fields


def pair_of(card: dict) -> tuple[str, str]:
    """The language pair of a card: its text language and its first language."""
    return card["text_language"], card["first_language"]


def check_phrase_is_free(
    connection: sqlite3.Connection,
    word: str,
    phrase: str | None,
    card_id: int | None = None,
    pair: tuple[str, str] | None = None,
) -> None:
    """Raise `CardExists` when another card for the word, in the language pair, already has this phrase, whatever the
    model said."""
    other = find_card_by_phrase(connection, word, phrase, card_id, pair) if phrase else None
    if other:
        raise CardExists(other["phrase"])


def find_card(connection: sqlite3.Connection, card_id: int) -> dict:
    card = get_card(connection, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="There is no card with this id.")
    return card


@router.post("/api/texts/{text_id}/cards")
def create_cards(
    text_id: int,
    request: CardsRequest,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    client: Annotated[LlmClient, Depends(get_llm_client)],
    today: Annotated[date, Depends(get_today)],
    tracker: Annotated[Tracker, Depends(get_tracker)],
) -> CreatedCards:
    """A card for each marked word of the text that has none yet, with a sentence, its translation and its phrase.

    Every card of the text is put in the decks of the request, so the decks must exist and be for the language pair of
    the text (404 and 422 otherwise, and nothing is made). The cards exist at once, without the learner confirming
    them. A word is identified by its phrase (DEC-013): when the learner already has a card for the word with the same
    meaning in this language pair, no card is made, the word points to that card, the card is put in the decks, and the
    word is listed in `existing` with the phrase of that card. A word that already has a card is put in the decks and
    its card is not touched. When the model gives no sentence for a word, that card has no sentence and carries an
    `error`; the other words keep their sentences. A word without a sentence is retried with the card's own call.
    """
    text = get_text(connection, text_id)
    if text is None:
        raise HTTPException(status_code=404, detail="There is no text with this id.")
    pair = (text["text_language"], text["first_language"])
    for deck_id in request.deck_ids:
        deck = get_deck(connection, deck_id)
        if deck is None:
            raise HTTPException(status_code=404, detail=f"There is no deck with id {deck_id}.")
        if deck["uncategorized"]:
            raise HTTPException(
                status_code=422,
                detail="Choose another deck: a card goes to Uncategorized only when it is in no other deck.",
            )
        if (deck["text_language"], deck["first_language"]) != pair:
            raise HTTPException(
                status_code=422, detail="A deck only takes cards of its own language pair."
            )
    errors: dict[str, str] = {}
    existing: list[ExistingCard] = []
    made = 0
    for word in text["words"]:
        card = card_of_marked_word(connection, text_id, word)
        if card:
            add_cards_to_decks(connection, [card["id"]], request.deck_ids)
            continue
        try:
            result = ask_model(
                client, text, word, known_phrases=meanings_of_word(connection, word, pair=pair)
            )
            check_phrase_is_free(connection, word, result.phrase, pair=pair)
            add_card(
                connection,
                text_id,
                word,
                result.sentence,
                result.translation,
                today,
                result.phrase,
                request.deck_ids,
            )
            made += 1
        except CardExists as exists:
            other = find_card_by_phrase(connection, word, exists.phrase, pair=pair)
            if other:
                link_word_to_card(connection, text_id, word, other["id"])
                add_cards_to_decks(connection, [other["id"]], request.deck_ids)
            existing.append(ExistingCard(word=word, phrase=exists.phrase))
        except LlmError as error:
            add_card(connection, text_id, word, None, None, today, None, request.deck_ids)
            errors[word] = str(error)
    cards = [
        card_response(card, errors.get(card["word"])) for card in list_cards(connection, text_id)
    ]
    tracker.record(
        "cards_generated",
        words_asked=len(text["words"]),
        cards_made=made,
        words_failed=len(errors),
    )
    return CreatedCards(cards=cards, existing=existing, made=made)


@router.get("/api/texts/{text_id}/cards")
def read_cards(
    text_id: int, connection: Annotated[sqlite3.Connection, Depends(get_connection)]
) -> list[CardResponse]:
    if get_text(connection, text_id) is None:
        raise HTTPException(status_code=404, detail="There is no text with this id.")
    return [card_response(card) for card in list_cards(connection, text_id)]


@router.get("/api/cards")
def read_all_cards(
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
) -> list[CardResponse]:
    """Every card, so the learner can review the cards they study, whatever text or deck they came from."""
    return [card_response(card) for card in list_all_cards(connection)]


@router.post("/api/cards/new-sentences")
def replace_sentences(
    chosen: CardIds,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    client: Annotated[LlmClient, Depends(get_llm_client)],
    tracker: Annotated[Tracker, Depends(get_tracker)],
) -> list[CardResponse]:
    """Ask the model for another sentence for each of the chosen cards, one after the other.

    A card the model gives no sentence for keeps its sentence and carries an `error`; the other cards get theirs.
    When a card does not exist, nothing changes. When the model is not set up, no card changes either.
    """
    ids = list(dict.fromkeys(chosen.card_ids))
    cards = [find_card(connection, card_id) for card_id in ids]
    errors: dict[int, str] = {}
    for card in cards:
        text = text_for_card(connection, card)
        try:
            result = ask_model(
                client,
                text,
                card,
                card["sentence"],
                meanings_of_word(connection, card["word"], card["id"], pair_of(card)),
            )
            check_phrase_is_free(connection, card["word"], result.phrase, card["id"], pair_of(card))
        except LlmNotConfigured as error:
            raise HTTPException(status_code=503, detail=str(error)) from None
        except (LlmError, CardExists) as error:
            errors[card["id"]] = str(error)
            continue
        update_card(connection, card["id"], **new_sentence_fields(card, result))
    if len(ids) > len(errors):
        tracker.record("sentence_replaced", how="new_sentence", cards=len(ids) - len(errors))
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


@router.post("/api/cards/decks")
def change_decks_of_cards(
    chosen: CardDecks, connection: Annotated[sqlite3.Connection, Depends(get_connection)]
) -> list[CardResponse]:
    """Put the chosen cards in decks and take them out of others, in one step (FR-020). A card keeps its sentence and its
    study data. When a card or a deck does not exist (404), or a deck to add is for another language pair (422), nothing
    changes."""
    try:
        done = change_card_decks(
            connection, chosen.card_ids, chosen.add_deck_ids, chosen.remove_deck_ids
        )
    except UnknownDeck as error:
        raise HTTPException(status_code=404, detail=str(error)) from None
    except (DeckPairMismatch, UncategorizedDeck) as error:
        raise HTTPException(status_code=422, detail=str(error)) from None
    if not done:
        raise HTTPException(status_code=404, detail="There is no card with one of these ids.")
    ids = list(dict.fromkeys(chosen.card_ids))
    return [card_response(get_card(connection, card_id)) for card_id in ids]


@router.post("/api/cards/delete", status_code=204)
def remove_cards(
    chosen: CardIds, connection: Annotated[sqlite3.Connection, Depends(get_connection)]
) -> Response:
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
    tracker: Annotated[Tracker, Depends(get_tracker)],
) -> CardResponse:
    """Edit the sentence, the translation or the phrase, lock the translation, set the flag, or hide the card.

    The phrase identifies the card with its word (DEC-013): a phrase that is not 2 to 6 words with the word in them is
    refused with 422, and one that another card for the word already has with 409, and nothing changes.

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
    for name in ("sentence", "translation", "phrase"):
        if name in fields and fields[name] == card[name]:
            del fields[name]
    if "phrase" in fields:
        fields["phrase"] = " ".join(fields["phrase"].split())
        problem = phrase_problem(card["word"], fields["phrase"])
        if problem:
            raise HTTPException(status_code=422, detail=problem)
        try:
            check_phrase_is_free(connection, card["word"], fields["phrase"], card_id, pair_of(card))
        except CardExists as error:
            raise HTTPException(status_code=409, detail=str(error)) from None
    locked = bool(fields.get("translation_locked", card["translation_locked"]))
    if locked and not (fields.get("translation") or card["translation"]):
        raise HTTPException(
            status_code=422,
            detail="A card without a translation cannot have its translation locked.",
        )
    if "sentence" in fields and "translation" not in fields and not locked:
        text = text_for_card(connection, card)
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
    if "sentence" in fields:
        tracker.record("sentence_replaced", how="edited", cards=1)
    return card_response(get_card(connection, card_id))


@router.post("/api/cards/{card_id}/new-sentence")
def replace_sentence(
    card_id: int,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    client: Annotated[LlmClient, Depends(get_llm_client)],
    tracker: Annotated[Tracker, Depends(get_tracker)],
) -> CardResponse:
    """Ask the model for another sentence for the card's word, and its translation, unless the translation is locked.

    A locked translation stays, and the model writes a sentence that means the same. When the model does not answer,
    the card stays as it is.
    """
    card = find_card(connection, card_id)
    text = text_for_card(connection, card)
    try:
        result = ask_model(
            client,
            text,
            card,
            card["sentence"],
            meanings_of_word(connection, card["word"], card_id, pair_of(card)),
        )
        check_phrase_is_free(connection, card["word"], result.phrase, card_id, pair_of(card))
    except LlmNotConfigured as error:
        raise HTTPException(status_code=503, detail=str(error)) from None
    except CardExists as error:
        raise HTTPException(status_code=409, detail=str(error)) from None
    except LlmError as error:
        raise HTTPException(status_code=502, detail=str(error)) from None
    update_card(connection, card_id, **new_sentence_fields(card, result))
    tracker.record("sentence_replaced", how="new_sentence", cards=1)
    return card_response(get_card(connection, card_id))


@router.delete("/api/cards/{card_id}", status_code=204)
def remove_card(
    card_id: int, connection: Annotated[sqlite3.Connection, Depends(get_connection)]
) -> Response:
    """Delete one card. The other cards, and the decks it was in, stay."""
    if not delete_card(connection, card_id):
        raise HTTPException(status_code=404, detail="There is no card with this id.")
    return Response(status_code=204)
