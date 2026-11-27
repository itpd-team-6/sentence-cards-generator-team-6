import { useEffect, useState } from "react";

// "Study ahead": how many of the cards due later the learner brings to today, from 1 to the cards that are due later.
// The number is typed or stepped with the buttons or the arrow keys, and it can never be larger than the cards there
// are. Enter, or the button, brings the cards.
export default function StudyAhead({ max, busy, onAdd }) {
  const [value, setValue] = useState("1");

  // When the cards due later become fewer than the number, the number goes down with them. With none, it waits at one.
  useEffect(() => {
    if (max === 0) return;
    setValue((current) =>
      current !== "" && Number(current) > max ? String(max) : current,
    );
  }, [max]);

  if (max === 0) return null;

  const count = /^[1-9][0-9]*$/.test(value) ? Math.min(Number(value), max) : 0;

  function typeIn(text) {
    const digits = text.replace(/\D/g, "").replace(/^0+/, "");
    setValue(digits !== "" && Number(digits) > max ? String(max) : digits);
  }

  function step(change) {
    setValue(String(Math.min(Math.max(count + change, 1), max)));
  }

  function add() {
    if (count === 0 || busy) return;
    onAdd(count);
    setValue("1");
  }

  function keys(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      add();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      step(event.key === "ArrowUp" ? 1 : -1);
    }
  }

  return (
    <div className="ahead" role="group" aria-label="Study ahead">
      <span aria-hidden="true">Study ahead</span>
      <span className="ahead-stepper">
        <button
          type="button"
          aria-label="One card less"
          disabled={count <= 1}
          onClick={() => step(-1)}
        >
          &minus;
        </button>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-label={`Cards to add to today, from 1 to ${max}`}
          value={value}
          onChange={(event) => typeIn(event.target.value)}
          onKeyDown={keys}
        />
        <button
          type="button"
          aria-label="One card more"
          disabled={count >= max}
          onClick={() => step(1)}
        >
          +
        </button>
      </span>
      <button
        type="button"
        className="ahead-go"
        disabled={count === 0 || busy}
        onClick={add}
      >
        Add to today
      </button>
    </div>
  );
}
