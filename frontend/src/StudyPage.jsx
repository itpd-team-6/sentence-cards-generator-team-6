import { useState } from "react";
import { answerCard, loadDueCards } from "./api.js";
import Notice, { newNotice } from "./Notice.jsx";
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
// comes back; a card with any other answer leaves it.
export default function StudyPage() {
  const [queue, setQueue] = useState(null); // null until a session starts; then the cards still to answer
  const [reviewed, setReviewed] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [feedback, setFeedback] = useState(null);

  async function start() {
    setBusy(true);
    setMessage(null);
    setFeedback(null);
    try {
      const due = await loadDueCards();
      setQueue(due);
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
      setMessage(newNotice(error.message));
    } finally {
      setBusy(false);
    }
  }

  const card = queue?.[0];

  return (
    <section className="panel">
      <h2>Study</h2>

      {queue === null && (
        <>
          <p className="hint">Study the cards that are due, one at a time.</p>
          <div className="actions">
            <button
              type="button"
              className="primary"
              onClick={start}
              disabled={busy}
            >
              {busy ? "Looking for cards..." : "Start a session"}
            </button>
          </div>
          <StudyQueue />
        </>
      )}

      {queue !== null && !card && (
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
