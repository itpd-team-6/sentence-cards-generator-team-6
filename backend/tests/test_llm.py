import json

import httpx2
import pytest

from app.config import Settings
from app.llm import GeneratedSentence, LlmClient, LlmError, LlmNotConfigured, parse_answer, parse_translation

API_KEY = "secret-test-key-123"
GOOD_ANSWER = '{"sentence": "Das Haus ist alt.", "translation": "The house is old."}'


def settings(**changes) -> Settings:
    values = {"llm_api_key": API_KEY, "llm_model": "test-model", "llm_base_url": "https://llm.example/v1/"}
    values.update(changes)
    return Settings(_env_file=None, **values)


def reply(content) -> dict:
    return {"choices": [{"message": {"content": content}}]}


def client_for(handler, **changes) -> LlmClient:
    transport = httpx2.MockTransport(handler)
    return LlmClient(settings(**changes), httpx2.Client(transport=transport))


def test_a_good_answer_gives_the_sentence_and_its_translation() -> None:
    seen = {}

    def handler(request: httpx2.Request) -> httpx2.Response:
        seen["url"] = str(request.url)
        seen["authorization"] = request.headers["authorization"]
        seen["body"] = json.loads(request.content)
        return httpx2.Response(200, json=reply(GOOD_ANSWER))

    result = client_for(handler).write_sentence("Haus", "de", "en")

    assert result == GeneratedSentence("Das Haus ist alt.", "The house is old.")
    assert seen["url"] == "https://llm.example/v1/chat/completions"
    assert seen["authorization"] == f"Bearer {API_KEY}"
    assert seen["body"]["model"] == "test-model"
    prompt = seen["body"]["messages"][-1]["content"]
    assert '"Haus"' in prompt
    assert "German" in prompt
    assert "English" in prompt


def test_the_passage_of_the_word_is_sent_when_given() -> None:
    bodies = []

    def handler(request: httpx2.Request) -> httpx2.Response:
        bodies.append(json.loads(request.content))
        return httpx2.Response(200, json=reply(GOOD_ANSWER))

    client_for(handler).write_sentence("Haus", "de", "en", context="Das Haus am See.")

    assert "Das Haus am See." in bodies[0]["messages"][-1]["content"]


def test_asking_for_a_new_sentence_sends_the_previous_one_and_asks_for_another() -> None:
    bodies = []

    def handler(request: httpx2.Request) -> httpx2.Response:
        bodies.append(json.loads(request.content))
        return httpx2.Response(200, json=reply(GOOD_ANSWER))

    client_for(handler).write_sentence("Haus", "de", "en", previous_sentence="Mein Haus ist klein.")

    prompt = bodies[0]["messages"][-1]["content"]
    assert "Mein Haus ist klein." in prompt
    assert "different" in prompt


def test_an_answer_in_a_code_fence_is_read() -> None:
    fenced = f"```json\n{GOOD_ANSWER}\n```"

    result = client_for(lambda request: httpx2.Response(200, json=reply(fenced))).write_sentence("Haus", "de", "en")

    assert result.sentence == "Das Haus ist alt."


def timeout(request: httpx2.Request) -> httpx2.Response:
    raise httpx2.ConnectTimeout("timed out")


def unreachable(request: httpx2.Request) -> httpx2.Response:
    raise httpx2.ConnectError("refused")


FAILURES = {
    "server error": lambda request: httpx2.Response(500, text="boom"),
    "rate limit": lambda request: httpx2.Response(429, text="slow down"),
    "timeout": timeout,
    "unreachable": unreachable,
    "not json": lambda request: httpx2.Response(200, text="<html>"),
    "no choices": lambda request: httpx2.Response(200, json={"choices": []}),
    "answer without json": lambda request: httpx2.Response(200, json=reply("Sorry, I cannot do that.")),
    "answer without a translation": lambda request: httpx2.Response(
        200, json=reply('{"sentence": "Das Haus ist alt."}')
    ),
    "empty sentence": lambda request: httpx2.Response(
        200, json=reply('{"sentence": " ", "translation": "The house is old."}')
    ),
}


@pytest.mark.parametrize("handler", FAILURES.values(), ids=FAILURES.keys())
def test_a_failed_answer_raises_an_error_that_does_not_show_the_key(handler) -> None:
    with pytest.raises(LlmError) as error:
        client_for(handler).write_sentence("Haus", "de", "en")

    assert API_KEY not in str(error.value)
    assert not isinstance(error.value, LlmNotConfigured)


@pytest.mark.parametrize("changes", [{"llm_api_key": ""}, {"llm_model": ""}], ids=["no key", "no model"])
def test_a_missing_key_or_model_is_reported_and_nothing_is_sent(changes) -> None:
    calls = []

    def handler(request: httpx2.Request) -> httpx2.Response:
        calls.append(request)
        return httpx2.Response(200, json=reply(GOOD_ANSWER))

    with pytest.raises(LlmNotConfigured):
        client_for(handler, **changes).write_sentence("Haus", "de", "en")

    assert calls == []


def test_parse_answer_keeps_the_text_of_the_model_trimmed() -> None:
    assert parse_answer('{"sentence": " Hallo. ", "translation": " Hello. "}') == GeneratedSentence("Hallo.", "Hello.")


def test_a_sentence_is_translated_into_the_first_language() -> None:
    seen = {}

    def handler(request: httpx2.Request) -> httpx2.Response:
        seen["body"] = json.loads(request.content)
        return httpx2.Response(200, json=reply('```json\n{"translation": " The house is old. "}\n```'))

    translation = client_for(handler).translate_sentence("Das Haus ist alt.", "de", "en")

    assert translation == "The house is old."
    prompt = seen["body"]["messages"][-1]["content"]
    assert "Das Haus ist alt." in prompt
    assert "German" in prompt
    assert "English" in prompt


@pytest.mark.parametrize(
    "content", ["Sorry.", '{"sentence": "x"}', '{"translation": " "}', '{"translation": 3}'], ids=str
)
def test_a_translation_that_cannot_be_read_raises_an_error(content) -> None:
    with pytest.raises(LlmError):
        parse_translation(content)


def test_translating_without_a_key_is_reported_and_nothing_is_sent() -> None:
    calls = []

    def handler(request: httpx2.Request) -> httpx2.Response:
        calls.append(request)
        return httpx2.Response(200, json=reply('{"translation": "x"}'))

    with pytest.raises(LlmNotConfigured):
        client_for(handler, llm_api_key="").translate_sentence("Das Haus ist alt.", "de", "en")

    assert calls == []
