# Week 7 Sprint Review script

## Context

The product helps a learner who reads a text in a language they study to remember its words: the learner marks words, and the product makes cards for them.
The team believes that the stories of this sprint do what their acceptance criteria say, and that the design of the usability test `UT-01` lets a person outside the team run the sessions without asking the team a question.
The meeting has to settle whether the stories shown are accepted, whether the `UT-01` design, its participant profile, its recruitment target and its session plan are right, and what the results must show.

## Agenda

1. **Permission questions (1 minute).**
   - **Show:** nothing.
   - The moderator asks whether the team may record, whether it may publish a sanitized transcript in the repository, and whether it may share the transcript privately with the instructors if publication is refused.
2. **Study: the production instance and the stories [US-17](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/234) and [US-18](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/235) (9 minutes).**
   - **Show:** the deployed production instance on the university virtual machine, opened from the university network; each story is run against its acceptance criteria, one at a time.
   - **Questions:** 1 and 2.
3. **Texts: the story [US-15](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/232) (8 minutes).**
   - **Show:** the production instance; the story is run against its acceptance criteria, one at a time.
   - **Questions:** 3.
4. **Decks: the stories [US-20](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/253) and [US-16](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/233) (8 minutes).**
   - **Show:** the production instance; each story is run against its acceptance criteria, one at a time.
   - **Questions:** 4.
5. **The `UT-01` design on the staging deployment (7 minutes).**
   - **Show:** [the record](../../docs/usability-tests/ut-01/README.md), one line for each of these:
     - the participant profile, the recruitment target of three with five as the design target, and the three tasks;
     - the private usability data repository and the recordings folder;
     - [`QR-08`](../../docs/quality-requirements/qr/QR-08.md) and its test `QRT-01`;
     - the research questions, [the surveys](../../docs/usability-tests/ut-01/surveys.md), [the consent](../../docs/usability-tests/ut-01/consent.md), the instrumentation and its verification with the staging deployment's reset seed and test events ([issue #278](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/278)), and [the session plan](../../docs/usability-tests/ut-01/sessions/README.md): the moderator names them, they are linked in the record, and the Customer may open any of them.
   - **Questions:** 5, 6, 7 and 8.
6. **The Week 6 action points, the open question and the Week 8 plan (5 minutes).**
   - **Show:** nothing; the moderator gives the status of each action point of the [Week 6 report](../week-06/meeting-report.md#action-points).
   - The question to the language model: tried and not adopted; the Customer accepted keeping the question of today ("Thanks! Let's keep today's question then", Customer, group chat, 2026-11-14 18:02), and the work is in [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165) and the test setup in [pull request #288](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/288).
   - The scenarios for the time zones: not carried out; the team proposes Week 8, tracked in [issue #183](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/183).
   - The new layout of the study page: carried out, as [`DEC-056`](../../docs/decisions.md#dec-056) and [`DEC-063`](../../docs/decisions.md#dec-063) say, shown in part 2.
   - The statistics at the top of the page: carried out, in [`DEC-066`](../../docs/decisions.md#dec-066), [`DEC-068`](../../docs/decisions.md#dec-068), [`DEC-069`](../../docs/decisions.md#dec-069) and [pull request #263](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/263), shown in part 2.
   - The Week 8 plan: the team arranges the sessions by chat with the Customer, and the results are due on 2026-11-21.
   - **Questions:** 9 and 10.
7. **Read-back (2 minutes).**
   - **Show:** nothing.
   - The moderator reads back the decisions and the action points.

## Questions

1. _(open)_ What did you expect to happen here that did not?
2. _(closed)_ Do you accept `US-17` and `US-18`, each against its acceptance criteria?
3. _(closed)_ Do you accept `US-15` against its acceptance criteria?
4. _(closed)_ Do you accept `US-20` and `US-16`, each against its acceptance criteria?
5. _(closed)_ Are these three tasks, and learners of Russian, English or German who are 18 or older and outside the team as participants, with three sessions as the target and five as the design target, the right test for you?
6. _(closed)_ Can you open the private usability data repository and the recordings folder?
7. _(open)_ What must the results of `UT-01` show for you to act on them?
8. _(closed)_ Is a median SEQ of at least 5 of 7 on the main task, over at least three sessions, the right bar for `QR-08`?
9. _(open)_ A learner marks a card at 23:30 and the same learner uses the product at 00:30 in another time zone; when should the card come back?
10. _(closed)_ Do you agree that the team arranges the sessions in `SPRINT-08` and brings the results to the Week 8 meeting?

## Roles

- **Moderator and screen sharing:** nataliamotand.
- **Note taker:** AbdelrahmanAbdel-Aal.
- **Observer:** emapfff.

## Key improvements

- **Before:** "Do you like the new Study page?" It is closed and vague, and any answer, such as "yes", changes nothing.
- **After:** "What did you expect to happen here that did not?" (question 1).
- **Principle:** ask for a specific expectation that failed and not for approval; a named surprise changes what the team builds next, and an approval changes nothing.
