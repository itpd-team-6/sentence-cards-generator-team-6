# Week 2 meeting script

## Context

Our problem-space sentence: language learners (and their teachers) who study Russian, English or German from real texts want to turn the words they choose into flashcards with example sentences, translations and pronunciation, and review them with spaced repetition, without building each card by hand.

We believe the core is an editor (VP-01): the learner pastes a text, marks the words they do not know, and gets a table of word, generated sentence and translation where each row can be edited, flagged or regenerated.
At the kickoff, asked what the product should do really well if it could do only one thing, the Customer said "the editor seems to be the most important part" (Customer, [00:18:58]).
We do not know yet whether a learner should confirm every sentence before any card exists, or whether cards should exist at once and only the flagged ones be reviewed.

This meeting has to settle whether the editor prototype, the product boundary and the minimum usable product candidate are right, and in particular whether a learner must confirm every generated sentence before cards are created.

Questions marked ★ are the ones that would change the project most; we ask them even if time runs short.

## Agenda

1. Permissions (2 min). Nothing shown. Questions 1 to 3.
2. Kickoff follow-ups (6 min). We report the outcome of each Week 2 action point from the [Week 1 meeting report](../week-01/meeting-report.md#action-points): the sentence test found 4 of 60 sentences flagged by an AI judge, with the native check pending; the Anki "Reposition" timing is one measurement of about 55 seconds, with a second one pending; in the Anki and LingQ forums we found no thread of learners moving their reviews to another app, and the learners who dropped or cut down Anki on the LingQ forums did so because of the daily review load, so this is weak evidence. Questions 4 to 7.
3. Prototype (10 min). We show the clickable editor prototype through its [prototype record](prototypes.md). Questions 8 and 9; question 10 only if time allows.
4. Boundary (4 min). We show the [boundary section of the product vision](../../docs/product-vision.md#boundary). Question 11.
5. Minimum usable product candidate (6 min). We show the candidate's user stories, [`US-01`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/27), [`US-02`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/28) and [`US-03`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/29), and the [issues with the user-story label](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues?q=label%3Auser-story). Question 12.
6. Read-back (2 min). Nothing shown. We read back the decisions and action points.

## Questions

**Permissions:**

1. _(closed)_ May we record this meeting, with the call's automatic recording and a backup recording on one team member's computer?
2. _(closed)_ May we publish a sanitized transcript of it in our repository?
3. _(closed)_ If not, may we share the recording and the transcript privately with the instructors?

**Kickoff follow-ups:**

4. _(open)_ The catalog mentions a teacher who connects and reviews cards. What does that mean to you: a separate teacher view, or the teacher editing the learner's own cards?
5. _(closed)_ After the editor and re-prioritizing words, which comes first: teacher review or the three interface languages?
6. _(closed)_ Should the product run on a VPS or on the learner's own machine?
7. _(open)_ Moving the words of one text to the front of an Anki deck took us about 55 seconds once. Is that a cost you would accept, and what would you still miss?

**Prototype:**

8. ★ _(open)_ A learner has pasted a text and these six sentences came back, one of them unnatural. What would you do first, and at what moment would you want a card to exist for each word?
9. ★ _(closed)_ In this version no card exists until the learner confirms its sentence; in this one all cards exist at once and only the flagged ones wait for review. Which would you use for your own deck, and why?
10. _(open)_ If a learner moves all the words of one text to the front of the study queue, should words they already studied move too, and what should happen to their review history?

**Boundary:**

11. _(closed)_ Is anything on this list of things we will not build (audio for the words and sentences, importing from or syncing with Anki, fetching texts from video, streaming or e-books, and training or hosting our own language model) something you need before the end of the course?

**Minimum usable product candidate:**

12. ★ _(closed)_ If a learner could only turn the words they do not know in a pasted text into cards with sentences they have checked, and study those cards in the product, could they finish their job without getting stuck? Which story would you move into or out of the candidate?

## Roles

nataliamotand moderates and shows the prototype, and emapfff takes notes and observes, recording what we did not ask and what the Customer did not say.

## Key improvements

### "Do you prefer Mode 1 or Mode 2?" -> "A learner has pasted a text and these six sentences came back, one of them unnatural. What would you do first, and at what moment would you want a card to exist for each word?"

The original asks for a preference about two options the Customer has not yet seen in use, so the answer is an opinion about our description.
The rewrite puts the situation on the screen and asks what the Customer would do, which gives a fact about how he works, and only then asks for the choice (question 9), showing both versions with equal weight and recommending neither.

### "Is the boundary OK?" -> "Is anything on this list of things we will not build something you need before the end of the course?"

The original is a yes or no question that invites agreement and cannot change anything.
The rewrite asks the Customer to name what he would move, so an answer produces a decision or a disagreement.
