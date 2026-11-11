import sqlite3
from datetime import date

import pytest
from fastapi.testclient import TestClient
from test_cards import TEXT, FakeModel, ask_for_cards

from app import database
from app.database import (
    MIGRATIONS,
    DeckPairMismatch,
    add_card,
    connect,
    create_deck,
    get_card,
    init_db,
    list_cards,
    list_decks,
    list_queue,
    reorder_queue,
    save_text,
)
from app.llm import get_llm_client
from app.main import app
from app.routes.cards import get_today

TODAY = date(2026, 10, 16)

# The tables of release v0.2.1 (migration 5), made by hand, with two texts and three cards.
VERSION_5_TABLES = """
CREATE TABLE texts (
    id INTEGER PRIMARY KEY, text TEXT NOT NULL, text_language TEXT NOT NULL, first_language TEXT NOT NULL
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
    interval_days INTEGER NOT NULL DEFAULT 0,
    due_at TEXT NOT NULL DEFAULT '',
    hidden INTEGER NOT NULL DEFAULT 0,
    translation_locked INTEGER NOT NULL DEFAULT 0,
    phrase TEXT
);
CREATE UNIQUE INDEX cards_word_phrase ON cards (word, phrase) WHERE phrase IS NOT NULL;
INSERT INTO texts VALUES (1, 'Der Zug kommt. Das Haus ist alt.', 'de', 'en');
INSERT INTO texts VALUES (2, 'The cat sleeps.', 'en', 'de');
INSERT INTO texts VALUES (3, 'Ein Text ohne Karten.', 'de', 'en');
INSERT INTO marked_words VALUES (1, 1, 'Zug');
INSERT INTO marked_words VALUES (2, 1, 'Haus');
INSERT INTO marked_words VALUES (3, 2, 'cat');
INSERT INTO marked_words VALUES (4, 3, 'Text');
INSERT INTO cards VALUES (1, 1, 'Zug', 'Der Zug kommt.', 'The train comes.', 1, '2026-10-20', 4,
                          '2026-10-20T00:00:00.001000', 1, 1, 'den Zug nehmen');
INSERT INTO cards VALUES (2, 1, 'Haus', 'Das Haus ist alt.', 'The house is old.', 0, '2026-10-16', 0,
                          '2026-10-16T00:00:00.002000', 0, 0, NULL);
INSERT INTO cards VALUES (3, 2, 'cat', 'The cat sleeps.', 'Die Katze schläft.', 0, '2026-10-16', 0,
                          '2026-10-16T00:00:00.003000', 0, 0, NULL);
"""


def database_at_version_5() -> sqlite3.Connection:
    connection = connect()
    connection.executescript(VERSION_5_TABLES)
    connection.execute("PRAGMA user_version = 5")
    return connection


def open_database() -> sqlite3.Connection:
    connection = connect()
    init_db(connection)
    return connection


def make_german_text(connection: sqlite3.Connection, words: list[str]) -> int:
    return save_text(connection, "Der Zug kommt. Das Haus ist alt.", "de", "en", words)


# --- The migration of a database that has cards but no decks ---------------------------------------------------


def test_the_migration_keeps_every_card_with_its_languages_and_its_study_data() -> None:
    connection = database_at_version_5()

    init_db(connection)

    zug = get_card(connection, 1)
    assert (zug["text_language"], zug["first_language"]) == ("de", "en")
    assert (zug["sentence"], zug["translation"], zug["phrase"]) == (
        "Der Zug kommt.",
        "The train comes.",
        "den Zug nehmen",
    )
    assert (zug["flagged"], zug["hidden"], zug["translation_locked"]) == (1, 1, 1)
    assert (zug["due_date"], zug["due_at"], zug["interval_days"]) == (
        "2026-10-20",
        "2026-10-20T00:00:00.001000",
        4,
    )
    cat = get_card(connection, 3)
    assert (cat["text_language"], cat["first_language"]) == ("en", "de")
    assert "text_id" not in zug


def test_the_migration_puts_the_cards_that_exist_in_one_deck_for_each_language_pair() -> None:
    connection = database_at_version_5()

    init_db(connection)

    decks = {(d["text_language"], d["first_language"]): d for d in list_decks(connection)}
    assert sorted(decks) == [("de", "en"), ("en", "de")]
    assert {deck["title"] for deck in decks.values()} == {"Earlier cards"}
    assert decks[("de", "en")]["card_count"] == 2
    assert decks[("en", "de")]["card_count"] == 1
    assert [d["id"] for d in get_card(connection, 1)["decks"]] == [decks[("de", "en")]["id"]]
    assert [d["id"] for d in get_card(connection, 2)["decks"]] == [decks[("de", "en")]["id"]]
    assert [d["id"] for d in get_card(connection, 3)["decks"]] == [decks[("en", "de")]["id"]]


def test_the_migration_makes_no_deck_for_a_language_pair_without_cards() -> None:
    connection = database_at_version_5()
    connection.execute("DELETE FROM cards WHERE id = 3")
    connection.commit()

    init_db(connection)

    assert [(d["text_language"], d["first_language"]) for d in list_decks(connection)] == [
        ("de", "en")
    ]


def test_a_database_without_cards_gets_no_deck() -> None:
    connection = connect()

    init_db(connection)

    assert list_decks(connection) == []


def test_the_migration_keeps_the_cards_of_each_text_on_the_text_page() -> None:
    connection = database_at_version_5()

    init_db(connection)

    assert [card["word"] for card in list_cards(connection, 1)] == ["Zug", "Haus"]
    assert [card["word"] for card in list_cards(connection, 2)] == ["cat"]
    assert list_cards(connection, 3) == []


def test_the_migration_keeps_the_order_of_the_study_queue() -> None:
    connection = database_at_version_5()
    before = [2, 3]  # due 2026-10-16, in the order of their due times

    init_db(connection)

    assert [card["id"] for card in list_queue(connection)] == before


def test_a_card_stays_when_its_text_is_deleted() -> None:
    connection = database_at_version_5()
    init_db(connection)

    connection.execute("DELETE FROM texts WHERE id = 1")
    connection.commit()

    assert get_card(connection, 1)["word"] == "Zug"
    assert [deck["title"] for deck in get_card(connection, 1)["decks"]] == ["Earlier cards"]


def test_the_migration_runs_only_once() -> None:
    connection = database_at_version_5()
    init_db(connection)
    cards = connection.execute("SELECT COUNT(*) FROM cards").fetchone()[0]

    init_db(connection)

    assert connection.execute("SELECT COUNT(*) FROM cards").fetchone()[0] == cards
    assert len(list_decks(connection)) == 2


def test_a_migration_that_fails_changes_nothing() -> None:
    connection = database_at_version_5()
    real = MIGRATIONS[5]  # the decks migration

    def fails_at_the_end(connection: sqlite3.Connection) -> None:
        real(connection)
        raise RuntimeError("The migration failed.")

    database.MIGRATIONS[5] = fails_at_the_end
    try:
        with pytest.raises(RuntimeError):
            init_db(connection)
    finally:
        database.MIGRATIONS[5] = real

    columns = {row["name"] for row in connection.execute("PRAGMA table_info(cards)")}
    tables = {row["name"] for row in connection.execute("SELECT name FROM sqlite_master")}
    assert connection.execute("PRAGMA user_version").fetchone()[0] == 5
    assert "text_id" in columns
    assert "decks" not in tables
    assert connection.execute("SELECT COUNT(*) FROM cards").fetchone()[0] == 3


# --- Decks and the language pair of a card ------------------------------------------------------------------------


def test_a_deck_only_takes_cards_of_its_language_pair_and_nothing_is_saved_otherwise() -> None:
    connection = open_database()
    text_id = make_german_text(connection, ["Zug"])
    english_deck = create_deck(connection, "English words", "en", "de")

    with pytest.raises(DeckPairMismatch):
        add_card(
            connection,
            text_id,
            "Zug",
            "Der Zug.",
            "The train.",
            TODAY,
            deck_ids=[english_deck["id"]],
        )

    assert connection.execute("SELECT COUNT(*) FROM cards").fetchone()[0] == 0


def test_the_same_word_and_phrase_can_be_a_card_in_two_language_pairs() -> None:
    connection = open_database()
    german = make_german_text(connection, ["Gift"])
    english = save_text(connection, "A gift for you.", "en", "de", ["Gift"])

    add_card(
        connection,
        german,
        "Gift",
        "Das Gift ist stark.",
        "The poison is strong.",
        TODAY,
        "das Gift",
    )
    add_card(connection, english, "Gift", "A gift.", "Ein Geschenk.", TODAY, "das Gift")

    assert connection.execute("SELECT COUNT(*) FROM cards").fetchone()[0] == 2


def test_a_card_can_be_in_several_decks_and_a_deck_is_listed_once_per_card() -> None:
    connection = open_database()
    text_id = make_german_text(connection, ["Zug"])
    first = create_deck(connection, "Trains", "de", "en")
    second = create_deck(connection, "Travel", "de", "en")

    card_id = add_card(
        connection,
        text_id,
        "Zug",
        "Der Zug.",
        "The train.",
        TODAY,
        deck_ids=[first["id"], second["id"], first["id"]],
    )

    assert sorted(deck["title"] for deck in get_card(connection, card_id)["decks"]) == [
        "Trains",
        "Travel",
    ]


# --- The API of decks --------------------------------------------------------------------------------------------


@pytest.fixture
def client():
    model = FakeModel()
    app.dependency_overrides[get_llm_client] = lambda: model
    app.dependency_overrides[get_today] = lambda: TODAY
    with TestClient(app) as test_client:
        test_client.model = model
        yield test_client
    app.dependency_overrides.clear()


def make_deck(client: TestClient, title: str, text_language="de", first_language="en"):
    return client.post(
        "/api/decks",
        json={"title": title, "text_language": text_language, "first_language": first_language},
    )


def test_a_deck_is_made_with_a_clean_title_and_starts_empty(client) -> None:
    response = make_deck(client, "  My   first deck ")

    assert response.status_code == 201
    assert response.json() == {
        "id": 1,
        "title": "My first deck",
        "text_language": "de",
        "first_language": "en",
        "card_count": 0,
        "learned_percent": 0,
    }


@pytest.mark.parametrize("title", ["", "   ", "x" * 61])
def test_a_deck_title_must_have_1_to_60_characters(client, title) -> None:
    assert make_deck(client, title).status_code == 422
    assert client.get("/api/decks").json() == []


def test_a_deck_needs_two_different_languages(client) -> None:
    assert make_deck(client, "Same", "de", "de").status_code == 422


def test_a_title_is_taken_for_the_language_pair_whatever_the_case_of_the_letters(client) -> None:
    make_deck(client, "Travel")

    assert make_deck(client, "  tRAVEL ").status_code == 409
    assert make_deck(client, "Travel", "en", "de").status_code == 201
    assert len(client.get("/api/decks").json()) == 2


def test_a_deck_is_learned_by_the_share_of_its_visible_cards_answered_and_not_forgotten() -> None:
    connection = open_database()
    text_id = make_german_text(connection, ["Zug", "Haus", "Hund", "Tisch", "Baum"])
    deck = create_deck(connection, "Mixed", "de", "en")
    ids = [
        add_card(connection, text_id, word, f"{word}.", f"{word}.", TODAY, deck_ids=[deck["id"]])
        for word in ["Zug", "Haus", "Hund", "Tisch", "Baum"]
    ]
    assert list_decks(connection)[0]["learned_percent"] == 0
    # Zug and Haus are answered and waiting, Hund was forgotten, Tisch is new, Baum is hidden.
    connection.execute(
        "UPDATE cards SET answers = 2, interval_days = 3 WHERE id IN (?, ?)", ids[:2]
    )
    connection.execute("UPDATE cards SET answers = 1, interval_days = 0 WHERE id = ?", (ids[2],))
    connection.execute(
        "UPDATE cards SET answers = 1, interval_days = 3, hidden = 1 WHERE id = ?", (ids[4],)
    )

    assert list_decks(connection)[0]["learned_percent"] == 50
    assert list_decks(connection)[0]["card_count"] == 5


def test_the_decks_are_listed_with_their_cards_and_can_be_kept_to_a_language_pair(client) -> None:
    make_deck(client, "German")
    make_deck(client, "English", "en", "de")

    assert [deck["title"] for deck in client.get("/api/decks").json()] == ["English", "German"]
    only_german = client.get("/api/decks", params={"text_language": "de", "first_language": "en"})
    assert [deck["title"] for deck in only_german.json()] == ["German"]


# --- Asking for the sentences in decks ------------------------------------------------------------------------------


def add_text(client: TestClient, words: list[str]) -> int:
    return client.post("/api/texts", json={**TEXT, "words": words}).json()["id"]


def test_the_cards_of_a_text_go_in_the_chosen_decks(client) -> None:
    first = make_deck(client, "Trains").json()["id"]
    second = make_deck(client, "Travel").json()["id"]
    text_id = add_text(client, ["Bahnhof", "Zug"])

    response = ask_for_cards(client, text_id, [first, second])

    assert response.status_code == 200
    for card in response.json()["cards"]:
        assert sorted(deck["title"] for deck in card["decks"]) == ["Trains", "Travel"]
    assert [deck["card_count"] for deck in client.get("/api/decks").json()] == [2, 2]


def test_at_least_one_deck_is_needed_to_ask_for_cards_and_no_card_is_made_without_it(
    client,
) -> None:
    text_id = add_text(client, ["Zug"])

    assert client.post(f"/api/texts/{text_id}/cards").status_code == 422
    assert client.post(f"/api/texts/{text_id}/cards", json={"deck_ids": []}).status_code == 422
    assert client.get("/api/cards").json() == []


def test_a_deck_that_does_not_exist_or_is_for_another_pair_stops_everything(client) -> None:
    english = make_deck(client, "English", "en", "de").json()["id"]
    text_id = add_text(client, ["Zug"])

    assert ask_for_cards(client, text_id, [99]).status_code == 404
    assert ask_for_cards(client, text_id, [english]).status_code == 422
    assert client.get("/api/cards").json() == []
    assert client.model.calls == []


def test_a_word_that_already_has_a_card_is_added_to_the_new_decks_without_asking_the_model(
    client,
) -> None:
    first = make_deck(client, "Trains").json()["id"]
    second = make_deck(client, "Travel").json()["id"]
    text_id = add_text(client, ["Zug"])
    before = ask_for_cards(client, text_id, [first]).json()["cards"][0]

    after = ask_for_cards(client, text_id, [second]).json()["cards"][0]

    assert sorted(deck["id"] for deck in after["decks"]) == [first, second]
    assert {key: after[key] for key in ("id", "sentence", "translation", "phrase")} == {
        key: before[key] for key in ("id", "sentence", "translation", "phrase")
    }
    assert len(client.model.calls) == 1


def test_a_word_with_the_same_meaning_in_another_text_is_added_to_the_decks_too(client) -> None:
    client.model.phrases = {"Zug": "den Zug nehmen"}
    first = make_deck(client, "Trains").json()["id"]
    second = make_deck(client, "Travel").json()["id"]
    ask_for_cards(client, add_text(client, ["Zug"]), [first])
    client.model.same_meaning = {"Zug": "den Zug nehmen"}

    response = ask_for_cards(client, add_text(client, ["Zug"]), [second]).json()

    assert response["existing"] == [{"word": "Zug", "phrase": "den Zug nehmen"}]
    assert sorted(deck["id"] for deck in response["cards"][0]["decks"]) == [first, second]
    assert len(client.get("/api/cards").json()) == 1


def test_a_card_the_model_gave_no_sentence_for_is_in_the_decks_too(client) -> None:
    from app.llm import LlmError

    client.model.failing = {"Zug": LlmError("The language model took too long to answer.")}
    deck = make_deck(client, "Trains").json()["id"]

    card = ask_for_cards(client, add_text(client, ["Zug"]), [deck]).json()["cards"][0]

    assert card["sentence"] is None
    assert [d["id"] for d in card["decks"]] == [deck]


# --- Studying the decks the learner ticked --------------------------------------------------------------------------


def two_decks_with_cards(client: TestClient) -> tuple[int, int]:
    """Deck A has Bahnhof and Zug; deck B has Zug and Haus. Zug is in both."""
    deck_a = make_deck(client, "A").json()["id"]
    deck_b = make_deck(client, "B").json()["id"]
    ask_for_cards(client, add_text(client, ["Bahnhof", "Zug"]), [deck_a])
    ask_for_cards(client, add_text(client, ["Zug", "Haus"]), [deck_b])
    return deck_a, deck_b


def words(cards: list[dict]) -> list[str]:
    return [card["word"] for card in cards]


def test_without_ticked_decks_the_queue_and_the_due_cards_have_every_card(client) -> None:
    two_decks_with_cards(client)

    assert len(client.get("/api/study/queue").json()) == 3
    assert len(client.get("/api/study/due").json()) == 3


def test_only_the_cards_of_the_ticked_decks_are_studied(client) -> None:
    deck_a, deck_b = two_decks_with_cards(client)

    queue_a = client.get("/api/study/queue", params={"deck_ids": [deck_a]}).json()
    due_b = client.get("/api/study/due", params={"deck_ids": [deck_b]}).json()

    assert words(queue_a) == ["Bahnhof", "Zug"]
    assert words(due_b) == ["Zug", "Haus"]


def test_a_card_in_two_ticked_decks_is_in_the_queue_once(client) -> None:
    deck_a, deck_b = two_decks_with_cards(client)

    queue = client.get("/api/study/queue", params={"deck_ids": [deck_a, deck_b]}).json()

    assert sorted(words(queue)) == ["Bahnhof", "Haus", "Zug"]


def test_a_card_in_a_ticked_deck_shows_all_its_decks(client) -> None:
    deck_a, deck_b = two_decks_with_cards(client)

    queue = client.get("/api/study/queue", params={"deck_ids": [deck_a]}).json()
    zug = next(card for card in queue if card["word"] == "Zug")

    assert sorted(deck["title"] for deck in zug["decks"]) == ["A", "B"]


def queue_ids(client: TestClient, deck_ids: list[int] | None = None) -> list[int]:
    params = {"deck_ids": deck_ids} if deck_ids else None
    return [card["id"] for card in client.get("/api/study/queue", params=params).json()]


def test_the_order_saved_for_some_decks_is_the_order_of_every_deck(client) -> None:
    deck_a, deck_b = two_decks_with_cards(client)
    order = queue_ids(client, [deck_a])

    response = client.post(
        "/api/study/queue/order",
        json={
            "card_ids": order[::-1],
            "moved": [order[0]],
            "today_count": len(order),
            "deck_ids": [deck_a],
        },
    )

    assert response.status_code == 200
    assert [card["id"] for card in response.json()] == order[::-1]
    everything = queue_ids(client)
    assert everything.index(order[1]) < everything.index(order[0])


def test_an_order_is_refused_when_the_cards_of_the_ticked_decks_changed(client) -> None:
    deck_a, deck_b = two_decks_with_cards(client)
    order = queue_ids(client, [deck_a])

    response = client.post(
        "/api/study/queue/order",
        json={
            "card_ids": order[:1],
            "moved": order[:1],
            "today_count": 1,
            "deck_ids": [deck_a],
        },
    )

    assert response.status_code == 409
    assert queue_ids(client, [deck_a]) == order


def test_a_card_in_an_unticked_deck_does_not_change_the_order_of_the_ticked_ones(client) -> None:
    deck_a, deck_b = two_decks_with_cards(client)
    everything_before = queue_ids(client)
    order_a = queue_ids(client, [deck_a])
    only_b = next(i for i in queue_ids(client, [deck_b]) if i not in order_a)

    client.post(
        "/api/study/queue/order",
        json={
            "card_ids": order_a[::-1],
            "moved": [order_a[0]],
            "today_count": 2,
            "deck_ids": [deck_a],
        },
    )

    assert only_b in queue_ids(client)
    assert len(queue_ids(client)) == len(everything_before)


def test_reorder_in_the_database_uses_the_cards_of_the_given_decks_only() -> None:
    connection = open_database()
    text_id = make_german_text(connection, ["Zug", "Haus"])
    deck = create_deck(connection, "A", "de", "en")
    first = add_card(
        connection, text_id, "Zug", "Der Zug.", "The train.", TODAY, deck_ids=[deck["id"]]
    )
    add_card(connection, text_id, "Haus", "Das Haus.", "The house.", TODAY)

    assert [card["id"] for card in list_queue(connection, [deck["id"]])] == [first]
    assert list_queue(connection, []) == []
    with pytest.raises(ValueError):
        reorder_queue(connection, [first, 99], [first], 2, TODAY, [deck["id"]])


def test_the_answer_count_starts_at_one_for_a_card_that_already_waits() -> None:
    connection = database_at_version_5()
    init_db(connection)

    counts = {
        row["id"]: row["answers"] for row in connection.execute("SELECT id, answers FROM cards")
    }

    assert counts == {1: 1, 2: 0, 3: 0}
