// The library of the learner is named by a code, kept in this browser and sent with every call (`X-Library-Code`).
// The code is a random version 4 UUID. It is made with `crypto.getRandomValues`, because `crypto.randomUUID` is only
// there on a secure address (https or localhost), and the product is often opened by an address that is not.
const KEY = "sentence-cards.library-code";
const SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const LIBRARY_HEADER = "X-Library-Code";

export const isLibraryCode = (value) => SHAPE.test(value);

// What the learner pasted, without the spaces around it and in lowercase.
export const cleanLibraryCode = (value) => value.trim().toLowerCase();

export function newLibraryCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10).join(""),
  ].join("-");
}

// The code of this browser. It is made the first time and kept. When browser storage is missing or refuses, the
// code lives only until the page is closed.
let current = null;

export function libraryCode() {
  if (current) return current;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && isLibraryCode(saved)) {
      current = saved;
      return current;
    }
  } catch {
    // Storage cannot be read: a new code is made below.
  }
  return setLibraryCode(newLibraryCode());
}

export function setLibraryCode(code) {
  current = code;
  try {
    localStorage.setItem(KEY, code);
  } catch {
    // Not kept: the code is lost when the page is closed.
  }
  return code;
}

export const libraryHeaders = () => ({ [LIBRARY_HEADER]: libraryCode() });
