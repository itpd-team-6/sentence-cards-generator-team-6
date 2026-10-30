import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test, vi } from "vitest";
import StudyPage from "./StudyPage.jsx";
import { answerCard, loadDueCards } from "./api.js";

// The API is replaced by stand-ins, so the test needs no running product.
vi.mock("./api.js", () => ({
  answerCard: vi.fn(),
  loadDueCards: vi.fn(),
}));

// The queue under the Start button is not what this test is about.
vi.mock("./StudyQueue.jsx", () => ({ default: () => null }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const forecast = {
  again: { interval_days: 0 },
  hard: { interval_days: 1 },
  good: { interval_days: 2 },
  easy: { interval_days: 4 },
};

const dueCard = (id, word) => ({
  id,
  word,
  sentence: `Ein Satz mit ${word}.`,
  translation: "A sentence.",
  forecast,
});

const click = async (container, text) => {
  const button = [...container.querySelectorAll("button")].find((candidate) =>
    candidate.textContent.includes(text),
  );
  await act(async () => button.click());
};

test("skips a card that was deleted while the session was open", async () => {
  loadDueCards.mockResolvedValue([dueCard(1, "Haus"), dueCard(2, "Baum")]);
  const deleted = new Error("There is no card with this id.");
  deleted.status = 404;
  answerCard.mockRejectedValue(deleted);

  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  await act(async () => root.render(<StudyPage />));

  await click(container, "Start a session");
  expect(container.querySelector(".study-word").textContent).toBe("Haus");

  await click(container, "Show translation");
  await click(container, "Good");

  expect(container.querySelector(".study-word").textContent).toBe("Baum");
  expect(document.body.textContent).toContain("was deleted");
  expect(container.textContent).toContain("1 card left in this session");

  await act(async () => root.unmount());
  container.remove();
});
