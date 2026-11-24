import { useEffect, useState } from "react";
import LibraryMenu from "./LibraryMenu.jsx";
import Logo from "./Logo.jsx";
import { PAGES, hrefOf, useDeckId, usePage, useTextId } from "./router.js";
import DeckPage from "./DeckPage.jsx";
import DecksPage from "./DecksPage.jsx";
import StudyPage from "./StudyPage.jsx";
import SavedText from "./SavedText.jsx";
import TextList from "./TextList.jsx";
import TextPage from "./TextPage.jsx";
import TodaySummary from "./TodaySummary.jsx";
import YourCardsPage from "./YourCardsPage.jsx";

// The two sub-tabs of the Texts page.
const TEXT_TABS = [
  { id: "add", name: "Add cards from a text" },
  { id: "list", name: "Your texts" },
];

// The icon of each page, for the bar at the bottom of a phone. They are drawn on a 24 by 24 grid.
const ICONS = {
  study: "M8 5.5v13l11-6.5z",
  texts:
    "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M12 11v6M9 14h6",
  cards: "M4 7h16v12H4zM7 4h10M8 11h8M8 15h5",
  decks: "M12 4l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4",
};

function PageIcon({ id }) {
  return (
    <svg
      className="tab-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[id]} />
    </svg>
  );
}

export default function App() {
  const page = usePage();
  const textId = useTextId(); // the saved text the address opens, if any
  const deckId = useDeckId(); // the deck the address opens, if any
  const [textsChanged, setTextsChanged] = useState(0); // counts the texts saved on the form, so the list is read again
  const [inSession, setInSession] = useState(false); // a study session is open: the learner only sees the cards
  const [textsTab, setTextsTab] = useState("add"); // the sub-tab of the Texts page: "add" or "list"

  // A saved text is opened from the list, so the way back from it goes to the list.
  useEffect(() => {
    if (textId !== null) setTextsTab("list");
  }, [textId]);

  return (
    <>
      {/* One bar for the whole product, as wide as the window: the name at the left, the pages in the middle, and at the
          right what there is to study today and the library. Its content lines up with the page. On a phone
          the pages move to a bar at the bottom of the screen. */}
      <header className="app-header" hidden={inSession}>
        <div className="app-header-inner">
          <h1 className="brand">
            <Logo />
            <span>Sentence cards generator</span>
          </h1>
          <nav className="tabs" aria-label="Pages">
            {PAGES.map((item) => (
              <a
                key={item.id}
                className="tab"
                href={hrefOf(item.id)}
                aria-current={page === item.id ? "page" : undefined}
              >
                <PageIcon id={item.id} />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
          <div className="app-header-tools">
            <TodaySummary page={page} />
            <LibraryMenu />
          </div>
        </div>
      </header>
      <main className={inSession ? "app in-session" : "app"}>
        {/* The Texts page has two sub-tabs: the form that adds cards from a text, open by default, and the list of saved
          texts. The form stays in the document, so what the learner typed is still there when they come back, and the
          list is read again each time it is shown. A saved text opens in place of both. */}
        <div hidden={page !== "texts"}>
          <div hidden={textId !== null}>
            <div className="sub-tabs" role="tablist" aria-label="Texts">
              {TEXT_TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  className="sub-tab"
                  aria-selected={textsTab === item.id}
                  onClick={() => setTextsTab(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div hidden={textsTab !== "add"}>
              <TextPage
                onTextSaved={() => setTextsChanged((count) => count + 1)}
              />
            </div>
            <div hidden={textsTab !== "list"}>
              <TextList
                active={
                  page === "texts" && textId === null && textsTab === "list"
                }
                reload={textsChanged}
              />
            </div>
          </div>
          {page === "texts" && textId !== null && (
            <SavedText key={textId} textId={textId} />
          )}
        </div>
        {page === "cards" && <YourCardsPage />}
        {page === "decks" &&
          (deckId === null ? (
            <DecksPage />
          ) : (
            <DeckPage key={deckId} deckId={deckId} />
          ))}
        {page === "study" && <StudyPage onSessionChange={setInSession} />}
      </main>
    </>
  );
}
