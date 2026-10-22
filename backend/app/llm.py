"""A client for the language model set in `.env`: it writes a sentence and its translation for a word."""

import json
import random
import re
import time
from collections.abc import Callable, Iterator
from dataclasses import dataclass
from typing import Literal

import httpx2

from app.config import Settings, get_settings

Language = Literal["ru", "en", "de"]
LANGUAGE_NAMES = {"ru": "Russian", "en": "English", "de": "German"}
TIMEOUT_SECONDS = 30.0
# A status that says the service is overloaded or down for now (a free model does this from time to time).
UNAVAILABLE_STATUSES = {408, 429, 500, 502, 503, 504}
# Seconds to wait before each new request for a sentence: 5 requests in all, as `DEC-024` says. A random time of up to
# `MAX_JITTER_SECONDS` is added each time, so that many requests do not come back at the same moment.
RETRY_WAIT_SECONDS = (1, 2, 4, 8)
MAX_JITTER_SECONDS = 1.0
# The most of the reason that a service gives for an error that is shown to the learner.
MAX_REASON_CHARACTERS = 200


class LlmError(Exception):
    """The language model did not give a usable answer. The message is safe to show to the learner."""


class LlmUnavailable(LlmError):
    """The model did not answer for now (too slow, not reachable or overloaded), so a new request may work."""


class LlmNotConfigured(LlmError):
    """The key or the model name is missing in `.env`."""


@dataclass(frozen=True)
class GeneratedSentence:
    sentence: str
    translation: str


def build_messages(
    word: str,
    text_language: Language,
    first_language: Language,
    context: str | None,
    previous_sentence: str | None,
) -> list[dict[str, str]]:
    if len(word.split()) > 1:
        # A card word of several words, such as a verb with a separable prefix: the words stay in this order and in
        # this form, and other words may stand between them.
        contains = (
            f'that contains all of these words, in this order and in this form, with other words allowed between them: "{word}"'
        )
    else:
        contains = f'that contains the word "{word}"'
    lines = [
        f"Write one short, natural example sentence in {LANGUAGE_NAMES[text_language]} {contains}.",
        f"Then translate the sentence into {LANGUAGE_NAMES[first_language]}.",
    ]
    if context:
        lines.append(f'The word comes from this passage, so give it the same meaning: "{context}"')
    if previous_sentence:
        lines.append(f'Do not repeat this sentence, write a different one: "{previous_sentence}"')
    lines.append('Answer only with JSON, in this form: {"sentence": "...", "translation": "..."}')
    return [
        {"role": "system", "content": "You write example sentences for people who learn a language."},
        {"role": "user", "content": "\n".join(lines)},
    ]


def parse_answer(content: str) -> GeneratedSentence:
    """Read the JSON the model was asked for, even when it is wrapped in a code fence or in text."""
    text = re.sub(r"```(?:json)?", "", content)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end < start:
        raise LlmError("The language model gave an answer that could not be read.")
    try:
        data = json.loads(text[start : end + 1])
        sentence, translation = data["sentence"], data["translation"]
    except (ValueError, KeyError, TypeError):
        raise LlmError("The language model gave an answer that could not be read.") from None
    if not isinstance(sentence, str) or not isinstance(translation, str):
        raise LlmError("The language model gave an answer that could not be read.")
    if not sentence.strip() or not translation.strip():
        raise LlmError("The language model gave an answer without a sentence or a translation.")
    return GeneratedSentence(sentence.strip(), translation.strip())


def build_translation_messages(
    sentence: str, text_language: Language, first_language: Language
) -> list[dict[str, str]]:
    lines = [
        f'Translate this {LANGUAGE_NAMES[text_language]} sentence into {LANGUAGE_NAMES[first_language]}: "{sentence}"',
        'Answer only with JSON, in this form: {"translation": "..."}',
    ]
    return [
        {"role": "system", "content": "You translate example sentences for people who learn a language."},
        {"role": "user", "content": "\n".join(lines)},
    ]


def parse_translation(content: str) -> str:
    """Read the JSON the model was asked for, even when it is wrapped in a code fence or in text."""
    text = re.sub(r"```(?:json)?", "", content)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end < start:
        raise LlmError("The language model gave an answer that could not be read.")
    try:
        translation = json.loads(text[start : end + 1])["translation"]
    except (ValueError, KeyError, TypeError):
        raise LlmError("The language model gave an answer that could not be read.") from None
    if not isinstance(translation, str):
        raise LlmError("The language model gave an answer that could not be read.")
    if not translation.strip():
        raise LlmError("The language model gave an answer without a translation.")
    return translation.strip()


class LlmClient:
    def __init__(
        self,
        settings: Settings | None = None,
        http_client: httpx2.Client | None = None,
        sleep: Callable[[float], None] = time.sleep,
    ) -> None:
        self.settings = settings or get_settings()
        self.http_client = http_client or httpx2.Client(timeout=TIMEOUT_SECONDS)
        self.sleep = sleep

    def close(self) -> None:
        self.http_client.close()

    def write_sentence(
        self,
        word: str,
        text_language: Language,
        first_language: Language,
        context: str | None = None,
        previous_sentence: str | None = None,
    ) -> GeneratedSentence:
        """Ask the model for a sentence with `word` and its translation.

        Pass `previous_sentence` to ask for a different one. When the model does not answer for now, the request is
        repeated by itself, up to 5 requests in all, and a different error is not repeated. Raises `LlmError` with a
        message that is safe to show; the key never appears in it.
        """
        messages = build_messages(word, text_language, first_language, context, previous_sentence)
        return parse_answer(self._ask_again_when_unavailable(messages))

    def translate_sentence(self, sentence: str, text_language: Language, first_language: Language) -> str:
        """Ask the model to translate a sentence the learner wrote or edited. Raises `LlmError` like `write_sentence`."""
        return parse_translation(self._ask(build_translation_messages(sentence, text_language, first_language)))

    def _ask_again_when_unavailable(self, messages: list[dict[str, str]]) -> str:
        """Like `_ask`, but a model that does not answer for now is asked again after a wait that grows each time."""
        for wait in RETRY_WAIT_SECONDS:
            try:
                return self._ask(messages)
            except LlmUnavailable:
                self.sleep(wait + random.uniform(0, MAX_JITTER_SECONDS))
        return self._ask(messages)

    def _reason_of(self, response: httpx2.Response) -> str:
        """The reason the service gave for an error, as a short sentence that starts with a space; empty when it gave
        none that is readable. The key is never shown, even if the service repeats it."""
        try:
            data = response.json()
        except ValueError:
            return ""
        if isinstance(data, list) and data:
            data = data[0]
        error = data.get("error") if isinstance(data, dict) else None
        reason = error.get("message") if isinstance(error, dict) else error
        if not isinstance(reason, str):
            return ""
        key = self.settings.llm_api_key
        if key:
            reason = reason.replace(key, "...")
        reason = " ".join(reason.split())
        if not reason:
            return ""
        if len(reason) > MAX_REASON_CHARACTERS:
            reason = reason[:MAX_REASON_CHARACTERS].rstrip() + "..."
        return f" {reason}" if reason.endswith((".", "!", "?")) else f" {reason}."

    def _ask(self, messages: list[dict[str, str]]) -> str:
        """Send the messages to the model and return the text of its answer."""
        if not self.settings.llm_api_key or not self.settings.llm_model:
            raise LlmNotConfigured("The language model is not set up: add LLM_API_KEY and LLM_MODEL to .env.")

        url = self.settings.llm_base_url.rstrip("/") + "/chat/completions"
        payload = {
            "model": self.settings.llm_model,
            "messages": messages,
        }
        try:
            response = self.http_client.post(
                url, json=payload, headers={"Authorization": f"Bearer {self.settings.llm_api_key}"}
            )
        except httpx2.TimeoutException:
            raise LlmUnavailable("The language model took too long to answer.") from None
        except httpx2.HTTPError:
            raise LlmUnavailable("The language model could not be reached.") from None
        if response.status_code in UNAVAILABLE_STATUSES:
            raise LlmUnavailable("The language model is not available right now. Try again in a moment.")
        if response.status_code >= 400:
            reason = self._reason_of(response)
            raise LlmError(f"The language model returned an error (status {response.status_code}).{reason}")
        try:
            content = response.json()["choices"][0]["message"]["content"]
        except (ValueError, KeyError, IndexError, TypeError):
            raise LlmError("The language model gave an answer that could not be read.") from None
        if not isinstance(content, str):
            raise LlmError("The language model gave an answer that could not be read.")
        return content


def get_llm_client() -> Iterator[LlmClient]:
    """A client for one request, closed afterwards. Use it with `Depends`."""
    client = LlmClient()
    try:
        yield client
    finally:
        client.close()
