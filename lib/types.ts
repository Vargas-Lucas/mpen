export type Development = {
  id: number;
  name: string;
  slug: string;
  status: "lancamento" | "construcao" | "entregue";
  neighborhood: string;
  city: string;
  typology: string;
  area: string;
  summary: string;
  delivery: string;
  featured: boolean;
  sort_order: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  cover: string;
  cover_alt: string;
  seo_title: string;
  seo_description: string;
  seo_keyword: string;
  published_at: string | null;
  featured: boolean;
  translations: PostTranslations;
};

export type PostTranslation = {
  title: string;
  excerpt: string;
  body: string;
  cover_alt: string;
  seo_title: string;
  seo_description: string;
};

export type PostTranslations = {
  en?: Partial<PostTranslation>;
  es?: Partial<PostTranslation>;
};
