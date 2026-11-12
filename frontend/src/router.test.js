import { expect, test } from "vitest";
import { PAGES, hrefOf, hrefOfText, pageOf, textIdOf } from "./router.js";

test("the Study page is the first page", () => {
  expect(PAGES[0].id).toBe("study");
});

test("the pages are Study, Texts and Your cards, in this order", () => {
  expect(PAGES.map((page) => page.name)).toEqual([
    "Study",
    "Texts",
    "Your cards",
  ]);
});

test("an address names its page", () => {
  expect(pageOf("#/study")).toBe("study");
  expect(pageOf("#/texts")).toBe("texts");
  expect(pageOf("#/your-cards")).toBe("cards");
});

test("an empty or unknown address names the Study page", () => {
  expect(pageOf("")).toBe("study");
  expect(pageOf("#")).toBe("study");
  expect(pageOf("#/nowhere")).toBe("study");
  expect(pageOf("#/add-a-text")).toBe("study");
});

test("the link to a page is the address that names it", () => {
  expect(hrefOf("study")).toBe("#/study");
  expect(hrefOf("texts")).toBe("#/texts");
  expect(hrefOf("cards")).toBe("#/your-cards");
  for (const page of PAGES) {
    expect(pageOf(hrefOf(page.id))).toBe(page.id);
  }
});

test("a saved text has an address inside the Texts page", () => {
  expect(hrefOfText(12)).toBe("#/texts/12");
  expect(pageOf("#/texts/12")).toBe("texts");
  expect(textIdOf("#/texts/12")).toBe(12);
});

test("an address that is not a saved text opens no text", () => {
  expect(textIdOf("#/texts")).toBeNull();
  expect(textIdOf("#/texts/abc")).toBeNull();
  expect(textIdOf("#/texts/12/more")).toBeNull();
  expect(textIdOf("")).toBeNull();
  expect(pageOf("#/texts/abc")).toBe("study");
});
