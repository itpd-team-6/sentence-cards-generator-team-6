import { useMemo, useState } from "react";
import { markKey, splitText } from "./words.js";

const LANGUAGES = [
  { code: "ru", name: "Russian" },
  { code: "en", name: "English" },
  { code: "de", name: "German" },
];

export default function TextPage() {
  const [text, setText] = useState("");
  const [textLanguage, setTextLanguage] = useState("de");
  const [firstLanguage, setFirstLanguage] = useState("en");
  const [marked, setMarked] = useState([]);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(null);

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
    setMessage("");
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
      setSaved(await response.json());
    } catch {
      setMessage("The product could not be reached. Is it running?");
    }
  }

  return (
    <section>
      <h2>Your text</h2>
      <label>
        Text language
        <select value={textLanguage} onChange={(event) => setTextLanguage(event.target.value)}>
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Your first language
        <select value={firstLanguage} onChange={(event) => setFirstLanguage(event.target.value)}>
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Paste a text
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
        <>
          <h3>Click the words you do not know</h3>
          <p aria-label="Text to mark">
            {pieces.map((piece, index) =>
              piece.isWord ? (
                <button
                  type="button"
                  key={index}
                  aria-pressed={marked.includes(markKey(piece.text))}
                  onClick={() => toggle(piece.text)}
                >
                  {piece.text}
                </button>
              ) : (
                <span key={index}>{piece.text}</span>
              ),
            )}
          </p>
          <h3>Marked words ({marked.length})</h3>
          <ul aria-label="Marked words">
            {marked.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
        </>
      )}

      <button type="button" onClick={askForSentences}>
        Ask for sentences
      </button>
      {message && <p role="alert">{message}</p>}
      {saved && (
        <p role="status">
          Saved text {saved.id} with {saved.words.length} marked {saved.words.length === 1 ? "word" : "words"}.
        </p>
      )}
    </section>
  );
}
