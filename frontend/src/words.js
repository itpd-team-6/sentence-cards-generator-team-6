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
  return keepPunctuationWithItsWord(pieces);
}

// A comma or a full stop stays on the line of the word before it.
function keepPunctuationWithItsWord(pieces) {
  for (let index = 0; index < pieces.length - 1; index += 1) {
    const next = pieces[index + 1];
    if (pieces[index].isWord && !next.isWord) {
      const punctuation = next.text.match(/^\S+/);
      if (punctuation) {
        pieces[index].trail = punctuation[0];
        next.text = next.text.slice(punctuation[0].length);
      }
    }
  }
  return pieces.filter((piece) => piece.isWord || piece.text !== "");
}

/** The form of a word that is marked, so that "Zug" and "zug" are the same word. */
export function markKey(word) {
  return word.toLocaleLowerCase();
}

// The sentence in three parts, so the word the learner studies can be shown in bold. A form of the word
// that is not in the sentence (a different ending, say) is simply not marked.
export function splitAtWord(sentence, word) {
  const start = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (start === -1) return [sentence, "", ""];
  return [sentence.slice(0, start), sentence.slice(start, start + word.length), sentence.slice(start + word.length)];
}
