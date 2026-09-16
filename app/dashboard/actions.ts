"use server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "../_lib/auth";
import { sql } from "../_lib/db";
async function allow(){if(!await isAdmin())throw new Error("Unauthorized")}
const v=(f:FormData,k:string)=>String(f.get(k)??"").trim();
export async function addCategory(f:FormData){await allow();const slug=v(f,"slug"),name=v(f,"name");if(!slug||!name)return;await sql()`INSERT INTO categories (slug,name,description,glyph,color) VALUES (${slug},${name},${v(f,"description")||name},'✦','from-[#103cff] to-[#6e82ff]') ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,description=EXCLUDED.description`;revalidatePath("/");revalidatePath("/dashboard")}
export async function addProduct(f:FormData){await allow();const slug=v(f,"slug"),name=v(f,"name"),category=v(f,"category"),price=Number(v(f,"price"));if(!slug||!name||!category||!Number.isFinite(price))return;await sql()`INSERT INTO products (slug,name,category_slug,price_usd,note,glyph,color,duration,delivery,account_type,featured) VALUES (${slug},${name},${category},${price},${v(f,"note")||name},'✦','from-[#103cff] to-[#6e82ff]',${v(f,"duration")||'شهر كامل'},${v(f,"delivery")||'خلال 15 دقيقة'},${v(f,"type")||'تفعيل مضمون'},${f.get("featured")==='on'}) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,price_usd=EXCLUDED.price_usd,note=EXCLUDED.note,featured=EXCLUDED.featured,active=true,updated_at=now()`;revalidatePath("/");revalidatePath("/dashboard")}
export async function updateRate(f:FormData){await allow();const rate=Number(v(f,"rate"));if(rate>0){await sql()`INSERT INTO store_settings(key,value) VALUES('exchange_rate',${String(rate)}) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value`;revalidatePath("/");revalidatePath("/dashboard")}}
