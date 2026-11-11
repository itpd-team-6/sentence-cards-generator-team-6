import { describe, expect, test } from "vitest";
import { estimate, greeting } from "./studyTexts.js";

describe("estimate", () => {
  test("counts 30 seconds a card and rounds up to whole minutes", () => {
    expect(estimate(1)).toBe("about 1 min");
    expect(estimate(2)).toBe("about 1 min");
    expect(estimate(3)).toBe("about 2 min");
    expect(estimate(20)).toBe("about 10 min");
  });
});

describe("greeting", () => {
  test("follows the hour of the day", () => {
    expect(greeting(5)).toBe("Good morning");
    expect(greeting(11)).toBe("Good morning");
    expect(greeting(12)).toBe("Good afternoon");
    expect(greeting(17)).toBe("Good afternoon");
    expect(greeting(18)).toBe("Good evening");
    expect(greeting(2)).toBe("Good evening");
  });
});
