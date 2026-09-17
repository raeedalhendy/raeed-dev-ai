import type { Product } from "../_lib/catalog";
import { serviceTypes } from "../_lib/services";
import { Icon } from "./icon";
import styles from "../storefront.module.css";

export function ServiceOverview({ product, categoryName, exchangeRate }: { product: Product; categoryName?: string; exchangeRate: number | null }) {
  const service = product.service!;
  const quoted = service.pricing === "quote";
  return <div className={styles.detailInfo}>
    <p className={styles.eyebrow}>{categoryName} <span /> BUILT FOR YOUR IDEA</p>
    <h1 dir="auto">{product.name}</h1>
    <p className={styles.detailDescription}>{product.note}</p>
    <div className={styles.detailFacts}>
      <div><small>مجال الخدمة</small><b>{serviceTypes[service.type]}</b></div>
      <div><small>مدة التنفيذ التقديرية</small><b>{product.delivery}</b></div>
    </div>
    <div className={styles.detailBenefits}><h2>ما يشمله التسليم</h2><ul>{service.includes.map((item, index) => <li key={index}><Icon name="check" /><span>{item}</span></li>)}</ul></div>
    {service.excludes.length > 0 && <div className={styles.serviceNotes}><h2>غير مشمول / تكاليف إضافية</h2><ul>{service.excludes.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}
    {service.support && <div className={styles.serviceNotes}><h2>الدعم والتعديلات</h2><p>{service.support}</p></div>}
    {service.portfolioUrl && <a href={service.portfolioUrl} target="_blank" rel="noopener noreferrer" className={styles.portfolioLink}>شاهد نموذجاً من أعمالنا <Icon name="arrow" /></a>}
    <div className={`${styles.detailPrice} ${styles.servicePrice}`}>
      {quoted ? <strong>السعر حسب الطلب</strong> : <>
        {service.pricing === "starting" && <b>يبدأ من</b>}
        <strong dir="ltr">${product.price}</strong>
        {exchangeRate !== null && <span>{service.pricing === "starting" ? "يبدأ من " : ""}{new Intl.NumberFormat("ar-SY").format(product.price * exchangeRate)} ل.س</span>}
      </>}
    </div>
    <p className={styles.servicePriceNote}>{service.pricing === "fixed" ? "السعر للنطاق المذكور أعلاه. أي إضافات نؤكد تكلفتها معك قبل البدء." : "نحدد السعر النهائي ومدة التنفيذ بعد مراجعة فكرتك والميزات المطلوبة."}</p>
    <a href="#project-request" className={styles.primaryButton}>اطلب عرض سعر لمشروعك <Icon name="arrow" /></a>
    <p className={styles.guestNote}>شاركنا فكرتك، ومنرتّب التفاصيل معك خطوة بخطوة.</p>
  </div>;
}
