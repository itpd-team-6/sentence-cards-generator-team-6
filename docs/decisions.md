# Decisions

## DEC-001

The core of the product is an editor where the learner reviews, edits, flags and regenerates the generated sentences.

- **Status:** Active
- **Date:** 2026-09-30
- **Made by:** Customer
- **Source:** [the kickoff meeting](../reports/week-01/meeting-report.md)
- **Why:** sentences written by a language model can sound unnatural or be wrong (Customer, [00:05:38]), and in songs2anki removing a bad sentence meant searching the CSV file for its line and deleting it by hand, the part the Customer found most annoying (Customer, [00:16:13]).

## DEC-002

Review happens inside our app, and importing from Anki is a nice-to-have, not a requirement.

- **Status:** Active
- **Date:** 2026-09-30
- **Made by:** Customer
- **Source:** [the kickoff meeting](../reports/week-01/meeting-report.md)
- **Why:** re-prioritizing words is the extra feature the Customer wants most (Customer, [00:20:54]), and it needs us to control the study order, which we can only do if review happens inside our app (Customer, [00:21:50]).

## DEC-003

A decent free language model is acceptable for generating sentences.

- **Status:** Active
- **Date:** 2026-09-30
- **Made by:** Customer
- **Source:** [the kickoff meeting](../reports/week-01/meeting-report.md)
- **Why:** songs2anki depends on a paid OpenAI model, so every generation costs money; a decent free model is good enough to start, and an API key for a cheap model may be provided later (Customer, [00:17:50]).

## DEC-004

Picking words in the learner's own text becomes the first step of the editor, not a separate product direction.

- **Status:** Active
- **Date:** 2026-09-30
- **Made by:** Team
- **Source:** [the kickoff meeting](../reports/week-01/meeting-report.md)
- **Why:** the editor comes first ([DEC-001](#dec-001)), but it still needs the learner's words to generate sentences for, and marking known and unknown words by hand was one of the two songs2anki steps that "take quite a long time" (Customer, [00:07:08]).

## DEC-005

Every card exists as soon as the words are picked, and the learner deletes the cards they do not want, instead of confirming each one.

- **Status:** Active
- **Date:** 2026-10-09
- **Made by:** Customer
- **Source:** [the Week 2 validation meeting](../reports/week-02/meeting-report.md)
- **Why:** when we showed the two prototype modes, the Customer said confirming each card "will be very tedious" because most generated sentences will be fine (Customer, [00:21:50]), and that a delete button is enough to learn only a subset of the words (Customer, [00:24:02]). The "most are fine" belief rests on one check of one model, so [`ASM-01`](assumptions.md#asm-01) is still open.

## DEC-006

The minimum usable product candidate is `US-01`, `US-02` and `US-03`, as proposed.

- **Status:** Active
- **Date:** 2026-10-09
- **Made by:** Customer
- **Source:** [the Week 2 validation meeting](../reports/week-02/meeting-report.md)
- **Why:** it confirmed the current direction: the Customer said the three stories produce an end-to-end task, and he would move no story into or out of the candidate (Customer, [00:38:29]).

## DEC-007

Each card has audio for the word and for the sentence, the product gets it from an outside source, and the sentence audio plays automatically in review.

- **Status:** Active
- **Date:** 2026-10-09
- **Made by:** Customer
- **Source:** [the Week 2 validation meeting](../reports/week-02/meeting-report.md)
- **Why:** listening during a review is "very important" because it uses hearing as well as vision, and learners often review on the go with the phone in a pocket (Customer, [00:31:34]); our product need not make the audio, but it must fetch it from somewhere, and the audio for the sentence should be played automatically when the learner reviews a card (Customer, [00:31:34]).

## DEC-008

The product must be self-hostable on a local machine or a VPS, with clear instructions that we check.

- **Status:** Active
- **Date:** 2026-10-09
- **Made by:** Customer
- **Source:** [the Week 2 validation meeting](../reports/week-02/meeting-report.md)
- **Why:** it fits the open-source nature of the product and leaves the choice to the user; the Customer wants at least the local option "so that no data is sent anywhere" (Customer, [00:11:09]).
