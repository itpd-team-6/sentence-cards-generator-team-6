import { useEffect, useMemo, useState } from "react";
import { createCards, loadCards } from "./api.js";
import CardsTable from "./CardsTable.jsx";
import { markKey, splitText } from "./words.js";

const LANGUAGES = [
  { code: "ru", name: "Russian" },
  { code: "en", name: "English" },
  { code: "de", name: "German" },
];

// Three languages fit as buttons, so the learner sees them all and picks one with one click.
// Clicking the chosen language again, or pressing Space on it, clears it.
// `taken` is the language chosen in the other picker: the text and the cards need two different languages.
function LanguagePicker({ label, name, value, onChange, taken }) {
  return (
    <fieldset className="picker">
      <legend className="field-label">{label}</legend>
      <div className="options">
        {LANGUAGES.map((language) => (
          <label className="option" key={language.code}>
            <input
              type="radio"
              name={name}
              value={language.code}
              checked={value === language.code}
              disabled={language.code === taken}
              onChange={() => onChange(language.code)}
              onClick={() => value === language.code && onChange("")}
              onKeyDown={(event) => {
                if (event.key === " " && value === language.code) {
                  event.preventDefault();
                  onChange("");
                }
              }}
            />
            <span>{language.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function TextPage() {
  const [text, setText] = useState("");
  const [textLanguage, setTextLanguage] = useState("");
  const [firstLanguage, setFirstLanguage] = useState("");
  const [marked, setMarked] = useState([]);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(null);
  const [cards, setCards] = useState(null);
  const [asking, setAsking] = useState(false);

  // The cards are in the database, so they are there again after a refresh, whatever text they came from.
  useEffect(() => {
    loadCards()
      .then((found) => found.length > 0 && setCards(found))
      .catch(() => {}); // Without the product there is nothing to show; the page says so when the learner asks.
  }, []);

  const pieces = useMemo(() => splitText(text), [text]);

  function toggle(word) {
    const key = markKey(word);
    setMarked((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
    setMessage("");
    setSaved(null);
  }

  async function askForSentences() {
    if (marked.length === 0) {
      setMessage("No word is marked. Click the words you do not know.");
      return;
    }
    if (!textLanguage || !firstLanguage) {
      setMessage("Choose the language of the text and your first language.");
      return;
    }
    setMessage("");
    setAsking(true);
    try {
      const response = await fetch("/api/texts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          text_language: textLanguage,
          first_language: firstLanguage,
          words: marked,
        }),
      });
      if (!response.ok) {
        setMessage("The text could not be saved. Check it and try again.");
        return;
      }
      const savedText = await response.json();
      setSaved(savedText);
      const created = await createCards(savedText.id);
      setCards(await loadCards());
      // One message for all the words the model gave no sentence for; each of them stays as a card without a sentence.
      if (created.some((card) => card.error)) {
        setMessage("Some sentences could not be generated. Try again later with the New sentence button of each card.");
      }
    } catch (error) {
      setMessage(error instanceof TypeError ? "The product could not be reached. Is it running?" : error.message);
    } finally {
      setAsking(false);
    }
  }

  return (
    <>
      <section className="panel">
        <h2>Your text</h2>
        <div className="fields">
          <LanguagePicker
            label="Text language"
            name="text-language"
            value={textLanguage}
            onChange={setTextLanguage}
            taken={firstLanguage}
          />
          <LanguagePicker
            label="Your first language"
            name="first-language"
            value={firstLanguage}
            onChange={setFirstLanguage}
            taken={textLanguage}
          />
        </div>
        <label className="field">
          <span className="field-label">Paste a text</span>
          <textarea
            rows={6}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setMarked([]);
              setSaved(null);
              setMessage("");
            }}
          />
        </label>

        {text.trim() && (
          <div className="marking">
            <h3>Click the words you do not know</h3>
            <p className="reading" aria-label="Text to mark">
              {pieces.map((piece, index) =>
                piece.isWord ? (
                  <span className="glue" key={index}>
                    <button
                      type="button"
                      className="word"
                      aria-pressed={marked.includes(markKey(piece.text))}
                      onClick={() => toggle(piece.text)}
                    >
                      {piece.text}
                    </button>
                    {piece.trail}
                  </span>
                ) : (
                  <span key={index}>{piece.text}</span>
                ),
              )}
            </p>
            <h3>Marked words ({marked.length})</h3>
            {marked.length === 0 ? (
              <p className="hint">Nothing marked yet.</p>
            ) : (
              <ul className="chips" aria-label="Marked words">
                {marked.map((word) => (
                  <li key={word}>{word}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="actions">
          <button type="button" className="primary" onClick={askForSentences} disabled={asking}>
            {asking ? "Asking the language model..." : "Ask for sentences"}
          </button>
        </div>
        {message && (
          <p className="notice" role="alert">
            {message}
          </p>
        )}
        {saved && (
          <p className="notice ok" role="status">
            Saved text {saved.id} with {saved.words.length} marked {saved.words.length === 1 ? "word" : "words"}.
          </p>
        )}
        {asking && (
          <p className="notice busy" role="status">
            Asking the language model for sentences. This takes a few seconds for each word.
          </p>
        )}
      </section>

      {cards && (
        <section className="panel cards-panel">
          <CardsTable cards={cards} onCardsChange={setCards} />
        </section>
      )}
    </>
  );
}
