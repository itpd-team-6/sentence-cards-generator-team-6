import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import LibraryMenu from "./LibraryMenu.jsx";
import { checkLibrary } from "./api.js";
import { libraryCode, newLibraryCode, setLibraryCode } from "./library.js";

vi.mock("./api.js", () => ({ checkLibrary: vi.fn() }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const OTHER = "22222222-2222-4222-8222-222222222222";

let container;
let root;
let reload;

async function show() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  reload = vi.fn();
  await act(async () => root.render(<LibraryMenu reload={reload} />));
}

const button = (text) =>
  [...container.querySelectorAll("button")].find((candidate) =>
    candidate.textContent.includes(text),
  );
const click = async (text) => act(async () => button(text).click());

async function type(id, value) {
  const field = container.querySelector(`#${id}`);
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  ).set;
  await act(async () => {
    setter.call(field, value);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

beforeEach(() => {
  localStorage.clear();
  setLibraryCode(newLibraryCode()); // the code is kept in the module, so each test starts with a code of its own
  checkLibrary.mockReset();
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

test("the menu is closed until the learner opens it", async () => {
  await show();
  expect(container.querySelector("#library-code")).toBeNull();

  await click("My library");

  expect(container.querySelector("#library-code").value).toBe(libraryCode());
});

test("the code can be copied", async () => {
  const writeText = vi.fn().mockResolvedValue();
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
  await show();
  await click("My library");

  await click("Copy");

  expect(writeText).toHaveBeenCalledWith(libraryCode());
  expect(button("Copied")).toBeTruthy();
});

test("the code can be saved as a file", async () => {
  URL.createObjectURL = vi.fn(() => "blob:code");
  URL.revokeObjectURL = vi.fn();
  const clicked = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {});
  await show();
  await click("My library");

  await click("Save as a file");

  expect(clicked).toHaveBeenCalledTimes(1);
  expect(URL.createObjectURL.mock.calls[0][0].size).toBe(
    libraryCode().length + 1,
  );
});

test("a text that is not a code is refused without asking the product", async () => {
  await show();
  await click("My library");
  await type("library-other", "not a code");

  await click("Find");

  expect(container.textContent).toContain("This is not a library code.");
  expect(checkLibrary).not.toHaveBeenCalled();
});

test("the code of the library the learner is in is refused", async () => {
  await show();
  await click("My library");
  await type("library-other", libraryCode().toUpperCase());

  await click("Find");

  expect(container.textContent).toContain("This is the library you are in.");
  expect(checkLibrary).not.toHaveBeenCalled();
});

test("a code with no library says so and opens nothing", async () => {
  const missing = new Error("There is no library with this code.");
  missing.status = 404;
  checkLibrary.mockRejectedValue(missing);
  await show();
  await click("My library");
  await type("library-other", OTHER);

  await click("Find");

  expect(container.textContent).toContain(
    "There is no library with this code.",
  );
  expect(button("Open it")).toBeUndefined();
  expect(reload).not.toHaveBeenCalled();
});

test("a library that exists shows what it has, and opening it changes the code and forgets the ticked decks", async () => {
  checkLibrary.mockResolvedValue({ cards: 12, decks: 3 });
  const mine = libraryCode();
  localStorage.setItem("sentence-cards.ticked-decks", "[1,2]");
  await show();
  await click("My library");
  await type("library-other", OTHER);

  await click("Find");
  expect(container.textContent).toContain(
    "This library has 12 cards in 3 decks.",
  );
  expect(libraryCode()).toBe(mine);

  await click("Open it");

  expect(localStorage.getItem("sentence-cards.library-code")).toBe(OTHER);
  expect(localStorage.getItem("sentence-cards.ticked-decks")).toBeNull();
  expect(reload).toHaveBeenCalledTimes(1);
});

test("cancelling keeps the library the learner is in", async () => {
  checkLibrary.mockResolvedValue({ cards: 1, decks: 1 });
  const mine = libraryCode();
  await show();
  await click("My library");
  await type("library-other", OTHER);
  await click("Find");

  await click("Cancel");

  expect(button("Open it")).toBeUndefined();
  expect(libraryCode()).toBe(mine);
  expect(reload).not.toHaveBeenCalled();
});
