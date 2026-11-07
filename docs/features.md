# Features

The Sentence Cards Generator helps learners turn words from their own texts into cards they can check, improve, and study.
See the [glossary](glossary.md) for the product's terminology.

## Create cards from a text

Choose [marked words](glossary.md#marked-word) from your own text and turn them into [cards](glossary.md#card) for learning in context.

- **Stories:** [US-01](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/27)
- **Behavior:** [FR-001](functional-requirements/fr/FR-001.md), [FR-002](functional-requirements/fr/FR-002.md)
- **Decisions:** [ADR-003](architecture/adr/ADR-003.md)

## Check and improve cards

Review the sentences and translations on your [cards](glossary.md#card), and make them useful for your learning.

- **Stories:** [US-02](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/28)
- **Behavior:** [FR-003](functional-requirements/fr/FR-003.md), [FR-004](functional-requirements/fr/FR-004.md), [FR-005](functional-requirements/fr/FR-005.md), [FR-006](functional-requirements/fr/FR-006.md)

## Study your cards

[Review](glossary.md#review) your [cards](glossary.md#card) in the app and keep learning as they come back for practice.

- **Stories:** [US-03](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/29)
- **Behavior:** [FR-007](functional-requirements/fr/FR-007.md)

## Organize your study queue

Use the [study queue](glossary.md#study-queue) to focus on the cards you want to study sooner.

- **Stories:** [US-04](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/30)
- **Behavior:** [FR-008](functional-requirements/fr/FR-008.md)

## Keep cards in decks

Group your [cards](glossary.md#card) in [decks](glossary.md#deck) that you name, choose the decks when you ask for the cards of a text, and study only the decks you tick.

- **Stories:** [US-11](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/201)
- **Behavior:** [FR-012](functional-requirements/fr/FR-012.md), [FR-013](functional-requirements/fr/FR-013.md), [FR-014](functional-requirements/fr/FR-014.md)
- **Decisions:** [ADR-002](architecture/adr/ADR-002.md)

## Keep my library apart from other learners

Open the product in your own browser and you get a [library](glossary.md#library) that no other learner sees.
Use the "My library" menu to copy its code or save it as a file, and enter the code in another browser to open your library there.

- **Stories:** [US-12](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/206)
- **Behavior:** [FR-015](functional-requirements/fr/FR-015.md)
- **Decisions:** [ADR-006](architecture/adr/ADR-006.md)

## Measure how the product is used

The product records four events about its use, such as a card the learner answered, without any text, name or e-mail address, and shows them on a dashboard for each environment, so that the team can see whether learners study the cards they make.

- **Stories:** [US-13](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/208)
- **Behavior:** [FR-016](functional-requirements/fr/FR-016.md)
- **Decisions:** [ADR-007](architecture/adr/ADR-007.md)
