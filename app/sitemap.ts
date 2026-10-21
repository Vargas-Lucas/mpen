import type { MetadataRoute } from "next";
import { getDevelopments, getPosts } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

const pages: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/empreendimentos", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/quem-somos", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contato", changeFrequency: "monthly", priority: 0.6 },
  { path: "/seja-parceiro", changeFrequency: "monthly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.4 },
  { path: "/compliance", changeFrequency: "yearly", priority: 0.3 },
  { path: "/politica-de-privacidade", changeFrequency: "yearly", priority: 0.3 },
  { path: "/termos-de-uso", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, developments] = await Promise.all([getPosts(), getDevelopments()]);
  const now = new Date();

  return [
    ...pages.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...developments.map((item) => ({
      url: `${SITE_URL}/empreendimentos/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
