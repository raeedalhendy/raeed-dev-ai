"use client";

import { useState } from "react";
import type { Product } from "../_lib/catalog";
import { cartSnapshot, parseCart, saveCart } from "../_lib/cart";
import { Icon } from "./icon";
import styles from "../storefront.module.css";

export function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  function addToCart() {
    const cart = parseCart(cartSnapshot());
    const updated = cart.some((item) => item.slug === product.slug) ? cart.map((item) => item.slug === product.slug ? product : item) : [...cart, product];
    const saved = saveCart(updated);
    setAdded(saved);
    setError(!saved);
  }
  return <><button onClick={addToCart} className={styles.addButton}><Icon name={added ? "check" : "bag"} /><span aria-live="polite">{added ? "أُضيف إلى السلة" : "أضف إلى السلة"}</span></button>{error && <p role="alert" className={styles.guestNote}>تعذّر حفظ السلة. يمكنك الطلب مباشرة عبر واتساب.</p>}</>;
}
