import { useEffect, useState } from "react";
import LibraryMenu from "./LibraryMenu.jsx";
import Logo from "./Logo.jsx";
import { PAGES, hrefOf, usePage } from "./router.js";
import StudyPage from "./StudyPage.jsx";
import TextPage from "./TextPage.jsx";

// The icon of each page, for the bar at the bottom of a phone. They are drawn on a 24 by 24 grid.
const ICONS = {
  study: "M8 5.5v13l11-6.5z",
  text: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M12 11v6M9 14h6",
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
  const [inSession, setInSession] = useState(false); // a study session is open: the learner only sees the cards

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((body) => setStatus(body.status))
      .catch(() => setStatus("unreachable"));
  }, []);

  return (
    <main className={inSession ? "app in-session" : "app"}>
      {/* One bar for the whole product: the name at the left, the pages in the middle and the state and the library at
          the right. On a phone the pages move to a bar at the bottom of the screen. */}
      <header className="app-header" hidden={inSession}>
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
          <span
            className={status === "ok" ? "status-dot" : "status-dot problem"}
            role="status"
            title={`API status: ${status}`}
          >
            <span className="visually-hidden">API status: {status}</span>
          </span>
          <LibraryMenu />
        </div>
      </header>
      {/* The text page stays in the document, so what the learner typed is still there when they come back. */}
      <div hidden={page !== "text"}>
        <TextPage active={page === "text"} />
      </div>
      {page === "study" && <StudyPage onSessionChange={setInSession} />}
    </main>
  );
}
