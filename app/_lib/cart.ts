import type { Product } from "./catalog";

const key = "raeed-dev-cart";

export function cartSnapshot() {
  try { return window.localStorage.getItem(key) ?? "[]"; } catch { return "[]"; }
}

export function parseCart(value: string): Product[] {
  try {
    const items: unknown = JSON.parse(value);
    if (!Array.isArray(items)) return [];
    return items.filter((item): item is Product => item !== null && typeof item === "object" && !item.service && typeof item.slug === "string" && typeof item.name === "string" && typeof item.duration === "string" && typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0);
  } catch { return []; }
}

export function saveCart(items: Product[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(items.filter(item => !item.service)));
    window.dispatchEvent(new Event(key));
    return true;
  } catch { return false; }
}

export function subscribeCart(callback: () => void) {
  window.addEventListener(key, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(key, callback); window.removeEventListener("storage", callback); };
}

export const emptyCartSnapshot = () => "[]";
