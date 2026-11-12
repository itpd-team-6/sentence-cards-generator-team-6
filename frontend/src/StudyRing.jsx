// The ring of the Study box: the cards to study, split into new, forgotten and due. The number in the middle is the
// total. `label` says it in words for screen readers.
const SEGMENTS = [
  { stage: "new", color: "var(--ok)" },
  { stage: "forgotten", color: "var(--accent-soft-text)" },
  { stage: "due", color: "var(--accent)" },
];

export default function StudyRing({ counts, label }) {
  const total = counts.new + counts.forgotten + counts.due;
  let start = 0;
  return (
    <svg
      className="study-ring"
      viewBox="0 0 120 120"
      role="img"
      aria-label={label}
      focusable="false"
    >
      <circle className="study-ring-track" cx="60" cy="60" r="48" />
      {total > 0 &&
        SEGMENTS.map(({ stage, color }) => {
          const share = (counts[stage] / total) * 100;
          const offset = -start;
          start += share;
          return share === 0 ? null : (
            <circle
              key={stage}
              className="study-ring-segment"
              cx="60"
              cy="60"
              r="48"
              pathLength="100"
              stroke={color}
              strokeDasharray={`${share} ${100 - share}`}
              strokeDashoffset={offset}
            />
          );
        })}
      <text x="60" y="64" textAnchor="middle" className="study-ring-total">
        {total}
      </text>
      <text x="60" y="84" textAnchor="middle" className="study-ring-caption">
        to study
      </text>
    </svg>
  );
}
