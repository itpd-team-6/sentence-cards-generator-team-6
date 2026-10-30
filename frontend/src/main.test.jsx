import { expect, test, vi } from "vitest";

// The real App calls the API, so a stand-in shows that main.jsx renders it into the page.
vi.mock("./App.jsx", () => ({
  default: () => <p>App is rendered</p>,
}));

test("main.jsx renders the app into the root element", async () => {
  document.body.innerHTML = '<div id="root"></div>';

  await import("./main.jsx");

  await vi.waitFor(() => {
    expect(document.getElementById("root").textContent).toBe("App is rendered");
  });
});
