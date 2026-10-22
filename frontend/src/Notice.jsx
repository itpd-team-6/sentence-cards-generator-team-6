import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// How long a message stays before it goes away, in seconds. Hovering it, or focusing it, stops the clock.
export const NOTICE_SECONDS = 5;

let lastNotice = 0;

// A message for the learner: "error" (the default), "success" or "info". Each one has a number of its own, so that the
// same words shown again start the clock again.
export const newNotice = (text, kind = "error") => ({ text, kind, id: (lastNotice += 1) });

// Calls `onDismiss` when the time has passed. The clock stops while `paused` and goes on with the time that was left.
function useDismissAfter(notice, seconds, paused, onDismiss) {
  const left = useRef(seconds * 1000);
  const latest = useRef(onDismiss);
  latest.current = onDismiss;

  useEffect(() => {
    left.current = seconds * 1000;
  }, [notice.id, seconds]);

  useEffect(() => {
    if (paused) return undefined;
    const startedAt = Date.now();
    const timer = setTimeout(() => latest.current(), left.current);
    return () => {
      clearTimeout(timer);
      left.current = Math.max(0, left.current - (Date.now() - startedAt));
    };
  }, [notice.id, paused]);
}

const ICONS = { error: "!", success: "\u2713", info: "i" };

// Where the messages stack: the bottom right corner of the window, above the page, so showing or hiding a message never
// moves what the learner is looking at. It is made the first time a message is shown.
function toastBox() {
  let box = document.getElementById("toasts");
  if (!box) {
    box = document.createElement("div");
    box.id = "toasts";
    box.className = "toasts";
    document.body.appendChild(box);
  }
  return box;
}

// Every message of the product looks the same and goes away by itself after a few seconds. Only the tone changes with
// the kind: "error" is a problem (red), "success" says that something worked (green), "info" is neutral. The icon says
// the kind too, so the colour is never the only sign. A line at the bottom shrinks as the time passes, hovering the
// message stops the clock, and the button closes it at once.
export default function Notice({ notice, onDismiss, seconds = NOTICE_SECONDS }) {
  const [paused, setPaused] = useState(false);
  useDismissAfter(notice, seconds, paused, onDismiss);

  const kind = notice.kind ?? "error";
  return createPortal(
    <div
      className={`toast ${kind}`}
      role={kind === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="toast-icon" aria-hidden="true">
        {ICONS[kind]}
      </span>
      <span className="toast-text">{notice.text}</span>
      <button type="button" className="toast-close" aria-label="Dismiss this message" onClick={onDismiss}>
        ×
      </button>
      <span
        className="toast-line"
        aria-hidden="true"
        style={{ animationDuration: `${seconds}s`, animationPlayState: paused ? "paused" : "running" }}
      />
    </div>,
    toastBox(),
  );
}
