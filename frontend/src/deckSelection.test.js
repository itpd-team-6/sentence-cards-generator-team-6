import { beforeEach, expect, test, vi } from "vitest";
import {
  readTickedDecks,
  shuffled,
  writeTickedDecks,
} from "./deckSelection.js";

beforeEach(() => localStorage.clear());

test("nothing is ticked the first time", () => {
  expect(readTickedDecks()).toEqual([]);
});

test("the ticked decks are read back as they were written", () => {
  writeTickedDecks([3, 1]);

  expect(readTickedDecks()).toEqual([3, 1]);
});

test("a stored value that is not a list of deck numbers is ignored", () => {
  localStorage.setItem("sentence-cards.ticked-decks", '{"a": 1}');
  expect(readTickedDecks()).toEqual([]);

  localStorage.setItem("sentence-cards.ticked-decks", "not json");
  expect(readTickedDecks()).toEqual([]);

  localStorage.setItem("sentence-cards.ticked-decks", '[1, "x", 2]');
  expect(readTickedDecks()).toEqual([1, 2]);
});

test("a browser that refuses its storage still works", () => {
  const refuse = vi
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation(() => {
      throw new Error("blocked");
    });
  const refuseWrite = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("blocked");
    });

  expect(readTickedDecks()).toEqual([]);
  expect(() => writeTickedDecks([1])).not.toThrow();

  refuse.mockRestore();
  refuseWrite.mockRestore();
});

test("shuffling gives the same cards in another order and leaves the list alone", () => {
  const cards = [1, 2, 3, 4, 5];

  const mixed = shuffled(cards, () => 0);

  expect(cards).toEqual([1, 2, 3, 4, 5]);
  expect([...mixed].sort()).toEqual(cards);
  expect(mixed).not.toEqual(cards);
});
