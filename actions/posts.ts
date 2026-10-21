"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";
import { requireEditor } from "@/lib/auth";
import { query } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { Post } from "@/lib/types";

export type PostState = { ok: boolean; message: string };

const MAX_COVER = 5 * 1024 * 1024;
const COVER_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function read(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function parsePublishDate(value: string) {
  if (!value) return new Date().toISOString();
  const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? `${value}:00-03:00` : value;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

async function uniqueSlug(base: string, exceptId?: number) {
  let slug = base;
  let n = 2;
  while (true) {
    const rows = exceptId
      ? await query<{ id: number }>("SELECT id FROM posts WHERE slug = $1 AND id <> $2", [slug, exceptId])
      : await query<{ id: number }>("SELECT id FROM posts WHERE slug = $1", [slug]);
    if (rows.length === 0) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

async function saveCover(file: File, slug: string) {
  const ext = COVER_TYPES[file.type];
  if (!ext) throw new Error("A capa precisa ser JPG, PNG ou WebP.");
  if (file.size > MAX_COVER) throw new Error("A capa pode ter no máximo 5 MB.");
  const dir = path.join(process.cwd(), "public", "images", "blog");
  await mkdir(dir, { recursive: true });
  const name = `${slug}-${Date.now()}.${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/images/blog/${name}`;
}

export async function savePost(_prev: PostState, formData: FormData): Promise<PostState> {
  await requireEditor();

  const idValue = read(formData, "id");
  const id = idValue ? Number(idValue) : 0;
  const title = read(formData, "title");
  const excerpt = read(formData, "excerpt");
  const body = read(formData, "body");
  const category = read(formData, "category") || "MPEN";
  const intent = read(formData, "intent") === "publish" ? "publish" : "draft";
  const featured = formData.get("featured") === "on";
  const removeCover = formData.get("remove_cover") === "on";
  const slugInput = read(formData, "slug");
  const seoTitle = read(formData, "seo_title");
  const seoDescription = read(formData, "seo_description");
  const coverFile = formData.get("cover");

  if (title.length < 3) {
    return { ok: false, message: "Informe um título com pelo menos 3 caracteres." };
  }

  let current: Post | null = null;
  if (id) {
    const rows = await query<Post>("SELECT * FROM posts WHERE id = $1", [id]);
    current = rows[0] ?? null;
    if (!current) return { ok: false, message: "Artigo não encontrado." };
  }

  const slug = await uniqueSlug(slugify(slugInput || title), id || undefined);
  let cover = current?.cover || "";
  if (removeCover) cover = "";

  try {
    if (coverFile instanceof File && coverFile.size > 0) {
      cover = await saveCover(coverFile, slug);
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Não foi possível guardar a capa." };
  }

  const publishedAt =
    intent === "publish" ? parsePublishDate(read(formData, "published_at")) : null;

  let savedId = current?.id ?? 0;
  try {
    if (current) {
      await query(
        `UPDATE posts
         SET title = $1, slug = $2, excerpt = $3, body = $4, category = $5, cover = $6,
             seo_title = $7, seo_description = $8, published_at = $9, featured = $10
         WHERE id = $11`,
        [title, slug, excerpt, body, category, cover, seoTitle, seoDescription, publishedAt, featured, current.id],
      );
    } else {
      const created = await query<{ id: number }>(
        `INSERT INTO posts (title, slug, excerpt, body, category, cover, seo_title, seo_description, published_at, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [title, slug, excerpt, body, category, cover, seoTitle, seoDescription, publishedAt, featured],
      );
      savedId = created[0]?.id ?? 0;
    }
  } catch {
    return { ok: false, message: "Não foi possível salvar o artigo agora." };
  }

  if (!savedId) return { ok: false, message: "Não foi possível salvar o artigo agora." };
  redirect(`/admin/artigos/${savedId}?salvo=1`);
}

export async function deletePost(formData: FormData) {
  await requireEditor();
  const id = Number(read(formData, "id"));
  if (!id) redirect("/admin");
  await query("DELETE FROM posts WHERE id = $1", [id]);
  redirect("/admin");
}
