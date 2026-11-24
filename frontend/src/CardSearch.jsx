import { useRef, useState } from "react";
import { matchesSearch, splitMatch } from "./cardFilters.js";

const FEW = 3; // the rows the panel shows before "Show more"

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

// The box that searches the cards (FR-020, DEC-077). The list under it narrows as the learner types. Under the box a
// panel says how many cards were found and lists the first ones, and "Show more" lists the rest. A card of the panel puts
// its word in the search. Enter and Escape close the panel.
export default function CardSearch({ cards, filters, onChange }) {
  const [open, setOpen] = useState(false);
  const input = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const query = filters.search.trim();
  const found = query !== "" && open;

  const cardRows = found
    ? cards.filter((card) => matchesSearch(card, query))
    : [];
  const listed = expanded ? cardRows : cardRows.slice(0, FEW);

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
          setExpanded(false);
          onChange({ ...filters, search: event.target.value });
        }}
        onKeyDown={(event) => {
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
              {cardRows.length === 0
                ? `Nothing found for “${query}”`
                : plural(cardRows.length, "card")}
            </p>
          </div>
          {cardRows.length > 0 && (
            <section className="search-section" aria-label="Cards">
              {listed.map((card) => (
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
              {!expanded && cardRows.length > FEW && (
                <button
                  type="button"
                  className="search-more"
                  onClick={() => setExpanded(true)}
                >
                  Show {cardRows.length - FEW} more
                </button>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
