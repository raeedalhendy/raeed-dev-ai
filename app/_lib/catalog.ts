export type Category = {
  urlSlug?: string;
  slug: string;
  name: string;
  description: string;
  parentSlug: string | null;
  glyph: string;
  color: string;
  imageUrl?: string;
};

export type Product = {
  urlSlug?: string;
  service?: ServiceDetails;
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

export type ServiceDetails = {
  type: "website" | "application" | "store";
  pricing: "fixed" | "starting" | "quote";
  includes: string[];
  excludes: string[];
  support: string;
  portfolioUrl: string;
};
