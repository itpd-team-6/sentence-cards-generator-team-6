import sqlite3
from datetime import date

import pytest
from fastapi.testclient import TestClient

from app.database import (
    add_card,
    connect,
    database_file,
    delete_card,
    get_card,
    get_text,
    init_db,
    list_cards,
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
