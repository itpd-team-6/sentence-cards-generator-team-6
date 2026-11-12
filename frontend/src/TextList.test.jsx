import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import TextList from "./TextList.jsx";

// The call is a plain function, not a spy: the test runner keeps its own rejected promise for a spy that fails.
const api = vi.hoisted(() => ({
  loadTexts: () => Promise.resolve([]),
  calls: 0,
}));
vi.mock("./api.js", () => ({
  loadTexts: () => {
    api.calls += 1;
    return api.loadTexts();
  },
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

async function show(props = {}) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<TextList {...props} />));
}

beforeEach(() => {
  api.calls = 0;
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test("each text shows its title, languages, marked words and cards, and links to its page", async () => {
  api.loadTexts = () =>
    Promise.resolve([
      {
        id: 7,
        title: "Das Haus ist alt",
        text_language: "de",
        first_language: "en",
        words: ["Haus", "alt"],
        words_with_cards: ["Haus"],
        cards: 1,
      },
    ]);
  await show();

  const row = container.querySelector(".text-row");
  expect(row.textContent).toContain("Das Haus ist alt");
  expect(row.textContent).toContain("German to English");
  expect(row.textContent).toContain("2 marked words");
  expect(row.textContent).toContain("1 card");
  expect(row.querySelector("a").getAttribute("href")).toBe("#/texts/7");
});

test("the chips show the marked words, the ones without a card with a dashed ring, and say how many more there are", async () => {
  api.loadTexts = () =>
    Promise.resolve([
      {
        id: 3,
        title: "A walk",
        text_language: "en",
        first_language: "ru",
        words: ["stroll", "bench", "pond", "duck", "geese"],
        words_with_cards: ["Stroll", "bench"],
        cards: 2,
      },
    ]);
  await show();

  const chips = [...container.querySelectorAll(".chips li")];
  expect(chips.map((chip) => chip.textContent)).toEqual([
    "stroll",
    "bench",
    "pond (no card yet)",
    "duck (no card yet)",
    "+1",
  ]);
  expect(chips.map((chip) => chip.className)).toEqual([
    "",
    "",
    "pending",
    "pending",
    "more",
  ]);
});

test("the Open button names the text it opens", async () => {
  api.loadTexts = () =>
    Promise.resolve([
      {
        id: 3,
        title: "A walk",
        text_language: "en",
        first_language: "ru",
        words: [],
        words_with_cards: [],
        cards: 0,
      },
    ]);
  await show();

  const open = container.querySelector("a.secondary");
  expect(open.getAttribute("aria-label")).toBe("Open A walk");
  expect(open.getAttribute("href")).toBe("#/texts/3");
});

test("without texts the list says so", async () => {
  api.loadTexts = () => Promise.resolve([]);
  await show();

  expect(container.textContent).toContain("No texts yet");
});

test("the list is not read while the page is hidden", async () => {
  api.loadTexts = () => Promise.resolve([]);
  await show({ active: false });

  expect(api.calls).toBe(0);
});

test("a failed read is told to the learner", async () => {
  api.loadTexts = () => Promise.reject(new Error("down"));
  await show();

  expect(container.querySelector("[role=alert]").textContent).toContain(
    "could not be loaded",
  );
});
