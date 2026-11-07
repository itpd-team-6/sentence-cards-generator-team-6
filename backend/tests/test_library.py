from fastapi.testclient import TestClient

from app import database
from app.main import app

CODE_A = "11111111-1111-4111-8111-111111111111"
CODE_B = "22222222-2222-4222-8222-222222222222"
DECK = {"title": "Travel", "text_language": "de", "first_language": "en"}


def client() -> TestClient:
    database._ready_libraries.clear()
    return TestClient(app)


def with_code(code: str) -> dict[str, str]:
    return {database.LIBRARY_HEADER: code}


def test_a_library_does_not_show_the_decks_of_another_library(tmp_path):
    with client() as http:
        assert http.post("/api/decks", json=DECK, headers=with_code(CODE_A)).status_code == 201

        own = http.get("/api/decks", headers=with_code(CODE_A)).json()
        other = http.get("/api/decks", headers=with_code(CODE_B)).json()

    assert [deck["title"] for deck in own] == ["Travel"]
    assert other == []


def test_a_library_is_its_own_file_next_to_the_default_database(tmp_path):
    with client() as http:
        http.get("/api/decks", headers=with_code(CODE_A))

    assert (tmp_path / "data" / "libraries" / f"{CODE_A}.db").is_file()


def test_a_request_without_a_code_uses_the_default_database(tmp_path):
    with client() as http:
        http.post("/api/decks", json=DECK)
        assert [deck["title"] for deck in http.get("/api/decks").json()] == ["Travel"]
        assert http.get("/api/decks", headers=with_code(CODE_A)).json() == []


def test_a_code_that_is_not_a_uuid_is_refused_and_makes_no_file(tmp_path):
    with client() as http:
        for code in ["../cards", "ABCDEFAB-1111-4111-8111-111111111111", "short", " "]:
            response = http.get("/api/decks", headers=with_code(code))
            assert response.status_code == 400

    assert not (tmp_path / "data" / "libraries").exists()


def test_the_same_code_gives_back_the_same_library_after_a_restart(tmp_path):
    with client() as http:
        http.post("/api/decks", json=DECK, headers=with_code(CODE_A))

    with client() as http:  # the process starts again and forgets which libraries it prepared
        decks = http.get("/api/decks", headers=with_code(CODE_A)).json()

    assert [deck["title"] for deck in decks] == ["Travel"]


def test_the_library_endpoint_counts_the_cards_and_decks_of_an_existing_library(tmp_path):
    with client() as http:
        http.post("/api/decks", json=DECK, headers=with_code(CODE_A))
        response = http.get("/api/library", headers=with_code(CODE_A))

    assert response.status_code == 200
    assert response.json() == {"cards": 0, "decks": 1}


def test_the_library_endpoint_refuses_an_unknown_code_and_makes_no_library(tmp_path):
    with client() as http:
        response = http.get("/api/library", headers=with_code(CODE_B))

    assert response.status_code == 404
    assert not (tmp_path / "data" / "libraries" / f"{CODE_B}.db").exists()


def test_the_library_endpoint_needs_a_code(tmp_path):
    with client() as http:
        assert http.get("/api/library").status_code == 400
