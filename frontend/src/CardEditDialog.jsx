import { useEffect, useId, useRef, useState } from "react";
import { hrefOfText } from "./router.js";

// The box where the learner changes a card: its sentence and translation, and its context phrase when `showPhrase` is
// true. It is shared by the list of cards and by the study session, so a card is edited the same way in both places.
// The box checks what was written, and calls `onSave` with only the fields that changed, or `onCancel` when nothing did.
// The translation follows the sentence unless the learner writes it or locks it: when only the sentence changes, the
// product translates the new one; a translation the learner writes is kept as written. The phrase identifies the card
// with its word (DEC-013): the product refuses a phrase that another card of the word already has, and the parent shows
// the reason through `error`, so the box stays open and nothing the learner wrote is lost.
export default function CardEditDialog({
  card,
  showPhrase = true,
  saving = false,
  error = "",
  onSave,
  onCancel,
}) {
  const prefix = useId();
  const dialog = useRef(null);
  const [phrase, setPhrase] = useState(card.phrase ?? "");
  const [sentence, setSentence] = useState(card.sentence ?? "");
  const [translation, setTranslation] = useState(card.translation ?? "");
  const [problem, setProblem] = useState("");

  useEffect(() => {
    const box = dialog.current;
    if (!box || box.open) return;
    if (typeof box.showModal === "function") box.showModal();
    else box.setAttribute("open", "");
  }, []);

  function submit(event) {
    event.preventDefault();
    const nextPhrase = phrase.trim().split(/\s+/).filter(Boolean).join(" ");
    const nextSentence = sentence.trim();
    const nextTranslation = translation.trim();
    if (showPhrase && card.phrase && !nextPhrase) {
      setProblem("Write the context phrase.");
      return;
    }
    if (!nextSentence) {
      setProblem("Write the sentence.");
      return;
    }
    if (card.translation && !nextTranslation) {
      setProblem("Write the translation.");
      return;
    }
    const fields = {};
    if (showPhrase && nextPhrase && nextPhrase !== (card.phrase ?? ""))
      fields.phrase = nextPhrase;
    if (nextSentence !== card.sentence) fields.sentence = nextSentence;
    if (nextTranslation && nextTranslation !== card.translation)
      fields.translation = nextTranslation;
    if (Object.keys(fields).length === 0) {
      onCancel();
      return;
    }
    setProblem("");
    onSave(fields);
  }

  const shown = problem || error;
  return (
    <dialog
      ref={dialog}
      className="modal editor"
      aria-labelledby={`${prefix}-title`}
      onClose={onCancel}
      onClick={(event) =>
        event.target === event.currentTarget && !saving && onCancel()
      }
    >
      <form onSubmit={submit}>
        <h3 id={`${prefix}-title`}>Edit {card.word}</h3>
        {showPhrase && (
          <>
            <label className="field-label" htmlFor={`${prefix}-phrase`}>
              Context phrase
            </label>
            <input
              id={`${prefix}-phrase`}
              type="text"
              autoFocus
              autoComplete="off"
              aria-describedby={`${prefix}-phrase-hint`}
              value={phrase}
              placeholder={card.phrase ? undefined : "No context phrase yet"}
              onChange={(event) => setPhrase(event.target.value)}
            />
            <p id={`${prefix}-phrase-hint`} className="note">
              Three or four words that show the meaning {card.word} has on this
              card. A word has only one card for each context phrase.
            </p>
          </>
        )}
        <label className="field-label" htmlFor={`${prefix}-sentence`}>
          Sentence
        </label>
        <textarea
          id={`${prefix}-sentence`}
          autoFocus={!showPhrase}
          value={sentence}
          onChange={(event) => setSentence(event.target.value)}
        />
        <label className="field-label" htmlFor={`${prefix}-translation`}>
          Translation
        </label>
        <textarea
          id={`${prefix}-translation`}
          aria-describedby={`${prefix}-translation-hint`}
          value={translation}
          onChange={(event) => setTranslation(event.target.value)}
        />
        <p id={`${prefix}-translation-hint`} className="note">
          {card.translation_locked
            ? "The translation is locked, so it stays when the sentence changes."
            : "Change only the sentence and the translation is made again when you save."}
        </p>
        {showPhrase && card.texts?.length > 0 && (
          <div className="from-texts">
            <span className="field-label">From texts</span>
            <ul>
              {card.texts.map((text) => (
                <li key={text.id}>
                  <a href={hrefOfText(text.id)} onClick={onCancel}>
                    {text.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {shown && (
          <p className="form-error" role="alert">
            {shown}
          </p>
        )}
        <div className="modal-actions">
          <button
            type="button"
            className="secondary"
            disabled={saving}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
