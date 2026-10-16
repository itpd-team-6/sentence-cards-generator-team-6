"""The API calls of the study session: the cards that are due, and the learner's answer to a card."""

import sqlite3
from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.database import get_connection, list_due_cards
from app.routes.cards import get_today
from app.scheduler import answer_card

router = APIRouter()


class StudyCard(BaseModel):
    id: int
    word: str
    sentence: str
    translation: str
    due_date: str


class Answer(BaseModel):
    remembered: bool


class AnsweredCard(BaseModel):
    id: int
    word: str
    due_date: str
    interval_days: int


@router.get("/api/study/due")
def due_cards(
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    today: Annotated[date, Depends(get_today)],
) -> list[StudyCard]:
    """The cards due today or earlier, oldest first. The list is empty when nothing is due."""
    return [StudyCard(**card) for card in list_due_cards(connection, today)]


@router.post("/api/cards/{card_id}/answer")
def answer(
    card_id: int,
    answer: Answer,
    connection: Annotated[sqlite3.Connection, Depends(get_connection)],
    today: Annotated[date, Depends(get_today)],
) -> AnsweredCard:
    """Record the learner's answer. The scheduler sets the next due date: later than today when remembered,
    today again when forgotten."""
    card = answer_card(connection, card_id, answer.remembered, today)
    if card is None:
        raise HTTPException(status_code=404, detail="There is no card with this id.")
    return AnsweredCard(**card)
