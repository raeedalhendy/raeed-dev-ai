import Link from "next/link";
import { BrandMark } from "./site-header";
import { Icon } from "./icon";
import styles from "../storefront.module.css";

export function SiteFooter() {
  return <footer className={styles.footer}><div className={styles.container}><div className={styles.footerTop}><div><BrandMark /><p>مساحتك لكل ما هو رقمي.<br />أدوات أفضل، ليوم مليان إمكانيات.</p></div><div><span className={styles.footerLabel}>اكتشف المتجر</span><Link href="/#shop">كل الاشتراكات</Link><Link href="/#categories">الأقسام</Link><Link href="/#featured">المميزة</Link></div><div><span className={styles.footerLabel}>نحن قريبون</span><Link href="/#how-it-works">طريقة الطلب</Link><a href="https://wa.me/963969477454">تواصل عبر واتساب <Icon name="arrow" /></a><span className={styles.footerNote}>نرافقك من الاختيار إلى التفعيل.</span></div></div><div className={styles.footerBottom}><p>© {new Date().getFullYear()} Raeed Dev. جميع الحقوق محفوظة.</p><span dir="ltr">A LITTLE UPGRADE. A BIG DIFFERENCE. <b>✳</b></span></div></div></footer>;
}
