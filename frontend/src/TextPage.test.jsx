import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import TextPage from "./TextPage.jsx";
import { writeTextDraft } from "./textDraft.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// The page calls the API and the deck list, which these tests are not about.
vi.mock("./api.js", () => ({
  createCards: vi.fn(),
  loadCards: vi.fn(() => Promise.resolve([])),
}));
vi.mock("./DeckPicker.jsx", () => ({ default: () => <p>Deck picker</p> }));
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
