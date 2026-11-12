import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import TodaySummary from "./TodaySummary.jsx";
import { DATA_CHANGED, loadDueCards, loadQueue } from "./api.js";

vi.mock("./api.js", async (importOriginal) => ({
  ...(await importOriginal()),
  loadDueCards: vi.fn(),
  loadQueue: vi.fn(),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  vi.mocked(loadDueCards).mockReset();
  vi.mocked(loadQueue).mockReset();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const due = [
  { stage: "new", decks: [{ id: 1, title: "Travel" }] },
  {
    stage: "forgotten",
    decks: [
      { id: 1, title: "Travel" },
      { id: 2, title: "Work" },
    ],
  },
  { stage: "due", decks: [{ id: 2, title: "Work" }] },
];

const draw = async (page = "texts") => {
  await act(async () => root.render(<TodaySummary page={page} />));
};

test("the pill says how many cards are to study and about how long, and opens the Study page", async () => {
  vi.mocked(loadDueCards).mockResolvedValue(due);
  await draw();

  const pill = container.querySelector("a.today-pill");
  expect(pill.textContent).toContain("3 to study");
  expect(pill.textContent).toContain("about 2 min");
  expect(pill.getAttribute("href")).toBe("#/study");
});

test("it asks for the cards of all the decks, not of some", async () => {
  vi.mocked(loadDueCards).mockResolvedValue(due);
  await draw();

  expect(loadDueCards).toHaveBeenCalledWith();
});

test("the panel gives the cards of each kind and of each deck, a card in two decks once in the total", async () => {
  vi.mocked(loadDueCards).mockResolvedValue(due);
  await draw();

  const panel = container.querySelector(".today-panel");
  expect(panel.querySelector("h2").textContent).toBe("Today — All decks");
  expect(
    [...panel.querySelectorAll(".today-kind")].map((kind) => kind.textContent),
  ).toEqual(["1New", "1Forgotten", "1Review"]);
  expect(
    [...panel.querySelectorAll(".today-decks li")].map(
      (row) => row.textContent,
    ),
  ).toEqual(["Travel2", "Work2"]);
  expect(container.querySelector("a.today-pill").textContent).toContain(
    "3 to study",
  );
});

test("the pill is described by the panel, so a screen reader reads it too", async () => {
  vi.mocked(loadDueCards).mockResolvedValue(due);
  await draw();

  const id = container
    .querySelector("a.today-pill")
    .getAttribute("aria-describedby");
  expect(container.querySelector(`#${id}`)).toBe(
    container.querySelector(".today-panel"),
  );
});

test("with nothing due, it says all is done and when the next card is due", async () => {
  vi.mocked(loadDueCards).mockResolvedValue([]);
  vi.mocked(loadQueue).mockResolvedValue([{ due_date: "2026-11-15" }]);
  await draw();

  const pill = container.querySelector("a.today-pill");
  expect(pill.textContent).toContain("All done today");
  expect(pill.textContent).toContain("next Sun 15 Nov");
  expect(container.querySelector(".today-panel")).toBeNull();
});

test("with no card at all, it says there are no cards yet", async () => {
  vi.mocked(loadDueCards).mockResolvedValue([]);
  vi.mocked(loadQueue).mockResolvedValue([]);
  await draw();

  expect(container.textContent).toContain("No cards yet");
});

test("it shows nothing on the Study page, and does not ask for the cards there", async () => {
  vi.mocked(loadDueCards).mockResolvedValue(due);
  await draw("study");

  expect(container.textContent).toBe("");
  expect(loadDueCards).not.toHaveBeenCalled();
});

test("it shows nothing when the cards cannot be read", async () => {
  vi.mocked(loadDueCards).mockRejectedValue(new Error("down"));
  await draw();

  expect(container.textContent).toBe("");
});

test("it reads the cards again when a call changed something", async () => {
  vi.mocked(loadDueCards)
    .mockResolvedValueOnce(due)
    .mockResolvedValue([due[0]]);
  await draw();
  expect(container.querySelector("a.today-pill").textContent).toContain(
    "3 to study",
  );

  await act(async () => window.dispatchEvent(new Event(DATA_CHANGED)));

  expect(container.querySelector("a.today-pill").textContent).toContain(
    "1 to study",
  );
});
