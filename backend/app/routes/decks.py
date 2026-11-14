"""The API calls that list and make decks (DEC-020): named groups of cards for one language pair."""

import sqlite3
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, model_validator

from app.database import (
    DeckExists,
    DeckNeedsChoice,
    InvalidDeckTitle,
    UncategorizedDeck,
    create_deck,
    delete_deck,
    get_connection,
    get_deck_for_deleting,
    list_decks,
    rename_deck,
)

router = APIRouter()

# The same three languages as `app.llm.Language`; kept here so this task does not depend on that one.
Language = Literal["ru", "en", "de"]


class DeckRequest(BaseModel):
    title: str
    text_language: Language
    first_language: Language

    @model_validator(mode="after")
    def languages_differ(self) -> "DeckRequest":
        """A deck holds cards of a text language that is not the learner's first language."""
        if self.text_language == self.first_language:
            raise ValueError("The text language and the first language must be different.")
        return self


class DeckResponse(BaseModel):
    id: int
    title: str
    text_language: Language
    first_language: Language
    card_count: int
    learned_percent: int = 0
    # The deck that holds the cards that are in no other deck (DEC-065): it cannot be renamed.
    uncategorized: bool = False


class DeckDetail(DeckResponse):
    """A deck with what the learner needs to know before deleting it."""

    cards_only_here: int
    cards_elsewhere: int


class DeckChange(BaseModel):
    title: str


@router.get("/api/decks")
def read_decks(
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    text_language: Language | None = None,
    first_language: Language | None = None,
) -> list[DeckResponse]:
    """The decks with their number of cards, newest first. With both languages, only the decks of that pair."""
    return [DeckResponse(**deck) for deck in list_decks(connection, text_language, first_language)]


@router.post("/api/decks", status_code=201)
def make_deck(
    request: DeckRequest, connection: Annotated[sqlite3.Connection, Depends(get_connection)]
) -> DeckResponse:
    """Make an empty deck. A title of 1 to 60 characters is needed (422), and it is free for the language pair, whatever
    the case of the letters (409)."""
    try:
        deck = create_deck(connection, request.title, request.text_language, request.first_language)
    except InvalidDeckTitle as error:
        raise HTTPException(status_code=422, detail=str(error)) from None
    except DeckExists as error:
        raise HTTPException(status_code=409, detail=str(error)) from None
    return DeckResponse(**deck)


@router.get("/api/decks/{deck_id}")
def read_deck(
    deck_id: int, connection: Annotated[sqlite3.Connection, Depends(get_connection)]
) -> DeckDetail:
    """One deck, with how many of its cards are only in it and how many are also in another deck (404 when it does not
    exist)."""
    deck = get_deck_for_deleting(connection, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="There is no deck with this id.")
    return DeckDetail(**deck)


@router.patch("/api/decks/{deck_id}")
def change_deck(
    deck_id: int,
    request: DeckChange,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
) -> DeckResponse:
    """Rename a deck with the rules of a new deck's title: 1 to 60 characters (422), free for the language pair whatever
    the case of the letters (409). The deck Uncategorized cannot be renamed (422), and a deck that does not exist is 404."""
    try:
        deck = rename_deck(connection, deck_id, request.title)
    except (InvalidDeckTitle, UncategorizedDeck) as error:
        raise HTTPException(status_code=422, detail=str(error)) from None
    except DeckExists as error:
        raise HTTPException(status_code=409, detail=str(error)) from None
    if deck is None:
        raise HTTPException(status_code=404, detail="There is no deck with this id.")
    return DeckResponse(**deck)


@router.delete("/api/decks/{deck_id}", status_code=204)
def remove_deck(
    deck_id: int,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    cards: Literal["delete", "keep"] | None = None,
) -> None:
    """Delete a deck (DEC-065). The cards that are also in another deck stay in it. The cards only in this deck are
    deleted with `cards=delete` or kept in the deck Uncategorized of their language pair with `cards=keep`; without a
    choice, when there are such cards, nothing changes (422). The deck Uncategorized can only be deleted with its cards."""
    try:
        deleted = delete_deck(connection, deck_id, cards)
    except DeckNeedsChoice as error:
        raise HTTPException(status_code=422, detail=str(error)) from None
    if not deleted:
        raise HTTPException(status_code=404, detail="There is no deck with this id.")
