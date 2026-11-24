import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import YourCardsPage from "./YourCardsPage.jsx";

// The archived texts and the filters of "Your cards" (DEC-075). The calls are plain functions, like in the other tests of the
// page.
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
  default: ({ cards }) => (
    <p data-testid="words">{cards.map((card) => card.word).join(",")}</p>
  ),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

const DE_RU = { text_language: "de", first_language: "ru" };
const active = { id: 10, title: "Active text", archived: false };
const archived = { id: 11, title: "Old text", archived: true };
const CARDS = [
  {
    id: 1,
    ...DE_RU,
    word: "Zug",
    sentence: "Ich nehme den Zug.",
    decks: [],
    texts: [{ id: 10, title: active.title }],
  },
  {
    id: 2,
    ...DE_RU,
    word: "Reise",
    sentence: "Die Reise beginnt.",
    decks: [],
    texts: [{ id: 11, title: archived.title }],
  },
];

async function show() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<YourCardsPage />));
}

const words = () => container.querySelector("[data-testid=words]").textContent;
const items = () =>
  [...container.querySelectorAll(".filter-item")].map(
    (item) => item.textContent,
  );

beforeEach(() => {
  sessionStorage.clear();
  api.loadCards = () => Promise.resolve(CARDS);
  api.loadDecks = () => Promise.resolve([]);
  api.loadTexts = () => Promise.resolve([active, archived]);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test("an archived text is not in the list of texts of the filters", async () => {
  await show();

  expect(items()).toContain("Active text1");
  expect(items().some((item) => item.startsWith("Old text"))).toBe(false);
});

test("the status Archived text lists the cards of the archived texts", async () => {
  await show();
  const box = [...container.querySelectorAll(".filter-item")]
    .find((item) => item.textContent.startsWith("Archived text1"))
    .querySelector("input");
  await act(async () => box.click());

  expect(words()).toBe("Reise");
});

test("the status Archived text is not in the list while no text is archived", async () => {
  api.loadTexts = () =>
    Promise.resolve([active, { ...archived, archived: false }]);
  await show();

  expect(items().some((item) => item.startsWith("Archived text1"))).toBe(false);
});
