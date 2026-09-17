import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStorefront, getExchangeRate } from "../../_lib/store";
import { SiteHeader } from "../../_components/site-header";
import { SiteFooter } from "../../_components/site-footer";
import { AddToCartButton } from "../../_components/add-to-cart-button";
import { ProductCard } from "../../_components/product-card";
import { Icon } from "../../_components/icon";
import styles from "../../storefront.module.css";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const { products, categories } = await getStorefront();
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const rate = await getExchangeRate();
  const formatSyp = (price: number) => new Intl.NumberFormat("ar-SY").format(price * rate);
  const category = categories.find(item => item.slug === product.categorySlug);
  const related = products.filter((item) => item.slug !== slug).slice(0, 4);
  const whatsapp = `https://wa.me/963969477454?text=${encodeURIComponent(`مرحباً، بدي أطلب ${product.name} بسعر $${product.price}`)}`;
  return <main className={styles.storefront}><SiteHeader />
    <div className={styles.container}>
      <nav className={styles.breadcrumbs} aria-label="مسار الصفحة"><Link href="/">الرئيسية</Link><span>/</span>{category && <><Link href={`/categories/${category.slug}`}>{category.name}</Link><span>/</span></>}<span dir="auto">{product.name}</span></nav>
      <section className={styles.detailGrid}>
        <div className={`${styles.detailVisual} bg-gradient-to-br ${product.color}`}><div className={styles.productOrbits} aria-hidden="true" />{product.imageUrl ? <Image unoptimized src={product.imageUrl} alt={product.name} fill sizes="(max-width: 760px) 100vw, 50vw" className={styles.productImage} /> : <span aria-hidden="true">{product.glyph}</span>}<span className={styles.deliveryBadge}><Icon name="bolt" />{product.delivery}</span></div>
        <div className={styles.detailInfo}><p className={styles.eyebrow}>{category?.name} <span /> YOUR NEXT UPGRADE</p><h1 dir="auto">{product.name}</h1><p className={styles.detailDescription}>{product.note}</p>
          <div className={styles.detailFacts}><div><small>نوع الخدمة</small><b>{product.accountType}</b></div><div><small>وقت التفعيل</small><b>{product.delivery}</b></div></div>
          <div className={styles.detailBenefits}><h2>كل ما تحتاجه لتبدأ</h2><ul><li><Icon name="check" />اشتراك لمدة {product.duration}</li><li><Icon name="check" />تفعيل واضح وخطوات سهلة</li><li><Icon name="check" />دعم ومتابعة عند الحاجة</li></ul></div>
          <div className={styles.detailPrice}><strong dir="ltr">${product.price}</strong><span>{formatSyp(product.price)} ل.س</span></div>
          <a href={whatsapp} target="_blank" rel="noreferrer" className={styles.primaryButton}>اطلب عبر واتساب <Icon name="arrow" /></a><AddToCartButton product={product} /><p className={styles.guestNote}>اطلب كضيف. بدون إنشاء حساب، وبدون تعقيد.</p>
        </div>
      </section>
      {related.length > 0 && <section className={styles.section}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>KEEP EXPLORING</p><h2>كمّل أدواتك<span>.</span></h2></div><Link href="/#shop" className={styles.outlineButton}>كل الاشتراكات <Icon name="arrow" /></Link></div><div className={styles.productGrid}>{related.map((item) => <ProductCard key={item.slug} product={item} />)}</div></section>}
    </div><SiteFooter />
  </main>;
}
