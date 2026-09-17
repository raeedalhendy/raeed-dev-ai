import Link from "next/link";
import Image from "next/image";
import type { Product } from "../_lib/catalog";
import { priceLabel } from "../_lib/services";
import { catalogPath } from "../_lib/catalog-urls";
import { Icon } from "./icon";
import styles from "../storefront.module.css";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={catalogPath("product", product)} className={styles.productCard} title={product.name}>
      <div className={`${styles.productVisual} bg-gradient-to-br ${product.color}`}>
        <div className={styles.productOrbits} aria-hidden="true" />
        {product.imageUrl ? (
          <Image
            unoptimized
            src={product.imageUrl}
            alt=""
            fill
            sizes="(max-width: 540px) calc((100vw - 48px) / 2), (max-width: 760px) calc((100vw - 60px) / 3), (max-width: 1050px) calc((100vw - 96px) / 4), (max-width: 1280px) calc((100vw - 160px) / 5), 224px"
            className={styles.productImage}
          />
        ) : (
          <span className={styles.productGlyph} aria-hidden="true">{product.glyph}</span>
        )}
      </div>
      <span className={styles.deliveryBadge}><Icon name={product.service ? "plus" : "bolt"} />{product.service ? "خدمة برمجية" : product.delivery}</span>
      <div className={styles.productInfo}>
        <h3 dir="auto">{product.name}</h3>
        <p>{product.accountType}</p>
        <div className={`${styles.productMeta} ${product.service ? styles.serviceCardMeta : ""}`}>
          <span>{product.service ? "اطلب عرض سعر ←" : product.duration}</span>
          {product.service ? <strong className={styles.serviceCardPrice} dir="auto">{priceLabel(product)}</strong> : <strong className={styles.price} dir="ltr"><small>$</small>{product.price}</strong>}
        </div>
      </div>
    </Link>
  );
}
