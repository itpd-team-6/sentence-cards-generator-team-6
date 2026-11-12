import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import CardDecksDialog from "./CardDecksDialog.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const DE_RU = { text_language: "de", first_language: "ru" };
const trains = { id: 1, title: "Trains", ...DE_RU };
const travel = { id: 2, title: "Travel", ...DE_RU };
const english = {
  id: 3,
  title: "English",
  text_language: "en",
  first_language: "de",
};
const decks = [trains, travel, english];

const inTrains = {
  id: 1,
  ...DE_RU,
  word: "Zug",
  decks: [{ id: 1, title: "Trains" }],
};
const inBoth = {
  id: 2,
  ...DE_RU,
  word: "Reise",
  decks: [
    { id: 1, title: "Trains" },
    { id: 2, title: "Travel" },
  ],
};

let container;
let root;

async function show(cards, props = {}) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const onSave = vi.fn();
  const onCancel = vi.fn();
  await act(async () =>
    root.render(
      <CardDecksDialog
        cards={cards}
        decks={decks}
        onSave={onSave}
        onCancel={onCancel}
        {...props}
      />,
    ),
  );
  return { onSave, onCancel };
}

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

const box = (title) =>
  [...container.querySelectorAll(".filter-item")]
    .find((item) => item.textContent.startsWith(title))
    .querySelector("input");
const save = () =>
  act(async () => container.querySelector("button[type=submit]").click());

test("the box lists only the decks of the language pair of the cards, and says which have all of them, some or none", async () => {
  await show([inTrains, inBoth]);

  const names = [...container.querySelectorAll(".filter-name")].map(
    (item) => item.textContent,
  );
  expect(names).toEqual(["Trains", "Travel"]);
  expect(box("Trains").checked).toBe(true);
  expect(box("Travel").indeterminate).toBe(true);
});

test("ticking a deck puts all the cards in it", async () => {
  const { onSave } = await show([inTrains, inBoth]);
  await act(async () => box("Travel").click());
  await save();

  expect(onSave).toHaveBeenCalledWith([2], []);
});

test("unticking a deck takes all the cards out of it", async () => {
  const { onSave } = await show([inTrains, inBoth]);
  await act(async () => box("Trains").click());
  await save();

  expect(onSave).toHaveBeenCalledWith([], [1]);
});

test("saving without a change closes the box and sends nothing", async () => {
  const { onSave, onCancel } = await show([inTrains]);
  await save();

  expect(onSave).not.toHaveBeenCalled();
  expect(onCancel).toHaveBeenCalled();
});

test("cards of different language pairs cannot be changed together", async () => {
  await show([
    inTrains,
    {
      id: 9,
      text_language: "en",
      first_language: "de",
      word: "train",
      decks: [],
    },
  ]);

  expect(container.textContent).toContain("Select cards of one language pair");
  expect(container.querySelector("button[type=submit]").disabled).toBe(true);
});

test("a problem with the decks is shown and the box stays open", async () => {
  await show([inTrains], { error: "There is no deck with id 7." });

  expect(container.querySelector("[role=alert]").textContent).toBe(
    "There is no deck with id 7.",
  );
});
