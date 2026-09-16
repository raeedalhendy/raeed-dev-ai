"use client";

import { useEffect, useState } from "react";
import type { Product } from "../_lib/catalog";

export function CartLauncher() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const refresh = () => setItems(JSON.parse(localStorage.getItem("raeed-dev-cart") ?? "[]"));
  useEffect(() => { window.addEventListener("raeed-dev-cart", refresh); return () => window.removeEventListener("raeed-dev-cart", refresh); }, []);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const checkout = `https://wa.me/963969477454?text=${encodeURIComponent(`مرحباً، أريد طلب: ${items.map((item) => item.name).join("، ")} — الإجمالي $${total}`)}`;
  return <><button onClick={() => { refresh(); setOpen(true); }} className="relative grid h-10 w-10 place-items-center rounded-xl border border-black/10 text-sm" aria-label="سلة الطلب">🛒{items.length > 0 && <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#103cff] text-[9px] font-bold text-white">{items.length}</span>}</button>{open && <div className="fixed inset-0 z-50 bg-black/30 p-4" onClick={() => setOpen(false)}><div className="mr-auto h-full w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-xl font-black">سلة الطلب</h2><button onClick={() => setOpen(false)} className="text-xl">×</button></div>{items.length ? <><div className="mt-6 space-y-3">{items.map((item) => <div key={item.slug} className="flex items-center justify-between rounded-2xl bg-black/[.04] p-4"><div><p className="font-bold">{item.name}</p><p className="mt-1 text-xs text-black/45">{item.duration}</p></div><p className="font-black text-[#103cff]">${item.price}</p></div>)}</div><div className="mt-6 flex justify-between border-t border-black/10 pt-5 font-black"><span>الإجمالي</span><span>${total}</span></div><a href={checkout} target="_blank" rel="noreferrer" className="mt-5 block rounded-2xl bg-[#103cff] py-4 text-center text-sm font-black text-white">تأكيد الطلب عبر واتساب</a></> : <p className="mt-8 rounded-2xl bg-black/[.04] p-5 text-sm text-black/50">السلة فارغة حالياً. أضف خدمة لنكمل طلبك.</p>}</div></div>}</>;
}
