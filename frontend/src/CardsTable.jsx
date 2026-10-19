import { useState } from "react";
import { changeCard, deleteCard, newSentence } from "./api.js";

// What each icon of a card does. The legend shows these names, and the buttons are named after them for screen readers.
const ACTIONS = [
  { id: "edit", name: "Edit", icon: "M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" },
  { id: "review", name: "Mark for review", icon: "M7 4h10v16l-5-4-5 4V4z" },
  { id: "new", name: "New sentence", icon: "M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5" },
  { id: "delete", name: "Delete", icon: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v5M14 11v5" },
];

// A small line icon. The text next to it, or the name of the button, says what it means, so the icon is hidden from
// screen readers.
function Icon({ path, filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

const iconOf = (id) => ACTIONS.find((action) => action.id === id).icon;

// The cards of all the texts, as a table the learner reviews: edit a sentence, mark it for review, ask for a new one or
// delete the card. Each action is an icon, and a legend in the top right corner of the box, which stays in view while
// the table scrolls, says what the icons do.
export default function CardsTable({ cards, onCardsChange }) {
  const [editing, setEditing] = useState(null); // { id, sentence } of the card being edited
  const [busy, setBusy] = useState(null); // { id, what } while the product answers; every button waits
  const [notes, setNotes] = useState({}); // card id -> the message shown under that card

  const setNote = (id, message) => setNotes((current) => ({ ...current, [id]: message }));
  const replace = (card) => onCardsChange(cards.map((item) => (item.id === card.id ? card : item)));
  const working = (card, what) => busy?.id === card.id && busy.what === what;

  // Runs one action on a card. A failure leaves the card as it was and shows the message under it.
  async function act(card, what, work) {
    setBusy({ id: card.id, what });
    setNote(card.id, "");
    try {
      await work();
    } catch (error) {
      setNote(card.id, error.message);
    } finally {
      setBusy(null);
    }
  }

  const toggleFlag = (card) =>
    act(card, "flag", async () => replace(await changeCard(card.id, { flagged: !card.flagged })));

  const askForNewSentence = (card) =>
    act(card, "new", async () => {
      replace(await newSentence(card.id));
      setEditing(null);
    });

  const remove = (card) =>
    act(card, "delete", async () => {
      await deleteCard(card.id);
      onCardsChange(cards.filter((item) => item.id !== card.id));
      setEditing(null);
    });

  const startEditing = (card) => setEditing({ id: card.id, sentence: card.sentence ?? "" });

  // The translation is not edited by hand: the product translates the new sentence, so the two always match.
  function save(card) {
    const sentence = editing.sentence.trim();
    if (!sentence) {
      setNote(card.id, "Write the sentence.");
      return;
    }
    if (sentence === card.sentence) {
      setEditing(null);
      return;
    }
    act(card, "save", async () => {
      replace(await changeCard(card.id, { sentence }));
      setEditing(null);
    });
  }

  if (cards.length === 0) {
    return (
      <>
        <div className="cards-header">
          <h2>Your cards</h2>
        </div>
        <p className="hint">No cards left.</p>
      </>
    );
  }

  return (
    <>
      <div className="cards-header">
        <h2>Your cards</h2>
        <ul className="legend" aria-label="What the icons do">
          {ACTIONS.map((action) => (
            <li key={action.id}>
              <Icon path={action.icon} /> {action.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="cards-scroll" tabIndex={0} role="region" aria-label="Your cards">
        <table className="cards">
          <colgroup>
            <col className="col-word" />
            <col />
            <col />
            <col className="col-actions" />
          </colgroup>
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
                    {card.flagged && <span className="badge">Marked for review</span>}
                  </th>
                  <td data-label="Sentence">
                    {isEditing ? (
                      <textarea
                        aria-label={`Sentence for ${card.word}`}
                        value={editing.sentence}
                        onChange={(event) => setEditing({ ...editing, sentence: event.target.value })}
                      />
                    ) : (
                      (card.sentence ?? <span className="empty">No sentence yet.</span>)
                    )}
                  </td>
                  <td data-label="Translation">
                    {card.translation ?? <span className="empty">No translation yet.</span>}
                    {isEditing && <span className="empty note">The translation is made again when you save.</span>}
                  </td>
                  <td>
                    <div className="row-actions">
                      {isEditing ? (
                        <>
                          <button type="button" className="secondary" disabled={busy} onClick={() => save(card)}>
                            {working(card, "save") ? "Saving..." : "Save"}
                          </button>
                          <button type="button" className="secondary" disabled={busy} onClick={() => setEditing(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="secondary icon"
                            disabled={busy}
                            title="Edit"
                            aria-label={`Edit ${card.word}`}
                            onClick={() => startEditing(card)}
                          >
                            <Icon path={iconOf("edit")} />
                          </button>
                          <button
                            type="button"
                            className="secondary icon"
                            disabled={busy}
                            title="Mark for review"
                            aria-label={`Mark ${card.word} for review`}
                            aria-pressed={card.flagged}
                            onClick={() => toggleFlag(card)}
                          >
                            <Icon path={iconOf("review")} filled={card.flagged} />
                          </button>
                          <button
                            type="button"
                            className="secondary icon"
                            disabled={busy}
                            title="New sentence"
                            aria-label={
                              working(card, "new")
                                ? `Asking for a new sentence for ${card.word}`
                                : `New sentence for ${card.word}`
                            }
                            aria-busy={working(card, "new")}
                            onClick={() => askForNewSentence(card)}
                          >
                            <Icon path={iconOf("new")} />
                          </button>
                          <button
                            type="button"
                            className="secondary icon"
                            disabled={busy}
                            title="Delete"
                            aria-label={`Delete ${card.word}`}
                            onClick={() => remove(card)}
                          >
                            <Icon path={iconOf("delete")} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {message && (
                  <tr className="row-note">
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
      </div>
    </>
  );
}
