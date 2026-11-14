"""Tries the "meaning record" the Customer asked for (issue #165, chat 2026-11-14 16:40 and 16:41).

The Customer suggested that each card keeps a meaning record, made by the model from the sentence of the card, and that
a new passage is judged against those records instead of against plain context phrases. His prompt is for German; here
it is adapted to the language of the word (the product accepts Russian, English and German). The cases are the ones of
`eval_fr009_revision.py`, so the results compare with its table.

How a case runs, as the app would run it:
  1. The word has no card yet: the app asks for the card as it does today (`build_messages`), and the model writes the
     meaning record of the sentence of the new card.
  2. The word has cards: the model writes the meaning record of the passage. A second question gives it the records
     of the cards and the record of the passage, and asks, for each card, whether it is the same sense.
     When one is, no card is made. When none is, the card is made as in step 1, with its record.

The wordings are `current` (the question the app sends today, for comparison on the same day) and `records`.
The rule below was written BEFORE the run: `records` is adopted only if, over all the runs, it makes fewer second cards
than `current` AND it refuses no needed card.

Run it from the `backend` folder, with the virtual environment active and the model of production in the environment:
    python scripts/eval_fr009_records.py --runs 2 --out ../../fr009-records-results.md

It stops before `--max-requests`, because the daily quota of the model is shared with the staging and production
environments (docs/deployment.md)."""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from eval_fr009_revision import GROUPS, ask, cell, count, verdict  # noqa: E402

from app.llm import (  # noqa: E402
    LANGUAGE_NAMES,
    LlmClient,
    LlmError,
    build_messages,
    parse_answer,
    read_phrase,
)

# Passages where the word is written in another form, so the word itself is not in the sentence.
FORMS = {
    "Дед косил траву острой косой.": "косой",
    "Она заплела косу перед школой.": "косу",
    "Косарь наточил косу перед работой.": "косу",
}

RECORD_PROMPT = """You are a lexicographer of {language}. In the sentence below, the word marked
⟨TARGET⟩...⟨/TARGET⟩ is used in one specific sense.

Sentence: {sentence}

Return JSON:
- lemma, pos
- sense_gloss: a short {language} definition of EXACTLY this sense
- synonym_substitute: a word/phrase that could replace the target here
without changing the meaning (lexical substitution test)
- typical_subjects/objects and syntactic frame (valency, reflexive,
preposition, separable prefix if the language has them)
- excluded_senses: 2–4 OTHER common senses of this lemma that must NOT be used
- disambiguating_cues: quote the minimal span of the sentence that fixes the sense
- confidence: high/medium/low (low if the context is genuinely ambiguous)
Answer only with the JSON."""

COMPARE_PROMPT = """The learner has these cards for the word "{word}". Each card has a meaning record, written from the sentence of the card:
{cards}

In a new passage the word has this meaning record:
{new}

For each numbered card, write true if the word of the new passage has the same sense as on that card, and false if it has another sense.
The same sense means the new sense_gloss says the same as the sense_gloss of the card, even when the sentence, the situation or the words next to the word are different.
Another sense means the new sense_gloss is a different dictionary sense, for example one of the excluded_senses of the card.
Answer only with JSON, in this form: {{"same_meaning": [true or false for each card]}}"""

ALL_VARIANTS = ["current", "records"]
SYSTEM = "You are a careful lexicographer."


def mark(sentence, word, text_language):
    """The sentence with the word between ⟨TARGET⟩ and ⟨/TARGET⟩."""
    form = FORMS.get(sentence) or word
    found = re.search(rf"(?<!\w){re.escape(form)}(?!\w)", sentence, re.IGNORECASE)
    if not found and len(word) > 3:
        found = re.search(rf"(?<!\w){re.escape(word[:-1])}\w{{0,2}}(?!\w)", sentence, re.IGNORECASE)
    if not found:
        return f"{sentence} (the word is: {word})"
    return f"{sentence[: found.start()]}⟨TARGET⟩{found.group(0)}⟨/TARGET⟩{sentence[found.end() :]}"


def read_json(content):
    """The JSON object in the answer of the model, even when it is in a code fence or in text."""
    text = re.sub(r"```(?:json)?", "", content)
    start, end = text.find("{"), text.rfind("}")
    try:
        data = json.loads(text[start : end + 1])
    except ValueError:
        raise LlmError("The language model gave an answer that could not be read.") from None
    if not isinstance(data, dict):
        raise LlmError("The language model gave an answer that could not be read.")
    return data


def make_record(client, word, text_language, sentence, prompts):
    """The meaning record of the word in `sentence`, as the model writes it."""
    question = RECORD_PROMPT.format(
        language=LANGUAGE_NAMES[text_language], sentence=mark(sentence, word, text_language)
    )
    prompts.setdefault("record", question)
    answer = client._ask_again_when_unavailable(
        [{"role": "system", "content": SYSTEM}, {"role": "user", "content": question}]
    )
    return read_json(answer)


def same_sense(client, word, records, new, prompts):
    """For each record of a card, True when the new record is the same sense."""
    cards = "\n".join(
        f"{number}. {json.dumps(record, ensure_ascii=False)}"
        for number, record in enumerate(records, start=1)
    )
    question = COMPARE_PROMPT.format(
        word=word, cards=cards, new=json.dumps(new, ensure_ascii=False)
    )
    prompts.setdefault("compare", question)
    answer = client._ask_again_when_unavailable(
        [{"role": "system", "content": SYSTEM}, {"role": "user", "content": question}]
    )
    verdicts = read_json(answer).get("same_meaning")
    if not isinstance(verdicts, list):
        raise LlmError("The language model gave an answer that could not be read.")
    return [
        same is True or (isinstance(same, str) and same.strip().casefold() == "true")
        for same in verdicts
    ]


def ask_records(client, word, text_language, first_language, passage, cards, prompts):
    """One case of the wording `records`. `cards` is the list of the records of the cards of the word."""
    try:
        if cards:
            new = make_record(client, word, text_language, passage, prompts)
            if any(same_sense(client, word, cards, new, prompts)):
                return "exists", str(new.get("sense_gloss", ""))
        messages = build_messages(
            word, text_language, first_language, passage, None, ask_phrase=True, known_phrases=None
        )
        answer = client._ask_again_when_unavailable(messages)
        phrase = read_phrase(answer, word, [])
        sentence = parse_answer(answer).sentence
        cards.append(make_record(client, word, text_language, sentence, prompts))
        return "new", phrase
    except LlmError as error:
        return "error", str(error)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--runs", type=int, default=2)
    parser.add_argument("--max-requests", type=int, default=320)
    parser.add_argument("--out", required=True, help="Markdown file to write the results to")
    args = parser.parse_args()
    variants = ALL_VARIANTS
    per_pass = sum(len(cases) for *_, cases in GROUPS)

    client = LlmClient()
    if not client.settings.llm_api_key or not client.settings.llm_model:
        sys.exit("LLM_API_KEY and LLM_MODEL must be set in the environment.")
    requests = 0
    original_ask = client._ask

    def counting_ask(messages):
        nonlocal requests
        if requests >= args.max_requests:
            sys.exit(f"Stopped: {requests} requests sent, the limit --max-requests is reached.")
        requests += 1
        return original_ask(messages)

    client._ask = counting_ask

    rows = []
    prompts: dict[str, str] = {}
    for run in range(1, args.runs + 1):
        for variant in variants:
            print(f"\n===== {variant}, run {run} =====", flush=True)
            for word, text_language, first_language, cases in GROUPS:
                known: dict[str, str] = {}
                cards: list[dict] = []
                for passage, expected in cases:
                    if variant == "current":
                        got, detail = ask(
                            client, variant, word, text_language, first_language, passage, known
                        )
                    else:
                        got, detail = ask_records(
                            client, word, text_language, first_language, passage, cards, prompts
                        )
                    ok = got == expected
                    rows.append(
                        {
                            "variant": variant,
                            "run": run,
                            "word": word,
                            "expected": expected,
                            "got": got,
                            "passage": passage,
                            "detail": detail,
                        }
                    )
                    print(
                        f"{'ok   ' if ok else 'WRONG'} {word:8} expected {expected:6} got {got:6} {passage}  [{detail}]",
                        flush=True,
                    )
    client.close()

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    out = [
        "# FR-009 meaning records test",
        "",
        f"- **Model:** `{client.settings.llm_model}`",
        f"- **Run at:** {now}",
        f"- **Requests sent to the model (retries included):** {requests}",
        f"- **Wordings:** {', '.join(variants)}",
        f"- **Runs of each wording:** {args.runs}",
        f"- **Cases in each run:** {per_pass}, the same as in `eval_fr009_revision.py`",
        "",
        "## Totals",
        "",
        "| Wording | Cases | As expected | Second cards made | Needed cards refused | Errors |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for variant in variants:
        out.append(f"| {variant} | " + " | ".join(str(n) for n in count(rows, variant)) + " |")
    out += [
        "",
        "**Rule written before the run:** `records` is adopted only if it makes fewer second cards than `current` and refuses no needed card.",
        "",
        f"- **records:** {verdict(rows, 'records')}",
        "",
        "## Prompts used for `records` (the first of each)",
        "",
        "Record of a sentence:",
        "",
        "```text",
        prompts.get("record", ""),
        "```",
        "",
        "Comparison of a passage with the cards:",
        "",
        "```text",
        prompts.get("compare", ""),
        "```",
        "",
        "## Cases",
        "",
        "| Wording | Run | Word | Passage | Expected | Got | Result | Phrase, sense or message |",
        "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for row in rows:
        ok = "ok" if row["got"] == row["expected"] else "WRONG"
        out.append(
            f"| {row['variant']} | {row['run']} | {row['word']} | {cell(row['passage'])} | {row['expected']} | "
            f"{row['got']} | {ok} | {cell(row['detail'])} |"
        )
    Path(args.out).write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"\nWritten to {args.out}")
    for variant in variants:
        cases, right, second, refused, errors = count(rows, variant)
        print(
            f"{variant}: {right} of {cases} as expected, {second} second cards, {refused} needed refused, {errors} errors"
        )
    print(f"records: {verdict(rows, 'records')}")
    print(f"Requests sent: {requests}")


if __name__ == "__main__":
    main()
