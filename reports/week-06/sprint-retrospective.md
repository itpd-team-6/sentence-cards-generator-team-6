# Sprint 06 retrospective

Draft for team review at sprint close.
Confirm Sprint 07 ownership before finalizing.

## What Went Well

| What went well                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The decks implementation and the study queue layout update merged into `main` through [PR #202](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/202) and [PR #205](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/205). |
| The [analytics plan](../../docs/analytics.md) documents the events, metric queries and pipeline.                                                                                                                                                                 |
| The [observability plan](../../docs/observability.md) documents the request signals, `SLI-01` and pipeline.                                                                                                                                                      |
| `QR-07`'s `QRT-01` passed on staging on 2026-11-07, as recorded in the [test evidence](qrt-01-evidence.md#the-run).                                                                                                                                              |

## What Did Not

| Problem                                                                                                                                                                                                                                                | Root cause                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| The language-model question revision ([issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165)) was deferred to Sprint 07.                                                                                              | Sprint 06 time went to the decks (US-11), libraries (US-12), analytics dashboards, and observability setup. |
| The due-date and time-zone scenarios ([issue #174](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/174) and [issue #183](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/183)) were deferred to Sprint 07. | Sprint 06 time went to the decks (US-11), libraries (US-12), analytics dashboards, and observability setup. |

## Actions

Natalia suggested taking issue #165 in Sprint 07.
Ownership of issues #174 and #183 is pending confirmation based on the capacity of `AbdelrahmanAbdel-Aal` and `emapfff`.

| Action                                                                                                                                                                        | Owner                    | Impact | Reason                                                                                                                                                                                                                        | Carried |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Revise the question to the language model, try longer context phrases and the format of the Customer, and run the test table of `FR-009` on the model of the virtual machine. | nataliamotand (proposed) | High   | The Sprint 05 action is still open in [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165).                                                                                                | Yes     |
| Prepare scenarios that show the due date for a card marked at the start and end of a day under each time-zone option.                                                         | To confirm               | Medium | The time-zone work in [issue #174](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/174) and [issue #183](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/183) moved to Sprint 07. | Yes     |
| Confirm ownership of issues #174 and #183 during Sprint 07 planning based on team capacity.                                                                                   | To confirm               | Medium | The due-date and time-zone work needs confirmed ownership before it can be scheduled.                                                                                                                                         | No      |

## Carried Actions

| Action                                                                                                                                                                                                                        | Outcome                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "[Revise the question to the language model, try longer context phrases and the format of the Customer, and run the test table of `FR-009` on the model of the virtual machine.](../week-05/sprint-retrospective.md#actions)" | `Not done`. The [Sprint Review script](meeting-script.md#agenda) records the action as unfinished in Week 6, and [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165) is open. |
