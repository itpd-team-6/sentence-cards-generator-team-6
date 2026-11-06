import { useEffect, useState } from "react";
import { createDeck, loadDecks } from "./api.js";
import Notice, { newNotice } from "./Notice.jsx";

const LANGUAGE_NAMES = { ru: "Russian", en: "English", de: "German" };

// With this many decks or fewer there is no search box.
const SEARCH_FROM = 12;

// The decks the new cards go in (DEC-020). Only the decks of the language pair of the text are offered, because a deck
// only takes cards of its own pair. The learner ticks one or more, or makes a new one here. `reload` changes when the
// number of cards in the decks may have changed.
export default function DeckPicker({
  textLanguage,
  firstLanguage,
  selected,
  onChange,
  reload,
}) {
  const [decks, setDecks] = useState(null);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState(null);
  const ready = Boolean(textLanguage && firstLanguage);

  useEffect(() => {
    let current = true;
    loadDecks()
      .then((found) => current && setDecks(found))
      .catch((error) => current && setNotice(newNotice(error.message)));
    return () => {
      current = false;
    };
  }, [reload]);

  const ofPair = (decks ?? []).filter(
    (deck) =>
      deck.text_language === textLanguage &&
      deck.first_language === firstLanguage,
  );
  const hidden = (decks ?? []).length - ofPair.length;
  const wanted = query.trim().toLowerCase();
  const shown = wanted
    ? ofPair.filter((deck) => deck.title.toLowerCase().includes(wanted))
    : ofPair;

  function toggle(id) {
    onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id],
    );
  }

  async function makeDeck() {
    if (creating || !title.trim()) return;
    setCreating(true);
    setNotice(null);
    try {
      const deck = await createDeck(title, textLanguage, firstLanguage);
      setDecks((found) => [deck, ...(found ?? [])]);
      onChange([...selected, deck.id]);
      setTitle("");
      setFormOpen(false);
    } catch (error) {
      setNotice(newNotice(error.message));
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="deck-picker" aria-label="Decks">
      <div className="pane-head">
        <h3>Add the new cards to</h3>
        {ready && hidden > 0 && (
          <span className="hint">
            {hidden} {hidden === 1 ? "deck" : "decks"} hidden: different
            language pair
          </span>
        )}
      </div>
      {!ready ? (
        <p className="hint">
          Choose the text language and your first language to see the decks for
          them.
        </p>
      ) : (
        <>
          {ofPair.length > SEARCH_FROM && (
            <div className="deck-search">
              <input
                type="text"
                value={query}
                placeholder="Search decks"
                aria-label="Search decks"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          )}
          <div className="deck-grid" role="group" aria-label="Decks">
            {shown.map((deck) => (
              <button
                type="button"
                key={deck.id}
                className="deck-card"
                role="checkbox"
                aria-checked={selected.includes(deck.id)}
                onClick={() => toggle(deck.id)}
              >
                <span className="deck-box" aria-hidden="true">
                  ✓
                </span>
                <span className="deck-card-title">{deck.title}</span>
                <span className="deck-card-meta">
                  {deck.card_count} {deck.card_count === 1 ? "card" : "cards"}
                </span>
              </button>
            ))}
            <button
              type="button"
              className="deck-card new-deck"
              onClick={() => setFormOpen(true)}
            >
              + New deck
            </button>
          </div>
          {formOpen && (
            <div className="deck-form">
              <input
                type="text"
                value={title}
                maxLength={60}
                autoFocus
                placeholder="Deck title, for example Travel A2"
                aria-label="New deck title"
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    makeDeck();
                  }
                }}
              />
              <button
                type="button"
                className="primary"
                disabled={creating || !title.trim()}
                onClick={makeDeck}
              >
                Create deck
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </button>
              <p className="hint deck-form-hint">
                The new deck gets the pair {LANGUAGE_NAMES[textLanguage]} to{" "}
                {LANGUAGE_NAMES[firstLanguage]} from your choice above.
              </p>
            </div>
          )}
        </>
      )}
      {notice && <Notice notice={notice} onDismiss={() => setNotice(null)} />}
    </section>
  );
}
