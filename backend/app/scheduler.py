"""The rule that sets when a card is due again, from the learner's answer.

The rule is the team's (DEC-029), made from the rule of Anki's SM-2 scheduler without its ease: the learner gives one of
four answers, and each gives a wait in days. "Again" brings the card back today and starts its wait over. For a card
that has a wait, "Hard" makes it 1.2 times longer, "Good" doubles it, and "Easy" makes the doubled wait 1.3 times
longer; each answer except "Again" is at least one day longer than the one before it, and no wait passes a year.
"""

import sqlite3
from datetime import date, timedelta
from typing import Literal, get_args

from app.database import default_due_time, get_card, update_card

Answer = Literal["again", "hard", "good", "easy"]
ANSWERS: tuple[Answer, ...] = get_args(Answer)

# The wait in days of a card that is new or was forgotten (its interval is 0), for each answer but "Again".
FIRST_WAITS = {"hard": 1, "good": 2, "easy": 4}

# The longest wait, in days. The studies we found test recall up to about one year (Cepeda et al., 2008),
# so a card is checked at least once a year instead of being trusted for longer than that.
LONGEST_INTERVAL = 365


def waits(interval_days: int) -> dict[Answer, int]:
    """The wait in days that each answer gives to a card that has `interval_days` (0 when it is new or was forgotten).

    The sums are in tenths, so that the half days are rounded up the same way on every machine.
    """
    if interval_days <= 0:
        hard, good, easy = FIRST_WAITS["hard"], FIRST_WAITS["good"], FIRST_WAITS["easy"]
    else:
        hard = max(interval_days + 1, (12 * interval_days + 5) // 10)
        good = max(hard + 1, 2 * interval_days)
        easy = max(good + 1, (26 * interval_days + 5) // 10)
    return {
        "again": 0,
        "hard": min(hard, LONGEST_INTERVAL),
        "good": min(good, LONGEST_INTERVAL),
        "easy": min(easy, LONGEST_INTERVAL),
    }


def next_review(interval_days: int, answer: Answer, today: date) -> tuple[int, date]:
    """The new interval in days and the new due date, after an answer given on `today`."""
    interval = waits(interval_days)[answer]
    return interval, today + timedelta(days=interval)


def forecast(interval_days: int, today: date) -> dict[Answer, tuple[int, date]]:
    """What each answer would give the card, so that the buttons can say when it comes back."""
    return {answer: next_review(interval_days, answer, today) for answer in ANSWERS}


def answer_card(connection: sqlite3.Connection, card_id: int, answer: Answer, today: date) -> dict | None:
    """Apply an answer to a card and keep the result. Returns the card, or None when it does not exist."""
    card = get_card(connection, card_id)
    if card is None:
        return None
    interval, due_date = next_review(card["interval_days"], answer, today)
    update_card(
        connection,
        card_id,
        interval_days=interval,
        due_date=due_date.isoformat(),
        due_at=default_due_time(due_date, card_id),
    )
    return get_card(connection, card_id)
