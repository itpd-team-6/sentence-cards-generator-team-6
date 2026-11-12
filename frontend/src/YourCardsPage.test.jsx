import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import YourCardsPage from "./YourCardsPage.jsx";

// The calls are plain functions, not spies: the test runner keeps its own rejected promise for a spy that fails.
const api = vi.hoisted(() => ({
  loadCards: () => Promise.resolve([]),
  loadDecks: () => Promise.resolve([]),
  loadTexts: () => Promise.resolve([]),
}));
vi.mock("./api.js", () => ({
  loadCards: () => api.loadCards(),
  loadDecks: () => api.loadDecks(),
  loadTexts: () => api.loadTexts(),
}));
vi.mock("./CardsTable.jsx", () => ({
  default: ({
    groups,
    cards,
    title = "Your cards",
    toolbar,
    emptyMessage,
    onCardsChange,
  }) => (
    <div>
      {toolbar}
      {groups?.map((group) => (
        <p key={group.key} className="group-title">
          {group.title}
          {group.cards.length}
        </p>
      ))}
      <p data-testid="count">
        {title}: {cards.length}
      </p>
      <p data-testid="words">{cards.map((card) => card.word).join(",")}</p>
      {cards.length === 0 && <p>{emptyMessage}</p>}
      <button type="button" onClick={() => onCardsChange(cards.slice(1))}>
        delete the first
      </button>
    </div>
  ),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

const DE_RU = { text_language: "de", first_language: "ru" };
const deck = { id: 1, title: "Deck A" };
const other = { id: 2, title: "Deck B" };
const text = { id: 10, title: "Text X" };
const CARDS = [
  {
    id: 1,
    ...DE_RU,
    word: "Zug",
    sentence: "Ich nehme den Zug.",
    decks: [deck],
    texts: [text],
  },
  {
    id: 2,
    ...DE_RU,
    word: "fahren",
    sentence: "Wir fahren.",
    decks: [other],
    texts: [],
  },
  { id: 3, ...DE_RU, word: "Reise", sentence: null, decks: [], texts: [] },
];

async function show() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<YourCardsPage />));
}

async function unmount() {
  await act(async () => root.unmount());
  container.remove();
}

const words = () => container.querySelector("[data-testid=words]").textContent;
const groupsOf = () =>
  [...container.querySelectorAll(".group-title")].map(
    (item) => item.textContent,
  );
const count = () => container.querySelector("[data-testid=count]").textContent;

async function tick(label) {
  const box = [...container.querySelectorAll(".filter-item")]
    .find((item) => item.textContent.startsWith(label))
    .querySelector("input");
  await act(async () => box.click());
}

async function type(value) {
  const input = container.querySelector(".cards-search");
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

const press = (label) =>
  act(async () =>
    [...container.querySelectorAll("button")]
      .find((button) => button.textContent === label)
      .click(),
  );

beforeEach(() => {
  sessionStorage.clear();
  api.loadCards = () => Promise.resolve(CARDS);
  api.loadDecks = () => Promise.resolve([deck, other]);
  api.loadTexts = () => Promise.resolve([text]);
});

afterEach(unmount);

test("the page shows all the cards in the table", async () => {
  await show();

  expect(count()).toBe("Your cards: 3");
});

test("without cards the page says where they come from", async () => {
  api.loadCards = () => Promise.resolve([]);
  await show();

  expect(container.textContent).toContain("No cards yet");
});

test("a failed read is told to the learner", async () => {
  api.loadCards = () => Promise.reject(new Error("down"));
  await show();

  expect(container.querySelector("[role=alert]").textContent).toContain(
    "could not be loaded",
  );
});

test("the side list shows each deck and text with its number of cards, and the item for cards in no deck", async () => {
  await show();

  const items = [...container.querySelectorAll(".filter-item")].map(
    (item) => item.textContent,
  );
  expect(items).toContain("Deck A1");
  expect(items).toContain("Deck B1");
  expect(items).toContain("Text X1");
  expect(items).toContain("Uncategorized1");
});

test("the item All cards is chosen while nothing is ticked, and a click on it clears the filters", async () => {
  await show();
  const all = () => container.querySelector(".filter-all");
  expect(all().getAttribute("aria-pressed")).toBe("true");

  await tick("Deck A");
  expect(all().getAttribute("aria-pressed")).toBe("false");
  await act(async () => all().click());

  expect(all().getAttribute("aria-pressed")).toBe("true");
  expect(container.querySelector(".filter-chip")).toBeNull();
});

test("the item for cards in no deck stays in the list while the learner ticks, so the items under it do not move", async () => {
  await show();
  await tick("Text X");

  const items = [...container.querySelectorAll(".filter-item")].map(
    (item) => item.textContent,
  );
  expect(items).toContain("Uncategorized0");
});

test("the statuses are always in the side list, without a toggle to open them", async () => {
  await show();

  const items = [...container.querySelectorAll(".filter-item")].map(
    (item) => item.textContent,
  );
  expect(items.some((item) => item.startsWith("Hidden from study"))).toBe(true);
  expect(container.querySelector("details")).toBeNull();
});

test("ticking a deck lists only its cards, and a sentence says what is filtered", async () => {
  await show();
  await tick("Deck A");

  expect(words()).toBe("Zug");
  expect(container.querySelector(".filter-sentence").textContent).toContain(
    "1 card in Deck A",
  );
});

test("ticking two decks offers any and all", async () => {
  await show();
  await tick("Deck A");
  expect(container.querySelector(".filter-part .filter-mode")).toBeNull();
  await tick("Deck B");

  expect(words()).toBe("fahren,Zug");
  await press("All");
  expect(words()).toBe("");
});

test("a search lists the cards that have it, whatever the case of the letters", async () => {
  await show();
  await type("ZUG");

  expect(words()).toBe("Zug");
});

test("the search and the ticked items are chips, and Clear takes them all away", async () => {
  await show();
  await tick("Deck A");
  await type("zug");

  const chips = [...container.querySelectorAll(".filter-chip")].map(
    (chip) => chip.textContent,
  );
  expect(chips).toEqual(["Deck A×", "Search: zug×"]);
  await press("Clear");
  expect(count()).toBe("Your cards: 3");
  expect(container.querySelector(".filter-chip")).toBeNull();
});

test("a filter that lists no card says so", async () => {
  await show();
  await type("nothing like this");

  expect(container.textContent).toContain("No card has all of this");
});

test("with exactly one text ticked the page offers to open it", async () => {
  await show();
  expect(container.querySelector(".filter-open")).toBeNull();
  await tick("Text X");

  expect(container.querySelector(".filter-open").getAttribute("href")).toBe(
    "#/texts/10",
  );
});

test("the filters are still there when the learner comes back to the page", async () => {
  await show();
  await tick("Deck A");
  await type("zug");
  await unmount();
  await show();

  expect(words()).toBe("Zug");
  expect(container.querySelector(".cards-search").value).toBe("zug");
});

test("the phone button counts the ticked items and opens the filters", async () => {
  await show();
  await tick("Deck A");
  await tick("Text X");

  const button = container.querySelector(".filters-toggle");
  expect(button.textContent).toBe("Filters2");
  await act(async () => button.click());
  expect(container.querySelector(".cards-filters").className).toContain("open");
});

test("a card the table removes goes away from all the cards and the others stay", async () => {
  await show();
  await tick("Deck B");
  await press("delete the first");
  await press("Clear");

  expect(words()).toBe("Reise,Zug");
});

test("the cards are listed with the newest first, and the learner can sort them oldest first or from A to Z", async () => {
  await show();
  expect(words()).toBe("Reise,fahren,Zug");

  const choose = async (name) => {
    await act(async () => container.querySelector(".sort-button").click());
    await act(async () =>
      [...container.querySelectorAll("[role=menuitemradio]")]
        .find((item) => item.textContent === name)
        .click(),
    );
  };
  await choose("Oldest first");
  expect(words()).toBe("Zug,fahren,Reise");
  expect(container.querySelector(".sort-current").textContent).toBe(
    "Oldest first",
  );
  await choose("A to Z");
  expect(words()).toBe("fahren,Reise,Zug");
});

test("the learner can group the cards by deck, and the choice is kept when the learner comes back", async () => {
  await show();
  await press("Deck");

  expect(groupsOf()).toEqual(["Deck A1", "Deck B1", "Uncategorized1"]);
  await unmount();
  await show();

  expect(groupsOf()).toEqual(["Deck A1", "Deck B1", "Uncategorized1"]);
});

test("the sort menu is our own list, and Escape closes it", async () => {
  await show();
  await act(async () => container.querySelector(".sort-button").click());
  expect(container.querySelector("select")).toBeNull();
  expect(container.querySelectorAll("[role=menuitemradio]").length).toBe(3);
  await act(async () =>
    container
      .querySelector(".sort-menu")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      ),
  );

  expect(container.querySelector("[role=menu]")).toBeNull();
});
