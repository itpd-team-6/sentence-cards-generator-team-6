import { useEffect, useId, useRef, useState } from "react";
import { pairName } from "./CardFilters.jsx";
import { pairOf } from "./cardFilters.js";

// The state of a deck for the chosen cards: all of them are in it, some are, or none is.
const stateOf = (deck, cards) => {
  const inside = cards.filter((card) =>
    card.decks?.some((item) => item.id === deck.id),
  ).length;
  if (inside === 0) return "none";
  return inside === cards.length ? "all" : "some";
};

// The box where the learner changes the decks of the chosen cards (FR-020). Each deck of the cards' language pair has a
// box: ticked when every chosen card is in it, dashed when only some are, empty when none is. Ticking a deck puts all the
// cards in it, and unticking it takes them all out. Only the cards' link to the decks changes, so they keep their
// progress. The deck "Uncategorized" is not offered: a card goes there by itself when it is in no other deck (DEC-065).
// `onSave` gets the decks to add and the decks to remove, and the parent shows a problem through `error`.
export default function CardDecksDialog({
  cards,
  decks,
  saving = false,
  error = "",
  onSave,
  onCancel,
}) {
  const prefix = useId();
  const dialog = useRef(null);
  const pairs = [...new Set(cards.map(pairOf))];
  const available =
    pairs.length === 1
      ? decks.filter(
          (deck) =>
            !deck.uncategorized &&
            `${deck.text_language}>${deck.first_language}` === pairs[0],
        )
      : [];
  const [choice, setChoice] = useState(() =>
    Object.fromEntries(
      available.map((deck) => [deck.id, stateOf(deck, cards)]),
    ),
  );

  useEffect(() => {
    const box = dialog.current;
    if (!box || box.open) return;
    if (typeof box.showModal === "function") box.showModal();
    else box.setAttribute("open", "");
  }, []);

  const toggle = (deck) =>
    setChoice((current) => ({
      ...current,
      [deck.id]: current[deck.id] === "all" ? "none" : "all",
    }));

  const add = available
    .filter(
      (deck) => choice[deck.id] === "all" && stateOf(deck, cards) !== "all",
    )
    .map((deck) => deck.id);
  const remove = available
    .filter(
      (deck) => choice[deck.id] === "none" && stateOf(deck, cards) !== "none",
    )
    .map((deck) => deck.id);
  const nothing = add.length === 0 && remove.length === 0;
  const count = `${cards.length} ${cards.length === 1 ? "card" : "cards"}`;

  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby={`${prefix}-title`}
      onClose={onCancel}
      onClick={(event) =>
        event.target === event.currentTarget && !saving && onCancel()
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (nothing) onCancel();
          else onSave(add, remove);
        }}
      >
        <h3 id={`${prefix}-title`}>Decks of {count}</h3>
        {pairs.length > 1 && (
          <p className="hint">
            The selected cards are for different languages. Select cards of one
            language pair to change their decks.
          </p>
        )}
        {pairs.length === 1 && (
          <>
            <p className="note">
              {pairName(pairs[0])}. A card stays in the decks you do not change,
              and keeps its progress.
            </p>
            {available.length === 0 && (
              <p className="hint">
                There is no deck for this language pair yet.
              </p>
            )}
            <ul className="deck-choices">
              {available.map((deck) => (
                <li key={deck.id}>
                  <label className="filter-item">
                    <input
                      type="checkbox"
                      className="queue-check"
                      checked={choice[deck.id] === "all"}
                      ref={(box) =>
                        box && (box.indeterminate = choice[deck.id] === "some")
                      }
                      onChange={() => toggle(deck)}
                    />
                    <span className="filter-name">{deck.title}</span>
                    <span className="filter-count">
                      {
                        { all: "all", some: "some", none: "none" }[
                          stateOf(deck, cards)
                        ]
                      }
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
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
          <button
            type="submit"
            className="primary"
            disabled={saving || pairs.length !== 1}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
