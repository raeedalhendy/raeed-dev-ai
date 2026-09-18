import Link from "next/link";
import { VisitTracker } from "../../_components/visit-tracker";
import { CategoryCard } from "../../_components/category-card";
import { ProductCard } from "../../_components/product-card";
import { SiteHeader } from "../../_components/site-header";
import { SiteFooter } from "../../_components/site-footer";
import { getStorefront } from "../../_lib/store";
import { notFound, redirect } from "next/navigation";
import { catalogPath, findByUrl } from "../../_lib/catalog-urls";
import { resolveCatalogAlias } from "../../_lib/catalog-url-storage";
import styles from "../../storefront.module.css";

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { categories, products } = await getStorefront();
  const { slug } = await params;
  let category = findByUrl(categories, slug);
  if (!category) {
    const original = await resolveCatalogAlias("category", slug);
    category = categories.find(item => item.slug === original);
  }
  if (!category) notFound();
  if (slug !== (category.urlSlug || category.slug)) redirect(catalogPath("category", category));
  const categoryKey = category.slug;
  const children = categories.filter(item => item.parentSlug === categoryKey);
  const items = products.filter(item => item.categorySlug === categoryKey);
  return <main className={styles.storefront}><SiteHeader /><div className={styles.container}>
    <VisitTracker key={category.slug} kind="category" slug={category.slug} />
    <nav className={styles.breadcrumbs} aria-label="مسار الصفحة"><Link href="/">الرئيسية</Link><span>/</span><Link href="/#categories">كل الأقسام</Link><span>/</span><span>{category.name}</span></nav>
    <section className={styles.categoryIntro}><span className={styles.categoryIntroGlyph} aria-hidden="true">{category.glyph}</span><p className={styles.eyebrow}>FIND YOUR SPACE <span /> عالمك المفضل</p><h1>{category.name}</h1><p className={styles.sectionDescription}>{category.description}</p></section>
    <section className={styles.categoryProducts} aria-label={`تصفّح ${category.name}`}>
      {children.length > 0 && <div className={styles.categoryGrid}>{children.map((item) => <CategoryCard key={item.slug} category={item} />)}</div>}
      {items.length > 0 && <><p className={styles.resultsCount}>{items.length} منتجات وخدمات متاحة</p><div className={styles.productGrid}>{items.map((item) => <ProductCard key={item.slug} product={item} />)}</div></>}
      {children.length === 0 && items.length === 0 && <div className={styles.emptyState}><h2>قريباً، إمكانيات جديدة.</h2><p>لا توجد منتجات أو خدمات في هذا القسم حالياً.</p><Link href="/#shop" className={styles.outlineButton}>تصفّح المتجر</Link></div>}
    </section></div><SiteFooter /></main>;
}
