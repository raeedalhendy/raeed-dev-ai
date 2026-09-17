import sharp from "sharp";

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export class ImageValidationError extends Error {}

// Never resize or lower quality. Keep the smaller of the lossless result and original.
export async function optimizeImage(input: Buffer) {
  if (!input.length || input.length > MAX_IMAGE_BYTES) {
    throw new ImageValidationError("حجم الصورة يجب ألا يتجاوز 3 ميغابايت.");
  }
  try {
    const image = sharp(input, { limitInputPixels: 24_000_000, failOn: "warning" });
    const metadata = await image.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format ?? "") || (metadata.pages ?? 1) > 1) {
      throw new ImageValidationError("اختر صورة ثابتة بصيغة JPG أو PNG أو WebP.");
    }
    // WebP is 8-bit RGB: keep high-bit-depth / CMYK originals without conversion.
    if (metadata.depth !== "uchar" || metadata.space !== "srgb") {
      await image.stats(); // Decode to reject corrupt files even when keeping the original.
      return {
        data: input,
        mime: metadata.format === "jpeg" ? "image/jpeg" : "image/" + metadata.format,
        originalBytes: input.length, savedBytes: 0,
        width: metadata.width, height: metadata.height,
      };
    }
    // Colour profiles and orientation are preserved; no dimension changes.
    const optimized = await image.keepMetadata().webp({ lossless: true, effort: 5 }).toBuffer();
    const smaller = optimized.length < input.length;
    return {
      data: smaller ? optimized : input,
      mime: smaller ? "image/webp" : metadata.format === "jpeg" ? "image/jpeg" : "image/" + metadata.format,
      originalBytes: input.length,
      savedBytes: smaller ? input.length - optimized.length : 0,
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    if (error instanceof ImageValidationError) throw error;
    throw new ImageValidationError("تعذّر قراءة الصورة. اختر صورة سليمة لا تتجاوز 24 مليون بكسل.");
  }
}
