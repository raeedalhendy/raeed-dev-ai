import Link from "next/link";
import type { Category } from "../_lib/catalog";

export function CategoryCard({ category }: { category: Category }) {
  return <Link href={`/categories/${category.slug}`} className="group overflow-hidden rounded-3xl border border-black/[.08] bg-white transition hover:-translate-y-1 hover:border-[#103cff]/30 hover:shadow-lg">{category.imageUrl ? <div className="aspect-[1.8] overflow-hidden"><img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div> : <div className={`grid aspect-[1.8] place-items-center bg-gradient-to-br ${category.color} text-5xl font-black text-white`}>{category.glyph}</div>}<div className="p-5"><h3 className="text-xl font-black">{category.name}</h3><p className="mt-2 text-sm leading-6 text-black/45">{category.description}</p><span className="mt-6 block text-sm font-bold text-[#103cff]">استكشف ←</span></div></Link>;
}
