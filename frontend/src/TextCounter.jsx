import { TEXT_LENGTH, textLength } from "./words.js";

// The count of characters of a text next to its maximum. It turns red when the text reaches the maximum.
export default function TextCounter({ text }) {
  const count = textLength(text);
  return (
    <p className={count >= TEXT_LENGTH ? "counter full" : "counter"}>
      {count.toLocaleString("en-US")} / {TEXT_LENGTH.toLocaleString("en-US")}
    </p>
  );
}

// The message for a text over the maximum, or "" when it fits.
export const tooLong = (text) =>
  textLength(text) > TEXT_LENGTH
    ? `The text can have at most ${TEXT_LENGTH.toLocaleString("en-US")} characters.`
    : "";
