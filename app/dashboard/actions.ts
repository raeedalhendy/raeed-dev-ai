"use server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "../_lib/auth";
import { sql } from "../_lib/db";

export async function mutate(kind: "category" | "product" | "rate", operation: "create" | "edit" | "delete", form: FormData) {
  if (!await isAdmin()) return { ok: false, message: "انتهت الجلسة. سجّل الدخول مجدداً." };
  const v = (key: string) => String(form.get(key) ?? "").trim();
  const db = sql();
  try {
    const slug = v("slug");
    if (kind === "rate") {
      const rate = Number(v("rate"));
      if (!Number.isFinite(rate) || rate <= 0) return { ok: false, message: "أدخل سعر صرف أكبر من صفر." };
      await db`INSERT INTO store_settings(key,value) VALUES('exchange_rate',${String(rate)}) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()`;
    } else {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { ok: false, message: "الرابط المختصر: أحرف إنكليزية صغيرة وأرقام وشرطات فقط." };
      if (operation !== "delete" && (!v("name") || v("name").length > 150)) return { ok: false, message: "أدخل اسماً صالحاً (حتى 150 حرفاً)." };
      if (kind === "category") {
        if (operation === "delete") {
          const used = await db`SELECT 1 FROM categories WHERE parent_slug=${slug} AND active UNION ALL SELECT 1 FROM products WHERE category_slug=${slug} AND active LIMIT 1`;
          if (used.length) return { ok: false, message: "انقل المنتجات والأقسام الفرعية أولاً قبل حذف هذا القسم." };
          await db`UPDATE categories SET active=false WHERE slug=${slug}`;
        } else {
          const parent = v("parent_slug") || null;
          if (parent) {
            const ancestors = await db`WITH RECURSIVE tree AS (SELECT slug,parent_slug FROM categories WHERE slug=${parent} AND active UNION SELECT c.slug,c.parent_slug FROM categories c JOIN tree t ON c.slug=t.parent_slug) SELECT slug FROM tree`;
            if (!ancestors.length || ancestors.some(row => row.slug === slug)) return { ok: false, message: "القسم الأب غير صالح أو يسبب تداخلاً دائرياً." };
          }
          const image = v("image_url");
          if (image && !/^https:\/\//.test(image)) return { ok: false, message: "استخدم رابط صورة يبدأ بـ https://." };
          await db`ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT`;
          if (operation === "create") {
            await db`INSERT INTO categories(slug,name,description,parent_slug,glyph,color,image_url) VALUES(${slug},${v("name")},${v("description")},${parent},'✦','from-[#103cff] to-[#6e82ff]',${image || null})`;
          } else {
            await db`UPDATE categories SET name=${v("name")},description=${v("description")},parent_slug=${parent},image_url=${image || null} WHERE slug=${slug} AND active`;
          }
        }
      } else if (operation === "delete") {
        await db`UPDATE products SET active=false WHERE slug=${slug}`;
      } else {
        const price = Number(v("price"));
        if (!v("price") || !Number.isFinite(price) || price < 0 || price > 99999999) return { ok: false, message: "أدخل سعراً صالحاً." };
        const category = await db`SELECT slug FROM categories WHERE slug=${v("category_slug")} AND active`;
        if (!category.length) return { ok: false, message: "اختر قسماً موجوداً." };
        const featured = form.get("featured") === "on";
        if (operation === "create") {
          await db`INSERT INTO products(slug,name,category_slug,price_usd,note,glyph,color,duration,delivery,account_type,featured) VALUES(${slug},${v("name")},${v("category_slug")},${price},${v("note")},'✦','from-[#103cff] to-[#6e82ff]',${v("duration")},${v("delivery")},${v("account_type")},${featured})`;
        } else {
          await db`UPDATE products SET name=${v("name")},category_slug=${v("category_slug")},price_usd=${price},note=${v("note")},duration=${v("duration")},delivery=${v("delivery")},account_type=${v("account_type")},featured=${featured},updated_at=now() WHERE slug=${slug} AND active`;
        }
      }
    }
    revalidatePath("/", "layout");
    return { ok: true, message: operation === "delete" ? "تم الحذف بنجاح." : "تم حفظ التغييرات بنجاح." };
  } catch (error) {
    const code = (error as { code?: string }).code;
    return { ok: false, message: code === "23505" ? "الرابط المختصر مستخدم بالفعل. اختر رابطاً آخر." : "تعذّر الحفظ. تحقق من الاتصال وحاول مجدداً." };
  }
}
