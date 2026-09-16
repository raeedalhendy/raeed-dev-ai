import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return <main className="grid min-h-screen place-items-center bg-[#f8f9fc] p-5 text-[#101114]"><section className="w-full max-w-md rounded-[2rem] border border-black/[.08] bg-white p-7 shadow-xl shadow-black/[.04]"><Link href="/" className="text-sm font-black text-[#103cff]">Raeed Dev</Link><h1 className="mt-8 text-3xl font-black tracking-[-.05em]">تسجيل دخول الإدارة</h1><p className="mt-3 text-sm leading-6 text-black/50">هذه الصفحة مخصّصة لإدارة المتجر فقط.</p><LoginForm /></section></main>;
}
