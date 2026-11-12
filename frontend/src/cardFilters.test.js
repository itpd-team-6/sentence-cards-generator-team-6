import { expect, test } from "vitest";
import {
  NONE,
  choiceCount,
  countItems,
  describe,
  emptyFilters,
  filterCards,
  groupCards,
  matchesSearch,
  normalize,
  sortCards,
  splitMatch,
} from "./cardFilters.js";

const DE_RU = { text_language: "de", first_language: "ru" };
const deckA = { id: 1, title: "Deck A" };
const deckB = { id: 2, title: "Deck B" };
const textX = { id: 10, title: "Text X" };
const textY = { id: 11, title: "Text Y" };

const cards = [
  {
    id: 1,
    ...DE_RU,
    word: "Zug",
    phrase: null,
    sentence: "Ich nehme den Zug.",
    translation: "поезд",
    decks: [deckA, deckB],
    texts: [textX],
    hidden: false,
    flagged: false,
  },
  {
    id: 2,
    ...DE_RU,
    word: "fahren",
    phrase: null,
    sentence: "Wir fahren nach Hause.",
    translation: "ехать",
    decks: [deckA],
    texts: [textX, textY],
    hidden: true,
    flagged: true,
  },
  {
    id: 3,
    ...DE_RU,
    word: "Reise",
    phrase: null,
    sentence: null,
    translation: null,
    decks: [],
    texts: [],
    hidden: false,
    flagged: false,
  },
];

const ids = (list) => list.map((card) => card.id);
const withFilters = (changes) => ({ ...emptyFilters(), ...changes });

test("without choices every card is listed", () => {
  expect(ids(filterCards(cards, emptyFilters()))).toEqual([1, 2, 3]);
});

test("with several decks ticked, any lists the cards that are in at least one of them", () => {
  const filters = withFilters({ decks: [1, 2], decksMode: "any" });

  expect(ids(filterCards(cards, filters))).toEqual([1, 2]);
});

test("with several decks ticked, all lists only the cards that are in every one of them", () => {
  const filters = withFilters({ decks: [1, 2], decksMode: "all" });

  expect(ids(filterCards(cards, filters))).toEqual([1]);
});

test("a deck and a text ticked together keep the cards that pass both", () => {
  const filters = withFilters({ decks: [2], texts: [11] });

  expect(ids(filterCards(cards, filters))).toEqual([]);
  expect(
    ids(filterCards(cards, withFilters({ decks: [1], texts: [11] }))),
  ).toEqual([2]);
});

test("the item for cards in no deck and the item for cards from no text are ticked like any other", () => {
  expect(ids(filterCards(cards, withFilters({ decks: [NONE] })))).toEqual([3]);
  expect(ids(filterCards(cards, withFilters({ texts: [NONE] })))).toEqual([3]);
});

test("the statuses keep the hidden cards, the ones marked for review and the ones without a sentence", () => {
  expect(
    ids(filterCards(cards, withFilters({ statuses: ["hidden"] }))),
  ).toEqual([2]);
  expect(
    ids(filterCards(cards, withFilters({ statuses: ["review"] }))),
  ).toEqual([2]);
  expect(
    ids(filterCards(cards, withFilters({ statuses: ["no-sentence"] }))),
  ).toEqual([3]);
});

test("a search ignores the case of the letters and the accents", () => {
  expect(normalize("  ÄPFEL ")).toBe("apfel");
  expect(matchesSearch(cards[0], "ZUG")).toBe(true);
  expect(matchesSearch({ word: "café" }, "cafe")).toBe(true);
  expect(matchesSearch(cards[0], "bahn")).toBe(false);
});

test("a search looks in the word, the sentence and the translation", () => {
  expect(ids(filterCards(cards, withFilters({ search: "hause" })))).toEqual([
    2,
  ]);
  expect(ids(filterCards(cards, withFilters({ search: "поезд" })))).toEqual([
    1,
  ]);
  expect(ids(filterCards(cards, withFilters({ search: "reise" })))).toEqual([
    3,
  ]);
});

test("the search works inside the ticked decks", () => {
  const filters = withFilters({ decks: [2], search: "fahren" });

  expect(ids(filterCards(cards, filters))).toEqual([]);
});

test("the count of an item uses the other choices and not the part it is in", () => {
  const filters = withFilters({ decks: [2], texts: [10] });

  const decks = countItems(cards, filters, "decks");
  expect(decks.get(1)).toBe(2); // Deck A would give two cards of Text X
  expect(decks.get(2)).toBe(1);
  const texts = countItems(cards, filters, "texts");
  expect(texts.get(11)).toBeUndefined(); // no card of Deck B is in Text Y
});

test("the sentence says in words what the list has in common", () => {
  const names = { decks: [deckA, deckB], texts: [textX], pairs: [] };

  expect(describe(12, withFilters({ decks: [1], texts: [10] }), names)).toBe(
    "12 cards in Deck A, from Text X",
  );
  expect(
    describe(1, withFilters({ decks: [1, 2], decksMode: "all" }), names),
  ).toBe("1 card in all of Deck A and Deck B");
  expect(
    describe(2, withFilters({ decks: [NONE], search: "zug" }), names),
  ).toBe("2 cards in no deck, matching “zug”");
  expect(describe(3, emptyFilters(), names)).toBe("3 cards");
});

test("the number on the phone button counts the choices and not the search", () => {
  expect(choiceCount(withFilters({ decks: [1, 2], search: "zug" }))).toBe(2);
});

test("the cards are sorted with the newest first, the oldest first, or from A to Z without the case or the accents", () => {
  expect(ids(sortCards(cards, "newest"))).toEqual([3, 2, 1]);
  expect(ids(sortCards(cards, "oldest"))).toEqual([1, 2, 3]);
  expect(ids(sortCards(cards, "word"))).toEqual([2, 3, 1]);
  expect(ids(cards)).toEqual([1, 2, 3]);
});

test("grouping by deck makes a group for each deck with cards and a last one for the cards in no deck", () => {
  const groups = groupCards(cards, "deck", [deckA, deckB], []);

  expect(groups.map((group) => [group.title, ids(group.cards)])).toEqual([
    ["Deck A", [1, 2]],
    ["Deck B", [1]],
    ["Uncategorized", [3]],
  ]);
});

test("grouping by text makes a group for each text with cards and a last one for the cards from no text", () => {
  const groups = groupCards(cards, "text", [], [textX, textY]);

  expect(groups.map((group) => [group.title, ids(group.cards)])).toEqual([
    ["Text X", [1, 2]],
    ["Text Y", [2]],
    ["No text", [3]],
  ]);
});

test("without a kind the cards are not grouped", () => {
  expect(groupCards(cards, "none", [deckA], [textX])).toBeNull();
});

test("splitMatch marks the part that has the search, without the case and without accents", () => {
  expect(splitMatch("Zugang", "zug")).toEqual([
    { text: "Zug", match: true },
    { text: "ang", match: false },
  ]);
  expect(splitMatch("die Fähre", "FAHRE")).toEqual([
    { text: "die ", match: false },
    { text: "Fähre", match: true },
  ]);
  expect(
    splitMatch("Zug und Zug", "zug").filter((part) => part.match),
  ).toHaveLength(2);
  expect(splitMatch("Haus", "")).toEqual([{ text: "Haus", match: false }]);
  expect(splitMatch("Haus", "zug")).toEqual([{ text: "Haus", match: false }]);
});
