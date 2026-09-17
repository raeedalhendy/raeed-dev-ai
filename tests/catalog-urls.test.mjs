import test from "node:test";
import assert from "node:assert/strict";
import { slugify, availableSlug, catalogPath, findByUrl } from "../app/_lib/catalog-urls.ts";

test("generates readable Arabic and English URLs without manual punctuation", () => {
  assert.equal(slugify("  ChatGPT Go + Plus  "), "chatgpt-go-plus");
  assert.equal(slugify("متجر إلكتروني"), "متجر-الكتروني");
  assert.equal(slugify("تَصْمِيم مَوَاقِع"), "تصميم-مواقع");
  assert.equal(slugify("خطة ١٢ / ۳"), "خطة-12-3");
  assert.equal(slugify("Café"), "cafe");
});

test("URL slugs cannot contain path separators, query strings or HTML", () => {
  for (const text of ["../../admin", "hello?x=1#test", '<script>alert(1)</script>', "💻🔥", "a\u202eb"]) {
    assert.match(slugify(text), /^[\p{L}\p{N}-]*$/u);
  }
  assert.equal(slugify("x".repeat(120)).length, 100);
  assert.ok(!slugify(`${"x".repeat(99)} y`).endsWith("-"));
});

test("automatic duplicates get a predictable unused suffix", () => {
  assert.equal(availableSlug("store", []), "store");
  assert.equal(availableSlug("store", ["store", "store-2", "store-3"]), "store-4");
  assert.equal(availableSlug("متجر", ["متجر"]), "متجر-2");
  const long = "a".repeat(100);
  assert.equal(availableSlug(long, [long]).length, 100);
});

test("public URLs change independently of internal product and category identities", () => {
  const category = { slug: "legacy-category", urlSlug: "development" };
  const product = { slug: "go21913491841", urlSlug: "ecommerce-store", categorySlug: category.slug };
  assert.equal(catalogPath("product", product), "/products/ecommerce-store");
  assert.equal(catalogPath("category", category), "/categories/development");
  assert.equal(product.categorySlug, category.slug);
  assert.equal(findByUrl([product], "go21913491841"), product);
  assert.equal(findByUrl([product], "ecommerce-store"), product);
  assert.equal(findByUrl([product], "missing"), undefined);
});

test("legacy data still works before migration and Arabic URL segments are encoded once", () => {
  assert.equal(catalogPath("product", { slug: "original" }), "/products/original");
  const item = { slug: "old", urlSlug: "تصميم-مواقع" };
  assert.equal(decodeURIComponent(catalogPath("category", item)), "/categories/تصميم-مواقع");
  assert.equal(findByUrl([item], "تصميم-مواقع"), item);
});
