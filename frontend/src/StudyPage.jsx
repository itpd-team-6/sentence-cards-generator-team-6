import { useState } from "react";
import { answerCard, loadDueCards } from "./api.js";

// The sentence in three parts, so the word the learner studies can be shown in bold. A form of the word
// that is not in the sentence (a different ending, say) is simply not marked.
function splitAtWord(sentence, word) {
  const start = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (start === -1) return [sentence, "", ""];
  return [sentence.slice(0, start), sentence.slice(start, start + word.length), sentence.slice(start + word.length)];
}

// The study session: the cards that are due, one at a time. A card that was forgotten goes to the end of the
// session and comes back; a card that was remembered leaves it.
export default function StudyPage() {
  const [queue, setQueue] = useState(null); // null until a session starts; then the cards still to answer
  const [reviewed, setReviewed] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  async function start() {
    setBusy(true);
    setMessage("");
    setFeedback("");
    try {
      const due = await loadDueCards();
      setQueue(due);
      setReviewed(0);
      setRevealed(false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function answer(remembered) {
    const [card, ...rest] = queue;
    setBusy(true);
    setMessage("");
    try {
      const result = await answerCard(card.id, remembered);
      setQueue(remembered ? rest : [...rest, card]);
      setReviewed(reviewed + 1);
      setRevealed(false);
      setFeedback(
        remembered
          ? `Remembered "${card.word}". You will see it again on ${result.due_date}.`
          : `Forgotten "${card.word}". It comes back in this session.`,
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  const card = queue?.[0];
  const [before, word, after] = card ? splitAtWord(card.sentence, card.word) : [];

  return (
    <section className="panel">
      <h2>Study</h2>

      {queue === null && (
        <>
          <p className="hint">Study the cards that are due, one at a time.</p>
          <div className="actions">
            <button type="button" className="primary" onClick={start} disabled={busy}>
              {busy ? "Looking for cards..." : "Start a session"}
            </button>
          </div>
        </>
      )}

      {queue !== null && !card && (
        <>
          <p className="notice ok" role="status">
            {reviewed === 0
              ? "Nothing is due. Come back when a card is due."
              : `Session done: ${reviewed} ${reviewed === 1 ? "answer" : "answers"}. Nothing else is due.`}
          </p>
          {feedback && <p className="hint">{feedback}</p>}
          <div className="actions">
            <button type="button" className="primary" onClick={start} disabled={busy}>
              Start another session
            </button>
          </div>
        </>
      )}

      {card && (
        <>
          <p className="hint" role="status">
            {queue.length} {queue.length === 1 ? "card" : "cards"} left in this session.
          </p>
          <div className="study-card">
            <p className="study-word">{card.word}</p>
            <p className="study-sentence">
              {before}
              {word && <strong>{word}</strong>}
              {after}
            </p>
            {revealed ? (
              <p className="study-translation">{card.translation}</p>
            ) : (
              <p className="study-translation empty">Do you remember it? Show the translation to check.</p>
            )}
          </div>
          <div className="study-actions">
            {revealed ? (
              <>
                <button type="button" className="secondary big" disabled={busy} onClick={() => answer(false)}>
                  Forgotten
                </button>
                <button type="button" className="primary" disabled={busy} onClick={() => answer(true)}>
                  Remembered
                </button>
              </>
            ) : (
              <button type="button" className="primary" onClick={() => setRevealed(true)}>
                Show translation
              </button>
            )}
          </div>
          {feedback && <p className="hint">{feedback}</p>}
        </>
      )}

      {message && (
        <p className="notice" role="alert">
          {message}
        </p>
      )}
    </section>
  );
}
