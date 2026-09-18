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

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  url_slug TEXT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  parent_slug TEXT REFERENCES categories(slug) ON DELETE SET NULL,
  glyph TEXT NOT NULL,
  color TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  url_slug TEXT,
  name TEXT NOT NULL,
  category_slug TEXT NOT NULL REFERENCES categories(slug),
  price_usd NUMERIC(10,2) NOT NULL CHECK (price_usd >= 0),
  note TEXT NOT NULL,
  glyph TEXT NOT NULL,
  color TEXT NOT NULL,
  duration TEXT NOT NULL,
  delivery TEXT NOT NULL,
  account_type TEXT NOT NULL,
  service_details JSONB,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog_urls (
  kind TEXT NOT NULL CHECK(kind IN ('product','category')),
  slug TEXT NOT NULL,
  entity_slug TEXT NOT NULL,
  PRIMARY KEY(kind,slug)
);

CREATE TABLE IF NOT EXISTS store_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  items JSONB NOT NULL,
  total_usd NUMERIC(10,2) NOT NULL CHECK (total_usd >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO categories (slug, name, description, parent_slug, glyph, color) VALUES
  ('ai', 'ذكاء اصطناعي', 'أدوات تولّد وتساعد وتنجز.', NULL, '✦', 'from-[#1040ff] to-[#6e82ff]'),
  ('entertainment', 'ترفيه', 'كل ما تحب مشاهدته وسماعه.', NULL, '▶', 'from-[#171717] to-[#555]'),
  ('work', 'إنتاجية', 'مساحة عملك، بشكل أذكى.', NULL, '↗', 'from-[#0768e6] to-[#35a8ff]'),
  ('design', 'تصميم', 'أدوات تصنع أفكارك بصرياً.', NULL, '◒', 'from-[#04a9a7] to-[#54d7f0]'),
  ('ai-assistants', 'مساعدات ذكية', 'مساعدون لإنجاز كل شيء أسرع.', 'ai', '✦', 'from-[#3026a5] to-[#8c7cff]'),
  ('video', 'مشاهدة', 'أفضل محتوى على شاشتك.', 'entertainment', '▻', 'from-[#9b1010] to-[#ef4343]')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, category_slug, price_usd, note, glyph, color, duration, delivery, account_type, featured) VALUES
  ('chatgpt-plus', 'ChatGPT Plus', 'ai-assistants', 20, 'اشتراك شخصي لمدة شهر كامل.', '✦', 'from-[#1040ff] to-[#6e82ff]', 'شهر كامل', 'خلال 15 دقيقة', 'حساب شخصي', true),
  ('netflix-premium', 'Netflix Premium', 'video', 8, 'جودة 4K ودعم حتى 4 شاشات.', 'N', 'from-[#171717] to-[#5b0000]', 'شهر كامل', 'خلال 15 دقيقة', 'تفعيل مضمون', true),
  ('microsoft-365', 'Microsoft 365', 'work', 12, 'تطبيقات أوفيس الكاملة لمساحة عملك.', 'M', 'from-[#0768e6] to-[#35a8ff]', 'شهر كامل', 'خلال 15 دقيقة', 'حساب شخصي', false),
  ('canva-pro', 'Canva Pro', 'design', 7, 'تصميم بلا حدود، لمدة شهر.', 'C', 'from-[#04a9a7] to-[#54d7f0]', 'شهر كامل', 'خلال 15 دقيقة', 'دعوة رسمية', false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO store_settings (key, value) VALUES ('exchange_rate', '1350')
ON CONFLICT (key) DO NOTHING;

INSERT INTO catalog_urls(kind,slug,entity_slug)
  SELECT 'product',slug,slug FROM products
  UNION ALL SELECT 'category',slug,slug FROM categories
  ON CONFLICT(kind,slug) DO NOTHING;
