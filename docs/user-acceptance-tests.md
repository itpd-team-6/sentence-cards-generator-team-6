# User acceptance tests

## The Tests

| Test              | Journey                                    | Status | SPRINT-09   | SPRINT-10       |
| ----------------- | ------------------------------------------ | ------ | ----------- | --------------- |
| [UAT-01](#uat-01) | Make cards from a pasted text              | Active | Not run yet | Not yet defined |
| [UAT-02](#uat-02) | Study the cards of the day and study ahead | Active | Not run yet | Not yet defined |
| [UAT-03](#uat-03) | Find cards and organize them in decks      | Active | Not run yet | Not yet defined |

## UAT-01

Make cards from a pasted text.

**Status:** Active

**Start state:** A test library is open on `<production-url>` in a private window, and it has the deck `UAT texts`.

**Steps:** Open the Texts tab, choose German as the text language and English as the first language, and paste the text "Der Apfel ist rot. Die Katze sitzt auf dem Sofa.".
Click the words `Apfel` and `Katze`, tick the deck `UAT texts` and click Ask for sentences.

**Expected result:** The product says that it saved the text and made 2 cards in 1 deck.
Under Cards of this text, `Apfel` and `Katze` each have a German sentence that contains the word and an English translation.

| Sprint | Date | Runner | Build | Result | Evidence | DEC-nnn |
| ------ | ---- | ------ | ----- | ------ | -------- | ------- |

## UAT-02

Study the cards of the day and study ahead.

**Status:** Active

**Start state:** A test library is open on `<production-url>` in a private window, and its deck `UAT study` has cards due today and a card due later.

**Steps:** Open the Study tab, select only the deck `UAT study` and click Start session.
Show the answer of each card, answer Again to the first card and Good to every card that follows, until the session ends.
In the Reorder box, leave the number next to Study ahead at 1 and click Add to today.

**Expected result:** Each answer button shows when the card comes back, and the card answered Again comes back before the session ends.
After Add to today, the later card with the nearest date is listed at the end of Due today, and the product says "Order saved.".

| Sprint | Date | Runner | Build | Result | Evidence | DEC-nnn |
| ------ | ---- | ------ | ----- | ------ | -------- | ------- |

## UAT-03

Find cards and organize them in decks.

**Status:** Active

**Start state:** A test library is open on `<production-url>` in a private window, with the cards `Haus` and `Garten` and the deck `UAT target`.

**Steps:** Open Your cards, type `Haus` in Search your cards and clear the search.
Tick `Haus` and `Garten` and use the Decks button to add them to the deck `UAT target`.
Tick only `Garten` and click Hide, then open the Study tab and select only the deck `UAT target`.

**Expected result:** The search lists only `Haus`, and the deck `UAT target` shows 2 cards in the filters of Your cards.
The Study tab offers only `Haus`, because `Garten` is hidden.

| Sprint | Date | Runner | Build | Result | Evidence | DEC-nnn |
| ------ | ---- | ------ | ----- | ------ | -------- | ------- |
