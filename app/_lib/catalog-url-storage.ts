import "server-only";
import { sql } from "./db";
import type { CatalogKind } from "./catalog-urls";

export async function ensureCatalogUrls() {
  const db = sql();
  const state = await db`SELECT to_regclass('catalog_urls') AS urls,
    EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='products' AND column_name='url_slug') AS products_ready,
    EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='categories' AND column_name='url_slug') AS categories_ready`;
  if (state[0]?.urls && state[0]?.products_ready && state[0]?.categories_ready) return;
  // A single transaction installs the columns and reserves every existing URL.
  // Internal slugs are immutable so category relationships and cart IDs survive renames.
  await db.transaction([
    db`ALTER TABLE products ADD COLUMN IF NOT EXISTS url_slug TEXT`,
    db`ALTER TABLE categories ADD COLUMN IF NOT EXISTS url_slug TEXT`,
    db`CREATE TABLE IF NOT EXISTS catalog_urls (
      kind TEXT NOT NULL CHECK(kind IN ('product','category')),
      slug TEXT NOT NULL,
      entity_slug TEXT NOT NULL,
      PRIMARY KEY(kind,slug)
    )`,
    db`INSERT INTO catalog_urls(kind,slug,entity_slug)
      SELECT 'product',slug,slug FROM products UNION ALL SELECT 'category',slug,slug FROM categories
      ON CONFLICT(kind,slug) DO NOTHING`,
    db`INSERT INTO catalog_urls(kind,slug,entity_slug)
      SELECT 'product',url_slug,slug FROM products WHERE url_slug IS NOT NULL
      UNION ALL SELECT 'category',url_slug,slug FROM categories WHERE url_slug IS NOT NULL
      ON CONFLICT(kind,slug) DO NOTHING`,
  ]);
}

export async function resolveCatalogAlias(kind: CatalogKind, slug: string) {
  const db = sql();
  const state = await db`SELECT to_regclass('catalog_urls') AS urls`;
  if (!state[0]?.urls) return undefined;
  const rows = await db`SELECT entity_slug FROM catalog_urls WHERE kind=${kind} AND slug=${slug}`;
  return rows[0]?.entity_slug as string | undefined;
}
