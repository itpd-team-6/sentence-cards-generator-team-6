import { estimate } from "./studyTexts.js";

// What the header says about today, from the cards due today or earlier (DEC-068): how many there are, how many of
// each kind, how many in each deck and about how long they take. A card that is in two decks is in the count of each of
// them and once in the total. The decks with the most cards come first, and decks with the same number by title.
export function summarize(dueCards) {
  const kinds = { new: 0, forgotten: 0, review: 0 };
  const perDeck = new Map();
  for (const card of dueCards) {
    if (card.stage === "new") kinds.new += 1;
    else if (card.stage === "forgotten") kinds.forgotten += 1;
    else kinds.review += 1;
    for (const deck of card.decks ?? []) {
      const entry = perDeck.get(deck.id) ?? {
        id: deck.id,
        title: deck.title,
        count: 0,
      };
      entry.count += 1;
      perDeck.set(deck.id, entry);
    }
  }
  const decks = [...perDeck.values()].sort(
    (a, b) => b.count - a.count || a.title.localeCompare(b.title),
  );
  return {
    total: dueCards.length,
    ...kinds,
    decks,
    minutes: estimate(dueCards.length),
  };
}

// "Sun 15 Nov": the day of the first card that is not due today.
export const dayOf = (isoDate) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
