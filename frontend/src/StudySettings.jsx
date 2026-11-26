import { useEffect, useState } from "react";
import { loadStudyLimits, saveStudyLimits } from "./api.js";

const show = (limit) =>
  limit === null || limit === undefined ? "" : `${limit}`;

// A limit is a whole number from 0 to 1000, or empty when it is not set.
function toLimit(text) {
  if (text.trim() === "") return { value: null };
  const value = Number(text);
  return Number.isInteger(value) && value >= 0 && value <= 1000
    ? { value }
    : { error: true };
}

// The settings of the day in the Study box: how many new cards and how many review cards the learner wants each day,
// and how many cards to study now (the Reorder number). The limits are kept with the library; they never keep a card
// that is due out of the session. The number of cards asks for more cards when too few are due.
export default function StudySettings({ target, onTarget }) {
  const [newCards, setNewCards] = useState("");
  const [reviewCards, setReviewCards] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let current = true;
    loadStudyLimits()
      .then((found) => {
        if (!current) return;
        setNewCards(show(found.new_cards));
        setReviewCards(show(found.review_cards));
      })
      .catch((error) => current && setMessage(error.message));
    return () => {
      current = false;
    };
  }, []);

  async function save() {
    const first = toLimit(newCards);
    const second = toLimit(reviewCards);
    if (first.error || second.error) {
      setMessage(
        "A limit is a whole number from 0 to 1000, or empty when it is not set.",
      );
      return;
    }
    setSaving(true);
    try {
      const saved = await saveStudyLimits(first.value, second.value);
      setNewCards(show(saved.new_cards));
      setReviewCards(show(saved.review_cards));
      setMessage("Limits saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  const field = (label, value, onChange) => (
    <label style={{ display: "grid", gap: "0.25rem" }}>
      <span>{label}</span>
      <input
        type="number"
        min="0"
        max="1000"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );

  return (
    <div
      className="study-settings"
      role="group"
      aria-label="Daily settings"
      style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}
    >
      <h3>Daily settings</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          gap: "0.75rem",
        }}
      >
        {field("New cards per day", newCards, setNewCards)}
        {field("Review cards per day", reviewCards, setReviewCards)}
        {field("Reorder number", target, onTarget)}
      </div>
      <div className="actions">
        <button
          type="button"
          className="secondary"
          onClick={save}
          disabled={saving}
        >
          Save limits
        </button>
      </div>
      {message && (
        <p className="hint" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
