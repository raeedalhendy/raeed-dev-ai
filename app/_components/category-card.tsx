import Image from "next/image";
import Link from "next/link";
import type { Category } from "../_lib/catalog";
import { Icon } from "./icon";
import { catalogPath } from "../_lib/catalog-urls";
import styles from "../storefront.module.css";

export function CategoryCard({ category }: { category: Category }) {
  return <Link href={catalogPath("category", category)} className={styles.categoryCard}><div className={`${styles.categoryIcon} bg-gradient-to-br ${category.color}`}>{category.imageUrl ? <Image unoptimized src={category.imageUrl} alt="" fill sizes="60px" className="object-cover" /> : <span aria-hidden="true">{category.glyph}</span>}</div><h3>{category.name}</h3><p>{category.description}</p><span className={styles.categoryExplore}>استكشف القسم <Icon name="arrow" /></span></Link>;
}
