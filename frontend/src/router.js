import { useSyncExternalStore } from "react";

// The pages of the product, in the order of the tabs, and the address of each one after the `#` (DEC-063).
export const PAGES = [
  { id: "study", name: "Study", path: "/study" },
  { id: "text", name: "Add a text", path: "/add-a-text" },
];

// The page an address names. An empty or unknown address names the Study page, which the product opens on.
export function pageOf(hash) {
  const path = hash.replace(/^#/, "");
  const page = PAGES.find((item) => item.path === path);
  return page ? page.id : PAGES[0].id;
}

// The address to put in the link to a page.
export function hrefOf(id) {
  return `#${PAGES.find((item) => item.id === id).path}`;
}

function subscribe(listener) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

// The page the address names now. It changes with the links, the back and forward buttons and a reload.
export function usePage() {
  return pageOf(useSyncExternalStore(subscribe, () => window.location.hash));
}
