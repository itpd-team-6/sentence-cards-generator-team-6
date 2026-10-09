# Gap analysis

Gaps found by comparing the four alternatives in [alternatives.md](alternatives.md) and [comparison.md](comparison.md), and tested against the kickoff with the Customer ([meeting transcript](../../reports/week-01/meeting-transcript.md)).
They are sorted by how strong the evidence is.

## GAP-01

Reviewing and fixing generated sentences

- **Status:** Active
- **Who needs it and what they cannot do:** a language learner, or their teacher, who gets example sentences written by a language model.
  The Customer warned that "some of them may sound unnatural, be totally wrong, or state wrong facts" (Customer, [00:05:38]), and today there is no simple way to see them all, mark the bad ones and get a new one.
- **Evidence:** the `Sentence and translation quality` and `Card creation effort` rows.
  - ALT-01 (songs2anki) checks sentences automatically against length, rare-word and presence rules ([README, "Constraints"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#constraints)), but not whether they sound natural or are correct; fixing a bad sentence means searching and deleting lines in a CSV in VS Code, and the Customer asked for buttons to flag, remove or regenerate sentences instead (Customer, [00:16:13]).
  - ALT-02 (LingQ) does not generate sentences at all; the card shows the sentence from the imported text.
  - ALT-03 (Quizlet) generates term–definition pairs; we did not see sentence generation or regeneration of a single card.
  - ALT-04 (Anki + ChatGPT) leaves the whole loop to the learner: ask again, copy, paste.
- **What closing it looks like:** a table of the learner's words with their generated sentence and translation, where each row can be edited, flagged, or sent back for regeneration with one click.
- **Buildable by us in this course:** yes.
  It is a web table, an edit form and a call to a language model, and when asked what the product should do really well if it could do only one thing, the Customer answered that "the editor seems to be the most important part" (Customer, [00:18:58]).
- **Confidence:** high.
  No alternative does it, and the Customer described the need from his own use of ALT-01, not as an idea.

## GAP-02

Choosing which words come first without losing progress

- **Status:** Active
- **Who needs it and what they cannot do:** a learner who wants to "use some text to learn some words earlier in the deck than others" (Customer, [00:00:00]).
  The course catalog names this as the example of the problem: it is too tedious to update an Anki collection, "e.g. re-prioritize cards to learn particular words first".
- **Evidence:** the `Spaced repetition and prioritization` row.
  - ALT-01 fixes the order by where a word first appears in the lyrics, and the deck is "append-only because swapping sources will affect indices", so reordering sources means "the progress will be incorrect" ([songs2anki README, "Deck"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#deck)).
  - ALT-02 lets the learner set a status per word (1–4, known, ignored), but not an order.
  - ALT-03 (Quizlet) prioritizes cards in its Learn mode by how difficult they are for the learner, so the system decides the order, not the learner.
  - ALT-04 (Anki) can reposition new cards by selecting them in its card browser ([Anki FAQ](https://faqs.ankiweb.net/study-in-a-particular-order.html)), so the need is partly served for learners who know how to do it; cards already studied cannot be reordered.
- **What closing it looks like:** the learner moves words or whole texts up or down in the study queue, and the review history of words already studied stays as it was.
- **Buildable by us in this course:** yes.
  The Customer confirmed that "the review should happen inside your app" (Customer, [00:21:50]), so our product owns both the study order and the review history, instead of depending on Anki.
- **Confidence:** medium.
  Asked which of teacher review, re-prioritizing and three interface languages could wait, the Customer answered that "the most important feature would be re-prioritizing" (Customer, [00:20:54]), but ALT-04 offers a manual workaround that we have not timed or tested.

## GAP-03

Picking words in your own text and getting a new sentence for each

- **Status:** Active
- **Who needs it and what they cannot do:** a learner who studies from texts they chose, such as songs or articles, and wants a short, clear example sentence for each unknown word.
- **Evidence:** the `Card creation effort` and `Content source` rows.
  - ALT-02 lets the learner pick words in their own text, but the card only shows the original sentence, which may be long or confusing.
  - ALT-01 writes new sentences, but only a developer can run it, and marking the known words by hand is one of the two manual steps that, in the Customer's words, "take quite a long time" (Customer, [00:07:08]).
  - ALT-03 (Quizlet) generates cards from the learner's own notes or PDFs, but as term–definition pairs; we did not see a way to pick single words in the text and get a new sentence for each.
  - ALT-04 can do both, but every word is a manual prompt, copy and paste.
- **What closing it looks like:** the learner pastes a text, marks the words they do not know, and gets a card with a new sentence and translation for each one.
- **Buildable by us in this course:** yes.
  It is the input step that feeds GAP-01.
- **Confidence:** medium.
  It was our main direction before the kickoff; the Customer did not reject it, but put the editor (GAP-01) first.

## Gaps we chose not to pursue

| Candidate                                               | Why we dropped it                                                                                                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audio as a differentiator                               | Free tools already solve it: the Customer added audio to his deck with the HyperTTS add-on and Google TTS (Customer, [00:10:59]).                        |
| Working with Anki (import, export or sync) as a core feature | The Customer wants review inside our app; importing from Anki is a nice-to-have, not required (Customer, [00:21:50]), so we may add it later as an extra. |
| Importing from many platforms (video, streaming, e-books) | ALT-02 already does this across many platforms. We keep only what the course catalog asks for, texts uploaded by the user (GAP-03), and drop the platform integrations, which would not fit in one semester. |
| A full reader like LingQ                                | Too large for a team of three in this course, and reading is not the job the Customer described.                                                        |
| Classroom features for teachers (classes, games)        | ALT-03 already offers classes and shared sets. When asked what a teacher should do with a student's cards, the Customer described editing sentences and translations (Customer, [00:05:38]), which GAP-01 covers. How a teacher connects to a student is still open. |
