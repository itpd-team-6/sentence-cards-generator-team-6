"""A client for the language model set in `.env`: it writes a sentence and its translation for a word."""

import json
import re
from collections.abc import Iterator
from dataclasses import dataclass
from typing import Literal

import httpx2

from app.config import Settings, get_settings

Language = Literal["ru", "en", "de"]
LANGUAGE_NAMES = {"ru": "Russian", "en": "English", "de": "German"}
TIMEOUT_SECONDS = 30.0


class LlmError(Exception):
    """The language model did not give a usable answer. The message is safe to show to the learner."""


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
    lines = [
        f'Write one short, natural example sentence in {LANGUAGE_NAMES[text_language]} that contains the word "{word}".',
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


class LlmClient:
    def __init__(self, settings: Settings | None = None, http_client: httpx2.Client | None = None) -> None:
        self.settings = settings or get_settings()
        self.http_client = http_client or httpx2.Client(timeout=TIMEOUT_SECONDS)

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

        Pass `previous_sentence` to ask for a different one. Raises `LlmError` with a message that is safe
        to show; the key never appears in it.
        """
        if not self.settings.llm_api_key or not self.settings.llm_model:
            raise LlmNotConfigured("The language model is not set up: add LLM_API_KEY and LLM_MODEL to .env.")

        url = self.settings.llm_base_url.rstrip("/") + "/chat/completions"
        payload = {
            "model": self.settings.llm_model,
            "messages": build_messages(word, text_language, first_language, context, previous_sentence),
        }
        try:
            response = self.http_client.post(
                url, json=payload, headers={"Authorization": f"Bearer {self.settings.llm_api_key}"}
            )
        except httpx2.TimeoutException:
            raise LlmError("The language model took too long to answer.") from None
        except httpx2.HTTPError:
            raise LlmError("The language model could not be reached.") from None
        if response.status_code >= 400:
            raise LlmError(f"The language model returned an error (status {response.status_code}).")
        try:
            content = response.json()["choices"][0]["message"]["content"]
        except (ValueError, KeyError, IndexError, TypeError):
            raise LlmError("The language model gave an answer that could not be read.") from None
        if not isinstance(content, str):
            raise LlmError("The language model gave an answer that could not be read.")
        return parse_answer(content)


def get_llm_client() -> Iterator[LlmClient]:
    """A client for one request, closed afterwards. Use it with `Depends`."""
    client = LlmClient()
    try:
        yield client
    finally:
        client.close()
