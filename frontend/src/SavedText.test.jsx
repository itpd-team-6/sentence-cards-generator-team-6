import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import SavedText from "./SavedText.jsx";
import {
  changeText,
  createCards,
  deleteText,
  loadText,
  loadTextCards,
} from "./api.js";

vi.mock("./api.js", () => ({
  changeText: vi.fn(),
  createCards: vi.fn(),
  deleteText: vi.fn(),
  loadText: vi.fn(),
  loadTextCards: vi.fn(),
}));
vi.mock("./DeckPicker.jsx", () => ({
  default: ({ onChange }) => (
    <button type="button" onClick={() => onChange([1])}>
      Tick a deck
    </button>
  ),
}));
vi.mock("./CardsTable.jsx", () => ({
  default: ({ cards }) => <p>Cards table: {cards.length}</p>,
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// A call that fails, as a call to a product that is not running does. It is a thenable, not a promise, so the test runner
// does not keep a rejected promise of its own for the call.
const failing = () => ({
  then: (onFulfilled, onRejected) =>
    Promise.reject(new Error("down")).then(onFulfilled, onRejected),
});

const saved = (changes = {}) => ({
  id: 7,
  title: "Das Haus ist alt",
  text: "Das Haus ist alt und groß.",
  text_language: "de",
  first_language: "en",
  words: ["Haus", "alt"],
  words_with_cards: ["Haus"],
  marks: [
    {
      word: "Haus",
      card: { id: 1, sentence: "Das Haus ist alt.", translation: "The house." },
    },
    { word: "alt", card: null },
  ],
  cards: 1,
  ...changes,
});

let container;
let root;

async function show() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<SavedText textId={7} />));
}

const button = (name) =>
  [...container.querySelectorAll("button")].find((item) =>
    item.textContent.startsWith(name),
  );
const word = (name) =>
  [...container.querySelectorAll("button.word")].find(
    (item) => item.textContent === name,
  );
const everything = () => document.body.textContent;
const click = (element) => act(async () => element.click());

// React tracks the value of a field, so a change is made through the setter the browser has.
async function type(element, value) {
  const prototype = Object.getPrototypeOf(element);
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, "value").set.call(
      element,
      value,
    );
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

beforeEach(() => {
  for (const mock of [
    changeText,
    createCards,
    deleteText,
    loadText,
    loadTextCards,
  ])
    vi.mocked(mock).mockReset();
  vi.mocked(loadText).mockResolvedValue(saved());
  vi.mocked(loadTextCards).mockResolvedValue([{ id: 1, word: "Haus" }]);
  window.location.hash = "#/texts/7";
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test("the saved text opens with its title, its languages, its marked words and its cards", async () => {
  await show();

  expect(container.querySelector("input[type=text]").value).toBe(
    "Das Haus ist alt",
  );
  expect(container.querySelector(".pair").textContent).toBe("German → English");
  expect(container.querySelector("h2").textContent).toBe("Edit text");
  expect(container.textContent).toContain("Marked words (2)");
  expect(container.textContent).toContain("Cards table: 1");
  expect(container.textContent).toContain("1 marked word has no card yet.");
  expect(button("Save changes").disabled).toBe(true);
});

test("a marked word without a card has a dashed chip that says so", async () => {
  await show();

  const chips = [...container.querySelectorAll(".chips li")];
  expect(chips.map((chip) => chip.textContent)).toEqual([
    "Haus",
    "alt (no card yet)",
  ]);
  expect(chips[0].getAttribute("title")).toBe("Das Haus ist alt.");
  expect(chips[1].getAttribute("title")).toBeNull();
  expect(chips[0].classList.contains("pending")).toBe(false);
  expect(chips[1].classList.contains("pending")).toBe(true);
});

test("the count of characters is next to the text, and it is red when the text reaches the maximum", async () => {
  await show();
  expect(container.querySelector(".counter").textContent).toBe("26 / 10,000");
  expect(container.querySelector(".counter").classList.contains("full")).toBe(
    false,
  );
  expect(container.textContent).not.toContain("At most 10,000");

  await type(container.querySelector("textarea"), "a".repeat(10000));
  expect(container.querySelector(".counter").textContent).toBe(
    "10,000 / 10,000",
  );
  expect(container.querySelector(".counter").classList.contains("full")).toBe(
    true,
  );
});

test("a text over the maximum is not saved, and the message gives the maximum", async () => {
  await show();

  await type(container.querySelector("textarea"), "a".repeat(10001));
  await click(button("Save changes"));

  expect(changeText).not.toHaveBeenCalled();
  expect(everything()).toContain(
    "The text can have at most 10,000 characters.",
  );
});

test("a mark without a card is drawn differently from a mark with one", async () => {
  await show();

  expect(word("Haus").classList.contains("pending")).toBe(false);
  expect(word("alt").classList.contains("pending")).toBe(true);
});

test("taking a mark away changes nothing until the learner saves, and then only the mark goes", async () => {
  vi.mocked(changeText).mockResolvedValue({
    ...saved({ words: ["Haus"] }),
    lost_marks: [],
  });
  await show();

  await click(word("alt"));
  expect(container.textContent).toContain("Unsaved changes");
  expect(changeText).not.toHaveBeenCalled();

  await click(button("Save changes"));
  expect(changeText).toHaveBeenCalledWith(7, { words: ["Haus"] });
  expect(everything()).toContain("Saved.");
  expect(container.textContent).not.toContain("Unsaved changes");
});

test("a card whose mark was taken away leaves the cards of this text when the learner saves", async () => {
  vi.mocked(changeText).mockResolvedValue({
    ...saved({ words: ["alt"], words_with_cards: [] }),
    lost_marks: [],
  });
  await show();
  expect(container.textContent).toContain("Cards table: 1");

  vi.mocked(loadTextCards).mockResolvedValue([]);
  await click(word("Haus"));
  expect(container.textContent).toContain("Cards table: 1");

  await click(button("Save changes"));
  expect(container.textContent).not.toContain("Cards table: 1");
});

test("a new title is saved alone", async () => {
  vi.mocked(changeText).mockResolvedValue({
    ...saved({ title: "My text" }),
    lost_marks: [],
  });
  await show();

  await type(container.querySelector("input[type=text]"), "My text");
  await click(button("Save changes"));

  expect(changeText).toHaveBeenCalledWith(7, { title: "My text" });
});

test("an empty title is not sent", async () => {
  await show();

  await type(container.querySelector("input[type=text]"), "  ");
  await click(button("Save changes"));

  expect(changeText).not.toHaveBeenCalled();
  expect(everything()).toContain("Write a title");
});

test("a mark whose word the edited text no longer has waits as lost and goes when the text is saved", async () => {
  vi.mocked(changeText).mockResolvedValue({
    ...saved({ text: "Das Haus ist groß.", words: ["Haus"] }),
    lost_marks: ["alt"],
  });
  await show();

  await type(container.querySelector("textarea"), "Das Haus ist groß.");
  expect(container.textContent).toContain("The text no longer has alt");
  expect(container.textContent).toContain("Marked words (1)");

  await click(button("Save changes"));
  expect(changeText).toHaveBeenCalledWith(7, {
    text: "Das Haus ist groß.",
    words: ["Haus"],
  });
  expect(everything()).toContain("so its mark was taken away");
});

test("making cards saves the changes first and then makes the cards in the ticked decks", async () => {
  vi.mocked(changeText).mockResolvedValue({
    ...saved({ title: "My text" }),
    lost_marks: [],
  });
  vi.mocked(createCards).mockResolvedValue({
    cards: [
      { id: 1, sentence: "Das Haus." },
      { id: 2, sentence: "Ein alter Mann." },
    ],
    existing: [],
    made: 1,
  });
  await show();

  expect(button("Make cards for 1 new word").disabled).toBe(true);
  await click(button("Tick a deck"));
  await type(container.querySelector("input[type=text]"), "My text");
  await click(button("Make cards for 1 new word"));

  expect(changeText).toHaveBeenCalledWith(7, { title: "My text" });
  expect(createCards).toHaveBeenCalledWith(7, [1]);
  expect(changeText.mock.invocationCallOrder[0]).toBeLessThan(
    createCards.mock.invocationCallOrder[0],
  );
  expect(everything()).toContain("Made 1 card in 1 deck.");
});

test("a text is deleted only after the learner confirms, and its cards are said to stay", async () => {
  vi.mocked(deleteText).mockResolvedValue(null);
  await show();

  await click(button("Delete text"));
  expect(deleteText).not.toHaveBeenCalled();
  expect(container.querySelector(".delete-box").textContent).toContain(
    "Its 1 card, their decks and your progress stay.",
  );

  await click(container.querySelector(".delete-box .primary"));
  expect(deleteText).toHaveBeenCalledWith(7);
  expect(window.location.hash).toBe("#/texts");
});

test("a text that does not exist says so", async () => {
  vi.mocked(loadText).mockImplementation(failing);
  await show();

  expect(container.querySelector("[role=alert]").textContent).toContain(
    "could not be opened",
  );
});
