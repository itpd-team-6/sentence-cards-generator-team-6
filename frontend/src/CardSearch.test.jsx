import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import CardSearch from "./CardSearch.jsx";
import { emptyFilters } from "./cardFilters.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const DE_RU = { text_language: "de", first_language: "ru" };
const cards = [
  { id: 1, ...DE_RU, word: "Zug", sentence: "Ich nehme den Zug." },
  { id: 2, ...DE_RU, word: "Zugang", sentence: "Der Zugang ist frei." },
  { id: 3, ...DE_RU, word: "Reise", sentence: "Die Reise war lang." },
];

let container;
let root;
let changes;

async function show(search) {
  changes = [];
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const filters = { ...emptyFilters(), search };
  await act(async () =>
    root.render(
      <CardSearch
        cards={cards}
        filters={filters}
        onChange={(next) => changes.push(next)}
      />,
    ),
  );
  // The panel opens when the learner types or focuses the box.
  await act(async () => container.querySelector("input").focus());
}

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

const panel = () => container.querySelector(".search-panel")?.textContent ?? "";

test("the panel says how many cards it found and lists them, and nothing else", async () => {
  await show("zug");

  expect(panel()).toContain("2 cards");
  expect(container.querySelectorAll(".search-section").length).toBe(1);
  expect(container.querySelectorAll(".search-row").length).toBe(2);
  expect(panel()).not.toContain("Reise");
});

test("the search looks only in cards: no text and no deck is listed, and there is no choice of kind", async () => {
  await show("zug");

  expect(panel()).not.toContain("Texts");
  expect(panel()).not.toContain("Decks");
  expect(container.querySelector(".search-scope")).toBeNull();
  expect(container.querySelector(".search-open")).toBeNull();
});

test("the part that has the search is marked in the results", async () => {
  await show("zug");

  const marked = [...container.querySelectorAll(".search-panel mark")].map(
    (item) => item.textContent,
  );
  expect(marked.length).toBeGreaterThan(0);
  expect(marked.every((text) => text.toLowerCase() === "zug")).toBe(true);
});

test("a card of the panel puts its word in the search", async () => {
  await show("zug");
  const row = [...container.querySelectorAll(".search-row")].find((item) =>
    item.textContent.startsWith("Zugang"),
  );
  await act(async () => row.click());

  expect(changes.at(-1).search).toBe("Zugang");
  expect(container.querySelector(".search-panel")).toBeNull();
});

test("a cross in the box takes the search away", async () => {
  await show("zug");
  await act(async () => container.querySelector(".search-clear").click());

  expect(changes.at(-1).search).toBe("");
});

test("the panel says so when nothing was found", async () => {
  await show("xyz");

  expect(panel()).toContain("Nothing found for “xyz”");
});

test("a word of a text or of a deck is not a result, because only the cards are searched", async () => {
  await show("haus");

  expect(panel()).toContain("Nothing found for “haus”");
});

test("the panel shows three cards and Show more shows the rest", async () => {
  const many = Array.from({ length: 5 }, (_, index) => ({
    id: 100 + index,
    ...DE_RU,
    word: `Zug${index}`,
    sentence: null,
  }));
  changes = [];
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () =>
    root.render(
      <CardSearch
        cards={many}
        filters={{ ...emptyFilters(), search: "zug" }}
        onChange={vi.fn()}
      />,
    ),
  );
  await act(async () => container.querySelector("input").focus());

  expect(container.querySelectorAll(".search-row").length).toBe(3);
  await act(async () => container.querySelector(".search-more").click());
  expect(container.querySelectorAll(".search-row").length).toBe(5);
});

test("Escape closes the panel", async () => {
  await show("zug");
  await act(async () =>
    container
      .querySelector("input")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      ),
  );

  expect(container.querySelector(".search-panel")).toBeNull();
});

test("Enter keeps the search, so the list shows the cards that have it, and closes the panel", async () => {
  await show("zug");
  await act(async () =>
    container
      .querySelector("input")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      ),
  );

  expect(changes).toEqual([]);
  expect(container.querySelector(".search-panel")).toBeNull();
});

test("Enter with a search that no card has ticks no deck and no text", async () => {
  await show("hau");
  await act(async () =>
    container
      .querySelector("input")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      ),
  );

  expect(changes).toEqual([]);
});
