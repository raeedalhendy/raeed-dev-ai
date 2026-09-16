import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "raeed-dev-admin";
const maxAge = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not configured.");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + maxAge;
  const payload = `admin.${expiresAt}`;
  const store = await cookies();
  store.set(cookieName, `${payload}.${sign(payload)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge });
}

export async function isAdmin() {
  try {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token) return false;
    const [role, expiry, signature] = token.split(".");
    const payload = `${role}.${expiry}`;
    if (role !== "admin" || !expiry || !signature || Number(expiry) < Date.now() / 1000) return false;
    return timingSafeEqual(Buffer.from(signature), Buffer.from(sign(payload)));
  } catch {
    return false;
  }
}

export async function destroyAdminSession() {
  (await cookies()).delete(cookieName);
}
