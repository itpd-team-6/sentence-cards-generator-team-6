import { useEffect, useState } from "react";
import { loadTexts } from "./api.js";
import { hrefOfText } from "./router.js";

const NAMES = { ru: "Russian", en: "English", de: "German" };

// The chips of a row: the marked words, the ones that have no card yet with a ring of dashes. Four fit, and "+N" says how
// many more there are.
const CHIPS = 4;

const hasCard = (text, word) =>
  text.words_with_cards.some(
    (carded) => carded.toLocaleLowerCase() === word.toLocaleLowerCase(),
  );

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

// The saved texts, the newest first, in two tabs: the active ones and the archived ones (DEC-075). `active` is true while
// the page is shown; the list is read again each time, and when `reload` changes (a text was just saved), so it is the
// list as it is now.
export default function TextList({ active = true, reload = 0 }) {
  const [texts, setTexts] = useState(null);
  const [failed, setFailed] = useState(false);
  const [shown, setShown] = useState("active"); // "active" or "archived"

  useEffect(() => {
    if (!active) return;
    setFailed(false);
    loadTexts()
      .then(setTexts)
      .catch(() => setFailed(true));
  }, [active, reload]);

  const inTab = {
    active: texts?.filter((text) => !text.archived) ?? [],
    archived: texts?.filter((text) => text.archived) ?? [],
  };
  const listed = inTab[shown];

  return (
    <section className="panel" aria-label="Your texts">
      {texts !== null && (
        <div className="filter-mode text-views" role="group" aria-label="Show">
          {[
            ["active", "Active"],
            ["archived", "Archived"],
          ].map(([id, name]) => (
            <button
              key={id}
              type="button"
              aria-pressed={shown === id}
              onClick={() => setShown(id)}
            >
              {name} ({inTab[id].length})
            </button>
          ))}
        </div>
      )}
      {failed && (
        <p className="hint" role="alert">
          The texts could not be loaded. Is the product running?
        </p>
      )}
      {!failed && texts === null && <p className="hint">Loading...</p>}
      {texts !== null && listed.length === 0 && (
        <p className="hint">
          {shown === "active"
            ? "No texts yet. A text you save in Add cards from a text is kept here."
            : "No archived texts. Archive a text on its page to keep it out of the active list."}
        </p>
      )}
      {listed.length > 0 && (
        <div className="texts-scroll">
          <ul className="text-list">
            {listed.map((text) => (
              <li className="text-row" key={text.id}>
                <div className="text-main">
                  <strong className="text-title">{text.title}</strong>
                  <p className="meta">
                    {NAMES[text.text_language]} to {NAMES[text.first_language]}
                    {" · "}
                    {plural(text.words.length, "marked word", "marked words")}
                    {" · "}
                    {plural(text.cards, "card", "cards")}
                  </p>
                  {text.words.length > 0 && (
                    <ul className="chips" aria-label="Marked words">
                      {text.words.slice(0, CHIPS).map((word) => (
                        <li
                          key={word}
                          className={
                            hasCard(text, word) ? undefined : "pending"
                          }
                        >
                          {word}
                          {!hasCard(text, word) && " (no card yet)"}
                        </li>
                      ))}
                      {text.words.length > CHIPS && (
                        <li className="more">+{text.words.length - CHIPS}</li>
                      )}
                    </ul>
                  )}
                </div>
                <a
                  className="secondary"
                  href={hrefOfText(text.id)}
                  aria-label={`Open ${text.title}`}
                >
                  Open
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
