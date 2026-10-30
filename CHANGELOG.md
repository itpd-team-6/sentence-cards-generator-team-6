# Changelog

All notable changes to this product are recorded here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed

- A card deleted while a study session is open no longer blocks the session: it is skipped with a message and the session goes on with the next card ([DEC-032](docs/decisions.md#dec-032)).

## [0.2.0](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.2.0) - 2026-10-25

### Changed

- A card is identified by its word and a context phrase of three or four words that uses the word with the meaning it has in the text ([DEC-013](docs/decisions.md#dec-013)). When the learner marks a word that already has a card with the same meaning, the product makes no second card and says which word it is and the phrase of the card that exists; the same word with another meaning gets its own card. A new sentence keeps the phrase and the meaning of the word. The cards made before have no phrase and keep working.
- The Edit button of a card opens a window with the phrase, the sentence and the translation, where the learner and the teacher can change the phrase; a phrase that another card of the word already has is refused with the reason, and the window stays open. The sentence and the translation are no longer edited inside the row.
- While the language model is asked for sentences, the "Ask for sentences" button shows a turning ring and stays readable, and when the model has answered a message tells how many cards were made, so the learner can see that the product is working and when it is done.
- The study session has four answer buttons, "Again", "Hard", "Good" and "Easy", like in Anki, and each button says when the card comes back; the rule of the waits is [DEC-029](docs/decisions.md#dec-029), and the first "Good" of a new card is 2 days, where it was 1. The word of the card is shown as the text writes it, and not in capital letters.
- The learner can edit the translation of a card, in the same Edit as the sentence, and lock it with the lock beside it. A locked translation does not change when the learner edits the sentence or asks for a new sentence, and the new sentence is written to mean the same; a translation that is not locked is made again, as before.
- The colour of the interface is blue instead of ruby, as the Customer chose, with contrast that meets WCAG 2.2; a message about a problem stays red, so that the blue is not read as an error.
- The learner holds Shift and clicks several words of the text to make them one card, such as "stimmt zu" of "Putin stimmt Wiederaufnahme von Gesprächen zu", with other words between them if the text has them. The chosen words are one block, a bubble over them shows the word of the card, Shift and a click on a chosen word takes it out, and the language model is asked for one sentence that has all the words. A card keeps its word as the text writes it, so a noun such as "Zug" keeps its capital, and not in lowercase.
- On the Study page, all the cards are listed in the order they are studied, the ones due today first and the ones due later after them with their dates, and the learner drags a card, or the cards ticked together, to any place in the list, also from one part to the other, or moves it with the up and down arrows, and the new order is saved.
- The study session orders the cards by the time they are due, not only by the day, so cards due the same day can be put before each other.
- When the language model does not answer for a word, the product asks again by itself, up to 5 requests in all with a longer wait each time, and a word it still gets no sentence for is left as a card without a sentence.
- One message tells that some sentences could not be generated, instead of one message for each word.
- The actions of a card in the cards table are small icons, a legend in the top right corner of the box says what they do and stays in view while the table scrolls, and "Flag" is now called "Mark for review".
- In the cards table, a box in the header of the first column selects all the cards or none, and a bar under the table, in view while cards are ticked and not there otherwise, lets the learner ask for a new sentence for the ticked cards, hides them from study, shows them again, or deletes them after confirming, all in one action. A card that is hidden stays in its place in the table but is out of study until it is shown again.
- Every message of the product (a problem, something that worked, a neutral note) looks the same: a small box in the bottom right corner of the window that does not move the page, ruby for a problem, green for a success, with a line that shrinks to show the 5 seconds it stays, a button to close it and a pause while the mouse is over it. A message about the language model now says the reason the model gave. Deleting cards asks for confirmation in a window, and the cards being worked on show "Working on N cards" with dots that move and a turning arrow.

## [0.1.0](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.1.0) - 2026-10-18

### Added

- Paste a text, choose its language and your own, mark the words you do not know, and the product makes a card for each word with a sentence that uses it and the sentence's translation.
- A table of the cards of a text, where the learner edits a sentence (the translation is made again), asks for a new sentence for one word, flags a card, or deletes it.
- A page with all the cards, the newest text first.
- A study session: the product shows the cards that are due, the learner answers "remembered" or "forgotten", and a card they remembered comes back later, after a longer wait each time, up to a year.
- A message when the language model does not answer, with the card kept so the learner can ask again.
