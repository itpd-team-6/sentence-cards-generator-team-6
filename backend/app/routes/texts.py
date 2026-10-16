"""The API calls that save a text with the words the learner marked."""

import sqlite3
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, StringConstraints, field_validator, model_validator

from app.database import get_connection, get_text, save_text

router = APIRouter()

# The same three languages as `app.llm.Language`; kept here so this task does not depend on that one.
Language = Literal["ru", "en", "de"]

Word = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class TextRequest(BaseModel):
    text: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
    text_language: Language
    first_language: Language
    words: list[Word] = Field(min_length=1)

    @model_validator(mode="after")
    def languages_differ(self) -> "TextRequest":
        """A text is turned into cards in another language than its own."""
        if self.text_language == self.first_language:
            raise ValueError("The text language and the first language must be different.")
        return self

    @field_validator("words")
    @classmethod
    def words_appear_once(cls, words: list[str]) -> list[str]:
        """Each marked word is kept once, in the order the learner marked it."""
        return list(dict.fromkeys(words))


class TextResponse(BaseModel):
    id: int
    text: str
    text_language: Language
    first_language: Language
    words: list[str]


@router.post("/api/texts", status_code=201)
def create_text(request: TextRequest, connection: Annotated[sqlite3.Connection, Depends(get_connection)]) -> TextResponse:
    """Save a text with its marked words. A request with no marked word is refused with 422."""
    text_id = save_text(connection, request.text, request.text_language, request.first_language, request.words)
    return TextResponse(**get_text(connection, text_id))


@router.get("/api/texts/{text_id}")
def read_text(text_id: int, connection: Annotated[sqlite3.Connection, Depends(get_connection)]) -> TextResponse:
    text = get_text(connection, text_id)
    if text is None:
        raise HTTPException(status_code=404, detail="There is no text with this id.")
    return TextResponse(**text)
