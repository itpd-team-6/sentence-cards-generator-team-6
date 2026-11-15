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

// A usability-test session is marked by the address it is opened with: `?source=usability-test` and, optionally,
// `?participant=P-01`. Real use carries neither, so its events stay `source=web` on the backend. The values are read
// once from the address and kept for the tab (sessionStorage), so a reload keeps the session without the query string.
// The participant code is `P-01`, `P-02` and so on, and never a name or an e-mail: anything else is ignored.
export const SOURCE_HEADER = "X-Event-Source";
export const PARTICIPANT_HEADER = "X-Participant-Code";
const SESSION_SOURCES = ["usability-test", "smoke"];
const PARTICIPANT_SHAPE = /^P-\d{2}$/;
const SOURCE_KEY = "sentence-cards.event-source";
const PARTICIPANT_KEY = "sentence-cards.participant-code";

const readStored = (key) => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const store = (key, value) => {
  try {
    if (value) sessionStorage.setItem(key, value);
  } catch {
    // Not kept: the value lives only for this call.
  }
};

// Reads `source` and `participant` from the address the first time and keeps them for the tab.
function readSession() {
  let source = readStored(SOURCE_KEY);
  let participant = readStored(PARTICIPANT_KEY);
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrlSource = params.get("source");
    if (!source && SESSION_SOURCES.includes(fromUrlSource)) {
      source = fromUrlSource;
      store(SOURCE_KEY, source);
    }
    const fromUrlParticipant = params.get("participant");
    if (
      !participant &&
      fromUrlParticipant &&
      PARTICIPANT_SHAPE.test(fromUrlParticipant)
    ) {
      participant = fromUrlParticipant;
      store(PARTICIPANT_KEY, participant);
    }
  } catch {
    // No address to read: only the stored values, if any, are used.
  }
  return { source, participant };
}

// The event headers of this session. Real use adds none, so its events stay `source=web`.
export function eventHeaders() {
  const { source, participant } = readSession();
  const found = {};
  if (source) found[SOURCE_HEADER] = source;
  if (participant) found[PARTICIPANT_HEADER] = participant;
  return found;
}
