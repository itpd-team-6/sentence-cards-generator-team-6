# Week 9 Sprint Review script

## Context

The product helps a learner who reads a text in a language they study to remember its words: the learner marks words, and the product makes cards for them.
The team believes that three journeys of the product work on the production build.
The meeting has to settle whether the Customer's own run of `UAT-01`, `UAT-02` and `UAT-03` passes and what the Customer expects to receive at the handoff.

## Agenda

1. **Permission questions (2 minutes).**
   - **Show:** nothing.
   - The moderator asks whether the team may record, whether it may publish a sanitized transcript in the repository, and whether it may share the transcript privately with the instructors if publication is refused.
2. **The first acceptance test, `UAT-01` (8 minutes).**
   - **Show:** the production build, run by the Customer; the steps are read one at a time from [`UAT-01`](../../docs/user-acceptance-tests.md#uat-01).
   - **Questions:** 1.
3. **The second acceptance test, `UAT-02` (8 minutes).**
   - **Show:** the production build, run by the Customer; the steps are read one at a time from [`UAT-02`](../../docs/user-acceptance-tests.md#uat-02).
   - **Questions:** 2.
4. **The third acceptance test, `UAT-03` (8 minutes).**
   - **Show:** the production build, run by the Customer; the steps are read one at a time from [`UAT-03`](../../docs/user-acceptance-tests.md#uat-03).
   - **Questions:** 3 and 4.
5. **What the Customer expects at the handoff (10 minutes).**
   - **Show:** nothing.
   - **Questions:** 5 and 6.
6. **Read-back (4 minutes).**
   - **Show:** nothing.
   - The moderator reads back the decisions and the action points.

## Questions

1. _(closed)_ Do you accept `UAT-01` as passed, as failed, or can you not tell?
2. _(closed)_ Do you accept `UAT-02` as passed, as failed, or can you not tell?
3. _(closed)_ Do you accept `UAT-03` as passed, as failed, or can you not tell?
4. _(open)_ For a test that did not pass, how serious is the problem for you, and should it block the test?
5. _(open)_ What do you expect to receive at the handoff, and where should each thing be: in the repository, on the server or in a document?
6. _(open)_ What is missing from what we have today for you to take the product over?

## Roles

- **Moderator and screen sharing:** nataliamotand.
- **Note taker:** AbdelrahmanAbdel-Aal, with the Customer's answers word for word and the time, and with these two lists:
  - The open goals, each with its measure and the week it lands in, as written in the [threshold of success](../../docs/threshold-of-success.md):
    - [`TOS-01`](../../docs/threshold-of-success.md#tos-01): the Customer's recorded acceptance of `US-01`, `US-02` and `US-03`, each as a `DEC-nnn`, by the end of Week 9.
    - [`TOS-02`](../../docs/threshold-of-success.md#tos-02): one person outside the team who gets the product running by following only `setup.md`, written in the repository, in Week 9.
    - [`TOS-04`](../../docs/threshold-of-success.md#tos-04): the demonstration of `US-01`, `US-02` and `US-03` on the working application at the final project defense, in Week 11.
  - The recorded results of the [quality requirement testing plan](../../docs/project-plan.md#quality-requirement-testing-plan): `QR-01`, `QR-02`, `QR-03`, `QR-07` and `QR-08` pass, `QR-06` is dropped, and no test fails or is not verified.
- **Observer:** emapfff.

## Key improvements

- **Before:** "Do you accept the acceptance tests?" It is one closed question for three journeys, and a "yes" or a "no" does not say which journey failed or whether the failure matters.
- **After:** one question for each test, "Do you accept `UAT-01` as passed, as failed, or can you not tell?" (questions 1, 2 and 3), and for a test that did not pass, "how serious is the problem for you, and should it block the test?" (question 4).
- **Principle:** ask for a verdict on each unit that can be recorded alone, and ask for the weight of a failure, because the first gives one decision for each test and the second sets what the team fixes first.
- **Before:** "Do you want documentation at the handoff?" It is closed and it suggests the answer.
- **After:** "What do you expect to receive at the handoff, and where should each thing be: in the repository, on the server or in a document?" (question 5).
- **Principle:** let the customer name the things before offering the places, so that the list of what the team prepares is the customer's, not the team's.
