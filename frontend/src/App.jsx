import { useEffect, useState } from "react";
import TextPage from "./TextPage.jsx";

export default function App() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((body) => setStatus(body.status))
      .catch(() => setStatus("unreachable"));
  }, []);

  return (
    <main className="app">
      <h1>Sentence cards generator</h1>
      <TextPage />
      <p className={status === "ok" ? "status" : "status problem"}>
        API status: <strong>{status}</strong>
      </p>
    </main>
  );
}
