"use client";

import { useState, type FormEvent } from "react";
import type { Product } from "../_lib/catalog";
import { buildProjectInquiry, requestFields } from "../_lib/services";
import { catalogPath } from "../_lib/catalog-urls";
import { Icon } from "./icon";
import styles from "../storefront.module.css";

export function ProjectInquiry({ product }: { product: Product }) {
  const [error, setError] = useState("");
  if (!product.service) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const text = buildProjectInquiry(product, new FormData(event.currentTarget), `${window.location.origin}${catalogPath("product", product)}`);
      window.location.assign(`https://wa.me/963969477454?text=${encodeURIComponent(text)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "تعذّر تجهيز الرسالة. حاول مجدداً.");
    }
  }

  return <section id="project-request" className={styles.projectRequest} aria-labelledby="project-request-title">
    <div className={styles.projectRequestIntro}>
      <p className={styles.eyebrow}>LET’S BUILD IT <span /> من الفكرة إلى التنفيذ</p>
      <h2 id="project-request-title">احكي لنا عن مشروعك<span>.</span></h2>
      <p className={styles.sectionDescription}>تفاصيل بسيطة تساعدنا نفهم فكرتك ونجهّز لك عرضاً مناسباً. إذا في شيء مو واضح، منحدده معك.</p>
      <ol className={styles.projectSteps}>
        <li><b>01</b><span>شاركنا الفكرة والمتطلبات</span></li>
        <li><b>02</b><span>نتفق على النطاق والسعر والمدة</span></li>
        <li><b>03</b><span>نبدأ التنفيذ بعد موافقتك</span></li>
      </ol>
    </div>
    <form className={styles.projectForm} onSubmit={submit}>
      <label className={styles.formFull}>اسمك<input name="name" autoComplete="name" required maxLength={100} placeholder="كيف نحب نناديك؟" /></label>
      <label className={styles.formFull}>فكرة المشروع وأهم الميزات<textarea name="idea" required minLength={10} maxLength={1500} rows={5} placeholder="ماذا تريد أن تبني؟ لمن؟ وما أهم الأشياء التي يجب أن يستطيع الزائر أو المستخدم فعلها؟" /><small>من 10 إلى 1500 حرف. اذكر الوظائف الأساسية وأي ربط مع خدمات أخرى.</small></label>
      {requestFields[product.service.type].map(field => <label key={field.name}>{field.label}<select name={field.name} defaultValue=""><option value="">أحتاج مساعدتكم في الاختيار</option>{field.options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>)}
      <label>اللغات المطلوبة (اختياري)<input name="languages" maxLength={100} placeholder="مثال: عربي وإنكليزي" /></label>
      <label>الميزانية التقريبية (اختياري)<input name="budget" maxLength={100} placeholder="المبلغ والعملة، أو نحددها معاً" /></label>
      <label>الموعد المطلوب (اختياري)<input name="deadline" maxLength={100} placeholder="مثال: خلال شهر، أو لا يوجد موعد محدد" /></label>
      <label className={styles.formFull}>موقع أو تطبيق مشابه (اختياري)<input name="reference" maxLength={300} placeholder="رابط أو اسم يعطينا فكرة عن النتيجة التي تريدها" /></label>
      <div className={styles.formFull}>
        {error && <p className={styles.inquiryError} role="alert">{error}</p>}
        <button type="submit" className={styles.primaryButton}>متابعة على واتساب <Icon name="arrow" /></button>
        <p className={styles.guestNote}>ستفتح رسالة جاهزة لتراجعها وترسلها بنفسك. لا يُحفظ الطلب هنا، ولا يترتب عليه دفع أو التزام.</p>
      </div>
    </form>
  </section>;
}
