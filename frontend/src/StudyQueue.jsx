import { useEffect, useRef, useState } from "react";
import { loadQueue, saveQueueOrder } from "./api.js";
import { splitAtWord } from "./words.js";

// The line between the cards due today and the cards due later. It is an item of the list, so a card is due today when
// it sits above the line and later when it sits below it.
const DIVIDER = { divider: true };

const toList = (cards) => [
  ...cards.filter((card) => card.due_today),
  DIVIDER,
  ...cards.filter((card) => !card.due_today),
];

// Six dots: the handle the learner holds to move a card.
function Handle() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
      {[9, 15].flatMap((x) => [6, 12, 18].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" />))}
    </svg>
  );
}

// The sentence of a card on one line, with the word of the card marked, so the learner knows which card it is.
function Sentence({ card }) {
  const [before, word, after] = splitAtWord(card.sentence, card.word);
  return (
    <span className="queue-sentence">
      {before}
      {word && <mark>{word}</mark>}
      {after}
    </span>
  );
}

// "Fri, 24 Oct": the day a card that is not due today will be studied.
const dayOf = (isoDate) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

// The list as it is once `group` (card ids) is put where `index` points. `index` counts the places of the list as it is
// now: 0 is before the first item and `list.length` after the last.
function placeGroup(list, group, index) {
  const inGroup = (item) => !item.divider && group.includes(item.id);
  const moved = list.filter(inGroup);
  const rest = list.filter((item) => !inGroup(item));
  const before = list.slice(0, index).filter(inGroup).length;
  return [...rest.slice(0, index - before), ...moved, ...rest.slice(index - before)];
}

const sameList = (first, second) => first.every((item, place) => item === second[place]);

// The study queue: every card with a sentence, in the order the session studies them. The cards above the line are due
// today and the cards below it are due later, each with its date. The learner drags a card by its handle to any place,
// across the line too, or presses the up or down arrow on the handle; ticked cards move together. The order is saved
// when the card is dropped: the cards that moved get due times between their new neighbours and, when they cross the
// line, a new date; the others keep theirs.
export default function StudyQueue() {
  const [list, setList] = useState([]);
  const [ticked, setTicked] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [drag, setDrag] = useState(null); // { ids, over }: the cards being dragged, and the place the drop line is at
  const [focusId, setFocusId] = useState(null);
  const handles = useRef({});

  useEffect(() => {
    loadQueue()
      .then((cards) => setList(toList(cards)))
      .catch((error) => setMessage(error.message));
  }, []);

  // After a card moves with the keyboard, the focus goes back to its handle.
  useEffect(() => {
    if (focusId !== null) handles.current[focusId]?.focus();
  }, [list, focusId]);

  const cards = list.filter((item) => !item.divider);
  const dividerAt = list.indexOf(DIVIDER);
  const textIds = [...new Set(cards.map((card) => card.text_id))].sort((a, b) => a - b);

  // A ticked card moves with all the ticked cards; any other card moves alone.
  const groupOf = (card) =>
    ticked.has(card.id) ? cards.filter((item) => ticked.has(item.id)).map((item) => item.id) : [card.id];

  function toggle(id) {
    const next = new Set(ticked);
    if (!next.delete(id)) next.add(id);
    setTicked(next);
  }

  // A text is ticked when all its cards are; a click ticks the cards of the text, or unticks them when all are ticked.
  const cardsOfText = (textId) => cards.filter((card) => card.text_id === textId);
  const tickedOfText = (textId) => cardsOfText(textId).filter((card) => ticked.has(card.id)).length;

  function toggleText(textId) {
    const next = new Set(ticked);
    const all = tickedOfText(textId) === cardsOfText(textId).length;
    cardsOfText(textId).forEach((card) => (all ? next.delete(card.id) : next.add(card.id)));
    setTicked(next);
  }

  // Shows the new order at once and saves it; when it cannot be saved, the list goes back to the order it had.
  async function move(next, movedIds) {
    if (sameList(next, list)) return;
    const before = list;
    setList(next);
    setSaving(true);
    setMessage("");
    setSaved(false);
    try {
      const answer = await saveQueueOrder(
        next.filter((item) => !item.divider).map((item) => item.id),
        movedIds,
        next.indexOf(DIVIDER),
      );
      setList(toList(answer));
      setSaved(true);
    } catch (error) {
      setList(before);
      setMessage(`The move was not saved. ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  function moveWithKeys(event, card) {
    if (saving || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) return;
    event.preventDefault();
    const group = groupOf(card);
    const inGroup = (item) => !item.divider && group.includes(item.id);
    const places = list.map((item, place) => (inGroup(item) ? place : -1)).filter((place) => place >= 0);
    let index;
    if (event.key === "ArrowUp") {
      let target = places[0] - 1;
      while (target >= 0 && inGroup(list[target])) target -= 1;
      if (target < 0) return;
      index = target;
    } else {
      let target = places[places.length - 1] + 1;
      while (target < list.length && inGroup(list[target])) target += 1;
      if (target >= list.length) return;
      index = target + 1;
    }
    setFocusId(card.id);
    move(placeGroup(list, group, index), group);
  }

  function startDragging(event, card) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(card.id));
    event.dataTransfer.setDragImage(event.currentTarget.closest("li"), 16, 16);
    setDrag({ ids: groupOf(card), over: null });
  }

  function dragOver(event, index) {
    if (!drag || saving) return;
    event.preventDefault();
    const box = event.currentTarget.getBoundingClientRect();
    const over = event.clientY > box.top + box.height / 2 ? index + 1 : index;
    if (over !== drag.over) setDrag({ ...drag, over });
  }

  function drop(event) {
    event.preventDefault();
    if (drag?.over != null) move(placeGroup(list, drag.ids, drag.over), drag.ids);
    setDrag(null);
  }

  if (cards.length === 0 && !message) return null;

  let number = 0;
  return (
    <div className="queue-box">
      <h3>Study order</h3>
      <p className="hint">
        Drag{" "}
        <span className="queue-hint-handle">
          <Handle />
        </span>{" "}
        to reorder. Tick cards to move several.
      </p>
      <div className="queue-pills" role="group" aria-label="Tick the cards of a text">
        {textIds.length > 1 &&
          textIds.map((id) => {
            const count = tickedOfText(id);
            const all = count === cardsOfText(id).length;
            return (
              <button
                type="button"
                key={id}
                className={count > 0 && !all ? "queue-pill part" : "queue-pill"}
                aria-pressed={all}
                disabled={saving}
                onClick={() => toggleText(id)}
              >
                {count > 0 && !all ? `Text ${id} · ${count}/${cardsOfText(id).length}` : `Text ${id}`}
              </button>
            );
          })}
        <button
          type="button"
          className="queue-pill queue-clear"
          disabled={ticked.size === 0}
          onClick={() => setTicked(new Set())}
        >
          {ticked.size > 0 ? `Clear selection (${ticked.size})` : "Clear selection"}
        </button>
      </div>
      <div className="queue-scroll" tabIndex={0} role="region" aria-label="Study order">
        <ol className="queue">
          <li className="queue-section">Due today{dividerAt === 0 && <span> · nothing yet</span>}</li>
          {list.map((item, index) => {
            const dropLine = drag?.over === index ? "drop-before" : "";
            if (item.divider) {
              return (
                <li
                  key="divider"
                  className={`queue-section ${dropLine}`}
                  onDragOver={(event) => dragOver(event, index)}
                  onDrop={drop}
                >
                  Later
                </li>
              );
            }
            const card = item;
            number += 1;
            return (
              <li
                key={card.id}
                className={[dropLine, drag?.ids.includes(card.id) && "dragging"].filter(Boolean).join(" ")}
                onDragOver={(event) => dragOver(event, index)}
                onDrop={drop}
              >
                <span
                  className="queue-handle"
                  role="button"
                  tabIndex={0}
                  draggable={!saving}
                  ref={(element) => {
                    handles.current[card.id] = element;
                  }}
                  aria-label={`Move ${card.word}. Press the up or down arrow to move it.`}
                  onDragStart={(event) => startDragging(event, card)}
                  onDragEnd={() => setDrag(null)}
                  onKeyDown={(event) => moveWithKeys(event, card)}
                >
                  <Handle />
                </span>
                <input
                  type="checkbox"
                  className="queue-check"
                  aria-label={`Select ${card.word}`}
                  checked={ticked.has(card.id)}
                  onChange={() => toggle(card.id)}
                />
                <span className="queue-number">{number}</span>
                <div className="queue-body">
                  <span className="queue-word">{card.word}</span>
                  <Sentence card={card} />
                </div>
                {index > dividerAt && <span className="queue-date">{dayOf(card.due_date)}</span>}
                <span className="queue-text">{`Text ${card.text_id}`}</span>
              </li>
            );
          })}
          <li
            className={drag?.over === list.length ? "queue-end drop-before" : "queue-end"}
            aria-hidden="true"
            onDragOver={(event) => {
              if (!drag || saving) return;
              event.preventDefault();
              if (drag.over !== list.length) setDrag({ ...drag, over: list.length });
            }}
            onDrop={drop}
          />
        </ol>
      </div>
      {saved && !message && (
        <p className="hint" role="status">
          Order saved.
        </p>
      )}
      {message && (
        <p className="notice" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
