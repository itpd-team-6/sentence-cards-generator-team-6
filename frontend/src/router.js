import { useSyncExternalStore } from "react";

// The pages of the product, in the order of the tabs, and the address of each one after the `#` (DEC-063, DEC-064).
export const PAGES = [
  { id: "study", name: "Study", path: "/study" },
  { id: "texts", name: "Texts", path: "/texts" },
  { id: "cards", name: "Your cards", path: "/your-cards" },
];

// A saved text has its own address inside the Texts page: `#/texts/12`.
const TEXT = /^\/texts\/(\d+)$/;

// The page an address names. An empty or unknown address names the Study page, which the product opens on.
export function pageOf(hash) {
  const path = hash.replace(/^#/, "");
  if (TEXT.test(path)) return "texts";
  const page = PAGES.find((item) => item.path === path);
  return page ? page.id : PAGES[0].id;
}

// The id of the saved text an address opens, or null when it opens no text.
export function textIdOf(hash) {
  const found = TEXT.exec(hash.replace(/^#/, ""));
  return found ? Number(found[1]) : null;
}

// The address to put in the link to a page.
export function hrefOf(id) {
  return `#${PAGES.find((item) => item.id === id).path}`;
}

// The address to put in the link to a saved text.
export function hrefOfText(textId) {
  return `#/texts/${textId}`;
}

function subscribe(listener) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

const currentHash = () => window.location.hash;

// The page the address names now. It changes with the links, the back and forward buttons and a reload.
export function usePage() {
  return pageOf(useSyncExternalStore(subscribe, currentHash));
}

// The saved text the address opens now, or null.
export function useTextId() {
  return textIdOf(useSyncExternalStore(subscribe, currentHash));
}
