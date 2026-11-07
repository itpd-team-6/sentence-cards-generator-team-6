import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import DeckPicker from "./DeckPicker.jsx";
import { createDeck, loadDecks } from "./api.js";

vi.mock("./api.js", () => ({
  createDeck: vi.fn(),
  loadDecks: vi.fn(),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const deck = (id, title, card_count = 0, pair = ["de", "en"]) => ({
  id,
  title,
  card_count,
  text_language: pair[0],
  first_language: pair[1],
});

let container;
let root;

async function show(props) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const onChange = vi.fn();
  await act(async () =>
    root.render(
      <DeckPicker
        textLanguage="de"
        firstLanguage="en"
        selected={[]}
        onChange={onChange}
        reload={0}
        {...props}
      />,
    ),
  );
  return onChange;
}

const button = (text) =>
  [...container.querySelectorAll("button")].find((candidate) =>
    candidate.textContent.includes(text),
  );

const type = async (input, value) =>
  act(async () => {
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set;
    setValue.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

beforeEach(() => {
  loadDecks.mockResolvedValue([
    deck(1, "Trains", 3),
    deck(2, "Travel", 1),
    deck(3, "Moscow", 4, ["ru", "en"]),
  ]);
  createDeck.mockReset();
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test("it asks for the languages first", async () => {
  await show({ textLanguage: "" });

  expect(container.textContent).toContain("Choose the text language");
  expect(container.querySelector(".deck-grid")).toBeNull();
});

test("it offers only the decks of the language pair, with their cards, and says how many are hidden", async () => {
  await show();

  const titles = [...container.querySelectorAll(".deck-card-title")].map(
    (title) => title.textContent,
  );
  expect(titles).toEqual(["Trains", "Travel"]);
  expect(container.textContent).toContain("3 cards");
  expect(container.textContent).toContain("1 card");
  expect(container.textContent).toContain(
    "1 deck hidden: different language pair",
  );
});

test("ticking a deck adds it to the chosen decks, and unticking removes it", async () => {
  const onChange = await show({ selected: [2] });

  await act(async () => button("Trains").click());
  expect(onChange).toHaveBeenLastCalledWith([2, 1]);

  await act(async () => button("Travel").click());
  expect(onChange).toHaveBeenLastCalledWith([]);
});

test("a ticked deck says so to a screen reader", async () => {
  await show({ selected: [1] });

  expect(button("Trains").getAttribute("aria-checked")).toBe("true");
  expect(button("Travel").getAttribute("aria-checked")).toBe("false");
});

test("a new deck is made for the language pair, ticked, and the form closes", async () => {
  createDeck.mockResolvedValue(deck(4, "Food"));
  const onChange = await show({ selected: [1] });
  await act(async () => button("+ New deck").click());
  expect(container.textContent).toContain("German to English");

  await type(container.querySelector(".deck-form input"), "Food");
  await act(async () => button("Create deck").click());

  expect(createDeck).toHaveBeenCalledWith("Food", "de", "en");
  expect(onChange).toHaveBeenLastCalledWith([1, 4]);
  expect(container.querySelector(".deck-form")).toBeNull();
  expect(container.textContent).toContain("Food");
});

test("the button to create a deck waits for a title, and Cancel closes the form", async () => {
  await show();
  await act(async () => button("+ New deck").click());

  expect(button("Create deck").disabled).toBe(true);

  await act(async () => button("Cancel").click());
  expect(container.querySelector(".deck-form")).toBeNull();
});

test("a title the product refuses is shown and nothing is ticked", async () => {
  createDeck.mockRejectedValue(
    new Error("There is already a deck with this title for these languages."),
  );
  const onChange = await show();
  await act(async () => button("+ New deck").click());
  await type(container.querySelector(".deck-form input"), "Trains");

  await act(async () => button("Create deck").click());

  expect(onChange).not.toHaveBeenCalled();
  expect(document.body.textContent).toContain("already a deck");
});

test("with many decks there is a search box", async () => {
  loadDecks.mockResolvedValue(
    Array.from({ length: 13 }, (_, number) =>
      deck(number + 1, `Deck ${number + 1}`),
    ),
  );
  await show();

  expect(container.querySelector(".deck-search input")).not.toBeNull();
  await type(container.querySelector(".deck-search input"), "deck 13");
  const titles = [...container.querySelectorAll(".deck-card-title")];
  expect(titles.map((title) => title.textContent)).toEqual(["Deck 13"]);
});
