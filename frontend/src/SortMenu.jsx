import { useState } from "react";

const ICON = {
  sort: "M4 7h9M4 12h6M4 17h3M17 6v12M17 18l-3-3M17 18l3-3",
  chevron: "M6 9l6 6 6-6",
  check: "M5 12l5 5 9-10",
};

function Glyph({ path }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

// The choice of how the cards are ordered: a button that names the order, and a small menu under it, in the style of the
// search panel. The browser's own list is not used, because it cannot take the look of the page. The menu closes when the
// learner chooses, presses Escape or goes elsewhere.
export default function SortMenu({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.id === value) ?? options[0];
  return (
    <div
      className="sort-menu"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        className="sort-button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Glyph path={ICON.sort} />
        <span className="view-label">Sort</span>
        <span className="sort-current">{current.name}</span>
        <Glyph path={ICON.chevron} />
      </button>
      {open && (
        <div className="sort-list" role="menu" aria-label="Sort the cards">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              role="menuitemradio"
              aria-checked={option.id === current.id}
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
            >
              <span>{option.name}</span>
              {option.id === current.id && <Glyph path={ICON.check} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
