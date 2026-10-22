"""The API calls of the study session: the cards that are due, and the learner's answer to a card."""

import sqlite3
from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.database import InvalidMove, QueueOutOfDate, get_connection, list_due_cards, list_queue, reorder_queue
from app.routes.cards import get_today
from app.scheduler import Answer, answer_card, forecast

router = APIRouter()


class StudyCard(BaseModel):
    id: int
    text_id: int
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


class QueueCard(StudyCard):
    due_today: bool


class QueueOrder(BaseModel):
    """The whole queue in the order the learner wants it, the cards the learner moved to get that order, and how many
    cards at the start of the order are due today."""

    card_ids: list[int] = Field(min_length=1)
    moved: list[int] = Field(min_length=1)
    today_count: int = Field(ge=0)


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
) -> list[DueCard]:
    """The cards due today or earlier, in the order they are studied, each with the wait that every answer would give
    it. The list is empty when nothing is due."""
    return [
        DueCard(
            **card,
            forecast={
                answer: Forecast(interval_days=interval, due_date=due.isoformat())
                for answer, (interval, due) in forecast(card["interval_days"], today).items()
            },
        )
        for card in list_due_cards(connection, today)
    ]


def queue_response(connection: sqlite3.Connection, today: date) -> list[QueueCard]:
    return [QueueCard(**card, due_today=card["due_date"] <= today.isoformat()) for card in list_queue(connection)]


@router.get("/api/study/queue")
def study_queue(
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    today: Annotated[date, Depends(get_today)],
) -> list[QueueCard]:
    """Every card with a sentence to show, in the order they are studied: the ones due today first, then the ones
    due later, each with its date."""
    return queue_response(connection, today)


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
        reorder_queue(connection, order.card_ids, order.moved, order.today_count, today)
    except QueueOutOfDate:
        raise HTTPException(
            status_code=409, detail="The cards have changed. Reload the list and move the cards again."
        ) from None
    except InvalidMove as error:
        raise HTTPException(status_code=422, detail=str(error)) from None
    return queue_response(connection, today)


@router.post("/api/cards/{card_id}/answer")
def answer(
    card_id: int,
    body: AnswerBody,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    today: Annotated[date, Depends(get_today)],
) -> AnsweredCard:
    """Record the learner's answer, one of "again", "hard", "good" and "easy". The scheduler sets the next due date:
    today again for "again", and later than today for the others."""
    card = answer_card(connection, card_id, body.answer, today)
    if card is None:
        raise HTTPException(status_code=404, detail="There is no card with this id.")
    return AnsweredCard(**card)
