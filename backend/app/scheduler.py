"""The rule that sets when a card is due again, from the learner's answer.

The rule is small and ours (DEC-002): a remembered card waits one day, and each further remembered
answer doubles the wait (1, 2, 4, 8 ... days) up to a year. A forgotten card is due again today and
starts over.
"""

import sqlite3
from datetime import date, timedelta

from app.database import get_card, update_card

SHORTEST_INTERVAL = 1  # days; a card that is new or was forgotten has an interval of 0 until it is remembered

# The longest wait, in days. The studies we found test recall up to about one year (Cepeda et al., 2008),
# so a card is checked at least once a year instead of being trusted for longer than that.
LONGEST_INTERVAL = 365


def next_review(interval_days: int, remembered: bool, today: date) -> tuple[int, date]:
    """The new interval in days and the new due date, after an answer given on `today`."""
    if not remembered:
        return 0, today
    interval = SHORTEST_INTERVAL if interval_days < SHORTEST_INTERVAL else min(interval_days * 2, LONGEST_INTERVAL)
    return interval, today + timedelta(days=interval)


def answer_card(connection: sqlite3.Connection, card_id: int, remembered: bool, today: date) -> dict | None:
    """Apply an answer to a card and keep the result. Returns the card, or None when it does not exist."""
    card = get_card(connection, card_id)
    if card is None:
        return None
    interval, due_date = next_review(card["interval_days"], remembered, today)
    update_card(connection, card_id, interval_days=interval, due_date=due_date.isoformat())
    return get_card(connection, card_id)
