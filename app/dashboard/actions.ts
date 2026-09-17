"use server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "../_lib/auth";
import { sql } from "../_lib/db";
import { saveUploadedImage } from "../_lib/uploads";
import { ImageValidationError } from "../_lib/image-processing";
import { parseProductDetails, ProductValidationError } from "../_lib/services";

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
          const upload = await saveUploadedImage(form);
          await db`ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT`;
          const existing = operation === "edit" ? await db`SELECT image_url FROM categories WHERE slug=${slug}` : [];
          const image = upload?.url ?? (v("remove_image") === "yes" ? null : existing[0]?.image_url ?? null);
          if (operation === "create") {
            await db`INSERT INTO categories(slug,name,description,parent_slug,glyph,color,image_url) VALUES(${slug},${v("name")},${v("description")},${parent},'✦','from-[#103cff] to-[#6e82ff]',${image || null})`;
          } else {
            await db`UPDATE categories SET name=${v("name")},description=${v("description")},parent_slug=${parent},image_url=${image || null} WHERE slug=${slug} AND active`;
          }
        }
      } else if (operation === "delete") {
        await db`UPDATE products SET active=false WHERE slug=${slug}`;
      } else {
        const details = parseProductDetails(form);
        const category = await db`SELECT slug FROM categories WHERE slug=${v("category_slug")} AND active`;
        if (!category.length) return { ok: false, message: "اختر قسماً موجوداً." };
        const featured = form.get("featured") === "on";
        const columns = await db`SELECT column_name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='products' AND column_name IN ('image_url','service_details')`;
        if (!columns.some(column => column.column_name === "service_details")) {
          try {
            await db`ALTER TABLE products ADD COLUMN IF NOT EXISTS service_details JSONB`;
          } catch {
            return { ok: false, message: "تعذّر تجهيز حقول الخدمات. شغّل ملف database/migration-004-project-services.sql في SQL Editor بقاعدة Neon المرتبطة بالموقع، ثم حاول الحفظ مجدداً." };
          }
        }
        if (!columns.some(column => column.column_name === "image_url")) await db`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT`;
        const upload = await saveUploadedImage(form);
        const existing = operation === "edit" ? await db`SELECT image_url FROM products WHERE slug=${slug}` : [];
        const image = upload?.url ?? (v("remove_image") === "yes" ? null : existing[0]?.image_url ?? null);
        const service = details.service ? JSON.stringify(details.service) : null;
        if (operation === "create") {
          await db`INSERT INTO products(slug,name,category_slug,price_usd,note,glyph,color,duration,delivery,account_type,featured,image_url,service_details) VALUES(${slug},${v("name")},${v("category_slug")},${details.price},${details.note},'✦','from-[#103cff] to-[#6e82ff]',${details.duration},${details.delivery},${details.accountType},${featured},${image},${service}::jsonb)`;
        } else {
          await db`UPDATE products SET name=${v("name")},category_slug=${v("category_slug")},price_usd=${details.price},note=${details.note},duration=${details.duration},delivery=${details.delivery},account_type=${details.accountType},featured=${featured},image_url=${image},service_details=${service}::jsonb,updated_at=now() WHERE slug=${slug} AND active`;
        }
      }
    }
    revalidatePath("/", "layout");
    return { ok: true, message: operation === "delete" ? "تم الحذف بنجاح." : "تم حفظ التغييرات بنجاح." };
  } catch (error) {
    if (error instanceof ImageValidationError || error instanceof ProductValidationError) return {ok:false,message:error.message};
    const code = (error as { code?: string }).code;
    return { ok: false, message: code === "23505" ? "الرابط المختصر مستخدم بالفعل. اختر رابطاً آخر." : "تعذّر الحفظ. تحقق من الاتصال وحاول مجدداً." };
  }
}
