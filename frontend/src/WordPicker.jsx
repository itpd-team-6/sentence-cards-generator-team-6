import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { markKey } from "./words.js";

// The text the learner marks the words of.
//
// - A click marks a word, or takes the mark away: every appearance of the word is marked.
// - Hold Shift and click words to choose several of them, in one place of the text, as one card. A word between the
//   chosen ones can be left out, which is what a verb with a separable prefix needs ("stimmt ... zu"). Shift and a click
//   on a chosen word takes it out. When Shift is let go the selection is done, and the next Shift and click starts
//   another one.
// - A bubble over the selection shows the card word, while Shift is held and when the pointer is over the selection.
//   When the words are on different lines, the other parts of the selection get a dashed ring while the pointer is on one.
//
// `selections` is [{ id, words: [index of the piece, ...] }]. A selection of one word only exists while Shift is held.
let lastSelection = 0;

export default function WordPicker({
  pieces,
  marked,
  setMarked,
  selections,
  setSelections,
  onEdit,
}) {
  const [building, setBuilding] = useState(null); // id of the selection that Shift is adding to
  const [lastAdded, setLastAdded] = useState(null); // the word the learner added last
  const [hover, setHover] = useState(null); // the word under the pointer
  const [sameLine, setSameLine] = useState({}); // id of a selection -> its words are all on one line
  const [bubble, setBubble] = useState(null); // { text, left, top }
  const boxRef = useRef(null);
  const latest = useRef({});
  latest.current = { building, selections, pieces };

  const keyOf = (index) => markKey(pieces[index].text);
  const selectionOf = (index) =>
    selections.find((selection) => selection.words.includes(index));
  const addKey = (key) =>
    setMarked((current) =>
      current.includes(key) ? current : [...current, key],
    );

  function takeOut(index) {
    const selection = selectionOf(index);
    const rest = selection.words.filter((word) => word !== index);
    // A selection that is not being built needs two words at least; the one that is left is a plain mark.
    const keep =
      rest.length >= 2 || (rest.length >= 1 && selection.id === building);
    if (rest.length === 1 && !keep) addKey(keyOf(rest[0]));
    setSelections(
      selections.flatMap((item) => {
        if (item !== selection) return [item];
        return keep ? [{ ...item, words: rest }] : [];
      }),
    );
  }

  function choose(index) {
    const current = selections.find((selection) => selection.id === building);
    setLastAdded(index);
    if (current) {
      setSelections(
        selections.map((selection) =>
          selection === current
            ? {
                ...selection,
                words: [...selection.words, index].sort((a, b) => a - b),
              }
            : selection,
        ),
      );
      return;
    }
    lastSelection += 1;
    setBuilding(lastSelection);
    setSelections([...selections, { id: lastSelection, words: [index] }]);
  }

  function click(event, index) {
    onEdit();
    if (selectionOf(index)) {
      takeOut(index);
    } else if (event.shiftKey) {
      choose(index);
    } else {
      const key = keyOf(index);
      setMarked((current) =>
        current.includes(key)
          ? current.filter((item) => item !== key)
          : [...current, key],
      );
    }
  }

  // Letting go of Shift ends the selection; a selection of one word is just a marked word.
  useEffect(() => {
    function finish() {
      const { building: id, selections: current, pieces: all } = latest.current;
      if (id === null) return;
      setBuilding(null);
      const selection = current.find((item) => item.id === id);
      if (selection && selection.words.length < 2) {
        setSelections(current.filter((item) => item !== selection));
        if (selection.words.length === 1)
          addKey(markKey(all[selection.words[0]].text));
      }
    }
    const onKeyUp = (event) => event.key === "Shift" && finish();
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", finish);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", finish);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- reads the latest state from `latest`

  const several = selections.filter((selection) => selection.words.length > 1);
  const hovered = hover === null ? null : selectionOf(hover);
  const active =
    selections.find((selection) => selection.id === building) ?? hovered;

  // Where the words are: are all the words of a selection on one line? Measured again when the window changes.
  function measure() {
    const box = boxRef.current;
    if (!box) return;
    const rect = (index) =>
      box.querySelector(`[data-i="${index}"]`)?.getBoundingClientRect();
    const next = {};
    for (const selection of several) {
      // The same line: the words start at the same height, give or take a few pixels of the font.
      const first = rect(selection.words[0]);
      next[selection.id] = selection.words.every((word) => {
        const found = rect(word);
        return (
          found && first && Math.abs(found.top - first.top) < first.height / 2
        );
      });
    }
    setSameLine((current) =>
      JSON.stringify(current) === JSON.stringify(next) ? current : next,
    );
  }
  useLayoutEffect(measure);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  });

  // The bubble: over the middle of the selection when it is on one line, else over the word the learner is on.
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || !active || active.words.length < 2) {
      if (bubble) setBubble(null);
      return;
    }
    const rect = (index) =>
      box.querySelector(`[data-i="${index}"]`)?.getBoundingClientRect();
    const first = rect(active.words[0]);
    const last = rect(active.words[active.words.length - 1]);
    const onWord = rect(
      active === hovered
        ? hover
        : (lastAdded ?? active.words[active.words.length - 1]),
    );
    if (!first || !last || !onWord) return;
    const where = box.getBoundingClientRect();
    const one = sameLine[active.id] !== false;
    const next = {
      text: active.words.map((index) => pieces[index].text).join(" "),
      left: Math.round(
        (one
          ? (first.left + last.right) / 2
          : (onWord.left + onWord.right) / 2) - where.left,
      ),
      top: Math.round(
        (one ? Math.min(first.top, last.top) : onWord.top) - where.top,
      ),
    };
    if (
      !bubble ||
      bubble.text !== next.text ||
      bubble.left !== next.left ||
      bubble.top !== next.top
    )
      setBubble(next);
  });

  function render(piece, index) {
    if (!piece.isWord) {
      const before = selectionOf(index - 1);
      const joined = before && before === selectionOf(index + 1);
      return (
        <span
          className={["gap", joined && "joined"].filter(Boolean).join(" ")}
          key={index}
        >
          {piece.text}
        </span>
      );
    }
    const selection = selectionOf(index);
    const joinedWith = (step) =>
      selection &&
      !pieces[index + step]?.isWord &&
      selectionOf(index + 2 * step) === selection;
    const linked =
      hovered &&
      !building &&
      hovered.words.length > 1 &&
      sameLine[hovered.id] === false;
    const className = [
      "word",
      selection && "sel",
      joinedWith(-1) && "join-l",
      joinedWith(1) && "join-r",
      linked && selection === hovered && index !== hover && "linked",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <span className="glue" key={index}>
        <button
          type="button"
          className={className}
          data-i={index}
          aria-pressed={Boolean(selection) || marked.includes(keyOf(index))}
          onClick={(event) => click(event, index)}
          onMouseEnter={() => setHover(index)}
          onMouseLeave={() => setHover(null)}
        >
          {piece.text}
        </button>
        {piece.trail}
      </span>
    );
  }

  return (
    <p className="reading words" aria-label="Text to mark" ref={boxRef}>
      {pieces.map(render)}
      {bubble && (
        <span
          className="bubble"
          style={{ left: bubble.left, top: bubble.top }}
          aria-hidden="true"
        >
          <small>Card word</small>
          <b>{bubble.text}</b>
        </span>
      )}
    </p>
  );
}
