import { useEffect, useMemo, useState } from "react";
import { loadCards, loadDecks, loadTexts } from "./api.js";
import CardSearch from "./CardSearch.jsx";
import CardFilters, { pairName } from "./CardFilters.jsx";
import {
  NONE,
  STATUSES,
  choiceCount,
  describe,
  emptyFilters,
  GROUPS,
  SORTS,
  filterCards,
  groupCards,
  hasFilters,
  pairOf,
  sortCards,
} from "./cardFilters.js";
import CardsTable from "./CardsTable.jsx";
import SortMenu from "./SortMenu.jsx";
import { hrefOfText } from "./router.js";

const KEY = "your-cards-filters";
const VIEW_KEY = "your-cards-view";

// How the list is ordered and grouped. It is kept like the filters, but "Clear" does not change it.
function savedView() {
  try {
    return {
      sort: "newest",
      group: "none",
      ...JSON.parse(sessionStorage.getItem(VIEW_KEY)),
    };
  } catch {
    return { sort: "newest", group: "none" };
  }
}

// The filters stay in the browser's session, so the learner who opens a text from a card and comes back finds the list as
// it was (FR-020). A browser that gives no storage just starts with no filters.
function savedFilters() {
  try {
    return { ...emptyFilters(), ...JSON.parse(sessionStorage.getItem(KEY)) };
  } catch {
    return emptyFilters();
  }
}

function saveFilters(filters) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(filters));
  } catch {
    // Without storage the filters are only kept while the page is open.
  }
}

// All the cards of the learner. A side list narrows them by deck, text and status, a box searches them, and the table
// has the buttons that change them. The page is made when the learner goes to it, so the cards are read each time: a
// card hidden or changed in a study session shows as it is now.
export default function YourCardsPage() {
  const [cards, setCards] = useState(null);
  const [decks, setDecks] = useState([]);
  const [texts, setTexts] = useState([]);
  const [failed, setFailed] = useState(false);
  const [filters, setFilters] = useState(savedFilters);
  const [view, setView] = useState(savedView);
  const [sheetOpen, setSheetOpen] = useState(false); // the filters sheet of a phone

  useEffect(() => {
    Promise.all([loadCards(), loadDecks(), loadTexts()])
      .then(([loadedCards, loadedDecks, loadedTexts]) => {
        setDecks(loadedDecks);
        setTexts(loadedTexts);
        setCards(loadedCards);
      })
      .catch(() => setFailed(true));
  }, []);

  const change = (next) => {
    setFilters(next);
    saveFilters(next);
  };
  const clear = () => change(emptyFilters());
  const changeView = (next) => {
    setView(next);
    try {
      sessionStorage.setItem(VIEW_KEY, JSON.stringify(next));
    } catch {
      // Without storage the view is only kept while the page is open.
    }
  };

  const shown = useMemo(
    () => (cards ? sortCards(filterCards(cards, filters), view.sort) : []),
    [cards, filters, view.sort],
  );
  const groups = useMemo(
    () => groupCards(shown, view.group, decks, texts),
    [shown, view.group, decks, texts],
  );

  // The table changes the cards it was given, which are only the listed ones: the cards it keeps replace theirs, and a card
  // it no longer has was deleted.
  const changeShown = (next) =>
    setCards((all) => {
      const listed = new Set(shown.map((card) => card.id));
      const byId = new Map(next.map((card) => [card.id, card]));
      return all
        .filter((card) => !listed.has(card.id) || byId.has(card.id))
        .map((card) => byId.get(card.id) ?? card);
    });

  const titleOf = (list, id, none) =>
    id === NONE ? none : (list.find((item) => item.id === id)?.title ?? "?");
  const chips = [
    ...filters.decks.map((id) => ({
      key: `deck-${id}`,
      label: titleOf(decks, id, "Uncategorized"),
      remove: () =>
        change({ ...filters, decks: filters.decks.filter((x) => x !== id) }),
    })),
    ...filters.texts.map((id) => ({
      key: `text-${id}`,
      label: titleOf(texts, id, "No text"),
      remove: () =>
        change({ ...filters, texts: filters.texts.filter((x) => x !== id) }),
    })),
    ...filters.pairs.map((id) => ({
      key: `pair-${id}`,
      label: pairName(id),
      remove: () =>
        change({ ...filters, pairs: filters.pairs.filter((x) => x !== id) }),
    })),
    ...filters.statuses.map((id) => ({
      key: `status-${id}`,
      label: STATUSES.find((status) => status.id === id).name,
      remove: () =>
        change({
          ...filters,
          statuses: filters.statuses.filter((x) => x !== id),
        }),
    })),
    ...(filters.search.trim()
      ? [
          {
            key: "search",
            label: `Search: ${filters.search.trim()}`,
            remove: () => change({ ...filters, search: "" }),
          },
        ]
      : []),
  ];

  const pairs = [...new Set((cards ?? []).map(pairOf))].map((id) => ({
    id,
    name: pairName(id),
  }));
  const openTextId =
    filters.texts.length === 1 && filters.texts[0] !== NONE
      ? filters.texts[0]
      : null;
  const choices = choiceCount(filters);

  const toolbar = (
    <div className="cards-toolbar">
      <div className="cards-search-row">
        <CardSearch
          cards={cards ?? []}
          decks={decks}
          texts={texts}
          filters={filters}
          onChange={change}
        />
        <button
          type="button"
          className="secondary filters-toggle"
          aria-expanded={sheetOpen}
          aria-controls="cards-filters"
          onClick={() => setSheetOpen(true)}
        >
          <span className="filters-label">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M8 15v4" />
            </svg>
            Filters
          </span>
          {choices > 0 && <span className="filters-badge">{choices}</span>}
        </button>
      </div>
      <div className="cards-info-row">
        <div className="cards-info">
          <p className="filter-sentence" role="status">
            {describe(shown.length, filters, {
              decks,
              texts,
              pairs,
            })}
            {openTextId !== null && (
              <>
                {" "}
                <a className="filter-open" href={hrefOfText(openTextId)}>
                  Open text
                </a>
              </>
            )}
          </p>
          {chips.length > 0 && (
            <div className="filter-chips">
              {chips.map((chip) => (
                <span key={chip.key} className="filter-chip">
                  {chip.label}
                  <button
                    type="button"
                    aria-label={`Remove ${chip.label}`}
                    onClick={chip.remove}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button type="button" className="filter-clear" onClick={clear}>
                Clear
              </button>
            </div>
          )}
        </div>
        <div className="cards-view">
          <div className="view-group-wrap" role="group" aria-label="Group by">
            <span className="view-label" aria-hidden="true">
              Group by
            </span>
            <div className="filter-mode view-group">
              {GROUPS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={view.group === item.id}
                  onClick={() => changeView({ ...view, group: item.id })}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <SortMenu
            value={view.sort}
            options={SORTS}
            onChange={(sort) => changeView({ ...view, sort })}
          />
        </div>
      </div>
    </div>
  );

  const tickedDecks = new Set(filters.decks);

  return (
    <section className="panel cards-panel cards-wide">
      {failed && (
        <p className="hint" role="alert">
          The cards could not be loaded. Is the product running?
        </p>
      )}
      {!failed && cards === null && <p className="hint">Loading...</p>}
      {cards?.length === 0 && (
        <>
          <h2>Your cards</h2>
          <p className="hint">
            No cards yet. Save a text on the Texts page and make cards from its
            marked words.
          </p>
        </>
      )}
      {cards?.length > 0 && (
        <div className="cards-layout">
          {sheetOpen && (
            <div
              className="filters-backdrop"
              onClick={() => setSheetOpen(false)}
              aria-hidden="true"
            />
          )}
          <CardFilters
            cards={cards}
            decks={decks}
            texts={texts}
            filters={filters}
            onChange={change}
            shown={shown.length}
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
          />
          <div className="cards-main">
            <CardsTable
              cards={shown}
              groups={groups}
              onCardsChange={changeShown}
              toolbar={toolbar}
              decks={decks}
              onDecksChange={() =>
                loadDecks()
                  .then(setDecks)
                  .catch(() => {})
              }
              tickedDecks={tickedDecks}
              showTexts
              emptyMessage={
                hasFilters(filters)
                  ? "No card has all of this. Clear the filters or change the search."
                  : "No cards left."
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}
