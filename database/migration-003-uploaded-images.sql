-- The authenticated image-save flow also creates these structures when needed.
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
CREATE TABLE IF NOT EXISTS store_images (
  id TEXT PRIMARY KEY,
  mime TEXT NOT NULL,
  data_base64 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
