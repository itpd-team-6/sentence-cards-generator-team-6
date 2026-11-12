import { expect, test } from "vitest";
import { dayOf, summarize } from "./todaySummary.js";

const card = (stage, ...decks) => ({
  stage,
  decks: decks.map(([id, title]) => ({ id, title })),
});

test("the summary counts the cards of each kind and the total", () => {
  const summary = summarize([
    card("new", [1, "Travel"]),
    card("new", [1, "Travel"]),
    card("forgotten", [1, "Travel"]),
    card("due", [2, "Work"]),
  ]);

  expect(summary).toMatchObject({ total: 4, new: 2, forgotten: 1, review: 1 });
});

test("a card in two decks counts once in the total and once in each deck", () => {
  const summary = summarize([
    card("due", [1, "Travel"], [2, "Work"]),
    card("due", [2, "Work"]),
  ]);

  expect(summary.total).toBe(2);
  expect(summary.decks).toEqual([
    { id: 2, title: "Work", count: 2 },
    { id: 1, title: "Travel", count: 1 },
  ]);
});

test("decks with the same number of cards come in the order of their titles", () => {
  const summary = summarize([
    card("due", [1, "Work"]),
    card("due", [2, "Travel"]),
  ]);

  expect(summary.decks.map((deck) => deck.title)).toEqual(["Travel", "Work"]);
});

test("a card in no deck counts in the total and in no deck", () => {
  const summary = summarize([card("new")]);

  expect(summary.total).toBe(1);
  expect(summary.decks).toEqual([]);
});

test("the time is the estimate of the Study page, rounded up", () => {
  expect(summarize([card("due"), card("due"), card("due")]).minutes).toBe(
    "about 2 min",
  );
});

test("a day is written with its weekday, as in the study queue", () => {
  expect(dayOf("2026-11-15")).toBe("Sun 15 Nov");
});
