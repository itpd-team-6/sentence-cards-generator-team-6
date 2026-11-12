import { useEffect, useState } from "react";
import {
  answerCard,
  changeCard,
  loadDecks,
  loadDueCards,
  newSentence,
} from "./api.js";
import CardEditDialog from "./CardEditDialog.jsx";
import Icon, { ICON_PATHS } from "./Icon.jsx";
import { readTickedDecks, writeTickedDecks } from "./deckSelection.js";
import Notice, { newNotice } from "./Notice.jsx";
import StudyDecks from "./StudyDecks.jsx";
import StudyQueue from "./StudyQueue.jsx";
import StudyRing from "./StudyRing.jsx";
import { estimate, greeting } from "./studyTexts.js";
import { splitAtWords } from "./words.js";

// The four answers, from the one that brings the card back today to the one that sends it the furthest. Each button
// says when the card comes back, from the forecast the product sent with the card.
const ANSWERS = [
  { id: "again", name: "Again" },
  { id: "hard", name: "Hard" },
  { id: "good", name: "Good" },
  { id: "easy", name: "Easy" },
];

const inDays = (days) =>
  days === 0 ? "today" : days === 1 ? "1 day" : `${days} days`;

// What the page last knew, so that coming back to it shows the decks and the numbers at once instead of an empty page
// that fills in; both are loaded again each time, and the new answer replaces them.
let lastDecks = null;
let lastDue = {};

// Forget what the page last knew (the tests start from nothing, and so does a learner who changes library).
export function forgetLastStudy() {
  lastDecks = null;
  lastDue = {};
}

// The study session: the cards that are due, one at a time. A card answered "Again" goes to the end of the session and
// comes back; a card with any other answer leaves it. A card deleted while the session is open is skipped. The learner
// can fix the card in front of them without leaving the session: edit it, ask for another sentence, or hide it.
// `onSessionChange` tells the page around when a session is open, so that it can step aside.
export default function StudyPage({ onSessionChange }) {
  const [queue, setQueue] = useState(null); // null until a session starts; then the cards still to answer
  const [reviewed, setReviewed] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [decks, setDecks] = useState(lastDecks); // null until the decks are loaded
  const [ticked, setTicked] = useState(readTickedDecks); // the decks of this session, remembered in this browser
  const [due, setDue] = useState(
    () => lastDue[readTickedDecks().join(",")] ?? [],
  ); // the cards due today in the ticked decks, for the numbers of the Study box
  const [dueKey, setDueKey] = useState(() => {
    const key = readTickedDecks().join(",");
    return key === "" || key in lastDue ? key : null;
  }); // the ticked decks that `due` is the answer for; null until the first answer
  const [dueVersion, setDueVersion] = useState(0); // changes when the saved order may have changed what is due
  const [decksFailed, setDecksFailed] = useState(false); // the decks could not be loaded
  const [editing, setEditing] = useState(false); // the editor of the card in front of the learner is open
  const [editError, setEditError] = useState(""); // why the editor could not save

  useEffect(() => {
    loadDecks()
      .then((found) => {
        lastDecks = found;
        setDecks(found);
        // A deck that no longer exists is not ticked any more.
        setTicked((before) =>
          before.filter((id) => found.some((deck) => deck.id === id)),
        );
      })
      .catch((error) => {
        setDecksFailed(true);
        setMessage(newNotice(error.message));
      });
  }, []);

  const tickedKey = ticked.join(",");
  useEffect(() => {
    if (ticked.length === 0) {
      setDue([]);
      setDueKey("");
      return;
    }
    let current = true; // an answer for decks that are no longer ticked is dropped
    loadDueCards(ticked)
      .then((found) => {
        lastDue = { ...lastDue, [tickedKey]: found };
        if (current) {
          setDue(found);
          setDueKey(tickedKey);
        }
      })
      .catch((error) => setMessage(newNotice(error.message)));
    return () => {
      current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `tickedKey` is `ticked` as a value that does not change at every render
  }, [tickedKey, dueVersion, queue]);

  const inSession = queue !== null;
  useEffect(() => {
    onSessionChange?.(inSession);
    return () => onSessionChange?.(false);
  }, [inSession, onSessionChange]);

  function tick(deckIds) {
    setTicked(deckIds);
    writeTickedDecks(deckIds);
  }

  async function start() {
    setBusy(true);
    setMessage(null);
    setFeedback(null);
    try {
      const cards = await loadDueCards(ticked);
      setQueue(cards);
      setReviewed(0);
      setRevealed(false);
    } catch (error) {
      setMessage(newNotice(error.message));
    } finally {
      setBusy(false);
    }
  }

  async function answer(choice) {
    const [card, ...rest] = queue;
    setBusy(true);
    setMessage(null);
    try {
      const result = await answerCard(card.id, choice);
      const again = choice === "again";
      setQueue(again ? [...rest, card] : rest);
      setReviewed(reviewed + 1);
      setRevealed(false);
      setFeedback(
        again
          ? newNotice(
              `Again "${card.word}". It comes back in this session.`,
              "info",
            )
          : newNotice(
              `"${card.word}" is answered. You will see it again on ${result.due_date}.`,
              "success",
            ),
      );
    } catch (error) {
      if (error.status === 404) {
        // The card was deleted while the session was open: skip it and go on to the next one.
        setQueue(rest);
        setRevealed(false);
        setFeedback(
          newNotice(
            `"${card.word}" was deleted, so the session goes on without it.`,
            "info",
          ),
        );
      } else {
        setMessage(newNotice(error.message));
      }
    } finally {
      setBusy(false);
    }
  }

  // Puts the new fields of the first card of the session in its place; the rest of the session stays as it was.
  const updateFirst = (fields) =>
    setQueue((current) => [{ ...current[0], ...fields }, ...current.slice(1)]);

  async function saveEdit(fields) {
    setBusy(true);
    setEditError("");
    try {
      const saved = await changeCard(queue[0].id, fields);
      updateFirst({
        sentence: saved.sentence,
        translation: saved.translation,
      });
      setEditing(false);
    } catch (error) {
      setEditError(error.message);
    } finally {
      setBusy(false);
    }
  }

  // The new sentence and its translation replace the old ones on the same card, and the learner starts the card again:
  // the translation is hidden until they ask for it.
  async function regenerate() {
    setBusy(true);
    setMessage(null);
    try {
      const made = await newSentence(queue[0].id);
      updateFirst({ sentence: made.sentence, translation: made.translation });
      setRevealed(false);
    } catch (error) {
      setMessage(newNotice(error.message));
    } finally {
      setBusy(false);
    }
  }

  // A hidden card leaves the session and is not studied until the learner shows it again in Your cards.
  async function hide() {
    const [first, ...rest] = queue;
    setBusy(true);
    setMessage(null);
    try {
      await changeCard(first.id, { hidden: true });
      setQueue(rest);
      setRevealed(false);
      setFeedback(
        newNotice(
          `"${first.word}" is hidden, so it does not come back.`,
          "info",
        ),
      );
    } catch (error) {
      setMessage(newNotice(error.message));
    } finally {
      setBusy(false);
    }
  }

  const card = queue?.[0];

  // Until the decks are known, only a short note: the boxes below need them, and drawing them half empty makes the
  // page jump.
  if (queue === null && decks === null) {
    return (
      <>
        <section className="panel" aria-label="Decks" aria-busy={!decksFailed}>
          <div className="pane-head">
            <h2>Decks</h2>
          </div>
          <p className="hint" role="status">
            {decksFailed
              ? "The decks could not be loaded. Reload the page to try again."
              : "Loading the decks..."}
          </p>
        </section>
        {message && (
          <Notice notice={message} onDismiss={() => setMessage(null)} />
        )}
      </>
    );
  }

  // Before a session, from the top: the Study box with the day in numbers, the button that starts a session and the
  // decks to study from, then the Reorder box over the whole width. The box has the same height whatever is ticked, so
  // ticking a deck never moves what is below it.
  if (queue === null) {
    const counts = {
      new: due.filter((item) => item.stage === "new").length,
      forgotten: due.filter((item) => item.stage === "forgotten").length,
      due: due.filter((item) => item.stage === "due").length,
    };
    // What the box says about the ticked decks. While the answer for them is on its way, the line stays empty, so that it
    // never says "Nothing to study today" for a moment.
    const status =
      ticked.length === 0
        ? "Tick a deck to start"
        : dueKey !== tickedKey
          ? ""
          : due.length === 0
            ? "Nothing to study today"
            : due.length === 1
              ? "1 card is ready"
              : `${due.length} cards are ready`;
    const now = new Date();
    return (
      <>
        <section className="panel study-hero" aria-label="Study">
          <div className="study-hero-main">
            <StudyRing
              counts={counts}
              label={`${due.length} ${due.length === 1 ? "card" : "cards"} to study`}
            />
            <div className="study-summary">
              <p className="eyebrow">
                {now.toLocaleDateString("en-US", { weekday: "long" })}
              </p>
              <h2 className="study-greeting">{greeting(now.getHours())}</h2>
              <p className="study-title">{status || "\u00a0"}</p>
              <div className="study-row">
                <ul className="study-stats">
                  {[
                    ["new", "New"],
                    ["forgotten", "Forgotten"],
                    ["due", "Review"],
                  ].map(([stage, name]) => (
                    <li key={stage} className={`study-stat ${stage}`}>
                      <b>{counts[stage]}</b>
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="primary study-start"
                  onClick={start}
                  disabled={busy || due.length === 0}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M7 4.5v15l13-7.5z" />
                  </svg>
                  <span>
                    {busy ? "Looking for cards..." : "Start session"}
                    {!busy && due.length > 0 && (
                      <small>{estimate(due.length)}</small>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <StudyDecks decks={decks} ticked={ticked} onChange={tick} />
        </section>
        <section className="panel reorder-panel" aria-label="Reorder">
          <div className="pane-head">
            <h2>Reorder</h2>
          </div>
          <StudyQueue
            deckIds={ticked}
            onSaved={() => setDueVersion((version) => version + 1)}
          />
        </section>
        {message && (
          <Notice notice={message} onDismiss={() => setMessage(null)} />
        )}
      </>
    );
  }

  return (
    <section className="panel session" aria-label="Study session">
      <div className="session-bar">
        <button
          type="button"
          className="back-button"
          aria-label="Back to Study"
          title="Back to Study"
          onClick={() => setQueue(null)}
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <h2>Study</h2>
      </div>

      {!card && (
        <>
          <p className="hint" role="status">
            {reviewed === 0
              ? "Nothing is due. Come back when a card is due."
              : `Session done: ${reviewed} ${reviewed === 1 ? "answer" : "answers"}. Nothing else is due.`}
          </p>
          <div className="actions">
            <button
              type="button"
              className="primary"
              onClick={start}
              disabled={busy}
            >
              Start another session
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => setQueue(null)}
            >
              Back to the decks
            </button>
          </div>
        </>
      )}

      {card && (
        <>
          <p className="hint" role="status">
            {queue.length} {queue.length === 1 ? "card" : "cards"} left in this
            session.
          </p>
          <div className="study-card">
            <div className="study-tools" role="group" aria-label="This card">
              <button
                type="button"
                className="icon-button"
                aria-label="Edit"
                title="Edit"
                disabled={busy}
                onClick={() => {
                  setEditError("");
                  setEditing(true);
                }}
              >
                <Icon path={ICON_PATHS.edit} />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="New sentence"
                title="New sentence"
                disabled={busy}
                onClick={regenerate}
              >
                <Icon path={ICON_PATHS.new} />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="Hide"
                title="Hide"
                disabled={busy}
                onClick={hide}
              >
                <Icon path={ICON_PATHS.hide} />
              </button>
            </div>
            <p className="study-word">{card.word}</p>
            <p className="study-sentence">
              {splitAtWords(card.sentence, card.word).map((segment, index) =>
                segment.marked ? (
                  <strong key={index}>{segment.text}</strong>
                ) : (
                  segment.text
                ),
              )}
            </p>
            {revealed && (
              <p className="study-translation">{card.translation}</p>
            )}
          </div>
          {revealed ? (
            <div
              className="study-actions"
              role="group"
              aria-label="How well did you remember it?"
            >
              {ANSWERS.map(({ id, name }) => (
                <button
                  key={id}
                  type="button"
                  className="secondary answer"
                  disabled={busy}
                  onClick={() => answer(id)}
                >
                  <span className="answer-name">{name}</span>
                  <span className="answer-when">
                    {inDays(card.forecast[id].interval_days)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="study-actions">
              <button
                type="button"
                className="primary"
                onClick={() => setRevealed(true)}
              >
                Show translation
              </button>
            </div>
          )}
        </>
      )}

      {editing && card && (
        <CardEditDialog
          card={card}
          showPhrase={false}
          saving={busy}
          error={editError}
          onSave={saveEdit}
          onCancel={() => setEditing(false)}
        />
      )}
      {message && (
        <Notice notice={message} onDismiss={() => setMessage(null)} />
      )}
      {feedback && (
        <Notice notice={feedback} onDismiss={() => setFeedback(null)} />
      )}
    </section>
  );
}
