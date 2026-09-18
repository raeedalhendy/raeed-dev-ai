import "server-only";
import { sql } from "./db";

let ready: Promise<void> | undefined;
export function ensureAnalytics() {
  return ready ??= (async () => {
    const db = sql();
    await db.transaction([
      db`CREATE TABLE IF NOT EXISTS analytics_views (
        event_id UUID PRIMARY KEY, session_id UUID NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('home','product','category')),
        slug TEXT NOT NULL, source TEXT NOT NULL DEFAULT '', campaign TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`,
      db`CREATE INDEX IF NOT EXISTS analytics_views_created_idx ON analytics_views(created_at)`,
      db`CREATE INDEX IF NOT EXISTS analytics_views_product_idx ON analytics_views(slug,created_at) WHERE kind='product'`,
    ]);
  })().catch(error => { ready = undefined; throw error; });
}

export async function getAnalytics(period: string) {
  await ensureAnalytics();
  const db = sql();
  const days = period === "today" ? 1 : period === "7" ? 7 : period === "all" ? null : 30;
  const start = days === null ? "1970-01-01" : undefined;
  // Calendar days in the store's timezone, including today.
  const since = start ?? (await db`SELECT ((now() AT TIME ZONE 'Asia/Damascus')::date - (${days}::int - 1)) AT TIME ZONE 'Asia/Damascus' AS value`)[0].value;
  const [summary, products, sources, daily] = await Promise.all([
    db`SELECT count(*)::int AS views, count(DISTINCT session_id)::int AS visits,
      count(*) FILTER (WHERE kind='product')::int AS product_views FROM analytics_views WHERE created_at >= ${since}`,
    db`SELECT p.slug,p.name,p.active,count(v.event_id)::int AS views,count(DISTINCT v.session_id)::int AS visits
      FROM products p LEFT JOIN analytics_views v ON v.kind='product' AND v.slug=p.slug AND v.created_at >= ${since}
      GROUP BY p.slug,p.name,p.active ORDER BY views DESC,p.name`,
    db`SELECT source,campaign,count(DISTINCT session_id)::int AS visits FROM analytics_views
      WHERE created_at >= ${since} GROUP BY source,campaign ORDER BY visits DESC LIMIT 50`,
    db`SELECT (created_at AT TIME ZONE 'Asia/Damascus')::date::text AS day,
      count(*)::int AS views,count(DISTINCT session_id)::int AS visits FROM analytics_views
      WHERE created_at >= ${since} GROUP BY day ORDER BY day DESC LIMIT 30`,
  ]);
  return { summary: summary[0], products, sources, daily };
}
