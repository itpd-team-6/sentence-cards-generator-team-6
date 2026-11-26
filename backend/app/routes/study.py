"""The API calls of the study session: the cards that are due, and the learner's answer to a card."""

import sqlite3
from datetime import date
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.analytics import Tracker, get_tracker
from app.database import (
    InvalidMove,
    QueueOutOfDate,
    get_connection,
    list_due_cards,
    list_queue,
    reorder_queue,
)
from app.routes.cards import DeckRef, get_today
from app.scheduler import Answer, answer_card, forecast, stage

router = APIRouter()


class StudyCard(BaseModel):
    id: int
    text_language: str
    first_language: str
    decks: list[DeckRef]
    word: str
    sentence: str
    translation: str
    due_date: str


class Forecast(BaseModel):
    """What an answer would give the card: the wait in days and the day it comes back."""

    interval_days: int
    due_date: str


class DueCard(StudyCard):
    """A card of the session, with what each of the four answers would do to it."""

    forecast: dict[Answer, Forecast]
    # "new" when the learner never answered the card, "forgotten" when the last answer was "again", "due" otherwise.
    stage: Literal["new", "forgotten", "due"]


class QueueCard(StudyCard):
    due_today: bool


class QueueOrder(BaseModel):
    """The whole queue in the order the learner wants it, the cards the learner moved to get that order, and how many
    cards at the start of the order are due today."""

    card_ids: list[int] = Field(min_length=1)
    moved: list[int] = Field(min_length=1)
    today_count: int = Field(ge=0)
    # The decks the learner has ticked; None is every deck. The order is the one for these decks' cards.
    deck_ids: list[int] | None = None


class AnswerBody(BaseModel):
    answer: Answer


class AnsweredCard(BaseModel):
    id: int
    word: str
    due_date: str
    interval_days: int


@router.get("/api/study/due")
def due_cards(
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    today: Annotated[date, Depends(get_today)],
    deck_ids: Annotated[list[int] | None, Query()] = None,
) -> list[DueCard]:
    """The cards due today or earlier, in the order they are studied, each with the wait that every answer would give
    it. The list is empty when nothing is due. With `deck_ids`, only the cards in at least one of those decks are
    listed, each once."""
    return [
        DueCard(
            **card,
            stage=stage(card["answers"], card["interval_days"]),
            forecast={
                answer: Forecast(interval_days=interval, due_date=due.isoformat())
                for answer, (interval, due) in forecast(card["interval_days"], today).items()
            },
        )
        for card in list_due_cards(connection, today, deck_ids)
    ]


def queue_response(
    connection: sqlite3.Connection, today: date, deck_ids: list[int] | None = None
) -> list[QueueCard]:
    return [
        QueueCard(**card, due_today=card["due_date"] <= today.isoformat())
        for card in list_queue(connection, deck_ids)
    ]


@router.get("/api/study/queue")
def study_queue(
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    today: Annotated[date, Depends(get_today)],
    deck_ids: Annotated[list[int] | None, Query()] = None,
) -> list[QueueCard]:
    """Every card with a sentence to show, in the order they are studied: the ones due today first, then the ones
    due later, each with its date. With `deck_ids`, only the cards in at least one of those decks, each once."""
    return queue_response(connection, today, deck_ids)


@router.post("/api/study/queue/order")
def save_queue_order(
    order: QueueOrder,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    today: Annotated[date, Depends(get_today)],
) -> list[QueueCard]:
    """Save the order the learner gave the queue and return the queue as it is now.

    Only the cards named in `moved` get new due times, between the cards next to them, and a new date when they
    changed from today to later or the reverse; the other cards keep theirs. When the cards in the queue are not the
    ones the learner saw (a card was answered or made meanwhile), nothing changes.
    """
    try:
        reorder_queue(
            connection, order.card_ids, order.moved, order.today_count, today, order.deck_ids
        )
    except QueueOutOfDate:
        raise HTTPException(
            status_code=409,
            detail="The cards have changed. Reload the list and move the cards again.",
        ) from None
    except InvalidMove as error:
        raise HTTPException(status_code=422, detail=str(error)) from None
    return queue_response(connection, today, order.deck_ids)


@router.post("/api/cards/{card_id}/answer")
def answer(
    card_id: int,
    body: AnswerBody,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    today: Annotated[date, Depends(get_today)],
    tracker: Annotated[Tracker, Depends(get_tracker)],
) -> AnsweredCard:
    """Record the learner's answer, one of "again", "hard", "good" and "easy". The scheduler sets the next due date:
    today again for "again", and later than today for the others."""
    card = answer_card(connection, card_id, body.answer, today)
    if card is None:
        raise HTTPException(status_code=404, detail="There is no card with this id.")
    tracker.record("card_answered", answer=body.answer)
    return AnsweredCard(**card)
