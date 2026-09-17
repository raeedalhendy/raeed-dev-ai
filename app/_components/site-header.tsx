"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartLauncher } from "./cart-launcher";
import { Icon } from "./icon";
import styles from "../storefront.module.css";

const links = [{ href: "/#featured", label: "المميزة" }, { href: "/#categories", label: "الأقسام" }, { href: "/#shop", label: "المتجر" }, { href: "/#how-it-works", label: "كيف تطلب؟" }];

export function BrandMark() {
  return <Link href="/" className={styles.brand} aria-label="Raeed Dev — الرئيسية"><span className={styles.brandImage}><Image src="/fornav.png" alt="" fill sizes="44px" className="object-contain" priority /></span><span dir="ltr"><b>raeed dev<span>.</span></b><small>YOUR DIGITAL UPGRADE</small></span></Link>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <>
    <a href="#main-content" className={styles.skipLink}>انتقل إلى المحتوى</a>
    {/* <div className={styles.announcement}><span>✦</span> أدواتك المفضلة. إمكانيات أكبر. <Link href="/#shop">اكتشف عالمك الرقمي <span>←</span></Link></div> */}
    <header className={styles.header} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}><div className={`${styles.container} ${styles.headerInner}`}><BrandMark /><nav className={styles.desktopNav} aria-label="التنقل الرئيسي">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav><div className={styles.headerActions}><a href="https://wa.me/963969477454" className={styles.supportLink}><Icon name="headphones" /><span>خلّينا نساعدك</span></a><CartLauncher /><button onClick={() => setOpen(!open)} className={`${styles.iconButton} ${styles.menuButton}`} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}><Icon name={open ? "close" : "menu"} /></button></div></div>{open && <nav id="mobile-nav" className={styles.mobileNav} aria-label="التنقل على الموبايل">{links.map((link) => <Link key={link.href} onClick={() => setOpen(false)} href={link.href}>{link.label}<Icon name="arrow" /></Link>)}</nav>}</header>
    <div id="main-content" tabIndex={-1} className={styles.contentAnchor} />
  </>;
}
