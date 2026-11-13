import { LIBRARY_HEADER, libraryHeaders } from "./library.js";

// The event the window gets after a call that changed something, so the header can read what there is to study again.
export const DATA_CHANGED = "sentence-cards:data-changed";

// The calls to the product's API. A failed call throws an Error whose message is safe to show the learner, and whose
// `status` is the HTTP status of the answer.
async function call(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { ...libraryHeaders(), ...options.headers },
    });
  } catch {
    throw new Error("The product could not be reached. Is it running?");
  }
  if (response.ok && options.method && options.method !== "GET") {
    window.dispatchEvent(new Event(DATA_CHANGED));
  }
  if (response.status === 204) {
    return null;
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(
      typeof body?.detail === "string"
        ? body.detail
        : "The request failed. Try again.",
    );
    error.status = response.status;
    throw error;
  }
  return body;
}

const json = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// The query string that keeps the cards of some decks: `deck_ids=1&deck_ids=2`. Without decks there is none.
const deckQuery = (deckIds) =>
  deckIds?.length
    ? `?${deckIds.map((id) => `deck_ids=${encodeURIComponent(id)}`).join("&")}`
    : "";

// The decks, each with its number of cards. With both languages, only the decks of that language pair.
export const loadDecks = (textLanguage, firstLanguage) =>
  call(
    textLanguage && firstLanguage
      ? `/api/decks?text_language=${textLanguage}&first_language=${firstLanguage}`
      : "/api/decks",
  );

// A new empty deck for a language pair. The title is 1 to 60 characters and free for the pair.
export const createDeck = (title, textLanguage, firstLanguage) =>
  call(
    "/api/decks",
    json("POST", {
      title,
      text_language: textLanguage,
      first_language: firstLanguage,
    }),
  );

// One deck, with how many of its cards are only in it (`cards_only_here`) and how many are also in another deck
// (`cards_elsewhere`), which is what the learner needs to know before deleting it (DEC-065).
export const loadDeck = (deckId) => call(`/api/decks/${deckId}`);

// A new title for a deck, with the rules of a new deck's title. The deck "Uncategorized" cannot be renamed.
export const renameDeck = (deckId, title) =>
  call(`/api/decks/${deckId}`, json("PATCH", { title }));

// Deletes a deck. `cards` says what happens to the cards that are in no other deck: "delete" deletes them and "keep"
// puts them in the deck "Uncategorized" of their language pair. A deck with no such card needs no choice.
export const deleteDeck = (deckId, cards) =>
  call(`/api/decks/${deckId}${cards ? `?cards=${cards}` : ""}`, {
    method: "DELETE",
  });

// A card for each marked word of the text that has none yet, all of them in the decks `deckIds`.
export const createCards = (textId, deckIds) =>
  call(`/api/texts/${textId}/cards`, json("POST", { deck_ids: deckIds }));

// The saved texts, the newest first, each with its marked words and how many cards it has.
export const loadTexts = () => call("/api/texts");

// One saved text with its marked words, and the cards of one text.
export const loadText = (textId) => call(`/api/texts/${textId}`);
export const loadTextCards = (textId) => call(`/api/texts/${textId}/cards`);

// `fields` has any of: title, text, words (the whole list of marked words the text keeps). The answer is the text as it
// is now, with `lost_marks`: the marks the new text took away.
export const changeText = (textId, fields) =>
  call(`/api/texts/${textId}`, json("PATCH", fields));

// Deletes a text and its marks. Its cards, their decks and their study data stay.
export const deleteText = (textId) =>
  call(`/api/texts/${textId}`, { method: "DELETE" });

// Every card, the ones of the newest text first.
export const loadCards = () => call("/api/cards");

// `fields` has any of: sentence, translation, translation_locked, flagged, hidden.
export const changeCard = (cardId, fields) =>
  call(`/api/cards/${cardId}`, json("PATCH", fields));

export const newSentence = (cardId) =>
  call(`/api/cards/${cardId}/new-sentence`, { method: "POST" });

export const deleteCard = (cardId) =>
  call(`/api/cards/${cardId}`, { method: "DELETE" });

// Several cards at once. `deleteCards` deletes none of them when one does not exist; `newSentences` answers with the
// cards, and a card the model gave no sentence for keeps its old sentence and carries an `error`.
export const deleteCards = (cardIds) =>
  call("/api/cards/delete", json("POST", { card_ids: cardIds }));

// Hides several cards from study, or shows them again; the answer has the cards as they are now.
export const hideCards = (cardIds, hidden) =>
  call("/api/cards/hidden", json("POST", { card_ids: cardIds, hidden }));

// Puts cards in the decks `addDeckIds` and takes them out of the decks `removeDeckIds`, in one step. Only the link to the
// decks changes: a card keeps its sentence and its study data. The answer has the cards as they are now.
export const changeCardDecks = (cardIds, addDeckIds, removeDeckIds) =>
  call(
    "/api/cards/decks",
    json("POST", {
      card_ids: cardIds,
      add_deck_ids: addDeckIds,
      remove_deck_ids: removeDeckIds,
    }),
  );

export const newSentences = (cardIds) =>
  call("/api/cards/new-sentences", json("POST", { card_ids: cardIds }));

// The cards due today or earlier, with a sentence to show, from the decks `deckIds`. Empty when nothing is due.
export const loadDueCards = (deckIds) =>
  call(`/api/study/due${deckQuery(deckIds)}`);

// The learner's answer to a card, one of "again", "hard", "good" and "easy"; the answer has the card's next due date.
export const answerCard = (cardId, answer) =>
  call(`/api/cards/${cardId}/answer`, json("POST", { answer }));

// The study queue: every card with a sentence, in the order they are studied. The cards due today come first, and each
// card says whether it is due today and its due date. Only the cards of the decks `deckIds`, each once.
export const loadQueue = (deckIds) =>
  call(`/api/study/queue${deckQuery(deckIds)}`);

// Saves the order the learner gave the study queue. `cardIds` is the whole queue in the new order, `moved` the cards the
// learner moved, and `todayCount` how many cards at the start of the order are due today; `deckIds` are the decks the
// learner ticked. The answer is the queue of those decks as it is now.
export const saveQueueOrder = (cardIds, moved, todayCount, deckIds) =>
  call(
    "/api/study/queue/order",
    json("POST", {
      card_ids: cardIds,
      moved,
      today_count: todayCount,
      deck_ids: deckIds,
    }),
  );

// How many cards and decks the library with this code has. A code without a library gives a 404.
export const checkLibrary = (code) =>
  call("/api/library", { headers: { [LIBRARY_HEADER]: code } });
