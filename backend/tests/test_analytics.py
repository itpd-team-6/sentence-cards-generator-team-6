from datetime import date

import pytest
from fastapi.testclient import TestClient
from test_cards import TEXT, FakeModel

from app import analytics, database
from app.llm import get_llm_client
from app.main import app
from app.routes.cards import get_today

CODE = "11111111-1111-4111-8111-111111111111"
TODAY = date(2026, 11, 7)


@pytest.fixture
def sent(monkeypatch) -> list[dict]:
    """The events the product sends, with the analytics turned on and the network replaced by a list."""
    monkeypatch.setenv("ANALYTICS_ENABLED", "true")
    monkeypatch.setenv("ANALYTICS_URL", "http://analytics.invalid")
    rows: list[dict] = []
    monkeypatch.setattr(analytics, "deliver", lambda settings, row: rows.append(row))
    return rows


@pytest.fixture
def http():
    app.dependency_overrides[get_llm_client] = lambda: FakeModel()
    app.dependency_overrides[get_today] = lambda: TODAY
    database._ready_libraries.clear()
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


def headers(source: str | None = None) -> dict[str, str]:
    found = {database.LIBRARY_HEADER: CODE}
    if source:
        found[analytics.SOURCE_HEADER] = source
    return found


def make_cards(http, source: str | None = None) -> list[dict]:
    text = http.post("/api/texts", json=TEXT, headers=headers(source)).json()
    deck = http.post(
        "/api/decks",
        json={"title": "Travel", "text_language": "de", "first_language": "en"},
        headers=headers(source),
    ).json()
    response = http.post(
        f"/api/texts/{text['id']}/cards", json={"deck_ids": [deck["id"]]}, headers=headers(source)
    )
    return response.json()["cards"]


def test_nothing_is_sent_when_the_analytics_is_off(monkeypatch, http) -> None:
    rows: list = []
    monkeypatch.setattr(analytics, "deliver", lambda settings, row: rows.append(row))
    monkeypatch.delenv("ANALYTICS_ENABLED", raising=False)

    http.post("/api/texts", json=TEXT, headers=headers())

    assert rows == []


def test_saving_a_text_records_text_saved_without_the_text(sent, http) -> None:
    http.post("/api/texts", json=TEXT, headers=headers())

    assert len(sent) == 1
    row = sent[0]
    assert row["event"] == "text_saved"
    assert row["words_marked"] == 3
    assert row["text_language"] == "de" and row["first_language"] == "en"
    assert "Bahnhof" not in str(row) and "Ich warte" not in str(row)


def test_the_learner_is_a_one_way_hash_of_the_library_code_not_the_code(sent, http) -> None:
    http.post("/api/texts", json=TEXT, headers=headers())

    learner = sent[0]["learner_id"]
    assert learner == analytics.learner_id(CODE)
    assert (
        len(learner) == 16
        and CODE not in str(sent[0])
        and CODE.replace("-", "") not in str(sent[0])
    )


def test_a_request_without_a_library_code_is_the_default_learner(sent, http) -> None:
    http.post("/api/texts", json=TEXT)

    assert sent[0]["learner_id"] == "default"


def test_the_source_is_web_unless_the_request_says_smoke_or_usability_test(sent, http) -> None:
    http.post("/api/texts", json=TEXT, headers=headers())
    http.post("/api/texts", json=TEXT, headers=headers("smoke"))
    http.post("/api/texts", json=TEXT, headers=headers("usability-test"))
    http.post("/api/texts", json=TEXT, headers=headers("anything else"))

    assert [row["source"] for row in sent] == ["web", "smoke", "usability-test", "web"]


def test_asking_for_cards_records_cards_generated_with_the_counts(sent, http) -> None:
    make_cards(http)

    row = [row for row in sent if row["event"] == "cards_generated"][0]
    assert (row["words_asked"], row["cards_made"], row["words_failed"]) == (3, 3, 0)


def test_answering_a_card_records_card_answered_with_the_answer(sent, http) -> None:
    card = make_cards(http)[0]

    http.post(f"/api/cards/{card['id']}/answer", json={"answer": "good"}, headers=headers())

    row = [row for row in sent if row["event"] == "card_answered"][0]
    assert row["answer"] == "good"
    assert "card_id" not in row


def test_a_new_sentence_and_an_edited_sentence_record_sentence_replaced(sent, http) -> None:
    card = make_cards(http)[0]

    http.post(f"/api/cards/{card['id']}/new-sentence", headers=headers())
    http.patch(f"/api/cards/{card['id']}", json={"sentence": "Ein neuer Satz."}, headers=headers())

    rows = [row for row in sent if row["event"] == "sentence_replaced"]
    assert [(row["how"], row["cards"]) for row in rows] == [("new_sentence", 1), ("edited", 1)]


def test_a_change_that_is_not_a_sentence_records_nothing(sent, http) -> None:
    card = make_cards(http)[0]

    http.patch(f"/api/cards/{card['id']}", json={"flagged": True}, headers=headers())

    assert [row for row in sent if row["event"] == "sentence_replaced"] == []


def test_new_sentences_for_several_cards_record_one_event_with_the_count(sent, http) -> None:
    cards = make_cards(http)

    http.post(
        "/api/cards/new-sentences",
        json={"card_ids": [card["id"] for card in cards]},
        headers=headers(),
    )

    rows = [row for row in sent if row["event"] == "sentence_replaced"]
    assert [(row["how"], row["cards"]) for row in rows] == [("new_sentence", 3)]


def test_a_failure_to_send_never_breaks_the_request(monkeypatch, http) -> None:
    import httpx2

    monkeypatch.setenv("ANALYTICS_ENABLED", "true")
    monkeypatch.setenv("ANALYTICS_URL", "http://analytics.invalid")

    def refuse(*args, **kwargs):
        raise httpx2.ConnectError("no network")

    monkeypatch.setattr(httpx2, "post", refuse)
    settings = analytics.get_settings()

    analytics.post_event(settings, {"event": "text_saved"})  # no exception

    assert http.post("/api/texts", json=TEXT, headers=headers()).status_code == 201


def test_the_event_goes_to_the_json_endpoint_of_the_organization_with_its_user(monkeypatch) -> None:
    import httpx2

    monkeypatch.setenv("ANALYTICS_URL", "http://analytics.invalid/")
    monkeypatch.setenv("ANALYTICS_ORG", "analytics_staging")
    monkeypatch.setenv("ANALYTICS_USER", "ingest@example.test")
    monkeypatch.setenv("ANALYTICS_PASSWORD", "secret")
    calls: list = []
    monkeypatch.setattr(httpx2, "post", lambda url, **kwargs: calls.append((url, kwargs)))

    analytics.post_event(analytics.get_settings(), {"event": "text_saved"})

    url, kwargs = calls[0]
    assert url == "http://analytics.invalid/api/analytics_staging/events/_json"
    assert kwargs["json"] == [{"event": "text_saved"}]
    assert kwargs["auth"] == ("ingest@example.test", "secret")


def test_sending_an_event_does_not_make_the_request_wait(monkeypatch) -> None:
    import threading

    release = threading.Event()
    started = threading.Event()

    def slow(settings, row) -> None:
        started.set()
        release.wait(5)

    monkeypatch.setattr(analytics, "post_event", slow)

    analytics.deliver(analytics.get_settings(), {"event": "text_saved"})  # returns at once

    assert started.wait(2)  # the sending runs in another thread, which is still busy
    release.set()
