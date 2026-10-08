# Value proposition

Built on the gaps in [gap-analysis.md](gap-analysis.md) and adjusted after the kickoff with the Customer ([meeting transcript](../../reports/week-01/meeting-transcript.md)).
Before the kickoff, our main direction was picking words in your own text (GAP-03).
The Customer put a sentence editor first, so VP-01 is now built around the editor, with picking words as its first step.

## VP-01: An editor to check generated sentences before you study them

**User:** a learner of Russian, English or German who studies from texts they chose, and the teacher who helps them.

**Problem:** sentences written by a language model can be unnatural or wrong, and today fixing them means editing a CSV file (ALT-01) or prompting, copying and pasting again (ALT-04); ALT-02 does not generate example sentences, and we did not see ALT-03 generate one for each of the learner's own words.

**What we do that the alternatives do not:** the learner pastes a text and marks the words they do not know; the product shows each word with a generated sentence and translation in a table, where any row can be edited, flagged, or regenerated with one click before it becomes a card.

**Closes:** [GAP-01](gap-analysis.md#gap-01-reviewing-and-fixing-generated-sentences) and [GAP-03](gap-analysis.md#gap-03-picking-words-in-your-own-text-and-getting-a-new-sentence-for-each).

**What it costs:**

- The product depends on a language model: either every generation costs money, or a free model writes weaker sentences and the learner regenerates more often.
  The Customer said that a decent free model is fine and mentioned that an API key for a cheap model might be provided (Customer, [00:17:50]), so we plan to start with a free model.
- Reviewing adds a step between generating and studying.
  If it is optional, a wrong sentence can still reach the learner's cards; if it is required, the learner does more work for every word.
  We will decide which in Week 2.
- Input is limited to texts the learner pastes or uploads; we do not import from video, streaming or e-books as ALT-02 does.

**How a competitor would respond:** ALT-02 (LingQ) already lets learners pick words in their own texts and could add a "generate a new example sentence" button to its word panel within weeks, with its existing users and content.
This is our biggest risk.
What it would not copy easily is being open source, which the Customer wants "so that others can contribute code or use it in their own language setting" (Customer, [00:00:00]).

## VP-02: The learner decides which words come first, without losing progress

**User:** a learner who wants to study some words earlier than others, for example the words of the text they are reading this week.

**Problem:** in ALT-01, new songs can only be appended at the end, because reordering them renumbers the words and mixes up the learner's progress; in ALT-03 the system decides the order by difficulty; in ALT-04 the learner can reposition new cards, but only by finding and selecting them by hand in Anki's card browser.

**What we do that the alternatives do not:** the learner moves a word, or all the words of one text, up or down the study queue, and the review history of the words already studied stays as it was.

**Closes:** [GAP-02](gap-analysis.md#gap-02-choosing-which-words-come-first-without-losing-progress).

**What it costs:**

- Because review happens inside our app (Customer, [00:21:50]), we have to build our own spaced-repetition scheduling instead of reusing Anki's mature one.
- A learner who already has an Anki deck starts over in our app, because importing from Anki is not required for now.

**How a competitor would respond:** Anki already has a "Reposition" command, and an add-on could make it work per text in a short time, so this is not a strong moat on its own.
Its value is that it works together with VP-01 in the same product: the words the learner picked and checked are the words they can put first.
