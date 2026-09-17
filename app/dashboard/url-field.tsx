"use client";

import { useState } from "react";
import { catalogPath, slugify, type CatalogKind } from "../_lib/catalog-urls";

export function UrlField({ kind, name, item }: { kind: CatalogKind; name: string; item?: { slug: string; urlSlug?: string } }) {
  const [custom, setCustom] = useState<string | null>(item ? item.urlSlug || item.slug : null);
  const [notice, setNotice] = useState("");
  const value = custom ?? slugify(name);
  const preview = catalogPath(kind, { slug: slugify(value) || kind });
  async function copy() {
    try { await navigator.clipboard.writeText(`${window.location.origin}${preview}`); setNotice("تم نسخ معاينة الرابط. احفظ التغييرات لاعتماده."); }
    catch { setNotice("تعذّر النسخ تلقائياً. يمكنك تحديد الرابط ونسخه من المعاينة."); }
  }
  return <div className="full url-editor">
    {item && <input type="hidden" name="slug" value={item.slug} />}
    <input type="hidden" name="url_mode" value={custom === null ? "auto" : "custom"} />
    <label>رابط الصفحة<input name="url_slug" dir="auto" value={value} maxLength={100} autoCapitalize="none" autoComplete="off" spellCheck={false} onChange={event => { setCustom(event.target.value); setNotice(""); }} onBlur={() => { if (custom !== null) setCustom(slugify(custom)); }} placeholder="يتولّد تلقائياً من الاسم" />
      <small>{item ? "يمكنك تغييره؛ الروابط السابقة ستبقى توصّل لنفس الصفحة." : "يتولّد من الاسم بالعربي أو الإنكليزي. يمكنك تركه تلقائياً أو كتابة رابط تختاره."}</small>
    </label>
    <div className="url-actions"><button type="button" className="secondary" onClick={() => { setCustom(null); setNotice(""); }}>توليد من الاسم</button><button type="button" className="secondary" onClick={copy}>نسخ الرابط</button></div>
    <p className="url-preview">معاينة الرابط بعد الحفظ: <bdi dir="ltr">{decodeURIComponent(preview)}</bdi></p>
    {custom === null && <p className="url-hint">إذا كان الاسم مستخدماً، نضيف رقماً تلقائياً مثل ‎-2. الرابط النهائي يظهر بعد الحفظ.</p>}
    {notice && <p className="url-hint" role="status">{notice}</p>}
  </div>;
}
