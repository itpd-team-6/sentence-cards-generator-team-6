from fastapi.testclient import TestClient

from app.main import app

TEXT = {
    "text": "Ich warte am Bahnhof auf den Zug.",
    "text_language": "de",
    "first_language": "en",
    "words": ["Bahnhof", "Zug"],
}


def test_a_text_is_saved_with_its_marked_words() -> None:
    with TestClient(app) as client:
        response = client.post("/api/texts", json=TEXT)

        assert response.status_code == 201
        assert response.json() == {"id": 1, **TEXT}


def test_a_saved_text_is_still_there_after_a_restart() -> None:
    with TestClient(app) as client:
        text_id = client.post("/api/texts", json=TEXT).json()["id"]

    with TestClient(app) as restarted:
        response = restarted.get(f"/api/texts/{text_id}")

        assert response.status_code == 200
        assert response.json()["words"] == ["Bahnhof", "Zug"]


def test_a_request_with_no_marked_word_is_refused() -> None:
    with TestClient(app) as client:
        response = client.post("/api/texts", json={**TEXT, "words": []})

        assert response.status_code == 422
        assert client.get("/api/texts/1").status_code == 404


def test_a_word_marked_twice_is_kept_once() -> None:
    with TestClient(app) as client:
        response = client.post("/api/texts", json={**TEXT, "words": ["Zug", " Bahnhof ", "Zug"]})

        assert response.json()["words"] == ["Zug", "Bahnhof"]


def test_an_empty_text_or_an_unknown_language_is_refused() -> None:
    with TestClient(app) as client:
        assert client.post("/api/texts", json={**TEXT, "text": "   "}).status_code == 422
        assert client.post("/api/texts", json={**TEXT, "text_language": "fr"}).status_code == 422


def test_an_unknown_text_is_not_found() -> None:
    with TestClient(app) as client:
        response = client.get("/api/texts/99")

        assert response.status_code == 404


def test_the_text_language_and_the_first_language_must_differ() -> None:
    with TestClient(app) as client:
        response = client.post("/api/texts", json={**TEXT, "first_language": "de"})

        assert response.status_code == 422
        assert client.get("/api/texts/1").status_code == 404


def test_a_selection_of_several_words_is_kept_as_one_marked_item() -> None:
    with TestClient(app) as client:
        response = client.post("/api/texts", json={**TEXT, "words": ["stimmt  zu", "Zug", "stimmt zu"]})

        assert response.status_code == 201
        assert response.json()["words"] == ["stimmt zu", "Zug"]
