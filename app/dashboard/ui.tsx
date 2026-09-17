"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, useTransition } from "react";
import type { Category, Product } from "../_lib/catalog";
import { logout } from "../login/actions";
import { mutate } from "./actions";
import { ImageField } from "./image-field";
import { ProductFields } from "./product-fields";
import { priceLabel } from "../_lib/services";
import { UrlField } from "./url-field";
import { catalogPath } from "../_lib/catalog-urls";

type Kind = "category" | "product";
type Notice = { ok: boolean; message: string; id?: number };
const Notices = createContext<(notice: Notice) => void>(() => {});
const routes = [["/dashboard","نظرة عامة","◫"],["/dashboard/categories","الأقسام","▦"],["/dashboard/products","المنتجات","◇"],["/dashboard/settings","الإعدادات","⚙"]];
export function Shell({ children }: { children: React.ReactNode }) {
  const path=usePathname();
  const [notice,setNotice]=useState<Notice>();
  useEffect(()=>{if(!notice)return;const id=setTimeout(()=>setNotice(undefined),5500);return()=>clearTimeout(id);},[notice]);
  return <Notices.Provider value={n=>setNotice({...n,id:Date.now()})}><div className="admin">
    <aside className="admin-sidebar"><Link href="/dashboard" className="admin-brand"><Image src="/fornav.png" width={45} height={45} alt=""/><span>Raeed Dev<small>إدارة المتجر</small></span></Link><p className="nav-caption">مساحة الإدارة</p><nav>{routes.map(([href,label,icon])=><Link key={href} href={href} className={(href==="/dashboard"?path===href:path.startsWith(href))?"active":""}><span>{icon}</span>{label}</Link>)}</nav><div className="sidebar-bottom"><Link href="/">↗ زيارة المتجر</Link><form action={logout}><button>تسجيل الخروج ←</button></form></div></aside>
    <div className="admin-body"><header className="admin-top"><span>لوحة التحكم <span className="muted">/ {routes.find(([href])=>href!=="/dashboard"&&path.startsWith(href))?.[1]??"نظرة عامة"}</span></span><div className="admin-user"><span className="status-dot"/><span>مدير المتجر</span><b>RD</b><form className="mobile-logout" action={logout}><button aria-label="تسجيل الخروج">خروج</button></form></div></header><main className="admin-content">{children}</main><footer className="admin-footer">Raeed Dev <span>مساحة واحدة لإدارة تفاصيل متجرك.</span></footer></div>
    {notice&&<div className={`admin-toast ${notice.ok?"":"error"}`} role={notice.ok?"status":"alert"}><span>{notice.ok?"✓":"!"}</span>{notice.message}<button aria-label="إغلاق التنبيه" onClick={()=>setNotice(undefined)}>×</button></div>}
  </div></Notices.Provider>;
}

function Modal({title,children,close,busy=false}:{title:string;children:React.ReactNode;close:()=>void;busy?:boolean}){
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const dialog=ref.current;dialog?.showModal();const old=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{dialog?.close();document.body.style.overflow=old;};},[]);
  return <dialog ref={ref} className="admin-modal" aria-labelledby="modal-heading" onCancel={e=>{e.preventDefault();if(!busy)close();}} onClick={e=>{if(e.target===e.currentTarget&&!busy)close();}}><header><div><p className="eyebrow">إدارة المحتوى</p><h2 id="modal-heading">{title}</h2></div><button type="button" disabled={busy} aria-label="إغلاق" onClick={close}>×</button></header>{children}</dialog>;
}

export function Editor({kind,categories,item,onSaved,onCancel,onBusy}:{kind:Kind;categories:Category[];item?:Category|Product;onSaved?:()=>void;onCancel?:()=>void;onBusy?:(busy:boolean)=>void}){
  const router=useRouter(),notify=useContext(Notices),[busy,start]=useTransition(),[error,setError]=useState("");
  const [name,setName]=useState(item?.name??"");
  const category=kind==="category"?item as Category|undefined:undefined,product=kind==="product"?item as Product|undefined:undefined;
  const base=kind==="category"?"/dashboard/categories":"/dashboard/products",noun=kind==="category"?"قسم":"منتج";
  const excluded=new Set<string>(item?[item.slug]:[]);
  for(let i=0;i<categories.length;i++)for(const c of categories)if(c.parentSlug&&excluded.has(c.parentSlug))excluded.add(c.slug);
  function submit(form:FormData){setError("");onBusy?.(true);start(async()=>{try{const result=await mutate(kind,item?"edit":"create",form);notify(result);if(result.ok){if(onSaved)onSaved();else router.push(base);router.refresh();}else setError(result.message);}catch{setError("تعذّر الاتصال. حاول مجدداً.");notify({ok:false,message:"تعذّر الاتصال. حاول مجدداً."});}finally{onBusy?.(false);}});}
  return <>{!item&&<div className="admin-heading"><div><Link className="back" href={base}>→ العودة إلى {kind==="category"?"الأقسام":"المنتجات"}</Link><h1>إضافة {noun} جديد</h1><p>تفاصيل واضحة تساعد عميلك على الاختيار.</p></div></div>}<form action={submit} className={item?"editor":"panel editor"}><fieldset disabled={busy}><div className="form-grid">
    <label className="full">اسم {noun}<input name="name" required maxLength={150} value={name} onChange={event=>setName(event.target.value)} placeholder={kind==="category"?"مثال: أدوات التصميم":"مثال: Canva Pro"}/></label>
    <UrlField kind={kind} name={name} item={item} />
    {kind==="category"?<><label className="full">القسم الأب<select name="parent_slug" defaultValue={category?.parentSlug??""}><option value="">قسم رئيسي — بدون أب</option>{categories.filter(c=>!excluded.has(c.slug)).map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label><label className="full">وصف القسم<textarea name="description" defaultValue={category?.description} rows={3} placeholder="ماذا سيجد العميل في هذا القسم؟"/></label></>:<ProductFields product={product} categories={categories} />}
    <ImageField current={item?.imageUrl}/>
  </div>{error&&<p role="alert" className="form-error">{error}</p>}<div className="form-actions"><button className="primary" disabled={busy||(kind==="product"&&!categories.length)}>{busy?"جارٍ الحفظ…":item?"حفظ التغييرات":`إنشاء ${noun}`}</button>{onCancel?<button type="button" className="secondary" onClick={onCancel}>إلغاء</button>:<Link className="secondary" href={base}>إلغاء</Link>}</div></fieldset></form></>;
}

export function Manager({kind,categories,products}:{kind:Kind;categories:Category[];products:Product[]}){
  const [query,setQuery]=useState(""),[parent,setParent]=useState("all"),[edit,setEdit]=useState<Category|Product>(),[remove,setRemove]=useState<Category|Product>(),[editingBusy,setEditingBusy]=useState(false),[busy,start]=useTransition();
  const router=useRouter(),notify=useContext(Notices);
  const isCategory=kind==="category",title=isCategory?"الأقسام":"المنتجات",base=isCategory?"/dashboard/categories":"/dashboard/products";
  const rows:(Category|Product)[]=(isCategory?categories:products).filter(item=>(item.name+" "+item.slug+" "+(item.urlSlug??"")).toLowerCase().includes(query.toLowerCase())&&(parent==="all"||(isCategory?(item as Category).parentSlug===(parent==="root"?null:parent):(item as Product).categorySlug===parent)));
  function confirm(){if(!remove)return;const form=new FormData();form.set("slug",remove.slug);start(async()=>{try{const result=await mutate(kind,"delete",form);notify(result);if(result.ok){setRemove(undefined);router.refresh();}}catch{notify({ok:false,message:"تعذّر الاتصال. حاول مجدداً."});}});}
  return <><div className="admin-heading"><div><p className="eyebrow">محتوى المتجر</p><h1>{title}<span className="count">{isCategory?categories.length:products.length}</span></h1><p>{isCategory?"رتّب أقسامك الرئيسية والفرعية، واجعل التصفّح أسهل.":"إدارة تفاصيل منتجاتك وأسعارها، من مكان واحد."}</p></div><Link className="primary" href={base+"/new"}>＋ إضافة {isCategory?"قسم":"منتج"}</Link></div>
  <section className="panel manager"><div className="toolbar"><input aria-label="بحث" placeholder={`ابحث في ${title}…`} value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="تصفية حسب القسم" value={parent} onChange={e=>setParent(e.target.value)}><option value="all">{isCategory?"كل الأقسام":"جميع الأقسام"}</option>{isCategory&&<option value="root">الأقسام الرئيسية</option>}{categories.map(c=><option value={c.slug} key={c.slug}>{isCategory?"داخل: ":""}{c.name}</option>)}</select><span>{rows.length} نتيجة</span></div>
  {rows.length?<div className="table-scroll"><table><thead><tr><th>{isCategory?"القسم":"المنتج"}</th><th>{isCategory?"التصنيف":"القسم"}</th><th>{isCategory?"المحتوى":"السعر"}</th><th>إدارة</th></tr></thead><tbody>{rows.map(item=><tr key={item.slug}><td><div className="table-name"><span className="tile">{item.imageUrl?<Image unoptimized src={item.imageUrl} width={48} height={48} alt=""/>:item.glyph}</span><div><b>{item.name}</b><small><Link className="catalog-link" href={catalogPath(kind,item)} target="_blank" rel="noopener noreferrer"><bdi>{item.urlSlug||item.slug}</bdi> ↗</Link></small>{!isCategory && (item as Product).service && <small>خدمة برمجية</small>}</div></div></td><td>{isCategory?((item as Category).parentSlug?categories.find(c=>c.slug===(item as Category).parentSlug)?.name:"قسم رئيسي"):categories.find(c=>c.slug===(item as Product).categorySlug)?.name}</td><td>{isCategory?<button className="text-button" onClick={()=>setParent(item.slug)}>{categories.filter(c=>c.parentSlug===item.slug).length} أقسام فرعية · {products.filter(p=>p.categorySlug===item.slug).length} منتجات ←</button>:<><b dir="auto">{priceLabel(item as Product)}</b>{(item as Product).featured&&<span className="badge">مميز</span>}</>}</td><td><div className="row-actions"><button className="secondary" onClick={()=>setEdit(item)}>تعديل</button><button className="danger-text" onClick={()=>setRemove(item)}>حذف</button></div></td></tr>)}</tbody></table></div>:<div className="empty"><span>◇</span><h2>{query||parent!=="all"?"لا توجد نتائج مطابقة":"ابدأ بإضافة محتوى متجرك"}</h2><p>{query||parent!=="all"?"جرّب تغيير البحث أو التصفية.":"كل ما تضيفه هنا يصبح متاحاً في متجرك."}</p><Link href={base+"/new"} className="primary">إضافة {isCategory?"قسم":"منتج"}</Link></div>}</section>
  {edit&&<Modal title={`تعديل ${edit.name}`} close={()=>setEdit(undefined)} busy={editingBusy}><Editor kind={kind} item={edit} categories={categories} onSaved={()=>setEdit(undefined)} onCancel={()=>setEdit(undefined)} onBusy={setEditingBusy}/></Modal>}
  {remove&&<Modal title="تأكيد الحذف" close={()=>setRemove(undefined)} busy={busy}><div className="delete-body"><div className="delete-icon">!</div><h3>حذف «{remove.name}»؟</h3><p>سيختفي هذا العنصر من المتجر.{isCategory?" يجب نقل محتوياته إلى قسم آخر أولاً.":""}</p><div className="form-actions"><button disabled={busy} className="danger" onClick={confirm}>{busy?"جارٍ الحذف…":"نعم، حذف"}</button><button disabled={busy} className="secondary" onClick={()=>setRemove(undefined)}>تراجع</button></div></div></Modal>}
  </>;
}
export function RateEditor({rate}:{rate:string}){
  const notify=useContext(Notices),[busy,start]=useTransition();
  return <><div className="admin-heading"><div><p className="eyebrow">تفضيلات المتجر</p><h1>الإعدادات</h1><p>اضبط سعر الصرف المستخدم لعرض الأسعار.</p></div></div><form className="panel editor" action={form=>start(async()=>{try{notify(await mutate("rate","edit",form));}catch{notify({ok:false,message:"تعذّر حفظ السعر."});}})}><label>قيمة الدولار بالليرة السورية<input name="rate" type="number" min="0.01" step="0.01" required defaultValue={rate}/></label><div className="form-actions"><button disabled={busy} className="primary">{busy?"جارٍ الحفظ…":"حفظ الإعدادات"}</button></div></form></>;
}
