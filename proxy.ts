import { NextResponse, type NextRequest } from "next/server";

const encoder = new TextEncoder();
const cookieName = "raeed-dev-admin";

async function validAdminSession(token: string | undefined) {
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;
  const [role, expiry, signature] = token.split(".");
  const payload = `${role}.${expiry}`;
  if (role !== "admin" || !expiry || !signature || Number(expiry) < Date.now() / 1000) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const encoded = btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return encoded === signature;
}

export async function proxy(request: NextRequest) {
  if (await validAdminSession(request.cookies.get(cookieName)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = { matcher: ["/dashboard/:path*"] };
