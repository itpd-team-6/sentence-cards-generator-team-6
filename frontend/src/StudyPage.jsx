import { useEffect, useState } from "react";
import { answerCard, loadDecks, loadDueCards } from "./api.js";
import DeckTag from "./DeckTag.jsx";
import {
  readTickedDecks,
  shuffled,
  writeTickedDecks,
} from "./deckSelection.js";
import Notice, { newNotice } from "./Notice.jsx";
import StudyDecks from "./StudyDecks.jsx";
import StudyQueue from "./StudyQueue.jsx";
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

// The study session: the cards that are due, one at a time. A card answered "Again" goes to the end of the session and
// comes back; a card with any other answer leaves it. A card deleted while the session is open is skipped.
export default function StudyPage() {
  const [queue, setQueue] = useState(null); // null until a session starts; then the cards still to answer
  const [reviewed, setReviewed] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [decks, setDecks] = useState(null); // null until the decks are loaded
  const [ticked, setTicked] = useState(readTickedDecks); // the decks of this session, remembered in this browser
  const [due, setDue] = useState([]); // the cards due today in the ticked decks, for the numbers of the Study box
  const [dueVersion, setDueVersion] = useState(0); // changes when the saved order may have changed what is due
  const [shuffle, setShuffle] = useState(false); // mixes the order of one session; the saved order does not change
  const [decksFailed, setDecksFailed] = useState(false); // the decks could not be loaded
  const [folded, setFolded] = useState(true); // the Reorder box starts folded away; the learner opens it

  useEffect(() => {
    loadDecks()
      .then((found) => {
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
      return;
    }
    loadDueCards(ticked)
      .then(setDue)
      .catch((error) => setMessage(newNotice(error.message)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `tickedKey` is `ticked` as a value that does not change at every render
  }, [tickedKey, dueVersion, queue]);

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
      setQueue(shuffle ? shuffled(cards) : cards);
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

  const card = queue?.[0];
  const tickedDecks = (decks ?? []).filter((deck) => ticked.includes(deck.id));

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

  // Before a session: the decks, then Reorder (which can be folded away) next to Study.
  if (queue === null) {
    return (
      <>
        <StudyDecks decks={decks} ticked={ticked} onChange={tick} />
        <div className={folded ? "study-split collapsed" : "study-split"}>
          <section className="panel reorder-panel" aria-label="Reorder">
            <button
              type="button"
              className="collapse-button"
              aria-expanded={!folded}
              aria-label={
                folded ? "Open the Reorder box" : "Fold the Reorder box"
              }
              title={folded ? "Open" : "Fold"}
              onClick={() => setFolded(!folded)}
            >
              {folded ? "»" : "«"}
            </button>
            <div className="reorder-inner" inert={folded}>
              <div className="pane-head">
                <h2>Reorder</h2>
              </div>
              <StudyQueue
                deckIds={ticked}
                onSaved={() => setDueVersion((version) => version + 1)}
              />
            </div>
            <div className="rail" aria-hidden="true">
              Reorder
            </div>
          </section>
          <section className="panel study-panel" aria-label="Study">
            <div className="pane-head">
              <h2>Study</h2>
            </div>
            <div className="study-stats">
              <div className="study-stat">
                <b>{due.length}</b>
                <span>due today</span>
              </div>
              <div className="study-stat">
                <b>{ticked.length}</b>
                <span>
                  {ticked.length === 1 ? "deck ticked" : "decks ticked"}
                </span>
              </div>
            </div>
            <div className="study-by-deck">
              {tickedDecks.map((deck) => (
                <span className="deck-count" key={deck.id}>
                  <DeckTag deck={deck} />
                  <b>
                    {
                      due.filter((item) =>
                        item.decks.some((other) => other.id === deck.id),
                      ).length
                    }
                  </b>
                </span>
              ))}
            </div>
            <div className="study-session">
              <div className="study-session-left">
                <label className="shuffle">
                  <input
                    type="checkbox"
                    checked={shuffle}
                    onChange={(event) => setShuffle(event.target.checked)}
                  />
                  Shuffle this session only
                </label>
                <span
                  className="order-state"
                  style={{ visibility: due.length > 0 ? "visible" : "hidden" }}
                  aria-hidden={due.length === 0}
                >
                  {shuffle ? "Shuffled" : "Saved order"}
                </span>
              </div>
              <button
                type="button"
                className="primary"
                onClick={start}
                disabled={busy || due.length === 0}
              >
                {busy ? "Looking for cards..." : "Start a session"}
              </button>
            </div>
          </section>
        </div>
        {message && (
          <Notice notice={message} onDismiss={() => setMessage(null)} />
        )}
      </>
    );
  }

  return (
    <section className="panel">
      <h2>Study</h2>

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
            {revealed ? (
              <p className="study-translation">{card.translation}</p>
            ) : (
              <p className="study-translation empty">
                Do you remember it? Show the translation to check.
              </p>
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

      {message && (
        <Notice notice={message} onDismiss={() => setMessage(null)} />
      )}
      {feedback && (
        <Notice notice={feedback} onDismiss={() => setFeedback(null)} />
      )}
    </section>
  );
}
