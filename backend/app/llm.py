"""A client for the language model set in `.env`: it writes a sentence and its translation for a word."""

import json
import random
import re
import time
from collections.abc import Callable, Iterator
from dataclasses import dataclass, replace
from typing import Literal

import httpx2

from app.config import Settings, get_settings
from app.phrases import phrase_problem, same_phrase

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


class CardExists(Exception):
    """The learner already has a card for the word with the same meaning (DEC-013), so no new card is made.

    `phrase` is the phrase of that card. The message is safe to show to the learner.
    """

    def __init__(self, phrase: str) -> None:
        super().__init__(f'You already have a card for this word with the meaning of "{phrase}".')
        self.phrase = phrase


@dataclass(frozen=True)
class GeneratedSentence:
    sentence: str
    translation: str
    # The context phrase that goes with the word (DEC-013); None when the request did not ask for one.
    phrase: str | None = None


def build_messages(
    word: str,
    text_language: Language,
    first_language: Language,
    context: str | None,
    previous_sentence: str | None,
    locked_translation: str | None = None,
    ask_phrase: bool = False,
    known_phrases: "list[str] | dict[str, str] | None" = None,
    meaning_phrase: str | None = None,
) -> list[dict[str, str]]:
    if len(word.split()) > 1:
        # A card word of several words, such as a verb with a separable prefix: the words stay in this order and in
        # this form, and other words may stand between them.
        contains = (
            f'that contains all of these words, in this order and in this form, with other words allowed between them: "{word}"'
        )
    else:
        contains = f'that contains the word "{word}"'
    lines = [f"Write one short, natural example sentence in {LANGUAGE_NAMES[text_language]} {contains}."]
    if locked_translation:
        # The learner locked the translation: the new sentence must say what it says, and only the sentence is asked.
        lines.append(
            f"The sentence must mean the same as this {LANGUAGE_NAMES[first_language]} translation, "
            f'which the learner keeps: "{locked_translation}"'
        )
    else:
        lines.append(f"Then translate the sentence into {LANGUAGE_NAMES[first_language]}.")
    if context:
        lines.append(f'The word comes from this passage, so give it the same meaning: "{context}"')
    if previous_sentence:
        lines.append(f'Do not repeat this sentence, write a different one: "{previous_sentence}"')
    if meaning_phrase:
        # The learner's card keeps its meaning: a new sentence uses the word as this phrase does.
        lines.append(f'Use the word with the same meaning as in this phrase: "{meaning_phrase}"')
    if ask_phrase:
        lines.append(
            "Also write a minimal phrase of three or four words, in the same language, that uses this word "
            "in the meaning it has in the passage."
        )
        if known_phrases:
            # A dict maps each phrase to the translation of its card's sentence, which shows the meaning.
            translations = known_phrases if isinstance(known_phrases, dict) else {}
            listed = " ".join(
                f'{number}. "{phrase}" (card sentence: "{translations[phrase]}")'
                if translations.get(phrase)
                else f'{number}. "{phrase}"'
                for number, phrase in enumerate(known_phrases, start=1)
            )
            lines.append(
                f"The learner already has these cards for this word: {listed}. First write, in English, the meaning "
                'the word has in the passage, as a short dictionary gloss, in the field "meaning". Then, for each '
                'numbered card, write true in the field "same_meaning" if the word has that same meaning on the card, '
                "and false if it does not, one value for each card, in the order of the list. The meaning is the sense "
                "of the word that a dictionary lists: a different sentence, a different situation, or a different "
                'verb or preposition next to the word is not a different meaning. For example, "match" as a game is '
                'one meaning, whether the phrase is "a football match" or "win the match", and "match" as a small '
                "stick for lighting a fire is another."
            )
    form = ['"meaning": "...", "same_meaning": [true or false for each card]'] if ask_phrase and known_phrases else []
    form += ['"sentence": "..."'] if locked_translation else ['"sentence": "..."', '"translation": "..."']
    if ask_phrase:
        form.append('"phrase": "..."')
    lines.append("Answer only with JSON, in this form: {" + ", ".join(form) + "}")
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


def read_phrase(content: str, word: str, known_phrases: list[str]) -> str:
    """The phrase in the model's answer to a request that asked for one.

    Raises `CardExists` when the model says the word has the same meaning as a phrase the learner already has, or when
    the phrase it wrote is one of them. Raises `LlmError` when the answer has no usable phrase.
    """
    text = re.sub(r"```(?:json)?", "", content)
    start, end = text.find("{"), text.rfind("}")
    try:
        data = json.loads(text[start : end + 1])
    except ValueError:
        raise LlmError("The language model gave an answer that could not be read.") from None
    if not isinstance(data, dict):
        raise LlmError("The language model gave an answer that could not be read.")
    same_meaning = data.get("same_meaning")
    if isinstance(same_meaning, list):
        for known, same in zip(known_phrases, same_meaning, strict=False):
            if same is True or (isinstance(same, str) and same.strip().casefold() == "true"):
                raise CardExists(known)
    phrase = data.get("phrase")
    if not isinstance(phrase, str) or phrase_problem(word, phrase.strip()):
        raise LlmError("The language model gave a phrase that could not be used.")
    phrase = " ".join(phrase.split())
    for known in known_phrases:
        if same_phrase(known, phrase):
            raise CardExists(known)
    return phrase


def parse_sentence(content: str, translation: str) -> GeneratedSentence:
    """Read the answer to a request that had a locked translation: only the sentence is new."""
    text = re.sub(r"```(?:json)?", "", content)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end < start:
        raise LlmError("The language model gave an answer that could not be read.")
    try:
        sentence = json.loads(text[start : end + 1])["sentence"]
    except (ValueError, KeyError, TypeError):
        raise LlmError("The language model gave an answer that could not be read.") from None
    if not isinstance(sentence, str):
        raise LlmError("The language model gave an answer that could not be read.")
    if not sentence.strip():
        raise LlmError("The language model gave an answer without a sentence.")
    return GeneratedSentence(sentence.strip(), translation)


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
        locked_translation: str | None = None,
        ask_phrase: bool = False,
        known_phrases: "list[str] | dict[str, str] | None" = None,
        meaning_phrase: str | None = None,
    ) -> GeneratedSentence:
        """Ask the model for a sentence with `word` and its translation.

        Pass `ask_phrase` to get the context phrase that identifies the card too (DEC-013), and `known_phrases`, the
        phrases of the cards that exist for the word: when the word has the same meaning as one of them, `CardExists`
        is raised. Pass `meaning_phrase`, the phrase of a card, so that a new sentence keeps the meaning of the word.

        Pass `previous_sentence` to ask for a different one. Pass `locked_translation` when the learner locked the
        translation: the sentence is written to mean the same, and the translation that comes back is that one. When the model does not answer for now, the request is
        repeated by itself, up to 5 requests in all, and a different error is not repeated. Raises `LlmError` with a
        message that is safe to show; the key never appears in it.
        """
        messages = build_messages(
            word,
            text_language,
            first_language,
            context,
            previous_sentence,
            locked_translation,
            ask_phrase,
            known_phrases,
            meaning_phrase,
        )
        answer = self._ask_again_when_unavailable(messages)
        phrase = read_phrase(answer, word, known_phrases or []) if ask_phrase else None
        result = parse_sentence(answer, locked_translation) if locked_translation else parse_answer(answer)
        return replace(result, phrase=phrase)

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
