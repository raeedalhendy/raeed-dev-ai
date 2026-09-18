import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "../../_lib/auth";
import { getAnalytics } from "../../_lib/analytics";

export const dynamic = "force-dynamic";
const periods = [["today", "اليوم"], ["7", "آخر ٧ أيام"], ["30", "آخر ٣٠ يوم"], ["all", "كل الوقت"]];
const number = (value: unknown) => Number(value).toLocaleString("ar-SY");

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  if (!await isAdmin()) redirect("/login");
  const requested = (await searchParams).period;
  const period = periods.some(([key]) => key === requested) ? requested! : "30";
  let data;
  try { data = await getAnalytics(period); } catch {
    return <section className="panel"><h1>إحصائيات الزيارات</h1><p>تعذّر تحميل الإحصائيات. تحقق من اتصال قاعدة البيانات وصلاحية إنشاء جدول الإحصائيات، ثم أعد المحاولة.</p><Link className="secondary" href="/dashboard/analytics">إعادة المحاولة</Link></section>;
  }
  return <>
    <div className="admin-heading"><div><p className="eyebrow">تابع نتائج إعلانك</p><h1>إحصائيات الزيارات</h1><p>تبدأ البيانات من تفعيل التتبع. التوقيت: دمشق.</p></div><Link className="secondary" href={`/dashboard/analytics?period=${period}`}>تحديث الإحصائيات</Link></div>
    <nav className="analytics-filters" aria-label="الفترة الزمنية">{periods.map(([key, label]) => <Link className={key === period ? "primary" : "secondary"} aria-current={key === period ? "page" : undefined} href={`/dashboard/analytics?period=${key}`} key={key}>{label}</Link>)}</nav>
    <div className="stats">{[[data.summary.visits, "زيارات الموقع"], [data.summary.views, "مشاهدات الصفحات"], [data.summary.product_views, "مشاهدات المنتجات"]].map(([value, label]) => <div className="panel stat" key={String(label)}><span>{label}</span><strong>{number(value)}</strong></div>)}</div>
    <p className="analytics-note">الزيارة جلسة تصفح ضمن التبويب، وتنتهي بعد ٣٠ دقيقة دون فتح صفحة. تحديث الصفحة يزيد المشاهدات. عدد الزيارات ليس عدد أشخاص فريدين. تُستبعد زيارات المدير المسجّل دخوله والروبوتات المعروفة.</p>
    {!data.summary.views && <p className="panel analytics-section">لم تُسجّل زيارات بهذه الفترة بعد. جرّب فتح المتجر بنافذة خاصة وأنت غير مسجّل كمدير، ثم حدّث الإحصائيات.</p>}
    <section className="panel manager analytics-section"><div className="toolbar"><h2>زيارات كل منتج</h2></div><div className="table-scroll"><table><thead><tr><th>المنتج</th><th>المشاهدات</th><th>جلسات الزيارة</th></tr></thead><tbody>{data.products.map(p => <tr key={p.slug}><td>{p.name}{!p.active && " (غير منشور)"}</td><td>{number(p.views)}</td><td>{number(p.visits)}</td></tr>)}</tbody></table></div>{!data.products.length && <p className="empty">لا توجد منتجات بعد.</p>}</section>
    <section className="panel manager analytics-section"><div className="toolbar"><h2>مصادر الزيارات والحملات</h2></div><div className="table-scroll"><table><thead><tr><th>المصدر</th><th>الحملة</th><th>جلسات الزيارة</th></tr></thead><tbody>{data.sources.map((s, i) => <tr key={i}><td dir="auto">{s.source || "مباشر / غير معروف"}</td><td dir="auto">{s.campaign || "—"}</td><td>{number(s.visits)}</td></tr>)}</tbody></table></div><p className="analytics-note">أضف لرابط إعلانك <code dir="ltr">?utm_source=facebook&amp;utm_campaign=launch</code> حتى تميّز زياراته. يظهر مصدر بداية الجلسة، وأعلى ٥٠ مصدر وحملة.</p></section>
    <section className="panel manager analytics-section"><div className="toolbar"><h2>الزيارات اليومية</h2></div><div className="table-scroll"><table><thead><tr><th>اليوم</th><th>جلسات الزيارة</th><th>مشاهدات الصفحات</th></tr></thead><tbody>{data.daily.map(d => <tr key={d.day}><td>{d.day}</td><td>{number(d.visits)}</td><td>{number(d.views)}</td></tr>)}</tbody></table></div><p className="analytics-note">آخر ٣٠ يوماً فيها نشاط ضمن الفترة المحددة. الجلسة التي تمتد ليومين تظهر في كليهما.</p></section>
  </>;
}
