export type Category = {
  slug: string;
  name: string;
  description: string;
  parentSlug: string | null;
  glyph: string;
  color: string;
  imageUrl?: string;
};

export type Product = {
  imageUrl?: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  note: string;
  glyph: string;
  color: string;
  duration: string;
  delivery: string;
  accountType: string;
  featured?: boolean;
};
