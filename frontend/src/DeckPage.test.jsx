import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import DeckPage from "./DeckPage.jsx";
import {
  changeCardDecks,
  deleteDeck,
  loadCards,
  loadDeck,
  loadDecks,
  loadDueCards,
  renameDeck,
} from "./api.js";
import { readTickedDecks, takeStartNow } from "./deckSelection.js";

vi.mock("./api.js", async (importOriginal) => ({
  ...(await importOriginal()),
  changeCardDecks: vi.fn(),
  deleteDeck: vi.fn(),
  loadCards: vi.fn(),
  loadDeck: vi.fn(),
  loadDecks: vi.fn(),
  loadDueCards: vi.fn(),
  renameDeck: vi.fn(),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const DE_RU = { text_language: "de", first_language: "ru" };
const TRAINS = { id: 1, title: "Trains" };
const TRAVEL = { id: 2, title: "Travel" };
const UNCATEGORIZED = { id: 3, title: "Uncategorized" };
const card = (id, word, decks) => ({
  id,
  ...DE_RU,
  word,
  sentence: `Ein Satz mit ${word}.`,
  translation: "x",
  decks,
  texts: [],
});
const CARDS = [
  card(1, "Zug", [TRAINS]),
  card(2, "Gleis", [TRAINS, TRAVEL]),
  card(3, "Reise", [TRAVEL]),
  card(4, "Haus", [UNCATEGORIZED]),
];
const detail = (extra = {}) => ({
  ...TRAINS,
  ...DE_RU,
  card_count: 2,
  learned_percent: 50,
  uncategorized: false,
  cards_only_here: 1,
  cards_elsewhere: 1,
  ...extra,
});

let container;
let root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  for (const call of [
    changeCardDecks,
    deleteDeck,
    loadCards,
    loadDeck,
    loadDecks,
    loadDueCards,
    renameDeck,
  ]) {
    vi.mocked(call).mockReset();
  }
  vi.mocked(loadDeck).mockResolvedValue(detail());
  vi.mocked(loadDecks).mockResolvedValue([detail()]);
  vi.mocked(loadCards).mockResolvedValue(CARDS);
  vi.mocked(loadDueCards).mockResolvedValue([
    { stage: "new", decks: [TRAINS] },
    { stage: "forgotten", decks: [TRAINS, TRAVEL] },
  ]);
  window.location.hash = "";
  localStorage.clear();
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

const draw = (deckId = 1) =>
  act(async () => root.render(<DeckPage deckId={deckId} />));
const button = (name) =>
  [...container.querySelectorAll("button")].find(
    (item) => item.textContent === name,
  );
// The table has a box of its own for deleting cards, so each box is found by its title.
const dialogWith = (title) =>
  [...container.querySelectorAll("dialog")].find((box) =>
    box.querySelector("h3")?.textContent.includes(title),
  );
const click = (element) => act(async () => element.click());
const type = async (element, value) => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  ).set;
  await act(async () => {
    setter.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

test("the page shows the deck, what is to study in it today, and only the cards that are in it", async () => {
  await draw();

  expect(loadDueCards).toHaveBeenCalledWith([1]);
  expect(container.querySelector(".back-link").getAttribute("href")).toBe(
    "#/decks",
  );
  expect(container.querySelector("h2").textContent).toBe("Trains");
  expect(container.querySelector(".deck-sub").textContent).toBe(
    "2 cards · 50% learned · about 1 min today",
  );
  expect(
    [...container.querySelectorAll(".deck-stats li")].map(
      (item) => item.textContent,
    ),
  ).toEqual(["1New", "1Forgotten", "0Review"]);
  expect(
    [...container.querySelectorAll(".card-word")]
      .map((word) => word.textContent)
      .sort(),
  ).toEqual(["Gleis", "Zug"]);
});

test("Study this deck ticks only this deck and asks the Study page to start the session at once", async () => {
  await draw();

  const study = button("Study this deck · 2 cards");
  await click(study);
  expect(readTickedDecks()).toEqual([1]);
  expect(takeStartNow()).toBe("#/decks/1");
  expect(window.location.hash).toBe("#/study");
});

test("a deck with nothing due says so and has no stats", async () => {
  vi.mocked(loadDueCards).mockResolvedValue([]);
  await draw();

  expect(container.querySelector(".deck-stats")).toBeNull();
  expect(container.textContent).toContain(
    "Nothing to study in this deck today.",
  );
});

test("a search narrows the cards of the deck", async () => {
  await draw();

  await type(container.querySelector(".deck-search-input"), "gleis");

  expect(
    [...container.querySelectorAll(".card-word")].map(
      (word) => word.textContent,
    ),
  ).toEqual(["Gleis"]);
});

test("a deck that does not exist says so", async () => {
  const gone = new Error("There is no deck with id 9.");
  gone.status = 404;
  vi.mocked(loadDeck).mockRejectedValue(gone);
  await draw(9);

  expect(container.querySelector("[role=alert]").textContent).toContain(
    "does not exist",
  );
});

test("Rename turns the title into a field in place, Save changes it, and a title the product refuses is shown", async () => {
  vi.mocked(renameDeck).mockRejectedValueOnce(
    new Error("You already have a deck with that title."),
  );
  await draw();

  await click(button("Rename"));
  const field = container.querySelector(".deck-rename input");
  expect(field.value).toBe("Trains");
  expect(container.querySelector("dialog[open] .deck-rename")).toBeNull(); // no box: the field is in the page
  await type(field, "Travel");
  await click(button("Save"));
  expect(container.querySelector("[role=alert]").textContent).toBe(
    "You already have a deck with that title.",
  );

  vi.mocked(renameDeck).mockResolvedValueOnce({
    ...TRAINS,
    title: "Long trips",
  });
  await type(container.querySelector(".deck-rename input"), "Long trips");
  await click(button("Save"));
  expect(renameDeck).toHaveBeenLastCalledWith(1, "Long trips");
  expect(container.querySelector("h2").textContent).toBe("Long trips");
  expect(container.querySelector(".deck-rename")).toBeNull();
});

test("Cancel leaves the title as it was", async () => {
  await draw();

  await click(button("Rename"));
  await type(container.querySelector(".deck-rename input"), "Other");
  await click(button("Cancel"));

  expect(renameDeck).not.toHaveBeenCalled();
  expect(container.querySelector("h2").textContent).toBe("Trains");
});

test("the deck Uncategorized cannot be renamed and cards are not added to it by hand", async () => {
  vi.mocked(loadDeck).mockResolvedValue(
    detail({
      ...UNCATEGORIZED,
      uncategorized: true,
      card_count: 1,
      cards_only_here: 1,
      cards_elsewhere: 0,
    }),
  );
  await draw(3);

  expect(container.querySelector("h2").textContent).toBe("Uncategorized");
  expect(button("Rename")).toBeUndefined();
  expect(button("Add cards")).toBeUndefined();
  expect(button("Delete deck")).toBeDefined();
});

test("deleting says how many cards are only in the deck and how many are also elsewhere, and keeps them in Uncategorized by default", async () => {
  vi.mocked(deleteDeck).mockResolvedValue(null);
  await draw();

  await click(button("Delete deck"));
  const box = dialogWith("Delete the deck");
  expect(box.textContent).toContain(
    "1 of its 2 cards is only in this deck, and 1 is also in another deck.",
  );
  expect(box.textContent).toContain(
    "The cards that are in another deck are not deleted.",
  );
  const [keep, remove] = box.querySelectorAll("input[type=radio]");
  expect(keep.checked).toBe(true);
  expect(remove.checked).toBe(false);

  await click(box.querySelector("button[type=submit]"));
  expect(deleteDeck).toHaveBeenCalledWith(1, "keep");
  expect(window.location.hash).toBe("#/decks");
});

test("the learner can choose to delete the cards that are only in the deck", async () => {
  vi.mocked(deleteDeck).mockResolvedValue(null);
  await draw();

  await click(button("Delete deck"));
  const box = dialogWith("Delete the deck");
  await click(box.querySelectorAll("input[type=radio]")[1]);
  await click(box.querySelector("button[type=submit]"));

  expect(deleteDeck).toHaveBeenCalledWith(1, "delete");
});

test("a deck whose cards are all in other decks is deleted with no choice, and no card is deleted", async () => {
  vi.mocked(loadDeck).mockResolvedValue(
    detail({ cards_only_here: 0, cards_elsewhere: 2 }),
  );
  vi.mocked(deleteDeck).mockResolvedValue(null);
  await draw();

  await click(button("Delete deck"));
  const box = dialogWith("Delete the deck");
  expect(box.querySelector("input[type=radio]")).toBeNull();
  expect(box.textContent).toContain("2 are also in another deck");
  await click(box.querySelector("button[type=submit]"));

  expect(deleteDeck).toHaveBeenCalledWith(1, null);
});

test("the deck Uncategorized is only deleted together with its cards", async () => {
  vi.mocked(loadDeck).mockResolvedValue(
    detail({
      ...UNCATEGORIZED,
      uncategorized: true,
      card_count: 1,
      cards_only_here: 1,
      cards_elsewhere: 0,
    }),
  );
  vi.mocked(deleteDeck).mockResolvedValue(null);
  await draw(3);

  await click(button("Delete deck"));
  const box = dialogWith("Delete the deck");
  expect(box.querySelector("input[type=radio]")).toBeNull();
  expect(box.textContent).toContain("only be deleted together with its cards");
  await click(box.querySelector("button[type=submit]"));

  expect(deleteDeck).toHaveBeenCalledWith(3, "delete");
});

test("when the product refuses to delete, the box stays open with the reason and the learner stays on the deck", async () => {
  vi.mocked(deleteDeck).mockRejectedValue(
    new Error("The request failed. Try again."),
  );
  await draw();

  await click(button("Delete deck"));
  const box = dialogWith("Delete the deck");
  await click(box.querySelector("button[type=submit]"));

  expect(box.querySelector("[role=alert]").textContent).toBe(
    "The request failed. Try again.",
  );
  expect(window.location.hash).toBe("");
});

test("Add cards offers the cards of the language pair that are not in the deck, and puts the chosen ones in it", async () => {
  vi.mocked(changeCardDecks).mockResolvedValue([
    card(3, "Reise", [TRAVEL, TRAINS]),
  ]);
  await draw();

  await click(button("Add cards"));
  const box = dialogWith("Add cards to");
  expect(
    [...box.querySelectorAll(".filter-name")].map((name) => name.textContent),
  ).toEqual(["Reise", "Haus"]);
  await click(box.querySelector("input[type=checkbox]"));
  await click(box.querySelector("button[type=submit]"));

  expect(changeCardDecks).toHaveBeenCalledWith([3], [1], []);
  expect(
    [...container.querySelectorAll(".card-word")]
      .map((word) => word.textContent)
      .sort(),
  ).toEqual(["Gleis", "Reise", "Zug"]);
});
