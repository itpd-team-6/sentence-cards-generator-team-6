import sqlite3
from datetime import date

from app.database import add_card, connect, get_card, init_db, save_text
from app.scheduler import LONGEST_INTERVAL, answer_card, forecast, next_review, waits

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


def test_a_new_or_forgotten_card_waits_today_1_2_or_4_days_for_the_four_answers() -> None:
    assert waits(0) == {"again": 0, "hard": 1, "good": 2, "easy": 4}


def test_the_waits_of_a_card_that_has_one_follow_the_rule_of_the_decision() -> None:
    rows = {1: (2, 3, 4), 2: (3, 4, 5), 4: (5, 8, 10), 8: (10, 16, 21), 16: (19, 32, 42)}

    for interval, (hard, good, easy) in rows.items():
        assert waits(interval) == {"again": 0, "hard": hard, "good": good, "easy": easy}


def test_each_answer_but_again_waits_longer_than_the_one_before_it_and_than_the_card_did() -> None:
    for interval in range(0, LONGEST_INTERVAL):
        wait = waits(interval)

        assert interval < wait["hard"] < wait["good"] < wait["easy"] or wait["easy"] == LONGEST_INTERVAL
        assert wait["hard"] > interval


def test_good_answers_again_and_again_double_the_wait_after_the_first_one() -> None:
    interval, waited = 0, []
    for _ in range(5):
        interval, _due = next_review(interval, "good", TODAY)
        waited.append(interval)

    assert waited == [2, 4, 8, 16, 32]


def test_the_wait_never_goes_past_the_longest_interval() -> None:
    interval, waited = 0, []
    for _ in range(12):
        interval, _due = next_review(interval, "good", TODAY)
        waited.append(interval)

    assert waited == [2, 4, 8, 16, 32, 64, 128, 256, 365, 365, 365, 365]
    assert all(wait <= LONGEST_INTERVAL for wait in waits(300).values())
    assert next_review(LONGEST_INTERVAL, "easy", TODAY)[1] == date(2027, 10, 16)


def test_an_again_answer_leaves_the_card_due_today_and_starts_its_wait_over() -> None:
    interval, due = next_review(8, "again", TODAY)

    assert (interval, due) == (0, TODAY)
    assert next_review(interval, "good", TODAY)[0] == 2


def test_the_forecast_gives_the_interval_and_the_date_of_each_answer() -> None:
    assert forecast(8, TODAY) == {
        "again": (0, date(2026, 10, 16)),
        "hard": (10, date(2026, 10, 26)),
        "good": (16, date(2026, 11, 1)),
        "easy": (21, date(2026, 11, 6)),
    }


def test_an_answer_is_kept_in_the_database() -> None:
    connection = open_database()
    card_id = new_card(connection)

    answer_card(connection, card_id, "good", today=TODAY)
    card = answer_card(connection, card_id, "good", today=date(2026, 10, 18))

    assert card["interval_days"] == 4
    assert card["due_date"] == "2026-10-22"
    assert card["due_at"] == "2026-10-22T00:00:00.001000"
    assert get_card(connection, card_id) == card


def test_an_again_answer_makes_the_card_due_again_today() -> None:
    connection = open_database()
    card_id = new_card(connection)
    answer_card(connection, card_id, "good", today=TODAY)

    card = answer_card(connection, card_id, "again", today=date(2026, 10, 18))

    assert card["due_date"] == "2026-10-18"
    assert card["interval_days"] == 0


def test_an_unknown_card_cannot_be_answered() -> None:
    assert answer_card(open_database(), 99, "good", today=TODAY) is None


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
