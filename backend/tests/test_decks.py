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
        "uncategorized": False,
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


# --- Changing the decks of cards (FR-020) ----------------------------------------------------------------------------


def make_cards_in(client: TestClient, deck_id: int, words: list[str]) -> list[dict]:
    text_id = add_text(client, words)
    return ask_for_cards(client, text_id, [deck_id]).json()["cards"]


def change_decks(client: TestClient, card_ids: list[int], add=(), remove=()):
    return client.post(
        "/api/cards/decks",
        json={"card_ids": card_ids, "add_deck_ids": list(add), "remove_deck_ids": list(remove)},
    )


def test_cards_are_put_in_decks_and_taken_out_in_one_step(client) -> None:
    first = make_deck(client, "Trains").json()["id"]
    second = make_deck(client, "Travel").json()["id"]
    cards = make_cards_in(client, first, ["Bahnhof", "Zug"])
    ids = [card["id"] for card in cards]

    response = change_decks(client, ids, add=[second], remove=[first])

    assert response.status_code == 200
    for card in response.json():
        assert [deck["id"] for deck in card["decks"]] == [second]
    counts = {deck["id"]: deck["card_count"] for deck in client.get("/api/decks").json()}
    assert counts == {first: 0, second: 2}


def test_changing_the_decks_of_a_card_keeps_its_sentence_and_its_study_data(client) -> None:
    first = make_deck(client, "Trains").json()["id"]
    second = make_deck(client, "Travel").json()["id"]
    card = make_cards_in(client, first, ["Zug"])[0]
    client.post(f"/api/cards/{card['id']}/answer", json={"answer": "good"})
    before = client.get("/api/cards").json()[0]

    after = change_decks(client, [card["id"]], add=[second], remove=[first]).json()[0]

    for key in ("id", "sentence", "translation", "phrase", "due_date", "flagged", "hidden"):
        assert after[key] == before[key]
    assert before["due_date"] is not None


def test_a_card_taken_out_of_all_its_decks_goes_to_uncategorized(client) -> None:
    deck = make_deck(client, "Trains").json()["id"]
    card = make_cards_in(client, deck, ["Zug"])[0]

    response = change_decks(client, [card["id"]], remove=[deck])

    assert [d["title"] for d in response.json()[0]["decks"]] == ["Uncategorized"]
    assert len(client.get("/api/cards").json()) == 1


def test_a_deck_of_another_language_pair_is_refused_and_nothing_changes(client) -> None:
    german = make_deck(client, "German").json()["id"]
    english = make_deck(client, "English", "en", "de").json()["id"]
    other = make_deck(client, "More German").json()["id"]
    card = make_cards_in(client, german, ["Zug"])[0]

    response = change_decks(client, [card["id"]], add=[other, english], remove=[german])

    assert response.status_code == 422
    assert [deck["id"] for deck in client.get("/api/cards").json()[0]["decks"]] == [german]


def test_a_card_or_a_deck_that_does_not_exist_changes_nothing(client) -> None:
    deck = make_deck(client, "Trains").json()["id"]
    card = make_cards_in(client, deck, ["Zug"])[0]

    assert change_decks(client, [card["id"], 999], remove=[deck]).status_code == 404
    assert change_decks(client, [card["id"]], add=[999], remove=[deck]).status_code == 404
    assert [d["id"] for d in client.get("/api/cards").json()[0]["decks"]] == [deck]


def test_a_request_with_no_deck_or_with_the_same_deck_to_add_and_to_remove_is_refused(
    client,
) -> None:
    deck = make_deck(client, "Trains").json()["id"]
    card = make_cards_in(client, deck, ["Zug"])[0]

    assert change_decks(client, [card["id"]]).status_code == 422
    assert change_decks(client, [card["id"]], add=[deck], remove=[deck]).status_code == 422
    assert change_decks(client, [], add=[deck]).status_code == 422


# --- Managing the decks: rename, delete and the deck "Uncategorized" (DEC-065) -----------------------------------


def uncategorized_of(client: TestClient, text_language="de", first_language="en") -> dict | None:
    for deck in client.get("/api/decks").json():
        if (
            deck["uncategorized"]
            and deck["text_language"] == text_language
            and deck["first_language"] == first_language
        ):
            return deck
    return None


def titles_of(client: TestClient) -> list[str]:
    return sorted(deck["title"] for deck in client.get("/api/decks").json())


def database_before_the_uncategorized_deck() -> sqlite3.Connection:
    """A database made by the migrations that were on `main` before DEC-065, with two decks and cards in no deck."""
    database.MIGRATIONS[:] = MIGRATIONS[:8]
    try:
        connection = open_database()
    finally:
        database.MIGRATIONS[:] = ALL_MIGRATIONS
    return connection


ALL_MIGRATIONS = list(MIGRATIONS)


def old_deck(
    connection: sqlite3.Connection, title: str, text_language="de", first_language="en"
) -> int:
    """A deck made the way the database before migration 9 made it."""
    cursor = connection.execute(
        "INSERT INTO decks (title, text_language, first_language) VALUES (?, ?, ?)",
        (title, text_language, first_language),
    )
    return cursor.lastrowid


def old_card(
    connection: sqlite3.Connection, word: str, text_language="de", first_language="en", deck_id=None
) -> int:
    """A card made the way the database before migration 9 made it, in a deck or in none."""
    cursor = connection.execute(
        "INSERT INTO cards (text_language, first_language, word, due_date) VALUES (?, ?, ?, ?)",
        (text_language, first_language, word, TODAY.isoformat()),
    )
    if deck_id is not None:
        connection.execute(
            "INSERT INTO card_decks (card_id, deck_id) VALUES (?, ?)", (cursor.lastrowid, deck_id)
        )
    return cursor.lastrowid


def decks_of_card(connection: sqlite3.Connection, card_id: int) -> list[int]:
    rows = connection.execute(
        "SELECT deck_id FROM card_decks WHERE card_id = ? ORDER BY deck_id", (card_id,)
    ).fetchall()
    return [row["deck_id"] for row in rows]


def test_the_migration_puts_the_cards_that_are_in_no_deck_in_uncategorized_of_their_pair() -> None:
    connection = database_before_the_uncategorized_deck()
    trains = old_deck(connection, "Trains")
    in_deck = old_card(connection, "Zug", deck_id=trains)
    german = old_card(connection, "Haus")
    english = old_card(connection, "cat", "en", "de")
    connection.commit()

    init_db(connection)

    decks = {
        (d["text_language"], d["first_language"]): d
        for d in list_decks(connection)
        if d["uncategorized"]
    }
    assert sorted(decks) == [("de", "en"), ("en", "de")]
    assert {d["title"] for d in decks.values()} == {"Uncategorized"}
    assert decks_of_card(connection, german) == [decks[("de", "en")]["id"]]
    assert decks_of_card(connection, english) == [decks[("en", "de")]["id"]]
    assert decks_of_card(connection, in_deck) == [trains]


def test_the_migration_makes_no_uncategorized_deck_when_every_card_is_in_a_deck() -> None:
    connection = database_before_the_uncategorized_deck()
    trains = old_deck(connection, "Trains")
    old_card(connection, "Zug", deck_id=trains)
    connection.commit()

    init_db(connection)

    decks = list_decks(connection)
    assert [d["title"] for d in decks] == ["Trains"]
    assert not decks[0]["uncategorized"]


def test_a_deck_the_learner_titled_uncategorized_becomes_the_marked_deck() -> None:
    connection = database_before_the_uncategorized_deck()
    own = old_deck(connection, "uncategorized")
    card = old_card(connection, "Zug")
    connection.commit()

    init_db(connection)

    decks = list_decks(connection)
    assert [d["id"] for d in decks] == [own]
    assert decks[0]["uncategorized"]
    assert decks_of_card(connection, card) == [own]


def test_a_deck_is_renamed_with_the_rules_of_a_new_title(client) -> None:
    deck = make_deck(client, "Trains").json()["id"]

    response = client.patch(f"/api/decks/{deck}", json={"title": "  Long   trips "})

    assert response.status_code == 200
    assert response.json()["title"] == "Long trips"
    assert titles_of(client) == ["Long trips"]


def test_a_deck_may_change_the_case_of_its_own_title(client) -> None:
    deck = make_deck(client, "Trains").json()["id"]

    assert client.patch(f"/api/decks/{deck}", json={"title": "TRAINS"}).json()["title"] == "TRAINS"


def test_a_title_that_another_deck_of_the_pair_has_is_refused(client) -> None:
    make_deck(client, "Trains")
    other = make_deck(client, "Travel").json()["id"]
    make_deck(client, "Trains", "en", "de")

    assert client.patch(f"/api/decks/{other}", json={"title": "trains"}).status_code == 409
    assert titles_of(client) == ["Trains", "Trains", "Travel"]


@pytest.mark.parametrize("title", ["", "   ", "x" * 61])
def test_a_title_of_the_wrong_length_is_refused_when_renaming(client, title) -> None:
    deck = make_deck(client, "Trains").json()["id"]

    assert client.patch(f"/api/decks/{deck}", json={"title": title}).status_code == 422
    assert titles_of(client) == ["Trains"]


def test_a_deck_that_does_not_exist_is_not_found(client) -> None:
    assert client.patch("/api/decks/99", json={"title": "x"}).status_code == 404
    assert client.get("/api/decks/99").status_code == 404
    assert client.delete("/api/decks/99").status_code == 404


def test_the_deck_uncategorized_cannot_be_renamed(client) -> None:
    deck = make_deck(client, "Trains").json()["id"]
    card = make_cards_in(client, deck, ["Zug"])[0]
    change_decks(client, [card["id"]], remove=[deck])
    uncategorized = uncategorized_of(client)

    response = client.patch(f"/api/decks/{uncategorized['id']}", json={"title": "Misc"})

    assert response.status_code == 422
    assert uncategorized_of(client)["title"] == "Uncategorized"


def test_a_deck_says_how_many_of_its_cards_are_only_in_it_and_how_many_are_also_elsewhere(
    client,
) -> None:
    first = make_deck(client, "Trains").json()["id"]
    second = make_deck(client, "Travel").json()["id"]
    cards = make_cards_in(client, first, ["Bahnhof", "Zug", "Gleis"])
    change_decks(client, [cards[0]["id"]], add=[second])

    detail = client.get(f"/api/decks/{first}").json()

    assert (detail["card_count"], detail["cards_only_here"], detail["cards_elsewhere"]) == (3, 2, 1)


def test_a_deck_whose_cards_are_all_in_other_decks_is_deleted_and_no_card_is_deleted(
    client,
) -> None:
    first = make_deck(client, "Trains").json()["id"]
    second = make_deck(client, "Travel").json()["id"]
    cards = make_cards_in(client, first, ["Bahnhof", "Zug"])
    change_decks(client, [card["id"] for card in cards], add=[second])

    response = client.delete(f"/api/decks/{first}")

    assert response.status_code == 204
    assert titles_of(client) == ["Travel"]
    assert len(client.get("/api/cards").json()) == 2
    assert uncategorized_of(client) is None


def test_a_deck_with_cards_that_are_in_no_other_deck_needs_a_choice_and_nothing_changes(
    client,
) -> None:
    deck = make_deck(client, "Trains").json()["id"]
    make_cards_in(client, deck, ["Bahnhof", "Zug"])

    for query in ("", "?cards=throw"):
        assert client.delete(f"/api/decks/{deck}{query}").status_code == 422

    assert titles_of(client) == ["Trains"]
    assert len(client.get("/api/cards").json()) == 2


def test_the_cards_only_in_the_deleted_deck_can_be_kept_in_uncategorized(client) -> None:
    first = make_deck(client, "Trains").json()["id"]
    second = make_deck(client, "Travel").json()["id"]
    cards = make_cards_in(client, first, ["Bahnhof", "Zug"])
    change_decks(client, [cards[1]["id"]], add=[second])

    response = client.delete(f"/api/decks/{first}?cards=keep")

    assert response.status_code == 204
    by_word = {card["word"]: card for card in client.get("/api/cards").json()}
    assert [d["title"] for d in by_word["Bahnhof"]["decks"]] == ["Uncategorized"]
    assert [d["title"] for d in by_word["Zug"]["decks"]] == ["Travel"]
    assert titles_of(client) == ["Travel", "Uncategorized"]


def test_kept_cards_go_to_the_uncategorized_deck_of_their_own_language_pair(client) -> None:
    english = make_deck(client, "Cats", "en", "de").json()["id"]
    german = make_deck(client, "Trains").json()["id"]
    make_cards_in(client, german, ["Zug"])
    text_id = client.post(
        "/api/texts",
        json={
            "text": "The cat sleeps.",
            "text_language": "en",
            "first_language": "de",
            "words": ["cat"],
        },
    ).json()["id"]
    ask_for_cards(client, text_id, [english])

    assert client.delete(f"/api/decks/{english}?cards=keep").status_code == 204

    assert uncategorized_of(client, "en", "de")["card_count"] == 1
    assert uncategorized_of(client, "de", "en") is None


def test_the_cards_only_in_the_deleted_deck_can_be_deleted_with_it(client) -> None:
    first = make_deck(client, "Trains").json()["id"]
    second = make_deck(client, "Travel").json()["id"]
    cards = make_cards_in(client, first, ["Bahnhof", "Zug"])
    change_decks(client, [cards[1]["id"]], add=[second])

    response = client.delete(f"/api/decks/{first}?cards=delete")

    assert response.status_code == 204
    assert [card["word"] for card in client.get("/api/cards").json()] == ["Zug"]
    assert titles_of(client) == ["Travel"]


def test_the_uncategorized_deck_is_only_deleted_together_with_its_cards(client) -> None:
    deck = make_deck(client, "Trains").json()["id"]
    card = make_cards_in(client, deck, ["Zug"])[0]
    change_decks(client, [card["id"]], remove=[deck])
    uncategorized = uncategorized_of(client)["id"]

    assert client.delete(f"/api/decks/{uncategorized}").status_code == 422
    assert client.delete(f"/api/decks/{uncategorized}?cards=keep").status_code == 422
    assert uncategorized_of(client) is not None

    assert client.delete(f"/api/decks/{uncategorized}?cards=delete").status_code == 204
    assert uncategorized_of(client) is None
    assert client.get("/api/cards").json() == []


def test_an_empty_uncategorized_deck_is_deleted_without_a_choice(client) -> None:
    deck = make_deck(client, "Trains").json()["id"]
    card = make_cards_in(client, deck, ["Zug"])[0]
    change_decks(client, [card["id"]], remove=[deck])
    change_decks(client, [card["id"]], add=[make_deck(client, "Travel").json()["id"]])
    uncategorized = uncategorized_of(client)

    assert uncategorized["card_count"] == 0
    assert client.delete(f"/api/decks/{uncategorized['id']}").status_code == 204


def test_a_card_put_in_another_deck_leaves_uncategorized(client) -> None:
    deck = make_deck(client, "Trains").json()["id"]
    other = make_deck(client, "Travel").json()["id"]
    card = make_cards_in(client, deck, ["Zug"])[0]
    change_decks(client, [card["id"]], remove=[deck])

    response = change_decks(client, [card["id"]], add=[other])

    assert [d["title"] for d in response.json()[0]["decks"]] == ["Travel"]
    assert uncategorized_of(client)["card_count"] == 0


def test_the_deck_uncategorized_is_not_chosen_by_hand(client) -> None:
    deck = make_deck(client, "Trains").json()["id"]
    cards = make_cards_in(client, deck, ["Zug", "Haus"])
    change_decks(client, [cards[0]["id"]], remove=[deck])
    uncategorized = uncategorized_of(client)["id"]

    assert change_decks(client, [cards[1]["id"]], add=[uncategorized]).status_code == 422
    text_id = add_text(client, ["Gleis"])
    assert ask_for_cards(client, text_id, [uncategorized]).status_code == 422
    assert uncategorized_of(client)["card_count"] == 1


def test_a_deck_deleted_with_a_failure_changes_nothing(monkeypatch) -> None:
    connection = open_database()
    text_id = make_german_text(connection, ["Zug"])
    deck = create_deck(connection, "Trains", "de", "en")
    card = add_card(
        connection, text_id, "Zug", "Der Zug.", "The train.", TODAY, deck_ids=[deck["id"]]
    )

    def fails(*args, **kwargs):
        raise RuntimeError("The database failed.")

    monkeypatch.setattr(database, "uncategorized_deck_id", fails)
    with pytest.raises(RuntimeError):
        database.delete_deck(connection, deck["id"], "keep")

    assert [d["id"] for d in list_decks(connection)] == [deck["id"]]
    assert [d["id"] for d in get_card(connection, card)["decks"]] == [deck["id"]]
