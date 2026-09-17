"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { cartSnapshot, emptyCartSnapshot, parseCart, saveCart, subscribeCart } from "../_lib/cart";
import { Icon } from "./icon";
import styles from "../storefront.module.css";

export function CartLauncher() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const snapshot = useSyncExternalStore(subscribeCart, cartSnapshot, emptyCartSnapshot);
  const items = useMemo(() => parseCart(snapshot), [snapshot]);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const checkout = `https://wa.me/963969477454?text=${encodeURIComponent(`مرحباً، أريد طلب: ${items.map((item) => item.name).join("، ")} — الإجمالي $${Number(total.toFixed(2))}`)}`;
  function close() { dialog.current?.close(); }
  return <><button onClick={() => { dialog.current?.showModal(); setOpen(true); }} className={styles.iconButton} aria-label={`سلة الطلب، ${items.length} اشتراكات`}><Icon name="bag" />{items.length > 0 && <span className={styles.cartCount}>{items.length}</span>}</button>
    <dialog ref={dialog} className={styles.cartDialog} aria-labelledby="cart-title" onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
      <div className={styles.cartHeading}><h2 id="cart-title">اختياراتك<span>.</span></h2><button onClick={close} className={styles.iconButton} aria-label="إغلاق السلة" autoFocus><Icon name="close" /></button></div>
      {items.length ? <><div>{items.map((item) => <div key={item.slug} className={styles.cartItem}><div><b dir="auto">{item.name}</b><p>{item.duration}</p></div><div><strong dir="ltr">${item.price}</strong><button aria-label={`إزالة ${item.name} من السلة`} onClick={() => { if (!saveCart(items.filter((entry) => entry.slug !== item.slug))) setError("تعذّر تحديث السلة. تحقق من إعدادات التخزين في المتصفح."); }}><Icon name="close" /></button></div></div>)}</div><div className={styles.cartTotal}><span>الإجمالي</span><span dir="ltr">${Number(total.toFixed(2))}</span></div><a href={checkout} target="_blank" rel="noreferrer" className={styles.primaryButton}>أكمل طلبك عبر واتساب <Icon name="arrow" /></a><p className={styles.guestNote}>نؤكد معك تفاصيل الطلب وطريقة الدفع قبل التفعيل.</p></> : <div className={styles.cartEmpty}><Icon name="bag" /><h2>البداية من هنا.</h2><p>أضف اشتراكك المفضل، وخلّينا نجهّز طلبك.</p><Link href="/#shop" onClick={close} className={styles.primaryButton}>اكتشف الاشتراكات <Icon name="arrow" /></Link></div>}
      {error && <p role="alert" className={styles.guestNote}>{error}</p>}
    </dialog>
  </>;
}
