# Study queue example

This is the outcome of an action point of the [Week 2 meeting report](../../week-02/meeting-report.md#action-points): "Prepare an example of the study queue that shows the cost of reordering, to ask the Customer again".
It is an invented example to put in front of the Customer.
It is not data from a real learner, and `US-04` is not built yet.

## The situation

A learner has three texts.
The study queue shows the cards due today, the oldest due date first, and then in the order the cards were made.
Every card has a due date; a card the learner has already studied also has a review history, and a new card has none.

| Text | Card | Studied before? | Due     |
| ---- | ---- | --------------- | ------- |
| A    | A1   | yes             | earlier |
| A    | A2   | yes             | earlier |
| B    | B1   | no              | today   |
| B    | B2   | no              | today   |
| B    | B3   | no              | today   |
| C    | C1   | no              | today   |
| C    | C2   | no              | today   |
| C    | C3   | yes             | today   |

The queue today is: A1, A2, B1, B2, B3, C1, C2, C3.

The learner wants to study text C first, while its words are fresh.

## Two readings of "move text C to the front"

| Reading                                              | Queue after the move           | What changes for the studied card C3                     |
| ---------------------------------------------------- | ------------------------------ | -------------------------------------------------------- |
| 1. Every card of C moves, as `AC-01` of `US-04` says | C1, C2, C3, A1, A2, B1, B2, B3 | C3 is studied first, ahead of A1 and A2 that are overdue |
| 2. Only the new cards of C move                      | C1, C2, A1, A2, B1, B2, B3, C3 | Nothing: C3 stays where its due date puts it             |

In both readings the review history and the due date of C3 stay as they are, as `AC-02` of `US-04` says.
The two readings differ in one place: whether a card the learner already studied jumps ahead of overdue cards of another text.

The Customer expected the second reading but said "I'm not sure" ([Week 2 meeting report](../../week-02/meeting-report.md#open-questions)); this example is what we ask him about.

## What the move costs

- In Anki, the move takes a "Reposition" of the cards of the text. We timed one measurement of about 55 seconds, which includes making the cards ([Week 1 checks](../../week-02/evidence/week-1-checks.md#anki-reposition-timing)).
- In our product the move would be one action on the text. We have not built it and have not timed it, so we do not claim a number for it.
