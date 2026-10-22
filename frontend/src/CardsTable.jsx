import { useEffect, useMemo, useRef, useState } from "react";
import { changeCard, deleteCard, deleteCards, hideCards, newSentence, newSentences } from "./api.js";
import Notice, { newNotice } from "./Notice.jsx";

// What each icon of a card does. The legend shows these names, and the buttons are named after them for screen readers.
const ACTIONS = [
  { id: "edit", name: "Edit", icon: "M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" },
  { id: "review", name: "Mark for review", icon: "M7 4h10v16l-5-4-5 4V4z" },
  {
    id: "hide",
    name: "Hide",
    icon: "M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4 4l16 16",
  },
  {
    id: "lock",
    name: "Lock translation",
    icon: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5zM12 15v2",
  },
  { id: "new", name: "New sentence", icon: "M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5" },
  { id: "delete", name: "Delete", icon: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v5M14 11v5" },
];

// A small line icon. The text next to it, or the name of the button, says what it means, so the icon is hidden from
// screen readers.
function Icon({ path, filled = false, spinning = false }) {
  return (
    <svg
      className={spinning ? "spin" : undefined}
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

// The lock of a translation that is not locked: the shackle is open.
const OPEN_LOCK = "M7 11V8a5 5 0 0 1 9.6-2M5 11h14v10H5zM12 15v2";

const iconOf = (id) => ACTIONS.find((action) => action.id === id).icon;

// "Working on 2 cards" with one, two and three dots in turn, until the answer comes. A learner who asked for less motion
// sees the three dots still. The dots are hidden from screen readers, which read "Working on 2 cards".
function Working({ count }) {
  const still = useMemo(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false, []);
  const [dots, setDots] = useState(0);
  useEffect(() => {
    if (still) return undefined;
    const timer = setInterval(() => setDots((current) => (current + 1) % 4), 400);
    return () => clearInterval(timer);
  }, [still]);
  return (
    <>
      {`Working on ${count} ${count === 1 ? "card" : "cards"}`}
      <span className="dots" aria-hidden="true">
        {".".repeat(still ? 3 : dots)}
      </span>
    </>
  );
}

// The cards of all the texts, as a table the learner reviews: edit a sentence, mark it for review, hide it from study,
// ask for a new sentence or delete the card. Each action is an icon, and a legend in the top right corner of the box,
// which stays in view while the table scrolls, says what the icons do. A box in the first column selects cards, and the
// box in its header selects all the cards or none. While cards are selected, a bar under the table, in view at the bottom
// of the window, acts on them: a new sentence for each, hide them from study or show them again, or delete them after
// the learner confirms. Without a selection the bar is not there, and the table does not move when it appears.
export default function CardsTable({ cards, onCardsChange }) {
  const [editing, setEditing] = useState(null); // { id, sentence, translation } of the card being edited
  const [busy, setBusy] = useState(null); // { id, what } while the product answers; every button waits
  const [notes, setNotes] = useState({}); // card id -> the message about that card, or null when it went away
  const [ticked, setTicked] = useState(new Set()); // ids of the cards selected for an action on several cards
  const [confirming, setConfirming] = useState(false); // asking whether to delete the selected cards
  const [batchNotice, setBatchNotice] = useState(null); // the problem with an action on several cards
  const deleteDialog = useRef(null);

  const setNote = (id, message) => setNotes((current) => ({ ...current, [id]: message ? newNotice(message) : null }));
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

  // A locked translation is not changed by the product, whatever happens to the sentence (DEC-014).
  const toggleLock = (card) =>
    act(card, "lock", async () => replace(await changeCard(card.id, { translation_locked: !card.translation_locked })));

  const toggleHidden = (card) =>
    act(card, "hide", async () => replace(await changeCard(card.id, { hidden: !card.hidden })));

  const untick = (ids) => setTicked((current) => new Set([...current].filter((id) => !ids.includes(id))));

  const toggleTick = (card) =>
    setTicked((current) => {
      const next = new Set(current);
      if (!next.delete(card.id)) next.add(card.id);
      return next;
    });

  const allTicked = cards.length > 0 && cards.every((card) => ticked.has(card.id));
  const chosen = cards.filter((card) => ticked.has(card.id));
  const asking = confirming && chosen.length > 0; // the question "delete these cards?" is on the screen

  // The question is a modal box: the rest of the page waits until the learner answers it.
  useEffect(() => {
    const dialog = deleteDialog.current;
    if (!dialog) return;
    if (asking && !dialog.open) dialog.showModal();
    if (!asking && dialog.open) dialog.close();
  }, [asking, cards.length]);

  // Runs an action on the selected cards. Every button waits, as for one card; `what` says which action is running.
  async function actOnChosen(what, work) {
    setBusy({ id: 0, what });
    setBatchNotice(null);
    try {
      await work();
    } catch (error) {
      setBatchNotice(newNotice(error.message));
    } finally {
      setBusy(null);
    }
  }

  const askForNewSentences = () =>
    actOnChosen("sentences", async () => {
      const ids = chosen.map((card) => card.id);
      const answered = await newSentences(ids);
      onCardsChange(cards.map((card) => answered.find((item) => item.id === card.id) ?? card));
      setEditing(null);
      // One message for all the cards, with the reason the model gave for the first one, not one message for each.
      const failed = answered.filter((item) => item.error);
      if (failed.length) {
        setBatchNotice(newNotice(`${failed.length} of ${ids.length} cards kept their sentence. ${failed[0].error}`));
      }
    });

  const hideChosen = (hidden) =>
    actOnChosen("hide", async () => {
      const answered = await hideCards(
        chosen.map((card) => card.id),
        hidden,
      );
      onCardsChange(cards.map((card) => answered.find((item) => item.id === card.id) ?? card));
    });

  async function deleteChosen() {
    await actOnChosen("delete", async () => {
      const ids = chosen.map((card) => card.id);
      await deleteCards(ids);
      onCardsChange(cards.filter((card) => !ids.includes(card.id)));
      untick(ids);
      setEditing(null);
    });
    setConfirming(false);
  }

  const askForNewSentence = (card) =>
    act(card, "new", async () => {
      replace(await newSentence(card.id));
      setEditing(null);
    });

  const remove = (card) =>
    act(card, "delete", async () => {
      await deleteCard(card.id);
      onCardsChange(cards.filter((item) => item.id !== card.id));
      untick([card.id]);
      setEditing(null);
    });

  const startEditing = (card) =>
    setEditing({ id: card.id, sentence: card.sentence ?? "", translation: card.translation ?? "" });

  // The translation follows the sentence unless the learner writes it or locks it: when only the sentence changes, the
  // product translates the new one; a translation the learner writes is kept as written.
  function save(card) {
    const sentence = editing.sentence.trim();
    const translation = editing.translation.trim();
    if (!sentence) {
      setNote(card.id, "Write the sentence.");
      return;
    }
    if (card.translation && !translation) {
      setNote(card.id, "Write the translation.");
      return;
    }
    const fields = {};
    if (sentence !== card.sentence) fields.sentence = sentence;
    if (translation && translation !== card.translation) fields.translation = translation;
    if (Object.keys(fields).length === 0) {
      setEditing(null);
      return;
    }
    act(card, "save", async () => {
      replace(await changeCard(card.id, fields));
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
      {batchNotice && <Notice notice={batchNotice} onDismiss={() => setBatchNotice(null)} />}
      {cards.map((card) => {
        const note = notes[card.id];
        // The message is away from the row, so it names the word it is about.
        return (
          note && (
            <Notice
              key={card.id}
              notice={{ ...note, text: `${card.word}: ${note.text}` }}
              onDismiss={() => setNote(card.id, "")}
            />
          )
        );
      })}
      <dialog
        ref={deleteDialog}
        className="modal"
        aria-labelledby="delete-title"
        onClose={() => setConfirming(false)}
        onClick={(event) => event.target === event.currentTarget && !busy && setConfirming(false)}
      >
        <h3 id="delete-title">
          Delete {chosen.length} {chosen.length === 1 ? "card" : "cards"}?
        </h3>
        <p>This cannot be undone.</p>
        <div className="modal-actions">
          <button type="button" className="secondary" autoFocus disabled={busy} onClick={() => setConfirming(false)}>
            Cancel
          </button>
          <button type="button" className="primary" disabled={busy} onClick={deleteChosen}>
            {busy?.what === "delete" ? "Deleting..." : `Delete ${chosen.length}`}
          </button>
        </div>
      </dialog>
      <div className="cards-scroll" tabIndex={0} role="region" aria-label="Your cards">
        <table className="cards">
          <colgroup>
            <col className="col-select" />
            <col className="col-word" />
            <col />
            <col />
            <col className="col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="select-cell">
                <input
                  type="checkbox"
                  className="queue-check"
                  aria-label="Select all cards"
                  checked={allTicked}
                  ref={(box) => box && (box.indeterminate = chosen.length > 0 && !allTicked)}
                  disabled={busy}
                  onChange={() => setTicked(allTicked ? new Set() : new Set(cards.map((card) => card.id)))}
                />
              </th>
              <th scope="col">Word</th>
              <th scope="col">Sentence</th>
              <th scope="col">Translation</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          {cards.map((card) => {
            const isEditing = editing?.id === card.id;
            const regenerating = working(card, "new") || (busy?.what === "sentences" && ticked.has(card.id));
            return (
              <tbody
                key={card.id}
                className={
                  [card.flagged && "flagged", card.hidden && "hidden-card"].filter(Boolean).join(" ") || undefined
                }
              >
                <tr>
                  <td className="select-cell">
                    <input
                      type="checkbox"
                      className="queue-check"
                      aria-label={`Select ${card.word}`}
                      checked={ticked.has(card.id)}
                      onChange={() => toggleTick(card)}
                    />
                  </td>
                  <th scope="row">
                    {card.word}
                    {card.flagged && <span className="badge">Marked for review</span>}
                    {card.hidden && <span className="badge hidden-badge">Hidden from study</span>}
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
                    {isEditing ? (
                      <textarea
                        aria-label={`Translation for ${card.word}`}
                        value={editing.translation}
                        onChange={(event) => setEditing({ ...editing, translation: event.target.value })}
                      />
                    ) : (
                      <span className="translation-line">
                        <span>{card.translation ?? <span className="empty">No translation yet.</span>}</span>
                        <button
                          type="button"
                          className="secondary icon lock"
                          disabled={busy || !card.translation}
                          title={card.translation_locked ? "Unlock the translation" : "Lock the translation"}
                          aria-label={
                            card.translation_locked
                              ? `Unlock the translation of ${card.word}`
                              : `Lock the translation of ${card.word}`
                          }
                          aria-pressed={card.translation_locked}
                          onClick={() => toggleLock(card)}
                        >
                          <Icon path={card.translation_locked ? iconOf("lock") : OPEN_LOCK} />
                        </button>
                      </span>
                    )}
                    {isEditing && (
                      <span className="empty note">
                        {card.translation_locked
                          ? "The translation is locked, so it stays when the sentence changes."
                          : "Change only the sentence and the translation is made again when you save."}
                      </span>
                    )}
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
                            title={card.hidden ? "Show in study" : "Hide from study"}
                            aria-label={card.hidden ? `Show ${card.word} in study` : `Hide ${card.word} from study`}
                            aria-pressed={card.hidden}
                            onClick={() => toggleHidden(card)}
                          >
                            <Icon path={iconOf("hide")} filled={card.hidden} />
                          </button>
                          <button
                            type="button"
                            className="secondary icon"
                            disabled={busy}
                            title="New sentence"
                            aria-label={
                              regenerating
                                ? `Asking for a new sentence for ${card.word}`
                                : `New sentence for ${card.word}`
                            }
                            aria-busy={regenerating}
                            onClick={() => askForNewSentence(card)}
                          >
                            <Icon path={iconOf("new")} spinning={regenerating} />
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
              </tbody>
            );
          })}
        </table>
      </div>
      {chosen.length > 0 && (
        <div className="bulk-bar" role="toolbar" aria-label="Select cards and act on the selected ones">
          <div className="bulk-group">
            <span className="bulk-count" aria-live="polite">
              {chosen.length} selected
            </span>
            <button
              type="button"
              className="queue-pill"
              disabled={busy || allTicked}
              onClick={() => setTicked(new Set(cards.map((card) => card.id)))}
            >
              Select all
            </button>
            <button
              type="button"
              className="queue-pill"
              disabled={busy || chosen.length === 0}
              onClick={() => setTicked(new Set())}
            >
              Clear selection
            </button>
          </div>
          <div className="bulk-group">
            <button
              type="button"
              className="secondary"
              disabled={busy || chosen.length === 0}
              onClick={askForNewSentences}
            >
              {busy?.what === "sentences" ? <Working count={chosen.length} /> : "New sentences"}
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy || chosen.length === 0}
              onClick={() => hideChosen(true)}
            >
              Hide
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy || chosen.length === 0}
              onClick={() => hideChosen(false)}
            >
              Show
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy || chosen.length === 0}
              onClick={() => setConfirming(true)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
}
