"use client";

import { useState } from "react";
import type { Product } from "../_lib/catalog";

export function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("raeed-dev-cart") ?? "[]") as Product[];
    if (!cart.some((item) => item.slug === product.slug)) localStorage.setItem("raeed-dev-cart", JSON.stringify([...cart, product]));
    window.dispatchEvent(new Event("raeed-dev-cart"));
    setAdded(true);
  }
  return <button onClick={addToCart} className="mt-3 w-full rounded-2xl border border-[#103cff]/25 bg-white px-6 py-3.5 text-sm font-black text-[#103cff] transition hover:bg-[#103cff]/5">{added ? "أُضيف إلى السلة ✓" : "أضف إلى السلة"}</button>;
}
