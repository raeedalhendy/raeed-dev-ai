-- Add editable public URLs without changing internal slugs or foreign keys.
-- The dashboard runs this upgrade automatically on the first catalog save.
BEGIN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS url_slug TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS url_slug TEXT;
CREATE TABLE IF NOT EXISTS catalog_urls (
  kind TEXT NOT NULL CHECK(kind IN ('product','category')),
  slug TEXT NOT NULL,
  entity_slug TEXT NOT NULL,
  PRIMARY KEY(kind,slug)
);
INSERT INTO catalog_urls(kind,slug,entity_slug)
  SELECT 'product',slug,slug FROM products
  UNION ALL SELECT 'category',slug,slug FROM categories
  ON CONFLICT(kind,slug) DO NOTHING;
INSERT INTO catalog_urls(kind,slug,entity_slug)
  SELECT 'product',url_slug,slug FROM products WHERE url_slug IS NOT NULL
  UNION ALL SELECT 'category',url_slug,slug FROM categories WHERE url_slug IS NOT NULL
  ON CONFLICT(kind,slug) DO NOTHING;
COMMIT;
