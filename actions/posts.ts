"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { redirect, unstable_rethrow } from "next/navigation";
import { ensureCategory } from "@/actions/categories";
import { requireEditor } from "@/lib/auth";
import { query } from "@/lib/db";
import { dbErrorMessage, ensureBlogSchema } from "@/lib/ensure-schema";
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
  const root = base || "artigo";
  let slug = root;
  let n = 2;
  while (true) {
    const rows = exceptId
      ? await query<{ id: number }>("SELECT id FROM posts WHERE slug = $1 AND id <> $2", [slug, exceptId])
      : await query<{ id: number }>("SELECT id FROM posts WHERE slug = $1", [slug]);
    if (rows.length === 0) return slug;
    slug = `${root}-${n}`;
    n += 1;
  }
}

async function saveBlogImage(file: File, slug: string) {
  const ext = COVER_TYPES[file.type];
  if (!ext) throw new Error("A imagem precisa ser JPG, PNG ou WebP.");
  if (file.size > MAX_COVER) throw new Error("A imagem pode ter no máximo 5 MB.");
  const dir = path.join(process.cwd(), "public", "images", "blog");
  await mkdir(dir, { recursive: true });
  const name = `${slug}-${Date.now()}.${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/images/blog/${name}`;
}

export async function uploadPostImage(formData: FormData): Promise<{ ok: boolean; url?: string; message?: string }> {
  await requireEditor();
  const file = formData.get("image");
  const slug = slugify(read(formData, "slug") || "artigo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Escolha uma imagem." };
  }
  try {
    return { ok: true, url: await saveBlogImage(file, slug) };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Não foi possível guardar a imagem." };
  }
}

type SaveIntent = "publish" | "preview" | "draft";

function readIntent(formData: FormData): SaveIntent | null {
  const intent = read(formData, "intent");
  if (intent === "publish" || intent === "preview" || intent === "draft") return intent;
  return null;
}

export async function publishPost(_prev: PostState, formData: FormData): Promise<PostState> {
  formData.set("intent", "publish");
  return savePost(_prev, formData);
}

export async function previewPost(_prev: PostState, formData: FormData): Promise<PostState> {
  formData.set("intent", "preview");
  return savePost(_prev, formData);
}

export async function draftPost(_prev: PostState, formData: FormData): Promise<PostState> {
  formData.set("intent", "draft");
  return savePost(_prev, formData);
}

export async function savePost(_prev: PostState, formData: FormData): Promise<PostState> {
  await requireEditor();

  try {
    await ensureBlogSchema();

    const idValue = read(formData, "id");
    const id = idValue ? Number(idValue) : 0;
    const title = read(formData, "title");
    const excerpt = read(formData, "excerpt");
    const body = read(formData, "body");
    const categoryName = read(formData, "category") || "MPEN";
    const intent = readIntent(formData);
    if (!intent) {
      return { ok: false, message: "Escolha Publicar, Ver como ou Salvar rascunho." };
    }
    const featured = formData.get("featured") === "on";
    const removeCover = formData.get("remove_cover") === "on";
    const slugInput = read(formData, "slug");
    const seoTitle = read(formData, "seo_title");
    const seoDescription = read(formData, "seo_description");
    const seoKeyword = read(formData, "seo_keyword");
    const coverAlt = read(formData, "cover_alt");
    const coverFile = formData.get("cover");

    if (title.length < 3) {
      return { ok: false, message: "Informe um título com pelo menos 3 caracteres." };
    }

    let category = categoryName;
    try {
      category = await ensureCategory(categoryName);
    } catch {
      category = categoryName;
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

    if (coverFile instanceof File && coverFile.size > 0) {
      try {
        cover = await saveBlogImage(coverFile, slug);
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : "Não foi possível guardar a capa." };
      }
    }

    const publishedAt =
      intent === "publish"
        ? parsePublishDate(read(formData, "published_at"))
        : intent === "preview"
          ? current?.published_at ?? null
          : null;

    let savedId = current?.id ?? 0;
    if (current) {
      await query(
        `UPDATE posts
         SET title = $1, slug = $2, excerpt = $3, body = $4, category = $5, cover = $6, cover_alt = $7,
             seo_title = $8, seo_description = $9, seo_keyword = $10, published_at = $11, featured = $12
         WHERE id = $13`,
        [
          title,
          slug,
          excerpt,
          body,
          category,
          cover,
          coverAlt,
          seoTitle,
          seoDescription,
          seoKeyword,
          publishedAt,
          featured,
          current.id,
        ],
      );
    } else {
      const created = await query<{ id: number }>(
        `INSERT INTO posts
           (title, slug, excerpt, body, category, cover, cover_alt, seo_title, seo_description, seo_keyword, published_at, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [
          title,
          slug,
          excerpt,
          body,
          category,
          cover,
          coverAlt,
          seoTitle,
          seoDescription,
          seoKeyword,
          publishedAt,
          featured,
        ],
      );
      savedId = created[0]?.id ?? 0;
    }

    if (!savedId) return { ok: false, message: "Não foi possível salvar o artigo agora." };
    if (intent === "preview") redirect(`/blog/${slug}?preview=1`);
    if (intent === "publish") redirect(`/admin/artigos/${savedId}?publicado=1`);
    redirect(`/admin/artigos/${savedId}?rascunho=1`);
  } catch (error) {
    unstable_rethrow(error);
    return { ok: false, message: dbErrorMessage(error, "Não foi possível salvar o artigo agora.") };
  }
}

export async function deletePost(formData: FormData) {
  await requireEditor();
  const id = Number(read(formData, "id"));
  if (!id) redirect("/admin");
  await query("DELETE FROM posts WHERE id = $1", [id]);
  redirect("/admin");
}
