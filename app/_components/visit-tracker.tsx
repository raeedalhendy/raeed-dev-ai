"use client";

import { useEffect } from "react";

const storageKey = "raeed-visit-session";
let memorySession: { id: string; last: number; source: string; campaign: string } | undefined;

export function VisitTracker({ kind, slug = "" }: { kind: "home" | "product" | "category"; slug?: string }) {
  useEffect(() => {
    // Defer until visible. Prefetches and hidden prerenders are not visits.
    let sent = false;
    const record = () => {
      if (sent || document.visibilityState !== "visible") return;
      sent = true;
      const now = Date.now();
      let session = memorySession;
      try { session = JSON.parse(sessionStorage.getItem(storageKey) || "null") ?? session; } catch { /* Storage may be disabled. */ }
      if (!session || typeof session.last !== "number" || now - session.last > 30 * 60 * 1000) {
        const params = new URLSearchParams(location.search);
        let referrer = "";
        try { const url = new URL(document.referrer); if (url.origin !== location.origin) referrer = url.hostname; } catch { /* Direct visit. */ }
        session = { id: crypto.randomUUID(), last: now, source: (params.get("utm_source") || referrer).slice(0, 100), campaign: (params.get("utm_campaign") || "").slice(0, 100) };
      }
      session.last = now;
      memorySession = session;
      try { sessionStorage.setItem(storageKey, JSON.stringify(session)); } catch { /* Use in-memory session. */ }
      const body = JSON.stringify({ eventId: crypto.randomUUID(), sessionId: session.id, kind, slug, source: session.source, campaign: session.campaign });
      void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    };
    // Cleanup cancels React Strict Mode's first effect pass.
    const timer = setTimeout(record, 0);
    document.addEventListener("visibilitychange", record);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", record); };
  }, [kind, slug]);
  return null;
}
