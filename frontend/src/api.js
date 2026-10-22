// The calls to the product's API. A failed call throws an Error whose message is safe to show the learner.
async function call(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("The product could not be reached. Is it running?");
  }
  if (response.status === 204) {
    return null;
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(typeof body?.detail === "string" ? body.detail : "The request failed. Try again.");
  }
  return body;
}

const json = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// A card for each marked word of the text that has none yet.
export const createCards = (textId) => call(`/api/texts/${textId}/cards`, { method: "POST" });

// Every card of every text, the newest text first.
export const loadCards = () => call("/api/cards");

// `fields` has any of: sentence, translation, translation_locked, flagged, hidden.
export const changeCard = (cardId, fields) => call(`/api/cards/${cardId}`, json("PATCH", fields));

export const newSentence = (cardId) => call(`/api/cards/${cardId}/new-sentence`, { method: "POST" });

export const deleteCard = (cardId) => call(`/api/cards/${cardId}`, { method: "DELETE" });

// Several cards at once. `deleteCards` deletes none of them when one does not exist; `newSentences` answers with the
// cards, and a card the model gave no sentence for keeps its old sentence and carries an `error`.
export const deleteCards = (cardIds) => call("/api/cards/delete", json("POST", { card_ids: cardIds }));

// Hides several cards from study, or shows them again; the answer has the cards as they are now.
export const hideCards = (cardIds, hidden) => call("/api/cards/hidden", json("POST", { card_ids: cardIds, hidden }));

export const newSentences = (cardIds) => call("/api/cards/new-sentences", json("POST", { card_ids: cardIds }));

// The cards due today or earlier, with a sentence to show. Empty when nothing is due.
export const loadDueCards = () => call("/api/study/due");

// The learner's answer to a card; the answer has the card's next due date.
export const answerCard = (cardId, remembered) => call(`/api/cards/${cardId}/answer`, json("POST", { remembered }));

// The study queue: every card with a sentence, in the order they are studied. The cards due today come first, and each
// card says whether it is due today and its due date.
export const loadQueue = () => call("/api/study/queue");

// Saves the order the learner gave the study queue. `cardIds` is the whole queue in the new order, `moved` the cards the
// learner moved, and `todayCount` how many cards at the start of the order are due today; the answer is the queue as it
// is now.
export const saveQueueOrder = (cardIds, moved, todayCount) =>
  call("/api/study/queue/order", json("POST", { card_ids: cardIds, moved, today_count: todayCount }));
