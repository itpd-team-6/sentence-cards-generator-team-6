"""The API calls that list and make decks (DEC-020): named groups of cards for one language pair."""

import sqlite3
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, model_validator

from app.database import (
    DeckExists,
    InvalidDeckTitle,
    create_deck,
    get_connection,
    list_decks,
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
