# Sprint 05 retrospective

## What Went Well

| What went well                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The Customer accepted `US-04` at the meeting (`DEC-045`) and `US-09` in the chat the same day (`DEC-053`), so both stories of the sprint were accepted.                                                    |
| Staging and production ran the same commit on the virtual machine before the meeting, and the demonstration of both stories was run end to end the day before.                                             |
| The criterion about browsers that the Customer asked for in the meeting became `AC-04` of `US-09`, was tested in Firefox and Chrome on a computer and in Chrome on a phone, and was accepted the same day. |

## What Did Not

| Problem                                                                        | Root cause                                                                                                                                                |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The results of the quality requirement tests were not shown at the meeting.    | The pull request with the tests was merged after the meeting, and the testing plan, which records their results, was not written before it.               |
| The revision of the question to the language model was not done in the sprint. | The Gemini endpoint refused the address of the virtual machine, so the language model had to change on 2026-10-30 (`DEC-044`), which left no time for it. |

## Actions

| Action                                                                                                                                                                        | Owner         | Impact | Reason                                                                                        | Carried |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ | --------------------------------------------------------------------------------------------- | ------- |
| Revise the question to the language model, try longer context phrases and the format of the Customer, and run the test table of `FR-009` on the model of the virtual machine. | nataliamotand | High   | The revision was an action point of the Week 4 meeting and was not done in `SPRINT-05`.       | Yes     |
| Make the headings "Due today" and "Later" of the study queue stay in view, each list with its own scroll.                                                                     | nataliamotand | Medium | The Customer asked for it in the Week 4 meeting (`DEC-035`) and it still needs an adjustment. | No      |
| Write the quality requirement tests and the testing plan before the script of the next meeting is written.                                                                    | nataliamotand | Medium | The results of the tests could not be shown at the meeting of `SPRINT-05`.                    | No      |

## Carried Actions

| Action                                                                                                                                                                                  | Outcome                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [`reports/week-04/sprint-retrospective.md`](../week-04/sprint-retrospective.md#actions): "Run the demonstration of the sprint's stories end to end on the day before each meeting."     | `Done`: the demonstration of `US-04` and `US-09` was run end to end on 2026-10-30, the day before the meeting.                    |
| [`reports/week-04/sprint-retrospective.md`](../week-04/sprint-retrospective.md#actions): "Estimate the stories and set the planned velocity in the planning, before the sprint starts." | `Done`: `SPRINT-05` was planned with its stories estimated and a [planned velocity](../../docs/project-plan.md#sprint-05) of `8`. |
