import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import TextPage from "./TextPage.jsx";
import { writeTextDraft } from "./textDraft.js";
import { createCards } from "./api.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// The page calls the API and the deck list, which these tests are not about.
vi.mock("./api.js", () => ({
  createCards: vi.fn(),
  loadTextCards: vi.fn(() => Promise.resolve([])),
}));
vi.mock("./DeckPicker.jsx", () => ({
  default: ({ onChange }) => (
    <button type="button" onClick={() => onChange([1])}>
      Tick a deck
    </button>
  ),
}));
vi.mock("./CardsTable.jsx", () => ({ default: () => <p>Cards table</p> }));

let container;
let root;

async function show() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<TextPage />));
}

async function leave() {
  await act(async () => root.unmount());
  container.remove();
}

beforeEach(() => sessionStorage.clear());

afterEach(async () => {
  if (container?.isConnected) await leave();
});

test("the typed text is there again after a reload", async () => {
  await show();
  const box = container.querySelector("textarea");
  await act(async () => {
    const set = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    ).set;
    set.call(box, "Der Zug fährt ab.");
    box.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await leave();

  await show();

  expect(container.querySelector("textarea").value).toBe("Der Zug fährt ab.");
});

test("the marked words and the languages come back after a reload", async () => {
  writeTextDraft({
    text: "Der Zug fährt ab.",
    textLanguage: "de",
    firstLanguage: "en",
    marked: ["zug"],
    selections: [],
  });

  await show();

  const word = [...container.querySelectorAll("button")].find(
    (button) => button.textContent === "Zug",
  );
  expect(word.getAttribute("aria-pressed")).toBe("true");
  const checked = [...container.querySelectorAll("input[type=radio]:checked")];
  expect(checked.map((radio) => radio.value).sort()).toEqual(["de", "en"]);
});

// Fills the form like a learner: the draft has the languages, the text and the marked words, then a deck is ticked.
async function tickADeck() {
  const tick = [...container.querySelectorAll("button")].find(
    (button) => button.textContent === "Tick a deck",
  );
  await act(async () => tick.click());
}

const asking = () =>
  [...container.querySelectorAll("button")].find((button) =>
    button.textContent.startsWith("Ask for sentences"),
  );

test("the message counts only the cards this call made, not the cards the learner already had (issue #212)", async () => {
  writeTextDraft({
    text: "Der Zug fährt zum Bahnhof am Haus.",
    textLanguage: "de",
    firstLanguage: "en",
    marked: ["zug", "bahnhof", "haus"],
    selections: [],
  });
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 5 }) }),
  );
  vi.mocked(createCards).mockResolvedValue({
    // The answer has the three cards of the text, one of them from before.
    cards: [
      { id: 1, word: "Zug", sentence: "Der Zug." },
      { id: 2, word: "Bahnhof", sentence: "Der Bahnhof." },
      { id: 3, word: "Haus", sentence: "Das Haus." },
    ],
    existing: [],
    made: 2,
  });
  await show();
  await tickADeck();

  await act(async () => asking().click());

  expect(document.body.textContent).toContain("Saved text 5 and made 2 cards");
  expect(document.body.textContent).not.toContain("made 3 cards");
});

test("when every marked word already has a card, no card is said to be made and the cards that exist are told", async () => {
  writeTextDraft({
    text: "Der Zug fährt.",
    textLanguage: "de",
    firstLanguage: "en",
    marked: ["zug"],
    selections: [],
  });
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 6 }) }),
  );
  vi.mocked(createCards).mockResolvedValue({
    cards: [{ id: 1, word: "Zug", sentence: "Der Zug." }],
    existing: [{ word: "Zug", phrase: "den Zug nehmen" }],
    made: 0,
  });
  await show();
  await tickADeck();

  await act(async () => asking().click());

  expect(document.body.textContent).not.toContain("made");
  expect(document.body.textContent).toContain(
    'No new card for Zug ("den Zug nehmen")',
  );
});

test("a text over the maximum is not sent, and the message gives the maximum", async () => {
  writeTextDraft({
    text: `Zug ${"a ".repeat(5100)}`,
    textLanguage: "de",
    firstLanguage: "en",
    marked: ["zug"],
    selections: [],
  });
  globalThis.fetch = vi.fn();
  await show();
  await tickADeck();

  expect(container.querySelector(".counter").classList.contains("full")).toBe(
    true,
  );
  await act(async () => asking().click());

  expect(globalThis.fetch).not.toHaveBeenCalled();
  expect(document.body.textContent).toContain(
    "The text can have at most 10,000 characters.",
  );
});
