# FR-009 meaning records, the six steps of the Customer

- **Model:** `@cf/mistralai/mistral-small-3.1-24b-instruct`
- **Run at:** 2026-11-27 20:03 UTC
- **Requests sent to the model (retries included):** 19
- **Wordings:** sixsteps
- **Runs of each wording:** 1
- **Cases in each run:** 29, the same as in `eval_fr009_revision.py`
- **Stopped early:** the limit of 25 requests was near, so not every case ran.

## Totals

| Wording  | Cases | As expected | Second cards made | Needed cards refused | Errors |
| -------- | ----- | ----------- | ----------------- | -------------------- | ------ |
| sixsteps | 8     | 6           | 2                 | 0                    | 0      |

**Rule written before the run:** `sixsteps` is adopted only if it makes fewer second cards than `current` and refuses no needed card.

- **sixsteps:** NOT DECIDED: the run had no `current` or stopped early, so it cannot be compared.

## How a case runs

- Step 1: The case gives the word the learner selected and the sentence of the text.
- Step 2: One request asks the model for the lemma of the word.
- Step 3: The records of that lemma, in the language of the text, are looked up in the store of the run.
- Steps 4 and 5: When there are records, one request gives the model the word, the sentence and the numbered records, and asks which one matches.
- Step 6: When one matches, no card is made. When none matches, the model writes a new record from the sentence, the record is stored, and a card is made.

The script does not write the sentence of the card, because what the six steps decide is whether a card is made.

## Prompts used (the first of each)

Lemma (step 2):

```text
You are a lexicographer of German. A learner selected the word combination "Leiter" in this sentence:
Er stieg auf die ⟨TARGET⟩Leiter⟨/TARGET⟩, um die Äpfel zu pflücken.

Write the lemma of the word combination: its normalized dictionary form.
Answer only with JSON, in this form: {"lemma": "..."}
```

Match (steps 4 and 5):

```text
You are a lexicographer of German. A learner selected the word combination "Leiter" in this sentence:
Die ⟨TARGET⟩Leiter⟨/TARGET⟩ lehnte an der Hauswand.

These meaning records exist for the lemma "Leiter":
1. {"lemma": "Leiter", "pos": "noun", "sense_gloss": "ein Gerät aus Sprossen und Seitenholmen, um in die Höhe zu klettern", "synonym_substitute": "Trittleiter", "typical_subjects/objects": {"subjects": ["Er"], "objects": ["die Äpfel"], "syntactic_frame": "auf + Akkusativ steigen"}, "excluded_senses": ["Führer einer Gruppe", "Kabel, das Strom leitet", "Person, die leitet oder anleitet", "Leiterplatte"], "disambiguating_cues": "auf die Leiter steigen", "confidence": "high"}

Decide which meaning record matches the word combination in the sentence.
A record matches when the word combination has, in the sentence, the sense that the sense_gloss of the record describes, and not one of the excluded_senses of the record.
If no record matches, there is no match.
Answer only with JSON, in this form: {"match": <the number of the matching record, or null if none>, "reason": "<at most 15 words>"}
```

New meaning record (step 6):

```text
You are a lexicographer of German. In the sentence below, the word marked
⟨TARGET⟩...⟨/TARGET⟩ is used in one specific sense.

Sentence: Er stieg auf die ⟨TARGET⟩Leiter⟨/TARGET⟩, um die Äpfel zu pflücken.

Return JSON:
- lemma, pos
- sense_gloss: a short German definition of EXACTLY this sense
- synonym_substitute: a word/phrase that could replace the target here
without changing the meaning (lexical substitution test)
- typical_subjects/objects and syntactic frame (valency, reflexive,
preposition, separable prefix if the language has them)
- excluded_senses: 2–4 OTHER common senses of this lemma that must NOT be used
- disambiguating_cues: quote the minimal span of the sentence that fixes the sense
- confidence: high/medium/low (low if the context is genuinely ambiguous)
Answer only with the JSON.
```

## Cases

| Wording  | Run | Word   | Passage                                             | Expected | Got    | Result | Lemma     | Sense, phrase or message                                                                   |
| -------- | --- | ------ | --------------------------------------------------- | -------- | ------ | ------ | --------- | ------------------------------------------------------------------------------------------ |
| sixsteps | 1   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Leiter    | new record: ein Gerät aus Sprossen und Seitenholmen, um in die Höhe zu klettern            |
| sixsteps | 1   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | new    | WRONG  | Leiter    | new record: eine Leiter, die zum Klettern verwendet wird                                   |
| sixsteps | 1   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Leiter    | new record: Person, die eine Abteilung oder Gruppe leitet                                  |
| sixsteps | 1   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Leiter    | record 3: Person, die eine Abteilung oder Gruppe leitet (Leiter refers to a group leader.) |
| sixsteps | 1   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Birne     | new record: eine Frucht der Birnbaumart                                                    |
| sixsteps | 1   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Birne     | record 1: eine Frucht der Birnbaumart (The sentence describes peeling a fruit.)            |
| sixsteps | 1   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | die Birne | new record: ein elektrisches Gerät, das zum Erhitzen von Lebensmitteln verwendet wird      |
| sixsteps | 1   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | new    | WRONG  | Birne     | new record: eine Glühbirne                                                                 |
