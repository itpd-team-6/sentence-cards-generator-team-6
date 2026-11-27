import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import StudyQueue from "./StudyQueue.jsx";
import { loadQueue, saveQueueOrder } from "./api.js";

// The API is replaced by stand-ins, so the test needs no running product.
vi.mock("./api.js", () => ({
  loadQueue: vi.fn(),
  saveQueueOrder: vi.fn(),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const card = (id, word, dueToday, dueDate = "2026-12-01") => ({
  id,
  word,
  sentence: `Ein Satz mit ${word}.`,
  due_today: dueToday,
  due_date: dueDate,
  decks: [{ id: 1, title: "Trains" }],
});

// Two cards due today and three due later, in the order the queue shows them.
const CARDS = [
  card(1, "Haus", true),
  card(2, "Baum", true),
  card(3, "Zug", false, "2026-11-30"),
  card(4, "Bus", false, "2026-12-01"),
  card(5, "Tram", false, "2026-12-02"),
];

let container;
let root;

async function show(cards) {
  loadQueue.mockResolvedValue(cards);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<StudyQueue deckIds={[1]} />));
}

beforeEach(() => {
  loadQueue.mockReset();
  saveQueueOrder.mockReset();
  saveQueueOrder.mockResolvedValue([]);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

// The number of cards beside "Due today" and beside "Later".
const counts = () =>
  [...container.querySelectorAll(".queue-heading span")].map(
    (count) => count.textContent,
  );

const field = () => container.querySelector(".ahead input");
const add = () => container.querySelector(".ahead-go");

async function setNumber(text) {
  const set = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  ).set;
  await act(async () => {
    set.call(field(), text);
    field().dispatchEvent(new Event("input", { bubbles: true }));
  });
}

test("Study ahead is on the line of the cards due later, and not on the line of the cards due today", async () => {
  await show(CARDS);

  const groups = container.querySelectorAll(".queue-group");

  expect(groups[0].querySelector(".ahead")).toBeNull();
  expect(groups[1].querySelector(".ahead")).not.toBeNull();
});

test("there is no Study ahead when no card is due later", async () => {
  await show(CARDS.slice(0, 2));

  expect(container.querySelector(".ahead")).toBeNull();
});

test("the number cannot be larger than the cards due later", async () => {
  await show(CARDS);

  await setNumber("9");

  expect(field().value).toBe("3");
});

test("Add to today moves the cards due soonest to the end of the cards due today and saves that order", async () => {
  await show(CARDS);
  await setNumber("2");

  await act(async () => add().click());

  expect(saveQueueOrder).toHaveBeenCalledTimes(1);
  const [order, moved, line, decks] = saveQueueOrder.mock.calls[0];
  expect(order).toEqual([1, 2, 3, 4, 5]);
  expect(moved).toEqual([3, 4]);
  expect(line).toBe(4);
  expect(decks).toEqual([1]);
});

test("one card is brought by default, and the cards due today keep their place", async () => {
  await show(CARDS);

  await act(async () => add().click());

  const [order, moved, line] = saveQueueOrder.mock.calls[0];
  expect(order).toEqual([1, 2, 3, 4, 5]);
  expect(moved).toEqual([3]);
  expect(line).toBe(3);
});

test("the brought cards are shown at once as due today", async () => {
  await show(CARDS);
  await setNumber("2");
  saveQueueOrder.mockResolvedValue([
    card(1, "Haus", true),
    card(2, "Baum", true),
    card(3, "Zug", true),
    card(4, "Bus", true),
    card(5, "Tram", false, "2026-12-02"),
  ]);

  await act(async () => add().click());

  expect(counts()).toEqual(["4", "1"]);
});

test("a move that cannot be saved leaves the cards where they were", async () => {
  await show(CARDS);
  saveQueueOrder.mockRejectedValue(new Error("The order was refused."));

  await act(async () => add().click());

  expect(counts()).toEqual(["2", "3"]);
  expect(document.body.textContent).toContain("The move was not saved.");
});
