import "server-only";
import { sql } from "./db";
import type { Category, Product, ServiceDetails } from "./catalog";

type DbCategory = {
  slug: string;
  name: string;
  description: string;
  parent_slug: string | null;
  glyph: string;
  color: string;
  image_url: string | null;
};

type DbProduct = {
  service_details?: ServiceDetails | null;
  image_url?: string | null;
  slug: string;
  name: string;
  category_slug: string;
  price_usd: string | number;
  note: string;
  glyph: string;
  color: string;
  duration: string;
  delivery: string;
  account_type: string;
  featured: boolean;
};

const category = (row: DbCategory): Category => ({
  slug: row.slug,
  name: row.name,
  description: row.description,
  parentSlug: row.parent_slug,
  glyph: row.glyph,
  color: row.color,
  imageUrl: row.image_url ?? undefined,
});

const product = (row: DbProduct): Product => ({
  service: row.service_details ?? undefined,
  slug: row.slug,
  name: row.name,
  categorySlug: row.category_slug,
  price: Number(row.price_usd),
  note: row.note,
  glyph: row.glyph,
  color: row.color,
  duration: row.duration,
  delivery: row.delivery,
  accountType: row.account_type,
  featured: row.featured,
  imageUrl: row.image_url ?? undefined,
});

export async function getExchangeRate() {
  const rates = await sql()`SELECT value FROM store_settings WHERE key='exchange_rate'`;
  const rate = Number(rates[0]?.value);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("Configure a valid exchange_rate in store_settings.");
  }
  return rate;
}

export async function getStorefront() {
  const db = sql();
  const [categories, products] = await Promise.all([
    db`SELECT slug,name,description,parent_slug,glyph,color,to_jsonb(categories)->>'image_url' AS image_url FROM categories WHERE active=true ORDER BY name`,
    db`SELECT slug,name,category_slug,price_usd,note,glyph,color,duration,delivery,account_type,featured,to_jsonb(products)->>'image_url' AS image_url,to_jsonb(products)->'service_details' AS service_details FROM products WHERE active=true ORDER BY featured DESC,created_at DESC`,
  ]);
  return {
    categories: (categories as DbCategory[]).map(category),
    products: (products as DbProduct[]).map(product),
  };
}
