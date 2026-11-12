import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import CardsTable from "./CardsTable.jsx";

// The call is a plain function, not a spy: the test runner keeps its own rejected promise for a spy that fails.
const api = vi.hoisted(() => ({ changeCardDecks: () => Promise.resolve([]) }));
vi.mock("./api.js", () => ({
  changeCard: () => Promise.resolve(null),
  changeCardDecks: (...args) => api.changeCardDecks(...args),
  deleteCard: () => Promise.resolve(null),
  deleteCards: () => Promise.resolve(null),
  hideCards: () => Promise.resolve([]),
  newSentence: () => Promise.resolve(null),
  newSentences: () => Promise.resolve([]),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const DE_RU = { text_language: "de", first_language: "ru" };
const CARDS = [
  {
    id: 1,
    ...DE_RU,
    word: "Zug",
    sentence: "Ich nehme den Zug.",
    translation: "поезд",
    decks: [
      { id: 1, title: "Deck A" },
      { id: 2, title: "Deck B" },
    ],
    texts: [
      { id: 10, title: "Text X" },
      { id: 11, title: "Text Y" },
    ],
  },
  {
    id: 2,
    ...DE_RU,
    word: "Reise",
    sentence: null,
    translation: null,
    decks: [],
    texts: [],
  },
];

let container;
let root;

async function show(props) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () =>
    root.render(
      <CardsTable cards={CARDS} onCardsChange={() => {}} {...props} />,
    ),
  );
}

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test("a card shows the text it came from, which opens that text, and how many more texts have its word", async () => {
  await show({ showTexts: true });

  const label = container.querySelector(".text-label");
  expect(label.textContent).toBe("Text X");
  expect(label.getAttribute("href")).toBe("#/texts/10");
  expect(container.querySelector(".more-texts").textContent).toBe("+1");
});

test("a card shows only the decks the learner ticked", async () => {
  await show({ showTexts: true, tickedDecks: new Set([2]) });

  const tags = [...container.querySelectorAll(".deck-tag")].map(
    (tag) => tag.textContent,
  );
  expect(tags).toEqual(["Deck B"]);
});

test("a line shows the word and the sentence, and a click opens it with the translation and the buttons", async () => {
  await show({ showTexts: true });

  const line = container.querySelector(".card-row");
  expect(line.querySelector(".card-word").textContent).toBe("Zug");
  expect(line.querySelector(".card-sentence").textContent).toBe(
    "Ich nehme den Zug.",
  );
  expect(line.querySelector(".card-detail")).toBeNull();
  await act(async () => line.querySelector(".card-main").click());

  expect(line.querySelector(".card-main").getAttribute("aria-expanded")).toBe(
    "true",
  );
  const detail = line.querySelector(".card-detail");
  expect(detail.textContent).toContain("поезд");
  const names = [...detail.querySelectorAll(".detail-actions button")].map(
    (button) => button.textContent,
  );
  expect(names).toEqual([
    "Edit",
    "Mark for review",
    "Hide from study",
    "New sentence",
    "Delete",
  ]);
  await act(async () => line.querySelector(".card-main").click());
  expect(line.querySelector(".card-detail")).toBeNull();
});

test("a card marked for review or hidden shows its state in the line, as a button that undoes it", async () => {
  await show({
    showTexts: true,
    cards: [
      { ...CARDS[0], flagged: true },
      { ...CARDS[1], hidden: true },
    ],
  });

  const [first, second] = container.querySelectorAll(".card-row");
  expect(first.querySelector(".status-button").getAttribute("aria-label")).toBe(
    "Unmark Zug for review",
  );
  expect(second.className).toContain("hidden-card");
  expect(
    second.querySelector(".status-button").getAttribute("aria-label"),
  ).toBe("Show Reise in study");
});

test("without the option the card has no label", async () => {
  await show({});

  expect(container.querySelector(".origins")).toBeNull();
});

test("the bar says how many cards are selected of the cards shown", async () => {
  await show({});
  await act(async () =>
    container.querySelector("input[aria-label='Select Zug']").click(),
  );

  expect(container.querySelector(".bulk-count").textContent).toBe(
    "1 selected of 2 shown",
  );
});

test("without cards the table says why", async () => {
  await show({ cards: [], emptyMessage: "No card has all of this." });

  expect(container.textContent).toContain("No card has all of this.");
});

test("the selected cards are put in a deck from the bar, and the decks are read again", async () => {
  const calls = [];
  api.changeCardDecks = (ids, add, remove) => {
    calls.push([ids, add, remove]);
    return Promise.resolve([
      { ...CARDS[1], decks: [{ id: 5, title: "Travel" }] },
    ]);
  };
  const changed = [];
  let decksChanged = 0;
  await show({
    decks: [{ id: 5, title: "Travel", ...DE_RU }],
    onCardsChange: (next) => changed.push(next),
    onDecksChange: () => (decksChanged += 1),
  });
  await act(async () =>
    container.querySelector("input[aria-label='Select Reise']").click(),
  );
  await act(async () =>
    [...container.querySelectorAll(".bulk-bar button")]
      .find((button) => button.textContent === "Decks")
      .click(),
  );
  await act(async () => container.querySelector(".deck-choices input").click());
  await act(async () =>
    container.querySelector("dialog button[type=submit]").click(),
  );

  expect(calls).toEqual([[[2], [5], []]]);
  expect(changed.at(-1)[1].decks).toEqual([{ id: 5, title: "Travel" }]);
  expect(decksChanged).toBe(1);
});

test("a card shows how many decks it is in", async () => {
  await show({ showTexts: true });

  const counts = [...container.querySelectorAll(".deck-count")]
    .map((item) => item.textContent)
    .filter(Boolean);
  expect(counts).toEqual(["2 decks"]);
});

test("a group closes when the learner clicks its title, and all of them close or open from the buttons", async () => {
  const groups = [
    { key: "deck-1", title: "Deck A", cards: [CARDS[0]] },
    { key: "deck-2", title: "Deck B", cards: [CARDS[0], CARDS[1]] },
  ];
  await show({ groups, showTexts: true });
  const rows = () => container.querySelectorAll(".card-row").length;
  const press = (label) =>
    act(async () =>
      [...container.querySelectorAll(".fold-all button")]
        .find((button) => button.textContent === label)
        .click(),
    );

  expect(rows()).toBe(3);
  await act(async () => container.querySelector(".group-head button").click());
  expect(rows()).toBe(2);
  expect(
    container.querySelector(".group-head button").getAttribute("aria-expanded"),
  ).toBe("false");
  await press("Collapse all");
  expect(rows()).toBe(0);
  expect(container.querySelectorAll(".group-head").length).toBe(2);
  await press("Expand all");
  expect(rows()).toBe(3);
});

test("grouped cards show under the title of each group, and a card in two groups shows in both", async () => {
  const groups = [
    { key: "deck-1", title: "Deck A", cards: [CARDS[0]] },
    { key: "deck-2", title: "Deck B", cards: [CARDS[0], CARDS[1]] },
  ];
  await show({ groups, showTexts: true });

  const titles = [...container.querySelectorAll(".group-head")].map(
    (item) => item.textContent,
  );
  expect(titles).toEqual(["Deck A1", "Deck B2"]);
  expect(container.querySelectorAll(".card-row").length).toBe(3);
});
