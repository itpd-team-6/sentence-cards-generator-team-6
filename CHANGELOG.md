# Changelog

All notable changes to this product are recorded here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- A study card tells new, forgotten and review cards apart, and the Study page counts each kind.
- The Study box shows a ring with the cards to study, a greeting, and about how many minutes the session takes, counting 30 seconds for each card ([DEC-066](docs/decisions.md#dec-066)).
- Each deck on the Study page shows how much of it is learned, and the list of decks gives it as `learned_percent`.

### Removed

- The option to shuffle one study session.

### Changed

- The product opens on the Study page, and each page has its own address, so reloading or going back keeps the page.
- The text, its languages and the marked words of the Add a text page are kept when the page is reloaded, until the tab is closed or another library is opened.
- The Study page has one box with the cards to study today split in new, forgotten and review, the button that starts a session beside them, and the decks to tick below, then the Reorder box over the whole width, with the whole sentence of each card.
- The header is one bar with the name, the pages and the library, and on a phone the pages are in a bar at the bottom of the screen.
- The cards of the Add a text page are loaded again each time it is shown, so a card hidden in a study session shows as hidden.
- A study session shows only the card, with an arrow at the top left that goes back to Study, and no text before the translation.
- In a study session you can edit the card, ask for a new sentence or hide it without leaving the session.
- The logo and a green dot for the state of the product replace the written state of the API.

## [0.3.0](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.3.0) - 2026-11-08

### Added

- Decks ([DEC-020](docs/decisions.md#dec-020), [DEC-047](docs/decisions.md#dec-047)): the learner makes decks with a title and a pair of languages, chooses the decks the cards of a text go in, and studies only the decks ticked on the Study page.
  A card has its own pair of languages and no longer belongs to a text, and it can be in several decks of its pair; deleting a text keeps its cards.
  The Study box counts the cards due today in each ticked deck, can be shuffled, and remembers the ticked decks in the browser.
- Libraries ([ADR-006](docs/architecture/adr/ADR-006.md)): each browser gets a library of its own, with its texts, cards and decks, so that a learner no longer sees the cards of another.
  The "My library" menu shows the library code, and the learner copies it or saves it as a file, and enters it in another browser to open the same library.
  The product keeps no e-mail address, so a lost code cannot be recovered.
- Product analytics ([ADR-007](docs/architecture/adr/ADR-007.md)): the product records four events about its use, `text_saved`, `cards_generated`, `card_answered` and `sentence_replaced`, and sends them to OpenObserve when `ANALYTICS_ENABLED` is true.
  The events carry no text, word, name or e-mail address, and identify the learner by a one-way hash of the library code; the setting is off by default.
- Observability ([ADR-008](docs/architecture/adr/ADR-008.md)): the product writes one log line for each request to the API, with the request identifier, the route, the outcome and the duration, sends the request durations as a histogram to OpenObserve when `OBSERVABILITY_ENABLED` is true, and answers each request with an `X-Request-ID` header.
  The signals carry no text, word, name or e-mail address; the setting is off by default.

### Changed

- The cards that exist before this version are put in one deck titled "Earlier cards" for each pair of languages, and the database is migrated once at the start.
  Back up the database before the first start of this version.
- The Study page no longer moves when the learner ticks or unticks a deck, and it no longer has notes about the ticked decks: the empty states are blank and the boxes keep their height.
- The cards, decks and texts that exist before this version stay in the default database file, which the web page no longer opens: each browser starts with an empty library.
  Back up the folder `data/libraries` with the database file.
- The Reorder box of the Study page starts folded, and lists the cards due today and the cards due later in two scroll boxes, so that the learner can drag a card from one to the other.

## [0.2.1](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.2.1) - 2026-10-31

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
