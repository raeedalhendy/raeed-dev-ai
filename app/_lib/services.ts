import type { Product, ServiceDetails } from "./catalog";

export const serviceTypes = {
  website: "تصميم وبرمجة مواقع",
  application: "تطوير تطبيقات",
  store: "متاجر اشتراكات وألعاب",
} as const;

type RequestField = { name: string; label: string; options: readonly string[] };
export const requestFields: Record<ServiceDetails["type"], readonly RequestField[]> = {
  website: [
    { name: "website_type", label: "نوع الموقع", options: ["موقع تعريفي", "موقع شركة", "منصة خدمات", "فكرة أخرى"] },
    { name: "pages", label: "عدد الصفحات التقريبي", options: ["صفحة واحدة", "من 2 إلى 5 صفحات", "من 6 إلى 10 صفحات", "أكثر من 10 صفحات"] },
    { name: "dashboard", label: "لوحة تحكم لإدارة المحتوى", options: ["أحتاج لوحة تحكم", "لا أحتاج"] },
    { name: "payment", label: "دفع إلكتروني", options: ["أحتاج دفعاً إلكترونياً", "لا أحتاج"] },
  ],
  application: [
    { name: "platform", label: "الأجهزة المستهدفة", options: ["Android", "iPhone", "Android وiPhone", "تطبيق ويب"] },
    { name: "accounts", label: "حسابات المستخدمين", options: ["أحتاج تسجيل دخول", "لا أحتاج"] },
    { name: "dashboard", label: "لوحة تحكم لإدارة التطبيق", options: ["أحتاج لوحة تحكم", "لا أحتاج"] },
  ],
  store: [
    { name: "products", label: "المنتجات التي ستبيعها", options: ["اشتراكات رقمية", "بطاقات وشحن ألعاب", "اشتراكات وألعاب", "منتجات أخرى"] },
    { name: "delivery", label: "طريقة تسليم الطلبات", options: ["يدوي عبر واتساب", "تسليم آلي", "يدوي وآلي"] },
    { name: "payment", label: "طريقة تحصيل الدفع", options: ["تحويل يدوي", "بوابة دفع إلكتروني", "تحويل يدوي وبوابة دفع"] },
  ],
};

export function priceLabel(product: Product): string {
  if (product.service?.pricing === "quote") return "حسب الطلب";
  return `${product.service?.pricing === "starting" ? "يبدأ من " : ""}$${product.price}`;
}

export function compareProductPrices(a: Product, b: Product, order: "low" | "high") {
  const aQuote = a.service?.pricing === "quote";
  const bQuote = b.service?.pricing === "quote";
  // Unpriced projects belong at the end in both directions, never among free items.
  if (aQuote || bQuote) return Number(aQuote) - Number(bQuote);
  return order === "low" ? a.price - b.price : b.price - a.price;
}

export class ProductValidationError extends Error {}

export function parseProductDetails(form: FormData) {
  const value = (name: string, max = 200) => {
    const result = String(form.get(name) ?? "").trim();
    if (result.length > max) throw new ProductValidationError("أحد الحقول أطول من الحد المسموح. اختصر النص وحاول مجدداً.");
    return result;
  };
  const kind = value("product_type") || "subscription";
  if (kind !== "subscription" && kind !== "service") throw new ProductValidationError("اختر نوع منتج صالحاً.");
  const pricing = kind === "service" ? value("pricing_mode") : "fixed";
  if (!["fixed", "starting", "quote"].includes(pricing)) throw new ProductValidationError("اختر طريقة تسعير صالحة.");
  const rawPrice = pricing === "quote" ? "0" : value("price");
  const price = Number(rawPrice);
  if (!rawPrice || !Number.isFinite(price) || price < 0 || price > 99999999 || Math.abs(price * 100 - Math.round(price * 100)) > 0.00001) {
    throw new ProductValidationError("أدخل سعراً صالحاً بدقتين عشريتين كحد أقصى.");
  }
  const note = value("note", 6000);
  const delivery = value("delivery");
  if (!delivery) throw new ProductValidationError(kind === "service" ? "أدخل مدة التنفيذ التقديرية أو اكتب: حسب نطاق المشروع." : "أدخل وقت التفعيل.");
  if (kind === "subscription") {
    const duration = value("duration"), accountType = value("account_type");
    if (!duration || !accountType) throw new ProductValidationError("أدخل مدة الاشتراك ونوع الحساب.");
    return { price, note, delivery, duration, accountType, service: undefined };
  }
  const type = value("service_type");
  if (type !== "website" && type !== "application" && type !== "store") throw new ProductValidationError("اختر مجال الخدمة.");
  if (!note) throw new ProductValidationError("أضف وصفاً يوضح الخدمة للعميل.");
  const lines = (name: string) => {
    const entries = value(name, 4000).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (entries.length > 20 || entries.some(line => line.length > 200)) throw new ProductValidationError("اكتب حتى 20 بنداً، بحد أقصى 200 حرف لكل بند.");
    return entries;
  };
  const includes = lines("service_includes");
  if (!includes.length) throw new ProductValidationError("أضف بنداً واحداً على الأقل يوضح ما يشمله تسليم الخدمة.");
  const portfolioUrl = value("portfolio_url", 500);
  if (portfolioUrl) {
    let url: URL;
    try { url = new URL(portfolioUrl); } catch { throw new ProductValidationError("أدخل رابط عمل سابق صحيحاً يبدأ بـ https:// أو http://."); }
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new ProductValidationError("استخدم رابط عمل سابق عادياً يبدأ بـ https:// أو http://.");
  }
  const service: ServiceDetails = {
    type, pricing: pricing as ServiceDetails["pricing"], includes,
    excludes: lines("service_excludes"), support: value("service_support", 1000), portfolioUrl,
  };
  return { price, note, delivery, duration: "", accountType: serviceTypes[type], service };
}

export function buildProjectInquiry(product: Product, form: FormData, pageUrl: string) {
  if (!product.service) throw new Error("This product is not a project service.");
  const value = (key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);
  const name = value("name", 100), idea = value("idea", 1500);
  if (!name || idea.length < 10) throw new Error("أدخل اسمك ووصفاً للفكرة من 10 أحرف على الأقل.");
  const details = requestFields[product.service.type].map(field => {
    const answer = value(field.name, 100);
    return `${field.label}: ${field.options.includes(answer) ? answer : "أحتاج مساعدتكم في الاختيار"}`;
  });
  const optional = [
    ["languages", "اللغات المطلوبة", 100],
    ["budget", "الميزانية التقريبية", 100],
    ["deadline", "الموعد المطلوب", 100],
    ["reference", "موقع أو تطبيق مشابه", 300],
  ] as const;
  return [
    `مرحباً، أريد عرض سعر لخدمة: ${product.name}`,
    `رابط الخدمة: ${pageUrl}`,
    `السعر المعروض: ${priceLabel(product)}`,
    `الاسم: ${name}`, `فكرة المشروع والميزات المطلوبة: ${idea}`,
    ...details,
    ...optional.flatMap(([key, label, max]) => value(key, max) ? [`${label}: ${value(key, max)}`] : []),
    "أرجو تأكيد نطاق العمل والتكلفة ومدة التنفيذ قبل البدء.",
  ].join("\n");
}
