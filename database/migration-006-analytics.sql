CREATE TABLE IF NOT EXISTS analytics_views (
  event_id UUID PRIMARY KEY,
  session_id UUID NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('home','product','category')),
  slug TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '',
  campaign TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analytics_views_created_idx ON analytics_views(created_at);
CREATE INDEX IF NOT EXISTS analytics_views_product_idx ON analytics_views(slug,created_at) WHERE kind='product';
