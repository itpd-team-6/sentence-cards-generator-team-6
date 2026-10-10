# Week 02 prototypes

## Editor with two ways to review sentences

- **What it is:** a clickable page with mock data and mock behaviour, shown from a branch that is never merged.
  It lists six marked German words, each with a generated sentence and translation from our test of 8 October 2026, and lets the user edit, flag, regenerate or confirm a row.
  It has two ways of reviewing that the user switches between: Mode 1, where only confirmed sentences become cards, and Mode 2, where all cards exist at once and only the flagged ones wait for review.
- **View:** [Mode 1](images/review-mode-1.png) and [Mode 2](images/review-mode-2.png).
- **Tested:** [`US-02`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/28), exercising `AC-01`, `AC-02` and `AC-03`, and [`ASM-02`](../../docs/assumptions.md#asm-02), because whether learners review the sentences instead of accepting all of them unchecked is the risky part.
- **Question:** should a learner confirm every generated sentence before cards are created (Mode 1), or should cards exist at once and only the flagged ones be reviewed (Mode 2)?
- **What the customer said:** he preferred Mode 2. Confirming each card "will be very tedious" because most generated sentences will be fine ([00:21:50]), and a delete button is enough to learn only a subset of the words: "it will be like mode one, where confirm is replaced with delete" ([00:24:02]). He also said that in this layout he could not see the cards and the buttons at once on a narrow screen ([00:16:26]).
- **What changed:** Mode 2 is the direction and the delete button replaces the confirm step, recorded in [`DEC-005`](../../docs/decisions.md#dec-005). `US-02` gained acceptance criteria for it, in the comment that records the change on [its issue](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/28). [`ASM-02`](../../docs/assumptions.md#asm-02) stays `Open`, because the meeting did not show whether learners review. The narrow-screen remark is not a decision yet; we check the layout in the next prototype.

## Study queue with one text moved to the front

- **What it is:** the second tab of the same clickable page, with mock data and mock behaviour.
  It lists ten words from three texts, some with review history, and lets the user move all the words of one text to the top of the queue while the words already studied keep their history.
- **View:** [the study queue](images/study-queue.png).
- **Tested:** [`US-04`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/30), exercising `AC-01` and `AC-02`, because whether a learner wants a whole text to move together, with the history of studied words kept, is the part we are least sure of.
- **Question:** if a learner moves all the words of one text to the front of the study queue, should the words they already studied move too, and what should happen to their review history?
- **What the customer said:** we showed the queue and asked the review-history question. He expects the new cards of a moved text to appear in the next review session, and studied cards to come back "as scheduled by the scheduler", independent of their place in the deck, but added "I'm not sure" ([00:26:49] and [00:27:24]). He could not judge the 55 seconds Anki's "Reposition" took us without seeing the interface ([00:13:16]).
- **What changed:** nothing yet. The answer is uncertain, so it became two open questions in the Week 2 meeting report and `US-04` is unchanged until the Customer sees the queue.
