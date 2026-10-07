import { query } from "@/lib/db";
import type { Development, Post } from "@/lib/types";

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

export async function getFeaturedDevelopments() {
  const featured = await query<Development>(
    "SELECT * FROM developments WHERE featured = TRUE ORDER BY sort_order LIMIT 5",
  );
  if (featured.length > 0) return featured;
  return query<Development>("SELECT * FROM developments ORDER BY sort_order LIMIT 3");
}

export async function getPosts(filters: { q?: string; limit?: number } = {}) {
  const where = ["published_at IS NOT NULL"];
  const params: unknown[] = [];

  if (filters.q) {
    params.push(`%${filters.q}%`);
    where.push(`(title ILIKE $${params.length} OR excerpt ILIKE $${params.length} OR category ILIKE $${params.length})`);
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
  const rows = await query<Post>(
    "SELECT * FROM posts WHERE slug = $1 AND published_at IS NOT NULL",
    [slug],
  );
  return rows[0] ?? null;
}
