export type Category = { slug: string; name: string; description: string; parentSlug: string | null; glyph: string; color: string };
export type Product = { slug: string; name: string; categorySlug: string; price: number; note: string; glyph: string; color: string; duration: string; delivery: string; accountType: string; featured?: boolean };

export const exchangeRate = 1350;
export const categories: Category[] = [
  { slug: "ai", name: "ذكاء اصطناعي", description: "أدوات تولّد وتساعد وتنجز.", parentSlug: null, glyph: "✦", color: "from-[#1040ff] to-[#6e82ff]" },
  { slug: "entertainment", name: "ترفيه", description: "كل ما تحب مشاهدته وسماعه.", parentSlug: null, glyph: "▶", color: "from-[#171717] to-[#555]" },
  { slug: "work", name: "إنتاجية", description: "مساحة عملك، بشكل أذكى.", parentSlug: null, glyph: "↗", color: "from-[#0768e6] to-[#35a8ff]" },
  { slug: "design", name: "تصميم", description: "أدوات تصنع أفكارك بصرياً.", parentSlug: null, glyph: "◒", color: "from-[#04a9a7] to-[#54d7f0]" },
  { slug: "ai-assistants", name: "مساعدات ذكية", description: "مساعدون لإنجاز كل شيء أسرع.", parentSlug: "ai", glyph: "✦", color: "from-[#3026a5] to-[#8c7cff]" },
  { slug: "video", name: "مشاهدة", description: "أفضل محتوى على شاشتك.", parentSlug: "entertainment", glyph: "▻", color: "from-[#9b1010] to-[#ef4343]" },
];

export const products: Product[] = [
  { slug: "chatgpt-plus", name: "ChatGPT Plus", categorySlug: "ai-assistants", price: 20, note: "اشتراك شخصي لمدة شهر كامل.", glyph: "✦", color: "from-[#1040ff] to-[#6e82ff]", duration: "شهر كامل", delivery: "خلال 15 دقيقة", accountType: "حساب شخصي", featured: true },
  { slug: "netflix-premium", name: "Netflix Premium", categorySlug: "video", price: 8, note: "جودة 4K ودعم حتى 4 شاشات.", glyph: "N", color: "from-[#171717] to-[#5b0000]", duration: "شهر كامل", delivery: "خلال 15 دقيقة", accountType: "تفعيل مضمون", featured: true },
  { slug: "microsoft-365", name: "Microsoft 365", categorySlug: "work", price: 12, note: "تطبيقات أوفيس الكاملة لمساحة عملك.", glyph: "M", color: "from-[#0768e6] to-[#35a8ff]", duration: "شهر كامل", delivery: "خلال 15 دقيقة", accountType: "حساب شخصي" },
  { slug: "canva-pro", name: "Canva Pro", categorySlug: "design", price: 7, note: "تصميم بلا حدود، لمدة شهر.", glyph: "C", color: "from-[#04a9a7] to-[#54d7f0]", duration: "شهر كامل", delivery: "خلال 15 دقيقة", accountType: "دعوة رسمية" },
];

export const getCategory = (slug: string) => categories.find((category) => category.slug === slug);
export const getChildCategories = (slug: string | null) => categories.filter((category) => category.parentSlug === slug);
export const getProductsForCategory = (slug: string) => products.filter((product) => product.categorySlug === slug);
export const formatSyp = (price: number) => new Intl.NumberFormat("ar-SY").format(price * exchangeRate);
