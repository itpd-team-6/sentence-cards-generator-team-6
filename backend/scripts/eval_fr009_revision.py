"""Tries the revisions of the question to the model that the Customer asked for (issue #165, DEC-043).

It runs on NEW cases, words that are not in the test table of `eval_fr009.py`, so that a revision is not tuned on the
cases it is judged on. The wordings:
  current        the question the app sends today (`build_messages` in `app/llm.py`), with a context phrase of three
                 or four words;
  long           the same question, with a context phrase of five or six words (the Customer: "please experiment with
                 longer context phrases", chat, 2026-10-24 00:01; the product accepts up to six words);
  customer-long  the input in the format the Customer proposed in the chat on 2026-10-24 00:11,
                 "<word>|<sentence>|<phrase of card 1>|<phrase of card 2>", with a phrase of five or six words;
  revised        the team's own idea, one more step in the question: the model writes the meaning of the word on each
                 card before it compares them (optional, not run by default).

The rule below was written BEFORE the run. A wording is adopted only if, over all the runs, it makes fewer second cards
than `current` AND it refuses no needed card.

It uses the code of the app (the question of the first card, the reading of the answer, the repeat when the model is
busy), without the screen, and it does not touch any database. The cases of a word run in order, as in the app.

Run it from the `backend` folder, with the virtual environment active and the model of production in the environment:
    python scripts/eval_fr009_revision.py --runs 2 --out ../../fr009-revision-results.md

It stops before `--max-requests`, because the daily quota of the model is shared with the staging and production
environments (docs/deployment.md)."""

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.llm import (
    LANGUAGE_NAMES,
    CardExists,
    LlmClient,
    LlmError,
    build_messages,
    parse_answer,
    read_phrase,
)

# Each group: (word, language of the text, language of the translation, [(passage, expected)]).
# "new" means a card must be made, "exists" means no new card, because the word already has one with that meaning.
GROUPS = [
    (
        "Leiter",
        "de",
        "en",
        [
            ("Er stieg auf die Leiter, um die Äpfel zu pflücken.", "new"),
            ("Die Leiter lehnte an der Hauswand.", "exists"),
            ("Der Leiter der Abteilung hat die Sitzung eröffnet.", "new"),
            ("Der Leiter des Chors probte jeden Dienstag mit uns.", "exists"),
        ],
    ),
    (
        "Birne",
        "de",
        "en",
        [
            ("Zum Nachtisch gab es eine saftige Birne.", "new"),
            ("Er schälte die Birne mit einem kleinen Messer.", "exists"),
            ("Die Birne in der Küche ist durchgebrannt.", "new"),
            ("Ich muss eine neue Birne für die Lampe kaufen.", "exists"),
        ],
    ),
    (
        "Decke",
        "de",
        "en",
        [
            ("Im Winter lege ich mir eine warme Decke aufs Bett.", "new"),
            ("Die Decke im Wohnzimmer ist sehr hoch.", "new"),
            ("Das Kind kuschelte sich in die weiche Decke.", "exists"),
            ("Der Maler strich die Decke des Flurs weiß.", "exists"),
        ],
    ),
    (
        "bat",
        "en",
        "ru",
        [
            ("A bat flew out of the old barn at dusk.", "new"),
            ("He swung the bat and hit the ball over the fence.", "new"),
            ("The bat hung upside down in the cave all day.", "exists"),
            ("She bought a new bat for the cricket match.", "exists"),
        ],
    ),
    (
        "spring",
        "en",
        "ru",
        [
            ("The flowers bloom in spring.", "new"),
            ("The spring of the old mattress broke.", "new"),
            ("In early spring the garden is full of birds.", "exists"),
            ("A clear spring ran down the hillside.", "new"),
            ("The coil spring in the pen pushed the tip out.", "exists"),
        ],
    ),
    (
        "лук",
        "ru",
        "en",
        [
            ("Я нарезал лук для супа.", "new"),
            ("Охотник натянул лук и выпустил стрелу.", "new"),
            ("На рынке мы купили зелёный лук.", "exists"),
            ("Он взял лук и колчан со стрелами.", "exists"),
        ],
    ),
    (
        "коса",
        "ru",
        "en",
        [
            ("У девочки была длинная русая коса.", "new"),
            ("Дед косил траву острой косой.", "new"),
            ("Она заплела косу перед школой.", "exists"),
            ("Косарь наточил косу перед работой.", "exists"),
        ],
    ),
]


def revised_messages(word, text_language, first_language, passage, known):
    """The question with one more step: the meaning of the word on each card is written before the comparison.

    `known` maps the phrase of each card to the translation of its card sentence. It is never empty here: the first
    card of a word is asked as the app asks it today."""
    if len(word.split()) > 1:
        contains = f'that contains all of these words, in this order and in this form, with other words allowed between them: "{word}"'
    else:
        contains = f'that contains the word "{word}"'
    listed = " ".join(
        f'{number}. "{phrase}" (card sentence: "{translation}")'
        for number, (phrase, translation) in enumerate(known.items(), start=1)
    )
    lines = [
        f"Write one short, natural example sentence in {LANGUAGE_NAMES[text_language]} {contains}.",
        f"Then translate the sentence into {LANGUAGE_NAMES[first_language]}.",
        f'The word comes from this passage, so give it the same meaning: "{passage}"',
        (
            "Also write a minimal phrase of three or four words, in the same language, that uses this word "
            "in the meaning it has in the passage."
        ),
        f"The learner already has these cards for this word: {listed}.",
        (
            'Do three steps. First, in the field "meaning", write the meaning the word has in the passage, as a short '
            'dictionary gloss in English. Second, in the field "card_meanings", write the meaning the word has on each '
            "numbered card, as a short dictionary gloss in English, in the order of the list, judging each card only by "
            'its own phrase and sentence. Third, in the field "same_meaning", write true for a card whose gloss is the '
            'same dictionary sense as the gloss in "meaning", and false for a card whose gloss is another sense, one '
            "value for each card, in the order of the list."
        ),
        (
            "Two glosses are the same sense when a dictionary would list them under one numbered sense, even when the "
            "sentence, the situation or the words next to the word are different. They are different senses when a "
            'dictionary would list them separately. For example, "match" as a game is one sense, whether the phrase is '
            '"a football match" or "win the match", and "match" as a small stick for lighting a fire is another.'
        ),
    ]
    form = [
        '"meaning": "..."',
        '"card_meanings": ["..." for each card]',
        '"same_meaning": [true or false for each card]',
        '"sentence": "..."',
        '"translation": "..."',
        '"phrase": "..."',
    ]
    lines.append("Answer only with JSON, in this form: {" + ", ".join(form) + "}")
    return [
        {
            "role": "system",
            "content": "You write example sentences for people who learn a language.",
        },
        {"role": "user", "content": "\n".join(lines)},
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


SHORT_PHRASE = "a minimal phrase of three or four words"
LONG_PHRASE = "a phrase of five or six words"
ALL_VARIANTS = ["current", "long", "customer-long", "revised"]


def messages_for(variant, word, text_language, first_language, passage, known):
    """The question of one wording for one case. `known` maps the phrase of each card to its sentence's translation."""
    if variant in ("current", "long") or (variant == "revised" and not known):
        messages = build_messages(
            word,
            text_language,
            first_language,
            passage,
            None,
            ask_phrase=True,
            known_phrases=dict(known) or None,
        )
    elif variant == "customer-long":
        messages = customer_messages(word, text_language, first_language, passage, list(known))
    else:
        messages = revised_messages(word, text_language, first_language, passage, known)
    if variant in ("long", "customer-long"):
        content = messages[1]["content"]
        if SHORT_PHRASE not in content:
            sys.exit(
                "The sentence about the length of the phrase was not found in the question. Stop."
            )
        messages[1]["content"] = content.replace(SHORT_PHRASE, LONG_PHRASE)
    return messages


def ask(client, variant, word, text_language, first_language, passage, known):
    """One request. Returns (got, phrase or message)."""
    try:
        messages = messages_for(variant, word, text_language, first_language, passage, known)
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


def count(rows, variant):
    """(cases, as expected, second cards made, needed cards refused, errors) of one variant."""
    mine = [row for row in rows if row["variant"] == variant]
    return (
        len(mine),
        sum(1 for row in mine if row["got"] == row["expected"]),
        sum(1 for row in mine if row["expected"] == "exists" and row["got"] == "new"),
        sum(1 for row in mine if row["expected"] == "new" and row["got"] == "exists"),
        sum(1 for row in mine if row["got"] == "error"),
    )


def verdict(rows, variant):
    """The rule written before the run, for one wording compared with `current`."""
    current, mine = count(rows, "current"), count(rows, variant)
    if mine[4] or current[4]:
        return "NOT DECIDED: some requests failed, so the runs are not comparable."
    if mine[2] < current[2] and mine[3] == 0:
        return "ADOPT: fewer second cards than `current`, and no needed card refused."
    return "DO NOT ADOPT: not fewer second cards than `current`, or a needed card was refused."


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--runs", type=int, default=2)
    parser.add_argument("--max-requests", type=int, default=240)
    parser.add_argument(
        "--variants",
        default="current,long,customer-long",
        help="comma-separated, from: " + ", ".join(ALL_VARIANTS),
    )
    parser.add_argument("--out", required=True, help="Markdown file to write the results to")
    args = parser.parse_args()
    variants = [name.strip() for name in args.variants.split(",") if name.strip()]
    if "current" not in variants or any(name not in ALL_VARIANTS for name in variants):
        sys.exit("--variants must include current and use only: " + ", ".join(ALL_VARIANTS))
    per_pass = sum(len(cases) for *_, cases in GROUPS)
    planned = per_pass * args.runs * len(variants)
    if planned > args.max_requests:
        sys.exit(
            f"{planned} requests planned, more than --max-requests {args.max_requests}. Lower --runs."
        )

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
    for variant in variants:
        for run in range(1, args.runs + 1):
            print(f"\n===== {variant}, run {run} =====", flush=True)
            for word, text_language, first_language, cases in GROUPS:
                known: dict[str, str] = {}
                for passage, expected in cases:
                    got, detail = ask(
                        client,
                        variant,
                        word,
                        text_language,
                        first_language,
                        passage,
                        known,
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
        "# FR-009 revision test",
        "",
        f"- **Model:** `{client.settings.llm_model}`",
        f"- **Run at:** {now}",
        f"- **Requests sent to the model (retries included):** {requests}",
        f"- **Wordings:** {', '.join(variants)}",
        f"- **Runs of each wording:** {args.runs}",
        f"- **Cases in each run:** {per_pass}, on words that are not in the table of `eval_fr009.py`",
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
        "**Rule written before the run:** a wording is adopted only if it makes fewer second cards than `current` and refuses no needed card.",
        "",
        *[f"- **{name}:** {verdict(rows, name)}" for name in variants if name != "current"],
        "",
        "",
        "## Cases",
        "",
        "| Wording | Run | Word | Passage | Expected | Got | Result | Phrase or message |",
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
    for variant in variants:
        if variant != "current":
            print(f"{variant}: {verdict(rows, variant)}")
    print(f"Requests sent: {requests}")


if __name__ == "__main__":
    main()
