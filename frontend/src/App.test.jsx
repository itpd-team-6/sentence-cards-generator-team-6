import { useEffect } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "./App.jsx";

const lifecycle = vi.hoisted(() => ({ mounted: 0, unmounted: 0 }));

// The pages call the API, so stand-ins show which one the address opens and whether the text page stays in the document.
vi.mock("./StudyPage.jsx", () => ({
  default: ({ onSessionChange }) => (
    <>
      <p>Study page</p>
      <button type="button" onClick={() => onSessionChange(true)}>
        Open a session
      </button>
    </>
  ),
}));
vi.mock("./LibraryMenu.jsx", () => ({ default: () => <p>Library menu</p> }));
vi.mock("./TextPage.jsx", () => ({
  default: function TextPage() {
    useEffect(() => {
      lifecycle.mounted += 1;
      return () => {
        lifecycle.unmounted += 1;
      };
    }, []);
    return <p>Text page</p>;
  },
}));
vi.mock("./TextList.jsx", () => ({
  default: ({ active }) => <p>Text list {active ? "shown" : "hidden"}</p>,
}));
vi.mock("./SavedText.jsx", () => ({
  default: ({ textId }) => <p>Saved text {textId}</p>,
}));
vi.mock("./YourCardsPage.jsx", () => ({
  default: () => <p>Your cards page</p>,
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

async function show() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<App />));
}

// Changes the address like a click on a link or the back button, and lets the page react to it.
async function goTo(hash) {
  await act(async () => {
    window.location.hash = hash;
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

const tabs = () => [...container.querySelectorAll(".tab")];
const current = () =>
  tabs().find((tab) => tab.getAttribute("aria-current") === "page");
const textPageBox = () => container.querySelector("div[hidden], main > div");

beforeEach(() => {
  window.location.hash = "";
  lifecycle.mounted = 0;
  lifecycle.unmounted = 0;
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ status: "ok" }) }),
  );
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test("the product opens on the Study page, and Texts is the second tab and Your cards the third", async () => {
  await show();

  expect(tabs().map((tab) => tab.textContent)).toEqual([
    "Study",
    "Texts",
    "Your cards",
  ]);
  expect(current().textContent).toBe("Study");
  expect(container.textContent).toContain("Study page");
});

test("an address that names no page opens the Study page", async () => {
  window.location.hash = "#/nowhere";
  await show();

  expect(current().textContent).toBe("Study");
  expect(container.textContent).toContain("Study page");
});

test("the tabs are links to the address of their page", async () => {
  await show();

  expect(tabs().map((tab) => tab.getAttribute("href"))).toEqual([
    "#/study",
    "#/texts",
    "#/your-cards",
  ]);
});

test("a change of the address opens the page it names, as the back button does", async () => {
  await show();

  await goTo("#/texts");
  expect(current().textContent).toBe("Texts");
  expect(container.textContent).not.toContain("Study page");
  expect(textPageBox().hidden).toBe(false);

  await goTo("#/study");
  expect(current().textContent).toBe("Study");
  expect(container.textContent).toContain("Study page");
});

test("an address that names the text page opens it on load", async () => {
  window.location.hash = "#/texts";
  await show();

  expect(current().textContent).toBe("Texts");
  expect(container.textContent).not.toContain("Study page");
});

test("the text page stays in the document when the learner goes to another page and comes back", async () => {
  await show();

  await goTo("#/texts");
  await goTo("#/study");
  await goTo("#/texts");

  expect(lifecycle.mounted).toBe(1);
  expect(lifecycle.unmounted).toBe(0);
  expect(container.textContent).toContain("Text page");
});

test("the header shows the name of the product and the state of the API", async () => {
  await show();

  expect(container.querySelector("h1").textContent).toBe(
    "Sentence cards generator",
  );
  expect(container.querySelector(".status-dot").textContent).toBe(
    "API status: ok",
  );
  expect(container.querySelector(".status-dot").className).not.toContain(
    "problem",
  );
});

test("the dot shows a problem when the API cannot be reached", async () => {
  globalThis.fetch = vi.fn(() => Promise.reject(new Error("offline")));
  await show();

  expect(container.querySelector(".status-dot").textContent).toBe(
    "API status: unreachable",
  );
  expect(container.querySelector(".status-dot").className).toContain("problem");
});

test("the header and the tabs step aside while a study session is open", async () => {
  await show();
  const header = container.querySelector("header");
  expect(header.hidden).toBe(false);
  expect(header.contains(container.querySelector("nav"))).toBe(true);

  await act(async () => container.querySelector("button").click());

  expect(header.hidden).toBe(true);
  expect(container.querySelector("main").className).toContain("in-session");
});

test("the list of texts is told when it is shown, so that it can read the texts again", async () => {
  await show();
  expect(container.textContent).toContain("Text list hidden");

  await goTo("#/texts");
  expect(container.textContent).toContain("Text list shown");

  await goTo("#/study");
  expect(container.textContent).toContain("Text list hidden");
});

test("the Your cards page is made when the learner goes to it", async () => {
  await show();
  expect(container.textContent).not.toContain("Your cards page");

  await goTo("#/your-cards");
  expect(current().textContent).toBe("Your cards");
  expect(container.textContent).toContain("Your cards page");

  await goTo("#/study");
  expect(container.textContent).not.toContain("Your cards page");
});

test("the address of a saved text opens it on the Texts tab and keeps the form in the document", async () => {
  await show();

  await goTo("#/texts/7");
  expect(current().textContent).toBe("Texts");
  expect(container.textContent).toContain("Saved text 7");
  expect(container.textContent).toContain("Text list hidden");
  expect(lifecycle.mounted).toBe(1);
  expect(lifecycle.unmounted).toBe(0);

  await goTo("#/texts");
  expect(container.textContent).not.toContain("Saved text");
  expect(container.textContent).toContain("Text list shown");
  expect(lifecycle.mounted).toBe(1);
});
