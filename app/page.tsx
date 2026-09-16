import { CategoryCard } from "./_components/category-card";
import { ProductCard } from "./_components/product-card";
import { SiteHeader } from "./_components/site-header";
import { ProductBrowser } from "./_components/product-browser";
import { StoreExtras } from "./_components/store-extras";
import { getStorefront } from "./_lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { categories, products } = await getStorefront();
  const featured = products.filter((product) => product.featured);
  const rootCategories = categories.filter((category) => category.parentSlug === null);
  return <main className="min-h-screen  bg-[#f8f9fc] text-[#101114]"><SiteHeader />
    <section className="relative overflow-hidden "><div className="absolute left-1/2 top-[-25rem] -z-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#1745ff]/[.12] blur-3xl" /><div className="relative mx-auto max-w-7xl px-5 py-24 text-center md:px-8 md:py-36"><p className="text-xs font-bold tracking-[.18em] text-[#103cff]">RAEED DEV · DIGITAL STORE</p><h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[1.06] tracking-[-.055em] md:text-7xl">اشتراكات رقمية<br /><span className="text-[#103cff]">تليق بشغلك.</span></h1><p className="mx-auto mt-6 max-w-md text-sm leading-7 text-black/50">خدمات أصلية، تفعيل سريع، ودعم يبقى معك بعد الطلب.</p><a href="#shop" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#103cff] px-6 py-3.5 text-sm font-bold text-white shadow-[0_15px_35px_rgba(16,60,255,.25)] transition hover:-translate-y-1">ابدأ التسوّق <span>↓</span></a></div></section>
    <StoreExtras />
    <section id="featured" className="mx-auto max-w-7xl px-5 pb-28 md:px-8"><div className="flex items-end justify-between border-b border-black/10 pb-6"><div><p className="text-xs font-bold text-[#103cff] pt-4">مختاراتنا</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] md:text-4xl">المنتجات المميزة.</h2></div><span className="text-xs text-black/40">الأكثر طلباً</span></div><div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2">{featured.map((product) => <ProductCard key={product.slug} product={product} />)}</div></section>
    <section id="categories" className="border-y border-black/[.06] bg-white"><div className="mx-auto max-w-7xl px-5 py-24 md:px-8"><p className="text-xs font-bold text-[#103cff]">تصفح حسب القسم</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] md:text-4xl">كل خدماتك بمكانها.</h2><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{rootCategories.map((category) => <CategoryCard key={category.slug} category={category} />)}</div></div></section>
    <ProductBrowser products={products} />
    <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-xs text-black/45 md:flex-row md:items-center md:justify-between md:px-8"><p>© 2026 Raeed Dev</p><p>الأسعار تُحدّث من لوحة التحكم</p><a href="https://wa.me/963969477454" className="font-bold text-[#103cff]">واتساب ←</a></footer>
  </main>;
}
