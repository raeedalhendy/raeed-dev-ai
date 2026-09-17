"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import { Icon } from "./icon";
import type { Category, Product } from "../_lib/catalog";
import styles from "../storefront.module.css";

export function ProductBrowser({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const categorySlugs = [...new Set(products.map((product) => product.categorySlug))];
  const visible = useMemo(() => products.filter((product) => (category === "all" || product.categorySlug === category) && product.name.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : Number(Boolean(b.featured)) - Number(Boolean(a.featured))), [category, products, query, sort]);

  return <section id="shop" className={`${styles.container} ${styles.section}`}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>YOUR NEXT UPGRADE <span /> اكتشف المزيد</p><h2>اشتراك صغير. فرق كبير<span>.</span></h2><p className={styles.sectionDescription}>أدوات تحبها، وخيارات تناسبك.</p></div><label className={styles.search}><Icon name="search" /><input aria-label="ابحث عن اشتراك" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="عن أي اشتراك تبحث؟" /></label></div><div className={styles.browserToolbar}><div className={styles.filters}><button onClick={() => setCategory("all")} aria-pressed={category === "all"}>كل الاشتراكات <span>{products.length}</span></button>{categorySlugs.map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item}>{categories.find((entry) => entry.slug === item)?.name ?? item}</button>)}</div><select aria-label="ترتيب الاشتراكات" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">المميزة أولاً</option><option value="low">السعر: الأقل أولاً</option><option value="high">السعر: الأعلى أولاً</option></select></div><p className={styles.resultsCount} role="status">{visible.length} اشتراكات متاحة</p>{visible.length ? <div className={styles.productGrid}>{visible.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className={styles.emptyState}><Icon name="search" /><h3>ما لقينا اشتراك بهذا البحث</h3><p>جرّب اسماً آخر أو تصفّح كل الاشتراكات.</p><button className={styles.outlineButton} onClick={() => { setQuery(""); setCategory("all"); }}>عرض الكل <Icon name="arrow" /></button></div>}</section>;
}
