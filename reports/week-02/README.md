# Week 02 report

## Project

Sentence cards generator, team 6.
Assignment 2, Requirements And Prototyping: no product code this week.

Our problem-space sentence: language learners (and their teachers) who study Russian, English or German from real texts want to turn the words they choose into flashcards with example sentences, translations and pronunciation, and review them with spaced repetition, without building each card by hand.

Start with the [meeting report](meeting-report.md) and the [product vision](../../docs/product-vision.md).

## What we did

We moved the Week 1 decisions and assumptions into their logs, stated the product vision with its constraints, boundary and context diagram, wrote eight user stories as issues, and proposed a minimum usable product candidate.
We built two clickable prototypes of the parts we were least sure about, carried out the kickoff action points, and validated all of it with the Customer on 2026-10-09.

## Findings

What we were wrong about:

- **We thought a learner would confirm every sentence before a card exists.** The Customer chose the opposite: every card exists at once and the learner deletes the ones they do not want, because confirming each card is tedious when most sentences are fine ([`DEC-005`](../../docs/decisions.md#dec-005)).
- **We put audio outside the product as "an extra".** The Customer called it "very important": each card needs audio for the word and for the sentence, which the product gets from an outside source ([`DEC-007`](../../docs/decisions.md#dec-007)). The audio story, which we had ruled out, is a Must Have again.
- **We left open where the product runs.** It must be self-hostable on a local machine or a VPS, with instructions that we check ([`DEC-008`](../../docs/decisions.md#dec-008)).

What held: the Customer accepted the minimum usable product candidate as proposed ([`DEC-006`](../../docs/decisions.md#dec-006)).

How strong our evidence is:

- The sentence quality test found 4 of 60 sentences to correct, but the judge was an AI and no native speaker has checked the verdicts, so [`ASM-01`](../../docs/assumptions.md#asm-01) stays `Open`.
- The Anki "Reposition" timing is one measurement of 55 seconds that includes creating the cards, so [`ASM-04`](../../docs/assumptions.md#asm-04) stays `Open`.
- The forum search found nobody who moved their reviews to another app, which is weak evidence for [`ASM-05`](../../docs/assumptions.md#asm-05); it stays `Open`.

Still open: where the audio comes from and whether an online source fits self-hosting, how a moved text should behave in the study queue, whether the cost of reordering is acceptable, and what a teacher may edit.
These are in the meeting report's [open questions](meeting-report.md#open-questions).

## Coverage

| Deliverable            | Artifact                                                                                                                                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kickoff action points  | [reports/week-02/meeting-report.md](meeting-report.md#previous-action-points)                                                                                                                                                                |
| Kickoff open questions | [reports/week-02/meeting-report.md](meeting-report.md#previous-open-questions)                                                                                                                                                               |
| Product vision         | [docs/product-vision.md](../../docs/product-vision.md)                                                                                                                                                                                       |
| System context diagram | [docs/architecture/context.svg](../../docs/architecture/context.svg), embedded in [docs/product-vision.md](../../docs/product-vision.md#context)                                                                                             |
| Assumptions            | [docs/assumptions.md](../../docs/assumptions.md)                                                                                                                                                                                             |
| Decisions              | [docs/decisions.md](../../docs/decisions.md)                                                                                                                                                                                                 |
| Story issues           | [the user stories, filtered by the `user-story` label](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues?q=label%3Auser-story)                                                                                           |
| Issue forms            | [.github/ISSUE_TEMPLATE/user-story.yml](../../.github/ISSUE_TEMPLATE/user-story.yml), [.github/ISSUE_TEMPLATE/task.yml](../../.github/ISSUE_TEMPLATE/task.yml), [.github/ISSUE_TEMPLATE/config.yml](../../.github/ISSUE_TEMPLATE/config.yml) |
| Labels                 | [the repository's labels page](https://github.com/itpd-team-6/sentence-cards-generator-team-6/labels)                                                                                                                                        |
| Pull request template  | [.github/pull_request_template.md](../../.github/pull_request_template.md)                                                                                                                                                                   |
| Prototypes             | [reports/week-02/prototypes.md](prototypes.md)                                                                                                                                                                                               |
| Meeting script         | [reports/week-02/meeting-script.md](meeting-script.md)                                                                                                                                                                                       |
| Customer validation    | [reports/week-02/meeting-report.md](meeting-report.md), [reports/week-02/meeting-transcript.md](meeting-transcript.md)                                                                                                                       |
| AI usage               | [reports/week-02/ai-usage.md](ai-usage.md)                                                                                                                                                                                                   |

The Customer permitted recording and publishing a sanitized transcript, so we produced a transcript.
The records behind the Week 1 checks are in [the sentence quality test](evidence/sentence-quality-test.md) and in [the Reposition and forum records](evidence/week-1-checks.md).

## Minimum Usable Product Candidate

Core task: a learner turns the words they do not know in a pasted text into cards with sentences they have checked, and studies them in the product.

- [`US-01`: Get a sentence and a translation for each word I mark in a text](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/27)
- [`US-02`: Check the sentence written for a word](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/28)
- [`US-03`: Study my cards inside the product](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/29)

Customer's verdict: [`DEC-006`](../../docs/decisions.md#dec-006).

## What changed because of the Customer

- [`US-02`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/28) gained `AC-05` and `AC-06` (cards exist at once, and a card can be deleted): [`DEC-005`](../../docs/decisions.md#dec-005).
- [`US-07`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/33) moved from Won't Have to Must Have, with its own criteria, and [`BND-01`](../../docs/product-vision.md#bnd-01) now names an outside audio source: [`DEC-007`](../../docs/decisions.md#dec-007).
- [`CON-07`](../../docs/product-vision.md#con-07) now requires that the product is self-hostable: [`DEC-008`](../../docs/decisions.md#dec-008).

## Contribution

| Member               | Work                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nataliamotand        | Product vision ([PR #26](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/26)), user stories ([issues #27 to #34](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues?q=label%3Auser-story)), prototypes record ([PR #37](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/37)), meeting script and report ([PR #40](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/40), [PR #41](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/41)), this report ([PR #42](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/42)); interviewer and screen sharing at the validation meeting |
| AbdelrahmanAbdel-Aal | Markdown formatting ([PR #23](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/23)), Markdown check in CI ([PR #24](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/24)), Anki "Reposition" timing; approved [PR #37](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/37)                                                                                                                                                                                                                                                                                                                                                              |
| emapfff              | Assumptions log ([PR #21](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/21)), decisions log ([PR #22](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/22)), forum search; observer at the validation meeting                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Repository evidence

- A merged pull request that closed its task issue: [PR #37](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/37), which closed issue #35 and was approved by AbdelrahmanAbdel-Aal.
- The latest green link check and Markdown check on `main`: [the workflow runs on `main`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/actions/workflows/lychee.yml?query=branch%3Amain), where the `lychee` job is the link check and the `markdownlint` job is the Markdown check.
- Excluded links, in [.lycheeignore](../../.lycheeignore): unchanged since Week 1, for the reasons in the [Week 01 report](../week-01/README.md#repository-evidence).

## Deviations

- The decisions and action points were read back to the Customer by a written message after the meeting, not in the meeting itself. The Customer replied that they were correct.
- The third permission question, about sharing privately, was not asked, because the first two were granted.
- `BND-01` says an outside source handles the audio, but the context diagram does not show that source yet. Updating the diagram is an action point in the [meeting report](meeting-report.md#action-points).

## Privacy

No private-only material was committed to this repository.
