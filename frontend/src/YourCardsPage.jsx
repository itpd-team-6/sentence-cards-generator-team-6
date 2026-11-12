import { useEffect, useState } from "react";
import { loadCards } from "./api.js";
import CardsTable from "./CardsTable.jsx";

// All the cards of the learner, in the table with the buttons that change them. The page is made when the learner goes
// to it, so the cards are read each time: a card hidden or changed in a study session shows as it is now.
export default function YourCardsPage() {
  const [cards, setCards] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadCards()
      .then(setCards)
      .catch(() => setFailed(true));
  }, []);

  return (
    <section className="panel cards-panel">
      {failed && (
        <p className="hint" role="alert">
          The cards could not be loaded. Is the product running?
        </p>
      )}
      {!failed && cards === null && <p className="hint">Loading...</p>}
      {cards?.length === 0 && (
        <>
          <h2>Your cards</h2>
          <p className="hint">
            No cards yet. Save a text on the Texts page and make cards from its
            marked words.
          </p>
        </>
      )}
      {cards?.length > 0 && (
        <CardsTable cards={cards} onCardsChange={setCards} />
      )}
    </section>
  );
}
