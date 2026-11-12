"""Keep the texts of the learner (FR-019, DEC-064): list, open, edit and delete a text, and show where a card comes from."""

import sqlite3
from datetime import date

import pytest
from fastapi.testclient import TestClient

from app import database
from app.database import (
    MIGRATIONS,
    TEXT_LENGTH,
    add_card,
    connect,
    get_card,
    init_db,
    list_all_cards,
    mark_is_in,
    save_text,
    title_from_text,
    words_of,
)
from app.main import app

TODAY = date(2026, 11, 12)
TEXT = {
    "text": "Heute fahre ich mit dem Zug nach Berlin. Sie stimmt meinem Plan zu.",
    "text_language": "de",
    "first_language": "en",
    "words": ["Zug", "stimmt zu"],
}


@pytest.fixture
def db() -> sqlite3.Connection:
    connection = connect()
    init_db(connection)
    return connection


def test_a_text_gets_a_title_made_from_its_first_words() -> None:
    assert (
        title_from_text("Heute fahre ich mit dem Zug nach Berlin.") == "Heute fahre ich mit dem Zug"
    )
    assert title_from_text("  Hallo\n\nWelt  ") == "Hallo Welt"
    assert (
        len(title_from_text("Donaudampfschifffahrtsgesellschaftskapitänsmützenabzeichen " * 3))
        <= 60
    )


def test_a_saved_text_has_a_title_and_the_title_can_be_given() -> None:
    with TestClient(app) as client:
        made = client.post("/api/texts", json=TEXT).json()
        given = client.post("/api/texts", json={**TEXT, "title": "  Der Zug  "}).json()

    assert made["title"] == "Heute fahre ich mit dem Zug"
    assert given["title"] == "Der Zug"


def test_a_database_with_earlier_texts_gives_each_one_a_title(monkeypatch) -> None:
    monkeypatch.setattr(database, "MIGRATIONS", MIGRATIONS[:-1])
    connection = connect()
    init_db(connection)
    connection.execute(
        "INSERT INTO texts (text, text_language, first_language) VALUES ('Das Haus ist alt und groß und schön.', 'de', 'en')"
    )
    connection.commit()
    connection.close()

    monkeypatch.setattr(database, "MIGRATIONS", MIGRATIONS)
    reopened = connect()
    init_db(reopened)

    row = reopened.execute("SELECT title FROM texts").fetchone()
    assert row["title"] == "Das Haus ist alt und groß"
    assert database.database_version(reopened) == len(MIGRATIONS)


def test_the_list_shows_each_text_with_its_marked_words_and_cards(db) -> None:
    first = save_text(db, "Ein Zug fährt.", "de", "en", ["Zug", "fährt"], "Der Zug")
    save_text(db, "A walk in the park.", "en", "ru", ["walk"], "A walk")
    add_card(db, first, "Zug", "Der Zug ist da.", "The train is here.", TODAY)

    with TestClient(app) as client:
        listed = client.get("/api/texts").json()

    assert [item["title"] for item in listed] == ["A walk", "Der Zug"]
    assert listed[1] == {
        "id": first,
        "title": "Der Zug",
        "text_language": "de",
        "first_language": "en",
        "words": ["Zug", "fährt"],
        "words_with_cards": ["Zug"],
        "marks": [
            {
                "word": "Zug",
                "card": {
                    "id": 1,
                    "sentence": "Der Zug ist da.",
                    "translation": "The train is here.",
                },
            },
            {"word": "fährt", "card": None},
        ],
        "cards": 1,
    }


def test_an_opened_text_returns_each_marked_word_with_its_card_or_with_no_card(db) -> None:
    text_id = save_text(db, "Ein Zug fährt am Bahnhof.", "de", "en", ["Zug", "Bahnhof"])
    card_id = add_card(db, text_id, "Zug", "Der Zug ist da.", "The train is here.", TODAY)

    with TestClient(app) as client:
        opened = client.get(f"/api/texts/{text_id}").json()

    assert opened["marks"] == [
        {
            "word": "Zug",
            "card": {
                "id": card_id,
                "sentence": "Der Zug ist da.",
                "translation": "The train is here.",
            },
        },
        {"word": "Bahnhof", "card": None},
    ]


def test_a_word_whose_card_was_deleted_is_a_mark_with_no_card(db) -> None:
    text_id = save_text(db, "Ein Zug fährt.", "de", "en", ["Zug"])
    card_id = add_card(db, text_id, "Zug", "Der Zug ist da.", "The train is here.", TODAY)
    db.execute("DELETE FROM cards WHERE id = ?", (card_id,))
    db.commit()

    assert database.get_text(db, text_id)["marks"] == [{"word": "Zug", "card": None}]


def test_the_list_has_the_newest_text_first_and_counts_cards_once() -> None:
    with TestClient(app) as client:
        client.post("/api/texts", json={**TEXT, "title": "Older"})
        client.post("/api/texts", json={**TEXT, "title": "Newer"})
        listed = client.get("/api/texts").json()

    assert [item["title"] for item in listed] == ["Newer", "Older"]
    assert listed[0]["cards"] == 0 and listed[0]["words"] == ["Zug", "stimmt zu"]


def test_a_text_longer_than_the_maximum_is_refused_and_the_message_says_the_maximum() -> None:
    with TestClient(app) as client:
        response = client.post("/api/texts", json={**TEXT, "text": "Zug " * TEXT_LENGTH})

        assert response.status_code == 422
        assert "at most 10,000 characters" in response.text
        assert client.get("/api/texts").json() == []


def test_a_text_of_exactly_the_maximum_is_saved() -> None:
    text = ("Zug " * TEXT_LENGTH)[:TEXT_LENGTH]
    with TestClient(app) as client:
        assert client.post("/api/texts", json={**TEXT, "text": text}).status_code == 201


def test_editing_the_title_and_the_text_keeps_the_cards_as_they_were(db) -> None:
    text_id = save_text(db, TEXT["text"], "de", "en", ["Zug"])
    card_id = add_card(db, text_id, "Zug", "Der Zug ist da.", "The train is here.", TODAY)
    database.update_card(db, card_id, interval_days=4, answers=2, flagged=1)
    before = get_card(db, card_id)

    database.update_text(db, text_id, title="Meine Reise", text="Der Zug fährt heute nach Berlin.")

    after = get_card(db, card_id)
    assert {key: after[key] for key in before if key != "texts"} == {
        key: before[key] for key in before if key != "texts"
    }
    assert after["texts"] == [{"id": text_id, "title": "Meine Reise"}]


def test_a_mark_whose_word_is_no_longer_in_the_text_is_removed_and_told(db) -> None:
    text_id = save_text(db, TEXT["text"], "de", "en", ["Zug", "Berlin"])
    add_card(db, text_id, "Zug", "Der Zug ist da.", "The train is here.", TODAY)
    add_card(db, text_id, "Berlin", "Berlin ist groß.", "Berlin is big.", TODAY)

    lost = database.update_text(db, text_id, text="Heute fahre ich mit dem Zug nach Hause.")

    assert lost == ["Berlin"]
    assert database.get_text(db, text_id)["words"] == ["Zug"]
    assert {card["word"] for card in list_all_cards(db)} == {"Zug", "Berlin"}
    berlin = next(card for card in list_all_cards(db) if card["word"] == "Berlin")
    assert berlin["texts"] == []


def test_a_mark_that_stays_keeps_its_card_when_the_case_of_the_letters_changes(db) -> None:
    text_id = save_text(db, "Der Zug fährt.", "de", "en", ["Zug"])
    card_id = add_card(db, text_id, "Zug", "Der Zug ist da.", "The train is here.", TODAY)

    database.update_text(db, text_id, text="der zug fährt.", words=["zug"])

    assert database.get_text(db, text_id)["words_with_cards"] == ["Zug"]
    assert get_card(db, card_id)["texts"] == [{"id": text_id, "title": "Der Zug fährt."}]


def test_a_mark_of_several_words_stays_while_its_words_are_in_the_text_in_order(db) -> None:
    text_id = save_text(db, TEXT["text"], "de", "en", ["stimmt zu"])

    assert database.update_text(db, text_id, text="Sie stimmt dem Plan sofort zu.") == []
    assert database.get_text(db, text_id)["words"] == ["stimmt zu"]

    assert database.update_text(db, text_id, text="Sie zu stimmt dem Plan.") == ["stimmt zu"]
    assert database.get_text(db, text_id)["words"] == []


def test_the_words_the_learner_keeps_are_the_marks_the_text_has(db) -> None:
    text_id = save_text(db, TEXT["text"], "de", "en", ["Zug", "Plan"])
    add_card(db, text_id, "Zug", "Der Zug ist da.", "The train is here.", TODAY)

    database.update_text(db, text_id, words=["Berlin", "Zug"])

    saved = database.get_text(db, text_id)
    assert saved["words"] == ["Zug", "Berlin"]
    assert saved["words_with_cards"] == ["Zug"]


def test_a_word_that_is_not_in_the_text_cannot_be_marked(db) -> None:
    text_id = save_text(db, TEXT["text"], "de", "en", ["Zug"])

    with pytest.raises(database.MarkNotInText):
        database.update_text(db, text_id, words=["Zug", "Flugzeug"])

    assert database.get_text(db, text_id)["words"] == ["Zug"]


def test_the_title_needs_one_to_sixty_characters() -> None:
    with TestClient(app) as client:
        text_id = client.post("/api/texts", json=TEXT).json()["id"]

        assert client.patch(f"/api/texts/{text_id}", json={"title": "   "}).status_code == 422
        assert client.patch(f"/api/texts/{text_id}", json={"title": "x" * 61}).status_code == 422
        changed = client.patch(f"/api/texts/{text_id}", json={"title": " Neu  Titel "})

        assert changed.status_code == 200
        assert changed.json()["title"] == "Neu Titel"


def test_a_change_names_the_marks_the_new_text_took_away() -> None:
    with TestClient(app) as client:
        text_id = client.post("/api/texts", json=TEXT).json()["id"]

        changed = client.patch(
            f"/api/texts/{text_id}", json={"text": "Heute fahre ich mit dem Zug."}
        )

        assert changed.status_code == 200
        assert changed.json()["lost_marks"] == ["stimmt zu"]
        assert changed.json()["words"] == ["Zug"]


def test_an_unknown_text_cannot_be_changed_or_deleted() -> None:
    with TestClient(app) as client:
        assert client.patch("/api/texts/99", json={"title": "x"}).status_code == 404
        assert client.delete("/api/texts/99").status_code == 404


def test_a_change_with_an_unknown_field_is_refused() -> None:
    with TestClient(app) as client:
        text_id = client.post("/api/texts", json=TEXT).json()["id"]

        assert (
            client.patch(f"/api/texts/{text_id}", json={"text_language": "en"}).status_code == 422
        )


def test_deleting_a_text_keeps_its_cards_their_decks_and_their_study_data(db) -> None:
    text_id = save_text(db, TEXT["text"], "de", "en", ["Zug"])
    deck_id = database.create_deck(db, "Travel", "de", "en")["id"]
    card_id = add_card(
        db, text_id, "Zug", "Der Zug ist da.", "The train is here.", TODAY, deck_ids=[deck_id]
    )
    database.update_card(db, card_id, interval_days=7, answers=3)

    assert database.delete_text(db, text_id) is True

    assert database.get_text(db, text_id) is None
    card = get_card(db, card_id)
    assert (card["interval_days"], card["answers"]) == (7, 3)
    assert card["decks"] == [{"id": deck_id, "title": "Travel"}]
    assert card["texts"] == []


def test_a_card_shows_each_text_that_still_has_its_word_and_none_when_no_text_has_it(db) -> None:
    first = save_text(db, "Der Zug fährt.", "de", "en", ["Zug"])
    second = save_text(db, "Ein Zug kommt an.", "de", "en", ["Zug"])
    card_id = add_card(db, first, "Zug", "Der Zug ist da.", "The train is here.", TODAY)
    database.link_word_to_card(db, second, "Zug", card_id)

    assert get_card(db, card_id)["texts"] == [
        {"id": second, "title": "Ein Zug kommt an."},
        {"id": first, "title": "Der Zug fährt."},
    ]

    database.delete_text(db, second)
    assert get_card(db, card_id)["texts"] == [{"id": first, "title": "Der Zug fährt."}]

    database.delete_text(db, first)
    assert get_card(db, card_id)["texts"] == []


def test_the_cards_of_the_api_carry_the_texts_they_come_from() -> None:
    with TestClient(app) as client:
        text_id = client.post("/api/texts", json={**TEXT, "title": "Der Zug"}).json()["id"]
        connection = connect()
        card_id = add_card(
            connection, text_id, "Zug", "Der Zug ist da.", "The train is here.", TODAY
        )

        listed = client.get("/api/cards").json()

    assert [card["id"] for card in listed] == [card_id]
    assert listed[0]["texts"] == [{"id": text_id, "title": "Der Zug"}]


@pytest.mark.parametrize(
    ("word", "text", "expected"),
    [
        ("Zug", "Der Zug fährt.", True),
        ("zug", "Der ZUG fährt.", True),
        ("Zu", "Der Zug fährt.", False),
        ("stimmt zu", "Sie stimmt dem Plan zu.", True),
        ("stimmt zu", "Sie zu stimmt.", False),
        ("l'homme", "Voilà l'homme!", True),
        ("Haus", "Das Hausdach ist neu.", False),
        ("Straße", "Die Straße ist lang.", True),
    ],
)
def test_a_mark_is_in_a_text_when_its_words_are_whole_words_in_order(
    word: str, text: str, expected: bool
) -> None:
    assert mark_is_in(word, words_of(text)) is expected
