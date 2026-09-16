import Link from "next/link";
import { CategoryCard } from "../../_components/category-card";
import { ProductCard } from "../../_components/product-card";
import { SiteHeader } from "../../_components/site-header";
import { getCategory, getChildCategories, getProductsForCategory } from "../../_lib/catalog";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params; const category = getCategory(slug); if (!category) notFound();
  const children = getChildCategories(category.slug); const items = getProductsForCategory(category.slug); const showingSubcategories = children.length > 0;
  return <main className="min-h-screen bg-[#f8f9fc] text-[#101114]"><SiteHeader /><section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-18"><Link href="/" className="text-sm font-bold text-[#103cff]">← كل الأقسام</Link><p className="mt-12 text-xs font-bold text-[#103cff]">قسم</p><h1 className="mt-2 text-4xl font-black tracking-[-.05em] md:text-6xl">{category.name}</h1><p className="mt-4 max-w-md text-sm leading-7 text-black/50">{category.description}</p><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{showingSubcategories ? children.map((item) => <CategoryCard key={item.slug} category={item} />) : items.map((item) => <ProductCard key={item.slug} product={item} />)}</div>{!showingSubcategories && items.length === 0 && <p className="mt-12 text-sm text-black/45">لا توجد منتجات في هذا القسم حالياً.</p>}</section></main>;
}
