import Link from "next/link";
import Image from "next/image";
import type { Product } from "../_lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return <Link href={`/products/${product.slug}`} className="group block"><div className={`relative grid aspect-[1.06] place-items-center overflow-hidden rounded-3xl bg-gradient-to-br ${product.color} text-7xl font-black text-white shadow-sm transition duration-500 group-hover:-translate-y-2 group-hover:shadow-xl`}><span className="absolute z-10 right-3 top-3 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold backdrop-blur">{product.delivery}</span>{product.imageUrl ? <Image unoptimized src={product.imageUrl} alt={product.name} fill className="object-contain bg-white p-4" /> : product.glyph}</div><div className="mt-4 flex items-start justify-between gap-3"><div><h3 className="text-lg font-black">{product.name}</h3><p className="mt-1 text-xs text-black/45">{product.accountType} · {product.duration}</p></div><p className="whitespace-nowrap pt-1 text-sm font-black text-[#103cff]">${product.price}</p></div></Link>;
}
