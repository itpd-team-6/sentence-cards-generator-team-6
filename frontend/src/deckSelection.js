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

// The order of the cards of a session, mixed. It is a copy: the order saved in the product does not change.
export function shuffled(items, random = Math.random) {
  const copy = [...items];
  for (let place = copy.length - 1; place > 0; place -= 1) {
    const other = Math.floor(random() * (place + 1));
    [copy[place], copy[other]] = [copy[other], copy[place]];
  }
  return copy;
}
