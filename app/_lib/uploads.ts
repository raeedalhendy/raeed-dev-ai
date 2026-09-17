import "server-only";
import { createHash } from "node:crypto";
import { sql } from "./db";
import { optimizeImage, ImageValidationError } from "./image-processing";

export async function saveUploadedImage(form: FormData) {
  const file = form.get("image_file");
  if (!(file instanceof File) || file.size === 0) return undefined;
  if (file.size > 3 * 1024 * 1024) throw new ImageValidationError("حجم الصورة يجب ألا يتجاوز 3 ميغابايت.");
  const result = await optimizeImage(Buffer.from(await file.arrayBuffer()));
  const id = createHash("sha256").update(result.data).digest("hex");
  const db = sql();
  // Stored durably in Neon, not Vercel's temporary filesystem. Hash deduplicates uploads.
  await db`CREATE TABLE IF NOT EXISTS store_images (
    id TEXT PRIMARY KEY, mime TEXT NOT NULL, data_base64 TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await db`INSERT INTO store_images(id,mime,data_base64) VALUES(${id},${result.mime},${result.data.toString("base64")}) ON CONFLICT(id) DO NOTHING`;
  return { url: "/media/" + id, savedBytes: result.savedBytes };
}
