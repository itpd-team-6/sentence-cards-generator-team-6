import { beforeEach, expect, test, vi } from "vitest";

// The code is kept in a variable of the module, so each test loads the module again.
async function load() {
  vi.resetModules();
  return import("./library.js");
}

beforeEach(() => localStorage.clear());

test("a new code is a version 4 UUID and differs each time", async () => {
  const { newLibraryCode, isLibraryCode } = await load();

  const codes = Array.from({ length: 20 }, newLibraryCode);

  expect(codes.every(isLibraryCode)).toBe(true);
  expect(codes.every((code) => code[14] === "4")).toBe(true);
  expect(new Set(codes).size).toBe(20);
});

test("the code is made once and kept in the browser", async () => {
  const first = await load();
  const code = first.libraryCode();

  const second = await load();

  expect(second.libraryCode()).toBe(code);
  expect(localStorage.getItem("sentence-cards.library-code")).toBe(code);
});

test("a saved value that is not a code is replaced by a new code", async () => {
  localStorage.setItem("sentence-cards.library-code", "../cards");
  const { libraryCode, isLibraryCode } = await load();

  expect(isLibraryCode(libraryCode())).toBe(true);
});

test("every call carries the code in X-Library-Code", async () => {
  const { libraryCode, libraryHeaders } = await load();

  expect(libraryHeaders()).toEqual({ "X-Library-Code": libraryCode() });
});

test("setting a code makes it the code of this browser", async () => {
  const { setLibraryCode, libraryCode } = await load();
  const other = "11111111-1111-4111-8111-111111111111";

  setLibraryCode(other);

  expect(libraryCode()).toBe(other);
  expect(localStorage.getItem("sentence-cards.library-code")).toBe(other);
});

test("a code pasted with spaces and capitals is cleaned", async () => {
  const { cleanLibraryCode, isLibraryCode } = await load();

  expect(
    isLibraryCode(
      cleanLibraryCode("  ABCDEF12-1111-4111-8111-111111111111 \n"),
    ),
  ).toBe(true);
});

test("the code works without browser storage", async () => {
  const { libraryCode, isLibraryCode } = await load();
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });

  const code = libraryCode();

  expect(isLibraryCode(code)).toBe(true);
  expect(libraryCode()).toBe(code);
  vi.restoreAllMocks();
});
