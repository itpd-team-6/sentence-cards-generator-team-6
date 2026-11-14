import {
  NONE,
  STATUSES,
  countItems,
  emptyFilters,
  hasFilters,
  pairOf,
} from "./cardFilters.js";

const LANGUAGE_NAMES = { ru: "Russian", en: "English", de: "German" };

// The name of a language pair, for the list of languages.
export const pairName = (id) => {
  const [text, first] = id.split(">");
  return `${LANGUAGE_NAMES[text] ?? text} → ${LANGUAGE_NAMES[first] ?? first}`;
};

// One part of the side list: a title, one box for each item with the number of cards it would give, and, when two or more
// items are ticked, the choice between "any" and "all". An item that gives no card is dimmed, and a ticked item never
// goes away, so the learner can always untick it.
function Part({ name, part, items, counts, overall, filters, onChange }) {
  const ticked = filters[part];
  const mode = filters[`${part}Mode`] ?? "any";
  const toggle = (id) =>
    onChange({
      ...filters,
      [part]: ticked.includes(id)
        ? ticked.filter((item) => item !== id)
        : [...ticked, id],
    });
  // An item for cards with no deck, or from no text, is there as long as some card is like that, whatever the filters give,
  // so the items under it do not jump while the learner ticks (FR-020).
  const visible = items.filter(
    (item) =>
      ticked.includes(item.id) ||
      (overall.get(item.id) ?? 0) > 0 ||
      !item.optional,
  );
  return (
    <fieldset className="filter-part">
      <legend>{name}</legend>
      {visible.length === 0 && <p className="hint">None yet.</p>}
      {visible.map((item) => {
        const count = counts.get(item.id) ?? 0;
        return (
          <label
            key={item.id}
            className={
              count === 0 && !ticked.includes(item.id)
                ? "filter-item dim"
                : "filter-item"
            }
          >
            <input
              type="checkbox"
              className="queue-check"
              checked={ticked.includes(item.id)}
              onChange={() => toggle(item.id)}
            />
            <span className="filter-name">{item.label}</span>
            <span className="filter-count">{count}</span>
          </label>
        );
      })}
      {ticked.length >= 2 && part !== "pairs" && (
        <div className="filter-mode" role="group" aria-label={`Match ${name}`}>
          {["any", "all"].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => onChange({ ...filters, [`${part}Mode`]: value })}
            >
              {value === "any" ? "Any" : "All"}
            </button>
          ))}
        </div>
      )}
    </fieldset>
  );
}

// The side list of "Your cards": decks, texts, the language pairs when there is more than one, and the statuses. On a
// phone it is a sheet that opens from the bottom, with a button that shows the cards it gives.
export default function CardFilters({
  cards,
  decks,
  texts,
  filters,
  onChange,
  shown,
  open,
  onClose,
}) {
  const pairs = [...new Set(cards.map(pairOf))].sort();
  // A card that leaves its last deck goes to the deck "Uncategorized", which is a deck in the list like the others
  // (DEC-065). The item for cards in no deck is only for a learner who has no such deck, so it is not shown twice.
  const deckItems = [
    ...decks.map((deck) => ({ id: deck.id, label: deck.title })),
    ...(decks.some((deck) => deck.uncategorized)
      ? []
      : [{ id: NONE, label: "Uncategorized", optional: true }]),
  ];
  const textItems = [
    ...texts.map((text) => ({ id: text.id, label: text.title })),
    { id: NONE, label: "No text", optional: true },
  ];
  const shared = { filters, onChange };
  return (
    <aside
      className={open ? "cards-filters open" : "cards-filters"}
      aria-label="Filters"
      id="cards-filters"
    >
      <div className="filters-head">
        <span className="grab" aria-hidden="true" />
        <h3>Filters</h3>
        <button
          type="button"
          className="secondary icon filters-close"
          aria-label="Close the filters"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <button
        type="button"
        className="filter-all"
        aria-pressed={!hasFilters(filters)}
        onClick={() => onChange(emptyFilters())}
      >
        <span>All cards</span>
        <span className="filter-count">{cards.length}</span>
      </button>
      <Part
        {...shared}
        name="Decks"
        part="decks"
        items={deckItems}
        counts={countItems(cards, filters, "decks")}
        overall={countItems(cards, emptyFilters(), "decks")}
      />
      <Part
        {...shared}
        name="Texts"
        part="texts"
        items={textItems}
        counts={countItems(cards, filters, "texts")}
        overall={countItems(cards, emptyFilters(), "texts")}
      />
      {pairs.length > 1 && (
        <Part
          {...shared}
          name="Languages"
          part="pairs"
          items={pairs.map((id) => ({ id, label: pairName(id) }))}
          counts={countItems(cards, filters, "pairs")}
          overall={countItems(cards, emptyFilters(), "pairs")}
        />
      )}
      <Part
        {...shared}
        name="Status"
        part="statuses"
        items={STATUSES.map((status) => ({
          id: status.id,
          label: status.name,
        }))}
        counts={countItems(cards, filters, "statuses")}
        overall={countItems(cards, emptyFilters(), "statuses")}
      />
      <button type="button" className="primary filters-show" onClick={onClose}>
        Show {shown} {shown === 1 ? "card" : "cards"}
      </button>
    </aside>
  );
}
