"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { requireEditor } from "@/lib/auth";
import { query } from "@/lib/db";
import { dbErrorMessage, ensureBlogSchema } from "@/lib/ensure-schema";
import { slugify } from "@/lib/slug";

export type CategoryState = { ok: boolean; name?: string; message: string };

function read(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

async function uniqueCategorySlug(base: string, exceptId?: number) {
  let slug = base;
  let n = 2;
  while (true) {
    const rows = exceptId
      ? await query<{ id: number }>("SELECT id FROM categories WHERE slug = $1 AND id <> $2", [slug, exceptId])
      : await query<{ id: number }>("SELECT id FROM categories WHERE slug = $1", [slug]);
    if (rows.length === 0) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

export async function ensureCategory(name: string) {
  await ensureBlogSchema();
  const trimmed = name.trim();
  if (trimmed.length < 2) return trimmed;
  const existing = await query<{ name: string }>(
    "SELECT name FROM categories WHERE lower(name) = lower($1)",
    [trimmed],
  );
  if (existing[0]) return existing[0].name;
  const slug = await uniqueCategorySlug(slugify(trimmed) || "categoria");
  await query("INSERT INTO categories (name, slug) VALUES ($1, $2)", [trimmed, slug]);
  return trimmed;
}

export async function createCategory(_prev: CategoryState, formData: FormData): Promise<CategoryState> {
  await requireEditor();
  const name = read(formData, "name");
  if (name.length < 2) {
    return { ok: false, message: "Informe um nome com pelo menos 2 caracteres." };
  }

  try {
    const saved = await ensureCategory(name);
    if (read(formData, "stay") === "1") {
      return { ok: true, name: saved, message: "" };
    }
  } catch (error) {
    return { ok: false, message: dbErrorMessage(error, "Não foi possível criar a categoria agora.") };
  }

  redirect("/admin/categorias?salvo=1");
}

export async function deleteCategory(formData: FormData) {
  await requireEditor();
  const id = Number(read(formData, "id"));
  if (!id) redirect("/admin/categorias");

  try {
    await ensureBlogSchema();
    const rows = await query<{ name: string; posts: number }>(
      `SELECT c.name, COUNT(p.id)::int AS posts
       FROM categories c
       LEFT JOIN posts p ON p.category = c.name
       WHERE c.id = $1
       GROUP BY c.name`,
      [id],
    );
    const current = rows[0];
    if (!current) redirect("/admin/categorias");
    if (current.posts > 0) redirect("/admin/categorias?uso=1");

    await query("DELETE FROM categories WHERE id = $1", [id]);
  } catch (error) {
    unstable_rethrow(error);
    redirect("/admin/categorias");
  }
  redirect("/admin/categorias");
}
