import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import StudyPage from "./StudyPage.jsx";
import { answerCard, loadDecks, loadDueCards } from "./api.js";

// The API is replaced by stand-ins, so the test needs no running product.
vi.mock("./api.js", () => ({
  answerCard: vi.fn(),
  loadDecks: vi.fn(),
  loadDueCards: vi.fn(),
}));

// The queue in the Reorder box is not what these tests are about.
vi.mock("./StudyQueue.jsx", () => ({ default: () => null }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const forecast = {
  again: { interval_days: 0 },
  hard: { interval_days: 1 },
  good: { interval_days: 2 },
  easy: { interval_days: 4 },
};

const TRAINS = { id: 1, title: "Trains" };
const TRAVEL = { id: 2, title: "Travel" };

const dueCard = (id, word, decks = [TRAINS]) => ({
  id,
  word,
  decks,
  sentence: `Ein Satz mit ${word}.`,
  translation: "A sentence.",
  forecast,
});

const deck = (id, title, card_count = 2) => ({
  id,
  title,
  text_language: "de",
  first_language: "en",
  card_count,
});

let container;
let root;

async function show() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<StudyPage />));
}

const button = (text) =>
  [...container.querySelectorAll("button")].find((candidate) =>
    candidate.textContent.includes(text),
  );

const click = async (text) => act(async () => button(text).click());

beforeEach(() => {
  localStorage.clear();
  loadDecks.mockResolvedValue([deck(1, "Trains"), deck(2, "Travel")]);
  loadDueCards.mockReset();
  loadDueCards.mockResolvedValue([]);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test("skips a card that was deleted while the session was open", async () => {
  loadDueCards.mockResolvedValue([dueCard(1, "Haus"), dueCard(2, "Baum")]);
  const deleted = new Error("There is no card with this id.");
  deleted.status = 404;
  answerCard.mockRejectedValue(deleted);
  await show();

  await click("Trains");
  await click("Start a session");
  expect(container.querySelector(".study-word").textContent).toBe("Haus");

  await click("Show translation");
  await click("Good");

  expect(container.querySelector(".study-word").textContent).toBe("Baum");
  expect(document.body.textContent).toContain("was deleted");
  expect(container.textContent).toContain("1 card left in this session");
});

test("no deck is ticked the first time, so a session cannot start", async () => {
  await show();

  expect(container.textContent).toContain("No deck ticked");
  expect(button("Start a session").disabled).toBe(true);
  expect(loadDueCards).not.toHaveBeenCalled();
});

test("the Study box counts the cards due today in each ticked deck", async () => {
  loadDueCards.mockResolvedValue([
    dueCard(1, "Haus"),
    dueCard(2, "Baum", [TRAINS, TRAVEL]),
  ]);
  await show();

  await click("Trains");

  expect(loadDueCards).toHaveBeenLastCalledWith([1]);
  expect(container.querySelector(".study-stat b").textContent).toBe("2");
  expect(container.querySelector(".study-by-deck").textContent).toContain(
    "Trains2",
  );
  expect(button("Start a session").disabled).toBe(false);
});

test("a session has only the cards of the ticked decks", async () => {
  loadDueCards.mockResolvedValue([dueCard(1, "Haus", [TRAVEL])]);
  await show();

  await click("Travel");
  await click("Start a session");

  expect(loadDueCards).toHaveBeenLastCalledWith([2]);
});

test("the button ticks every deck, and clears them when all are ticked", async () => {
  await show();

  await click("Select all");
  expect(
    container.querySelectorAll('.dchip[aria-pressed="true"]'),
  ).toHaveLength(2);

  await click("Clear selection");
  expect(
    container.querySelectorAll('.dchip[aria-pressed="true"]'),
  ).toHaveLength(0);
});

test("the ticked decks are remembered in this browser", async () => {
  await show();
  await click("Trains");
  await act(async () => root.unmount());
  container.remove();

  await show();

  const pressed = container.querySelectorAll('.dchip[aria-pressed="true"]');
  expect([...pressed].map((chip) => chip.textContent)).toEqual([
    expect.stringContaining("Trains"),
  ]);
});

test("a remembered deck that no longer exists is not ticked", async () => {
  localStorage.setItem("sentence-cards.ticked-decks", "[1, 99]");

  await show();

  expect(
    container.querySelector(".study-stat:nth-child(2) b").textContent,
  ).toBe("1");
});

test("the session can be shuffled, and the box says so", async () => {
  loadDueCards.mockResolvedValue([dueCard(1, "Haus"), dueCard(2, "Baum")]);
  await show();
  await click("Trains");
  expect(container.querySelector(".order-state").textContent).toBe(
    "Saved order",
  );

  await act(async () => container.querySelector(".shuffle input").click());
  expect(container.querySelector(".order-state").textContent).toBe("Shuffled");
  await click("Start a session");

  expect(container.textContent).toContain("2 cards left in this session");
});

test("the Reorder box starts folded away, and it can be opened and folded again", async () => {
  await show();
  const split = container.querySelector(".study-split");
  expect(split.classList.contains("collapsed")).toBe(true);

  await act(async () => container.querySelector(".collapse-button").click());
  expect(split.classList.contains("collapsed")).toBe(false);

  await act(async () => container.querySelector(".collapse-button").click());
  expect(split.classList.contains("collapsed")).toBe(true);
});

test("only a short note is drawn until the decks are loaded", async () => {
  let arrive;
  loadDecks.mockReturnValue(new Promise((resolve) => (arrive = resolve)));
  await show();
  expect(container.textContent).toContain("Loading the decks");
  expect(container.querySelector(".study-split")).toBeNull();

  await act(async () => arrive([deck(1, "Trains")]));
  expect(container.textContent).not.toContain("Loading the decks");
  expect(container.querySelector(".study-split")).not.toBeNull();
});
