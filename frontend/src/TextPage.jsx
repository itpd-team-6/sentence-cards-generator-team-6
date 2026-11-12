import { useEffect, useMemo, useState } from "react";
import { createCards, loadTextCards } from "./api.js";
import { libraryHeaders } from "./library.js";
import CardsTable from "./CardsTable.jsx";
import DeckPicker from "./DeckPicker.jsx";
import Notice, { newNotice } from "./Notice.jsx";
import TextCounter, { tooLong } from "./TextCounter.jsx";
import WordPicker from "./WordPicker.jsx";
import { markedItems, splitText } from "./words.js";
import { readTextDraft, writeTextDraft } from "./textDraft.js";

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

// The form that adds a text. The page stays in the document when the learner goes to another page, so what was typed
// is still there when they come back. `onTextSaved` is called when a text is saved, so the list of texts under the form
// shows it. The box under the form has only the cards of the text just made; all the cards are on their own page.
export default function TextPage({ onTextSaved = () => {} }) {
  const [draft] = useState(readTextDraft); // what was typed before a reload of this tab
  const [text, setText] = useState(draft.text);
  const [textLanguage, setTextLanguage] = useState(draft.textLanguage);
  const [firstLanguage, setFirstLanguage] = useState(draft.firstLanguage);
  const [marked, setMarked] = useState(draft.marked);
  const [selections, setSelections] = useState(draft.selections); // several words chosen as one card, see WordPicker
  const [message, setMessage] = useState(null);
  const [saved, setSaved] = useState(null);
  const [cards, setCards] = useState(null); // the cards of the text just made
  const [asking, setAsking] = useState(false);
  const [deckIds, setDeckIds] = useState([]); // the decks the new cards go in
  const [decksChanged, setDecksChanged] = useState(0);

  useEffect(() => {
    writeTextDraft({ text, textLanguage, firstLanguage, marked, selections });
  }, [text, textLanguage, firstLanguage, marked, selections]);

  // The decks are for one pair of languages, so the ticks go when the pair changes.
  useEffect(() => setDeckIds([]), [textLanguage, firstLanguage]);

  const pieces = useMemo(() => splitText(text), [text]);

  // What is marked: single words, then the selections of several words, each as its words with a space between.
  const cardWords = markedItems(pieces, marked, selections);

  function edited() {
    setMessage(null);
    setSaved(null);
  }

  async function askForSentences() {
    if (cardWords.length === 0) {
      setMessage(
        newNotice("No word is marked. Click the words you do not know."),
      );
      return;
    }
    if (tooLong(text)) {
      setMessage(newNotice(tooLong(text)));
      return;
    }
    if (!textLanguage || !firstLanguage) {
      setMessage(
        newNotice("Choose the language of the text and your first language."),
      );
      return;
    }
    if (deckIds.length === 0) {
      setMessage(newNotice("Choose at least one deck for the cards."));
      return;
    }
    setMessage(null);
    setAsking(true);
    try {
      const response = await fetch("/api/texts", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...libraryHeaders() },
        body: JSON.stringify({
          text,
          text_language: textLanguage,
          first_language: firstLanguage,
          words: cardWords,
        }),
      });
      if (!response.ok) {
        setMessage(
          newNotice("The text could not be saved. Check it and try again."),
        );
        return;
      }
      const savedText = await response.json();
      const created = await createCards(savedText.id, deckIds);
      setCards(await loadTextCards(savedText.id));
      setDecksChanged((count) => count + 1);
      onTextSaved();
      // When the model has answered, tell how many cards got a sentence, so the learner sees that the work is done.
      // `created.cards` has every card of the text; `made` is how many this call made (issue #212).
      const made = created.made;
      if (made > 0) {
        setSaved(
          newNotice(
            `Saved text ${savedText.id} and made ${made} ${made === 1 ? "card" : "cards"} in ${deckIds.length} ${deckIds.length === 1 ? "deck" : "decks"}.`,
            "success",
          ),
        );
      }
      // One message for all the words the model gave no sentence for; each of them stays as a card without a sentence.
      const problems = [];
      const failed = created.cards.some((card) => card.error);
      if (failed) {
        problems.push(
          "Some sentences could not be generated. Try again later with the New sentence button of each card.",
        );
      }
      // A word the learner already has a card for, with the same meaning, gets no second card (DEC-013).
      if (created.existing.length > 0) {
        const listed = created.existing
          .map((item) => `${item.word} ("${item.phrase}")`)
          .join(", ");
        problems.push(
          `No new card for ${listed}: you already have ${created.existing.length === 1 ? "a card" : "cards"} with that meaning.`,
        );
      }
      // Only a word without a sentence is a problem; a word that already has its card is told as information.
      if (problems.length > 0)
        setMessage(newNotice(problems.join(" "), failed ? "error" : "info"));
    } catch (error) {
      setMessage(
        newNotice(
          error instanceof TypeError
            ? "The product could not be reached. Is it running?"
            : error.message,
        ),
      );
    } finally {
      setAsking(false);
    }
  }

  return (
    <>
      <section className="panel">
        <h2>Add cards from a text</h2>
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
              setSelections([]);
              setSaved(null);
              setMessage(null);
              setCards(null);
            }}
          />
          <TextCounter text={text} />
        </label>

        {text.trim() && (
          <div className="marking">
            <h3>Click the words you do not know</h3>
            <p className="hint">
              Hold Shift and click several words to make them one card.
            </p>
            <WordPicker
              pieces={pieces}
              marked={marked}
              setMarked={setMarked}
              selections={selections}
              setSelections={setSelections}
              onEdit={edited}
            />
            <h3>Marked words ({cardWords.length})</h3>
            {cardWords.length === 0 ? (
              <p className="hint">Nothing marked yet.</p>
            ) : (
              <ul className="chips" aria-label="Marked words">
                {cardWords.map((word) => (
                  <li key={word}>{word}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <DeckPicker
          textLanguage={textLanguage}
          firstLanguage={firstLanguage}
          selected={deckIds}
          onChange={setDeckIds}
          reload={decksChanged}
        />

        <div className="actions footer-row">
          <p className="hint">
            {deckIds.length === 0
              ? "Tick at least one deck to continue."
              : `${cardWords.length} ${cardWords.length === 1 ? "word" : "words"} will become ${cardWords.length === 1 ? "a card" : "cards"} in ${deckIds.length} ${deckIds.length === 1 ? "deck" : "decks"}.`}
          </p>
          <button
            type="button"
            className="primary"
            onClick={askForSentences}
            disabled={asking || deckIds.length === 0}
            aria-busy={asking}
          >
            {asking && <span className="button-spinner" aria-hidden="true" />}
            {asking ? "Asking the language model..." : "Ask for sentences"}
          </button>
        </div>
        {message && (
          <Notice notice={message} onDismiss={() => setMessage(null)} />
        )}
        {saved && <Notice notice={saved} onDismiss={() => setSaved(null)} />}
        {asking && (
          <p className="hint" role="status">
            Asking the language model for sentences. This takes a few seconds
            for each word.
          </p>
        )}
      </section>

      {cards && (
        <section className="panel cards-panel">
          <CardsTable
            title="Cards of this text"
            cards={cards}
            onCardsChange={setCards}
          />
        </section>
      )}
    </>
  );
}
