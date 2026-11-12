import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import YourCardsPage from "./YourCardsPage.jsx";

// The call is a plain function, not a spy: the test runner keeps its own rejected promise for a spy that fails.
const api = vi.hoisted(() => ({ loadCards: () => Promise.resolve([]) }));
vi.mock("./api.js", () => ({ loadCards: () => api.loadCards() }));
vi.mock("./CardsTable.jsx", () => ({
  default: ({ cards, title = "Your cards" }) => (
    <p>
      {title}: {cards.length}
    </p>
  ),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

async function show() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<YourCardsPage />));
}

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test("the page shows all the cards in the table", async () => {
  api.loadCards = () => Promise.resolve([{ id: 1 }, { id: 2 }]);
  await show();

  expect(container.textContent).toContain("Your cards: 2");
});

test("without cards the page says where they come from", async () => {
  api.loadCards = () => Promise.resolve([]);
  await show();

  expect(container.textContent).toContain("No cards yet");
});

test("a failed read is told to the learner", async () => {
  api.loadCards = () => Promise.reject(new Error("down"));
  await show();

  expect(container.querySelector("[role=alert]").textContent).toContain(
    "could not be loaded",
  );
});
