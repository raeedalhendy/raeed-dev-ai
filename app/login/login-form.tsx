"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return <form action={action} className="mt-8 space-y-4"><label className="block text-sm font-bold">رقم الموبايل<input required name="phone" inputMode="tel" placeholder="09xxxxxxxx" className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#103cff]" /></label><label className="block text-sm font-bold">كلمة المرور<input required name="password" type="password" className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#103cff]" /></label>{state?.error && <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600">{state.error}</p>}<button disabled={pending} className="w-full rounded-xl bg-[#103cff] py-3.5 text-sm font-black text-white disabled:opacity-60">{pending ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}</button></form>;
}
