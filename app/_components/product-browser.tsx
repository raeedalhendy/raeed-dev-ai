"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import type { Product } from "../_lib/catalog";

export function ProductBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const categories = [...new Set(products.map((product) => product.categorySlug))];
  const visible = useMemo(() => products.filter((product) => (category === "all" || product.categorySlug === category) && product.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : Number(Boolean(b.featured)) - Number(Boolean(a.featured))), [category, products, query, sort]);
  const labels: Record<string, string> = { "ai-assistants": "ذكاء اصطناعي", video: "مشاهدة", work: "إنتاجية", design: "تصميم" };

  return <section id="shop" className="mx-auto max-w-7xl px-5 py-24 md:px-8"><div className="flex flex-col gap-6 border-b border-black/10 pb-7 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold text-[#103cff]">اختر ما يناسبك</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] md:text-4xl">كل الاشتراكات.</h2></div><div className="flex flex-wrap gap-2"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن خدمة..." className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#103cff] sm:w-52" /><select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-black/10 bg-white px-3 py-3 text-sm outline-none"><option value="featured">الأكثر طلباً</option><option value="low">السعر: الأقل أولاً</option><option value="high">السعر: الأعلى أولاً</option></select></div></div><div className="mt-5 flex gap-2 overflow-x-auto pb-1"><button onClick={() => setCategory("all")} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${category === "all" ? "bg-[#103cff] text-white" : "bg-white text-black/55"}`}>الكل</button>{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${category === item ? "bg-[#103cff] text-white" : "bg-white text-black/55"}`}>{labels[item]}</button>)}</div>{visible.length ? <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{visible.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <p className="mt-10 rounded-2xl bg-white p-6 text-sm text-black/50">ما لقينا خدمة بهذا الاسم. جرّب بحثاً آخر.</p>}</section>;
}
