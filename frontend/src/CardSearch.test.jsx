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
const decks = [
  { id: 1, title: "Zugreisen", card_count: 2 },
  { id: 2, title: "Essen", card_count: 5 },
];
const texts = [
  { id: 10, title: "Ich nehme den Zug", cards: 2 },
  { id: 11, title: "Das Haus", cards: 1 },
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
        decks={decks}
        texts={texts}
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

test("the panel says what it found, a section for the cards, the texts and the decks", async () => {
  await show("zug");

  expect(panel()).toContain("4 results");
  expect(container.querySelectorAll(".search-section").length).toBe(3);
  expect(panel()).not.toContain("Essen");
  expect(panel()).not.toContain("Das Haus");
});

test("the part that has the search is marked in the results", async () => {
  await show("zug");

  const marked = [...container.querySelectorAll(".search-panel mark")].map(
    (item) => item.textContent,
  );
  expect(marked.length).toBeGreaterThan(0);
  expect(marked.every((text) => text.toLowerCase() === "zug")).toBe(true);
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

test("a text of the panel is ticked in the side list and the search is cleared", async () => {
  await show("zug");
  const row = [...container.querySelectorAll(".search-row")].find((item) =>
    item.textContent.startsWith("Ich nehme den Zug"),
  );
  await act(async () => row.click());

  expect(changes.at(-1).texts).toEqual([10]);
  expect(changes.at(-1).search).toBe("");
});

test("a deck of the panel is ticked in the side list", async () => {
  await show("zug");
  const row = [...container.querySelectorAll(".search-row")].find((item) =>
    item.textContent.startsWith("Zugreisen"),
  );
  await act(async () => row.click());

  expect(changes.at(-1).decks).toEqual([1]);
});

test("the arrow of a text opens the text", async () => {
  await show("zug");

  expect(container.querySelector(".search-open").getAttribute("href")).toBe(
    "#/texts/10",
  );
});

test("the scope shows only one kind", async () => {
  await show("zug");
  const decksOnly = [
    ...container.querySelectorAll(".search-scope button"),
  ].find((button) => button.textContent === "Decks");
  await act(async () => decksOnly.click());

  expect(container.querySelectorAll(".search-section").length).toBe(1);
  expect(panel()).toContain("Zugreisen");
});

test("a section shows three rows and Show more shows the rest", async () => {
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
        decks={[]}
        texts={[]}
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

const pressEnter = () =>
  act(async () =>
    container
      .querySelector("input")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      ),
  );

test("Enter with a search that no card has ticks the decks that have it, even if it is not complete", async () => {
  await show("zugr");
  await pressEnter();

  expect(changes.at(-1).decks).toEqual([1]);
  expect(changes.at(-1).search).toBe("");
  expect(container.querySelector(".search-panel")).toBeNull();
});

test("Enter with a search that no card and no deck has ticks the texts that have it", async () => {
  await show("hau");
  await pressEnter();

  expect(changes.at(-1).texts).toEqual([11]);
  expect(changes.at(-1).search).toBe("");
});

test("Enter with a search that cards have keeps the search, so the list shows those cards", async () => {
  await show("zug");
  await pressEnter();

  expect(changes).toEqual([]);
  expect(container.querySelector(".search-panel")).toBeNull();
});

test("Enter with the scope on decks ticks the decks that have the search even if cards have it too", async () => {
  await show("zug");
  await act(async () =>
    [...container.querySelectorAll(".search-head button")]
      .find((button) => button.textContent === "Decks")
      .click(),
  );
  await pressEnter();

  expect(changes.at(-1).decks).toEqual([1]);
});
