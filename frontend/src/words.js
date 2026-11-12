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

// Is the word at this index the first of a sentence or of a line? A capital there says nothing about the word.
function startsSentence(pieces, index) {
  for (let before = index - 1; before >= 0; before -= 1) {
    const piece = pieces[before];
    if (!piece.isWord) {
      if (piece.text.includes("\n")) return true;
      continue;
    }
    return /[.!?…:]["'»”’)]*$/u.test(piece.trail ?? "");
  }
  return true;
}

/**
 * The word of a card as the text writes it ("Zug", a noun with a capital), not in the lowercase form used to mark it.
 * The first place in the text that is not the start of a sentence is used, because the capital of the first word of a
 * sentence is not part of the word; if every place is a start, the first one is used.
 */
export function writtenForm(pieces, key) {
  const places = pieces
    .map((piece, index) => ({ piece, index }))
    .filter(({ piece }) => piece.isWord && markKey(piece.text) === key);
  const inside = places.find(({ index }) => !startsSentence(pieces, index));
  return (inside ?? places[0])?.piece.text ?? key;
}

// The sentence in segments, so the word the learner studies can be shown in bold. A card word of several words, such as
// "stimmt zu", is marked part by part, in this order, because other words may stand between its parts. A form of the
// word that is not in the sentence (a different ending, say) is simply not marked.
export function splitAtWords(sentence, word) {
  const lower = sentence.toLowerCase();
  const segments = [];
  let position = 0;
  for (const part of word.split(/\s+/).filter(Boolean)) {
    const start = lower.indexOf(part.toLowerCase(), position);
    if (start === -1) continue;
    if (start > position)
      segments.push({ text: sentence.slice(position, start), marked: false });
    segments.push({
      text: sentence.slice(start, start + part.length),
      marked: true,
    });
    position = start + part.length;
  }
  if (position < sentence.length)
    segments.push({ text: sentence.slice(position), marked: false });
  return segments;
}

/** The words of a text that are marked, as the cards name them: single words, then the groups of several words. */
export function markedItems(pieces, marked, selections) {
  return [
    ...marked.map((key) => writtenForm(pieces, key)),
    ...selections
      .filter((selection) => selection.words.length > 1)
      .map((selection) => selection.words.map((i) => pieces[i].text).join(" ")),
  ];
}

let reopened = 0;

/**
 * The marks of a saved text as the picker needs them. `items` are the marked words as they are saved ("Zug",
 * "stimmt zu"). A single word is marked wherever it appears. A group of several words is found at the first place where
 * its words appear in this order, which is the rule the product uses to match them, so a group that the text writes
 * more than once is shown at its first place. An item that the text does not have is returned in `lost`.
 */
export function marksFromItems(pieces, items) {
  const marked = [];
  const selections = [];
  const lost = [];
  const words = pieces
    .map((piece, index) => ({
      key: markKey(piece.text),
      index,
      ok: piece.isWord,
    }))
    .filter((piece) => piece.ok);
  for (const item of items) {
    const parts = item.split(/\s+/).filter(Boolean).map(markKey);
    if (parts.length === 1) {
      if (words.some((word) => word.key === parts[0])) {
        if (!marked.includes(parts[0])) marked.push(parts[0]);
      } else lost.push(item);
      continue;
    }
    const found = [];
    let from = 0;
    for (const part of parts) {
      const at = words.findIndex((word, n) => n >= from && word.key === part);
      if (at === -1) break;
      found.push(words[at].index);
      from = at + 1;
    }
    if (found.length === parts.length) {
      reopened -= 1; // negative ids never meet the ids of the selections the learner makes
      selections.push({ id: reopened, words: found });
    } else lost.push(item);
  }
  return { marked, selections, lost };
}

/** The longest text a learner can save, in characters (FR-001). */
export const TEXT_LENGTH = 10000;

/** How many characters a text has. An emoji or a letter with its own mark counts as one, as the product counts. */
export const textLength = (text) => [...text].length;
