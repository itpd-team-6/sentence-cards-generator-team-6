import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import CardEditDialog from "./CardEditDialog.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const card = {
  id: 1,
  word: "Zug",
  phrase: "der Zug kommt",
  sentence: "Der Zug kommt gleich.",
  translation: "The train is coming soon.",
  translation_locked: false,
  texts: [
    { id: 7, title: "Am Bahnhof" },
    { id: 3, title: "Die Reise" },
  ],
};

let container;
let root;

async function show(props = {}) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const onCancel = vi.fn();
  await act(async () =>
    root.render(
      <CardEditDialog
        card={card}
        onSave={vi.fn()}
        onCancel={onCancel}
        {...props}
      />,
    ),
  );
  return onCancel;
}

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test("the box lists the texts the card comes from, each with a link to its page", async () => {
  await show();

  const links = [...container.querySelectorAll(".from-texts a")];
  expect(links.map((link) => link.textContent)).toEqual([
    "Am Bahnhof",
    "Die Reise",
  ]);
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    "#/texts/7",
    "#/texts/3",
  ]);
  expect(container.querySelector(".from-texts").textContent).toContain(
    "From texts",
  );
});

test("following a link closes the box", async () => {
  const onCancel = await show();

  await act(async () => container.querySelector(".from-texts a").click());

  expect(onCancel).toHaveBeenCalled();
});

test("a card that comes from no text, or the study session, shows no list", async () => {
  await show({ card: { ...card, texts: [] } });
  expect(container.querySelector(".from-texts")).toBeNull();
  await act(async () => root.unmount());
  container.remove();

  await show({ showPhrase: false });
  expect(container.querySelector(".from-texts")).toBeNull();
});
