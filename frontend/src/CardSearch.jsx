import { useRef, useState } from "react";
import { matchesSearch, normalize, splitMatch } from "./cardFilters.js";
import { hrefOfText } from "./router.js";

const SCOPES = [
  { id: "all", name: "All" },
  { id: "cards", name: "Cards" },
  { id: "texts", name: "Texts" },
  { id: "decks", name: "Decks" },
];
const FEW = 3; // the rows a section shows before "Show more"

const plural = (count, one) => `${count} ${one}${count === 1 ? "" : "s"}`;

// The text, with the part that has what the learner searched marked.
function Marked({ text, query }) {
  return splitMatch(text, query).map((part, index) =>
    part.match ? (
      <mark key={index} className="hit">
        {part.text}
      </mark>
    ) : (
      part.text
    ),
  );
}

// One section of the results: its name, the first rows, and "Show more" for the rest.
function Section({ name, rows, expanded, onExpand }) {
  if (rows.length === 0) return null;
  const listed = expanded ? rows : rows.slice(0, FEW);
  return (
    <section className="search-section" aria-label={name}>
      <h4>{name}</h4>
      {listed.map((row) => row)}
      {!expanded && rows.length > FEW && (
        <button type="button" className="search-more" onClick={onExpand}>
          Show {rows.length - FEW} more
        </button>
      )}
    </section>
  );
}

// The box that searches the cards, the texts and the decks from one place (FR-020). The list under it narrows as the
// learner types. Under the box a panel says what was found, a section for each kind. A card of the panel puts its word in
// the search, and a text or a deck of the panel ticks it in the side list. Enter takes what was typed, even if it is not complete (see `takeSearch`), and Enter and Escape close the panel.
export default function CardSearch({ cards, decks, texts, filters, onChange }) {
  const [open, setOpen] = useState(false);
  const input = useRef(null);
  const [scope, setScope] = useState("all");
  const [expanded, setExpanded] = useState({});
  const query = filters.search.trim();
  const found = query !== "" && open;

  const cardRows = found
    ? cards.filter((card) => matchesSearch(card, query))
    : [];
  const wanted = normalize(query);
  const textRows = found
    ? texts.filter((text) => normalize(text.title).includes(wanted))
    : [];
  const deckRows = found
    ? decks.filter((deck) => normalize(deck.title).includes(wanted))
    : [];
  const keep = (kind) => scope === "all" || scope === kind;

  const tickAll = (part, ids) =>
    onChange({
      ...filters,
      [part]: [
        ...filters[part],
        ...ids.filter((id) => !filters[part].includes(id)),
      ],
      search: "",
    });
  const tick = (part, id) => tickAll(part, [id]);

  // Enter takes what was typed even if it is not complete. With "All", the cards that have it stay listed; when no card
  // has it, the decks that have it in the title are ticked, or else the texts. With the scope on decks or on texts, those
  // are ticked.
  function takeSearch() {
    const decksWith = deckRows.map((deck) => deck.id);
    const textsWith = textRows.map((text) => text.id);
    if (scope === "decks" || (scope === "all" && cardRows.length === 0)) {
      if (decksWith.length > 0) return tickAll("decks", decksWith);
    }
    if (scope === "texts" || (scope === "all" && cardRows.length === 0)) {
      if (textsWith.length > 0) return tickAll("texts", textsWith);
    }
  }

  return (
    <div
      className="cards-search-box"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
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
        ref={input}
        type="search"
        spellCheck={false}
        className="cards-search"
        placeholder="Search your cards"
        aria-label="Search your cards"
        value={filters.search}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setOpen(true);
          setExpanded({});
          onChange({ ...filters, search: event.target.value });
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") takeSearch();
          if (event.key === "Escape" || event.key === "Enter") setOpen(false);
        }}
      />
      {filters.search !== "" && (
        <button
          type="button"
          className="search-clear"
          aria-label="Clear the search"
          onClick={() => {
            onChange({ ...filters, search: "" });
            setOpen(false);
            input.current?.focus();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
      {found && (
        <div className="search-panel" role="region" aria-label="Search results">
          <div className="search-head">
            <p className="search-summary" role="status">
              {cardRows.length + textRows.length + deckRows.length === 0
                ? `Nothing found for “${query}”`
                : plural(
                    cardRows.length + textRows.length + deckRows.length,
                    "result",
                  )}
            </p>
            <div className="search-scope" role="group" aria-label="Look in">
              {SCOPES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={scope === item.id}
                  onClick={() => setScope(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          {keep("cards") && (
            <Section
              name="Cards"
              expanded={expanded.cards || scope === "cards"}
              onExpand={() => setExpanded({ ...expanded, cards: true })}
              rows={cardRows.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className="search-row"
                  onClick={() => {
                    onChange({ ...filters, search: card.word });
                    setOpen(false);
                  }}
                >
                  <span className="search-main">
                    <Marked text={card.word} query={query} />
                  </span>
                  {card.sentence && (
                    <span className="search-sub">
                      <Marked text={card.sentence} query={query} />
                    </span>
                  )}
                </button>
              ))}
            />
          )}
          {keep("texts") && (
            <Section
              name="Texts"
              expanded={expanded.texts || scope === "texts"}
              onExpand={() => setExpanded({ ...expanded, texts: true })}
              rows={textRows.map((text) => (
                <div key={text.id} className="search-row-line">
                  <button
                    type="button"
                    className="search-row"
                    onClick={() => {
                      tick("texts", text.id);
                      setOpen(false);
                    }}
                  >
                    <span className="search-main">
                      <Marked text={text.title} query={query} />
                    </span>
                    <span className="search-sub">
                      {plural(text.cards, "card")}
                    </span>
                  </button>
                  <a
                    className="search-open"
                    href={hrefOfText(text.id)}
                    aria-label={`Open ${text.title}`}
                  >
                    →
                  </a>
                </div>
              ))}
            />
          )}
          {keep("decks") && (
            <Section
              name="Decks"
              expanded={expanded.decks || scope === "decks"}
              onExpand={() => setExpanded({ ...expanded, decks: true })}
              rows={deckRows.map((deck) => (
                <button
                  key={deck.id}
                  type="button"
                  className="search-row"
                  onClick={() => {
                    tick("decks", deck.id);
                    setOpen(false);
                  }}
                >
                  <span className="search-main">
                    <Marked text={deck.title} query={query} />
                  </span>
                  <span className="search-sub">
                    {plural(deck.card_count, "card")}
                  </span>
                </button>
              ))}
            />
          )}
        </div>
      )}
    </div>
  );
}
