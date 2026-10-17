# Week 3 meeting script

## Context

Our problem-space sentence: language learners (and their teachers) who study Russian, English or German from real texts want to turn the words they choose into flashcards with example sentences, translations and pronunciation, and review them with spaced repetition, without building each card by hand.

The Customer accepted the minimum usable product candidate in Week 2: [`US-01`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/27), [`US-02`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/28) and [`US-03`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/29), which together take a learner from a pasted text to studying the cards ([`DEC-006`](../../docs/decisions.md#dec-006)).
This week we built all three and merged them into `main`, and we run the product from `main` in the meeting.
We believe the three stories do what their acceptance criteria say; we do not know whether that is what the Customer needs.

Two limits we will tell him about, because they show in a demo: the product asks the language model for one word at a time, so a text with many marked words takes a while, and the free model sometimes does not answer, in which case the card has no sentence and the learner asks for one again.

This meeting has to settle whether the Customer accepts `US-01`, `US-02` and `US-03` against their acceptance criteria, and which story we build next.

Questions marked ★ are the ones that would change the project most; we ask them even if time runs short.

## Agenda

1. Permissions (2 min). Nothing shown. Questions 1 to 3.
2. Week 2 action points (6 min). We report the outcome of each action point of the [Week 2 meeting report](../week-02/meeting-report.md#action-points): the updated [context diagram](../../docs/architecture/context.svg), which now shows the audio source as an external system that is not chosen yet, and the queue example, which we show in part 7. We say plainly that we did not carry out two of them before this meeting: the options for where the audio can come from, and the second "Reposition" measurement. Both come back as action points. Question 4.
3. `US-01`: a sentence and a translation for each marked word (7 min). We run the product and show `AC-01`, `AC-02` and `AC-03` one at a time. For `AC-03` we run the test that makes the model fail for one word, because we cannot make the real model fail on demand. Questions 5 to 7.
4. `US-02`: check the sentence written for a word (7 min). We show `AC-01` to `AC-06` one at a time on the table of cards, including the cards that exist as soon as the words are marked (`AC-05`, [`DEC-005`](../../docs/decisions.md#dec-005)). Questions 8 and 9.
5. `US-03`: study the cards inside the product (6 min). We show `AC-01` to `AC-04` one at a time with three cards, two of them due. Questions 10 and 11.
6. The slice as a whole and the candidate (3 min). Nothing new is shown. All three stories are built, so no story leaves the candidate unless the Customer says so. Question 12.
7. The next stories (11 min). We show the [study queue example](evidence/study-queue-example.md) for [`US-04`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/30), and the list of [stories with the user-story label](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues?q=label%3Auser-story). Questions 13 to 16.
8. Read-back (3 min). Nothing shown. We read back the decisions and action points.

## Questions

**Permissions:**

1. _(closed)_ May we record this meeting, with the call's automatic recording and a backup recording on one team member's computer?
2. _(closed)_ May we publish a sanitized transcript of it in our repository?
3. _(closed)_ If not, may we share the recording and the transcript privately with the instructors?

**Week 2 action points:**

4. ★ _(closed)_ The audio has to come from an outside source, and you want the product self-hosted "so that no data is sent anywhere". May the audio come from an online service, as the sentences already do from the language model, or must each of them run on the learner's own machine?

**`US-01`:**

5. _(open)_ What did you expect to happen when the words were marked and the sentences came back, that did not?
6. _(closed)_ Does `US-01` do what you need, as shown against its three criteria: accepted or rejected?
7. _(closed)_ When the free model does not answer, the word keeps no sentence and the learner asks for another one on the card. Is that enough for a first version?

**`US-02`:**

8. _(open)_ What did you expect to be able to do with a sentence in this table, that you could not?
9. _(closed)_ Does `US-02` do what you need, as shown against its six criteria: accepted or rejected?

**`US-03`:**

10. _(open)_ What did you expect to happen during the study session, that did not?
11. _(closed)_ Does `US-03` do what you need, as shown against its four criteria: accepted or rejected?

**The slice and the candidate:**

12. ★ _(closed)_ With these three stories, can a learner go from a pasted text to studying the cards without getting stuck? If not, where do they get stuck?

**The next stories:**

13. ★ _(open)_ Which of these would you miss first if it were not built next: moving a text to the front of the study queue (`US-04`), audio for each card (`US-07`), or letting a teacher correct a student's sentence ([`US-05`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/31))?
14. ★ _(closed)_ In this example, when the learner moves text C to the front, should the studied card C3 also jump ahead of the overdue cards of other texts, or should only the new cards move?
15. _(open)_ Anki's "Reposition" took us about 55 seconds once, with the cards made in the same run, and we have not repeated the measurement. What would our version have to do for you to use it instead?
16. _(closed)_ When a teacher reviews a card, should they edit the context around the word, or only add a comment or hint for the language model?

## Roles

nataliamotand moderates and runs the product, AbdelrahmanAbdel-Aal takes notes, and emapfff observes, recording what we did not ask and what the Customer did not say.

## Key improvements

### "Do you accept `US-01`?" -> "What did you expect to happen when the words were marked and the sentences came back, that did not?"

The original asks for approval of something the Customer has just watched us run, so the easy answer is yes and nothing changes.
The rewrite asks for the gap between what he expected and what he saw, which is where a rejected criterion or a new story would come from; the accept or reject question follows it (question 6), once the gap has been said.

### "Is that a cost you would accept?" -> "In this example, when the learner moves text C to the front, should the studied card C3 also jump ahead of the overdue cards of other texts, or should only the new cards move?"

In Week 2 the Customer could not judge the 55 seconds without seeing the interface, and the original question (about that time, asked in Week 2) asked him to accept a number he could not picture.
The rewrite puts the queue on the screen and asks about the one place where the two readings of `US-04` differ, so the answer settles an acceptance criterion; the time is asked afterwards (question 15), when he can compare it with something he has seen.
