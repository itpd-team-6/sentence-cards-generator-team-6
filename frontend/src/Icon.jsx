// The line icons of the product, drawn on a 24 by 24 grid. They are shared by the list of cards and the study session,
// so an action looks the same in both.
export const ICON_PATHS = {
  edit: "M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4",
  review: "M7 4h10v16l-5-4-5 4V4z",
  hide: "M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4 4l16 16",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5zM12 15v2",
  openLock: "M7 11V8a5 5 0 0 1 9.6-2M5 11h14v10H5zM12 15v2",
  new: "M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5",
  chevron: "M6 9l6 6 6-6",
  stack: "M12 4l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4",
  delete: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v5M14 11v5",
};

// A small line icon. The text next to it, or the name of the button, says what it means, so the icon is hidden from
// screen readers.
export default function Icon({ path, filled = false, spinning = false }) {
  return (
    <svg
      className={spinning ? "spin" : undefined}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}
