// The name of a deck on a card. A deck the learner ticked is filled; a deck that is not ticked is dashed and dimmer.
export default function DeckTag({ deck, off = false }) {
  return (
    <span
      className={off ? "deck-tag off" : "deck-tag"}
      title={off ? `${deck.title} (not ticked)` : deck.title}
    >
      <span>{deck.title}</span>
    </span>
  );
}
