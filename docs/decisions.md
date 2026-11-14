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

- **Status:** Reversed by [DEC-030](#dec-030)
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

- **Status:** Reversed by [DEC-042](#dec-042)
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

## DEC-030

The Customer accepted `US-01`, so the story is closed.

- **Status:** Active
- **Date:** 2026-10-24
- **Made by:** Customer
- **Reverses:** [DEC-012](#dec-012)
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md) and [the Customer's chat messages after it](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/evidence/customer-chat-confirmation.md)
- **Why:** in the Week 4 meeting the team showed the three acceptance criteria of `US-01` one at a time, and about the repeated request and the message when the model does not answer, which had failed `AC-03` in Week 3 ([`DEC-012`](#dec-012)), he said "Sounds reasonable. Let's keep it like this." (Customer, [00:12:14]); about the first criterion he said "this one did work, when we choose the right pair of languages" (Customer, [00:18:25]), and that the story "could have been clarified" about setting the first language: "maybe it could have been clarified that I have selected my first language in the settings, but it's okay" (Customer, [00:17:59]).
  The team then wrote in the group chat "US-01: accepted." and the Customer answered "Confirmed" (Customer, chat, 2026-10-24 00:00).

## DEC-031

The Customer did not accept `US-04` yet: `AC-02` and `AC-03` are to be rewritten so that they are clear, and the story stays open.

- **Status:** Active
- **Date:** 2026-10-24
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md) and [the Customer's chat messages after it](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/evidence/customer-chat-confirmation.md)
- **Why:** `AC-02` says that a card already studied keeps its review history and its interval when the learner moves it; the Customer asked "And what happens to its interval?" (Customer, [00:39:48]), and after the team explained that the interval is the wait before the card is studied again and proposed to write the criterion so that this is clear, he answered "Yes." (Customer, [00:42:34]).
  `AC-03` says that the product refuses an order that is no longer valid; the Customer said "Not really. Could you please show it again?" (Customer, [00:44:31]), and asked why the study queue was not updated at once ([`DEC-032`](#dec-032)).
  `AC-01` was shown with cards of two texts, and he said "Then this acceptance criterion is satisfied." (Customer, [00:50:00]).
  The team then wrote in the group chat "US-04: not accepted yet. We will rewrite its acceptance criteria so they are clear (the interval and the refused order), and deleting a card will remove it from the study order at once." and the Customer answered "Confirmed" (Customer, chat, 2026-10-24 00:00).

## DEC-032

Deleting a card removes it from the study queue at once, so that the cards table and the study queue show the same state.

- **Status:** Active
- **Date:** 2026-10-23
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md) and [the Customer's chat messages after it](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/evidence/customer-chat-confirmation.md)
- **Why:** the Customer asked "Why is there no immediate synchronization between the action here and the order?" (Customer, [00:45:28]) and said "if I delete in "Your cards" it should automatically disappear in the other table" (Customer, [00:45:28]); the team agreed that it should be completely synchronous, and he answered "Yeah, I would prefer this. So that there is a single source of truth, and you don't need to handle all kinds of errors." (Customer, [00:46:48]).
  The team wrote in the group chat that "deleting a card will remove it from the study order at once" and the Customer answered "Confirmed" (Customer, chat, 2026-10-24 00:00).

## DEC-033

The product checks the length of each sentence that the language model writes against a minimum and a maximum, counts a sentence outside the limits as a missing one, and asks the model again by the rule of [`DEC-024`](#dec-024); the team chooses the two limits.

- **Status:** Active
- **Date:** 2026-10-23
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md)
- **Why:** the Customer said "there is a lower bound and an upper bound on the length of a sentence that must be generated, so that all sentences have approximately the same length and can be studied in approximately the same time" (Customer, [00:20:23]), and from his own experience "you can't trust an LLM, you have to validate everything it sends back" (Customer, [00:22:54]); asked whether this is the issue he brings up, he answered "That's what I'd like to have in the service." (Customer, [00:24:04]).
  He gave no numbers for the limits.

## DEC-034

The product sends the words of a text to the language model in several batches that are generated independently of each other; the cards of one batch appear together when the batch is done, and the product does not wait for the other batches.

- **Status:** Active
- **Date:** 2026-10-23
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md)
- **Why:** the Customer said "It's okay if cards from a single batch are shown at the same time." (Customer, [00:15:57]), and since a text may have hundreds of selected words, "batches would be generated independently of each other and arrive at different times. No need to wait for all batches." (Customer, [00:15:57]).
  The size of a batch is not decided; his examples were "for example 20 words together, or 50" (Customer, [00:15:57]).

## DEC-035

In the study queue the headings "Due today" and "Later" stay in view, and each of the two lists has its own scroll.

- **Status:** Active
- **Date:** 2026-10-23
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md)
- **Why:** the Customer said "I think "Due today" should be a static element in this card, in this modal. So it shouldn't be inside the scrollable list." (Customer, [00:27:24]), because "when you scroll downwards, I forgot, I didn't see that it's due today" (Customer, [00:27:24]); and then "I think the scrolls for "Due today" and for "Later" should be separate scrolls, and "Due today" and "Later" should be static elements." (Customer, [00:28:04]).
  The team wrote in the group chat "Keep "Due today" and "Later" fixed, with separate scrolling." and the Customer answered "Confirmed" (Customer, chat, 2026-10-24 00:00).

## DEC-036

The time that the product spends repeating a request to the language model is configurable, and its default is 20 seconds.

- **Status:** Active
- **Date:** 2026-10-23
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md) and [the Customer's chat messages after it](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/evidence/customer-chat-confirmation.md)
- **Why:** the Customer said about the 19 seconds of [`DEC-024`](#dec-024) that "19 looks like a magic number" (Customer, [01:32:51]) and "Maybe make this number configurable and set it to some default." (Customer, [01:32:51]), and then "Okay, 20 seconds." (Customer, [01:32:51]).
  The team wrote in the group chat "Make the repeat limit configurable (default 20 seconds)" and the Customer answered "Confirmed" (Customer, chat, 2026-10-24 00:00).

## DEC-037

The learner edits a sentence or a translation in a modal, and editing in place by double-clicking is not built.

- **Status:** Active
- **Date:** 2026-10-23
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md)
- **Why:** the team asked whether double-clicking the sentence to change it in place is needed or the modal is enough, and the Customer said "I think the modal is enough. Maybe it will be even more convenient on mobile. You don't accidentally tap a sentence and start editing it while scrolling the cards." (Customer, [01:00:51])

## DEC-038

The product has a quality requirement that no user can see the key of another user, so that a teacher never sees the key of a student.

- **Status:** Active
- **Date:** 2026-10-23
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md) and [the Customer's chat messages after it](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/evidence/customer-chat-confirmation.md)
- **Why:** about the quality requirements the Customer said "I suggest that you add another one: the teacher may never see the student's key." (Customer, [01:37:20]); the team asked "any user" and he answered "Yeah, yeah, basically like that." (Customer, [01:37:35]).
  The team wrote in the group chat "Add a quality requirement that nobody sees another user's key" and the Customer answered "Confirmed" (Customer, chat, 2026-10-24 00:00).

## DEC-039

The product does not measure the time that the language model takes as a quality of the product; it measures the time that the product takes to show the cards after the answer of the model has arrived.

- **Status:** Active
- **Date:** 2026-10-23
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md) and [the Customer's chat messages after it](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/evidence/customer-chat-confirmation.md)
- **Why:** about the quality requirement on the time of repeating the request, the Customer said "You shouldn't put it in the time behavior characteristic, because this time does not depend on you. It depends on this API." (Customer, [01:32:51]) and "What you can measure is that after the response has arrived, the cards are displayed within half a second, for example." (Customer, [01:32:51]).
  Half a second was his example; the team chooses the limit.
  The team wrote in the group chat "measure the time to show the cards after the model answers" and the Customer answered "Confirmed" (Customer, chat, 2026-10-24 00:00).

## DEC-040

A user who does not use the built-in key may keep their own key in the browser, the browser then makes the requests to the language model, and that key never goes to the server.

- **Status:** Active
- **Date:** 2026-10-23
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md) and [the Customer's chat messages after it](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/evidence/customer-chat-confirmation.md)
- **Why:** about a student who does not want to send the key to the back end, the Customer said "So requests can be made from the front end, and some heavy processing can be outsourced to the back end. This way you never send the student's key to the back end" (Customer, [01:39:45]), and "Basically, if the user does not use a built-in API key, then their API key never goes to the server." (Customer, [01:42:37]); this holds for teachers too: "It's not only about students, it's also about teachers." (Customer, [01:42:37]).
  The team answered "Okay, so we'll change the architecture so it supports the user's wish to not share his API key." (team, [01:42:12]), and wrote in the group chat "the user's key can stay in the browser"; the Customer answered "Confirmed" (Customer, chat, 2026-10-24 00:00).
  The key that the service provides stays in the `.env` file of the server, as in [`ADR-003`](architecture/adr/ADR-003.md).

## DEC-041

The model that makes the audio runs in the back end, so that a learner of a hosted service gets audio without running a model; Piper is the closest of the three options, and the licence of each option is to be checked for commercial use.

- **Status:** Active
- **Date:** 2026-10-23
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md) and [the Customer's chat messages after it](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/evidence/customer-chat-confirmation.md)
- **Why:** for a learner who does not control the machine, the Customer said "I think a more viable option, a more user-friendly option, is to deploy some model on the back end and generate audio for users." (Customer, [01:57:27]) and "Not sure if GPL3 permits commercial usage, so it should be checked." (Customer, [01:57:27]); about the three options shown he said "I think Piper is the closest one, although maybe there are more models that can handle this." (Customer, [01:59:49]) and "Yeah, but, yeah, for the first time it's okay." (Customer, [01:59:59]).
  For a service that the learner runs on their own machine, "you can run a model to generate audio. You just run the model on your machine and then you get audio." (Customer, [01:53:39])
  This keeps [`DEC-010`](#dec-010): the audio may still come from any outside source.
  The team wrote in the group chat "the audio model runs in the backend" and the Customer answered "Confirmed" (Customer, chat, 2026-10-24 00:00).

## DEC-042

The next stories are built in this order: the audio of words and sentences, then the daily limits with asking for more cards, then the decks apart from the texts, then the teacher's review (`US-05`); `US-06` is not in this order and its place is not decided.

- **Status:** Reversed by [DEC-047](#dec-047)
- **Date:** 2026-10-24
- **Made by:** Customer
- **Reverses:** [DEC-023](#dec-023)
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md) and [the Customer's chat messages after it](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/evidence/customer-chat-confirmation.md)
- **Why:** the team asked which story the Customer would miss first, and he said "Okay, so the big priority here: the words and the sentences should go first. Set daily limits, that daily limit should go next. Keeping decks apart from the texts is a short priority. And user story number five is the fourth one." (Customer, [01:49:09]).
  The team then wrote in the group chat "About the next stories the order is audio first, then daily limits and request more cards, then decks, then the teacher's review." and the Customer answered "Confirmed" (Customer, chat, 2026-10-24 00:00).

## DEC-043

A card is still identified by its word and a short phrase ([`DEC-013`](#dec-013)); the team revises the prompt that asks the language model whether to make a new card, tries longer context phrases, and tries the format that the Customer proposed.

- **Status:** Active
- **Date:** 2026-10-24
- **Made by:** Customer
- **Source:** [the Week 4 validation meeting](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/meeting-transcript.md) and [the Customer's chat messages after it](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/reports/week-04/evidence/customer-chat-confirmation.md)
- **Why:** the team asked whether a misjudgment of the model is acceptable or the identifier should have more, and the Customer said "I think maybe the prompt provides too much context for an LLM and therefore it becomes confused and can misclassify sometimes." (Customer, [01:23:31]); the team answered that "we don't have to implement any modification to the ID itself, only to how the prompt is asked to the LLM" (team, [01:24:10]).
  In the group chat the Customer wrote "Also, please experiment with longer context phrases" (Customer, chat, 2026-10-24 00:01) and "Please also revise the prompt that is sent to an LLM when it needs to decide whether to generate a new card." (Customer, chat, 2026-10-24 00:11), with the format of the prompt and an example in the same message.
  What the product does when the model misjudges and makes a second card for the same meaning is not decided: the Customer said "So we have to decide what happens if it misclassifies." (Customer, [01:24:39]), and did not choose between asking the learner and making the card.

## DEC-044

The product on the university VM gets its language model from Cloudflare Workers AI, set only through `LLM_API_KEY`, `LLM_MODEL` and `LLM_BASE_URL`.

- **Status:** Active
- **Date:** 2026-10-30
- **Made by:** Team
- **Source:** team discussion
- **Why:** the Gemini endpoint refuses requests from the VM's address with "User location is not supported for the API use.", so the model must come from a provider that the VM can reach.
  Cloudflare Workers AI has an OpenAI-compatible endpoint, so [`ADR-003`](architecture/adr/ADR-003.md) needs no code change, and its pricing page lists a free allocation of 10,000 Neurons per day ([Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)).
  The runbook [`deployment.md`](deployment.md) records the model, the endpoint shape and the quota.

## DEC-045

The Customer accepted `US-04`, so the story is closed.

- **Status:** Active
- **Date:** 2026-10-31
- **Made by:** Customer
- **Source:** [the Week 5 validation meeting](../reports/week-05/meeting-report.md)
- **Why:** in the Week 5 meeting the team showed `AC-02` and `AC-03` of `US-04` one at a time on the production instance, and the Customer said "Acceptance criterion 3 definitely passes. I saw the result." (Customer, [00:21:23]), "It also passed." (Customer, [00:22:22]) and "I think we can finalize this user story." (Customer, [00:22:28]).
  `AC-01` had been accepted in the Week 4 meeting ([`DEC-031`](#dec-031)).

## DEC-046

The language model of the virtual machine is Mistral Small 3.1 from Cloudflare Workers AI, and the Customer expects that a user can later choose another provider with their own key.

- **Status:** Active
- **Date:** 2026-10-31
- **Made by:** Customer
- **Source:** [the Week 5 validation meeting](../reports/week-05/meeting-report.md)
- **Why:** the team told the Customer that the Gemini endpoint refuses the address of the virtual machine ([`DEC-044`](#dec-044)) and asked whether he accepts Mistral Small 3.1 for the product he will use, and he said "Yes, it is okay." (Customer, [00:25:10]).
  He added "But I expect that later the person will be able to choose another provider, like providing their own API key, so that they can access other models." (Customer, [00:25:14]), which is what [`DEC-040`](#dec-040) already records and which is not built yet.

## DEC-047

The next stories are built in this order: the decks apart from the texts, then the audio of words and sentences, then the daily limits with asking for more cards; the teacher's review is not in the order.

- **Status:** Active
- **Date:** 2026-10-31
- **Made by:** Customer
- **Reverses:** [DEC-042](#dec-042)
- **Source:** [the Week 5 validation meeting](../reports/week-05/meeting-report.md)
- **Why:** the team asked whether the order of [`DEC-042`](#dec-042) still holds, and the Customer said "Yes, I think the decks should come first, because it is more of an architectural change." (Customer, [00:44:08]), "Okay, not very architectural, but it may change the schema of your database." (Customer, [00:44:18]) and "The audio may come next." (Customer, [00:44:40]).
  About the daily limits he said "So the daily limits will just be a little addition on top of it." (Customer, [00:45:10]), "Given that we decide how to handle the timestamps." (Customer, [00:45:18]).
  The team then said back "Okay, so we are moving forward with the decks logic that we are going to implement." (nataliamotand, [00:45:27]) and "Then the audio, then asking for more cards, since it is not so big." (nataliamotand, [00:45:36]) and he answered "Yes, yes." (Customer, [00:45:47]).
  About the teacher's review, see [`DEC-050`](#dec-050).

## DEC-048

The study queue gets a list of decks above the cards, a checkbox for each deck, a "select all" button with two states, and two tabs, one to choose which decks to study and one to re-order the cards; the queue shows only the cards of the selected decks.

- **Status:** Active
- **Date:** 2026-10-31
- **Made by:** Customer
- **Source:** [the Week 5 validation meeting](../reports/week-05/meeting-report.md)
- **Why:** about the open question of the Week 4 meeting, whether the study queue shows the titles of decks and not of texts, the Customer said "I think what we can do is show a list of decks above this list of cards." (Customer, [00:46:56]), "I think it would be better to put them into a list, like Anki does right now, and let the user mark with checkboxes, or somehow else, the decks that they want to study." (Customer, [00:47:30]) and "I am more inclined towards not showing cards from non-selected decks" (Customer, [00:49:18]).
  He suggested "we can provide a "select all" button" (Customer, [00:53:05]) that selects all decks the first time and none the second time (Customer, [00:53:17]).
  When the team asked whether the choosing and the re-ordering could be two separate views (nataliamotand, [00:57:36]), he said "So maybe have separate tabs, one for re-prioritization and one for studying, filtering what to study." (Customer, [00:58:02]) and "Yes, I agree. Thank you for this idea." (Customer, [01:00:18]).
  The team said it can implement it the next week and show it to him (nataliamotand, [00:59:37]).

## DEC-049

The product has a button that regenerates the cards that are empty or invalid, in place of a second flag "flag to regenerate".

- **Status:** Active
- **Date:** 2026-10-31
- **Made by:** Customer
- **Source:** [the Week 5 validation meeting](../reports/week-05/meeting-report.md)
- **Why:** about the open question of the Week 3 meeting, whether there should be one flag or two, the team explained that the second flag was mainly for the card that the product could not write after repeating the request (nataliamotand, [01:02:54]), and the Customer said "Okay, so we can pursue this direction with [inaudible], or we can reuse some button, or select empty cards or invalid cards and regenerate, something like this." (Customer, [01:03:14]).
  The team said that then "the student does not have to look in the table and click more than one button" (nataliamotand, [01:03:43]), and the Customer answered "Okay, let's go with this option then." (Customer, [01:04:06]).

## DEC-050

The product does not build the teacher's side, so the teacher's review (`US-05`) is not built, and its place goes to a mobile version of the product that works offline, released as an installable file on GitHub for the first version.

- **Status:** Active
- **Date:** 2026-10-31
- **Made by:** Customer
- **Source:** [the Week 5 validation meeting](../reports/week-05/meeting-report.md)
- **Why:** the Customer said "I would like to abandon this direction with the teacher in your project." (Customer, [01:05:01]), because of the accounts and the discovery of a teacher by a student (Customer, [01:04:24]), and "Honestly, I thought about trading the teacher functionality for offline usage of the application." (Customer, [01:06:40]).
  About the way to release it he said "I think right now it is enough to release an installable file on GitHub." (Customer, [01:08:14]) and "For example, you release an APK file" (Customer, [01:08:22]).
  The team said back that it is not focusing on the teacher interface anymore and is focusing on the offline mobile version (nataliamotand, [01:09:04]), and he answered "Yes, exactly." (Customer, [01:09:32]).
  He also suggested "that local files are not editable while offline" (Customer, [01:10:19]); the team said it takes a look at this in the following sprints (nataliamotand, [01:10:45]).

## DEC-051

The voices of the audio need no licence for commercial use, and they must be compatible with the MIT licence of the product.

- **Status:** Active
- **Date:** 2026-10-31
- **Made by:** Customer
- **Source:** [the Week 5 validation meeting](../reports/week-05/meeting-report.md)
- **Why:** the team reported that the licence of Piper allows commercial use for the engine and that each voice has its own licence (nataliamotand, [00:08:42]), and the Customer said "As far as I understand, it is not for all voices; for Russian, for example, it is not commercially usable." (Customer, [00:09:35]) and "But it is not a problem." (Customer, [00:09:44]).
  He said "Right now, in general, I do not prioritize voices that have a commercial licence." (Customer, [00:10:11]) and "any option that works for us, and produces voice output of high enough quality, is okay, as far as it is compatible with our MIT licence." (Customer, [00:10:20]).

## DEC-052

`US-09` gets a fourth acceptance criterion about the browsers in which the product opens and works.

- **Status:** Active
- **Date:** 2026-10-31
- **Made by:** Customer
- **Source:** [the Week 5 validation meeting](../reports/week-05/meeting-report.md)
- **Why:** when the team asked whether there was a criterion that it did not put in `US-09` but the Customer thought necessary, he said "Maybe an acceptance criterion about browsers." (Customer, [00:16:04]) and "Or maybe that it opens in Firefox and Chrome, on mobile and desktop." (Customer, [00:16:11]), and about where to write it "Either way works for me." (Customer, [00:17:19]).
  The team asked to add it after the meeting and to show it to him in the chat the same day, and he said "Okay, I will be available until the evening." (Customer, [00:17:54]).

## DEC-053

The Customer accepted `US-09` with its four acceptance criteria, so the story is closed.

- **Status:** Active
- **Date:** 2026-10-31
- **Made by:** Customer
- **Source:** [the Week 5 validation meeting](../reports/week-05/meeting-report.md) and [the Customer's chat message after it](../reports/week-05/evidence/customer-chat-us-09-verdict.md)
- **Why:** in the Week 5 meeting the team showed `AC-01`, `AC-02` and `AC-03` of `US-09` one at a time on the production instance, and the Customer said "Yes, I accessed it by the provided address, and I did not need to install anything." (Customer, [00:12:48]), "Yes, I agree that it passes." (Customer, [00:14:23]) and "More technical than necessary, or for other customers it would look too technical, I guess, but it is okay that you put it here." (Customer, [00:15:24]).
  The team added `AC-04` about the browsers after the meeting ([`DEC-052`](#dec-052)), tested it in Firefox and Chrome on a computer and in Chrome on a phone, and asked in the group chat "Since it is ok can we close US-09?" (nataliamotand, chat, 2026-10-31 16:37), and the Customer answered "Also works in Firefox on mobile phone. Yes, it's done" (Customer, chat, 2026-10-31 17:20).

## DEC-054

The selection editor keeps the line breaks of the pasted text, and more than one line break in a row becomes one.

- **Status:** Active
- **Date:** 2026-10-31
- **Made by:** Customer
- **Source:** [the Customer's chat message after the Week 5 meeting](../reports/week-05/evidence/customer-chat-line-breaks-request.md)
- **Why:** the Customer wrote "Right now, the preview puts the text on a single line and wraps it. As a result, when I paste a song text which doesn't have any separators between lines, I can't see where one line ends and another one starts." (Customer, chat, 2026-10-31 18:24) and "For me, it'd be more convenient if newlines were preserved." (Customer, chat, 2026-10-31 18:24).
  He also wrote "I think if there are more than one newline between lines, they can be replaced with only one." (Customer, chat, 2026-10-31 18:24).

## DEC-055

The Customer accepted `QR-07`.

- **Status:** Active
- **Date:** 2026-11-08
- **Made by:** Customer
- **Source:** [the Week 6 Sprint Review](../reports/week-06/meeting-report.md)
- **Why:** after the team showed the result of `QRT-01` on the observability dashboard and asked whether he accepts the quality requirement, he said "Yeah, I accept this quality requirement." (Customer, [01:20:51]) and "Each request is basically executed under a second, so yeah, this is acceptable." (Customer, [01:20:51]).

## DEC-056

The study page opens on the Study tab, with the study panel above the Reorder panel, and the product remembers the last selection of decks.

- **Status:** Active
- **Date:** 2026-11-08
- **Made by:** Customer
- **Source:** [the Week 6 Sprint Review](../reports/week-06/meeting-report.md)
- **Why:** the Customer said "But I think the study panel would be above the reorder panel." (Customer, [00:26:40]), "I suggest that reorder is not collapsed as it is now, and is not collapsible." (Customer, [00:28:24]), "So rather than selecting all or none of the decks by default, we could just store the last selection of the user and use it in subsequent sessions." (Customer, [00:31:23]) and "I think the study tab should be the tab that opens by default." (Customer, [00:32:33]).

## DEC-057

The study session shows no English sentence on the card, has an arrow at the top left to go back, and lets the learner edit, regenerate and hide a card without leaving the session.

- **Status:** Active
- **Date:** 2026-11-08
- **Made by:** Customer
- **Source:** [the Week 6 Sprint Review](../reports/week-06/meeting-report.md)
- **Why:** the Customer said "I still think that this text in English is not really necessary, because you have a "show translation" button." (Customer, [00:33:49]), "So yeah, maybe an arrow at the top left corner of the screen can be placed." (Customer, [00:36:24]) and "I would like to edit in place to not get very distracted from the session." (Customer, [00:47:18]).
  The team added that regenerating and hiding a card belong in the session as well, "I think maybe we should allow the user to have these options: regenerating, maybe hiding so it doesn't show in the next sessions, or editing by hand." (nataliamotand, [00:48:10]).

## DEC-058

The cards get their own "Your cards" tab, and the product keeps the texts the learner added, so that the learner can work with them later and editing a text keeps its cards.

- **Status:** Active
- **Date:** 2026-11-08
- **Made by:** Customer
- **Source:** [the Week 6 Sprint Review](../reports/week-06/meeting-report.md)
- **Why:** the Customer said "So maybe we can move "Your cards" to a separate tab, but still keep a box here just for cards generated from this text." (Customer, [00:53:14]) and "We should let users edit the texts and preserve cards generated from texts, but while these texts exist we should store them and let users work on them, use them to create new cards." (Customer, [01:09:09])
  The team decided that the cards of a deleted text are kept for now.

## DEC-059

The product supports several users, each with their own cards and progress.

- **Status:** Active
- **Date:** 2026-11-08
- **Made by:** Customer
- **Source:** [the Week 6 Sprint Review](../reports/week-06/meeting-report.md)
- **Why:** the Customer said "Yeah, I think it should support several users." (Customer, [01:03:55]), and the team answered "But I'll add a user story for that, so we can implement it in the following weeks." (nataliamotand, [01:04:14])

## DEC-060

`US-11` is closed and replaced by more specific stories, and the page of a deck, reached from a card, is not an early priority.

- **Status:** Active
- **Date:** 2026-11-08
- **Made by:** Customer
- **Source:** [the Week 6 Sprint Review](../reports/week-06/meeting-report.md)
- **Why:** when the team asked whether `US-11` could be closed as it was, with the other work in new stories, the Customer said "I think it would be better to close this user story and create new ones with more details that you learned." (Customer, [01:15:02])
  About the page of a deck he said "If not, we can... since you mentioned that there is no functionality for inspecting decks, maybe when you implement it we can let the user go to the deck from a card." (Customer, [01:12:29]) and "so maybe it should not be prioritized to be implemented very early, very soon" (Customer, [01:15:45])

## DEC-061

The next stories follow this order: texts and UI improvements, then authentication, then audio, then the mobile version.

- **Status:** Active
- **Date:** 2026-11-08
- **Made by:** Customer
- **Source:** [the Week 6 Sprint Review](../reports/week-06/meeting-report.md)
- **Why:** the Customer said "I think this new work on texts and your improvements will bring the most value." (Customer, [01:25:15]), "So I would prioritize the UI refactoring over audio." (Customer, [01:25:59]), "So maybe let's postpone mobile to after the audio." (Customer, [01:27:04]) and "Then authentication can be done, and then audio and mobile versions." (Customer, [01:27:51])
  When the team repeated the order, he answered "Yes, that's correct." (Customer, [01:28:48])
  This order replaces the order of [`DEC-047`](#dec-047).

## DEC-062

The thresholds of success stay as they are for now.

- **Status:** Active
- **Date:** 2026-11-08
- **Made by:** Customer
- **Source:** [the Week 6 Sprint Review](../reports/week-06/meeting-report.md)
- **Why:** the team showed the thresholds, said it would correct `TOS-01` to "open" ("But here in the table we have that you accept the final product at the end of the semester, and this isn't fulfilled yet, so I'll correct the status to be "open"." (nataliamotand, [01:21:59])) and asked whether the Customer wanted other thresholds, and he said "So I think we can discuss this a bit later." (Customer, [01:23:00])
  The team proposed no change to the thresholds, so this entry records that the outcome of the proposal is no change.

## DEC-063

The product moves between its pages by an address after the `#`, and the Study page is the page it opens on.

- **Status:** Active
- **Date:** 2026-11-11
- **Made by:** Team
- **Source:** team discussion
- **Why:** the Customer said "For me the first action in Anki was not to add a text but to study. I think the study tab should be the tab that opens by default." (Customer, [00:32:33]), as recorded in [`DEC-056`](#dec-056), and asked for a way to open a text and a deck from a card: "And this label can be used to go to the text, to the text page, I mean from a card." (Customer, [01:11:13]) and "maybe when you implement it we can let the user go to the deck from a card." (Customer, [01:12:29]).
  Today the open page is kept only in the state of `frontend/src/App.jsx`, so no address names a page: reloading the page or pressing the back button of the browser returns to the first page, and a text or a deck cannot be linked.
  The team chose an address after `#` because the browser reads it alone and the server needs no setting for it, and a small router of its own because no library is needed for these pages.
  The behavior the learner knows stays: the page "Add a text" keeps the typed text and the marked words when the learner goes to another page and comes back, and it keeps them with the languages when the learner reloads the page, in the storage of the tab until it is closed or another library is opened, and a study session ends when the learner leaves the Study page.

## DEC-064

The product keeps the texts the learner saves, as a library of texts that the learner opens, edits and deletes, and a text keeps its cards when it changes.

- **Status:** Active
- **Date:** 2026-11-12
- **Made by:** Team
- **Source:** team discussion
- **Why:** the Customer said "We should let users edit the texts and preserve cards generated from texts, but while these texts exist we should store them and let users work on them, use them to create new cards." (Customer, [01:09:09]), as recorded in [`DEC-058`](#dec-058), and "we can introduce a label for a card: the text it comes from." (Customer, [01:10:07]) and "And this label can be used to go to the text, to the text page, I mean from a card." (Customer, [01:11:13]).
  The product already saved each text with its marked words, but the learner had no way to see the saved texts again.
  The team made these choices, which the Customer did not state:
  - The Texts page has the form that adds cards from a text and, under it, the list of saved texts, and a saved text opens on its own page at `#/texts/` and its number. The page "Your cards" is a tab of its own at `#/your-cards`, as [`DEC-058`](#dec-058) says, and a page of a text shows only the cards of that text. The pages and their addresses of [`DEC-063`](#dec-063) are now Study, Texts and Your cards.
  - A text has a title that is made from its first six words, 60 characters at most, when the learner gives none, and the learner can change it. The title is the name of the text in the list and in the label of a card.
  - A text has at most 10,000 characters, and the page shows the count next to the text and turns it red at the maximum. The limit is the one that issue [#256](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/256) names.
  - The pair of languages of a saved text cannot change, because its cards have their own pair of languages and would no longer fit the text.
  - Changes to a saved text are kept only when the learner chooses "Save changes", and "Make cards" saves them first, so that the cards are made for the text the learner sees.
  - Taking a mark away removes only the mark. The card stays in "Your cards" and in its decks, with its study data, in line with the card that is kept when its text is deleted ([`DEC-058`](#dec-058)). A mark whose word the new text no longer has is removed in the same way, and the page says so.
  - A mark of several words is kept while the new text has its words in this order, and it is shown at the first place where they are found in this order. When the same words are in the text in two places, the page may show a different place than the one the learner chose; the card is the same.
  - The box that edits a card lists the texts it comes from, each with a link to its page. The label of each card in the table "Your cards" that [`DEC-058`](#dec-058) asks for is not part of this decision: it is made with the search and the filters of "Your cards", together with the decks.
    The answer that makes the cards now says how many cards the request made, so that the page does not count the cards the text already had.

## DEC-065

The product has a Decks tab where the learner makes, renames, opens and deletes decks, a page for each deck with its cards, and a deck "Uncategorized" for each language pair that holds the cards that are in no other deck.

- **Status:** Active
- **Date:** 2026-11-13
- **Made by:** Team
- **Source:** team discussion
- **Why:** the Customer said, about the decks, "since you mentioned that there is no functionality for inspecting decks, maybe when you implement it we can let the user go to the deck from a card." (Customer, [01:12:29]) and "Maybe we should let the user go to the "animals" deck when they click on "animals"." (Customer, [01:13:09]).
  nataliamotand asked for "another tab or something like that, so the user doesn't have to know that he can only reach the decks if he goes to the study, goes to the reorder and clicks the deck." ([01:14:10]) and the Customer answered "Yeah, I agree." ([01:14:24]).
  The Customer also said "maybe it should not be prioritized to be implemented very early, very soon. But yeah, that's up to you right now." ([01:15:45]); the team decided to build it in sprint 7, after the stories the Customer prioritized, as the issues [#253](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/253) and [#258](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/258) say.
  The team made these choices, which the Customer did not state:
  - The Decks tab is the fourth page, at `#/decks`, and a deck opens at `#/decks/` and its number. It shows one tile for each deck, with the cards to study today, the share learned and the number of cards, as the Study box does ([`DEC-066`](#dec-066)), in a section for each language pair that has a deck. When there is more than one pair, a button for each pair shows only the chosen ones, and from six decks a search by title narrows the tiles. The page of a deck has its title, the statistics of today for that deck, a button that studies only that deck, the search and the list of its cards, which the learner changes like in "Your cards" ([`DEC-067`](#dec-067)), and a button that adds cards of the same language pair to the deck.
  - The deck of a card is a link in the card when it is opened, in "Your cards" and in a deck, so that the learner goes from a card to its deck, as the Customer said. The decks are not links in the row of the card, so that the row stays light ([`DEC-067`](#dec-067)).
  - A deck is renamed with the rules of a new title ([`DEC-020`](#dec-020)): 1 to 60 characters, free for its language pair.
  - Deleting a deck never deletes a card that is also in another deck. For the cards that are only in the deleted deck the learner chooses, in the box that asks to confirm, to delete them or to keep them in the deck "Uncategorized" of their language pair, which is made if it does not exist. The box says how many cards are only in the deck and how many are also in another one, and a failure changes nothing.
  - "Uncategorized" is a real deck, one for each language pair that has cards in no other deck, and not an empty filter. A migration (number 9) marks it with a column of the deck, so that its title can change in the product without a change in the code, puts every card that is in no deck in the "Uncategorized" deck of its pair, and takes an existing deck that the learner titled "Uncategorized" as that deck. A card that leaves its last deck goes to "Uncategorized" by itself, and a card put in another deck leaves it. The learner does not choose "Uncategorized" as a deck for new cards or for a change of decks. It cannot be renamed, and it can only be deleted together with its cards. This replaces the item "Uncategorized" for cards in no deck that [`DEC-067`](#dec-067) describes, which stays only for a learner whose database has no such deck.
  - The migration changes the rows of the learner's cards, so the deployment copies the database file and the folder `libraries` before the update, in staging as in production ([`deployment.md`](deployment.md)).

## DEC-066

The Study box shows an estimate of the time of a session, counting 30 seconds for each card, and the share of each deck that is learned.

- **Status:** Active
- **Date:** 2026-11-11
- **Made by:** Team
- **Source:** team discussion
- **Why:** the Customer asked for the statistics at the top of the Study page: "the statistics will be at the top of the page, like "due today", "new", "learning"." (Customer, [00:37:35]) and "In Anki there are three numbers: new, learn and due, if you remember." (Customer, [00:38:51]), and nataliamotand said "I will make sure that we try this next week and show you at the next sprint review, so you can see if it meets your expectations." ([00:42:25]).
  The Customer never mentioned a time estimate or a share learned, so both are the choice of the team, made to give the learner a sense of the session before it starts.
  The team does not measure how long a card takes, so the estimate is a fixed 30 seconds for each card, rounded up to whole minutes and always written as "about"; the value is one constant in `frontend/src/studyTexts.js` and is easy to change.
  The share learned of a deck is the cards that are not hidden, were answered at least once and are not forgotten, over the cards that are not hidden; it needs only the answer count of [`DEC-063`](#dec-063) and the interval, so it adds no migration.
  The Study page shows it as a thin line in each deck, and the Decks page can show the number.

## DEC-067

The page "Your cards" is where the learner finds, searches, groups and organizes all their cards, with a list of filters at the side, one search box with a panel of results, a choice of grouping and order, and a box that changes the decks of the selected cards.

- **Status:** Active
- **Date:** 2026-11-12
- **Made by:** Team
- **Source:** team discussion
- **Why:** [`DEC-064`](#dec-064) moved all the cards to a page of their own, but the page was one table with no way to narrow it, and the story [`US-17`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/234) asks for the learner to find their cards in a few steps.
  The team chose a list of filters at the side with a box for each deck, text and status, and a search box, over a menu or a page for each filter, because the learner sees every choice and how many cards each one gives without opening anything.
  The team made these choices, which the Customer did not state:
  - Inside one part, the product lists the cards that are in at least one ticked item, because the learner who ticks two decks usually wants the cards of both, and offers "All" for the cards that are in every one of them. Between parts the choices are joined with "and", so ticking a deck and a text narrows the list.
  - The number of an item counts the cards the learner would get by ticking it, with the other choices applied, and an item with no card is dimmed but a ticked item stays, so no choice leads to a list that cannot be undone.
  - A card in no deck and a card whose text was deleted are items like the others, "Uncategorized" and "No text", so that taking a card out of all its decks does not hide it. [`DEC-065`](#dec-065) later made "Uncategorized" a real deck, so a card is no longer in no deck.
  - The search is one box for the cards, the texts and the decks. The list narrows as the learner types, and a panel under the box says what was found in each kind; a text or a deck of the panel is ticked in the list of filters, because the filters are how the learner chooses a text or a deck.
  - A row shows the text the card came from, only the decks the learner ticked, and how many decks the card is in, not the names of all its decks, so that a row stays light; the names show when the pointer rests on the number, and the box that edits the card lists all its decks.
  - The learner can group the cards by deck or by text. A card that is in two decks shows in both groups and the total counts it once.
  - The decks of the selected cards change in one step through the bar of the selected cards, and only the link between a card and its decks changes, so the card keeps its sentence and its study data. The box shows only the decks of the language pair of the cards, as [`DEC-020`](#dec-020) says a deck takes only cards of its pair.
  - The search, the ticked items, the grouping and the order stay in the browser while the tab is open, so that the learner who opens a text from a card finds the list as it was.
  - On a narrow screen the list of filters is a sheet from the bottom, opened by a button that shows the number of ticked items.

## DEC-068

The header is a bar as wide as the window with a pill that says how many cards the learner has to study today, on every page except Study, and a panel under it with the cards of each kind and of each deck.

- **Status:** Active
- **Date:** 2026-11-12
- **Made by:** Team
- **Source:** team discussion
- **Why:** the Customer asked for the statistics at the top of the Study page ([`DEC-066`](#dec-066)), and the Study box already gives them there. The learner who is on another page cannot see them, so the team tries the same numbers in the header and will show it at the next sprint review, as nataliamotand told the Customer ([00:42:25]).
  The team made these choices, which the Customer did not state:
  - The pill counts the cards of all the decks, not the decks ticked on the Study page, because on another page the learner cannot see which decks are ticked, and a number that depends on it would be hard to read. The panel says "All decks" for that reason.
  - The pill opens the Study page, and the panel opens only while the pointer rests on the pill or it has the focus, so that the number is always in view and the detail does not take room.
  - The pill is not shown on the Study page, where the Study box already says the same, nor in a session, where the header is hidden.
  - The header is not fixed, so that it takes no room from the page when the learner scrolls.
  - The pill reads the cards with the calls of the Study page and adds no endpoint and no migration, and it reads them again when the learner changes page or something of the learner's data changes.
  - On a narrow bar the name of the product goes first. The time was first to go in this decision, and [`DEC-069`](#dec-069) moved it to the panel.

## DEC-069

The estimated time of today's cards moves from the pill in the header to the panel under it.

- **Status:** Active
- **Date:** 2026-11-13
- **Made by:** Team
- **Source:** team discussion
- **Why:** the header gets a fourth tab, "Decks" ([`DEC-065`](#dec-065)), and the bar does not have room for the four tabs, the pill with its count and its time, the state and the library without dropping something. [`DEC-068`](#dec-068) dropped the time on a narrow bar, so a learner on a phone never saw it.
  The pill keeps the number of cards to study, which is what the learner needs at a glance, and the panel title says the time, "Today — All decks · about 4 min", with the estimate of [`DEC-066`](#dec-066). The panel does not open on a screen that has no pointer, so there a phone shows only the number; the Study page and the page of a deck still say the time.
  The team made this choice without the Customer, who asked for the statistics at the top of the Study page ([`DEC-066`](#dec-066)) and will see the header at the sprint review.

## DEC-070

When the language model misjudges and a second card is made for a meaning the learner already has, the product makes the card without asking the learner, who can delete it.

- **Status:** Active
- **Date:** 2026-11-13
- **Made by:** Team
- **Source:** [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165) and [the test table on the model of the virtual machine](research/fr-009-model-test.md)
- **Why:** the Customer said "we can't fully trust the LLM. So we have to decide what happens if it misclassifies. So if it decides to create a new card although similar cards exist. So either we should ask the user to decide whether they want this new card, or we allow it to just create it and not notify the user. So should we highlight such cards where we are not sure whether they should exist, or should we keep it simple, generate a card, and let the user decide, maybe they notice that they already have such a card?" (Customer, [01:24:39] of the Week 4 meeting) and did not choose ([`DEC-043`](#dec-043)).
  The team chose the simple way in [issue #165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165), because the tests of Week 4 found no misjudgment and the case seemed rare.
  The test table of the model of the virtual machine ([`fr-009-model-test.md`](research/fr-009-model-test.md)) shows that it is not rare for this model on the team's cases: the question of today made a second card for the same meaning in 14 of 54 cases that expected "exists", in the same four cases in all three runs (a fifth in two of them), and refused a needed card in none of 54.
  The other way of asking that was tried, the format of the Customer in the team's version of it, made no second card and refused 6 of 18 needed cards, a mistake that the learner cannot repair by deleting a card.
  The team keeps the simple way and the question of today, because a second card can be deleted and a refused card is lost.
- **Consequences:**
  - A learner can see two cards for one meaning of a word, with two phrases, and deletes the one they do not want, as [`FR-009`](functional-requirements/fr/FR-009.md) says.
  - The team does not know how often a real learner meets it, because the cases of the test are the team's.
  - The team tells the Customer this decision and the numbers at the Sprint Review.
