import json

import httpx2
import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.llm import LlmClient, get_llm_client
from app.main import app

GOOD_ANSWER = '{"sentence": "Das Haus ist alt.", "translation": "The house is old."}'
REQUEST = {"word": "Haus", "text_language": "de", "first_language": "en"}


def use_model(handler, **changes) -> None:
    """Make the API ask a fake model, which never leaves the test. The waits between repeated requests are skipped."""
    values = {
        "llm_api_key": "test-key",
        "llm_model": "test-model",
        "llm_base_url": "https://llm.example/v1/",
    }
    values.update(changes)
    transport = httpx2.MockTransport(handler)
    settings = Settings(_env_file=None, **values)
    client = LlmClient(settings, httpx2.Client(transport=transport), sleep=lambda seconds: None)
    app.dependency_overrides[get_llm_client] = lambda: client


@pytest.fixture(autouse=True)
def forget_the_fake_model():
    yield
    app.dependency_overrides.clear()


def test_the_api_returns_the_sentence_and_its_translation() -> None:
    use_model(
        lambda request: httpx2.Response(
            200, json={"choices": [{"message": {"content": GOOD_ANSWER}}]}
        )
    )

    response = TestClient(app).post("/api/sentences", json=REQUEST)

    assert response.status_code == 200
    assert response.json() == {"sentence": "Das Haus ist alt.", "translation": "The house is old."}


def test_the_api_passes_the_previous_sentence_to_the_model() -> None:
    bodies = []

    def handler(request: httpx2.Request) -> httpx2.Response:
        bodies.append(json.loads(request.content))
        return httpx2.Response(200, json={"choices": [{"message": {"content": GOOD_ANSWER}}]})

    use_model(handler)

    TestClient(app).post(
        "/api/sentences", json={**REQUEST, "previous_sentence": "Mein Haus ist klein."}
    )

    assert "Mein Haus ist klein." in bodies[0]["messages"][-1]["content"]


def test_a_model_that_does_not_answer_gives_an_error_the_page_can_show() -> None:
    use_model(lambda request: httpx2.Response(500, text="boom"))

    response = TestClient(app).post("/api/sentences", json=REQUEST)

    assert response.status_code == 502
    assert response.json() == {
        "detail": "The language model is not available right now. Try again in a moment."
    }


def test_a_missing_key_gives_an_error_the_page_can_show() -> None:
    use_model(lambda request: httpx2.Response(200), llm_api_key="")

    response = TestClient(app).post("/api/sentences", json=REQUEST)

    assert response.status_code == 503
    assert "LLM_API_KEY" in response.json()["detail"]


@pytest.mark.parametrize(
    "request_body",
    [
        {**REQUEST, "text_language": "fr"},
        {**REQUEST, "first_language": "fr"},
        {**REQUEST, "word": "  "},
        {"text_language": "de", "first_language": "en"},
    ],
    ids=["unknown text language", "unknown first language", "blank word", "no word"],
)
def test_a_request_the_api_cannot_use_is_refused(request_body) -> None:
    use_model(lambda request: httpx2.Response(200))

    assert TestClient(app).post("/api/sentences", json=request_body).status_code == 422
