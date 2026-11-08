# Sprint 06 retrospective

Draft for team review at sprint close.
Confirm the Sprint 06 root causes and the proposed action assignments before finalizing.

## What Went Well

| What went well                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The decks implementation and the study queue layout update merged into `main` through [PR #202](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/202) and [PR #205](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/205). |
| The [analytics plan](../../docs/analytics.md) documents the events, metric queries and pipeline.                                                                                                                                                                 |
| The [observability plan](../../docs/observability.md) documents the request signals, `SLI-01` and pipeline.                                                                                                                                                      |
| `QR-07`'s `QRT-01` passed on staging on 2026-11-07, as recorded in the [test evidence](qrt-01-evidence.md#the-run).                                                                                                                                              |

## What Did Not

| Problem                                                                                                                                                                                                                                  | Root cause                                                                                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The language-model question revision was unfinished in Week 6, as recorded in the [Sprint Review script](meeting-script.md#agenda), and [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165) is open. | To verify with the team. The script records the deferral and gives no Sprint 06 cause.                                                                                                                                                                         |
| The due-date and time-zone scenarios were unfinished in Week 6, as recorded in the [Sprint Review script](meeting-script.md#agenda).                                                                                                     | To verify with the team. [Issue #183](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/183) documents the use of the server date, which explains the scheduling problem. The reason the scenarios slipped is still open for verification. |

## Actions

The first two owners come from the [Sprint 05 retrospective](../week-05/sprint-retrospective.md#actions) and the [Week 5 action points](../week-05/meeting-report.md#action-points).
Confirm these assignments for Sprint 07 and confirm the owner, impact and carry flag of each proposed action.

| Action                                                                                                                                                                        | Owner         | Impact | Reason                                                                                                                         | Carried |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ | ------- |
| Revise the question to the language model, try longer context phrases and the format of the Customer, and run the test table of `FR-009` on the model of the virtual machine. | nataliamotand | High   | The Sprint 05 action is still open in [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165). | Yes     |
| Prepare scenarios that show the due date for a card marked at the start and end of a day under each time-zone option.                                                         | nataliamotand | Medium | The Week 6 script records the scenarios as unfinished and proposes carrying them to Week 7.                                    | Yes     |
| At Sprint 07 planning, record what blocked the two deferred actions and confirm who will complete each one.                                                                   | To confirm    | Medium | Recording blockers and owners gives the team a basis for following up on both actions.                                         | No      |

## Carried Actions

| Action                                                                                                                                                                                                                        | Outcome                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "[Revise the question to the language model, try longer context phrases and the format of the Customer, and run the test table of `FR-009` on the model of the virtual machine.](../week-05/sprint-retrospective.md#actions)" | `Not done`. The [Sprint Review script](meeting-script.md#agenda) records the action as unfinished in Week 6, and [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165) is open. |
