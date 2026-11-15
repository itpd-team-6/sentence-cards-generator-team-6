"""Runs the test table of FR-009 against the language model set in `.env` and writes the results as Markdown.

It uses the code of the app (the prompt, the reading of the answer, the repeat when the model is busy), without the
screen, and it does not touch any database. Each case is one request; a case that expects "exists" is only meaningful
after the cards of the same word were made, so the cases of a word run in order, as in the app.

Two ways of asking are compared:
  current   the question the app sends today (`build_messages` in `app/llm.py`);
  customer  the same question, with the input in the format the Customer proposed in the group chat on
            2026-10-24 00:11: "<word>|<sentence>|<phrase of card 1>|<phrase of card 2>".

Run it from the `backend` folder, with the virtual environment active:
    python scripts/eval_fr009.py --out ../../fr009-results.md
    python scripts/eval_fr009.py --runs 2 --variants current --out ../../fr009-results.md

It counts the requests and stops before `--max-requests`, because the daily quota of the model is shared with the
staging and production environments (docs/deployment.md)."""

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.llm import (  # noqa: E402
    LANGUAGE_NAMES,
    CardExists,
    LlmClient,
    LlmError,
    parse_answer,
    read_phrase,
)

# Each group: (word, language of the text, language of the translation, label, [(passage, expected)]).
# "new" means a card must be made, "exists" means no new card, because the word already has one with that meaning.
GROUPS = [
    # The 15 cases of the Week 4 run (issue #94), short passages.
    (
        "Zug",
        "de",
        "en",
        "short",
        [
            ("Ich muss schnell rennen, um den Zug noch zu bekommen.", "new"),
            ("Der Zug aus München kommt heute spät an.", "exists"),
            ("Mit einem Zug trank er das ganze Glas leer.", "new"),
            ("Der nächste Zug im Schachspiel war entscheidend.", "new"),
            ("Sein kluger Zug überraschte alle.", "exists"),
            ("Wir warten auf den Zug nach Berlin.", "exists"),
            ("Er leerte das Bier in einem Zug.", "exists"),
        ],
    ),
    (
        "Bank",
        "de",
        "en",
        "short",
        [
            ("Wir sitzen auf der Bank im Park.", "new"),
            ("Die Bank im Garten ist ganz neu.", "exists"),
            ("Ich gehe zur Bank, um Geld abzuheben.", "new"),
            ("Die Bank hat meinen Kredit abgelehnt.", "exists"),
        ],
    ),
    (
        "Schloss",
        "de",
        "en",
        "short",
        [
            ("Das Schloss am Fluss ist sehr alt.", "new"),
            ("Der König wohnt im Schloss.", "exists"),
            ("Das Schloss an der Tür klemmt.", "new"),
            ("Ich habe den Schlüssel für das Schloss verloren.", "exists"),
        ],
    ),
    # Longer passages of about 30 words, as the Customer asked on 2026-10-24 00:01.
    (
        "Zug",
        "de",
        "en",
        "long",
        [
            (
                "Nach dem langen Arbeitstag lief er zum Bahnhof, kaufte eine Fahrkarte und wartete auf dem Bahnsteig, "
                "bis endlich der Zug nach Hamburg einfuhr und sich die Türen öffneten.",
                "new",
            ),
            (
                "Im Café bestellte sie ein großes Glas Wasser, setzte es an die Lippen und trank es nach der "
                "anstrengenden Wanderung in einem Zug leer, ohne ein einziges Mal abzusetzen.",
                "new",
            ),
            (
                "Am Gleis sieben stand schon der Zug nach München, aber wegen eines Signalfehlers musste die ganze "
                "Reisegruppe fast eine Stunde lang auf die Abfahrt warten.",
                "exists",
            ),
            (
                "Der Gastwirt reichte ihm einen Krug, und der durstige Wanderer leerte ihn nach dem langen Aufstieg "
                "mit einem einzigen Zug, bevor er sich lachend auf die Bank fallen ließ.",
                "exists",
            ),
        ],
    ),
    (
        "Schloss",
        "de",
        "en",
        "long",
        [
            (
                "Auf dem Hügel über dem Dorf steht seit vielen Jahrhunderten ein prächtiges Schloss, das im Sommer "
                "von Touristen aus aller Welt besucht wird.",
                "new",
            ),
            (
                "Als er nach Hause kam, ließ sich der Schlüssel nicht mehr drehen, weil das Schloss der alten "
                "Haustür im kalten Winter eingefroren war.",
                "new",
            ),
            (
                "Die Führung durch das Schloss dauerte zwei Stunden, und der Guide zeigte den Besuchern den Thronsaal "
                "und die königlichen Gärten.",
                "exists",
            ),
            (
                "Der Einbrecher versuchte vergeblich, das Schloss der Kellertür mit einem Draht zu öffnen, bis die "
                "Polizei ihn überraschte.",
                "exists",
            ),
        ],
    ),
    # Other words and other languages.
    (
        "match",
        "en",
        "ru",
        "short",
        [
            ("The football match starts at eight tonight.", "new"),
            ("She watched the match on television with her brother.", "exists"),
            ("He struck a match to light the candle.", "new"),
            ("I could not find a match to light the fire.", "exists"),
        ],
    ),
    (
        "bank",
        "en",
        "ru",
        "short",
        [
            ("We had a picnic on the bank of the river.", "new"),
            ("The bank of the stream was muddy after the rain.", "exists"),
            ("I opened an account at the bank yesterday.", "new"),
            ("The bank closes at five on Fridays.", "exists"),
        ],
    ),
    (
        "ключ",
        "ru",
        "en",
        "short",
        [
            ("Я потерял ключ от квартиры.", "new"),
            ("Он вставил ключ в замок и повернул его.", "exists"),
            ("Из-под земли бьёт холодный ключ.", "new"),
            ("Мы набрали воды из лесного ключа.", "exists"),
            ("Слесарь взял гаечный ключ и затянул гайку.", "new"),
        ],
    ),
]


def customer_messages(word, text_language, first_language, passage, known):
    """The question with the input in the Customer's format (group chat, 2026-10-24 00:11)."""
    line = "|".join([word, passage, *known])
    lines = [
        f'Write one short, natural example sentence in {LANGUAGE_NAMES[text_language]} that contains the word "{word}".',
        f"Then translate the sentence into {LANGUAGE_NAMES[first_language]}.",
        "Also write a minimal phrase of three or four words, in the same language, that uses this word in the "
        "meaning it has in the passage.",
        'The input is one line, in this form: "<word>|<sentence where the word was selected>|<context phrase 1 from '
        'an existing card for the word>|<context phrase 2 from an existing card for the word>". '
        f'The input: "{line}"',
    ]
    form = []
    if known:
        lines.append(
            "First write, in English, the meaning the word has in the sentence, as a short dictionary gloss, in the "
            'field "meaning". Then, for each context phrase of the input, in order, write true in the field '
            '"same_meaning" if the word has that same meaning in the phrase, and false if it does not. The meaning is '
            "the sense that a dictionary lists: a different sentence or a different situation is not a different meaning."
        )
        form.append('"meaning": "...", "same_meaning": [true or false for each context phrase]')
    form += ['"sentence": "..."', '"translation": "..."', '"phrase": "..."']
    lines.append("Answer only with JSON, in this form: {" + ", ".join(form) + "}")
    return [
        {
            "role": "system",
            "content": "You write example sentences for people who learn a language.",
        },
        {"role": "user", "content": "\n".join(lines)},
    ]


def ask(client, variant, word, text_language, first_language, passage, known):
    """One request. Returns (got, phrase or message)."""
    try:
        if variant == "current":
            result = client.write_sentence(
                word,
                text_language,
                first_language,
                passage,
                ask_phrase=True,
                known_phrases=dict(known) or None,
            )
            known[result.phrase] = result.translation
            return "new", result.phrase
        messages = customer_messages(word, text_language, first_language, passage, list(known))
        answer = client._ask_again_when_unavailable(messages)
        phrase = read_phrase(answer, word, list(known))
        known[phrase] = parse_answer(answer).translation
        return "new", phrase
    except CardExists as exists:
        return "exists", exists.phrase
    except LlmError as error:
        return "error", str(error)


def cell(text):
    return str(text).replace("|", "\\|").replace("\n", " ")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--runs", type=int, default=1)
    parser.add_argument("--variants", default="current,customer")
    parser.add_argument("--max-requests", type=int, default=150)
    parser.add_argument("--out", required=True, help="Markdown file to write the results to")
    args = parser.parse_args()
    variants = [name.strip() for name in args.variants.split(",") if name.strip()]
    per_pass = sum(len(cases) for *_, cases in GROUPS)
    planned = per_pass * args.runs * len(variants)
    if planned > args.max_requests:
        sys.exit(
            f"{planned} requests planned, more than --max-requests {args.max_requests}. Lower --runs or --variants."
        )

    client = LlmClient()
    if not client.settings.llm_api_key or not client.settings.llm_model:
        sys.exit("LLM_API_KEY and LLM_MODEL must be set in .env.")
    requests = 0
    original_ask = client._ask

    def counting_ask(messages):
        nonlocal requests
        requests += 1
        return original_ask(messages)

    client._ask = counting_ask

    rows, totals = [], {}
    for variant in variants:
        for run in range(1, args.runs + 1):
            print(f"\n===== {variant}, run {run} =====", flush=True)
            for word, text_language, first_language, label, cases in GROUPS:
                known: dict[str, str] = {}
                for passage, expected in cases:
                    got, detail = ask(
                        client, variant, word, text_language, first_language, passage, known
                    )
                    ok = got == expected
                    done, right, errors = totals.get(variant, (0, 0, 0))
                    totals[variant] = (done + 1, right + ok, errors + (got == "error"))
                    rows.append((variant, run, word, label, expected, got, ok, passage, detail))
                    print(
                        f"{'ok   ' if ok else 'WRONG'} {word:8} {label:5} expected {expected:6} got {got:6} {passage}  [{detail}]",
                        flush=True,
                    )
    client.close()

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    out = [
        "# FR-009 test table",
        "",
        f"- **Model:** `{client.settings.llm_model}`",
        f"- **Run at:** {now}",
        f"- **Requests sent to the model (retries included):** {requests}",
        f"- **Runs of each variant:** {args.runs}",
        "",
        "## Totals",
        "",
        "| Variant | Cases | As expected | Errors |",
        "| --- | --- | --- | --- |",
    ]
    for variant, (done, right, errors) in totals.items():
        out.append(f"| {variant} | {done} | {right} | {errors} |")
    out += [
        "",
        "## Cases",
        "",
        "| Variant | Run | Word | Passage | Expected | Got | Result | Phrase or message |",
        "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for variant, run, word, label, expected, got, ok, passage, detail in rows:
        out.append(
            f"| {variant} | {run} | {word} ({label}) | {cell(passage)} | {expected} | {got} | {'ok' if ok else 'WRONG'} | {cell(detail)} |"
        )
    Path(args.out).write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"\nWritten to {args.out}")
    for variant, (done, right, errors) in totals.items():
        print(f"{variant}: {right} of {done} as expected, {errors} errors")
    print(f"Requests sent: {requests}")


main()
