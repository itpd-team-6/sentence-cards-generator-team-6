"""The API calls that save a text with the words the learner marked, list the texts, change them and delete them."""

import sqlite3
from typing import Annotated, Literal

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
    TEXT_LENGTH,
    TEXT_TITLE_LENGTH,
    InvalidText,
    InvalidTextTitle,
    MarkNotInText,
    UnknownText,
    delete_text,
    get_connection,
    get_text,
    list_texts,
    save_text,
    update_text,
)

router = APIRouter()

# The same three languages as `app.llm.Language`; kept here so this task does not depend on that one.
Language = Literal["ru", "en", "de"]

Word = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
Title = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=TEXT_TITLE_LENGTH)
]
Body = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


def check_length(text: str | None) -> str | None:
    """A text over the maximum is refused with a message that says the maximum (FR-019)."""
    if text is not None and len(text) > TEXT_LENGTH:
        raise ValueError(f"The text can have at most {TEXT_LENGTH:,} characters.")
    return text


def marks_appear_once(words: list[str] | None) -> list[str] | None:
    """Each marked word is kept once, in the order the learner marked it.

    A marked item may be several words chosen as one card ("stimmt zu"); the spaces between its words are
    made one space, so the same words chosen twice are the same item.
    """
    if words is None:
        return None
    return list(dict.fromkeys(" ".join(word.split()) for word in words))


class TextRequest(BaseModel):
    title: Title | None = None
    text: Body
    text_language: Language
    first_language: Language
    words: list[Word] = Field(min_length=1)

    @model_validator(mode="after")
    def languages_differ(self) -> "TextRequest":
        """A text is turned into cards in another language than its own."""
        if self.text_language == self.first_language:
            raise ValueError("The text language and the first language must be different.")
        return self

    @field_validator("text")
    @classmethod
    def text_is_not_too_long(cls, text: str) -> str:
        return check_length(text)

    @field_validator("words")
    @classmethod
    def words_appear_once(cls, words: list[str]) -> list[str]:
        return marks_appear_once(words)


class MarkCard(BaseModel):
    """The card a marked word points to."""

    id: int
    sentence: str | None
    translation: str | None


class MarkedWord(BaseModel):
    """A marked word of a text with its card, or with no card yet."""

    word: str
    card: MarkCard | None


class TextResponse(BaseModel):
    id: int
    title: str
    text: str
    text_language: Language
    first_language: Language
    words: list[str]
    # The marked words that have a card, and how many cards the text has (a card may come from several texts).
    words_with_cards: list[str]
    marks: list[MarkedWord]
    cards: int


class TextSummary(BaseModel):
    """A text in the list: what the learner needs to choose one, without the text itself."""

    id: int
    title: str
    text_language: Language
    first_language: Language
    words: list[str]
    words_with_cards: list[str]
    marks: list[MarkedWord]
    cards: int


class TextChange(BaseModel):
    """What the learner changes on a text. Only the fields that are sent change.

    `words` is the whole list of marked words the text keeps; it may be empty.
    """

    model_config = ConfigDict(extra="forbid")

    title: Title | None = None
    text: Body | None = None
    words: list[Word] | None = None

    @field_validator("text")
    @classmethod
    def text_is_not_too_long(cls, text: str | None) -> str | None:
        return check_length(text)

    @field_validator("words")
    @classmethod
    def words_appear_once(cls, words: list[str] | None) -> list[str] | None:
        return marks_appear_once(words)


class ChangedText(TextResponse):
    # The marks the new text took away because their words are no longer in it. The cards are untouched.
    lost_marks: list[str]


@router.post("/api/texts", status_code=201)
def create_text(
    request: TextRequest,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    tracker: Annotated[Tracker, Depends(get_tracker)],
) -> TextResponse:
    """Save a text with its marked words. A request with no marked word is refused with 422."""
    text_id = save_text(
        connection,
        request.text,
        request.text_language,
        request.first_language,
        request.words,
        request.title,
    )
    tracker.record(
        "text_saved",
        text_language=request.text_language,
        first_language=request.first_language,
        words_marked=len(request.words),
    )
    return TextResponse(**get_text(connection, text_id))


@router.get("/api/texts/{text_id}")
def read_text(
    text_id: int, connection: Annotated[sqlite3.Connection, Depends(get_connection)]
) -> TextResponse:
    text = get_text(connection, text_id)
    if text is None:
        raise HTTPException(status_code=404, detail="There is no text with this id.")
    return TextResponse(**text)


@router.get("/api/texts")
def read_texts(
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
) -> list[TextSummary]:
    """Every text the learner saved, the newest first."""
    return [TextSummary(**text) for text in list_texts(connection)]


@router.patch("/api/texts/{text_id}")
def change_text(
    text_id: int,
    change: TextChange,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
) -> ChangedText:
    """Change the title, the text or the marked words. Cards are never touched (DEC-064)."""
    try:
        lost = update_text(
            connection,
            text_id,
            **{field: getattr(change, field) for field in change.model_fields_set},
        )
    except UnknownText:
        raise HTTPException(status_code=404, detail="There is no text with this id.") from None
    except (InvalidTextTitle, InvalidText):
        raise HTTPException(
            status_code=422,
            detail=f"The title needs 1 to {TEXT_TITLE_LENGTH} characters and the text 1 to {TEXT_LENGTH:,}.",
        ) from None
    except MarkNotInText as error:
        raise HTTPException(
            status_code=422, detail=f'"{error.args[0]}" is not in the text, so it cannot be marked.'
        ) from None
    return ChangedText(**get_text(connection, text_id), lost_marks=lost)


@router.delete("/api/texts/{text_id}", status_code=204)
def remove_text(
    text_id: int, connection: Annotated[sqlite3.Connection, Depends(get_connection)]
) -> Response:
    """Delete a text and its marks. Its cards, their decks and their study data stay (DEC-064)."""
    if not delete_text(connection, text_id):
        raise HTTPException(status_code=404, detail="There is no text with this id.")
    return Response(status_code=204)
