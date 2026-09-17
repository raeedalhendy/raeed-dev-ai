import Link from "next/link";
import { adminData } from "./data";
import { priceLabel } from "../_lib/services";
export default async function Page() {
  const { categories, products } = await adminData();
  return <><div className="admin-heading"><div><p className="eyebrow">مساحة العمل</p><h1>كل شيء تحت سيطرتك.</h1><p>نظرة سريعة على متجرك، وخطوتك القادمة من هنا.</p></div><Link className="primary" href="/dashboard/products/new">＋ إضافة منتج</Link></div>
    <div className="stats">{[[products.length,"منتجات منشورة","/dashboard/products"],[categories.length,"أقسام المتجر","/dashboard/categories"],[products.filter(p=>p.featured).length,"منتجات مميزة","/dashboard/products"]].map(([n,l,url])=><Link href={String(url)} className="panel stat" key={l}><span>{l}</span><strong>{n}</strong><small>عرض وإدارة ←</small></Link>)}</div>
    <div className="overview-grid"><section className="panel"><div className="section-title"><h2>آخر المنتجات</h2><Link href="/dashboard/products">عرض الكل ←</Link></div>{products.length ? products.slice(0,5).map(p=><div className="recent" key={p.slug}><span className="tile">{p.glyph}</span><div><b>{p.name}</b><p>{categories.find(c=>c.slug===p.categorySlug)?.name}</p></div><strong dir="auto">{priceLabel(p)}</strong></div>):<div className="empty">متجرك جاهز لأول منتج.<br/><Link href="/dashboard/products/new">أضف منتجك الأول ←</Link></div>}</section><section className="panel quick"><span className="eyebrow">ابدأ من هنا</span><h2>متجر مرتّب،<br/>تجربة أوضح.</h2><p>نظّم أقسامك، أضف صورها، ثم وزّع منتجاتك ضمن القسم المناسب.</p><Link href="/dashboard/categories/new">إنشاء قسم جديد ←</Link><Link href="/dashboard/settings">إعداد سعر الصرف ←</Link><small>الطلبات والتواصل مع العملاء عبر واتساب.</small></section></div></>;
}
