// Letters of any alphabet, with the marks and the apostrophes or hyphens inside a word.
const WORD = /[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*/gu;

/** Split a text into pieces: words, and the spaces and punctuation between them. */
export function splitText(text) {
  const pieces = [];
  let position = 0;
  for (const match of text.matchAll(WORD)) {
    if (match.index > position) {
      pieces.push({ text: text.slice(position, match.index), isWord: false });
    }
    pieces.push({ text: match[0], isWord: true });
    position = match.index + match[0].length;
  }
  if (position < text.length) {
    pieces.push({ text: text.slice(position), isWord: false });
  }
  return pieces;
}

/** The form of a word that is marked, so that "Zug" and "zug" are the same word. */
export function markKey(word) {
  return word.toLocaleLowerCase();
}
