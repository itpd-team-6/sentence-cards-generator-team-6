# UT-01: Reach The First Answered Card Unaided

- **Status:** Planned
- **Design sprint:** [SPRINT-07](../../project-plan.md#sprint-07)
- **Run sprint:** [SPRINT-08](../../project-plan.md#sprint-08)

A learner who has not used the product before gets from a newly opened library to the first answered card without help.

## Research questions

1. Does a participant reach the first answered card without a hint?
2. Which step makes a participant ask for help?
3. Can a participant put cards in a group of their own, and replace a sentence they do not like, without help?

## The Requirement

[QR-08](../../quality-requirements/qr/QR-08.md), whose `QRT-01` names `UT-01` in `**Runs at:**`.

## Participant Profile

- **Role:** a person who studies Russian, English or German and reads texts in it.
- **Familiarity:** has not used the product before; whether the participant has used other vocabulary or flashcard apps is asked in the pre-test and recorded.
- **Device:** the team's laptop, or the participant's own laptop connected to the campus network.
- **Relation to the target user:** a learner of Russian, English or German who is 18 or older and is not a team member, the Customer, an instructor or course staff.

At least three completed sessions are needed, and five is the design target.
A session with someone outside this profile is exploratory: it is not counted, and its note says so.
A dry run with a team member is not a session and is not evidence.

## The Tasks

The team prepares a short text of similar length in each of Russian, English and German, and the participant uses the text in the language they study.
The tasks are the same for every participant and run in this order.
The success criterion of each task is `Unaided` when the participant reaches the end state without help, `Assisted` when a hint or help is needed and is recorded, and `Failed` when the end state is not reached within the time limit.
A hint is pointing at a page or a control, and help is doing a step for the participant; the observer records each one beside the task.
The facilitator reads each scenario verbatim and answers only questions about the scenario, never about the interface.

1. **Main usability test task: practise the words of a text.**
   You read a short text today in a language you are learning, and you want to remember some of its words.
   Get ready to practise them as cards, and answer the first card.
   Start: the library has just been opened and holds no texts and no cards, and you have the text.
   End state: the participant has answered the first card of the words they chose.
   Time limit: 8 minutes.
2. **Secondary usability test task: group the new cards.**
   You want your new cards together in a group of your own that you can study later.
   Start: the library with the cards of the main task.
   End state: the cards are together in a group the participant made.
   Time limit: 4 minutes.
3. **Secondary usability test task: replace a sentence.**
   A card shows a sentence you do not like.
   Get a different one.
   Start: a card of the library is open.
   End state: the card shows a different sentence.
   Time limit: 3 minutes.

## Protocol

Every session runs in this order: the welcome, the consent and recording check, the pre-test, the think-aloud instruction, the scenario reading, the observation, the SEQ after each task, the SUS and the open-ended post-test after all the tasks, and the debrief.
The session is in person, on the university network, and the participant uses the team's laptop or their own laptop on the campus network.
It runs against the staging deployment, with a newly opened library for each participant, and the product makes no payment.
The observer records the help given, the time on task, the friction points and the quotes.
The facilitator stops the session when the participant asks to stop, or when the team observes a critical or security-sensitive problem; the stop and its reason are recorded in the session note, and a session stopped before its data is complete does not count.
The staging address and any credentials are shared for the session and are never committed.

## Measures

Each session records the pre-test background, the think-aloud observation, the completion and assistance of each task, the time on task, a SEQ after each task, a SUS after all the tasks, and the open-ended post-test.
The quality requirement reads the median SEQ of the main task.
The questions are in `surveys.md`.

## Instrumentation

The events the product already records cover the main task: `text_saved`, `cards_generated` and `card_answered`, and `sentence_replaced` covers the second secondary task.
During a session they carry `source=usability-test` and the participant code `P-nn`, so each session is read from the events it produced.
No event covers making a group of cards, so the first secondary task is read from the observation.
The instrumentation collects no personal data, runs on the staging deployment and never on production, and its filtered export goes to the private repository.
It is implemented in issue [#278](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/278).
It has not been verified yet: the verification is recorded here before the first counted session.

## Analysis Plan

The plan is written before the first session.
It reports a table with the outcome and the assistance of each task for each participant, the share of participants who reached the end state of the main task and the share who did so unaided, the median time on the main task, the median SEQ of each task, and the SUS mean and median with the number of sessions.
It also reports the themes of the notes with the sessions they came from, a severity of `Critical`, `Major` or `Minor` for each finding with its reason, a comparison with the events that were instrumented and what they could not cover, and the limitations.
No other measure is added after the data.

## Schedule

The sessions are arranged in SPRINT-08 and have no fixed dates yet.
The results are due with Submission 8 on 2026-11-21.

## Roles

- **Facilitator:** `nataliamotand`, who runs every counted session.
- **Observer:** `emapfff`.
- **Recordings and raw notes:** `nataliamotand`.

## Environment

The staging deployment on the university VM, reached from the university network, with a newly opened library for each participant.

## Consent And Data

Every counted session has a durable consent recorded before it, and the public template is `consent.md`.
The consent records, the identity mapping, the raw notes and the filtered export of the instrumentation are in the [private usability data repository](https://github.com/itpd-team-6/sentence-cards-generator-team-6-usability-data), which the link check excludes because it needs authentication.
The recordings are in the team's cloud folder, and the link is in the Moodle submission and not in this repository.
The public evidence is this record, the surveys, the consent template, the session notes and the results.

## Evidence Map

| Item                                             | Where it goes                                              |
| ------------------------------------------------ | ---------------------------------------------------------- |
| The record, the surveys and the consent template | `docs/usability-tests/ut-01/`                              |
| The sanitized session notes                      | `docs/usability-tests/ut-01/sessions/`                     |
| The results and the findings                     | `docs/usability-tests/ut-01/results.md`                    |
| The consent records and the identity mapping     | the private usability data repository                      |
| The raw notes and the filtered export            | the private usability data repository                      |
| The recordings                                   | the team's cloud folder, linked from the Moodle submission |

The results are in [results.md](results.md).
