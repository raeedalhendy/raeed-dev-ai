import Link from "next/link";
import { VisitTracker } from "./_components/visit-tracker";
import { CategoryCard } from "./_components/category-card";
import { ProductCard } from "./_components/product-card";
import { SiteHeader } from "./_components/site-header";
import { ProductBrowser } from "./_components/product-browser";
import { StoreExtras } from "./_components/store-extras";
import { SiteFooter } from "./_components/site-footer";
import { Icon } from "./_components/icon";
import { getStorefront } from "./_lib/store";
import styles from "./storefront.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { categories, products } = await getStorefront();
  const featured = products.filter((product) => product.featured);
  const rootCategories = categories.filter((category) => category.parentSlug === null);
  return <main className={styles.storefront}>
    <VisitTracker kind="home" />
    <SiteHeader />
    <section className={styles.hero}>
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <span className={styles.pill}><span className={styles.statusDot} /> عالمك الرقمي، بمستوى جديد</span>
          <h1>أدوات أكبر.<br />إمكانيات <span>بلا حدود<svg viewBox="0 0 320 18" fill="none" aria-hidden="true"><path d="M4 13C78 2 223 1 316 9M45 16C126 9 233 8 288 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></span></h1>
          <p>من أول فكرة لآخر إنجاز. اشتراكاتك المفضلة في الذكاء الاصطناعي، التصميم والترفيه… كلها بمكان واحد.</p>
          <div className={styles.heroActions}><a href="#shop" className={styles.primaryButton}>اكتشف المتجر <Icon name="arrow" /></a><a href="#how-it-works" className={styles.textButton}><span className={styles.playButton}><Icon name="play" /></span> كيف تطلب؟</a></div>
          <div className={styles.heroAssurance}><span><Icon name="shield" /> تفعيل مضمون</span><i /><span><Icon name="headphones" /> دعم معك خطوة بخطوة</span></div>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <div className={styles.orbitOuter} /><div className={styles.orbitInner} />
          <span className={styles.artCoordinate}>YOUR DIGITAL UNIVERSE</span>
          <div className={styles.core}><span className={styles.coreStar}>✳</span><strong>raeed<span>dev.</span></strong><small>UNLOCK YOUR POTENTIAL</small></div>
          <div className={`${styles.floatingApp} ${styles.appAi}`}><span>✳</span><b>AI tools</b><small>فكّر أبعد</small></div>
          <div className={`${styles.floatingApp} ${styles.appDesign}`}><span>◒</span><b>Design</b><small>اصنع المختلف</small></div>
          <div className={`${styles.floatingApp} ${styles.appPlay}`}><Icon name="play" /><b>Entertainment</b><small>لحظتك الخاصة</small></div>
          <div className={styles.activation}><span><Icon name="check" /></span><div><b>جاهز للانطلاقة؟</b><small>عالم من الإمكانيات بانتظارك</small></div><span className={styles.activationSpark}>✦</span></div>
          <span className={styles.orbitDot} /><span className={styles.artPlus}>+</span>
        </div>
      </div>
      <div className={`${styles.container} ${styles.heroBottom}`}><span>صُمّم ليواكب طموحك</span><div><span>CREATE</span><i /><span>WORK</span><i /><span>PLAY</span></div><a href="#featured" aria-label="اكتشف المنتجات المميزة"><Icon name="down" /></a></div>
    </section>
    <div className={styles.trustStrip}><div className={styles.container}>{[["bolt", "تفعيل سريع", "ابدأ بدون انتظار"], ["shield", "اشتراكات مضمونة", "راحة بال مع كل طلب"], ["wallet", "أسعار واضحة", "اختر ما يناسب ميزانيتك"], ["headphones", "دعم مباشر", "نساعدك عبر واتساب"]].map(([icon, title, text]) => <div key={title}><span className={styles.trustIcon}><Icon name={icon as "bolt" | "shield" | "wallet" | "headphones"} /></span><p><b>{title}</b><small>{text}</small></p></div>)}</div></div>
    {featured.length > 0 && <section id="featured" className={`${styles.container} ${styles.section}`}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>THE SPOTLIGHT <span /> تحت الضوء</p><h2>اختيارات تستحق التجربة<span>.</span></h2><p className={styles.sectionDescription}>خدمات مميزة تفتح لك مساحة أكبر للإبداع والإنجاز.</p></div><a href="#shop" className={styles.outlineButton}>كل المنتجات والخدمات <Icon name="arrow" /></a></div><div className={styles.productGrid}>{featured.map((product) => <ProductCard key={product.slug} product={product} />)}</div></section>}
    <section id="categories" className={styles.categorySection}><div className={styles.container}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>FIND YOUR SPACE <span /> على مزاجك</p><h2>لكل شغف، مساحة<span>.</span></h2></div><p className={styles.sectionDescription}>شغل، إبداع أو وقت لنفسك.<br />ابدأ من عالمك المفضل.</p></div><div className={styles.categoryGrid}>{rootCategories.map((category) => <CategoryCard key={category.slug} category={category} />)}</div></div></section>
    <ProductBrowser products={products} categories={categories} />
    <section className={`${styles.container} ${styles.promo}`}><div><p className={styles.eyebrow}>LESS LIMITS. MORE POSSIBILITIES.</p><h2>فكرتك القادمة تستاهل<br />الأدوات الصح.</h2><p>جهّز مساحة عملك باشتراكات تناسب طموحك.</p><Link href="#shop" className={styles.whiteButton}>جهّز أدواتك <Icon name="arrow" /></Link></div><div className={styles.promoArt} aria-hidden="true"><span>✳</span><span>MAKE<br />IT<br /><i>HAPPEN.</i></span></div></section>
    <StoreExtras />
    <SiteFooter />
  </main>;
}
