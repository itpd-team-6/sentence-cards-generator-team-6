import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import DecksPage from "./DecksPage.jsx";
import { createDeck, loadDecks, loadDueCards } from "./api.js";

vi.mock("./api.js", async (importOriginal) => ({
  ...(await importOriginal()),
  createDeck: vi.fn(),
  loadDecks: vi.fn(),
  loadDueCards: vi.fn(),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const DE_RU = { text_language: "de", first_language: "ru" };
const deck = (id, title, extra = {}) => ({
  id,
  title,
  ...DE_RU,
  card_count: 4,
  learned_percent: 25,
  uncategorized: false,
  ...extra,
});

let container;
let root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  vi.mocked(loadDecks).mockReset();
  vi.mocked(loadDueCards).mockReset();
  vi.mocked(createDeck).mockReset();
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

const draw = () => act(async () => root.render(<DecksPage />));
const tiles = () => [...container.querySelectorAll(".deck-tile")];

test("each deck is a tile that opens the deck, with its cards to study today, its share learned and its cards", async () => {
  vi.mocked(loadDecks).mockResolvedValue([
    deck(1, "Trains"),
    deck(2, "Travel", { card_count: 1, learned_percent: 0 }),
  ]);
  vi.mocked(loadDueCards).mockResolvedValue([
    { stage: "new", decks: [{ id: 1, title: "Trains" }] },
    { stage: "due", decks: [{ id: 1, title: "Trains" }] },
  ]);
  await draw();

  const [trains, travel] = tiles();
  expect(trains.getAttribute("href")).toBe("#/decks/1");
  expect(trains.querySelector("h4").textContent).toBe("Trains");
  expect(trains.textContent).not.toContain("German → Russian");
  expect(trains.querySelector(".deck-tile-due").textContent).toBe(
    "2to study today",
  );
  expect(trains.querySelector(".deck-tile-meta").textContent).toBe(
    "4 cards25% learned",
  );
  expect(travel.querySelector(".deck-tile-due").textContent).toBe(
    "nothing to study today",
  );
  expect(travel.querySelector(".deck-tile-meta").textContent).toContain(
    "1 card0% learned",
  );
});

test("the deck Uncategorized is a tile like the others, shown after them", async () => {
  vi.mocked(loadDecks).mockResolvedValue([
    deck(5, "Uncategorized", { uncategorized: true }),
    deck(2, "Travel"),
    deck(1, "Animals"),
  ]);
  vi.mocked(loadDueCards).mockResolvedValue([]);
  await draw();

  expect(tiles().map((tile) => tile.querySelector("h4").textContent)).toEqual([
    "Animals",
    "Travel",
    "Uncategorized",
  ]);
});

const EN_RU = { text_language: "en", first_language: "ru" };
const heads = () =>
  [...container.querySelectorAll(".deck-group-head")].map(
    (head) => head.textContent,
  );

test("the decks are in a section for each language pair that has a deck, with the number of decks", async () => {
  vi.mocked(loadDecks).mockResolvedValue([
    deck(1, "Trains"),
    deck(2, "Animals", EN_RU),
    deck(3, "Travel"),
    deck(4, "Uncategorized", { ...EN_RU, uncategorized: true }),
  ]);
  vi.mocked(loadDueCards).mockResolvedValue([]);
  await draw();

  expect(heads()).toEqual([
    "English → Russian2 decks",
    "German → Russian2 decks",
  ]);
  const groups = [...container.querySelectorAll(".deck-group")];
  expect(
    groups.map((group) =>
      [...group.querySelectorAll(".deck-tile h4")].map((h) => h.textContent),
    ),
  ).toEqual([
    ["Animals", "Uncategorized"],
    ["Trains", "Travel"],
  ]);
});

const chips = () => [...container.querySelectorAll(".pair-chip")];

test("the language pairs are buttons that show only the chosen ones, and none chosen shows all", async () => {
  vi.mocked(loadDecks).mockResolvedValue([
    deck(1, "Trains"),
    deck(2, "Animals", EN_RU),
    deck(3, "Food", { text_language: "en", first_language: "de" }),
  ]);
  vi.mocked(loadDueCards).mockResolvedValue([]);
  await draw();

  expect(chips().map((chip) => chip.textContent)).toEqual([
    "EN → DE",
    "EN → RU",
    "DE → RU",
  ]);
  expect(chips()[2].title).toBe("German → Russian");
  expect(
    chips().every((chip) => chip.getAttribute("aria-pressed") === "false"),
  ).toBe(true);

  await act(async () => chips()[0].click());
  expect(heads()).toEqual(["English → German1 deck"]);
  await act(async () => chips()[2].click());
  expect(heads()).toEqual(["English → German1 deck", "German → Russian1 deck"]);
  expect(chips()[0].getAttribute("aria-pressed")).toBe("true");

  await act(async () => chips()[0].click());
  await act(async () => chips()[2].click());
  expect(heads()).toHaveLength(3);
});

test("with one language pair and few decks there is no filter at all", async () => {
  vi.mocked(loadDecks).mockResolvedValue([
    deck(1, "Trains"),
    deck(2, "Travel"),
  ]);
  vi.mocked(loadDueCards).mockResolvedValue([]);
  await draw();

  expect(container.querySelector(".pair-chip")).toBeNull();
  expect(container.querySelector("input[type=search]")).toBeNull();
  expect(heads()).toEqual(["German → Russian2 decks"]);
});

const typeSearch = async (value) => {
  const input = container.querySelector("input[type=search]");
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  ).set;
  await act(async () => {
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

test("from six decks a search by title shows up, and a search with no result can be cleared", async () => {
  vi.mocked(loadDecks).mockResolvedValue(
    ["Trains", "Travel", "Animals", "Food", "Verbs", "Work"].map((title, i) =>
      deck(i + 1, title),
    ),
  );
  vi.mocked(loadDueCards).mockResolvedValue([]);
  await draw();

  await typeSearch("tra");
  expect(tiles().map((tile) => tile.querySelector("h4").textContent)).toEqual([
    "Trains",
    "Travel",
  ]);

  await typeSearch("zzz");
  expect(tiles()).toHaveLength(0);
  expect(container.textContent).toContain("No deck matches");
  await act(async () =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent === "Show all decks")
      .click(),
  );
  expect(tiles()).toHaveLength(6);
  expect(container.querySelector("input[type=search]").value).toBe("");
});

test("without decks it says so, and the product not running is said too", async () => {
  vi.mocked(loadDecks).mockResolvedValue([]);
  vi.mocked(loadDueCards).mockResolvedValue([]);
  await draw();
  expect(container.textContent).toContain("No decks yet");

  await act(async () => root.unmount());
  root = createRoot(container);
  vi.mocked(loadDecks).mockRejectedValue(new Error("down"));
  await draw();
  expect(container.querySelector("[role=alert]").textContent).toContain(
    "could not be loaded",
  );
});

const openForm = async () =>
  act(async () =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent === "New deck")
      .click(),
  );

const typeTitle = async (value) => {
  const input = container.querySelector(".new-deck-form input[type=text]");
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  ).set;
  await act(async () => {
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const pick = (group, language) =>
  act(async () =>
    container.querySelector(`input[name=${group}][value=${language}]`).click(),
  );

test("New deck makes a deck with a title and a language pair chosen with the language buttons, and it shows in the list", async () => {
  vi.mocked(loadDecks).mockResolvedValue([deck(1, "Trains")]);
  vi.mocked(loadDueCards).mockResolvedValue([]);
  vi.mocked(createDeck).mockResolvedValue(
    deck(2, "Food", { card_count: 0, learned_percent: 0 }),
  );
  await draw();

  await openForm();
  const create = container.querySelector(".new-deck-form button[type=submit]");
  expect(create.disabled).toBe(true);

  await typeTitle("Food");
  await pick("new-deck-text-language", "de");
  expect(create.disabled).toBe(true); // the first language is missing
  expect(
    container.querySelector("input[name=new-deck-first-language][value=de]")
      .disabled,
  ).toBe(true); // the same language is not offered twice
  await pick("new-deck-first-language", "ru");
  expect(create.disabled).toBe(false);
  await act(async () => create.click());

  expect(createDeck).toHaveBeenCalledWith("Food", "de", "ru");
  expect(tiles().map((tile) => tile.querySelector("h4").textContent)).toContain(
    "Food",
  );
  expect(container.querySelector(".new-deck-form")).toBeNull();
});

test("a title the product refuses is shown in the form, which stays open", async () => {
  vi.mocked(loadDecks).mockResolvedValue([deck(1, "Trains")]);
  vi.mocked(loadDueCards).mockResolvedValue([]);
  vi.mocked(createDeck).mockRejectedValue(
    new Error("You already have that deck."),
  );
  await draw();
  await openForm();
  await typeTitle("Trains");
  await pick("new-deck-text-language", "de");
  await pick("new-deck-first-language", "ru");
  await act(async () =>
    container.querySelector(".new-deck-form button[type=submit]").click(),
  );

  expect(
    container.querySelector(".new-deck-form [role=alert]").textContent,
  ).toBe("You already have that deck.");
  expect(container.querySelector(".new-deck-form")).not.toBeNull();
});
