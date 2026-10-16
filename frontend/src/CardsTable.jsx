import { useState } from "react";
import { changeCard, deleteCard, newSentence } from "./api.js";

// The cards of one text, as a table the learner reviews: edit a sentence, flag it, ask for a new one or delete the card.
export default function CardsTable({ cards, onCardsChange }) {
  const [editing, setEditing] = useState(null); // { id, sentence, translation } of the card being edited
  const [busy, setBusy] = useState(false); // true while the product answers; every button waits
  const [notes, setNotes] = useState({}); // card id -> the message shown under that card

  const setNote = (id, message) => setNotes((current) => ({ ...current, [id]: message }));
  const replace = (card) => onCardsChange(cards.map((item) => (item.id === card.id ? card : item)));

  // Runs one action on a card. A failure leaves the card as it was and shows the message under it.
  async function act(card, work) {
    setBusy(true);
    setNote(card.id, "");
    try {
      await work();
    } catch (error) {
      setNote(card.id, error.message);
    } finally {
      setBusy(false);
    }
  }

  const toggleFlag = (card) => act(card, async () => replace(await changeCard(card.id, { flagged: !card.flagged })));

  const askForNewSentence = (card) =>
    act(card, async () => {
      replace(await newSentence(card.id));
      setEditing(null);
    });

  const remove = (card) =>
    act(card, async () => {
      await deleteCard(card.id);
      onCardsChange(cards.filter((item) => item.id !== card.id));
      setEditing(null);
    });

  const startEditing = (card) =>
    setEditing({ id: card.id, sentence: card.sentence ?? "", translation: card.translation ?? "" });

  function save(card) {
    const sentence = editing.sentence.trim();
    const translation = editing.translation.trim();
    if (!sentence || !translation) {
      setNote(card.id, "Write the sentence and its translation.");
      return;
    }
    const changes = {};
    if (sentence !== card.sentence) changes.sentence = sentence;
    if (translation !== card.translation) changes.translation = translation;
    if (Object.keys(changes).length === 0) {
      setEditing(null);
      return;
    }
    act(card, async () => {
      replace(await changeCard(card.id, changes));
      setEditing(null);
    });
  }

  if (cards.length === 0) {
    return <p className="hint">No cards left.</p>;
  }

  return (
    <table className="cards">
      <thead>
        <tr>
          <th scope="col">Word</th>
          <th scope="col">Sentence</th>
          <th scope="col">Translation</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      {cards.map((card) => {
        const isEditing = editing?.id === card.id;
        const message = notes[card.id] ?? card.error;
        return (
          <tbody key={card.id} className={card.flagged ? "flagged" : undefined}>
            <tr>
              <th scope="row">
                {card.word}
                {card.flagged && <span className="badge">Flagged</span>}
              </th>
              <td data-label="Sentence">
                {isEditing ? (
                  <textarea
                    rows={2}
                    aria-label={`Sentence for ${card.word}`}
                    value={editing.sentence}
                    onChange={(event) => setEditing({ ...editing, sentence: event.target.value })}
                  />
                ) : (
                  (card.sentence ?? <span className="empty">No sentence yet.</span>)
                )}
              </td>
              <td data-label="Translation">
                {isEditing ? (
                  <textarea
                    rows={2}
                    aria-label={`Translation for ${card.word}`}
                    value={editing.translation}
                    onChange={(event) => setEditing({ ...editing, translation: event.target.value })}
                  />
                ) : (
                  (card.translation ?? <span className="empty">No translation yet.</span>)
                )}
              </td>
              <td>
                <div className="row-actions">
                  {isEditing ? (
                    <>
                      <button type="button" className="secondary" disabled={busy} onClick={() => save(card)}>
                        Save
                      </button>
                      <button type="button" className="secondary" disabled={busy} onClick={() => setEditing(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="secondary" disabled={busy} onClick={() => startEditing(card)}>
                        Edit
                      </button>
                      <button type="button" className="secondary" disabled={busy} onClick={() => toggleFlag(card)}>
                        {card.flagged ? "Clear flag" : "Flag"}
                      </button>
                      <button
                        type="button"
                        className="secondary"
                        disabled={busy}
                        onClick={() => askForNewSentence(card)}
                      >
                        {card.sentence ? "New sentence" : "Ask for a sentence"}
                      </button>
                      <button type="button" className="secondary" disabled={busy} onClick={() => remove(card)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
            {message && (
              <tr>
                <td colSpan={4}>
                  <p className="notice" role="alert">
                    {message}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        );
      })}
    </table>
  );
}
