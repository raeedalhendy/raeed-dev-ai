import { notFound } from "next/navigation";
import { getStorefront } from "../../_lib/store";
import { sql } from "../../_lib/db";
import { SiteHeader } from "../../_components/site-header";
import { AddToCartButton } from "../../_components/add-to-cart-button";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const { products, categories } = await getStorefront();
  const rates = await sql()`SELECT value FROM store_settings WHERE key='exchange_rate'`;
  const rate = Number(rates[0]?.value ?? 1350);
  const formatSyp = (price: number) => new Intl.NumberFormat("ar-SY").format(price * rate);
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const category = categories.find(item => item.slug === product.categorySlug);
  const whatsapp = `https://wa.me/963969477454?text=${encodeURIComponent(`مرحباً، بدي أطلب ${product.name} بسعر $${product.price}`)}`;
  return <main className="min-h-screen bg-[#f8f9fc] text-[#101114]"><SiteHeader />
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.08fr_.92fr] md:px-8 md:py-20"><div className={`grid aspect-square place-items-center rounded-[2.5rem] bg-gradient-to-br ${product.color} text-[10rem] font-black text-white shadow-[0_30px_70px_rgba(16,60,255,.18)] md:text-[14rem]`}>{product.glyph}</div><div className="flex flex-col justify-center"><p className="text-xs font-bold text-[#103cff]">{category?.name}</p><h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-6xl">{product.name}</h1><p className="mt-7 max-w-sm text-sm leading-7 text-black/55">{product.note}</p><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white p-4"><p className="text-[11px] text-black/40">نوع الخدمة</p><p className="mt-1 text-sm font-bold">{product.accountType}</p></div><div className="rounded-2xl bg-white p-4"><p className="text-[11px] text-black/40">وقت التفعيل</p><p className="mt-1 text-sm font-bold">{product.delivery}</p></div></div><div className="mt-6 rounded-2xl border border-[#103cff]/10 bg-[#103cff]/[.04] p-5"><p className="text-sm font-black">ماذا ستحصل عليه؟</p><ul className="mt-3 space-y-2 text-sm text-black/55"><li>✓ اشتراك لمدة {product.duration}</li><li>✓ تفعيل واضح وخطوات سهلة</li><li>✓ دعم ومتابعة عند الحاجة</li></ul></div><div className="mt-7 border-y border-black/10 py-6"><p className="text-xs text-black/40">السعر</p><div className="mt-2 flex items-end gap-4"><span className="text-4xl font-black">${product.price}</span><span className="mb-1 text-sm font-bold text-[#103cff]">{formatSyp(product.price)} ل.س</span></div></div><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-8 rounded-2xl bg-[#103cff] px-6 py-4 text-center text-sm font-black text-white shadow-[0_15px_30px_rgba(16,60,255,.22)] transition hover:-translate-y-1 hover:bg-[#0b2ddd]">اطلب عبر واتساب <span className="mr-2">↙</span></a><AddToCartButton product={product} /><p className="mt-4 text-center text-[11px] text-black/35">اطلب كضيف — لا تحتاج لإنشاء حساب.</p></div></section>
  </main>;
}
