# Week 08 report

## Project

Sentence cards generator, team 6.
Assignment 8, The Usability Results And The Project Configuration Review: the results of the first usability test, `UT-01`, the Sprint Review with the Customer as its results review, the review of the configuration of the repository, and the sixth release of the product.

The testing plan is in [docs/project-plan.md#quality-requirement-testing-plan](../../docs/project-plan.md#quality-requirement-testing-plan), and the rows that are not `Passes` are only there.

Start with the [`UT-01` results](../../docs/usability-tests/ut-01/results.md), the [meeting report](meeting-report.md) and the [project plan](../../docs/project-plan.md#sprint-08).

## What we did

We ran the four sessions of `UT-01` on 2026-11-20, wrote their sanitized notes and their [results](../../docs/usability-tests/ut-01/results.md), compared them with the events of the instrumentation, and triaged six findings into the product backlog.
`QR-08 QRT-01` is `Passes` and `TOS-03` is `Achieved`.
We held the Sprint Review on 2026-11-21 as the results review, and the Customer counted the four sessions, agreed that `QR-08` is met, and accepted `US-20` and `US-16`.
We recorded the decisions of the meeting, `DEC-079` to `DEC-092`, planned `SPRINT-08` and `SPRINT-09`, wrote the retrospective, and documented the configuration terms and the configuration risks.
None of the fixes for the three Major findings could land in `SPRINT-08`, so their task issues moved to `SPRINT-09` at the sprint close, as Part 5 allows, and there was no product change this week, so the sixth release, `REL-08`, is a documentation-only release.
The report of the configuration review is in [`## Configuration management`](#configuration-management).

## Findings

Four people outside the team ran `UT-01`, and all four reached the end of the main task, one of them without help.
The median SEQ of the main task is 5 of 7, the median SEQ is 6 for the second task and 6.5 for the third, and the SUS mean is 68.75 with a median of 73.75, with `n=4`.
`QR-08 QRT-01` is `Passes` with a thin margin: the median of 5 meets the bar of at least 5 in at least three counted sessions, and three of the four participants needed a hint in the main task.
The sessions gave three Major findings and three Minor ones: [Finding 1](../../docs/usability-tests/ut-01/results.md#finding-1) (the cards are not made with the deck), [Finding 3](../../docs/usability-tests/ut-01/results.md#finding-3) (where to go after the cards are made) and [Finding 4](../../docs/usability-tests/ut-01/results.md#finding-4) (no reason is given when a sentence cannot be written) are Major, and the Customer agreed that they are important to address ([`DEC-082`](../../docs/decisions.md#dec-082)).
The events of the sessions agree with the observation: the stream `events` held 46 events on 2026-11-20, all with `source=usability-test` and one of the four participant codes, and no event contradicts an outcome in the session notes ([instrumentation comparison](../../docs/usability-tests/ut-01/results.md#instrumentation-comparison)).
The focus metric, [cards studied per active learner per week](../../docs/analytics.md#cards-studied-per-active-learner-per-week), is read in [`## Analytics`](#analytics).

## Usability test

The test is the one designed in Week 7, in [the `UT-01` record](../../docs/usability-tests/ut-01/README.md).
The four sessions ran in person on campus on 2026-11-20, on the staging deployment and on the facilitator's laptop, with participants `P-01` to `P-04`, none of them a team member.
Three study German, one of them also English, and one studies Russian; two had used a flashcard application before.
The facilitator, `nataliamotand`, also observed every session.

The [results](../../docs/usability-tests/ut-01/results.md) hold the table of outcomes, the themes, the six findings with their severity, evidence and recommendation, the triage, the instrumentation comparison, the limitations and the conclusion.
The sanitized notes of each session are in [sessions](../../docs/usability-tests/ut-01/sessions/README.md), and they carry no participant identity.

| Finding                                                                   | Severity | Task issue                                                                              | Scheduled                                             |
| ------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [Finding 1](../../docs/usability-tests/ut-01/results.md#finding-1)        | Major    | [issue #321](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/321) | `SPRINT-08`, moved to `SPRINT-09` at the sprint close |
| [Finding 3](../../docs/usability-tests/ut-01/results.md#finding-3)        | Major    | [issue #322](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/322) | `SPRINT-08`, moved to `SPRINT-09` at the sprint close |
| [Finding 4](../../docs/usability-tests/ut-01/results.md#finding-4)        | Major    | [issue #323](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/323) | `SPRINT-08`, moved to `SPRINT-09` at the sprint close |
| [Findings 2, 5 and 6](../../docs/usability-tests/ut-01/results.md#triage) | Minor    | None, for the reasons in the triage                                                     | See triage                                            |

The consent records, the identity mapping, the transcripts of the recordings and the export of the events of the sessions are in the [private usability data repository](https://github.com/itpd-team-6/sentence-cards-generator-team-6-usability-data), and the recordings are in the team's cloud folder, whose link is in the Moodle submission.
The observation notes were taken on paper, in a notebook, and hold only the SEQ and SUS answers and the start and end times of the tasks of each participant, whose values are in the [results](../../docs/usability-tests/ut-01/results.md), so the notebook was not uploaded.
The public record carries no participant identity.

## Configuration management

The configuration review of this week is incomplete.
The configuration plan, [issue #313](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/313), and the goal-based evaluation, [issue #314](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/314), are not in the repository at the close of `SPRINT-08`, and both move to `SPRINT-09`.
What the week did add to the configuration work is the configuration terms in the [glossary](../../docs/glossary.md), from [PR #318](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/318), and the configuration risks in the [risk register](../../docs/risks.md), from [PR #319](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/319).

## Customer meeting outcome

The meeting was on 2026-11-21, and the full record is in the [meeting report](meeting-report.md).

- The Customer counted the four sessions ([`DEC-079`](../../docs/decisions.md#dec-079)), agreed that `QR-08` is met ([`DEC-080`](../../docs/decisions.md#dec-080)) and agreed that `TOS-03` is achieved once the notes are in the repository ([`DEC-081`](../../docs/decisions.md#dec-081)).
- He agreed that the three Major findings are important to address ([`DEC-082`](../../docs/decisions.md#dec-082)), and he did not decide how to design the deck flow and where to go after the cards are made, which the team brings back as options.
- He accepted `US-20` and `US-16` ([`DEC-084`](../../docs/decisions.md#dec-084)).
- Findings of the test: clear the previous text and show an information box ([`DEC-085`](../../docs/decisions.md#dec-085)), a clearer text for "Show translation" ([`DEC-086`](../../docs/decisions.md#dec-086)) and a warning for words selected together ([`DEC-087`](../../docs/decisions.md#dec-087)).
- Interface changes: full language names ([`DEC-088`](../../docs/decisions.md#dec-088)), no layers icon on the cards ([`DEC-089`](../../docs/decisions.md#dec-089)) and icons on the selection bar ([`DEC-090`](../../docs/decisions.md#dec-090)).
- A number field in the Reorder box for the daily limit ([`DEC-091`](../../docs/decisions.md#dec-091)), and the daily limits come before the audio ([`DEC-092`](../../docs/decisions.md#dec-092)).
- The actions that were not carried out are carried to the next sprint ([`DEC-083`](../../docs/decisions.md#dec-083)).

## Threshold review

All four goals of [the threshold of success](../../docs/threshold-of-success.md) were `Open` when the review started.

| Goal                                                | Current measure                                                                                                   | New data can settle it                                                              | Proposal                  |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------- |
| [TOS-01](../../docs/threshold-of-success.md#tos-01) | The Customer's recorded acceptance of `US-01`, `US-02` and `US-03`, each as a `DEC-nnn`, by the end of Week 9.    | No: the acceptances of this week, `DEC-084`, are of `US-20` and `US-16`.            | Keep it `Open`, no change |
| [TOS-02](../../docs/threshold-of-success.md#tos-02) | One person outside the team who gets the product running by following only `setup.md`, written in the repository. | No: the `UT-01` participants used the staging site and did not install the product. | Keep it `Open`, no change |
| [TOS-03](../../docs/threshold-of-success.md#tos-03) | One person outside the team who goes from a pasted text to studying the cards, written in the repository.         | Yes: four people did it in `UT-01`, and the Customer agreed in `DEC-081`.           | Mark it `Achieved`        |
| [TOS-04](../../docs/threshold-of-success.md#tos-04) | The demonstration of `US-01`, `US-02` and `US-03` on the working application at the defense in Week 11.           | No: the defense is in Week 11.                                                      | Keep it `Open`, no change |

`TOS-01` stays `Open`, because this week's acceptances do not cover the stories that its measure names.
`TOS-02` stays `Open`, because nobody outside the team has followed `setup.md` yet.
`TOS-03` is `Achieved`: four people outside the team went from a text to the first answered card on 2026-11-20, one of them without help, the where-they-got-stuck notes are in the results, and the Customer agreed in `DEC-081`.
`TOS-04` stays `Open`, because it is settled at the defense.
No goal has a new measure proposed, and no goal is `Achieved` without evidence in the repository.

## Analytics

The focus metric is [cards studied per active learner per week](../../docs/analytics.md#cards-studied-per-active-learner-per-week), and its query excludes the events with `source = 'smoke'` and `source = 'usability-test'`.
On 2026-11-21 at about 22:05 (UTC+03:00) `nataliamotand` ran that query on the stream `events` of the staging organisation of the analytics backend, for 2026-11-14 00:00 to 2026-11-21 23:59, and it returned one row:

| week       | answers_per_learner |
| ---------- | ------------------- |
| 2026-11-09 | 1                   |

A second query counted the events by source and by event in the same range:

| source           | event               | n   |
| ---------------- | ------------------- | --- |
| `usability-test` | `card_answered`     | 12  |
| `usability-test` | `cards_generated`   | 11  |
| `usability-test` | `sentence_replaced` | 16  |
| `usability-test` | `text_saved`        | 11  |
| `web`            | `card_answered`     | 1   |
| `web`            | `cards_generated`   | 2   |
| `web`            | `text_saved`        | 2   |

The 50 events of `usability-test` are the 46 events of the four sessions of 2026-11-20 and the 4 events of the check with the code `P-99` on 2026-11-15, recorded in [the Week 7 verification](../week-07/instrumentation-verification.md), and the query leaves all of them out.
The row of the week of 2026-11-09 comes from the one `card_answered` event with `source=web`, and the team has no evidence that it comes from a learner outside the team, so the team does not report it as the value of the focus metric.
The focus metric still has no value, and the first learners outside the team who answer cards outside a test session will give it one.
Production was not queried.

## Week 9 handoff

- The three Major findings are task issues, scheduled in `SPRINT-08` and moved to `SPRINT-09` at the sprint close: [issue #321](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/321), [issue #322](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/322) and [issue #323](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/323); the Customer decides the design of the first two at a later meeting, and the team brings options.
- The actions due at the next Sprint Review are in the [meeting report](meeting-report.md#action-points): the new wording of "Show translation", the options for making a deck and for where to go after the cards are made, the test of the meaning records, the stories for the Texts tab, and the time zone scenarios.
- The next stories follow [`DEC-092`](../../docs/decisions.md#dec-092): the daily limits come before the audio.
- The plan of the sprint is [`SPRINT-09`](../../docs/project-plan.md#sprint-09), and the carried retrospective action is in the [retrospective](sprint-retrospective.md#carried-actions).
- The configuration plan and the goal-based evaluation, [issue #313](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/313) and [issue #314](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/314), are the first tasks of the sprint.
- The goals `TOS-01`, `TOS-02` and `TOS-04` are still `Open`.
- The open questions of the meeting are in the [meeting report](meeting-report.md#open-questions).

## Coverage

| Deliverable                | Artifact                                                                                                                                                                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sprint plan                | [docs/project-plan.md#sprint-08](../../docs/project-plan.md#sprint-08)                                                                                                                                                                                     |
| `UT-01` session notes      | [docs/usability-tests/ut-01/sessions/README.md](../../docs/usability-tests/ut-01/sessions/README.md)                                                                                                                                                       |
| `UT-01` results and triage | [docs/usability-tests/ut-01/results.md](../../docs/usability-tests/ut-01/results.md)                                                                                                                                                                       |
| `QR-08` verdict            | [docs/quality-requirements/qr/QR-08.md](../../docs/quality-requirements/qr/QR-08.md) and the [testing plan](../../docs/project-plan.md#quality-requirement-testing-plan)                                                                                   |
| Threshold review           | [reports/week-08/README.md#threshold-review](#threshold-review) and [docs/threshold-of-success.md](../../docs/threshold-of-success.md)                                                                                                                     |
| Configuration management   | [reports/week-08/README.md#configuration-management](#configuration-management)                                                                                                                                                                            |
| Analytics                  | [reports/week-08/README.md#analytics](#analytics) and [docs/analytics.md](../../docs/analytics.md)                                                                                                                                                         |
| Week 9 handoff             | [reports/week-08/README.md#week-9-handoff](#week-9-handoff)                                                                                                                                                                                                |
| Glossary                   | [docs/glossary.md](../../docs/glossary.md)                                                                                                                                                                                                                 |
| Risk register              | [docs/risks.md](../../docs/risks.md)                                                                                                                                                                                                                       |
| Week 7 action points       | [reports/week-08/meeting-report.md#previous-action-points](meeting-report.md#previous-action-points)                                                                                                                                                       |
| Week 7 open questions      | [reports/week-08/meeting-report.md#previous-open-questions](meeting-report.md#previous-open-questions)                                                                                                                                                     |
| Sprint Review              | [reports/week-08/meeting-report.md](meeting-report.md)                                                                                                                                                                                                     |
| Meeting script             | [reports/week-08/meeting-script.md](meeting-script.md)                                                                                                                                                                                                     |
| Meeting transcript         | [reports/week-08/meeting-transcript.md](meeting-transcript.md)                                                                                                                                                                                             |
| `REL-08`                   | [v0.4.1](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.4.1), its release body, [the changelog's released section](../../CHANGELOG.md#041---2026-11-21) and [the plan's `REL-08` block](../../docs/project-plan.md#rel-08) |
| Sprint retrospective       | [reports/week-08/sprint-retrospective.md](sprint-retrospective.md)                                                                                                                                                                                         |
| AI usage                   | [reports/week-08/ai-usage.md](ai-usage.md)                                                                                                                                                                                                                 |

## Contribution

| Member               | Work                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nataliamotand        | [PR #332](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/332) (the `UT-01` notes and results, the decisions, the meeting records and the `QR-08` and `TOS-03` verdicts), [PR #333](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/333) (the plan of `SPRINT-08` and its retrospective), the release record of `REL-08` and this report (the pull request that carries it); ran the four sessions of `UT-01` as facilitator and observer and led the Sprint Review; reviewed [PR #318](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/318), [PR #319](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/319) and [PR #320](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/320) |
| AbdelrahmanAbdel-Aal | [PR #318](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/318) (the configuration terms in the glossary), [PR #319](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/319) (the configuration risks), [PR #320](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/320) (the plan of `SPRINT-09` and the refined backlog); reviewed [PR #332](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/332) and [PR #333](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/333)                                                                                                                                                                                                                |
| emapfff              | assigned [issue #313](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/313) and [issue #314](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/314), which are still open at the close of `SPRINT-08`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

## Repository evidence

- A merged pull request that closed its task issue: [PR #333](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/333), which closed [issue #329](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/329).
- The runs on `main` at commit `4d8ee99`, the last one before this report, all green: [Workflow lint](https://github.com/itpd-team-6/sentence-cards-generator-team-6/actions/runs/44936168602), [Documentation site](https://github.com/itpd-team-6/sentence-cards-generator-team-6/actions/runs/44936168453), [Product CI](https://github.com/itpd-team-6/sentence-cards-generator-team-6/actions/runs/44936168512), [Markdown and link checks](https://github.com/itpd-team-6/sentence-cards-generator-team-6/actions/runs/44936168479).
- Excluded links, in [.lycheeignore](../../.lycheeignore): no entry was added in Week 8.

## Deviations

- The configuration plan and the goal-based evaluation, [issue #313](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/313) and [issue #314](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/314), are not in the repository, and move to `SPRINT-09`; the configuration section of this report says what the week did add.
- The facilitator was also the only observer of every session, where the protocol asks for two team members.
- The recordings of `P-01`, `P-02` and `P-03` are incomplete, so the times on task are approximate; the limitations of the [results](../../docs/usability-tests/ut-01/results.md#limitations) list the gaps.
- The limit of the second task was 10 minutes in the sessions, and the first version of the record said 5 minutes, which the record now matches.
- In `P-02` the third task ended about 10 seconds over its limit and the facilitator added words to the library, and in `P-03` the first two SEQ answers were corrected after the scale was explained again.
- The time to find and copy the text was measured in two of the four sessions, so no median is reported.
- The scenarios were not read word for word in every session, and extra explanations were given.
- The raw observation notes were not uploaded to the private usability data repository, for the reason in [`## Usability test`](#usability-test).
- The text transcripts of the recordings were given to an AI tool and not only the sanitized notes, and the [consent](../../docs/usability-tests/ut-01/consent.md) does not mention transcription or an AI tool; the [AI usage](ai-usage.md) says so.
- At the Sprint Review the three permission questions were asked as one, the sharing of the recording in private was not asked, and the read-back was not done in the meeting, so the next steps went to the Customer in a chat message after it.
- The meeting script was committed after the meeting.
- The dry run of `UT-01`, [issue #279](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/279), was done and no record of it was kept.

## Privacy

No recording, no consent record, no identity mapping, no transcript of a session, no credential and no address of the university virtual machine was committed to this repository.
The consent records, the identity mapping, the transcripts of the sessions and the export of their events are in the private usability data repository, and the transcript of the Sprint Review is public because the Customer permitted it.
