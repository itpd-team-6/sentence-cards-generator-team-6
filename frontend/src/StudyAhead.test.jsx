import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import StudyAhead from "./StudyAhead.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

async function show(props) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<StudyAhead {...props} />));
}

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

const field = () => container.querySelector("input");
const add = () => container.querySelector(".ahead-go");
const less = () =>
  container.querySelector('button[aria-label="One card less"]');
const more = () =>
  container.querySelector('button[aria-label="One card more"]');

// Types into the field the way a person does: React reads the value the browser holds.
async function type(text) {
  const set = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  ).set;
  await act(async () => {
    set.call(field(), text);
    field().dispatchEvent(new Event("input", { bubbles: true }));
  });
}

const press = async (key) =>
  act(async () =>
    field().dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
    ),
  );

test("shows nothing when no card is due later", async () => {
  await show({ max: 0, busy: false, onAdd: vi.fn() });
  expect(container.textContent).toBe("");
});

test("starts at one card and brings it to today with the button", async () => {
  const onAdd = vi.fn();
  await show({ max: 4, busy: false, onAdd });
  expect(field().value).toBe("1");

  await act(async () => add().click());

  expect(onAdd).toHaveBeenCalledWith(1);
});

test("the plus and minus buttons change the number between one and the cards due later", async () => {
  await show({ max: 3, busy: false, onAdd: vi.fn() });
  expect(less().disabled).toBe(true);

  await act(async () => more().click());
  await act(async () => more().click());
  expect(field().value).toBe("3");
  expect(more().disabled).toBe(true);

  await act(async () => less().click());
  expect(field().value).toBe("2");
});

test("the arrow keys change the number and stay between one and the cards due later", async () => {
  await show({ max: 2, busy: false, onAdd: vi.fn() });

  await press("ArrowUp");
  await press("ArrowUp");
  expect(field().value).toBe("2");

  await press("ArrowDown");
  await press("ArrowDown");
  expect(field().value).toBe("1");
});

test("a typed number larger than the cards due later becomes the largest one", async () => {
  await show({ max: 4, busy: false, onAdd: vi.fn() });

  await type("9");

  expect(field().value).toBe("4");
});

test("only digits are typed, and a zero cannot be the number", async () => {
  await show({ max: 4, busy: false, onAdd: vi.fn() });

  await type("a2b");
  expect(field().value).toBe("2");

  await type("0");
  expect(field().value).toBe("");
  expect(add().disabled).toBe(true);
});

test("Enter brings the typed number of cards to today", async () => {
  const onAdd = vi.fn();
  await show({ max: 4, busy: false, onAdd });

  await type("3");
  await press("Enter");

  expect(onAdd).toHaveBeenCalledWith(3);
  expect(field().value).toBe("1");
});

test("an empty field brings nothing, with Enter or with the button", async () => {
  const onAdd = vi.fn();
  await show({ max: 4, busy: false, onAdd });

  await type("");
  await press("Enter");
  await act(async () => add().click());

  expect(onAdd).not.toHaveBeenCalled();
});

test("nothing is brought while the order is being saved", async () => {
  const onAdd = vi.fn();
  await show({ max: 4, busy: true, onAdd });

  await press("Enter");

  expect(add().disabled).toBe(true);
  expect(onAdd).not.toHaveBeenCalled();
});

test("the number goes down when fewer cards are due later", async () => {
  await show({ max: 4, busy: false, onAdd: vi.fn() });
  await type("4");

  await act(async () =>
    root.render(<StudyAhead max={2} busy={false} onAdd={vi.fn()} />),
  );

  expect(field().value).toBe("2");
});

test("the number is one again when the cards due later were not there at first and then come", async () => {
  await show({ max: 0, busy: false, onAdd: vi.fn() });

  await act(async () =>
    root.render(<StudyAhead max={3} busy={false} onAdd={vi.fn()} />),
  );

  expect(field().value).toBe("1");
  expect(add().disabled).toBe(false);
});
