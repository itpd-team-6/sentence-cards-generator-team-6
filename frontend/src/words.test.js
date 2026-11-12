import { expect, test } from "vitest";
import { markedItems, marksFromItems, splitText } from "./words.js";

const texts = {
  simple: "Der Zug kommt später. Der zug ist alt.",
  separable: "Er stimmt dem Plan sofort zu.",
};

test("a saved single word is marked wherever the text has it", () => {
  const pieces = splitText(texts.simple);
  const { marked, selections, lost } = marksFromItems(pieces, ["Zug"]);
  expect(marked).toEqual(["zug"]);
  expect(selections).toEqual([]);
  expect(lost).toEqual([]);
});

test("a saved group of words is found in its order, with other words allowed between", () => {
  const pieces = splitText(texts.separable);
  const { marked, selections, lost } = marksFromItems(pieces, ["stimmt zu"]);
  expect(marked).toEqual([]);
  expect(lost).toEqual([]);
  expect(selections).toHaveLength(1);
  expect(selections[0].words.map((i) => pieces[i].text)).toEqual([
    "stimmt",
    "zu",
  ]);
  expect(selections[0].id).toBeLessThan(0);
});

test("a mark whose words are not in the text is lost, and the others stay", () => {
  const pieces = splitText(texts.separable);
  const { marked, selections, lost } = marksFromItems(pieces, [
    "Plan",
    "Haus",
    "zu stimmt",
  ]);
  expect(marked).toEqual(["plan"]);
  expect(selections).toEqual([]);
  expect(lost).toEqual(["Haus", "zu stimmt"]);
});

test("the marks of a text come back as the same items", () => {
  const pieces = splitText(texts.separable);
  const { marked, selections } = marksFromItems(pieces, ["Plan", "stimmt zu"]);
  expect(markedItems(pieces, marked, selections)).toEqual([
    "Plan",
    "stimmt zu",
  ]);
});
