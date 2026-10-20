# Changelog

All notable changes to this product are recorded here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- On the Study page, the cards that are due are listed in the order the session shows them, and the learner drags a card, or the cards ticked together, to any place in the list, or moves it with the up and down arrows, and the new order is saved.
- The study session orders the cards by the time they are due, not only by the day, so cards due the same day can be put before each other.

- When the language model does not answer for a word, the product asks again by itself, up to 5 requests in all with a longer wait each time, and a word it still gets no sentence for is left as a card without a sentence.
- One message tells that some sentences could not be generated, instead of one message for each word.
- The actions of a card in the cards table are small icons, a legend in the top right corner of the box says what they do and stays in view while the table scrolls, and "Flag" is now called "Mark for review".

## [0.1.0](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.1.0) - 2026-10-18

### Added

- Paste a text, choose its language and your own, mark the words you do not know, and the product makes a card for each word with a sentence that uses it and the sentence's translation.
- A table of the cards of a text, where the learner edits a sentence (the translation is made again), asks for a new sentence for one word, flags a card, or deletes it.
- A page with all the cards, the newest text first.
- A study session: the product shows the cards that are due, the learner answers "remembered" or "forgotten", and a card they remembered comes back later, after a longer wait each time, up to a year.
- A message when the language model does not answer, with the card kept so the learner can ask again.
