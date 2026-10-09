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
