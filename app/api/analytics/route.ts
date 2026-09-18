import { isAdmin } from "../../_lib/auth";
import { ensureAnalytics } from "../../_lib/analytics";
import { parseVisit } from "../../_lib/analytics-input";
import { sql } from "../../_lib/db";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return new Response(null, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return new Response(null, { status: 415 });
  if (/bot|crawler|spider|headless|preview/i.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });
  try {
    if (await isAdmin()) return new Response(null, { status: 204 });
    // Limit the body while streaming rather than trusting Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return new Response(null, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) { await reader.cancel(); return new Response(null, { status: 413 }); }
      chunks.push(value);
    }
    let input: unknown;
    try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return new Response(null, { status: 400 }); }
    const visit = parseVisit(input);
    if (!visit) return new Response(null, { status: 400 });
    const db = sql();
    if (visit.kind !== "home") {
      const rows = visit.kind === "product"
        ? await db`SELECT slug FROM products WHERE slug=${visit.slug} AND active=true`
        : await db`SELECT slug FROM categories WHERE slug=${visit.slug} AND active=true`;
      if (!rows.length) return new Response(null, { status: 400 });
    }
    await ensureAnalytics();
    await db`INSERT INTO analytics_views(event_id,session_id,kind,slug,source,campaign)
      VALUES (${visit.eventId},${visit.sessionId},${visit.kind},${visit.slug},${visit.source},${visit.campaign})
      ON CONFLICT(event_id) DO NOTHING`;
    return new Response(null, { status: 204 });
  } catch {
    console.error("Analytics recording failed; check database configuration and analytics migration.");
    return new Response(null, { status: 503 });
  }
}
