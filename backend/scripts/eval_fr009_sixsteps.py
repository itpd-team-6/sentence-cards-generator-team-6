"""Tries the six steps for the meaning records that the Customer described (issue #293).

The Customer wrote in the group chat on 2026-11-14 at 22:44 that the first test of the records did not follow the
approach he had in mind, and described six steps:
  1. Gather the original context: the word combination and the sentences where its words appear.
  2. Ask the model for the lemma (the normalized form) of the word combination.
  3. Find all the meaning records keyed by that lemma.
  4. Give the model the word combination, its sentences and all the records found.
  5. Ask the model which record matches the word combination.
  6. If one matches, use that one; if none does, create a new meaning record.

How a case runs here:
  1. The case gives the word the learner selected and the sentence of the text (the passage).
  2. One request asks for the lemma. The lemma, with the language of the text, is the key of the records.
  3. The records of that key are looked up in a store that lives in the script, one store for each run.
  4 and 5. When the store has records for the key, one request gives the model the word, the sentence and the numbered
     records, and asks which one matches (a number, or none).
  6. When one matches, no card is made ("exists"). When none matches, or there are no records, the model writes a new
     meaning record from the sentence of the text, with the Customer's prompt, the record is stored under the lemma,
     and a card is made ("new").

The record is written from the sentence of the text, as in step 6, and not from the sentence the model writes for the
card, as in the first test of the records (`eval_fr009_records.py`). The script does not write the sentence of the card:
what the six steps decide is whether a card is made. The two instructions that are not the Customer's words, the question
of the lemma and the question of the match, are the team's wording of his steps 2 and 5.

The cases are the ones of `eval_fr009_revision.py`, so the results compare with its table. The wordings are `current`
(the question the app sends today, run on the same day for comparison) and `sixsteps`. The rule below was written
BEFORE the run: `sixsteps` is adopted only if, over all the runs, it makes fewer second cards than `current` AND it
refuses no needed card.

Run it from the `backend` folder, with the virtual environment active and the model of production in the environment:
    python scripts/eval_fr009_sixsteps.py --runs 2 --out ../docs/research/fr-009-sixsteps-results.md

It never sends more than `--max-requests` requests, and it writes the results of the cases it did run, because the daily
quota of the model is shared with the staging and production environments (docs/deployment.md)."""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from eval_fr009_records import FORMS, SYSTEM, make_record, mark, read_json  # noqa: E402
from eval_fr009_revision import GROUPS, ask, cell, count, verdict  # noqa: E402

from app.llm import LANGUAGE_NAMES, LlmClient, LlmError  # noqa: E402

LEMMA_PROMPT = """You are a lexicographer of {language}. A learner selected the word combination "{selected}" in this sentence:
{sentence}

Write the lemma of the word combination: its normalized dictionary form, without an article.
Answer only with JSON, in this form: {{"lemma": "..."}}"""

MATCH_PROMPT = """You are a lexicographer of {language}. A learner selected the word combination "{selected}" in this sentence:
{sentence}

These meaning records exist for the lemma "{lemma}":
{records}

Decide which meaning record matches the word combination in the sentence.
A record matches when the word combination has, in the sentence, the sense that the sense_gloss of the record describes, and not one of the excluded_senses of the record.
If no record matches, there is no match.
Answer only with JSON, in this form: {{"match": <the number of the matching record, or null if none>, "reason": "<at most 15 words>"}}"""

CALLS_PER_CASE = 3
RETRY_MARGIN = 6


def ask_model(client, question):
    """One request with the system message of the records test. Returns the JSON object of the answer."""
    return read_json(
        client._ask_again_when_unavailable(
            [{"role": "system", "content": SYSTEM}, {"role": "user", "content": question}]
        )
    )


def read_lemma(client, word, text_language, passage, prompts):
    """Step 2: the lemma of the word combination, as the model writes it."""
    question = LEMMA_PROMPT.format(
        language=LANGUAGE_NAMES[text_language],
        selected=FORMS.get(passage) or word,
        sentence=mark(passage, word, text_language),
    )
    prompts.setdefault("lemma", question)
    lemma = ask_model(client, question).get("lemma")
    if not isinstance(lemma, str) or not lemma.strip():
        raise LlmError("The language model gave an answer that could not be read.")
    return lemma.strip()


def find_match(client, word, text_language, passage, lemma, records, prompts):
    """Steps 4 and 5: the number (from 1) of the record that matches, or None, and the reason the model gives."""
    listed = "\n".join(
        f"{number}. {json.dumps(record, ensure_ascii=False)}"
        for number, record in enumerate(records, start=1)
    )
    question = MATCH_PROMPT.format(
        language=LANGUAGE_NAMES[text_language],
        selected=FORMS.get(passage) or word,
        sentence=mark(passage, word, text_language),
        lemma=lemma,
        records=listed,
    )
    prompts.setdefault("match", question)
    data = ask_model(client, question)
    match = data.get("match")
    reason = str(data.get("reason", ""))
    if match is None or (
        isinstance(match, str) and match.strip().casefold() in ("null", "none", "")
    ):
        return None, reason
    try:
        number = int(match)
    except (TypeError, ValueError):
        raise LlmError("The language model gave an answer that could not be read.") from None
    if not 1 <= number <= len(records):
        raise LlmError("The language model gave an answer that could not be read.")
    return number, reason


def ask_sixsteps(client, word, text_language, passage, store, prompts):
    """One case of the wording `sixsteps`. Returns (got, lemma, sense or message)."""
    lemma = ""
    try:
        lemma = read_lemma(client, word, text_language, passage, prompts)
        key = (text_language, lemma.casefold())
        records = store.get(key, [])
        if records:
            number, reason = find_match(
                client, word, text_language, passage, lemma, records, prompts
            )
            if number is not None:
                gloss = str(records[number - 1].get("sense_gloss", ""))
                return "exists", lemma, f"record {number}: {gloss} ({reason})"
        record = make_record(client, word, text_language, passage, prompts)
        store.setdefault(key, []).append(record)
        return "new", lemma, f"new record: {record.get('sense_gloss', '')}"
    except LlmError as error:
        return "error", lemma, str(error)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--runs", type=int, default=2)
    parser.add_argument("--max-requests", type=int, default=300)
    parser.add_argument(
        "--skip-current",
        action="store_true",
        help="do not run `current` (the rule needs it, so the verdict is not decided)",
    )
    parser.add_argument("--out", required=True, help="Markdown file to write the results to")
    args = parser.parse_args()
    variants = ["sixsteps"] if args.skip_current else ["current", "sixsteps"]
    per_pass = sum(len(cases) for *_, cases in GROUPS)

    client = LlmClient()
    if not client.settings.llm_api_key or not client.settings.llm_model:
        sys.exit("LLM_API_KEY and LLM_MODEL must be set in the environment.")
    requests = 0
    original_ask = client._ask

    def counting_ask(messages):
        nonlocal requests
        requests += 1
        return original_ask(messages)

    client._ask = counting_ask

    rows = []
    prompts: dict[str, str] = {}
    stopped = False
    for run in range(1, args.runs + 1):
        for variant in variants:
            if stopped:
                break
            print(f"\n===== {variant}, run {run} =====", flush=True)
            store: dict[tuple[str, str], list[dict]] = {}
            for word, text_language, first_language, cases in GROUPS:
                known: dict[str, str] = {}
                for passage, expected in cases:
                    if requests + CALLS_PER_CASE + RETRY_MARGIN > args.max_requests:
                        stopped = True
                        break
                    lemma = ""
                    if variant == "current":
                        got, detail = ask(
                            client, variant, word, text_language, first_language, passage, known
                        )
                    else:
                        got, lemma, detail = ask_sixsteps(
                            client, word, text_language, passage, store, prompts
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
                            "lemma": lemma,
                            "detail": detail,
                        }
                    )
                    print(
                        f"{'ok   ' if ok else 'WRONG'} {word:8} expected {expected:6} got {got:6} "
                        f"{passage}  [{lemma}] [{detail}]",
                        flush=True,
                    )
                if stopped:
                    break
    client.close()

    decided = "current" in variants and not stopped
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    out = [
        "# FR-009 meaning records, the six steps of the Customer",
        "",
        f"- **Model:** `{client.settings.llm_model}`",
        f"- **Run at:** {now}",
        f"- **Requests sent to the model (retries included):** {requests}",
        f"- **Wordings:** {', '.join(variants)}",
        f"- **Runs of each wording:** {args.runs}",
        f"- **Cases in each run:** {per_pass}, the same as in `eval_fr009_revision.py`",
    ]
    if stopped:
        out.append(
            f"- **Stopped early:** the limit of {args.max_requests} requests was near, so not every case ran."
        )
    out += [
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
        "**Rule written before the run:** `sixsteps` is adopted only if it makes fewer second cards than `current` and refuses no needed card.",
        "",
        f"- **sixsteps:** {verdict(rows, 'sixsteps') if decided else 'NOT DECIDED: the run had no `current` or stopped early, so it cannot be compared.'}",
        "",
        "## How a case runs",
        "",
        "1. The case gives the word the learner selected and the sentence of the text.",
        "2. One request asks the model for the lemma of the word.",
        "3. The records of that lemma, in the language of the text, are looked up in the store of the run.",
        "4. and 5. When there are records, one request gives the model the word, the sentence and the numbered records, and asks which one matches.",
        "6. When one matches, no card is made. When none matches, the model writes a new record from the sentence, the record is stored, and a card is made.",
        "",
        "The script does not write the sentence of the card, because what the six steps decide is whether a card is made.",
        "",
        "## Prompts used (the first of each)",
        "",
        "Lemma (step 2):",
        "",
        "```text",
        prompts.get("lemma", ""),
        "```",
        "",
        "Match (steps 4 and 5):",
        "",
        "```text",
        prompts.get("match", ""),
        "```",
        "",
        "New meaning record (step 6):",
        "",
        "```text",
        prompts.get("record", ""),
        "```",
        "",
        "## Cases",
        "",
        "| Wording | Run | Word | Passage | Expected | Got | Result | Lemma | Sense, phrase or message |",
        "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for row in rows:
        ok = "ok" if row["got"] == row["expected"] else "WRONG"
        out.append(
            f"| {row['variant']} | {row['run']} | {row['word']} | {cell(row['passage'])} | {row['expected']} | "
            f"{row['got']} | {ok} | {cell(row['lemma'] or '-')} | {cell(row['detail'])} |"
        )
    Path(args.out).write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"\nWritten to {args.out}")
    for variant in variants:
        cases, right, second, refused, errors = count(rows, variant)
        print(
            f"{variant}: {right} of {cases} as expected, {second} second cards, {refused} needed refused, {errors} errors"
        )
    print(
        f"sixsteps: {verdict(rows, 'sixsteps') if decided else 'NOT DECIDED (no current, or stopped early)'}"
    )
    print(f"Requests sent: {requests}")


if __name__ == "__main__":
    main()
