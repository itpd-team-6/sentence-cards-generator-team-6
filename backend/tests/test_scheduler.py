import sqlite3
from datetime import date

from app.database import add_card, connect, get_card, init_db, save_text
from app.scheduler import LONGEST_INTERVAL, answer_card, next_review

TODAY = date(2026, 10, 16)


def open_database() -> sqlite3.Connection:
    connection = connect()
    init_db(connection)
    return connection


def new_card(connection: sqlite3.Connection) -> int:
    text_id = save_text(connection, "Ich warte am Bahnhof.", "de", "en", ["Bahnhof"])
    return add_card(connection, text_id, "Bahnhof", "Ich warte am Bahnhof.", "I wait at the station.", TODAY)


def test_a_new_card_is_due_today_with_no_interval() -> None:
    connection = open_database()

    card = get_card(connection, new_card(connection))

    assert card["due_date"] == "2026-10-16"
    assert card["interval_days"] == 0


def test_a_remembered_card_is_due_later_than_today() -> None:
    interval, due = next_review(0, remembered=True, today=TODAY)

    assert interval == 1
    assert due == date(2026, 10, 17)


def test_each_remembered_answer_puts_the_card_further_away_than_the_last() -> None:
    interval, due, dues = 0, TODAY, []
    for _ in range(5):
        interval, due = next_review(interval, remembered=True, today=TODAY)
        dues.append(due)

    assert [(due - TODAY).days for due in dues] == [1, 2, 4, 8, 16]


def test_the_wait_never_goes_past_the_longest_interval() -> None:
    interval, waits = 0, []
    for _ in range(12):
        interval, due = next_review(interval, remembered=True, today=TODAY)
        waits.append(interval)

    assert waits == [1, 2, 4, 8, 16, 32, 64, 128, 256, 365, 365, 365]
    assert max(waits) == LONGEST_INTERVAL
    assert next_review(LONGEST_INTERVAL, remembered=True, today=TODAY)[1] == date(2027, 10, 16)


def test_a_forgotten_card_stays_due_today_and_starts_over() -> None:
    interval, due = next_review(8, remembered=False, today=TODAY)

    assert (interval, due) == (0, TODAY)
    assert next_review(interval, remembered=True, today=TODAY)[0] == 1


def test_an_answer_is_kept_in_the_database() -> None:
    connection = open_database()
    card_id = new_card(connection)

    answer_card(connection, card_id, remembered=True, today=TODAY)
    card = answer_card(connection, card_id, remembered=True, today=date(2026, 10, 17))

    assert card["interval_days"] == 2
    assert card["due_date"] == "2026-10-19"
    assert get_card(connection, card_id) == card


def test_a_forgotten_answer_makes_the_card_due_again_today() -> None:
    connection = open_database()
    card_id = new_card(connection)
    answer_card(connection, card_id, remembered=True, today=TODAY)

    card = answer_card(connection, card_id, remembered=False, today=date(2026, 10, 17))

    assert card["due_date"] == "2026-10-17"
    assert card["interval_days"] == 0


def test_an_unknown_card_cannot_be_answered() -> None:
    assert answer_card(open_database(), 99, remembered=True, today=TODAY) is None


def test_a_database_made_before_intervals_existed_keeps_its_cards() -> None:
    connection = connect()
    connection.executescript(
        """
        CREATE TABLE texts (id INTEGER PRIMARY KEY, text TEXT NOT NULL, text_language TEXT NOT NULL, first_language TEXT NOT NULL);
        CREATE TABLE marked_words (id INTEGER PRIMARY KEY, text_id INTEGER NOT NULL, word TEXT NOT NULL, UNIQUE (text_id, word));
        CREATE TABLE cards (id INTEGER PRIMARY KEY, text_id INTEGER NOT NULL, word TEXT NOT NULL, sentence TEXT, translation TEXT,
                            flagged INTEGER NOT NULL DEFAULT 0, due_date TEXT NOT NULL);
        INSERT INTO texts VALUES (1, 'Ich warte.', 'de', 'en');
        INSERT INTO cards (id, text_id, word, due_date) VALUES (1, 1, 'warte', '2026-10-16');
        """
    )

    init_db(connection)

    assert get_card(connection, 1)["interval_days"] == 0
