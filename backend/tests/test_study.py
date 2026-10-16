from datetime import date, timedelta

from fastapi.testclient import TestClient

from app.database import add_card, connect, save_text
from app.main import app
from app.routes.cards import get_today

TODAY = date(2026, 10, 16)


def add_cards(*cards: tuple[str, str | None, str | None, date]) -> list[int]:
    """Put cards in the database (word, sentence, translation, due date); return their ids."""
    connection = connect()
    try:
        text_id = save_text(connection, "Ich warte am Bahnhof.", "de", "en", [word for word, *_ in cards])
        return [
            add_card(connection, text_id, word, sentence, translation, due)
            for word, sentence, translation, due in cards
        ]
    finally:
        connection.close()


def study_client() -> TestClient:
    app.dependency_overrides[get_today] = lambda: TODAY
    return TestClient(app)


def teardown_function() -> None:
    app.dependency_overrides.clear()


def card(word: str, due: date, sentence: str | None = "A sentence.", translation: str | None = "A translation."):
    return (word, sentence, translation, due)


def test_only_the_cards_due_today_or_earlier_are_in_the_session() -> None:
    with study_client() as client:
        add_cards(
            card("Bahnhof", TODAY - timedelta(days=2)),
            card("Zug", TODAY),
            card("Haus", TODAY + timedelta(days=3)),
        )

        response = client.get("/api/study/due")

        assert response.status_code == 200
        assert [item["word"] for item in response.json()] == ["Bahnhof", "Zug"]


def test_the_session_has_the_sentence_and_the_translation_of_each_card() -> None:
    with study_client() as client:
        add_cards(("Zug", "Der Zug kommt.", "The train comes.", TODAY))

        assert client.get("/api/study/due").json() == [
            {
                "id": 1,
                "word": "Zug",
                "sentence": "Der Zug kommt.",
                "translation": "The train comes.",
                "due_date": "2026-10-16",
            }
        ]


def test_a_card_without_a_sentence_is_not_studied() -> None:
    with study_client() as client:
        add_cards(("Zug", None, None, TODAY), card("Haus", TODAY))

        assert [item["word"] for item in client.get("/api/study/due").json()] == ["Haus"]


def test_nothing_is_due_when_every_card_is_due_later() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY + timedelta(days=1)))

        assert client.get("/api/study/due").json() == []


def test_with_no_cards_at_all_the_session_is_empty() -> None:
    with study_client() as client:
        assert client.get("/api/study/due").json() == []


def test_a_remembered_card_leaves_the_session_and_is_due_later_than_today() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY), card("Haus", TODAY))

        response = client.post("/api/cards/1/answer", json={"remembered": True})

        assert response.status_code == 200
        assert response.json() == {"id": 1, "word": "Zug", "due_date": "2026-10-17", "interval_days": 1}
        assert [item["word"] for item in client.get("/api/study/due").json()] == ["Haus"]


def test_a_forgotten_card_is_still_due_today_so_it_comes_back_in_the_session() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY - timedelta(days=5)))

        response = client.post("/api/cards/1/answer", json={"remembered": False})

        assert response.json() == {"id": 1, "word": "Zug", "due_date": "2026-10-16", "interval_days": 0}
        assert [item["word"] for item in client.get("/api/study/due").json()] == ["Zug"]


def test_the_answers_are_still_there_after_a_restart() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY))
        client.post("/api/cards/1/answer", json={"remembered": True})

    with study_client() as restarted:
        assert restarted.get("/api/study/due").json() == []


def test_an_answer_for_a_card_that_does_not_exist_is_not_found() -> None:
    with study_client() as client:
        assert client.post("/api/cards/99/answer", json={"remembered": True}).status_code == 404


def test_an_answer_must_say_whether_the_card_was_remembered() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY))

        assert client.post("/api/cards/1/answer", json={}).status_code == 422
        assert client.post("/api/cards/1/answer", json={"remembered": "maybe"}).status_code == 422
