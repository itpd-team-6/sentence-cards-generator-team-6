# Decisions

## DEC-001

The core of the product is an editor where the learner reviews, edits, flags and regenerates the generated sentences.

- **Status:** Active
- **Date:** 2026-09-30
- **Made by:** Customer
- **Source:** [the kickoff meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-01/meeting-report.md)
- **Why:** sentences written by a language model can sound unnatural or be wrong (Customer, [00:05:38]), and in songs2anki removing a bad sentence meant searching the CSV file for its line and deleting it by hand, the part the Customer found most annoying (Customer, [00:16:13]).

## DEC-002

Review happens inside our app, and importing from Anki is a nice-to-have, not a requirement.

- **Status:** Active
- **Date:** 2026-09-30
- **Made by:** Customer
- **Source:** [the kickoff meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-01/meeting-report.md)
- **Why:** re-prioritizing words is the extra feature the Customer wants most (Customer, [00:20:54]), and it needs us to control the study order, which we can only do if review happens inside our app (Customer, [00:21:50]).

## DEC-003

A decent free language model is acceptable for generating sentences.

- **Status:** Active
- **Date:** 2026-09-30
- **Made by:** Customer
- **Source:** [the kickoff meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-01/meeting-report.md)
- **Why:** songs2anki depends on a paid OpenAI model, so every generation costs money; a decent free model is good enough to start, and an API key for a cheap model may be provided later (Customer, [00:17:50]).

## DEC-004

Picking words in the learner's own text becomes the first step of the editor, not a separate product direction.

- **Status:** Active
- **Date:** 2026-09-30
- **Made by:** Team
- **Source:** [the kickoff meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-01/meeting-report.md)
- **Why:** the editor comes first ([DEC-001](#dec-001)), but it still needs the learner's words to generate sentences for, and marking known and unknown words by hand was one of the two songs2anki steps that "take quite a long time" (Customer, [00:07:08]).

## DEC-005

Every card exists as soon as the words are picked, and the learner deletes the cards they do not want, instead of confirming each one.

- **Status:** Active
- **Date:** 2026-10-09
- **Made by:** Customer
- **Source:** [the Week 2 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-02/meeting-report.md)
- **Why:** when we showed the two prototype modes, the Customer said confirming each card "will be very tedious" because most generated sentences will be fine (Customer, [00:21:50]), and that a delete button is enough to learn only a subset of the words (Customer, [00:24:02]). The "most are fine" belief rests on one check of one model, so [`ASM-01`](assumptions.md#asm-01) is still open.

## DEC-006

The minimum usable product candidate is `US-01`, `US-02` and `US-03`, as proposed.

- **Status:** Active
- **Date:** 2026-10-09
- **Made by:** Customer
- **Source:** [the Week 2 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-02/meeting-report.md)
- **Why:** it confirmed the current direction: the Customer said the three stories produce an end-to-end task, and he would move no story into or out of the candidate (Customer, [00:38:29]).

## DEC-007

Each card has audio for the word and for the sentence, the product gets it from an outside source, and the sentence audio plays automatically in review.

- **Status:** Active
- **Date:** 2026-10-09
- **Made by:** Customer
- **Source:** [the Week 2 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-02/meeting-report.md)
- **Why:** listening during a review is "very important" because it uses hearing as well as vision, and learners often review on the go with the phone in a pocket (Customer, [00:31:34]); our product need not make the audio, but it must fetch it from somewhere, and the audio for the sentence should be played automatically when the learner reviews a card (Customer, [00:31:34]).

## DEC-008

The product must be self-hostable on a local machine or a VPS, with clear instructions that we check.

- **Status:** Active
- **Date:** 2026-10-09
- **Made by:** Customer
- **Source:** [the Week 2 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-02/meeting-report.md)
- **Why:** it fits the open-source nature of the product and leaves the choice to the user; the Customer wants at least the local option "so that no data is sent anywhere" (Customer, [00:11:09]).

## DEC-009

Build the product with a FastAPI (Python) API, a React (Vite) front end and an SQLite database, with the language model set through `.env`.

- **Status:** Active
- **Date:** 2026-10-15
- **Made by:** Team
- **Source:** team discussion
- **Why:** the team works in Python, and FastAPI keeps the API small, so the time goes into the three stories of the minimum usable product; React suits the review table of `US-02`, where the learner edits, regenerates, flags and deletes many cards at once, and one member already has React experience; SQLite is one file with no database server, so a learner can self-host the product on a local machine or a VPS as [`DEC-008`](#dec-008) requires; the model, key and endpoint come from `.env`, so a free or cheap model can be used and changed without code, as [`DEC-003`](#dec-003) allows.

## DEC-010

The audio for a word or a sentence may come from any outside source, a self-hosted text-to-speech model or an online service, and the product is configured to connect to that source and ask it for the audio.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** it answers the question [`DEC-007`](#dec-007) left open, whether the audio may come from an online service given that the product is self-hosted: "it may come from a new source, be it a self-hosted LLM, sorry, not an LLM, a text-to-speech model, or be it an online service" (Customer, [00:03:03]); the source is outside the application, which "should just be configured in a way to connect to that source and request audio for a sentence or for a word" (Customer, [00:03:21]).

## DEC-011

The Customer accepted `US-02` and `US-03`.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** after the six criteria of `US-02` were shown he said "I think this user story can be considered as done, as completed as it is" (Customer, [01:50:01]); he gave no separate verdict for `US-03` after its four criteria were shown, but when asked whether a learner can go from a text to studying its cards without getting stuck, he said "overall they are completed, and you can complete the core task without getting frustrated" (Customer, [03:04:51]); the changes he asked for during both stories are recorded as the decisions that follow, and he said reopening a story is fine if the interface changes dramatically (Customer, [01:48:12]).

## DEC-012

The Customer did not accept `US-01`: `AC-03` failed, and the story stays open until the next meeting.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** `AC-03` has the word shown without a sentence and with a message for it when the language model does not answer, and the learner asks again by hand; the Customer wants the request repeated automatically up to a limit, "a limit on the number of attempts to generate a sentence" (Customer, [00:11:32]), a blank card when the limit is reached, "I think blank will be all right" (Customer, [00:13:48]), and one message for all the failed sentences, "Maybe one message will be enough" (Customer, [01:15:20]); `AC-01` was satisfied, "It seems like this is satisfied" (Customer, [00:27:40]); he kept the story open because "Maybe the overall interface will change and something will change, so it would be nice to check this issue again" (Customer, [01:16:20]).

## DEC-013

A card is identified by its word and a short phrase, three or four words, that uses the word with the same meaning, and the product creates no second card with the same identifier.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** the sentence where a word appears stands for its meaning, and the same word with the same meaning must not give a second card: "if we ask to generate a card for a word that appears in the same sentence, then no card is generated, because we already have such a card" (Customer, [00:32:00]); the team proposed the word and its translation, and the Customer suggested instead "a phrase where the word has the same meaning as in the original sentence" (Customer, [00:46:28]), which keeps the whole meaning in the original language; the phrase "should be editable by the user and by the teacher" (Customer, [00:48:37]).

## DEC-014

The translation follows the sentence, it is made again when the sentence changes, and the learner may edit it or lock it so that it stays until the learner edits the sentence again.

- **Status:** Reversed by [DEC-028](#dec-028)
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** the Customer first wanted the translation read-only (Customer, [01:00:27]), then gave the learner control over it: "The automatic translation flow is one way, from the sentence to the translation" and "the translation should be preserved until the user edits the sentence again" (Customer, [01:06:31] and [01:06:44]); he also asked for "some lock icon", so that the translation does not change "even if the user changes the sentence and starts a regeneration" (Customer, [01:11:25]).

## DEC-015

A flag marks a card that needs another look: the product flags a card with an invalid sentence by itself, the learner may flag any card, and the teacher sees all the cards of a student with the flagged ones first.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** the learner cannot find every bad card, so "the teacher should not only see the cards marked for them, but also other cards, because they may also have some problems" (Customer, [00:21:04]), and "the teacher will see all cards, but those cards marked for the teacher will appear higher in their list" (Customer, [00:24:51]); a card with an invalid sentence is flagged for regeneration without calling the language model, which would spend the learner's tokens: "whenever a card is invalid, we flag it for regeneration" (Customer, [01:31:52]).

## DEC-016

The cards table lets the learner select several cards to regenerate or delete in one action, asks for confirmation before deleting, and has a hide button that keeps a card in its place in the table but out of study.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** with 300 cards, one button per card is too slow, and the Customer agreed to a checkbox in the first column ("Yes, something like this might work", [00:18:22]); for deleting, "they should be able to select a bunch of cards and then click delete, and then you can ask for a confirmation" (Customer, [01:40:34]); a hidden card "should still appear on your cards page" and "even appear at the same place where it was before being hidden" (Customer, [01:41:37]).

## DEC-017

The buttons of the cards table become small icons explained by a legend that stays visible while the table scrolls, the flag is renamed "mark for review", and the edit button opens a larger editor for the information that is not in the table.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** "What does \"flag\" mean?" and "Maybe \"mark for review\" is a good option" (Customer, [01:33:47]); the table "should be scrollable without moving the whole page, so that the legend is always visible" (Customer, [01:36:27]); the edit button can be repurposed "for opening a more advanced editor for a card" (Customer, [00:50:40]), which would show the identifier of [`DEC-013`](#dec-013) and the decks of a card.

## DEC-018

The review screen has four answer buttons that each show when the card will come back, keeps the front and the back apart, plays the audio on both sides, and shows the word as it is written in the text.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** "there should be not two buttons but four buttons, like in Anki" (Customer, [01:53:17]), and the buttons can show the forecast: "you can also show the scheduler's forecast about when the card will be shown next" (Customer, [02:12:38]); on the front the answer must not appear, "you don't show German and English in the same line, you show them separately" (Customer, [02:09:48]); "the audio should be playable for both sides" (Customer, [02:10:34]); German nouns are capitalized, so the word is given "with the same capitalization as it appears" (Customer, [02:15:20]).

## DEC-019

The learner sets a limit of new cards and a limit of cards to review for each day, the review counts three classes of cards (new, learning and to review), and the learner can ask for cards ahead of their schedule.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** in Anki the Customer could not get more cards when none was due, "I couldn't force it to give me more cards" (Customer, [02:39:42]); so "there should be settings for the limit of cards to review today, for a day, and for the number of new cards that are suggested, and also there should be a way to request cards to review ahead of the schedule" (Customer, [02:42:13]); "there are three classes of cards: something really new, something that you learned previously, and something that you found difficult to learn today" (Customer, [02:45:49]).

## DEC-020

A deck is separate from the texts: a card may belong to several decks if their pairs of languages are compatible, a deck may take cards from any number of texts, and the learner picks the decks when asking for sentences.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** the team proposed one deck for each pair of languages, and the Customer found it "a bit constraining" because a learner who studies topics wants separate decks "even though they have the same combination of languages" (Customer, [02:48:39]); after a card is made "the card forgets its original text" and "you don't need to relate texts to decks anymore" (Customer, [02:51:40]); the pair of languages is kept as information of a deck, to show only compatible decks, "you can add cards to multiple decks, but all of them must be compatible with each other with respect to the pair of languages" (Customer, [03:00:27]).

## DEC-021

The study queue is ordered by the date each card is due, and when the learner moves cards, the product gives them a due time that keeps that order; cards never studied are an exception to the daily limit.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** it answers the two readings of moving a text to the front: "it's not necessary that every card moves, only the cards that the user wants to move" (Customer, [03:09:29]); cards are sorted by when they are due, so for moved cards "we override their due time, so that the sorting invariant stays the same" (Customer, [03:17:47]); he confirmed it with "that's what I meant" (Customer, [03:22:30]); new cards are an exception to the daily limit so they cannot be left out by it, which the team proposed (nataliamotand, [03:12:48]) and the Customer did not contest.

## DEC-022

A card may have more than one word, a German noun with its article or a phrase, and the learner can select several words of the text as one card.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** "German nouns are usually studied together with their articles, and so we should support not only the noun but also its article" (Customer, [02:24:02]); the workaround of editing the card by hand "will really look like a workaround, not some native functionality" (Customer, [02:21:51]), so "we should somehow let the user select several words for a card" (Customer, [02:30:11]); how the learner makes the selection is open, see the Week 3 report.

## DEC-023

The next stories are built in this order: `US-04`, then `US-07`, then `US-05`, then `US-06`.

- **Status:** Active
- **Date:** 2026-10-17
- **Made by:** Customer
- **Source:** [the Week 3 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-03/meeting-report.md)
- **Why:** "I would order them as four, seven, and then five, because the teacher requires accounts and can be postponed and implemented later" (Customer, [03:02:00]), and "user story six can even come after user story five" (Customer, [03:02:53]).

## DEC-024

When the language model does not answer, the product repeats the request up to 5 requests in total for a word, waiting 1, 2, 4 and 8 seconds plus a short random time between them, and does not repeat an error that a new request cannot fix.

- **Status:** Active
- **Date:** 2026-10-20
- **Made by:** Team
- **Source:** team discussion
- **Why:** the Customer asked for "a limit on the number of attempts to generate a sentence" ([`DEC-012`](#dec-012)) and gave no number, so the team chose one from the guidance of the providers: the [Gemini API troubleshooting guide](https://ai.google.dev/gemini-api/docs/troubleshooting) recommends exponential backoff with jitter, a maximum number of attempts, and retrying only temporary errors (429, 408, 5xx), not errors such as 400, 402 or 403; the [Google Cloud retry strategy](https://docs.cloud.google.com/model-armor/retry-strategy) waits 1, 2 and 4 seconds plus a random fraction of a second, and caps the wait; the [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) recommends jitter for remote clients; the sources give no number of attempts, so 5 requests was chosen to keep the longest wait for one word near 19 seconds (15 seconds of backoff plus up to 4 seconds of jitter) not counting the time of the requests themselves, because a learner waits for it, and every repeat spends the request limit of a free plan.

## DEC-025

The learner selects several words of a text as one card by holding Shift and clicking the words one by one, and Shift and a click on a chosen word takes it out of the selection; selecting by dragging the mouse is not built.

- **Status:** Active
- **Date:** 2026-10-21
- **Made by:** Customer
- **Source:** [Selecting several words as one card](research/word-selection-options.md)
- **Why:** the Customer chose the first of the two ways shown: "I prefer the first option because of verbs with a separable prefix" and "The second option may not be very convenient when parts of a verb are on different lines" (Customer, chat, 2026-10-21 23:20), and gave "zustimmen -> stimmt zu" and "sich bereit erklären -> erklärt sich bereit" as examples, where the parts of one verb are far apart (Customer, chat, 2026-10-21 23:23); it settles the open part of [`DEC-022`](#dec-022).
  A visible button for touch screens was suggested with "May be" and is not decided, see the open questions in the source.

## DEC-026

A word left out between the chosen words of a card, such as "Wiederaufnahme von Gesprächen" between "stimmt" and "zu", is not highlighted as part of the card, and the learner can still mark it with the normal colour as a word of its own, so it becomes another card.

- **Status:** Active
- **Date:** 2026-10-22
- **Made by:** Customer
- **Source:** [Selecting several words as one card](research/word-selection-options.md)
- **Why:** about the examples sent, where such a word had a pale ground, the Customer wrote "I think it shouldn't be highlighted at all because it's not a part of the word combination" and "It can be highlighted with a normal color on its own, as a word separate from the word combination" (Customer, chat, 2026-10-22, message edited 07:52); to the question whether this means the learner can select the word as another card, he answered "Yes" (Customer, chat, 2026-10-22 10:18).

## DEC-027

The accent colour of the interface is blue, `#2b6fd6`, instead of ruby, and every colour pair of the interface must meet the contrast of WCAG 2.2 (4.5:1 for text, 3:1 for the parts of the interface).

- **Status:** Active
- **Date:** 2026-10-22
- **Made by:** Customer
- **Source:** chat with the Customer, 2026-10-22
- **Why:** the team sent a screenshot with the current ruby and two options, because red may be read as an error; the Customer answered "I prefer option 2" (Customer, chat, 2026-10-22 07:46), the blue one, and "The color is familiar and the contrast seems to be good enough. The contrast must be checked against wcag 2.2" (Customer, chat, 2026-10-22 07:47, message edited).
  The contrast was calculated by the team with the WCAG formula: white text on the blue 4.83:1, text `#a3c8ff` on the soft blue `#172f55` 7.79:1, the focus colour `#8dbbff` on the surface 7.92:1, and the blue on the surface 3.22:1.
  A message about a problem keeps a red tone of its own, so that the accent is no longer read as an error.

## DEC-028

The translation of a card follows its sentence, and the learner may write the translation and lock it; a locked translation does not change when the learner edits the sentence or asks for a new sentence, and the new sentence is written to mean the same as the locked translation.

- **Status:** Active
- **Date:** 2026-10-22
- **Made by:** Team
- **Source:** team discussion
- **Reverses:** [DEC-014](#dec-014)
- **Why:** [`DEC-014`](#dec-014) said that the lock keeps the translation "until the learner edits the sentence again", which is what the Customer said about a translation the learner edited ("the translation should be preserved until the user edits the sentence again", Customer, [01:06:44]); about the lock he said that "the translation does not change even if the user changes the sentence and starts a regeneration" (Customer, [01:11:25]), and the lock follows that: it holds when the sentence is edited and when a new sentence is asked for.
  Without the lock, the translation is made again from the new sentence in both cases, as before.
  The learner may always edit the translation, also when it is locked, and only the learner locks and unlocks it; a card without a translation cannot be locked.
  That the model is given the locked translation when it writes a new sentence, so the two still match, is the team's choice, to be confirmed with the Customer in the Week 4 meeting.

## DEC-029

The learner answers a card with one of four buttons, "Again", "Hard", "Good" and "Easy", each button says when the card comes back, and the wait that each answer gives is set by the rule below, made from the rule of Anki's SM-2 scheduler without its ease.

- **Status:** Active
- **Date:** 2026-10-22
- **Made by:** Team
- **Source:** [Anki manual, Deck Options](https://docs.ankiweb.net/deck-options.html) and [Anki FAQ, What spaced repetition algorithm does Anki use?](https://docs.ankiweb.net/faqs/what-spaced-repetition-algorithm), read on 2026-10-22
- **Why:** [`DEC-018`](#dec-018) has the Customer's request for four buttons "like in Anki" (Customer, [01:53:17]) that show "the scheduler's forecast about when the card will be shown next" (Customer, [02:12:38]), and leaves the rule of the three new answers to the team.
  The rule, with the wait of a card in days (0 when the card is new or was forgotten):
  - "Again": the card is due today and its wait starts over. Anki says that "The default 0.00 means that a review card's delay is reset to zero when you forget it."
  - "Hard": the wait times 1.2, as in Anki ("with a default of 1.20, a card with a 10-day interval will be given 12 days.").
  - "Good": the wait doubled, which is the rule the product already had (1, 2, 4, 8 days); Anki multiplies by the ease of the card, 2.5 at the start ("It defaults to 2.50"), and the team does not keep an ease for each card yet.
  - "Easy": the doubled wait times 1.3, as the Anki "easy bonus" ("With the default value of 1.30").
  - "all new intervals (except Again) will always be at least one day longer than the previous interval" (Anki FAQ), so each of the answers is at least one day longer than the card's wait, and in the team's rule "Good" is at least one day longer than "Hard" and "Easy" one day longer than "Good", so that the buttons do not show the same day.
  - No wait is longer than 365 days, as the scheduler already had it (its code cites Cepeda et al., 2008, for the one-year limit).
  - A card that is new or was forgotten waits 1 day for "Hard", 2 for "Good" and 4 for "Easy". These three numbers are the team's choice: Anki uses minutes and learning steps there, which the product does not have yet. The first "Good" is now 2 days, where the product had 1.
  - The rule rounds half days up. Intervals of 1, 2, 4, 8 and 16 days give "Hard" 2, 3, 5, 10 and 19, "Good" 3, 4, 8, 16 and 32, and "Easy" 4, 5, 10, 21 and 42.
  - The ease of each card and the learning steps in minutes are not part of this rule.
