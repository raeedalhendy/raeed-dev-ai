"use client";

import { useState } from "react";
import type { Category, Product, ServiceDetails } from "../_lib/catalog";
import { serviceTypes } from "../_lib/services";

export function ProductFields({ product, categories }: { product?: Product; categories: Category[] }) {
  const [kind, setKind] = useState(product?.service ? "service" : "subscription");
  const [pricing, setPricing] = useState<ServiceDetails["pricing"]>(product?.service?.pricing ?? "quote");
  const isService = kind === "service";

  return <>
    <label className="full">نوع المنتج
      <select name="product_type" value={kind} onChange={event => setKind(event.target.value)}>
        <option value="subscription">اشتراك رقمي</option>
        <option value="service">خدمة برمجية — طلب عرض سعر</option>
      </select>
      <small>{isService ? "يعبّئ العميل متطلبات مشروعه، ثم يتواصل معك عبر واتساب لتأكيد التفاصيل." : "اشتراك بسعر ثابت، مع مدة ووقت تفعيل وإمكانية إضافته للسلة."}</small>
    </label>
    <label>القسم<select name="category_slug" defaultValue={product?.categorySlug ?? ""} required>
      <option value="">اختر القسم</option>{categories.map(category => <option key={category.slug} value={category.slug}>{category.name}</option>)}
    </select></label>
    {isService && <label>مجال الخدمة<select name="service_type" defaultValue={product?.service?.type ?? "website"}>
      {Object.entries(serviceTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </select><small>يحدد الأسئلة التي تظهر للعميل في نموذج الطلب.</small></label>}
    {isService && <label>طريقة التسعير<select name="pricing_mode" value={pricing} onChange={event => setPricing(event.target.value as ServiceDetails["pricing"])}>
      <option value="quote">حسب الطلب — بعد مراجعة المتطلبات</option>
      <option value="starting">يبدأ من — سعر مبدئي</option>
      <option value="fixed">سعر ثابت — لنطاق العمل المذكور</option>
    </select></label>}
    {(!isService || pricing !== "quote") && <label>{isService && pricing === "starting" ? "السعر المبدئي بالدولار" : "السعر بالدولار"}
      <input name="price" type="number" min="0" max="99999999" step="0.01" required defaultValue={product?.price} placeholder="0.00" />
    </label>}
    {!isService && <label>مدة الاشتراك<input name="duration" required maxLength={200} defaultValue={product?.duration} placeholder="مثال: شهر كامل" /></label>}
    <label key={`delivery-${kind}`}>{isService ? "مدة التنفيذ التقديرية" : "وقت التفعيل"}
      <input name="delivery" required maxLength={200} defaultValue={Boolean(product?.service) === isService ? product?.delivery : ""} placeholder={isService ? "مثال: حسب نطاق المشروع، أو من 7 إلى 14 يوم عمل" : "مدة التفعيل الفعلية"} />
    </label>
    {!isService && <label className="full">نوع الحساب أو الخدمة<input name="account_type" required maxLength={200} defaultValue={product?.service ? "" : product?.accountType} placeholder="مثال: حساب شخصي" /></label>}
    <label className="full">{isService ? "وصف الخدمة" : "وصف المنتج"}
      <textarea name="note" rows={4} maxLength={6000} required={isService} defaultValue={product?.note} placeholder={isService ? "اشرح لمن تناسب الخدمة وما الذي تساعد العميل على إنجازه." : undefined} />
    </label>
    {isService && <>
      <label className="full">ما يشمله التسليم<textarea name="service_includes" required rows={5} maxLength={4000} defaultValue={product?.service?.includes.join("\n")} placeholder={"مثال: تصميم متجاوب مع الموبايل\nلوحة تحكم لإدارة المحتوى\nتسليم الكود المصدري"} /><small>اكتب فقط ما تقدّمه فعلياً، كل بند في سطر. حتى 20 بنداً، و200 حرف لكل بند.</small></label>
      <label className="full">غير مشمول / تكاليف إضافية (اختياري)<textarea name="service_excludes" rows={3} maxLength={4000} defaultValue={product?.service?.excludes.join("\n")} placeholder={"مثال: رسوم الدومين والاستضافة\nرسوم بوابة الدفع أو المتاجر"} /><small>كل بند في سطر. حتى 20 بنداً، و200 حرف لكل بند.</small></label>
      <label className="full">الدعم والتعديلات (اختياري)<textarea name="service_support" rows={3} maxLength={1000} defaultValue={product?.service?.support} placeholder="وضح مدة الدعم وعدد جولات التعديل وما يشمله الاتفاق." /></label>
      <label className="full">رابط نموذج أو عمل سابق (اختياري)<input name="portfolio_url" type="url" dir="ltr" maxLength={500} defaultValue={product?.service?.portfolioUrl} placeholder="https://example.com" /><small>رابط عام يستطيع العميل معاينته.</small></label>
    </>}
    <label className="check full"><input type="checkbox" name="featured" defaultChecked={product?.featured} /><span>تمييز المنتج<small>إظهاره ضمن مختارات الصفحة الرئيسية.</small></span></label>
    {!categories.length && <p className="form-error full">أضف قسماً أولاً قبل إنشاء المنتج.</p>}
  </>;
}
