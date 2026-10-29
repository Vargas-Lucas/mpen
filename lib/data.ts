import { query } from "@/lib/db";
import { ensureBlogSchema } from "@/lib/ensure-schema";
import type { Category, Development, Post } from "@/lib/types";

const STATUSES = new Set(["lancamento", "construcao", "entregue"]);

export async function getDevelopments(filters: { q?: string; status?: string; city?: string } = {}) {
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.status && STATUSES.has(filters.status)) {
    if (filters.status === "construcao") {
      where.push(`(status = 'construcao' OR (delivery = '2029' AND status <> 'entregue'))`);
    } else {
      params.push(filters.status);
      where.push(`status = $${params.length}`);
    }
  }

  if (filters.city) {
    params.push(filters.city);
    where.push(`city = $${params.length}`);
  }

  if (filters.q) {
    params.push(`%${filters.q}%`);
    where.push(
      `(name ILIKE $${params.length} OR neighborhood ILIKE $${params.length} OR city ILIKE $${params.length})`,
    );
  }

  const sql = `
    SELECT * FROM developments
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY sort_order, name
  `;

  return query<Development>(sql, params);
}

export async function getDevelopment(slug: string) {
  const rows = await query<Development>("SELECT * FROM developments WHERE slug = $1", [slug]);
  return rows[0] ?? null;
}

export async function getSpotlightDevelopments() {
  const rows = await query<Development>(`
    SELECT * FROM developments
    WHERE status IN ('lancamento', 'entregue')
    ORDER BY CASE WHEN delivery ~ '^[0-9]{4}$' THEN delivery::int ELSE 0 END DESC, sort_order
    LIMIT 3
  `);
  const chez = await getDevelopment("chez-soleil");
  if (!chez) return rows;
  return rows.map((item) => (item.slug === "village-du-soleil" ? chez : item));
}

export async function getFeaturedDevelopments() {
  const featured = await query<Development>(
    "SELECT * FROM developments WHERE featured = TRUE ORDER BY sort_order LIMIT 5",
  );
  if (featured.length > 0) return featured;
  return query<Development>("SELECT * FROM developments ORDER BY sort_order LIMIT 3");
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "Empreendimentos", slug: "empreendimentos" },
  { id: 2, name: "Institucional", slug: "institucional" },
  { id: 3, name: "MPEN", slug: "mpen" },
  { id: 4, name: "Novidades", slug: "novidades" },
  { id: 5, name: "Sul da Ilha", slug: "sul-da-ilha" },
];

export async function getCategories() {
  try {
    await ensureBlogSchema();
    return await query<Category>("SELECT id, name, slug FROM categories ORDER BY name");
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function getAdminCategories() {
  try {
    await ensureBlogSchema();
    return await query<Category & { posts: number }>(`
      SELECT c.id, c.name, c.slug, COUNT(p.id)::int AS posts
      FROM categories c
      LEFT JOIN posts p ON p.category = c.name
      GROUP BY c.id, c.name, c.slug
      ORDER BY c.name
    `);
  } catch {
    return FALLBACK_CATEGORIES.map((item) => ({ ...item, posts: 0 }));
  }
}

export async function getPosts(filters: { q?: string; category?: string; limit?: number } = {}) {
  await ensureBlogSchema();
  const where = ["published_at IS NOT NULL"];
  const params: unknown[] = [];

  if (filters.category) {
    params.push(filters.category);
    where.push(`category = $${params.length}`);
  }

  if (filters.q) {
    params.push(`%${filters.q}%`);
    where.push(
      `(title ILIKE $${params.length} OR excerpt ILIKE $${params.length} OR body ILIKE $${params.length} OR category ILIKE $${params.length} OR translations::text ILIKE $${params.length})`,
    );
  }

  let sql = `
    SELECT * FROM posts
    WHERE ${where.join(" AND ")}
    ORDER BY published_at DESC
  `;

  if (filters.limit) {
    params.push(filters.limit);
    sql += ` LIMIT $${params.length}`;
  }

  return query<Post>(sql, params);
}

export async function getPost(slug: string) {
  await ensureBlogSchema();
  const rows = await query<Post>(
    "SELECT * FROM posts WHERE slug = $1 AND published_at IS NOT NULL",
    [slug],
  );
  return rows[0] ?? null;
}

export async function getPostBySlug(slug: string) {
  await ensureBlogSchema();
  const rows = await query<Post>("SELECT * FROM posts WHERE slug = $1", [slug]);
  return rows[0] ?? null;
}

export async function getRelatedPosts(post: Pick<Post, "id" | "category">, limit = 3) {
  const same = await query<Post>(
    `SELECT * FROM posts
     WHERE published_at IS NOT NULL AND id <> $1 AND category = $2
     ORDER BY published_at DESC
     LIMIT $3`,
    [post.id, post.category, limit],
  );
  if (same.length >= limit) return same;

  const extra = await query<Post>(
    `SELECT * FROM posts
     WHERE published_at IS NOT NULL AND id <> $1 AND category <> $2
     ORDER BY published_at DESC
     LIMIT $3`,
    [post.id, post.category, limit - same.length],
  );
  return [...same, ...extra];
}

export async function getAdminPosts() {
  return query<Post>(`
    SELECT * FROM posts
    ORDER BY CASE WHEN published_at IS NULL THEN 0 ELSE 1 END,
      COALESCE(published_at, NOW()) DESC,
      id DESC
  `);
}

function textField(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function plainPost(row: Post): Post {
  let translations: Post["translations"] = {};
  try {
    const stored: unknown = row.translations;
    const raw = typeof stored === "string" ? JSON.parse(stored) : stored;
    if (raw && typeof raw === "object") {
      for (const code of ["en", "es"] as const) {
        const item = (raw as Post["translations"])[code];
        if (!item || typeof item !== "object") continue;
        translations[code] = {
          title: textField(item.title),
          excerpt: textField(item.excerpt),
          body: textField(item.body),
          cover_alt: textField(item.cover_alt),
          seo_title: textField(item.seo_title),
          seo_description: textField(item.seo_description),
        };
      }
    }
  } catch {
    translations = {};
  }

  const published = row.published_at ? new Date(row.published_at) : null;
  return {
    id: Number(row.id),
    title: textField(row.title),
    slug: textField(row.slug),
    excerpt: textField(row.excerpt),
    body: textField(row.body),
    category: textField(row.category),
    cover: textField(row.cover),
    cover_alt: textField(row.cover_alt),
    seo_title: textField(row.seo_title),
    seo_description: textField(row.seo_description),
    seo_keyword: textField(row.seo_keyword),
    published_at: published && !Number.isNaN(published.getTime()) ? published.toISOString() : null,
    featured: row.featured === true,
    translations,
  };
}

export async function getAdminPost(id: number) {
  if (!Number.isInteger(id) || id < 1) return null;
  try {
    await ensureBlogSchema();
  } catch {
    // The article still opens when the extra columns are already there.
  }
  const rows = await query<Post>("SELECT * FROM posts WHERE id = $1", [id]);
  return rows[0] ? plainPost(rows[0]) : null;
}
