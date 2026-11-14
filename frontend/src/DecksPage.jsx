import { useEffect, useState } from "react";
import { createDeck, loadDecks, loadDueCards } from "./api.js";
import { pairName } from "./CardFilters.jsx";
import LanguagePicker from "./LanguagePicker.jsx";
import Notice, { newNotice } from "./Notice.jsx";
import { hrefOfDeck } from "./router.js";
import { summarize } from "./todaySummary.js";

// The form that makes a new, empty deck: a title, and the language pair its cards will have (DEC-020). It has the same
// fields and the same language buttons as the form that adds a text.
function NewDeckForm({ onCreated, onCancel }) {
  const [title, setTitle] = useState("");
  const [textLanguage, setTextLanguage] = useState("");
  const [firstLanguage, setFirstLanguage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const ready =
    title.trim() !== "" &&
    textLanguage !== "" &&
    firstLanguage !== "" &&
    textLanguage !== firstLanguage;

  async function submit(event) {
    event.preventDefault();
    if (!ready || saving) return;
    setSaving(true);
    setError("");
    try {
      onCreated(await createDeck(title, textLanguage, firstLanguage));
    } catch (problem) {
      setError(problem.message);
      setSaving(false);
    }
  }

  return (
    <form className="new-deck-form" onSubmit={submit}>
      <label className="field">
        <span className="field-label">Title</span>
        <input
          className="wide-field"
          type="text"
          maxLength={60}
          autoFocus
          autoComplete="off"
          placeholder="For example, Travel A2"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <div className="new-deck-pickers">
        <LanguagePicker
          label="Text language"
          name="new-deck-text-language"
          value={textLanguage}
          onChange={setTextLanguage}
          taken={firstLanguage}
        />
        <LanguagePicker
          label="Your first language"
          name="new-deck-first-language"
          value={firstLanguage}
          onChange={setFirstLanguage}
          taken={textLanguage}
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="button-row">
        <button type="submit" className="primary" disabled={!ready || saving}>
          {saving ? "Creating..." : "Create deck"}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// The Decks tab (FR-022): one tile for each deck, with the cards to study today, the share the learner has learned and
// how many cards it has. A tile opens the deck. The deck "Uncategorized" is a deck like the others, shown after them.
// "de>ru" as "DE → RU", the short form the Study page uses for a pair, so that all the pairs fit in one row.
const shortPair = (pair) => pair.toUpperCase().replace(">", " → ");

const pairOf = (deck) => `${deck.text_language}>${deck.first_language}`;

// Search shows up only when there are enough decks for it to help.
const SEARCH_FROM = 6;

// One language pair: its name, how many decks it has, and the decks as tiles.
function DeckGroup({ pair, decks, dueByDeck }) {
  return (
    <section className="deck-group" aria-label={pairName(pair)}>
      <h3 className="deck-group-head">
        {pairName(pair)}
        <span>
          {decks.length} {decks.length === 1 ? "deck" : "decks"}
        </span>
      </h3>
      <ul className="deck-tiles">
        {decks.map((deck) => {
          const due = dueByDeck.get(deck.id) ?? 0;
          return (
            <li key={deck.id}>
              <a className="deck-tile" href={hrefOfDeck(deck.id)}>
                <h4>{deck.title}</h4>
                <span className="deck-tile-due">
                  {due > 0 ? (
                    <>
                      <b>{due}</b>
                      <small>to study today</small>
                    </>
                  ) : (
                    <small>nothing to study today</small>
                  )}
                </span>
                <span
                  className="deck-tile-bar"
                  role="img"
                  aria-label={`${deck.learned_percent}% learned`}
                >
                  <i style={{ width: `${deck.learned_percent}%` }} />
                </span>
                <span className="deck-tile-meta">
                  <span>
                    {deck.card_count} {deck.card_count === 1 ? "card" : "cards"}
                  </span>
                  <span>{deck.learned_percent}% learned</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// The quick way to see only some decks: the language pairs as buttons to switch on (none on means all), and a search by
// title. Each one shows up only when it can help, so a learner with few decks sees a plain page.
function DeckFilter({ pairs, chosen, onToggle, showSearch, search, onSearch }) {
  return (
    <div className="decks-filter">
      {showSearch && (
        <div className="cards-search-box">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            spellCheck={false}
            className="cards-search deck-search-input"
            value={search}
            placeholder="Search decks"
            aria-label="Search decks"
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>
      )}
      {pairs.length > 1 && (
        <div
          className="pair-chips"
          role="group"
          aria-label="Show language pairs"
        >
          {pairs.map((pair) => (
            <button
              key={pair}
              type="button"
              className="pair-chip"
              title={pairName(pair)}
              aria-pressed={chosen.includes(pair)}
              onClick={() => onToggle(pair)}
            >
              {shortPair(pair)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DecksPage() {
  const [decks, setDecks] = useState(null);
  const [dueByDeck, setDueByDeck] = useState(new Map());
  const [failed, setFailed] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [chosen, setChosen] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let current = true;
    Promise.all([loadDecks(), loadDueCards()])
      .then(([loadedDecks, due]) => {
        if (!current) return;
        setDueByDeck(
          new Map(summarize(due).decks.map((deck) => [deck.id, deck.count])),
        );
        setDecks(loadedDecks);
      })
      .catch(() => current && setFailed(true));
    return () => {
      current = false;
    };
  }, []);

  const all = decks ?? [];
  const pairs = [...new Set(all.map(pairOf))].sort((a, b) =>
    pairName(a).localeCompare(pairName(b)),
  );
  const query = search.trim().toLowerCase();
  const shown = all
    .filter(
      (deck) =>
        (chosen.length === 0 || chosen.includes(pairOf(deck))) &&
        deck.title.toLowerCase().includes(query),
    )
    .sort(
      (a, b) =>
        Number(a.uncategorized) - Number(b.uncategorized) ||
        a.title.localeCompare(b.title),
    );
  const groups = pairs
    .map((pair) => ({
      pair,
      decks: shown.filter((deck) => pairOf(deck) === pair),
    }))
    .filter((group) => group.decks.length > 0);
  const filtering = chosen.length > 0 || query !== "";

  return (
    <section className="panel decks-panel cards-wide">
      <div className="decks-head">
        <h2>Decks</h2>
        <button
          type="button"
          className="primary"
          aria-expanded={formOpen}
          onClick={() => setFormOpen(true)}
        >
          New deck
        </button>
      </div>
      {formOpen && (
        <NewDeckForm
          onCancel={() => setFormOpen(false)}
          onCreated={(deck) => {
            setDecks((found) => [...(found ?? []), deck]);
            setFormOpen(false);
            setNotice(
              newNotice(`The deck “${deck.title}” was made.`, "success"),
            );
          }}
        />
      )}
      {failed && (
        <p className="hint" role="alert">
          The decks could not be loaded. Is the product running?
        </p>
      )}
      {!failed && decks === null && <p className="hint">Loading...</p>}
      {decks?.length === 0 && (
        <p className="hint">
          No decks yet. Make one here, or when you make cards from a text.
        </p>
      )}
      {decks?.length > 0 && (
        <>
          <DeckFilter
            pairs={pairs}
            chosen={chosen}
            onToggle={(pair) =>
              setChosen((now) =>
                now.includes(pair)
                  ? now.filter((one) => one !== pair)
                  : [...now, pair],
              )
            }
            showSearch={decks.length >= SEARCH_FROM}
            search={search}
            onSearch={setSearch}
          />
          {groups.map((group) => (
            <DeckGroup
              key={group.pair}
              pair={group.pair}
              decks={group.decks}
              dueByDeck={dueByDeck}
            />
          ))}
          {groups.length === 0 && (
            <p className="hint">
              No deck matches.{" "}
              {filtering && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setChosen([]);
                    setSearch("");
                  }}
                >
                  Show all decks
                </button>
              )}
            </p>
          )}
        </>
      )}
      {notice && <Notice notice={notice} onDismiss={() => setNotice(null)} />}
    </section>
  );
}
