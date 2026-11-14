// The decks the learner ticked on the study page are remembered in this browser, so they are ticked again next time.
// The first time none is ticked. Browser storage can be missing or refuse to answer; then nothing is remembered.
const KEY = "sentence-cards.ticked-decks";

export function readTickedDecks() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(value) ? value.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export function writeTickedDecks(deckIds) {
  try {
    localStorage.setItem(KEY, JSON.stringify(deckIds));
  } catch {
    // Not remembered: the study page works the same, only the ticks are lost when it is closed.
  }
}

// The decks of one library are not the decks of another, so the ticks are forgotten when the learner opens another.
export function clearTickedDecks() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing was remembered.
  }
}

// "Study this deck" on the page of a deck opens the Study page and starts the session at once. The wish is kept in the
// session of the tab for the one page load that reads it, so that a reload of the Study page does not start another.
// It carries the address of the page of the deck, so that the arrow of the session goes back to that deck.
const START_KEY = "sentence-cards.start-now";

export function requestStartNow(returnTo = "") {
  try {
    sessionStorage.setItem(START_KEY, returnTo);
  } catch {
    // Without storage the Study page opens as usual and the learner starts the session there.
  }
}

// The address to go back to ("" when there is none) once for each request, and null when nothing was asked.
export function takeStartNow() {
  try {
    const asked = sessionStorage.getItem(START_KEY);
    sessionStorage.removeItem(START_KEY);
    return asked;
  } catch {
    return null;
  }
}
