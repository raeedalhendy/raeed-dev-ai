export type Visit = { eventId: string; sessionId: string; kind: "home" | "product" | "category"; slug: string; source: string; campaign: string };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function parseVisit(value: unknown): Visit | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (typeof v.eventId !== "string" || !uuid.test(v.eventId) || typeof v.sessionId !== "string" || !uuid.test(v.sessionId)) return null;
  if (v.kind !== "home" && v.kind !== "product" && v.kind !== "category") return null;
  if (typeof v.slug !== "string" || v.slug.length > 200 || (v.kind === "home" ? v.slug !== "" : !v.slug)) return null;
  if (typeof v.source !== "string" || typeof v.campaign !== "string" || v.source.length > 100 || v.campaign.length > 100) return null;
  return { eventId: v.eventId, sessionId: v.sessionId, kind: v.kind, slug: v.slug, source: v.source, campaign: v.campaign };
}
