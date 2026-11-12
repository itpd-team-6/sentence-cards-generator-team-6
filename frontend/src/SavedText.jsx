import { useEffect, useMemo, useState } from "react";
import {
  changeText,
  createCards,
  deleteText,
  loadText,
  loadTextCards,
} from "./api.js";
import CardsTable from "./CardsTable.jsx";
import DeckPicker from "./DeckPicker.jsx";
import Notice, { newNotice } from "./Notice.jsx";
import TextCounter, { tooLong } from "./TextCounter.jsx";
import WordPicker from "./WordPicker.jsx";
import { hrefOf } from "./router.js";
import { markedItems, marksFromItems, splitText } from "./words.js";

const NAMES = { ru: "Russian", en: "English", de: "German" };
const TITLE_LENGTH = 60;

const lower = (items) => items.map((item) => item.toLocaleLowerCase());
const sameItems = (a, b) =>
  JSON.stringify(lower(a).sort()) === JSON.stringify(lower(b).sort());

// One saved text: its title, its text and its marked words can be changed. What the learner changes is held here and is
// saved only with "Save changes", so nothing is lost by a click that was a mistake. Unmarking a word takes only the mark
// away: the card and the text stay (DEC-064). The two languages cannot change on a saved text, because its cards are
// written for that pair.
export default function SavedText({ textId }) {
  const [saved, setSaved] = useState(null); // the text as the product has it
  const [missing, setMissing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [marked, setMarked] = useState([]);
  const [selections, setSelections] = useState([]);
  const [lost, setLost] = useState([]); // marks whose words are no longer in the text; they go when the text is saved
  const [cards, setCards] = useState(null);
  const [deckIds, setDeckIds] = useState([]);
  const [decksChanged, setDecksChanged] = useState(0);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(null); // "save", "cards" or "delete"
  const [confirming, setConfirming] = useState(false);

  const pieces = useMemo(() => splitText(text), [text]);
  const items = markedItems(pieces, marked, selections);

  function show(found) {
    setSaved(found);
    setTitle(found.title);
    setText(found.text);
    const reopened = marksFromItems(splitText(found.text), found.words);
    setMarked(reopened.marked);
    setSelections(reopened.selections);
    setLost(reopened.lost);
  }

  useEffect(() => {
    let current = true;
    Promise.all([loadText(textId), loadTextCards(textId)])
      .then(([found, made]) => {
        if (!current) return;
        show(found);
        setCards(made);
      })
      .catch(() => current && setMissing(true));
    return () => {
      current = false;
    };
  }, [textId]);

  if (missing) {
    return (
      <section className="panel">
        <a className="back-link" href={hrefOf("texts")}>
          Back to your texts
        </a>
        <p className="hint" role="alert">
          This text could not be opened. It may have been deleted.
        </p>
      </section>
    );
  }
  if (!saved) {
    return (
      <section className="panel">
        <p className="hint">Loading...</p>
      </section>
    );
  }

  const withCards = lower(saved.words_with_cards);
  // The card of each marked word that has one, by the word in lowercase: its sentence is the tooltip of the chip.
  const cardOf = Object.fromEntries(
    saved.marks
      .filter((mark) => mark.card)
      .map((mark) => [mark.word.toLocaleLowerCase(), mark.card]),
  );
  const newWords = items.filter(
    (item) => !withCards.includes(item.toLocaleLowerCase()),
  );
  const textChanged = text !== saved.text;
  const marksChanged = !sameItems(items, saved.words);
  const dirty = title.trim() !== saved.title || textChanged || marksChanged;

  // The text is edited: the marks keep the words that are still in it, and the others wait as lost until it is saved.
  function editText(next) {
    const reopened = marksFromItems(splitText(next), [...items, ...lost]);
    setText(next);
    setMarked(reopened.marked);
    setSelections(reopened.selections);
    setLost(reopened.lost);
    setMessage(null);
  }

  // Saves what changed. The answer is the text as it is now, and it tells which marks the new text took away.
  async function saveChanges() {
    const fields = {};
    if (title.trim() !== saved.title) fields.title = title.trim();
    if (textChanged) fields.text = text;
    if (textChanged || marksChanged) fields.words = items;
    if (Object.keys(fields).length === 0) return null;
    const changed = await changeText(textId, fields);
    show(changed);
    // A mark taken away takes its card out of the cards of this text (the card stays in Your cards), so the box is read again.
    try {
      setCards(await loadTextCards(textId));
    } catch {
      // The changes are saved; the box shows the cards it had until the page is opened again.
    }
    return changed;
  }

  function checked() {
    if (!title.trim()) {
      setMessage(newNotice("Write a title for the text."));
      return false;
    }
    if (!text.trim()) {
      setMessage(newNotice("The text cannot be empty."));
      return false;
    }
    if (tooLong(text)) {
      setMessage(newNotice(tooLong(text)));
      return false;
    }
    return true;
  }

  function problemOf(error) {
    return newNotice(
      error.status === 422
        ? "The changes could not be saved. Check the title and the text."
        : error.message,
    );
  }

  async function onSave() {
    if (!checked()) return;
    setMessage(null);
    setBusy("save");
    try {
      const changed = await saveChanges();
      const gone = changed?.lost_marks ?? [];
      setMessage(
        newNotice(
          gone.length > 0
            ? `Saved. The text no longer has ${gone.join(", ")}, so ${gone.length === 1 ? "its mark was" : "their marks were"} taken away. The cards stay.`
            : "Saved.",
          "success",
        ),
      );
    } catch (error) {
      setMessage(problemOf(error));
    } finally {
      setBusy(null);
    }
  }

  // Saves the changes first, so the cards are made for what the learner sees, and then makes the cards of the new words.
  async function onMakeCards() {
    if (!checked()) return;
    setMessage(null);
    setBusy("cards");
    try {
      await saveChanges();
      const created = await createCards(textId, deckIds);
      const [found, made] = await Promise.all([
        loadText(textId),
        loadTextCards(textId),
      ]);
      show(found);
      setCards(made);
      setDecksChanged((count) => count + 1);
      const count = created.made;
      const notes = [];
      if (count > 0)
        notes.push(
          newNotice(
            `Made ${count} ${count === 1 ? "card" : "cards"} in ${deckIds.length} ${deckIds.length === 1 ? "deck" : "decks"}.`,
            "success",
          ),
        );
      const failed = created.cards.some((card) => card.error);
      const problems = [];
      if (failed)
        problems.push(
          "Some sentences could not be generated. Try again later with the New sentence button of each card.",
        );
      if (created.existing.length > 0)
        problems.push(
          `No new card for ${created.existing.map((item) => `${item.word} ("${item.phrase}")`).join(", ")}: you already have ${created.existing.length === 1 ? "a card" : "cards"} with that meaning.`,
        );
      setMessage(
        problems.length > 0
          ? newNotice(problems.join(" "), failed ? "error" : "info")
          : (notes[0] ?? null),
      );
    } catch (error) {
      setMessage(problemOf(error));
    } finally {
      setBusy(null);
    }
  }

  async function onDelete() {
    setBusy("delete");
    try {
      await deleteText(textId);
      window.location.hash = hrefOf("texts");
    } catch (error) {
      setMessage(problemOf(error));
      setConfirming(false);
    } finally {
      setBusy(null);
    }
  }

  const pairTitle = "The languages cannot change on a saved text.";
  return (
    <>
      <section className="panel saved-text">
        <div className="saved-head">
          <a className="back-link" href={hrefOf("texts")}>
            ← Your texts
          </a>
          <span className="pair" title={pairTitle}>
            {NAMES[saved.text_language]} → {NAMES[saved.first_language]}
          </span>
        </div>
        <h2>Edit text</h2>
        <label className="field">
          <span className="field-label">Title</span>
          <input
            className="wide-field"
            type="text"
            maxLength={TITLE_LENGTH}
            autoComplete="off"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setMessage(null);
            }}
          />
        </label>
        <label className="field">
          <span className="field-label">Text</span>
          <textarea
            rows={6}
            value={text}
            onChange={(event) => editText(event.target.value)}
          />
          <TextCounter text={text} />
        </label>

        {text.trim() && (
          <div className="marking">
            <h3>Click the words you do not know</h3>
            <WordPicker
              pieces={pieces}
              marked={marked}
              setMarked={setMarked}
              selections={selections}
              setSelections={setSelections}
              onEdit={() => setMessage(null)}
              carded={withCards}
            />
            <h3>Marked words ({items.length})</h3>
            {items.length === 0 ? (
              <p className="hint">Nothing marked.</p>
            ) : (
              <ul className="chips" aria-label="Marked words">
                {items.map((word) => {
                  const pending = !withCards.includes(word.toLocaleLowerCase());
                  return (
                    <li
                      key={word}
                      className={pending ? "pending" : undefined}
                      title={
                        cardOf[word.toLocaleLowerCase()]?.sentence ?? undefined
                      }
                    >
                      {word}
                      {pending && " (no card yet)"}
                    </li>
                  );
                })}
              </ul>
            )}
            {lost.length > 0 && (
              <p className="hint" role="status">
                The text no longer has {lost.join(", ")}. The{" "}
                {lost.length === 1 ? "mark goes" : "marks go"} when you save,
                and the cards stay.
              </p>
            )}
          </div>
        )}

        <DeckPicker
          textLanguage={saved.text_language}
          firstLanguage={saved.first_language}
          selected={deckIds}
          onChange={setDeckIds}
          reload={decksChanged}
        />

        <p
          className={dirty ? "status-line unsaved" : "status-line"}
          role="status"
        >
          {dirty
            ? "Unsaved changes"
            : newWords.length === 0
              ? "Every marked word has a card."
              : `${newWords.length} marked ${newWords.length === 1 ? "word has" : "words have"} no card yet.${deckIds.length === 0 ? " Tick a deck to make cards." : ""}`}
        </p>
        <div className="button-row">
          <button
            type="button"
            className="primary"
            onClick={onMakeCards}
            disabled={
              newWords.length === 0 || deckIds.length === 0 || busy !== null
            }
            aria-busy={busy === "cards"}
          >
            {busy === "cards" && (
              <span className="button-spinner" aria-hidden="true" />
            )}
            {busy === "cards"
              ? "Asking the language model..."
              : `Make cards for ${newWords.length} new ${newWords.length === 1 ? "word" : "words"}`}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={onSave}
            disabled={!dirty || busy !== null}
          >
            {busy === "save" ? "Saving..." : "Save changes"}
          </button>
          {!confirming && (
            <button
              type="button"
              className="secondary danger push"
              onClick={() => setConfirming(true)}
            >
              Delete text
            </button>
          )}
        </div>
        {message && (
          <Notice notice={message} onDismiss={() => setMessage(null)} />
        )}

        {confirming && (
          <div
            className="delete-box"
            role="group"
            aria-label="Delete this text"
          >
            <div>
              <h3>Delete this text?</h3>
              <p>
                Its {saved.cards} {saved.cards === 1 ? "card" : "cards"}, their
                decks and your progress stay. Only the text and its marks go.
              </p>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="secondary"
                autoFocus
                disabled={busy !== null}
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary danger"
                disabled={busy !== null}
                onClick={onDelete}
              >
                {busy === "delete" ? "Deleting..." : "Delete text"}
              </button>
            </div>
          </div>
        )}
      </section>

      {cards?.length > 0 && (
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
