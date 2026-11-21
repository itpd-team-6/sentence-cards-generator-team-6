# UT-01 Results

Four sessions ran on 2026-11-20: `UT-01 P-01` to `UT-01 P-04`, recruited under the participant profile of the record.
The record sets a design target of five participants and a minimum of three, so the sample is above the minimum and below the target.
No participant withdrew.

## The Results

`Task 1` is the main task, and `Task 2` and `Task 3` are the secondary tasks.
Every session note is in [sessions](sessions/README.md).

| Participant              | Task 1   | Task 1 SEQ | Task 2   | Task 2 SEQ | Task 3   | Task 3 SEQ | SUS  |
| ------------------------ | -------- | ---------- | -------- | ---------- | -------- | ---------- | ---- |
| [P-01](sessions/P-01.md) | Assisted | 5          | Unaided  | 6          | Unaided  | 6          | 75.0 |
| [P-02](sessions/P-02.md) | Unaided  | 5          | Failed   | 3          | Assisted | 5          | 37.5 |
| [P-03](sessions/P-03.md) | Assisted | 4          | Assisted | 6          | Unaided  | 7          | 72.5 |
| [P-04](sessions/P-04.md) | Assisted | 5          | Assisted | 6          | Assisted | 7          | 90.0 |

All four participants reached the end state of `Task 1`, and one of them did so unaided.
The assistance in every `Assisted` row is recorded in the session note; in `Task 1` and in the third task it was the facilitator reading the task again.
The median time on `Task 1` is about 9 minutes, from times of about 10, 9, 9 and 7 minutes and 25 seconds, and the time includes the search for the text.
The median time to find and copy the text is not reported: it was measured for two of the four sessions, with about 1 minute 50 seconds for `P-01` and at most 1 minute for `P-02`.
The median SEQ is 5 for `Task 1`, 6 for `Task 2` and 6.5 for `Task 3`.
The SUS mean is 68.75 and the median is 73.75, with `n=4`.
`Task 2` reached its end state in three of four sessions and unaided in one; `Task 3` reached it in four of four and unaided in two.

The `Task 1` median SEQ of 5 is the figure [QR-08](../../quality-requirements/qr/QR-08.md) reads.

## Themes

Each theme comes from at least two sessions.

| Theme                                                                                                           | Sessions                                                                                               | Finding                 |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------- |
| The cards are not made when the deck is made, and the participant has to ask for sentences first.               | [P-01](sessions/P-01.md), [P-02](sessions/P-02.md), [P-03](sessions/P-03.md), [P-04](sessions/P-04.md) | [Finding 1](#finding-1) |
| After the first use the participant does not know where to paste the text and where to go next.                 | [P-01](sessions/P-01.md), [P-02](sessions/P-02.md), [P-03](sessions/P-03.md), [P-04](sessions/P-04.md) | [Finding 3](#finding-3) |
| Several words are selected together and the participant is not told why a sentence cannot be written.           | [P-01](sessions/P-01.md), [P-02](sessions/P-02.md)                                                     | [Finding 4](#finding-4) |
| The long wording of the second task and the two routes to the cards of a deck made the second task the hardest. | [P-02](sessions/P-02.md), [P-03](sessions/P-03.md), [P-04](sessions/P-04.md)                           | [Finding 2](#finding-2) |
| The text of the first task stays in the text field when the participant starts the next text.                   | [P-01](sessions/P-01.md), [P-02](sessions/P-02.md)                                                     | [Finding 6](#finding-6) |

The study session had no way to go on before the translation was shown.
One participant said it, and a second was unsure what the exercise expected before the translation was shown, so it is a finding and not a theme: [Finding 5](#finding-5).

## Findings

### Finding 1

A participant who makes a new deck expects the cards to be made with it, and the cards are only made after the participant asks for sentences.

- **Severity:** Major: all four participants were stuck here, and each found the control that asks for sentences only after a while and on their own.
- **Tasks:** `UT-01 Task 1` with `UT-01 P-01`, `UT-01 P-02`, `UT-01 P-03` and `UT-01 P-04`.
- **Evidence:** [P-01](sessions/P-01.md), [P-02](sessions/P-02.md), [P-03](sessions/P-03.md) and [P-04](sessions/P-04.md); three of the four needed a hint in `Task 1`.
- **Recommendation:** make the sentences first, without a deck, and then offer to add the cards to a deck; the design is for the team to settle with the Customer.
- **Task issue:** [#321](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/321), scheduled in `SPRINT-08`

### Finding 2

The second task was the hardest, and its wording was long.
Three participants found the cards of the second group on the Decks page and one read them on the Study page, so the goal was reached but not always by the route the task expected.

- **Severity:** Minor: both routes work, and the difficulty came mostly from the length of the task wording.
- **Tasks:** `UT-01 Task 2` with `UT-01 P-02`, `UT-01 P-03` and `UT-01 P-04`.
- **Evidence:** [P-02](sessions/P-02.md) did not reach the end state in the limit, and [P-03](sessions/P-03.md) and [P-04](sessions/P-04.md) needed help.
- **Recommendation:** treat the wording of the task as the main cause, and make no product change for this finding.
- **Task issue:** None

### Finding 3

On first use a participant does not know where to paste the text and where to go next, and after the cards are made the participant reads them in the pop-up and takes the pop-up for the practice.

- **Severity:** Major: all four participants were unsure of the next step after making the cards, and a learner who does not find the study page does not reach the first answered card.
- **Tasks:** `UT-01 Task 1` with `UT-01 P-01`, `UT-01 P-02`, `UT-01 P-03` and `UT-01 P-04`.
- **Evidence:** [P-01](sessions/P-01.md), [P-02](sessions/P-02.md), [P-03](sessions/P-03.md) and [P-04](sessions/P-04.md).
- **Recommendation:** keep the main tabs in view when the page scrolls, or take the participant to the study page after the sentences are made; the team compares the two with the Customer.
- **Task issue:** [#322](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/322), scheduled in `SPRINT-08`

### Finding 4

Two participants kept the shift key pressed and put unrelated words in one card.
The model could not write a sentence for them, and the generic warning did not say why.

- **Severity:** Major: the participant gets no sentence and no reason, so the card cannot be used and the participant does not know what to change.
- **Tasks:** `UT-01 Task 1` with `UT-01 P-01` and `UT-01 P-02`.
- **Evidence:** [P-01](sessions/P-01.md) and [P-02](sessions/P-02.md).
- **Recommendation:** tell the participant why the words cannot make one sentence and show where in the text the problem is.
- **Task issue:** [#323](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/323), scheduled in `SPRINT-08`

### Finding 5

The study session has no way to go on before the translation is shown, and one participant asked for it.

- **Severity:** Minor: only one participant said it, a second was unsure what the exercise expected, and the fix is small.
- **Tasks:** `UT-01 Task 1` with `UT-01 P-01` and `UT-01 P-03`.
- **Evidence:** [P-01](sessions/P-01.md) and [P-03](sessions/P-03.md).
- **Recommendation:** make the text of the "Show translation" button say what the button is for.
- **Task issue:** None

### Finding 6

When a participant starts the second text, the first text is still in the text field.

- **Severity:** Minor: two participants met it and the fix is small.
- **Tasks:** `UT-01 Task 2` with `UT-01 P-01` and `UT-01 P-02`.
- **Evidence:** [P-01](sessions/P-01.md) and [P-02](sessions/P-02.md).
- **Recommendation:** clear the text field after the cards are made and say so on the page.
- **Task issue:** None

## Triage

| Finding                 | Severity | Task issue                                                                          | Scheduled                          |
| ----------------------- | -------- | ----------------------------------------------------------------------------------- | ---------------------------------- |
| [Finding 1](#finding-1) | Major    | [#321](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/321)   | `SPRINT-08`                        |
| [Finding 2](#finding-2) | Minor    | None: it concerns the wording of the test task, and both routes to the cards work.  | None                               |
| [Finding 3](#finding-3) | Major    | [#322](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/322)   | `SPRINT-08`                        |
| [Finding 4](#finding-4) | Major    | [#323](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/323)   | `SPRINT-08`                        |
| [Finding 5](#finding-5) | Minor    | None: the Customer asked the team to bring a new wording, which is an action point. | The next meeting with the Customer |
| [Finding 6](#finding-6) | Minor    | None: the Customer agreed to the change in `DEC-085`.                               | `SPRINT-09` planning               |

The Customer agreed with the three severities of the Major findings at the Sprint Review on 2026-11-21, recorded in `DEC-082`.

## Instrumentation Comparison

The record's `## Instrumentation` section names `text_saved`, `cards_generated` and `card_answered` for the main task and `sentence_replaced` for the third task, each with `source=usability-test` and the participant code.
The counts below were read from the analytics backend of the staging deployment on 2026-11-21, for the day of the sessions, 2026-11-20 (UTC+03:00).
The stream `events` held 46 events on that day, and all 46 carry `source=usability-test` and one of the four participant codes, so no event of the sessions is missing its tag and no other event is in the stream for that day.

| Participant | `text_saved` | `cards_generated` | `card_answered` | `sentence_replaced` | Events |
| ----------- | ------------ | ----------------- | --------------- | ------------------- | ------ |
| `P-01`      | 2            | 2                 | 6               | 4                   | 14     |
| `P-02`      | 3            | 3                 | 1               | 3                   | 10     |
| `P-03`      | 3            | 3                 | 2               | 4                   | 12     |
| `P-04`      | 2            | 2                 | 2               | 4                   | 10     |

What the events and the observation say together:

- Every session has a `card_answered` event after a `text_saved` and a `cards_generated` event, so the events agree with the observation that all four participants reached the end state of `Task 1`, including `P-01`, `P-02` and `P-03`, whose recordings are incomplete.
- Every session has three or four `sentence_replaced` events, which agrees with the end state of `Task 3`, a different sentence got at least twice; the events do not say in which place of the app each one was got.
- Every participant saved a text more than once; the event does not say who saved it or why, so the events alone explain none of the extra `text_saved` events.
- No event contradicts an outcome in the session notes.

The instrumentation does not cover the time to find and copy the text, `Task 2`, the help given, the SEQ, the SUS or the place where each different sentence was got; these were read from the observation.
It also does not say whether an answer was reached with or without help, so the `Unaided`, `Assisted` and `Failed` outcomes rest on the observation alone.

## Limitations

- Four participants, which supports no claim about a population, so the SUS is reported with its count.
- All four study German, English or Russian and none is a team member; two had used a flashcard app before and two had not.
- The sessions ran in person on campus, on the staging deployment, on the facilitator's laptop.
- The facilitator was also the observer, and the weekly report declares it as a deviation.
- The recordings are incomplete: the third part of `P-01`, the middle of `P-02` and the start of `P-03` are missing, so times on task are approximate and the time to find and copy the text could be read for two sessions only.
- The limit for `Task 2` was 10 minutes in the sessions and 5 minutes in the first version of the record, which the record now matches.
- In `P-02`, the library did not hold enough cards for `Task 3`, so the facilitator added words to it.
- In `P-03`, the first two SEQ answers used the scale the wrong way round and were corrected after the scale was explained again.
- The route used to reach the cards of the group after the practice was started from the study page is not recorded for each participant; three of the four used the decks page and one used the study page.
- The facilitator did not read every scenario word for word and gave extra explanations, which the weekly report declares as a deviation.
- The wording of the tasks was left unchanged after two participants asked for a clarification of the wording.

## Conclusion

**Research question 1:** a participant who finds their own text reached the first answered card in four of four sessions, and without a hint in one of four.
**Research question 2:** the steps that made participants ask for help were the making of the cards after the deck is made ([Finding 1](#finding-1)) and finding the next step after the cards are made ([Finding 3](#finding-3)).
**Research question 3:** a participant practised only one group in two ways without help in one of four sessions, and got a different sentence in two places without help in two of four.

The [testing plan](../../project-plan.md#quality-requirement-testing-plan) records [`QR-08 QRT-01`](../../quality-requirements/qr/QR-08.md#qrt-01) as `Passes`: the median `Task 1` SEQ is 5, against the bar of at least five of seven in at least three counted sessions.
That rests on a median of five from four sessions, three of which needed a hint in `Task 1`, so the margin is thin.
The requirement reads only the SEQ, and the "without help" part of its response was met in one of four sessions.

The team commits to these changes:

- Make the cards in a way that the participant does not have to ask for sentences first, carried by [Finding 1](#finding-1) and [#321](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/321), scheduled in `SPRINT-08`.
- Show the participant where to go after the cards are made, carried by [Finding 3](#finding-3) and [#322](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/322), scheduled in `SPRINT-08`.
- Tell the participant why a sentence cannot be written, carried by [Finding 4](#finding-4) and [#323](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/323), scheduled in `SPRINT-08`.

The team opens no task issue for [Finding 2](#finding-2), [Finding 5](#finding-5) and [Finding 6](#finding-6), for the reasons in the triage above.
