# Changelog

All notable changes to this product are recorded here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- On the Study page, all the cards are listed in the order they are studied, the ones due today first and the ones due later after them with their dates, and the learner drags a card, or the cards ticked together, to any place in the list, also from one part to the other, or moves it with the up and down arrows, and the new order is saved.
- The study session orders the cards by the time they are due, not only by the day, so cards due the same day can be put before each other.
- When the language model does not answer for a word, the product asks again by itself, up to 5 requests in all with a longer wait each time, and a word it still gets no sentence for is left as a card without a sentence.
- One message tells that some sentences could not be generated, instead of one message for each word.
- The actions of a card in the cards table are small icons, a legend in the top right corner of the box says what they do and stays in view while the table scrolls, and "Flag" is now called "Mark for review".
- In the cards table, a bar that is always in view selects all the cards or none, and the learner asks for a new sentence for the ticked cards, hides them from study, shows them again, or deletes them after confirming, all in one action. A card that is hidden stays in its place in the table but is out of study until it is shown again.
- Every message of the product (a problem, something that worked, a neutral note) looks the same: a small box in the bottom right corner of the window that does not move the page, ruby for a problem, green for a success, with a line that shrinks to show the 5 seconds it stays, a button to close it and a pause while the mouse is over it. A message about the language model now says the reason the model gave. Deleting cards asks for confirmation in a window, and the cards being worked on show "Working on N cards" with dots that move and a turning arrow.

## [0.1.0](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.1.0) - 2026-10-18

### Added

- Paste a text, choose its language and your own, mark the words you do not know, and the product makes a card for each word with a sentence that uses it and the sentence's translation.
- A table of the cards of a text, where the learner edits a sentence (the translation is made again), asks for a new sentence for one word, flags a card, or deletes it.
- A page with all the cards, the newest text first.
- A study session: the product shows the cards that are due, the learner answers "remembered" or "forgotten", and a card they remembered comes back later, after a longer wait each time, up to a year.
- A message when the language model does not answer, with the card kept so the learner can ask again.
