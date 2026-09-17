import test from "node:test";
import assert from "node:assert/strict";
import { parseProductDetails, ProductValidationError, priceLabel, compareProductPrices, buildProjectInquiry } from "../app/_lib/services.ts";
import { parseCart } from "../app/_lib/cart.ts";

function serviceForm(overrides = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    product_type: "service", service_type: "website", pricing_mode: "quote",
    delivery: "حسب نطاق المشروع", note: "تصميم وبرمجة موقع لشركتك",
    service_includes: "تصميم متجاوب\r\nلوحة تحكم", service_excludes: "الاستضافة",
    ...overrides,
  })) form.set(key, value);
  return form;
}

const subscription = {
  slug: "monthly-tool", name: "Monthly tool", categorySlug: "ai", price: 20,
  duration: "شهر", delivery: "15 دقيقة", accountType: "حساب شخصي", note: "",
  glyph: "✦", color: "",
};
const serviceProduct = (overrides = {}) => ({ ...subscription, slug: "website", name: "تصميم مواقع", ...parseProductDetails(serviceForm(overrides)) });

test("legacy subscriptions keep fixed pricing and require subscription details", () => {
  const form = new FormData();
  for (const [key, value] of Object.entries({ price: "20", delivery: "15 دقيقة", duration: "شهر", account_type: "شخصي" })) form.set(key, value);
  const result = parseProductDetails(form);
  assert.equal(result.service, undefined);
  assert.equal(result.price, 20);
  assert.equal(result.duration, "شهر");
  form.delete("duration");
  assert.throws(() => parseProductDetails(form), ProductValidationError);
});

test("quote services need no price or subscription fields and normalize deliverables", () => {
  const product = serviceProduct();
  assert.equal(product.price, 0);
  assert.equal(product.duration, "");
  assert.equal(product.accountType, "تصميم وبرمجة مواقع");
  assert.deepEqual(product.service.includes, ["تصميم متجاوب", "لوحة تحكم"]);
  assert.equal(priceLabel(product), "حسب الطلب");
});

test("fixed and starting prices are labelled correctly", () => {
  assert.equal(priceLabel(serviceProduct({ pricing_mode: "starting", price: "150.50" })), "يبدأ من $150.5");
  assert.equal(priceLabel(serviceProduct({ pricing_mode: "fixed", price: "150" })), "$150");
  assert.equal(priceLabel(subscription), "$20");
});

test("all service categories round-trip through JSON storage", () => {
  for (const type of ["website", "application", "store"]) {
    const { service } = serviceProduct({ service_type: type, service_support: "جولة تعديلات", portfolio_url: "https://example.com/work" });
    assert.deepEqual(JSON.parse(JSON.stringify(service)), service);
    assert.equal(service.type, type);
  }
});

test("rejects invalid types, prices, missing scope and excessive text", () => {
  for (const overrides of [
    { product_type: "unknown" }, { service_type: "unknown" }, { pricing_mode: "unknown" },
    { pricing_mode: "fixed", price: "" }, { pricing_mode: "starting", price: "-1" },
    { pricing_mode: "fixed", price: "Infinity" }, { pricing_mode: "fixed", price: "1.234" },
    { pricing_mode: "fixed", price: "100000000" }, { note: "" }, { delivery: "" },
    { service_includes: "  \n " }, { service_includes: Array(21).fill("ميزة").join("\n") },
    { service_includes: "x".repeat(201) }, { service_support: "x".repeat(1001) },
  ]) assert.throws(() => serviceProduct(overrides), ProductValidationError);
});

test("portfolio links cannot execute scripts or embed credentials", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,hello", "https://user:pass@example.com", "not-a-url"]) {
    assert.throws(() => serviceProduct({ portfolio_url: url }), ProductValidationError);
  }
});

test("unpriced services sort last in both price directions", () => {
  const quote = serviceProduct(), starting = serviceProduct({ pricing_mode: "starting", price: "200" });
  assert.deepEqual([quote, starting, subscription].sort((a, b) => compareProductPrices(a, b, "low")), [subscription, starting, quote]);
  assert.deepEqual([quote, subscription, starting].sort((a, b) => compareProductPrices(a, b, "high")), [starting, subscription, quote]);
  assert.equal(compareProductPrices(quote, quote, "low"), 0);
});

test("services never enter the subscription cart, including fixed-price services", () => {
  const stored = JSON.stringify([subscription, serviceProduct(), serviceProduct({ pricing_mode: "fixed", price: "200" })]);
  assert.deepEqual(parseCart(stored), [subscription]);
  assert.deepEqual(parseCart("not json"), []);
});

test("inquiry includes service-specific answers and correctly encoded Arabic", () => {
  for (const [type, key, answer] of [["website", "pages", "من 2 إلى 5 صفحات"], ["application", "platform", "Android وiPhone"], ["store", "delivery", "تسليم آلي"]]) {
    const form = new FormData();
    form.set("name", "رائد"); form.set("idea", "أحتاج مشروعاً لإدارة منتجاتي وطلباتي");
    form.set(key, answer); form.set("budget", "500 دولار");
    const product = serviceProduct({ service_type: type });
    const text = buildProjectInquiry(product, form, "https://example.com/products/website");
    assert.ok(text.includes(answer));
    assert.ok(text.includes("500 دولار"));
    assert.ok(text.includes("حسب الطلب"));
    assert.ok(!text.includes("$0"));
    assert.ok(!text.includes("الموعد المطلوب:"));
    const url = new URL(`https://wa.me/963969477454?text=${encodeURIComponent(text)}`);
    assert.equal(url.searchParams.get("text"), text);
  }
});

test("inquiries require a name and meaningful project description", () => {
  const form = new FormData();
  assert.throws(() => buildProjectInquiry(serviceProduct(), form, "https://example.com"));
  form.set("name", "رائد"); form.set("idea", "قصير");
  assert.throws(() => buildProjectInquiry(serviceProduct(), form, "https://example.com"));
});
