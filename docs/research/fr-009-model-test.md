# FR-009 tests on the model of the virtual machine

This is the evidence for [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165), the action point of the Week 4 meeting ([`DEC-043`](../decisions.md#dec-043)), and for the choice recorded in [`DEC-070`](../decisions.md#dec-070).
It is also the evidence for [issue #293](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/293), the test of the six steps of the Customer.
The tests send to the model the question the product sends, and say for each case whether the model made a card or said that the card exists.
There are four tests: the test table of 2026-11-13, the test of the Customer's two suggestions on new cases of 2026-11-14, the test of the Customer's meaning records of 2026-11-14, and the test of the Customer's six steps for the records of 2026-11-27.

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

## The Customer's six steps for the records

On 2026-11-14 at 22:44 the Customer wrote in the group chat that the test of the records "doesn't implement the approach with records I had in mind", and asked the team to review the logic (Customer, group chat, 2026-11-14 22:44).
He described six steps:

1. Gather the original context: the word combination (the several words selected for a card) and the sentences where its words appear.
2. Ask the model for the lemma (the normalized form) of the word combination.
3. Find all the meaning records keyed by that lemma.
4. Give the model the word combination, its sentences and all the records found.
5. Ask the model which record matches the word combination.
6. If one matches, use it; if none does, create a new meaning record.

The test above does not follow these steps.
It writes a record for the new sentence first and compares it with the records of the cards in a second question, which is the team's design, and it does not ask for the lemma first.
So the team adjusted the test to his six steps and ran it on 2026-11-27 at 20:11 UTC.

- **Script:** [`backend/scripts/eval_fr009_sixsteps.py`](../../backend/scripts/eval_fr009_sixsteps.py).
  The results, with every case and the first prompt of each kind, are in [`fr-009-sixsteps-results.md`](fr-009-sixsteps-results.md).
- **Model:** `@cf/mistralai/mistral-small-3.1-24b-instruct`, read from the `.env` of production; the results name it.
- **Cases:** the 29 cases of the test of the Customer's suggestions, with 2 runs of `current` (the question of today, run on the same day for comparison) and of `sixsteps`, and 193 requests in all, retries included.
- **How a case runs:** the case gives the word the learner selected and the sentence of the text.
  One request asks the model for the lemma.
  The records of that lemma, in the language of the text, are looked up in a store that lives in the script and is empty at the start of each run.
  When there are records, one request gives the model the word, the sentence and the numbered records, and asks which one matches.
  When one matches, no card is made.
  When none matches, the model writes a new record from the sentence, with the prompt of the Customer, the record is stored, and a card is made.
- **What is the team's and not the Customer's:** the questions of the lemma and of the match are the team's wording of his steps 2 and 5.
  The prompt of the record is the one of the test of the records above, with the same three changes.
  The store is keyed by the language of the text and the lemma, ignoring capital letters.
  The script does not write the sentence of the card, because what the six steps decide is whether a card is made.
- **What was changed after a short run:** a first run of 8 cases (Leiter and Birne) at 20:03 UTC, in [`fr-009-sixsteps-smoke.md`](fr-009-sixsteps-smoke.md), showed the model answering "die Birne" as the lemma of "Birne", which split the records of one word.
  The team added "without an article" to the question of the lemma and ran the full test.
  The 8 cases of the short run are also in the full test.
- **The rule written before the run:** `sixsteps` is adopted only if, over the runs, it makes fewer second cards than `current` and refuses no needed card.

| Wording    | As expected | Second cards made (of 28) | Needed cards refused (of 30) | Errors |
| ---------- | ----------- | ------------------------- | ---------------------------- | ------ |
| `current`  | 52 of 58    | 4                         | 0                            | 2      |
| `sixsteps` | 55 of 58    | 3                         | 0                            | 0      |

The script printed "NOT DECIDED" because two requests of `current` failed.
They are the case "Дед косил траву острой косой." of the word `коса`, in both runs: the defect of the case described above, because the word is written in another form and the product refuses a phrase that does not contain it.
The six steps write no phrase for the card, so the case did not fail there, and the lemma step gave `коса` for it.
Without those two errors the rule is met by one card, 3 second cards against 4, and no needed card was refused.
The rule says what a wording must do at least to be adopted; it does not say that a wording that does it must be adopted.

The question of today made 7 second cards of 28 on 2026-11-14 and 4 of 28 on 2026-11-27, on the same cases.
So a difference of one card is smaller than the difference between two days of the same question.
The lemma step gave the word of the case in all 58 cases of `sixsteps`.

### The cases the second test got wrong

| Wording    | Word and passage                                        | What happened                                                                                                                                                                                                      | Runs wrong |
| ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `current`  | лук: "На рынке мы купили зелёный лук."                  | A second card was made for the vegetable.                                                                                                                                                                          | 2 of 2     |
| `current`  | коса: "Косарь наточил косу перед работой."              | A second card was made for the tool.                                                                                                                                                                               | 2 of 2     |
| `sixsteps` | Leiter: "Die Leiter lehnte an der Hauswand."            | The model answered that no record matched, although record 1 was the ladder of the first case, and a new record was made.                                                                                          | 2 of 2     |
| `sixsteps` | Birne: "Ich muss eine neue Birne für die Lampe kaufen." | In this run the record written for "Die Birne in der Küche ist durchgebrannt." said "ein elektrisches Gerät, das zum Erhitzen von Speisen verwendet wird", so the later sentence about the lamp matched no record. | 1 of 2     |

## What it shows

- With the question of today, the model made a second card for the same meaning in 14 of 54 cases that expected "exists", and in the same four cases in all three runs, so these are not chance.
  A learner can meet this.
  The line "The tests run so far found no misjudgment, so the case is rare" of issue #165 was true for the model of Week 4 (the 45 requests of the earlier table passed, [`reports/week-05/meeting-report.md`](../../reports/week-05/meeting-report.md)) and does not hold for this model on these cases.
  Two of the 15 cases of the Week 4 script are wrong now, in each of the three runs, and the earlier model passed all 45 requests of it.
  On the new cases of 2026-11-14 the question of today made 7 second cards of 28 in both tests, and 4 of 28 on 2026-11-27, and refused no needed card of 30 in any of them.
- The longer passages did not make the model clearly worse: 8 of 8 in the first run, and 7 of 8 in each of the two later ones (the wrong one is the last case of the table above).
- The format of the Customer, in the way the team wrote it, was worse in the first run, and its mistakes are the kind that loses a meaning, which the learner cannot repair by deleting a card.
  It made fewer second cards on the new cases, and it refused 9 needed cards.
- None of the suggestions of the Customer (longer phrases, his format, the meaning records) beat the question of today under the rule the team wrote before the tests, so, as of 2026-11-14 18:02, the team did not change the question of the product.
  The Customer answered the team's results in the group chat: "Thanks! Let's keep today's question then" (Customer, group chat, 2026-11-14 18:02).
  At 22:44 the same day he wrote that the test of the records does not follow the approach he had in mind, so the team reads this answer as covering the tests above, not his six steps.
- With the six steps of the Customer, on 2026-11-27, the model made 3 second cards of 28 and refused none of the 30 needed cards, and the question of today made 4 and none on the same day.
  The difference is one card, the same cases were wrong in both runs, and the question of today made 7 and then 4 second cards on the same cases on two days, so the team does not read it as a gain of the six steps.
- A record that the model writes badly in step 6 stays in the store, and a later sentence of the same meaning does not match it (Birne, second run).
- The test of the six steps did not change the question of the product.

## Limits

- The cases are the team's, not the learner's; how often a real learner meets a second card for the same meaning is not known.
- One model and one day for each test, and one run of `customer` in the first test.
- One of the 29 new cases is a defect, and the two errors it caused are not counted as wrong answers of any wording.
- The question of the product was not changed, so there is no "after" to compare with; the results say what the question of today does on this model.
- In the test of the records of 2026-11-14 the comparison of the records is the team's design, and the Customer wrote at 22:44 that it is not the approach he had in mind; the model was not the one the Customer used for his idea (Qwen), and the `confidence` field was not used, so a different way of using the records could give another result.
- The test of the six steps uses one sentence for each case, where the Customer wrote "sentences", and one selected word, not several.
- The store of the records lives in the script and is empty at the start of each run, so the records are the ones the model wrote in the same run.
- The questions of the lemma and of the match are the team's wording of his steps 2 and 5.
- The two runs of each wording repeat nearly the same wrong cases, so they are close to one measurement of 29 cases.
- The question of the lemma was changed after the short run of 8 cases, and those cases are also in the full test.
- The script does not write the sentence of the card, so the error of `current` on the case of `коса` could not happen in `sixsteps`.
