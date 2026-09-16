import Link from "next/link";
import type { Category } from "../_lib/catalog";

export function CategoryCard({ category }: { category: Category }) {
  return <Link href={`/categories/${category.slug}`} className="group rounded-3xl border border-black/[.08] bg-white p-5 transition hover:-translate-y-1 hover:border-[#103cff]/30 hover:shadow-lg"><div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${category.color} text-xl font-black text-white`}>{category.glyph}</div><h3 className="mt-8 text-xl font-black">{category.name}</h3><p className="mt-2 text-sm leading-6 text-black/45">{category.description}</p><span className="mt-6 block text-sm font-bold text-[#103cff]">استكشف ←</span></Link>;
}
