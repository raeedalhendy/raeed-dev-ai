export type CatalogKind = "product" | "category";
type LinkedItem = { slug: string; urlSlug?: string };

export function slugify(value: string) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").replace(/ـ/g, "")
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x6f0))
    .toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "").slice(0, 100).replace(/-+$/g, "");
}

export function availableSlug(base: string, reserved: readonly string[]) {
  const used = new Set(reserved);
  if (!used.has(base)) return base;
  for (let suffix = 2; ; suffix++) {
    const ending = `-${suffix}`;
    const candidate = `${base.slice(0, 100 - ending.length).replace(/-+$/g, "")}${ending}`;
    if (!used.has(candidate)) return candidate;
  }
}

export function catalogPath(kind: CatalogKind, item: LinkedItem) {
  return `/${kind === "product" ? "products" : "categories"}/${encodeURIComponent(item.urlSlug || item.slug)}`;
}

export function findByUrl<T extends LinkedItem>(items: readonly T[], slug: string): T | undefined {
  return items.find(item => (item.urlSlug || item.slug) === slug || item.slug === slug);
}
