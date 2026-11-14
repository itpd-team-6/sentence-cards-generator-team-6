# FR-009 test table on the model of the virtual machine

This is the evidence for [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165), the action point of the Week 4 meeting ([`DEC-043`](../decisions.md#dec-043)), and for the choice recorded in [`DEC-070`](../decisions.md#dec-070).
The test sends to the model the question the product sends, and says for each case whether the model made a card or said that the card exists.

## What was run

- **Model:** `@cf/mistralai/mistral-small-3.1-24b-instruct` from Cloudflare Workers AI, the model of [`DEC-046`](../decisions.md#dec-046).
  nataliamotand read `LLM_MODEL` and `LLM_BASE_URL` in the `.env` of staging and of production on 2026-11-13 (the key was not printed), and both name this model and the Cloudflare endpoint.
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

## What it shows

- With the question of today, the model made a second card for the same meaning in 14 of 54 cases that expected "exists", and in the same four cases in all three runs, so these are not chance.
  A learner can meet this.
  The line "The tests run so far found no misjudgment, so the case is rare" of issue #165 was true for the model of Week 4 (the 45 requests of the earlier table passed, [`reports/week-05/meeting-report.md`](../../reports/week-05/meeting-report.md)) and does not hold for this model on these cases.
  Two of the 15 cases of the Week 4 script are wrong now, in each of the three runs, and the earlier model passed all 45 requests of it.
- The longer passages did not make the model clearly worse: 8 of 8 in the first run, and 7 of 8 in each of the two later ones (the wrong one is the last case of the table above).
- The format of the Customer, in the way the team wrote it, was worse in this run, and its mistakes are the kind that loses a meaning, which the learner cannot repair by deleting a card.
  The team did not change the question of the product for this reason, and does not claim that the format itself is the cause, because the team's version also dropped two parts of the question.

## Limits

- The cases are the team's, not the learner's; how often a real learner meets a second card for the same meaning is not known.
- One model, one day, and one run of `customer`.
- The question was not changed in this task, so there is no "after" to compare with; the result says what the question of today does on this model.
