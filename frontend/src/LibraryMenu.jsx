import { useRef, useState } from "react";
import { checkLibrary } from "./api.js";
import { clearTickedDecks } from "./deckSelection.js";
import { clearTextDraft } from "./textDraft.js";
import {
  cleanLibraryCode,
  isLibraryCode,
  libraryCode,
  setLibraryCode,
} from "./library.js";

const FILE_NAME = "sentence-cards-library.txt";

// Copies the text. The clipboard of the browser is only there on a secure address, so the selected text is copied
// when it is missing.
async function copyText(text, field) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    field?.select();
    return document.execCommand?.("copy") ?? false;
  }
}

// The library of the learner: its code to keep (copy, file) and a field to open another library.
export default function LibraryMenu({
  reload = () => window.location.reload(),
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [other, setOther] = useState("");
  const [found, setFound] = useState(null); // the library the learner typed the code of, when it exists
  const [problem, setProblem] = useState("");
  const codeField = useRef(null);
  const code = libraryCode();

  async function copy() {
    setCopied(await copyText(code, codeField.current));
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob([`${code}\n`], { type: "text/plain" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = FILE_NAME;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function look() {
    const typed = cleanLibraryCode(other);
    setFound(null);
    if (!isLibraryCode(typed)) {
      setProblem("This is not a library code.");
      return;
    }
    if (typed === code) {
      setProblem("This is the library you are in.");
      return;
    }
    try {
      setFound({ code: typed, ...(await checkLibrary(typed)) });
      setProblem("");
    } catch (error) {
      setProblem(
        error.status === 404
          ? "There is no library with this code."
          : error.message,
      );
    }
  }

  function openFound() {
    clearTickedDecks();
    clearTextDraft();
    setLibraryCode(found.code);
    reload();
  }

  return (
    <div className="library">
      <button
        type="button"
        className="secondary"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        My library
      </button>
      {open && (
        <div className="library-panel" role="group" aria-label="My library">
          <label htmlFor="library-code">Library code</label>
          <input
            id="library-code"
            ref={codeField}
            type="text"
            readOnly
            value={code}
            onFocus={(event) => event.target.select()}
          />
          <div className="library-actions">
            <button type="button" className="secondary" onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </button>
            <button type="button" className="secondary" onClick={download}>
              Save as a file
            </button>
          </div>
          <label htmlFor="library-other">Open another library</label>
          <div className="library-actions">
            <input
              id="library-other"
              type="text"
              value={other}
              onChange={(event) => {
                setOther(event.target.value);
                setFound(null);
                setProblem("");
              }}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="button"
              className="secondary"
              onClick={look}
              disabled={other.trim() === ""}
            >
              Find
            </button>
          </div>
          <p className="library-result" role="status">
            {problem}
            {found &&
              `This library has ${found.cards} ${found.cards === 1 ? "card" : "cards"} in ${found.decks} ${found.decks === 1 ? "deck" : "decks"}.`}
          </p>
          {found && (
            <div className="library-actions">
              <button type="button" className="primary" onClick={openFound}>
                Open it
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setFound(null)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
