# Week 4 meeting script

## Context

Our problem-space sentence: language learners (and their teachers) who study Russian, English or German from real texts want to turn the words they choose into flashcards with example sentences, translations and pronunciation, and review them with spaced repetition, without building each card by hand.

The Customer accepted [`US-02`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/28) and [`US-03`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/29) in Week 3 and did not accept [`US-01`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/27), because `AC-03` failed ([`DEC-011`](../../docs/decisions.md#dec-011), [`DEC-012`](../../docs/decisions.md#dec-012)).
This week we rewrote `AC-03`, built [`US-04`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/30) (the study queue ordered by due time), and made the changes he asked for in Week 3 to the cards table, the card identity, the translation and the review screen.
We run the product from `main` in the meeting.
We believe `US-01` and `US-04` do what their acceptance criteria say; we do not know whether that is what the Customer needs.

We also wrote the quality requirements, the functional requirements and the architecture decisions for the product, and we ask whether they answer what he needs: the [quality requirements](../../docs/quality-requirements/README.md), the [architecture](../../docs/architecture/README.md) and its [decision records](../../docs/architecture/adr/ADR-001.md).

Of what the Customer asked for in the Week 3 meeting, these changes are built and in `main`: a card identified by its word and a context phrase ([`DEC-013`](../../docs/decisions.md#dec-013)), the translation that follows the sentence and can be locked ([`DEC-014`](../../docs/decisions.md#dec-014)), several cards selected to regenerate or delete in one action and a card that can be hidden ([`DEC-016`](../../docs/decisions.md#dec-016)), icons with a legend and a larger editor ([`DEC-017`](../../docs/decisions.md#dec-017)), four answer buttons ([`DEC-018`](../../docs/decisions.md#dec-018), without the audio), the study queue ordered by due time ([`DEC-021`](../../docs/decisions.md#dec-021)), several words as one card ([`DEC-022`](../../docs/decisions.md#dec-022)), and the repeated request when the model does not answer ([`DEC-024`](../../docs/decisions.md#dec-024)).
These are not built yet and stay on our radar: the cards that the product marks for review by itself and the teacher's view with them first ([`DEC-015`](../../docs/decisions.md#dec-015)), audio on both sides of the card ([`DEC-018`](../../docs/decisions.md#dec-018) and [`DEC-010`](../../docs/decisions.md#dec-010)), the daily limits and the cards asked for ahead of schedule ([`DEC-019`](../../docs/decisions.md#dec-019)), and decks apart from the texts ([`DEC-020`](../../docs/decisions.md#dec-020)).

One limit we will tell him about, because it shows in a demo: whether two cards have "the same meaning" is judged by the language model, and the model was wrong on some of our test texts until we changed the question we ask it (the check is described in [PR #127](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/127)).

This meeting has to settle whether the quality requirements and the architecture answer the Customer's needs, whether he accepts `US-01` and `US-04` against their acceptance criteria, and which story we build next.

Questions marked ★ are the ones that would change the project most; we ask them even if time runs short.

## Agenda

1. Permissions (2 min). Nothing shown. Questions 1 to 3.
2. Week 3 action points (4 min). We report the outcome of each action point of the [Week 3 meeting report](../week-03/meeting-report.md#action-points) and say plainly which ones we did not carry out. The colour is done, as [`DEC-027`](../../docs/decisions.md#dec-027) records. No questions.
3. `US-01`: a sentence and a translation for each marked word (6 min). We run the product and show each `AC-nn` of the story one at a time, including the repeated request and the single message when the model does not answer. Question 4.
4. `US-04`: study the words of one text first (8 min). We run the study queue and show each `AC-nn` of the story one at a time, and we move the cards of a text to the front. Questions 5 and 6.
5. What changed since Week 3 (7 min). We read the two lists of the Week 3 changes in `## Context`, built and not built yet, and make one pass through the product, without repeating what we showed in parts 3 and 4: the card identified by its word and context phrase, the window that edits it, and the singular and plural forms of a word. These changes belong to stories he already accepted, so no verdict is asked. Questions 7 to 9.
6. Quality requirements and architecture (9 min). We show the [quality requirements matrix](../../docs/quality-requirements/README.md), then the container view in the [architecture document](../../docs/architecture/README.md) and [`ADR-001`](../../docs/architecture/adr/ADR-001.md). Questions 10 to 12.
7. The next stories (5 min). We show the [audio options](../../docs/research/audio-options.md) that the Week 3 action point asked for, and the stories still open: audio ([`US-07`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/33)), the teacher's review ([`US-05`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/31)), and the daily limits ([issue #103](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/103)) and decks ([issue #97](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/97)) that [`DEC-019`](../../docs/decisions.md#dec-019) and [`DEC-020`](../../docs/decisions.md#dec-020) asked for. Questions 13 to 15.
8. Read-back (3 min). Nothing shown. We read back the decisions and action points.

## Questions

**Permissions:**

1. _(closed)_ May we record this meeting, with the call's automatic recording and a backup recording on one team member's computer?
2. _(closed)_ May we publish a sanitized transcript of it in our repository?
3. _(closed)_ If not, may we share the recording and the transcript privately with the instructors?

**`US-01`:**

4. ★ _(closed)_ Does `US-01` do what you need, as shown against its criteria: accepted or rejected?

**`US-04`:**

5. ★ _(closed)_ Does `US-04` do what you need, as shown against its criteria: accepted or rejected?
6. _(open)_ You have now seen the move run in our product. Would you still use Anki's "Reposition" instead? If so, why, and which feature did you miss in our product?

**What changed since Week 3:**

7. ★ _(closed)_ As you decided, a card is identified by its word and a short phrase, and the language model judges whether two phrases have the same meaning. When we tested it, we found a few cases it misjudged and changed how we ask the model; our last run passed all 45 requests. Do you confirm this is acceptable?
8. _(closed)_ The singular and the plural of a word are two forms of one word. Should the product make one card for them, or a card for each?
9. _(closed)_ Of what you asked for in Week 3, we built the card identity, the locked translation, selecting and hiding cards, the icons and the larger editor, four answer buttons without audio, the study queue, several words as one card and the repeated request. We have not built yet the review view for teachers, audio, daily limits and decks, which stay on our radar. Is anything you asked for missing from these two lists?

**Quality requirements and architecture:**

10. ★ _(open)_ Looking at these quality requirements, which quality would you miss first if it got worse, and which one is missing?
11. _(closed)_ The product runs as a frontend, a backend and a database that you install on a local machine or a VPS. Does that answer your wish to self-host it?
12. _(closed)_ The text the learner marks is sent to the language model the learner configures. May that be an online service by default, as you said the audio may be, or must the model also run on the learner's machine?

**The next stories:**

13. ★ _(open)_ Which of these would you miss first if it were not built next: audio for each card, the teacher's review of a student's cards, the daily limits, or decks?
14. _(closed)_ Of the three audio sources we found, which would you choose, given that one has a non-commercial model licence and one sends the words and sentences to an online service?
15. _(open)_ When a teacher reviews a card, should they edit the context around the word, or only add a comment or hint for the language model?

## Roles

nataliamotand moderates and runs the product, AbdelrahmanAbdel-Aal takes notes, and emapfff observes, recording what we did not ask and what the Customer did not say.

## Key improvements

### "Do you accept the quality requirements?" -> "Looking at these quality requirements, which quality would you miss first if it got worse, and which one is missing?"

The original asks for approval of a list the Customer has seen for a minute, so the easy answer is yes and nothing changes.
The rewrite asks him to rank the qualities and to name one we left out, which is where a new quality requirement or a change of priority would come from.

### "Is it acceptable that the model judges the same meaning?" -> "As you decided, a card is identified by its word and a short phrase, and the language model judges whether two phrases have the same meaning. When we tested it, we found a few cases it misjudged and changed how we ask the model; our last run passed all 45 requests. Do you confirm this is acceptable?"

The original can be answered with a yes that commits us to nothing.
The rewrite reaffirms what he decided, says what we found in our tests, and asks only about the part that is still open, who judges that two phrases have the same meaning.
