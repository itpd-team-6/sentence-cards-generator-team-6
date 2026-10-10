# Week 2 validation meeting report

## Metadata

- **Date:** 2026-10-09
- **Duration:** about 42 minutes, all recorded
- **Format:** online, on Kontur Talk
- **Attended:** nataliamotand (interviewer and screen sharing), emapfff (observer), Customer. AbdelrahmanAbdel-Aal could not attend.
- **Presented:** the three Week 1 checks (sentence quality, Anki "Reposition", forum search); the clickable prototypes [the two prototypes](prototypes.md); the four boundary items; the minimum usable product candidate (`US-01`, `US-02`, `US-03`)
- **Recording:** permitted, linked from the Week 02 Moodle submission
- **Transcript publication:** permitted, see [the transcript](meeting-transcript.md)
- **Transcript shared privately:** not applicable
- **Script:** [meeting-script.md](meeting-script.md)

## Previous action points

| Action                                                                                                                                                                                                     | Outcome                                                                                                                                                                                                                                                                                                                                            | Decision |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| [`reports/week-01/meeting-report.md`](../week-01/meeting-report.md#action-points): "Generate sentences for 20 words in each language (RU, EN, DE) with one free model and count how many we would correct" | Carried out with one free model on 20 words per language: an AI judge (Claude) marked 4 of the 60 sentences as needing correction, and no native speaker has checked them yet, so [`ASM-01`](../../docs/assumptions.md#asm-01) stays `Open`. Record: [sentence quality test](evidence/sentence-quality-test.md)                                    | None     |
| [`reports/week-01/meeting-report.md`](../week-01/meeting-report.md#action-points): "Time how long it takes to move the words of one text to the front of an Anki deck with \"Reposition\""                 | Partly carried out: one measurement of 55 seconds, which includes creating the cards and used a text of a few words, so it neither confirms nor refutes [`ASM-04`](../../docs/assumptions.md#asm-04), which stays `Open`. A second measurement is an action point below. Record: [Week 1 checks](evidence/week-1-checks.md#anki-reposition-timing) | None     |
| [`reports/week-01/meeting-report.md`](../week-01/meeting-report.md#action-points): "Look for reports in Anki community forums from learners who moved their reviews to other apps, and why"                | Carried out: no learner who moved their reviews to another app was found; on the LingQ forums some learners dropped or cut down Anki because of the daily review load. That is weak evidence, so [`ASM-05`](../../docs/assumptions.md#asm-05) stays `Open`. Record: [Week 1 checks](evidence/week-1-checks.md#forum-search)                        | None     |
| [`reports/week-01/meeting-report.md`](../week-01/meeting-report.md#action-points): "Ask the Customer the open questions below"                                                                             | Carried out in this meeting: the three open questions were asked, see the next table                                                                                                                                                                                                                                                               | None     |

## Previous open questions

| Question                                                                                                                                                                                                                | Answer                                                                                                                                                                                                                                                                                                            | Decision                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [`reports/week-01/meeting-report.md`](../week-01/meeting-report.md#open-questions): "After the editor and re-prioritizing, which should come next: teacher review or the three interface languages?"                    | Teacher review first, then the three interface languages (Customer, [00:09:41])                                                                                                                                                                                                                                   | None                                         |
| [`reports/week-01/meeting-report.md`](../week-01/meeting-report.md#open-questions): "What does \"a teacher connects and reviews cards\" mean: a separate teacher view of a student's cards, or editing the same cards?" | The teacher is the judge of the cards and may review hundreds at once, probably on a laptop, in a desktop version "very similar to the student's one" that allows quick review, editing, flagging, listening to the audio and giving the language model hints (Customer, [00:04:19]); not yet turned into a story | None                                         |
| [`reports/week-01/meeting-report.md`](../week-01/meeting-report.md#open-questions): "Should the product run on a VPS or on the learner's own machine? We did not ask this in the meeting."                              | Both: it must be self-hostable on a local machine or a VPS, with clear instructions that we check (Customer, [00:11:09]); [`CON-07`](../../docs/product-vision.md#con-07) now says so                                                                                                                             | [`DEC-008`](../../docs/decisions.md#dec-008) |

## Summary

- The Customer chose the second prototype mode: every card exists as soon as the words are picked, and the learner can delete the ones they do not want; a confirm button for each card would be tedious when most sentences are fine.
- Audio is "very important": each card needs audio for the word and for the sentence, and the sentence audio plays automatically in review. The product does not have to make the audio, but it has to get it from somewhere, which moves [`BND-01`](../../docs/product-vision.md#bnd-01).
- The product must be self-hostable on a local machine or a VPS, with clear instructions that we check.
- The Customer accepted the minimum usable product candidate (`US-01`, `US-02`, `US-03`) and would move no story into or out of it.
- For the study queue, the Customer expects the new cards of a moved text to come first and studied cards to return as scheduled, but was not sure; he could not judge the 55-second figure without seeing the interface.

## Decisions

- [DEC-005: Every card exists as soon as the words are picked, and the learner deletes the cards they do not want, instead of confirming each one](../../docs/decisions.md#dec-005)
- [DEC-006: The minimum usable product candidate is `US-01`, `US-02` and `US-03`, as proposed](../../docs/decisions.md#dec-006)
- [DEC-007: Each card has audio for the word and for the sentence, the product gets it from an outside source, and the sentence audio plays automatically in review](../../docs/decisions.md#dec-007)
- [DEC-008: The product must be self-hostable on a local machine or a VPS, with clear instructions that we check](../../docs/decisions.md#dec-008)

## Action points

| Action                                                                                                                                                  | Owner                | Due                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------ |
| Find out how the product can get audio for a word and a sentence (which free source, what it covers for Russian, English and German), and bring options | emapfff              | Week 3, 2026-10-15 |
| Update `BND-01` and the context diagram so they agree on where the audio comes from                                                                     | nataliamotand        | Week 3, 2026-10-15 |
| Take a second "Reposition" measurement with a realistic text, timing only the move                                                                      | AbdelrahmanAbdel-Aal | Week 3, 2026-10-15 |
| Prepare an example of the study queue that shows the cost of reordering, to ask the Customer again                                                      | nataliamotand        | Week 3, 2026-10-15 |

## Open questions

| Question                                                                                                                                                                              | What it would change                                                                                                         | Follow-up             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Which outside source should give the audio, and may it be an online service, given that the Customer wants self-hosting "so that no data is sent anywhere"?                           | `BND-01`, the context diagram, and what a self-hosted install needs; the same question applies to the language model service | emapfff, Week 3       |
| Is our reading right that moving a text to the front of the queue only moves its new cards, and that studied cards return as scheduled? (Customer: "I'm not sure", [00:27:24])        | The acceptance criteria of `US-04`                                                                                           | nataliamotand, Week 3 |
| Is about one minute to reorder the words of a text acceptable for our product, and what would the Customer still miss? (He could not answer without seeing the interface, [00:13:16]) | Whether `US-04` is worth building over Anki's "Reposition" ([`ASM-04`](../../docs/assumptions.md#asm-04))                    | nataliamotand, Week 3 |
| Should the teacher edit the context around a word, or only add a comment or hint for the language model? (Customer: "subject to discussion", [00:06:18])                              | The teacher-review story, once we write it                                                                                   | nataliamotand, Week 3 |

## Disagreements

| Your position                                                                                                            | Customer's position                                                                                                                             | What you changed                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Audio is outside the boundary, "an extra rather than a differentiator" ([`BND-01`](../../docs/product-vision.md#bnd-01)) | Listening during a review is "very important"; each card should have audio for the word and for the sentence, played automatically ([00:31:34]) | `BND-01` now names an outside source for the audio ([`DEC-007`](../../docs/decisions.md#dec-007)); [`US-07`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/33) moved from Won't Have to Must Have, with its own criteria |
