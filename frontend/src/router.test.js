import { expect, test } from "vitest";
import { PAGES, hrefOf, pageOf } from "./router.js";

test("the Study page is the first page", () => {
  expect(PAGES[0].id).toBe("study");
});

test("an address names its page", () => {
  expect(pageOf("#/study")).toBe("study");
  expect(pageOf("#/add-a-text")).toBe("text");
});

test("an empty or unknown address names the Study page", () => {
  expect(pageOf("")).toBe("study");
  expect(pageOf("#")).toBe("study");
  expect(pageOf("#/nowhere")).toBe("study");
});

test("the link to a page is the address that names it", () => {
  expect(hrefOf("study")).toBe("#/study");
  expect(hrefOf("text")).toBe("#/add-a-text");
  for (const page of PAGES) {
    expect(pageOf(hrefOf(page.id))).toBe(page.id);
  }
});
