import { beforeEach, expect, test } from "vitest";
import { clearTextDraft, readTextDraft, writeTextDraft } from "./textDraft.js";

beforeEach(() => sessionStorage.clear());

test("without a draft the page starts empty", () => {
  expect(readTextDraft()).toEqual({
    text: "",
    textLanguage: "",
    firstLanguage: "",
    marked: [],
    selections: [],
  });
});

test("the text, the languages and the marked words come back as they were written", () => {
  const draft = {
    text: "Der Zug fährt ab.",
    textLanguage: "de",
    firstLanguage: "en",
    marked: ["Zug"],
    selections: [{ words: [0, 2] }],
  };

  writeTextDraft(draft);

  expect(readTextDraft()).toEqual(draft);
});

test("a draft that cannot be read is an empty one", () => {
  sessionStorage.setItem("sentence-cards.text-draft", "{not json");
  expect(readTextDraft().text).toBe("");

  sessionStorage.setItem("sentence-cards.text-draft", '{"text": 5}');
  expect(readTextDraft().text).toBe("");
});

test("clearing the draft forgets it", () => {
  writeTextDraft({ ...readTextDraft(), text: "Hallo" });

  clearTextDraft();

  expect(readTextDraft().text).toBe("");
});
