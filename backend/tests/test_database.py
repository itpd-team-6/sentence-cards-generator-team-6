import sqlite3
from datetime import date

import pytest
from fastapi.testclient import TestClient

from app import database
from app.database import (
    MIGRATIONS,
    add_card,
    connect,
    database_file,
    database_version,
    delete_card,
    get_card,
    get_text,
    init_db,
    list_cards,
    list_due_cards,
    save_text,
    update_card,
)
from app.main import app

TODAY = date(2026, 10, 16)


def open_database() -> sqlite3.Connection:
    connection = connect()
    init_db(connection)
    return connection


def test_the_database_file_is_created_when_the_product_starts() -> None:
    assert not database_file().exists()

    with TestClient(app):
        assert database_file().exists()


def test_a_relative_path_is_kept_inside_the_repository(monkeypatch) -> None:
    monkeypatch.setenv("DATABASE_PATH", "data/cards.db")

    assert database_file().name == "cards.db"
    assert database_file().parent.name == "data"
    assert database_file().is_absolute()


def test_a_saved_text_with_its_words_and_cards_survives_a_restart() -> None:
    connection = open_database()
    text_id = save_text(connection, "Das Haus ist groß.", "de", "en", ["Haus", "groß"])
    card_id = add_card(connection, text_id, "Haus", "Das Haus ist alt.", "The house is old.", TODAY)
    connection.close()

    reopened = open_database()

    assert get_text(reopened, text_id) == {
        "id": text_id,
        "text": "Das Haus ist groß.",
        "text_language": "de",
        "first_language": "en",
        "words": ["Haus", "groß"],
    }
    assert get_card(reopened, card_id) == {
        "id": card_id,
        "text_id": text_id,
        "word": "Haus",
        "sentence": "Das Haus ist alt.",
        "translation": "The house is old.",
        "flagged": 0,
        "due_date": "2026-10-16",
        "due_at": "2026-10-16T00:00:00.001000",
        "interval_days": 0,
    }


def test_a_new_card_is_due_on_the_day_it_is_added() -> None:
    connection = open_database()
    text_id = save_text(connection, "Hallo", "de", "en", ["Hallo"])

    card_id = add_card(connection, text_id, "Hallo", None, None, TODAY)

    assert get_card(connection, card_id)["due_date"] == "2026-10-16"
    assert get_card(connection, card_id)["sentence"] is None


def test_updating_a_card_changes_only_that_card() -> None:
    connection = open_database()
    text_id = save_text(connection, "Das Haus ist groß.", "de", "en", ["Haus", "groß"])
    first = add_card(connection, text_id, "Haus", "Das Haus ist alt.", "The house is old.", TODAY)
    second = add_card(connection, text_id, "groß", "Der Hund ist groß.", "The dog is big.", TODAY)

    changed = update_card(connection, first, sentence="Das Haus ist neu.", flagged=1)

    assert changed
    assert get_card(connection, first)["sentence"] == "Das Haus ist neu."
    assert get_card(connection, first)["flagged"] == 1
    assert get_card(connection, second)["sentence"] == "Der Hund ist groß."
    assert get_card(connection, second)["flagged"] == 0


def test_the_changes_survive_a_restart() -> None:
    connection = open_database()
    text_id = save_text(connection, "Hallo", "de", "en", ["Hallo"])
    card_id = add_card(connection, text_id, "Hallo", "Hallo, wie geht's?", "Hello, how are you?", TODAY)
    update_card(connection, card_id, sentence="Hallo zusammen!")
    connection.close()

    assert get_card(open_database(), card_id)["sentence"] == "Hallo zusammen!"


def test_deleting_a_card_removes_only_that_card() -> None:
    connection = open_database()
    text_id = save_text(connection, "Das Haus ist groß.", "de", "en", ["Haus", "groß"])
    first = add_card(connection, text_id, "Haus", "Das Haus ist alt.", "The house is old.", TODAY)
    second = add_card(connection, text_id, "groß", "Der Hund ist groß.", "The dog is big.", TODAY)

    assert delete_card(connection, first)

    assert get_card(connection, first) is None
    assert [card["id"] for card in list_cards(connection, text_id)] == [second]
    assert not delete_card(connection, first)


def test_a_card_field_that_does_not_exist_is_refused() -> None:
    connection = open_database()
    text_id = save_text(connection, "Hallo", "de", "en", ["Hallo"])
    card_id = add_card(connection, text_id, "Hallo", None, None, TODAY)

    with pytest.raises(ValueError):
        update_card(connection, card_id, word="Tschüss")


TABLES = {"texts", "marked_words", "cards"}

# The tables of release `v0.1.0`, made by hand: the database file of a learner who installed it has them and no version.
RELEASED_TABLES = """
CREATE TABLE texts (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    text_language TEXT NOT NULL,
    first_language TEXT NOT NULL
);
CREATE TABLE marked_words (
    id INTEGER PRIMARY KEY,
    text_id INTEGER NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    UNIQUE (text_id, word)
);
CREATE TABLE cards (
    id INTEGER PRIMARY KEY,
    text_id INTEGER NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    sentence TEXT,
    translation TEXT,
    flagged INTEGER NOT NULL DEFAULT 0,
    due_date TEXT NOT NULL,
    interval_days INTEGER NOT NULL DEFAULT 0
);
INSERT INTO texts VALUES (1, 'Das Haus ist alt.', 'de', 'en');
INSERT INTO marked_words VALUES (1, 1, 'Haus');
INSERT INTO cards VALUES (1, 1, 'Haus', 'Das Haus ist alt.', 'The house is old.', 1, '2026-10-20', 4);
"""


def get_card_before(connection: sqlite3.Connection, card_id: int) -> str:
    """The due date of a card in a database that has not been migrated yet."""
    return connection.execute("SELECT due_date FROM cards WHERE id = ?", (card_id,)).fetchone()["due_date"]


def table_names(connection: sqlite3.Connection) -> set[str]:
    rows = connection.execute("SELECT name FROM sqlite_master WHERE type = 'table'")
    return {row["name"] for row in rows}


def test_a_database_that_does_not_exist_gets_the_tables_of_the_latest_version() -> None:
    connection = connect()

    init_db(connection)

    assert TABLES <= table_names(connection)
    assert database_version(connection) == len(MIGRATIONS)


def test_a_database_made_by_the_released_version_keeps_its_texts_and_cards() -> None:
    connection = connect()
    connection.executescript(RELEASED_TABLES)
    assert database_version(connection) == 0

    init_db(connection)

    assert database_version(connection) == len(MIGRATIONS)
    assert get_text(connection, 1)["words"] == ["Haus"]
    assert get_card(connection, 1) == {
        "id": 1,
        "text_id": 1,
        "word": "Haus",
        "sentence": "Das Haus ist alt.",
        "translation": "The house is old.",
        "flagged": 1,
        "due_date": "2026-10-20",
        "due_at": "2026-10-20T00:00:00.001000",
        "interval_days": 4,
    }


def test_a_database_made_by_the_released_version_keeps_the_order_of_its_study_list() -> None:
    connection = connect()
    connection.executescript(
        RELEASED_TABLES
        + """
        INSERT INTO cards VALUES (2, 1, 'alt', 'Das Haus ist alt.', 'The house is old.', 0, '2026-10-18', 1);
        INSERT INTO cards VALUES (3, 1, 'Das', 'Das Haus ist alt.', 'The house is old.', 0, '2026-10-18', 2);
        """
    )
    in_order_before = sorted([1, 2, 3], key=lambda card_id: (get_card_before(connection, card_id), card_id))

    init_db(connection)

    assert [card["id"] for card in list_due_cards(connection, date(2026, 10, 21))] == in_order_before == [2, 3, 1]
    assert get_card(connection, 2)["due_date"] == "2026-10-18"
    assert get_card(connection, 2)["due_at"] == "2026-10-18T00:00:00.002000"


def test_a_database_made_before_the_interval_existed_keeps_its_cards_with_an_interval_of_0() -> None:
    connection = connect()
    connection.executescript(
        RELEASED_TABLES.replace(",\n    interval_days INTEGER NOT NULL DEFAULT 0", "").replace(
            "'2026-10-20', 4)", "'2026-10-20')"
        )
    )

    init_db(connection)

    assert get_card(connection, 1)["interval_days"] == 0
    assert get_card(connection, 1)["sentence"] == "Das Haus ist alt."


def test_a_migration_does_not_run_a_second_time(monkeypatch) -> None:
    ran = []
    monkeypatch.setattr(database, "MIGRATIONS", [lambda connection: ran.append("first")])
    connection = connect()

    init_db(connection)
    init_db(connection)

    assert ran == ["first"]
    assert database_version(connection) == 1


def test_a_new_migration_runs_alone_on_a_database_that_is_up_to_date(monkeypatch) -> None:
    ran = []
    connection = connect()
    init_db(connection)
    version = database_version(connection)

    def add_a_column(connection: sqlite3.Connection) -> None:
        ran.append("add a column")
        connection.execute("ALTER TABLE cards ADD COLUMN phrase TEXT")

    monkeypatch.setattr(database, "MIGRATIONS", [*MIGRATIONS, add_a_column])
    init_db(connection)

    assert ran == ["add a column"]
    assert database_version(connection) == version + 1
    assert "phrase" in {row["name"] for row in connection.execute("PRAGMA table_info(cards)")}


def test_a_migration_that_fails_leaves_the_database_at_its_version(monkeypatch) -> None:
    connection = connect()
    init_db(connection)
    version = database_version(connection)

    def fail_after_a_change(connection: sqlite3.Connection) -> None:
        connection.execute("ALTER TABLE cards ADD COLUMN phrase TEXT")
        raise RuntimeError("stop")

    monkeypatch.setattr(database, "MIGRATIONS", [*MIGRATIONS, fail_after_a_change])
    with pytest.raises(RuntimeError):
        init_db(connection)

    assert database_version(connection) == version
    assert "phrase" not in {row["name"] for row in connection.execute("PRAGMA table_info(cards)")}


def test_two_cards_made_the_same_day_never_have_the_same_due_time() -> None:
    connection = open_database()
    text_id = save_text(connection, "Hallo Welt", "de", "en", ["Hallo", "Welt"])

    first = add_card(connection, text_id, "Hallo", None, None, TODAY)
    second = add_card(connection, text_id, "Welt", None, None, TODAY)

    assert get_card(connection, first)["due_at"] < get_card(connection, second)["due_at"]
