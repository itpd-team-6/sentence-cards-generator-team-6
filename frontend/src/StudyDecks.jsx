const learned = (deck) => deck.learned_percent ?? 0;

const LANGUAGE_CODES = { ru: "RU", en: "EN", de: "DE" };

// The decks to study from, as a row of chips inside the Study box. The ticked decks are filled in blue, and the button
// ticks every deck, or unticks them all when every deck is ticked.
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
    <div className="study-decks" role="group" aria-label="Decks">
      <div className="study-decks-head">
        <h3>Decks</h3>
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
        <p className="hint">No decks yet.</p>
      ) : (
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
              <span
                className="dchip-progress"
                role="img"
                aria-label={`${learned(deck)}% learned`}
                title={`${learned(deck)}% learned`}
              >
                <span style={{ width: `${learned(deck)}%` }} />
              </span>
              {pairs.size > 1 && (
                <span className="dchip-pair">
                  {LANGUAGE_CODES[deck.text_language]} to{" "}
                  {LANGUAGE_CODES[deck.first_language]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
