"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartLauncher } from "./cart-launcher";

const links = [{ href: "/#featured", label: "المميزة" }, { href: "/#categories", label: "الأقسام" }, { href: "/#shop", label: "كل الخدمات" }];

export function BrandMark() {
  return <Link href="/" className="flex items-center gap-3" aria-label="Raeed Dev"><span className="relative h-11 w-11 overflow-hidden rounded-2xl bg-[#08090d]"><Image src="/fornav.png" alt="Raeed Dev" fill sizes="44px" className="object-cover" priority /></span><span className="leading-none"><b className="block text-[13px] font-black tracking-[.06em]">Raeed Dev</b><b className="mt-1 block text-[9px] font-bold tracking-[.16em] text-[#103cff]">DIGITAL STORE</b></span></Link>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <nav className="sticky top-0 z-20 border-b border-black/[.06] bg-[#f8f9fc]/90 backdrop-blur-xl"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8"><BrandMark /><div className="hidden items-center gap-8 text-sm font-medium text-black/50 md:flex">{links.map((link) => <Link key={link.href} href={link.href} className="transition hover:text-[#103cff]">{link.label}</Link>)}</div><div className="flex items-center gap-2"><CartLauncher /><button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 text-lg md:hidden" aria-label="فتح القائمة">{open ? "×" : "☰"}</button></div></div>{open && <div className="border-t border-black/[.06] bg-white px-5 py-4 md:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-1">{links.map((link) => <Link key={link.href} onClick={() => setOpen(false)} href={link.href} className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-[#103cff]/5">{link.label}</Link>)}</div></div>}</nav>;
}
