import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import StudyPage, { forgetLastStudy } from "./StudyPage.jsx";
import {
  answerCard,
  changeCard,
  loadDecks,
  loadDueCards,
  newSentence,
} from "./api.js";

// The API is replaced by stand-ins, so the test needs no running product.
vi.mock("./api.js", () => ({
  answerCard: vi.fn(),
  changeCard: vi.fn(),
  loadDecks: vi.fn(),
  loadDueCards: vi.fn(),
  newSentence: vi.fn(),
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

const dueCard = (id, word, decks = [TRAINS], stage = "new") => ({
  id,
  word,
  decks,
  stage,
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

async function show(onSessionChange) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () =>
    root.render(<StudyPage onSessionChange={onSessionChange} />),
  );
}

// The number beside its label in the Study box: "New", "Forgotten" or "Review".
const stat = (label) =>
  [...container.querySelectorAll(".study-stat")]
    .find((box) => box.querySelector("span").textContent === label)
    ?.querySelector("b").textContent;

const button = (text) =>
  [...container.querySelectorAll("button")].find(
    (candidate) =>
      candidate.textContent.includes(text) ||
      candidate.getAttribute("aria-label") === text,
  );

const click = async (text) => act(async () => button(text).click());

beforeEach(() => {
  localStorage.clear();
  forgetLastStudy();
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
  await click("Start session");
  expect(container.querySelector(".study-word").textContent).toBe("Haus");

  await click("Show translation");
  await click("Good");

  expect(container.querySelector(".study-word").textContent).toBe("Baum");
  expect(document.body.textContent).toContain("was deleted");
  expect(container.textContent).toContain("1 card left in this session");
});

test("no deck is ticked the first time, so a session cannot start", async () => {
  await show();

  expect(container.querySelector(".study-title").textContent).toBe(
    "Tick a deck to start",
  );
  expect(button("Start session").disabled).toBe(true);
  expect(loadDueCards).not.toHaveBeenCalled();
});

test("the Study box counts the cards of the ticked decks and offers the session", async () => {
  loadDueCards.mockResolvedValue([
    dueCard(1, "Haus"),
    dueCard(2, "Baum", [TRAINS, TRAVEL]),
  ]);
  await show();

  await click("Trains");

  expect(loadDueCards).toHaveBeenLastCalledWith([1]);
  expect(container.querySelector(".study-title").textContent).toBe(
    "2 cards are ready",
  );
  expect(button("Start session").disabled).toBe(false);
  expect(button("Start session").textContent).toContain("about 1 min");
});

test("a session has only the cards of the ticked decks", async () => {
  loadDueCards.mockResolvedValue([dueCard(1, "Haus", [TRAVEL])]);
  await show();

  await click("Travel");
  await click("Start session");

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
    container.querySelectorAll('.dchip[aria-pressed="true"]'),
  ).toHaveLength(1);
});

test("the session has no shuffle option", async () => {
  await show();

  expect(container.textContent).not.toContain("Shuffle");
  expect(container.querySelector("input[type=checkbox]")).toBeNull();
});

test("the Study box has the decks in it, and the Reorder box comes after it", async () => {
  await show();

  const order = [...container.querySelectorAll("section")].map((box) =>
    box.getAttribute("aria-label"),
  );
  expect(order).toEqual(["Study", "Reorder"]);
  expect(
    container.querySelector('section[aria-label="Study"] [aria-label="Decks"]'),
  ).not.toBeNull();
  expect(container.querySelector(".collapse-button")).toBeNull();
});

test("the Study box tells new, forgotten and review cards apart", async () => {
  loadDueCards.mockResolvedValue([
    dueCard(1, "Haus"),
    dueCard(2, "Baum"),
    dueCard(3, "Zug", [TRAINS], "forgotten"),
    dueCard(4, "Bus", [TRAINS], "due"),
    dueCard(5, "Tram", [TRAINS], "due"),
    dueCard(6, "Auto", [TRAINS], "due"),
  ]);
  await show();
  await click("Trains");

  expect(container.querySelector(".study-title").textContent).toBe(
    "6 cards are ready",
  );
  expect(stat("New")).toBe("2");
  expect(stat("Forgotten")).toBe("1");
  expect(stat("Review")).toBe("3");
  expect(container.querySelector(".study-ring-total").textContent).toBe("6");
  expect(button("Start session").textContent).toContain("about 3 min");
});

test("coming back to the page shows the decks and the numbers at once", async () => {
  loadDueCards.mockResolvedValue([dueCard(1, "Haus")]);
  await show();
  await click("Trains");
  await act(async () => root.unmount());
  container.remove();

  loadDecks.mockReturnValue(new Promise(() => {}));
  loadDueCards.mockReturnValue(new Promise(() => {}));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<StudyPage onSessionChange={vi.fn()} />));

  expect(container.querySelector(".study-ring-total").textContent).toBe("1");
  expect(button("Trains")).toBeDefined();
  expect(container.textContent).not.toContain("Loading the decks");
});

test("the Study box greets by the hour and keeps the line for its message", async () => {
  await show();

  expect(container.querySelector(".study-greeting").textContent).toMatch(
    /^Good (morning|afternoon|evening)$/,
  );
  await click("Trains");
  expect(container.querySelector(".study-title").textContent).toBe(
    "Nothing to study today",
  );
});

test("the line of the Study box never says nothing is due while the cards are on their way", async () => {
  await show();
  let arrive;
  loadDueCards.mockReturnValue(new Promise((resolve) => (arrive = resolve)));

  await click("Trains");
  expect(container.querySelector(".study-title").textContent.trim()).toBe("");

  await act(async () => arrive([dueCard(1, "Haus")]));
  expect(container.querySelector(".study-title").textContent).toBe(
    "1 card is ready",
  );
});

test("each deck chip shows how much of the deck is learned", async () => {
  loadDecks.mockResolvedValue([{ ...deck(1, "Trains"), learned_percent: 40 }]);
  await show();

  const progress = container.querySelector(".dchip-progress");
  expect(progress.getAttribute("aria-label")).toBe("40% learned");
  expect(progress.firstChild.style.width).toBe("40%");
});

test("the Study box says so when nothing is due in the ticked decks", async () => {
  await show();
  await click("Trains");

  expect(container.querySelector(".study-title").textContent).toBe(
    "Nothing to study today",
  );
  expect(button("Start session").disabled).toBe(true);
});

test("only a short note is drawn until the decks are loaded", async () => {
  let arrive;
  loadDecks.mockReturnValue(new Promise((resolve) => (arrive = resolve)));
  await show();
  expect(container.textContent).toContain("Loading the decks");
  expect(container.querySelector(".study-hero")).toBeNull();

  await act(async () => arrive([deck(1, "Trains")]));
  expect(container.textContent).not.toContain("Loading the decks");
  expect(container.querySelector(".study-hero")).not.toBeNull();
});

async function startSession(cards = [dueCard(1, "Haus"), dueCard(2, "Baum")]) {
  loadDueCards.mockResolvedValue(cards);
  await click("Trains");
  await click("Start session");
}

test("a session shows no hint text before the translation, and the translation only on request", async () => {
  await show();
  await startSession();

  expect(container.textContent).not.toContain("Do you remember it?");
  expect(container.querySelector(".study-translation")).toBeNull();

  await click("Show translation");
  expect(container.querySelector(".study-translation").textContent).toBe(
    "A sentence.",
  );
});

test("the arrow at the top left leaves the session and goes back to Study", async () => {
  await show();
  await startSession();
  expect(container.querySelector(".study-word")).not.toBeNull();

  await act(async () => container.querySelector(".back-button").click());

  expect(container.querySelector(".study-word")).toBeNull();
  expect(button("Start session")).toBeDefined();
});

test("the page around is told when a session is open and when it ends", async () => {
  const changes = vi.fn();
  await show(changes);
  expect(changes).toHaveBeenLastCalledWith(false);

  await startSession();
  expect(changes).toHaveBeenLastCalledWith(true);

  await act(async () => container.querySelector(".back-button").click());
  expect(changes).toHaveBeenLastCalledWith(false);
});

test("a card can be edited inside the session, which goes on with it", async () => {
  changeCard.mockResolvedValue({
    id: 1,
    sentence: "Das Haus ist groß.",
    translation: "The house is big.",
  });
  await show();
  await startSession();

  await click("Edit");
  const sentence = document.querySelector("textarea");
  await act(async () => {
    const set = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    ).set;
    set.call(sentence, "Das Haus ist groß.");
    sentence.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await click("Save");

  expect(changeCard).toHaveBeenCalledWith(1, {
    sentence: "Das Haus ist groß.",
  });
  expect(container.querySelector(".study-sentence").textContent).toBe(
    "Das Haus ist groß.",
  );
  expect(container.querySelector(".study-word").textContent).toBe("Haus");
  expect(container.textContent).toContain("2 cards left");
  expect(document.querySelector("dialog")).toBeNull();
});

test("a new sentence replaces the old one on the same card, and the translation is hidden again", async () => {
  newSentence.mockResolvedValue({
    id: 1,
    sentence: "Ein anderes Haus.",
    translation: "Another house.",
  });
  await show();
  await startSession();
  await click("Show translation");

  await click("New sentence");

  expect(newSentence).toHaveBeenCalledWith(1);
  expect(container.querySelector(".study-word").textContent).toBe("Haus");
  expect(container.querySelector(".study-sentence").textContent).toBe(
    "Ein anderes Haus.",
  );
  expect(container.querySelector(".study-translation")).toBeNull();
  expect(container.textContent).toContain("2 cards left");
  await click("Show translation");
  expect(container.querySelector(".study-translation").textContent).toBe(
    "Another house.",
  );
});

test("a hidden card leaves the session and does not come back", async () => {
  changeCard.mockResolvedValue({ id: 1, hidden: true });
  await show();
  await startSession();

  await click("Hide");

  expect(changeCard).toHaveBeenCalledWith(1, { hidden: true });
  expect(container.querySelector(".study-word").textContent).toBe("Baum");
  expect(container.textContent).toContain("1 card left");
  await click("Show translation");
  await click("Again");
  expect(container.textContent).not.toContain("Haus");
});
