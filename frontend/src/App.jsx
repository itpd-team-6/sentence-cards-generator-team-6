import { useEffect, useState } from "react";
import StudyPage from "./StudyPage.jsx";
import TextPage from "./TextPage.jsx";

const PAGES = [
  { id: "text", name: "Add a text" },
  { id: "study", name: "Study" },
];

export default function App() {
  const [status, setStatus] = useState("checking");
  const [page, setPage] = useState("text");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((body) => setStatus(body.status))
      .catch(() => setStatus("unreachable"));
  }, []);

  return (
    <main className="app">
      <h1>Sentence cards generator</h1>
      <nav className="tabs" aria-label="Pages">
        {PAGES.map((item) => (
          <button
            type="button"
            key={item.id}
            className="tab"
            aria-current={page === item.id ? "page" : undefined}
            onClick={() => setPage(item.id)}
          >
            {item.name}
          </button>
        ))}
      </nav>
      {/* The text page stays in the document, so what the learner typed is still there when they come back. */}
      <div hidden={page !== "text"}>
        <TextPage />
      </div>
      {page === "study" && <StudyPage />}
      <p className={status === "ok" ? "status" : "status problem"}>
        API status: <strong>{status}</strong>
      </p>
    </main>
  );
}
