// The mark of the product: a card in front of another one. It takes its colors from the theme.
export default function Logo() {
  return (
    <svg
      className="logo"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="9"
        y="3"
        width="20"
        height="15"
        rx="3"
        fill="var(--accent-soft)"
        stroke="var(--accent)"
        strokeWidth="1.5"
        transform="rotate(8 19 10)"
      />
      <rect x="3" y="12" width="23" height="17" rx="3" fill="var(--accent)" />
      <path
        d="M8 19h13M8 23.5h8"
        stroke="var(--accent-text)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
