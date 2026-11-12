// How "Your cards" narrows the list (FR-020). The learner ticks decks, texts and statuses, and types a search. A card
// stays in the list when it passes every part that has a choice. Inside one part, "any" keeps the cards that are in at
// least one ticked item, and "all" keeps the cards that are in every ticked item.

// The item of a card that is in no deck, or of a card whose text was deleted. They are ticked like any other item.
export const NONE = "none";

export const STATUSES = [
  { id: "hidden", name: "Hidden from study" },
  { id: "review", name: "Marked for review" },
  { id: "no-sentence", name: "Without a sentence" },
];

export const emptyFilters = () => ({
  search: "",
  decks: [],
  decksMode: "any",
  texts: [],
  textsMode: "any",
  statuses: [],
  statusesMode: "any",
  pairs: [],
});

// The words the learner types and the words on a card are compared without the case of the letters and without accents.
export const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// Cuts a text where it has what the learner searched, to show that part in the list of results. The same letters count as
// in the search: without the case and without accents. Each part says whether it is the match.
export function splitMatch(text, search) {
  const value = String(text ?? "");
  const wanted = normalize(search);
  if (!wanted) return [{ text: value, match: false }];
  let plain = "";
  const origin = []; // for each letter of `plain`, where it comes from in the text
  for (let at = 0; at < value.length; at += 1) {
    const letters = normalize(value[at]);
    for (const letter of letters) {
      plain += letter;
      origin.push(at);
    }
  }
  const parts = [];
  let done = 0;
  let from = 0;
  for (;;) {
    const found = plain.indexOf(wanted, from);
    if (found === -1) break;
    const start = origin[found];
    const end = origin[found + wanted.length - 1] + 1;
    if (start >= done) {
      if (start > done)
        parts.push({ text: value.slice(done, start), match: false });
      parts.push({ text: value.slice(start, end), match: true });
      done = end;
    }
    from = found + wanted.length;
  }
  if (done < value.length)
    parts.push({ text: value.slice(done), match: false });
  return parts;
}

export const pairOf = (card) => `${card.text_language}>${card.first_language}`;

// The ids a card has in each part.
function membership(card) {
  const status = [];
  if (card.hidden) status.push("hidden");
  if (card.flagged) status.push("review");
  if (card.sentence == null) status.push("no-sentence");
  return {
    decks: card.decks?.length ? card.decks.map((deck) => deck.id) : [NONE],
    texts: card.texts?.length ? card.texts.map((text) => text.id) : [NONE],
    statuses: status,
    pairs: [pairOf(card)],
  };
}

function passes(ticked, mode, has) {
  if (ticked.length === 0) return true;
  return mode === "all"
    ? ticked.every((id) => has.includes(id))
    : ticked.some((id) => has.includes(id));
}

export function matchesSearch(card, search) {
  const wanted = normalize(search);
  if (!wanted) return true;
  return [card.word, card.phrase, card.sentence, card.translation].some(
    (field) => normalize(field).includes(wanted),
  );
}

// Whether a card passes the filters, leaving out the parts named in `skip`. The counts of the side list leave out the
// part they are about, so a deck that is not ticked tells how many cards the learner would get by ticking it.
export function cardMatches(card, filters, skip = []) {
  const has = membership(card);
  const part = (name) =>
    skip.includes(name) ||
    passes(filters[name], filters[`${name}Mode`] ?? "any", has[name]);
  return (
    (skip.includes("search") || matchesSearch(card, filters.search)) &&
    part("decks") &&
    part("texts") &&
    part("statuses") &&
    part("pairs")
  );
}

export const filterCards = (cards, filters) =>
  cards.filter((card) => cardMatches(card, filters));

// How many cards each item of a part would give, with the choices of the other parts and the search applied.
export function countItems(cards, filters, part) {
  const counts = new Map();
  for (const card of cards) {
    if (!cardMatches(card, filters, [part])) continue;
    for (const id of membership(card)[part]) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return counts;
}

export const hasFilters = (filters) =>
  filters.search.trim() !== "" ||
  ["decks", "texts", "statuses", "pairs"].some((part) => filters[part].length);

// How many choices the learner made, for the number on the phone's button. The search is not one of them.
export const choiceCount = (filters) =>
  ["decks", "texts", "statuses", "pairs"].reduce(
    (total, part) => total + filters[part].length,
    0,
  );

const join = (names, mode) =>
  mode === "all" && names.length > 1
    ? `all of ${names.join(" and ")}`
    : names.join(" or ");

// The sentence above the list: what the cards in it have in common, in words.
export function describe(count, filters, { decks, texts, pairs }) {
  const parts = [];
  const nameOf = (list, id, none) =>
    id === NONE ? none : (list.find((item) => item.id === id)?.title ?? "?");
  if (filters.decks.length) {
    const names = filters.decks.map((id) => nameOf(decks, id, "no deck"));
    parts.push(
      names.length === 1 && filters.decks[0] === NONE
        ? "in no deck"
        : `in ${join(names, filters.decksMode)}`,
    );
  }
  if (filters.texts.length) {
    const names = filters.texts.map((id) => nameOf(texts, id, "no text"));
    parts.push(
      names.length === 1 && filters.texts[0] === NONE
        ? "from no text"
        : `from ${join(names, filters.textsMode)}`,
    );
  }
  if (filters.pairs.length) {
    parts.push(
      `in ${filters.pairs.map((id) => pairs.find((item) => item.id === id)?.name ?? id).join(" or ")}`,
    );
  }
  if (filters.statuses.length) {
    const names = filters.statuses.map((id) =>
      STATUSES.find((item) => item.id === id).name.toLowerCase(),
    );
    parts.push(join(names, filters.statusesMode));
  }
  if (filters.search.trim()) parts.push(`matching “${filters.search.trim()}”`);
  const noun = count === 1 ? "card" : "cards";
  return parts.length
    ? `${count} ${noun} ${parts.join(", ")}`
    : `${count} ${noun}`;
}

export const SORTS = [
  { id: "newest", name: "Newest first" },
  { id: "oldest", name: "Oldest first" },
  { id: "word", name: "A to Z" },
];

export const GROUPS = [
  { id: "none", name: "None" },
  { id: "deck", name: "Deck" },
  { id: "text", name: "Text" },
];

// The cards in the order the learner chose. A card made later has a larger id, so the newest card is the one with the
// largest id.
export function sortCards(cards, sort) {
  const copy = [...cards];
  if (sort === "oldest") return copy.sort((a, b) => a.id - b.id);
  if (sort === "word") {
    return copy.sort((a, b) =>
      normalize(a.word).localeCompare(normalize(b.word)),
    );
  }
  return copy.sort((a, b) => b.id - a.id);
}

// The cards in groups, one for each deck or for each text that has cards, and a last group for the cards that are in no
// deck or from no text. A card that is in two decks is in both groups, so it shows twice; the total of the list counts it
// once. Without a kind the answer is null.
export function groupCards(cards, kind, decks, texts) {
  if (kind !== "deck" && kind !== "text") return null;
  const part = kind === "deck" ? "decks" : "texts";
  const known = kind === "deck" ? decks : texts;
  const none = kind === "deck" ? "Uncategorized" : "No text";
  const groups = known.map((item) => ({
    key: `${kind}-${item.id}`,
    title: item.title,
    cards: cards.filter((card) =>
      card[part]?.some((own) => own.id === item.id),
    ),
  }));
  groups.push({
    key: `${kind}-${NONE}`,
    title: none,
    cards: cards.filter((card) => !card[part]?.length),
  });
  return groups.filter((group) => group.cards.length > 0);
}
