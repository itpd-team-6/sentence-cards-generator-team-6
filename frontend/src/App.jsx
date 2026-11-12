import { useEffect, useState } from "react";
import LibraryMenu from "./LibraryMenu.jsx";
import Logo from "./Logo.jsx";
import { PAGES, hrefOf, usePage, useTextId } from "./router.js";
import StudyPage from "./StudyPage.jsx";
import SavedText from "./SavedText.jsx";
import TextList from "./TextList.jsx";
import TextPage from "./TextPage.jsx";
import TodaySummary from "./TodaySummary.jsx";
import YourCardsPage from "./YourCardsPage.jsx";

// The icon of each page, for the bar at the bottom of a phone. They are drawn on a 24 by 24 grid.
const ICONS = {
  study: "M8 5.5v13l11-6.5z",
  texts:
    "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M12 11v6M9 14h6",
  cards: "M4 7h16v12H4zM7 4h10M8 11h8M8 15h5",
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
  const [status, setStatus] = useState("checking");
  const page = usePage();
  const textId = useTextId(); // the saved text the address opens, if any
  const [textsChanged, setTextsChanged] = useState(0); // counts the texts saved on the form, so the list is read again
  const [inSession, setInSession] = useState(false); // a study session is open: the learner only sees the cards

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((body) => setStatus(body.status))
      .catch(() => setStatus("unreachable"));
  }, []);

  return (
    <>
      {/* One bar for the whole product, as wide as the window: the name at the left, the pages in the middle, and at the
          right what there is to study today, the state and the library. Its content lines up with the page. On a phone
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
            <span
              className={status === "ok" ? "status-dot" : "status-dot problem"}
              role="status"
              title={`API status: ${status}`}
            >
              <span className="visually-hidden">API status: {status}</span>
            </span>
            <LibraryMenu />
          </div>
        </div>
      </header>
      <main className={inSession ? "app in-session" : "app"}>
        {/* The form that adds a text stays in the document, so what the learner typed is still there when they come back.
          The list of texts is under it; a saved text opens in place of both. */}
        <div hidden={page !== "texts"}>
          <div hidden={textId !== null}>
            <TextPage
              onTextSaved={() => setTextsChanged((count) => count + 1)}
            />
            <TextList
              active={page === "texts" && textId === null}
              reload={textsChanged}
            />
          </div>
          {page === "texts" && textId !== null && (
            <SavedText key={textId} textId={textId} />
          )}
        </div>
        {page === "cards" && <YourCardsPage />}
        {page === "study" && <StudyPage onSessionChange={setInSession} />}
      </main>
    </>
  );
}
