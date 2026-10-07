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

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  published_at: string;
  featured: boolean;
};
