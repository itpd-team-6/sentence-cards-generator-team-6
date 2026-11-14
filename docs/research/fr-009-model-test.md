# FR-009 tests on the model of the virtual machine

This is the evidence for [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165), the action point of the Week 4 meeting ([`DEC-043`](../decisions.md#dec-043)), and for the choice recorded in [`DEC-070`](../decisions.md#dec-070).
The tests send to the model the question the product sends, and say for each case whether the model made a card or said that the card exists.
There are three tests: the test table of 2026-11-13, the test of the Customer's two suggestions on new cases of 2026-11-14, and the test of the Customer's meaning records of 2026-11-14.

## What was run

- **Model:** `@cf/mistralai/mistral-small-3.1-24b-instruct` from Cloudflare Workers AI, the model of [`DEC-046`](../decisions.md#dec-046).
  nataliamotand read `LLM_MODEL` and `LLM_BASE_URL` in the `.env` of staging and of production on 2026-11-13 (the key was not printed), and both name this model and the Cloudflare endpoint.
  The tests of 2026-11-14 read the same variables of production, and the results name the same model.
- **Date:** 2026-11-13.
- **Script:** [`backend/scripts/eval_fr009.py`](../../backend/scripts/eval_fr009.py).
  It uses the code of the product (`build_messages` and `read_phrase` in `backend/app/llm.py`), writes no database, and counts the requests.
- **Cases:** 36, in 8 groups of one word each.
  The 15 cases of the script of Week 4 (Zug, Bank and Schloss, short passages; three runs of it are the 45 requests of the Week 4 meeting) are in it, with 8 cases of Zug and Schloss with passages of about 30 words (the Customer's request to try longer context phrases) and 13 cases of `match`, `bank` and `ключ`, in English and Russian.
  The cases of a word run in order, and each card the model makes is listed as a known phrase for the next case of that word, as in the product.
  Half of the cases (18) expect "exists", because the word already has a card with that meaning, and half (18) expect a new card.
  The team wrote the cases and the expected answer of each, so the expected answers are the team's judgment of the meaning.
- **Two ways of asking:**
  - `current` is the question the product sends today: the phrases of the cards of the word, each with the translation of its sentence, and the instruction to write the meaning first.
  - `customer` is the same question with the input in the format the Customer proposed in the group chat on 2026-10-24 at 00:11, `<word>|<sentence>|<phrase 1>|<phrase 2>` ([`customer-chat-confirmation.md`](../../reports/week-04/evidence/customer-chat-confirmation.md)).
    The team's version of it also leaves out the example of "match" and the translations of the card sentences, so it does not test the format alone.

## Result

| Way of asking | Runs | Cases | As expected | Wrong, card made but "exists" expected | Wrong, "exists" answered but a new card expected | Errors |
| ------------- | ---- | ----- | ----------- | -------------------------------------- | ------------------------------------------------ | ------ |
| `current`     | 3    | 108   | 94          | 14                                     | 0                                                | 0      |
| `customer`    | 1    | 36    | 30          | 0                                      | 6                                                | 0      |

The runs of `current` were made one after the other on the same day, with the same cases.
In total, 144 requests were sent to the model (72 in the first invocation, with both ways of asking, and 72 in the second, with `current` twice) and none failed.

### The cases `current` got wrong

| Word and passage                                                                       | Known phrase of the card     | Phrase the model wrote (one run) | Runs wrong |
| -------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------- | ---------- |
| Zug: "Wir warten auf den Zug nach Berlin."                                             | "Ich verpasse den Zug."      | "Der Zug nach Berlin"            | 3 of 3     |
| Schloss: "Der König wohnt im Schloss."                                                 | "Ein altes Schloss."         | "Das Schloss des Königs."        | 3 of 3     |
| match: "I could not find a match to light the fire."                                   | "Strike a match"             | "I need a match"                 | 3 of 3     |
| bank: "The bank closes at five on Fridays."                                            | "I opened a bank account."   | "The bank closes early."         | 3 of 3     |
| Schloss, long: "Die Führung durch das Schloss dauerte zwei Stunden, und der Guide ..." | "Ein Schloss auf dem Hügel." | "Das Schloss besichtigen."       | 2 of 3     |

In the five cases the model decided that the word had another meaning, so it made a second card for a meaning the learner already had.
It did not refuse a card that was needed in any of the 54 cases that expected a new card.

### The cases `customer` got wrong

All six are a card that was needed and was not made, because the model answered that the card exists:
Zug ("Der nächste Zug im Schachspiel war entscheidend."), Schloss ("Das Schloss an der Tür klemmt."), Zug, long ("Im Café bestellte sie ein großes Glas Wasser ..."), Schloss, long ("Als er nach Hause kam, ließ sich der Schlüssel nicht mehr drehen ..."), match ("He struck a match to light the candle.") and ключ ("Из-под земли бьёт холодный ключ.").
It made no second card for a meaning that the learner already had.

## The Customer's suggestions on new cases

On 2026-11-14 the team tried the two suggestions of the Customer against the question of today, on cases that are not in the table above, so that no wording was tuned on the cases it is judged on.

- **Script:** [`backend/scripts/eval_fr009_revision.py`](../../backend/scripts/eval_fr009_revision.py).
  The results, with every case, are in [`fr-009-revision-results.md`](fr-009-revision-results.md).
- **Cases:** 29 in each run, on the words Leiter, Birne, Decke, bat, spring, лук and коса, with 2 runs of each wording, and 174 requests in all.
  The team wrote the cases and the expected answer of each.
- **Wordings:**
  - `current` is the question of today, with a context phrase of three or four words.
  - `long` is the same question with a context phrase of five or six words, as the Customer asked: "Also, please experiment with longer context phrases" (Customer, group chat, 2026-10-24 00:01).
  - `customer-long` is the input in the format of the Customer, with a context phrase of five or six words.
- **The rule written before the run:** a wording is adopted only if, over the runs, it makes fewer second cards than `current` and refuses no needed card.

| Wording         | As expected | Second cards made (of 28) | Needed cards refused (of 30) | Errors |
| --------------- | ----------- | ------------------------- | ---------------------------- | ------ |
| `current`       | 49 of 58    | 7                         | 0                            | 2      |
| `long`          | 42 of 58    | 8                         | 0                            | 8      |
| `customer-long` | 45 of 58    | 4                         | 9                            | 0      |

No wording met the rule.
Longer phrases made 8 second cards against 7, and the product refused 8 of the longer phrases as unusable; the error does not say which rule failed, and the product accepts two to six words that contain the word.
The format of the Customer made fewer second cards (4 against 7), and it refused 9 needed cards, which the learner cannot repair by deleting a card.
The two errors of `current` are the case "Дед косил траву острой косой." of the word `коса`: the word is written in another form in the passage, so no phrase can contain `коса`.
The case is a defect of the team's cases and it affects every wording.

## The Customer's meaning records

On 2026-11-14 the Customer wrote that 7 of 28 second cards and 9 of 30 refused cards "is a bit too much", proposed a "meaning record" for each card instead of a plain context phrase, gave a prompt for it, and asked: "Could you please try running your test using such records?" (Customer, group chat, 2026-11-14 16:41).

- **Script:** [`backend/scripts/eval_fr009_records.py`](../../backend/scripts/eval_fr009_records.py).
  The results, with every case and the first prompt of each kind, are in [`fr-009-records-results.md`](fr-009-records-results.md).
- **How it runs:** when a word has no card, the card is made as the product makes it today, and the model writes the meaning record of the sentence of the new card with the prompt of the Customer.
  When the word has cards, the model writes the meaning record of the learner's sentence with the same prompt, and a second question gives it the records of the cards and the new record and asks, for each card, whether it is the same sense; when one is, no card is made.
- **What the team changed in the prompt of the Customer:** "German" became the language of the word, "separable prefix if verb" became "separable prefix if the language has them", and the line "Answer only with the JSON." was added.
  The second question, which compares the records, is the team's own design, because the Customer did not say how to compare them.
  The `confidence` field of the record was not used in the decision.
- **Cases:** the 29 cases of the test above, with 2 runs of `current` and of `records`, and 227 requests in all.
  The rule was the same, written before the run.

| Wording   | As expected | Second cards made (of 28) | Needed cards refused (of 30) | Errors |
| --------- | ----------- | ------------------------- | ---------------------------- | ------ |
| `current` | 49 of 58    | 7                         | 0                            | 2      |
| `records` | 42 of 58    | 12                        | 1                            | 3      |

The records did not meet the rule: they made more second cards than the question of today, and refused one needed card.
Two of the three errors of `records` are the case of `коса` above, and the third is a phrase the product refused when the model wrote a card for "Der Leiter des Chors probte jeden Dienstag mit uns."
The question of today made 7 second cards again, as in the test of the suggestions, so the two runs agree.
The records separated well the senses that are very different (bat, spring, лук as a weapon, Birne as a fruit), and in several cases (Decke, Birne, зелёный лук) they marked the same sense as another one.
The team reads this as a sign that the record of a short or vague sentence is not specific enough, and has not tested it.

## What it shows

- With the question of today, the model made a second card for the same meaning in 14 of 54 cases that expected "exists", and in the same four cases in all three runs, so these are not chance.
  A learner can meet this.
  The line "The tests run so far found no misjudgment, so the case is rare" of issue #165 was true for the model of Week 4 (the 45 requests of the earlier table passed, [`reports/week-05/meeting-report.md`](../../reports/week-05/meeting-report.md)) and does not hold for this model on these cases.
  Two of the 15 cases of the Week 4 script are wrong now, in each of the three runs, and the earlier model passed all 45 requests of it.
  On the new cases of 2026-11-14 the question of today made 7 second cards of 28 in both tests, and refused no needed card of 30.
- The longer passages did not make the model clearly worse: 8 of 8 in the first run, and 7 of 8 in each of the two later ones (the wrong one is the last case of the table above).
- The format of the Customer, in the way the team wrote it, was worse in the first run, and its mistakes are the kind that loses a meaning, which the learner cannot repair by deleting a card.
  It made fewer second cards on the new cases, and it refused 9 needed cards.
- None of the suggestions of the Customer (longer phrases, his format, the meaning records) beat the question of today under the rule the team wrote before the tests, so the team did not change the question of the product.
  The Customer answered the team's results in the group chat: "Thanks! Let's keep today's question then" (Customer, group chat, 2026-11-14 18:02).

## Limits

- The cases are the team's, not the learner's; how often a real learner meets a second card for the same meaning is not known.
- One model and one day for each test, and one run of `customer` in the first test.
- One of the 29 new cases is a defect, and the two errors it caused are not counted as wrong answers of any wording.
- The question of the product was not changed, so there is no "after" to compare with; the results say what the question of today does on this model.
- The comparison of the records is the team's design, the model was not the one the Customer used for his idea (Qwen), and the `confidence` field was not used, so a different way of using the records could give another result.
