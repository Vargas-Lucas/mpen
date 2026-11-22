"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { requireEditor } from "@/lib/auth";
import { query } from "@/lib/db";
import { dbErrorMessage, ensureDevelopmentSchema } from "@/lib/ensure-schema";
import { slugify } from "@/lib/slug";
import type { DevelopmentStory } from "@/lib/types";

export type DevelopmentState = { ok: boolean; message: string };

const STATUSES = new Set(["lancamento", "construcao", "entregue"]);

function read(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function safeImage(value: string) {
  if (value.startsWith("/api/media/") || value.startsWith("/images/")) return value;
  return "";
}

function safeWebsite(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    return "";
  }
  return "";
}

function storyFrom(formData: FormData): DevelopmentStory {
  const description = String(formData.get("description") || "").replace(/\r\n/g, "\n").trim();
  const parts = description
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  const title = parts.length > 1 && parts[0].length <= 140 ? parts[0] : "";
  const body = (title ? parts.slice(1) : parts).join("\n\n");
  const empty = { title: "", body: "" };
  return {
    note: formData.get("story_note") === "on",
    pt: { title, body },
    en: empty,
    es: empty,
  };
}

async function uniqueSlug(base: string) {
  const root = slugify(base);
  let slug = root;
  let n = 2;
  while (true) {
    const rows = await query<{ id: number }>("SELECT id FROM developments WHERE slug = $1", [slug]);
    if (rows.length === 0) return slug;
    slug = `${root}-${n}`;
    n += 1;
  }
}

export async function saveDevelopment(_prev: DevelopmentState, formData: FormData): Promise<DevelopmentState> {
  await requireEditor();
  try {
    await ensureDevelopmentSchema();
    const id = Number(read(formData, "id")) || 0;
    const name = read(formData, "name");
    if (name.length < 2) return { ok: false, message: "Informe o nome do empreendimento." };
    const status = read(formData, "status");
    if (!STATUSES.has(status)) return { ok: false, message: "Escolha a situação do empreendimento." };

    const websiteRaw = read(formData, "website");
    const website = safeWebsite(websiteRaw);
    if (websiteRaw && !website) return { ok: false, message: "O site precisa começar com http:// ou https://." };

    const cover = safeImage(read(formData, "cover"));
    const gallery = [
      ...new Set(
        formData
          .getAll("gallery")
          .map((item) => safeImage(String(item)))
          .filter(Boolean),
      ),
    ];
    const story = storyFrom(formData);
    const featured = formData.get("featured") === "on";
    const fields = [
      name,
      status,
      read(formData, "neighborhood"),
      read(formData, "city") || "Florianópolis",
      read(formData, "typology"),
      read(formData, "area"),
      read(formData, "summary"),
      read(formData, "delivery"),
      featured,
      website,
      cover,
      JSON.stringify(gallery),
      JSON.stringify(story),
    ];

    if (id) {
      const existing = await query<{ id: number }>("SELECT id FROM developments WHERE id = $1", [id]);
      if (!existing[0]) return { ok: false, message: "Empreendimento não encontrado." };
      await query(
        `UPDATE developments
         SET name = $1, status = $2, neighborhood = $3, city = $4, typology = $5, area = $6,
             summary = $7, delivery = $8, featured = $9, website = $10,
             cover = $11, gallery = $12::jsonb, story = $13::jsonb
         WHERE id = $14`,
        [...fields, id],
      );
      redirect(`/admin/empreendimentos/${id}?salvo=1`);
    }

    const slug = await uniqueSlug(read(formData, "slug") || name);
    const rows = await query<{ id: number }>(
      `INSERT INTO developments
        (name, slug, status, neighborhood, city, typology, area, summary, delivery, featured, website, cover, gallery, story)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14::jsonb)
       RETURNING id`,
      [fields[0], slug, fields[1], fields[2], fields[3], fields[4], fields[5], fields[6], fields[7], fields[8], fields[9], fields[10], fields[11], fields[12]],
    );
    redirect(`/admin/empreendimentos/${rows[0].id}?salvo=1`);
  } catch (error) {
    unstable_rethrow(error);
    return { ok: false, message: dbErrorMessage(error, "Não foi possível salvar o empreendimento.") };
  }
}
