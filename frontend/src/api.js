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

// `fields` has any of: sentence, translation, flagged.
export const changeCard = (cardId, fields) => call(`/api/cards/${cardId}`, json("PATCH", fields));

export const newSentence = (cardId) => call(`/api/cards/${cardId}/new-sentence`, { method: "POST" });

export const deleteCard = (cardId) => call(`/api/cards/${cardId}`, { method: "DELETE" });

// The cards due today or earlier, with a sentence to show. Empty when nothing is due.
export const loadDueCards = () => call("/api/study/due");

// The learner's answer to a card; the answer has the card's next due date.
export const answerCard = (cardId, remembered) => call(`/api/cards/${cardId}/answer`, json("POST", { remembered }));
