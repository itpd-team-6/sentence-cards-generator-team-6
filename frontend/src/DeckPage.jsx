import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  DATA_CHANGED,
  changeCardDecks,
  deleteDeck,
  loadCards,
  loadDeck,
  loadDecks,
  loadDueCards,
  renameDeck,
} from "./api.js";
import { pairName } from "./CardFilters.jsx";
import { matchesSearch, pairOf, sortCards } from "./cardFilters.js";
import CardsTable from "./CardsTable.jsx";
import { requestStartNow, writeTickedDecks } from "./deckSelection.js";
import Notice, { newNotice } from "./Notice.jsx";
import { hrefOf, hrefOfDeck } from "./router.js";
import { summarize } from "./todaySummary.js";

const cardsOf = (n) => `${n} ${n === 1 ? "card" : "cards"}`;

// Opens a <dialog> as a modal box when it is made, like the other boxes of the product.
function useModal() {
  const dialog = useRef(null);
  useEffect(() => {
    const box = dialog.current;
    if (!box || box.open) return;
    if (typeof box.showModal === "function") box.showModal();
    else box.setAttribute("open", "");
  }, []);
  return dialog;
}

// The box that deletes a deck (DEC-065). It says how many cards are only in the deck and how many are also in another
// deck. The cards that are in another deck are never deleted. For the cards that are only here the learner chooses:
// keep them in the deck "Uncategorized" of their language pair, or delete them with the deck. The deck "Uncategorized"
// itself can only be deleted together with its cards.
function DeleteDeckDialog({ deck, saving, error, onDelete, onCancel }) {
  const prefix = useId();
  const dialog = useModal();
  const [choice, setChoice] = useState(deck.uncategorized ? "delete" : "keep");
  const only = deck.cards_only_here;
  const elsewhere = deck.cards_elsewhere;
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
          onDelete(only > 0 ? choice : null);
        }}
      >
        <h3 id={`${prefix}-title`}>Delete the deck “{deck.title}”?</h3>
        {deck.card_count === 0 && <p>The deck has no cards.</p>}
        {deck.card_count > 0 && (
          <p>
            {only} of its {cardsOf(deck.card_count)} {only === 1 ? "is" : "are"}{" "}
            only in this deck, and {elsewhere} {elsewhere === 1 ? "is" : "are"}{" "}
            also in another deck.
            {elsewhere > 0 &&
              " The cards that are in another deck are not deleted."}
          </p>
        )}
        {only > 0 && !deck.uncategorized && (
          <fieldset className="delete-choice">
            <legend className="visually-hidden">
              What happens to the cards that are only in this deck
            </legend>
            <label className="choice">
              <input
                type="radio"
                name={`${prefix}-cards`}
                checked={choice === "keep"}
                onChange={() => setChoice("keep")}
              />
              <span>Keep {cardsOf(only)} in Uncategorized</span>
            </label>
            <label className="choice">
              <input
                type="radio"
                name={`${prefix}-cards`}
                checked={choice === "delete"}
                onChange={() => setChoice("delete")}
              />
              <span>Delete {cardsOf(only)} with the deck</span>
            </label>
          </fieldset>
        )}
        {only > 0 && deck.uncategorized && (
          <p>
            Uncategorized can only be deleted together with its cards, so{" "}
            {cardsOf(only)} will be deleted.
          </p>
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
          <button type="submit" className="primary danger" disabled={saving}>
            {saving ? "Deleting..." : "Delete deck"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

// The box that puts cards of the same language pair in the deck. Only the link changes, so a card keeps its progress.
function AddCardsDialog({ deck, candidates, saving, error, onSave, onCancel }) {
  const prefix = useId();
  const dialog = useModal();
  const [query, setQuery] = useState("");
  const [ticked, setTicked] = useState(new Set());
  const shown = candidates.filter((card) => matchesSearch(card, query));
  const toggle = (id) =>
    setTicked((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  return (
    <dialog
      ref={dialog}
      className="modal editor add-cards"
      aria-labelledby={`${prefix}-title`}
      onClose={onCancel}
      onClick={(event) =>
        event.target === event.currentTarget && !saving && onCancel()
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (ticked.size > 0) onSave([...ticked]);
        }}
      >
        <h3 id={`${prefix}-title`}>Add cards to “{deck.title}”</h3>
        {candidates.length === 0 ? (
          <p className="hint">
            Every card of this language pair is already in this deck.
          </p>
        ) : (
          <>
            <input
              type="search"
              className="wide-field"
              value={query}
              placeholder="Search the cards"
              aria-label="Search the cards"
              onChange={(event) => setQuery(event.target.value)}
            />
            <ul className="deck-choices">
              {shown.map((card) => (
                <li key={card.id}>
                  <label className="filter-item">
                    <input
                      type="checkbox"
                      className="queue-check"
                      checked={ticked.has(card.id)}
                      onChange={() => toggle(card.id)}
                    />
                    <span className="filter-name">{card.word}</span>
                    <span className="filter-count">
                      {card.decks.map((item) => item.title).join(", ")}
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
            disabled={saving || ticked.size === 0}
          >
            {saving ? "Saving..." : `Add ${cardsOf(ticked.size)}`}
          </button>
        </div>
      </form>
    </dialog>
  );
}

// A deck (FR-022): its name, what there is to study in it today, and its cards, which are changed like in Your cards. The
// learner renames it, studies only it, adds cards to it or deletes it. `deckId` comes from the address `#/decks/3`.
export default function DeckPage({ deckId }) {
  const [deck, setDeck] = useState(null);
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState(null);
  const [due, setDue] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading", "ready", "missing" or "failed"
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState("");
  const [renaming, setRenaming] = useState(null); // the title being typed while the deck is renamed, or null
  const [renameError, setRenameError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [notice, setNotice] = useState(null);

  // After a change anywhere in the product the deck is read again, so its counts are right.
  useEffect(() => {
    const again = () => setReload((count) => count + 1);
    window.addEventListener(DATA_CHANGED, again);
    return () => window.removeEventListener(DATA_CHANGED, again);
  }, []);

  useEffect(() => {
    let current = true;
    Promise.all([
      loadDeck(deckId),
      loadDecks(),
      loadCards(),
      loadDueCards([deckId]),
    ])
      .then(([loadedDeck, loadedDecks, loadedCards, loadedDue]) => {
        if (!current) return;
        setDeck(loadedDeck);
        setDecks(loadedDecks);
        setCards(loadedCards);
        setDue(loadedDue);
        setStatus("ready");
      })
      .catch((error) => {
        if (current) setStatus(error.status === 404 ? "missing" : "failed");
      });
    return () => {
      current = false;
    };
  }, [deckId, reload]);

  const inDeck = useMemo(
    () =>
      (cards ?? []).filter((card) =>
        card.decks?.some((item) => item.id === deckId),
      ),
    [cards, deckId],
  );
  const shown = useMemo(
    () =>
      sortCards(
        inDeck.filter((card) => matchesSearch(card, search)),
        "newest",
      ),
    [inDeck, search],
  );

  // The table changes the cards it was given, which are the listed ones: the cards it keeps replace theirs, and a card it
  // no longer has was deleted.
  const changeShown = (next) =>
    setCards((all) => {
      const listed = new Set(shown.map((card) => card.id));
      const byId = new Map(next.map((card) => [card.id, card]));
      return all
        .filter((card) => !listed.has(card.id) || byId.has(card.id))
        .map((card) => byId.get(card.id) ?? card);
    });

  if (status === "loading") return <p className="hint panel">Loading...</p>;
  if (status !== "ready") {
    return (
      <section className="panel cards-wide">
        <div className="saved-head">
          <a className="back-link" href={hrefOf("decks")}>
            ← Decks
          </a>
        </div>
        <p className="hint" role="alert">
          {status === "missing"
            ? "This deck does not exist. It may have been deleted."
            : "The deck could not be loaded. Is the product running?"}
        </p>
      </section>
    );
  }

  const summary = summarize(due);
  const pair = pairName(`${deck.text_language}>${deck.first_language}`);
  const candidates = (cards ?? []).filter(
    (card) =>
      pairOf(card) === `${deck.text_language}>${deck.first_language}` &&
      !card.decks?.some((item) => item.id === deckId),
  );

  async function saveRename(event) {
    event.preventDefault();
    if (!renaming.trim() || busy) return;
    setBusy(true);
    setRenameError("");
    try {
      setDeck({ ...deck, ...(await renameDeck(deckId, renaming)) });
      setRenaming(null);
    } catch (error) {
      setRenameError(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeDeck(cardsChoice) {
    setBusy(true);
    setDialogError("");
    try {
      await deleteDeck(deckId, cardsChoice);
      window.location.hash = "#/decks";
    } catch (error) {
      setDialogError(error.message);
      setBusy(false);
    }
  }

  async function addCards(ids) {
    setBusy(true);
    setDialogError("");
    try {
      const answered = await changeCardDecks(ids, [deckId], []);
      setCards((all) =>
        all.map((card) => answered.find((item) => item.id === card.id) ?? card),
      );
      setAdding(false);
      setNotice(newNotice(`${cardsOf(ids.length)} added.`, "success"));
    } catch (error) {
      setDialogError(error.message);
    } finally {
      setBusy(false);
    }
  }

  const toolbar = (
    <div className="deck-toolbar">
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
          placeholder="Search this deck"
          aria-label="Search this deck"
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {!deck.uncategorized && (
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setDialogError("");
            setAdding(true);
          }}
        >
          Add cards
        </button>
      )}
    </div>
  );

  return (
    <section className="panel deck-page cards-wide">
      <div className="saved-head">
        <a className="back-link" href={hrefOf("decks")}>
          ← Decks
        </a>
        <span className="pair">{pair}</span>
      </div>
      <div className="deck-title">
        {renaming === null ? (
          <>
            <h2>{deck.title}</h2>
            {!deck.uncategorized && (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setRenameError("");
                  setRenaming(deck.title);
                }}
              >
                Rename
              </button>
            )}
          </>
        ) : (
          <form className="deck-rename" onSubmit={saveRename}>
            <input
              className="wide-field"
              type="text"
              maxLength={60}
              autoFocus
              autoComplete="off"
              aria-label="Deck title"
              value={renaming}
              onChange={(event) => setRenaming(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setRenaming(null);
              }}
            />
            <button
              type="submit"
              className="primary"
              disabled={busy || !renaming.trim()}
            >
              Save
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => setRenaming(null)}
            >
              Cancel
            </button>
          </form>
        )}
        <span className="deck-title-space" />
        {summary.total > 0 && renaming === null && (
          <button
            type="button"
            className="primary"
            onClick={() => {
              writeTickedDecks([deckId]);
              requestStartNow(hrefOfDeck(deckId));
              window.location.hash = hrefOf("study");
            }}
          >
            Study this deck · {cardsOf(summary.total)}
          </button>
        )}
      </div>
      {renameError && (
        <p className="form-error" role="alert">
          {renameError}
        </p>
      )}
      <p className="deck-sub">
        {cardsOf(deck.card_count)} · {deck.learned_percent}% learned
        {summary.total > 0 && ` · ${summary.minutes} today`}
      </p>
      {summary.total > 0 ? (
        <ul className="deck-stats" aria-label="To study today">
          <li className="new">
            <b>{summary.new}</b>
            <span>New</span>
          </li>
          <li className="forgotten">
            <b>{summary.forgotten}</b>
            <span>Forgotten</span>
          </li>
          <li className="review">
            <b>{summary.review}</b>
            <span>Review</span>
          </li>
        </ul>
      ) : (
        deck.card_count > 0 && (
          <p className="hint">Nothing to study in this deck today.</p>
        )
      )}
      {deck.card_count === 0 ? (
        <p className="hint">
          The deck has no cards yet. Add cards to it here, or choose it when you
          make cards from a text.
        </p>
      ) : null}
      {deck.card_count === 0 && !deck.uncategorized ? toolbar : null}
      {deck.card_count > 0 && (
        <CardsTable
          cards={shown}
          onCardsChange={changeShown}
          title={deck.title}
          toolbar={toolbar}
          showTexts
          decks={decks}
          onDecksChange={() => setReload((count) => count + 1)}
          emptyMessage={
            search.trim()
              ? "No card of this deck matches the search."
              : "No cards left."
          }
        />
      )}
      <p className="deck-delete-row">
        <button
          type="button"
          className="secondary danger"
          onClick={() => {
            setDialogError("");
            setDeleting(true);
          }}
        >
          Delete deck
        </button>
      </p>
      {deleting && (
        <DeleteDeckDialog
          deck={deck}
          saving={busy}
          error={dialogError}
          onDelete={removeDeck}
          onCancel={() => setDeleting(false)}
        />
      )}
      {adding && (
        <AddCardsDialog
          deck={deck}
          candidates={candidates}
          saving={busy}
          error={dialogError}
          onSave={addCards}
          onCancel={() => setAdding(false)}
        />
      )}
      {notice && <Notice notice={notice} onDismiss={() => setNotice(null)} />}
    </section>
  );
}
