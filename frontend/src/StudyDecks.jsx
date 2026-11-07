const LANGUAGE_CODES = { ru: "RU", en: "EN", de: "DE" };

// The first box of the study page: the decks to study from, as chips. The ticked decks are filled in blue, and the
// button ticks every deck, or unticks them all when every deck is ticked.
export default function StudyDecks({ decks, ticked, onChange }) {
  const all =
    decks.length > 0 && decks.every((deck) => ticked.includes(deck.id));
  const pairs = new Set(
    decks.map((deck) => `${deck.text_language}${deck.first_language}`),
  );

  function toggle(id) {
    onChange(
      ticked.includes(id)
        ? ticked.filter((item) => item !== id)
        : [...ticked, id],
    );
  }

  return (
    <section className="panel" aria-label="Decks">
      <div className="pane-head">
        <h2>Decks</h2>
        {decks.length > 0 && (
          <button
            type="button"
            className="secondary"
            onClick={() => onChange(all ? [] : decks.map((deck) => deck.id))}
          >
            {all ? "Clear selection" : "Select all"}
          </button>
        )}
      </div>
      {decks.length === 0 ? (
        <p className="hint">
          You have no deck yet. Make one when you add a text, then tick it here.
        </p>
      ) : (
        <>
          <div className="deckbar">
            {decks.map((deck) => (
              <button
                type="button"
                key={deck.id}
                className="dchip"
                aria-pressed={ticked.includes(deck.id)}
                onClick={() => toggle(deck.id)}
              >
                <span className="dchip-dot" aria-hidden="true" />
                <span className="dchip-name">{deck.title}</span>
                <span className="dchip-count">{deck.card_count}</span>
                {pairs.size > 1 && (
                  <span className="dchip-pair">
                    {LANGUAGE_CODES[deck.text_language]} to{" "}
                    {LANGUAGE_CODES[deck.first_language]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="hint">
            Both boxes show only the cards of the ticked decks.
          </p>
        </>
      )}
    </section>
  );
}
