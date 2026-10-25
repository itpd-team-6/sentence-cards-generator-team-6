# Week 04 test roster

This roster records the checks of the finished tasks that have a result.
It is a partial record: most acceptance criteria of the tasks merged before the meeting have no result here, because they were not run before the meeting with the Customer.
It was drafted by AbdelrahmanAbdel-Aal, who ran the checks, and cut by nataliamotand to what has a result.
Every `PASS` below is the tester's report, and no `PASS` was reproduced by a second person.

## Automated tests

| Check                                            | Result                     | Reported by          |
| ------------------------------------------------ | -------------------------- | -------------------- |
| `cd backend` then `python -m pytest`, on Windows | 253 passed in 35.19 s      | AbdelrahmanAbdel-Aal |
| The same suite on `main`                         | the same count, 253 passed | nataliamotand        |

## Manual checks

The product ran locally with the front end at `http://localhost:5173`.

| Issue                                                                                   | Criterion | What was run                                                            | Result | Evidence                                                                     |
| --------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| [issue #99](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/99)   | AC-01     | Selected three cards, confirmed the bulk delete.                        | PASS   | The tester reported that all three cards disappeared.                        |
| [issue #99](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/99)   | AC-03     | Hid a card with Hide and opened Study.                                  | PASS   | The tester reported the card absent from Study and still in the cards table. |
| [issue #99](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/99)   | AC-04     | Showed the hidden card again with Show and opened Study.                | PASS   | The tester reported the card visible in Study again.                         |
| [issue #99](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/99)   | AC-05     | Cancelled the delete confirmation.                                      | PASS   | The tester reported that the card remained.                                  |
| [issue #101](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/101) | AC-01     | Edited the sentence and the translation, saved, and refreshed the page. | PASS   | The tester reported that both values persisted.                              |

Two more observations are not a result for any criterion:

- After the translation of a card was locked and the page refreshed, the lock stayed on. This alone does not satisfy `AC-03` of [issue #101](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/101).
- A card of the word `Haus`, added by the tester, did not appear in Study. The tester said it was not hidden. Its due time was not checked, so this is inconclusive and is not reported as a defect.

## Environment

The tester had no `.env` file and no access to the language model service, so real generation was not run.
The cards of `Haus` and `Katze` showed "No sentence yet" and "No translation yet", and the product showed that some sentences could not be generated.
This is a blocker of the tester's setup, and it is not a verified defect of the product.

## Not run

- The criteria that need the language model were not run.
- The criteria about data made before a change were not run on a fresh copy of an older database: `AC-02` of [issue #93](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/93), `AC-04` of [issue #94](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/94), `AC-08` of [issue #98](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/98) and `AC-05` of [issue #101](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/101).
- The other criteria of the issues #93, #94, #95, #96, #98, #100, #101, #102 and #121 have no result in this roster.

## Failures

No failure was reported by these checks, and so no owner was notified of one.
