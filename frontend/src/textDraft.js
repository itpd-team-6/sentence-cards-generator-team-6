// The text being typed on the Texts page, its languages and the words marked in it are kept for this tab, so that they are
// there after a reload. A tab keeps them until it is closed or the learner opens another library. Browser storage can be
// missing or refuse to answer; then nothing is kept.
const KEY = "sentence-cards.text-draft";

const EMPTY = {
  text: "",
  textLanguage: "",
  firstLanguage: "",
  marked: [],
  selections: [],
};

export function readTextDraft() {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY));
    if (value === null || typeof value !== "object") return EMPTY;
    return {
      text: typeof value.text === "string" ? value.text : "",
      textLanguage:
        typeof value.textLanguage === "string" ? value.textLanguage : "",
      firstLanguage:
        typeof value.firstLanguage === "string" ? value.firstLanguage : "",
      marked: Array.isArray(value.marked) ? value.marked : [],
      selections: Array.isArray(value.selections) ? value.selections : [],
    };
  } catch {
    return EMPTY;
  }
}

export function writeTextDraft(draft) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Not kept: the page works the same, only the text is lost when it is reloaded.
  }
}

// The draft belongs to one library, so it is forgotten when the learner opens another.
export function clearTextDraft() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing was kept.
  }
}
