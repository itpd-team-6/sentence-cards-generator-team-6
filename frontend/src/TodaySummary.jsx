import { useEffect, useState } from "react";
import { DATA_CHANGED, loadDueCards, loadQueue } from "./api.js";
import { hrefOf } from "./router.js";
import { dayOf, summarize } from "./todaySummary.js";

const PLAY = "M8 5.5v13l11-6.5z";
const CHECK = "M5 12.5l4.5 4.5L19 7.5";

function Glyph({ path, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={path === PLAY ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

// What there is to study today, in the header of every page but Study (DEC-068). The pill opens the Study page; while
// the pointer rests on it, or it has the keyboard focus, a panel under it gives the cards of each kind and of each deck.
// It counts the cards of all the decks, not the ones ticked on the Study page.
export default function TodaySummary({ page }) {
  const [state, setState] = useState(null); // { summary } or { next } or { empty: true }; null while it is read
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const again = () => setReload((count) => count + 1);
    window.addEventListener(DATA_CHANGED, again);
    return () => window.removeEventListener(DATA_CHANGED, again);
  }, []);

  useEffect(() => {
    if (page === "study") return undefined;
    let current = true;
    (async () => {
      try {
        const due = await loadDueCards();
        if (!current) return;
        if (due.length > 0) {
          setState({ summary: summarize(due) });
          return;
        }
        const queue = await loadQueue();
        if (!current) return;
        setState(
          queue.length > 0 ? { next: queue[0].due_date } : { empty: true },
        );
      } catch {
        if (current) setState(null); // the header says nothing rather than something wrong
      }
    })();
    return () => {
      current = false;
    };
  }, [page, reload]);

  if (page === "study" || state === null) return null;

  if (state.summary) {
    const { summary } = state;
    return (
      <div className="today">
        <a
          className="today-pill"
          href={hrefOf("study")}
          aria-describedby="today-panel"
        >
          <span className="today-play">
            <Glyph path={PLAY} />
          </span>
          <span className="today-count">{summary.total} to study</span>
          <span className="today-time">{summary.minutes}</span>
        </a>
        <div className="today-panel" id="today-panel">
          <h2>Today — All decks</h2>
          <ul className="today-kinds">
            <li className="today-kind new">
              <b>{summary.new}</b>
              <span>New</span>
            </li>
            <li className="today-kind forgotten">
              <b>{summary.forgotten}</b>
              <span>Forgotten</span>
            </li>
            <li className="today-kind review">
              <b>{summary.review}</b>
              <span>Review</span>
            </li>
          </ul>
          <ul className="today-decks">
            {summary.decks.map((deck) => (
              <li key={deck.id}>
                <span>{deck.title}</span>
                <b>{deck.count}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (state.next) {
    return (
      <div className="today">
        <a className="today-pill done" href={hrefOf("study")}>
          <span className="today-play">
            <Glyph path={CHECK} />
          </span>
          <span className="today-count">All done today</span>
          <span className="today-time">next {dayOf(state.next)}</span>
        </a>
      </div>
    );
  }

  return (
    <div className="today">
      <a className="today-pill done" href={hrefOf("study")}>
        <span className="today-count">No cards yet</span>
      </a>
    </div>
  );
}
