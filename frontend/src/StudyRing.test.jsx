import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test } from "vitest";
import StudyRing from "./StudyRing.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const draw = (counts) => act(() => root.render(<StudyRing counts={counts} />));
const segments = () => [...container.querySelectorAll(".study-ring-segment")];

test("the ring shows the total and a segment for each stage that has cards", () => {
  draw({ new: 1, forgotten: 0, due: 3 });

  expect(container.querySelector(".study-ring-total").textContent).toBe("4");
  expect(segments().map((s) => s.getAttribute("stroke-dasharray"))).toEqual([
    "25 75",
    "75 25",
  ]);
  expect(segments().map((s) => s.getAttribute("stroke-dashoffset"))).toEqual([
    "0",
    "-25",
  ]);
});

test("the ring is only the track when there is nothing to study", () => {
  draw({ new: 0, forgotten: 0, due: 0 });

  expect(container.querySelector(".study-ring-total").textContent).toBe("0");
  expect(segments()).toHaveLength(0);
});
