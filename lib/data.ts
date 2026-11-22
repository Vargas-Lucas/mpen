import { query } from "@/lib/db";
import { ensureBlogSchema, ensureDevelopmentSchema } from "@/lib/ensure-schema";
import type { Category, Development, DevelopmentStory, Post } from "@/lib/types";

const STATUSES = new Set(["lancamento", "construcao", "entregue"]);
const BY_LAUNCH_YEAR = `
  CASE
    WHEN substring(delivery from '[0-9]{4}') IS NOT NULL THEN substring(delivery from '[0-9]{4}')::int
    WHEN substring(delivery from '([0-9]{2})$') IS NOT NULL THEN 2000 + substring(delivery from '([0-9]{2})$')::int
    ELSE 0
  END DESC, name
`;
const FOLDED_FROM = "áàâãäéèêëíìîïóòôõöúùûüçñ";
const FOLDED_TO = "aaaaaeeeeiiiiooooouuuucn";

function fold(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function folded(column: string) {
  return `translate(lower(${column}), '${FOLDED_FROM}', '${FOLDED_TO}')`;
}

function textList(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter((item): item is string => typeof item === "string");
}

function storyLocale(value: unknown) {
  if (!value || typeof value !== "object") return { title: "", body: "" };
  const row = value as { title?: unknown; body?: unknown };
  return {
    title: typeof row.title === "string" ? row.title : "",
    body: typeof row.body === "string" ? row.body : "",
  };
}

function storyValue(value: unknown): DevelopmentStory | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as { note?: unknown; pt?: unknown; en?: unknown; es?: unknown };
  return {
    note: Boolean(row.note),
    pt: storyLocale(row.pt),
    en: storyLocale(row.en),
    es: storyLocale(row.es),
  };
}

function asDevelopment(row: Development): Development {
  return {
    ...row,
    cover: typeof row.cover === "string" ? row.cover : null,
    website: typeof row.website === "string" ? row.website : "",
    gallery: textList(row.gallery),
    story: storyValue(row.story),
  };
}

export async function getDevelopments(filters: { q?: string; status?: string; city?: string } = {}) {
  await ensureDevelopmentSchema();
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
    params.push(`%${fold(filters.q)}%`);
    where.push(
      `(${folded("name")} LIKE $${params.length} OR ${folded("neighborhood")} LIKE $${params.length} OR ${folded("city")} LIKE $${params.length})`,
    );
  }

  const sql = `
    SELECT * FROM developments
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${BY_LAUNCH_YEAR}
  `;

  const rows = await query<Development>(sql, params);
  return rows.map(asDevelopment);
}

export async function getDevelopment(slug: string) {
  await ensureDevelopmentSchema();
  const rows = await query<Development>("SELECT * FROM developments WHERE slug = $1", [slug]);
  return rows[0] ? asDevelopment(rows[0]) : null;
}

export async function getDevelopmentById(id: number) {
  await ensureDevelopmentSchema();
  const rows = await query<Development>("SELECT * FROM developments WHERE id = $1", [id]);
  return rows[0] ? asDevelopment(rows[0]) : null;
}

export async function getSpotlightDevelopments() {
  await ensureDevelopmentSchema();
  const featured = await query<Development>(
    `SELECT * FROM developments WHERE featured = TRUE ORDER BY ${BY_LAUNCH_YEAR} LIMIT 3`,
  );
  if (featured.length >= 3) return featured.map(asDevelopment);
  const chosen = featured.map((item) => item.id);
  const rest = await query<Development>(
    `SELECT * FROM developments
     WHERE NOT (id = ANY($1::int[]))
     ORDER BY ${BY_LAUNCH_YEAR}
     LIMIT $2`,
    [chosen.length ? chosen : [0], 3 - featured.length],
  );
  return [...featured, ...rest].map(asDevelopment);
}

export async function getFeaturedDevelopments() {
  await ensureDevelopmentSchema();
  const featured = await query<Development>(
    `SELECT * FROM developments WHERE featured = TRUE ORDER BY ${BY_LAUNCH_YEAR} LIMIT 5`,
  );
  if (featured.length > 0) return featured.map(asDevelopment);
  const rows = await query<Development>(`SELECT * FROM developments ORDER BY ${BY_LAUNCH_YEAR} LIMIT 3`);
  return rows.map(asDevelopment);
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
    params.push(`%${fold(filters.q)}%`);
    where.push(
      `(${folded("title")} LIKE $${params.length} OR ${folded("excerpt")} LIKE $${params.length} OR ${folded("body")} LIKE $${params.length} OR ${folded("category")} LIKE $${params.length} OR ${folded("translations::text")} LIKE $${params.length})`,
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
