"use server";

import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession } from "../_lib/auth";

export async function login(_: { error?: string } | undefined, formData: FormData) {
  const phone = String(formData.get("phone") ?? "").replace(/\s/g, "");
  const password = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PHONE || !process.env.ADMIN_PASSWORD) return { error: "إعدادات الدخول غير مكتملة." };
  if (phone !== process.env.ADMIN_PHONE || password !== process.env.ADMIN_PASSWORD) return { error: "رقم الموبايل أو كلمة المرور غير صحيحة." };
  await createAdminSession();
  redirect("/dashboard");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/login");
}
