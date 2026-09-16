"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const rows = [
  ["ChatGPT Plus", "ذكاء اصطناعي", "$20", "مميز"],
  ["Netflix Premium", "ترفيه", "$8", "مميز"],
  ["Microsoft 365", "إنتاجية", "$12", "نشط"],
  ["Canva Pro", "تصميم", "$7", "نشط"],
];

export default function Dashboard() {
  const [rate, setRate] = useState("1350");
  const [notice, setNotice] = useState("");
  return <main className="min-h-screen bg-[#f8f9fc] p-4 text-[#101114] md:p-7" dir="rtl">
    <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[230px_1fr]">
      <aside className="rounded-3xl border border-black/[.08] bg-white p-5 md:min-h-[calc(100vh-3.5rem)]"><Link href="/" className="flex items-center gap-3"><span className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#08090d]"><Image src="/fornav.png" alt="" fill sizes="40px" className="object-cover" /></span><b>Raeed Dev</b></Link><p className="mt-10 text-[10px] font-bold tracking-widest text-black/35">إدارة المتجر</p><nav className="mt-4 space-y-1 text-sm"><Link className="block rounded-xl bg-[#103cff] px-4 py-3 font-bold text-white" href="/dashboard">نظرة عامة</Link><button className="w-full rounded-xl px-4 py-3 text-right text-black/55 hover:bg-black/5">المنتجات <span className="float-left">04</span></button><button className="w-full rounded-xl px-4 py-3 text-right text-black/55 hover:bg-black/5">الأقسام</button><button className="w-full rounded-xl px-4 py-3 text-right text-black/55 hover:bg-black/5">إعدادات المتجر</button></nav><Link className="mt-12 block rounded-xl border border-black/10 px-4 py-3 text-center text-xs text-black/50 hover:bg-black/5" href="/">← عرض المتجر</Link></aside>
      <section className="min-w-0"><header className="flex flex-wrap items-center justify-between gap-4 py-3"><div><p className="text-xs text-violet-300">مرحباً،</p><h1 className="mt-1 text-3xl font-black tracking-[-.05em]">لوحة القيادة</h1></div><button onClick={() => setNotice("زر إضافة منتج جاهز للربط مع قاعدة البيانات بالخطوة التالية.")} className="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:scale-[1.02]">+ إضافة منتج</button></header>{notice && <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-xs text-cyan-100">{notice}</div>}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">{[["04","منتجات نشطة"],["02","منتجات مميزة"],["$47","متوسط السلة"]].map(([value,label]) => <div key={label} className="rounded-3xl border border-black/[.08] bg-white p-6"><p className="text-3xl font-black">{value}</p><p className="mt-2 text-xs text-black/40">{label}</p></div>)}</div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_290px]"><div className="overflow-hidden rounded-3xl border border-black/[.08] bg-white"><div className="flex items-center justify-between border-b border-black/[.08] p-6"><div><h2 className="font-black">المنتجات</h2><p className="mt-1 text-xs text-black/40">إدارة المخزون الرقمي</p></div><button className="text-xs text-[#103cff]">كل المنتجات ←</button></div><div className="overflow-x-auto"><table className="w-full min-w-[550px] text-right text-sm"><thead className="text-[11px] text-black/35"><tr><th className="px-6 py-4 font-medium">المنتج</th><th className="px-4 py-4 font-medium">القسم</th><th className="px-4 py-4 font-medium">السعر</th><th className="px-6 py-4 font-medium">الحالة</th></tr></thead><tbody>{rows.map(([name,category,price,status]) => <tr key={name} className="border-t border-black/[.05]"><td className="px-6 py-5 font-bold">{name}</td><td className="px-4 py-5 text-black/45">{category}</td><td className="px-4 py-5">{price}</td><td className="px-6 py-5"><span className="rounded-full bg-[#103cff]/10 px-2.5 py-1 text-[10px] font-bold text-[#103cff]">{status}</span></td></tr>)}</tbody></table></div></div>
          <div className="rounded-3xl border border-[#103cff]/15 bg-[#103cff]/[.05] p-6"><p className="text-xs font-bold text-[#103cff]">إعداد عام</p><h2 className="mt-2 text-xl font-black">سعر صرف الدولار</h2><p className="mt-2 text-xs leading-5 text-black/45">يُستخدم فوراً لحساب السعر بالليرة على كل المنتجات.</p><label className="mt-7 block text-xs text-black/50">1 دولار يساوي</label><div className="mt-2 flex items-center rounded-xl border border-black/10 bg-white px-3"><input value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-transparent py-3 text-lg font-black outline-none" inputMode="numeric" /><span className="text-xs text-black/40">ل.س</span></div><button onClick={() => setNotice(`تم حفظ سعر الصرف: 1 USD = ${rate} SYP (واجهة تجريبية).`)} className="mt-3 w-full rounded-xl bg-[#103cff] py-3 text-xs font-black text-white">حفظ سعر الصرف</button></div></div>
      </section>
    </div>
  </main>;
}
