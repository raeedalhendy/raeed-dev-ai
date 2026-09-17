import Link from "next/link";
import Image from "next/image";
import type { Product } from "../_lib/catalog";
import { Icon } from "./icon";
import styles from "../storefront.module.css";

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  return <Link href={`/products/${product.slug}`} className={`${styles.productCard} ${featured ? styles.featuredCard : ""}`}>
    <div className={`${styles.productVisual} bg-gradient-to-br ${product.color}`}>
      <div className={styles.productOrbits} aria-hidden="true" />
      <span className={styles.deliveryBadge}><Icon name="bolt" />{product.delivery}</span>
      {product.imageUrl ? <Image unoptimized src={product.imageUrl} alt={product.name} fill sizes={featured ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 25vw"} className={styles.productImage} /> : <span className={styles.productGlyph} aria-hidden="true">{product.glyph}</span>}
      <span className={styles.visualCaption}>UPGRADE YOUR EVERYDAY</span><span className={styles.cardArrow}><Icon name="arrow" /></span>
    </div>
    <div className={styles.productInfo}><div><span className={styles.productDuration}>{product.duration}</span><h3 dir="auto">{product.name}</h3><p>{product.accountType}</p></div><div className={styles.price}><strong dir="ltr"><small>$</small>{product.price}</strong><span>لكل اشتراك</span></div></div>
    {featured && <div className={styles.featuredNote}><span>{product.note}</span><b>اكتشف الخدمة <Icon name="arrow" /></b></div>}
  </Link>;
}
