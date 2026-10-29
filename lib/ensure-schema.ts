import { query } from "@/lib/db";

const DEFAULT_CATEGORIES = [
  ["MPEN", "mpen"],
  ["Empreendimentos", "empreendimentos"],
  ["Sul da Ilha", "sul-da-ilha"],
  ["Institucional", "institucional"],
  ["Novidades", "novidades"],
] as const;

let schemaReady = false;

export async function ensureBlogSchema() {
  if (schemaReady) return;
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_alt TEXT NOT NULL DEFAULT ''`);
  await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_title TEXT NOT NULL DEFAULT ''`);
  await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_description TEXT NOT NULL DEFAULT ''`);
  await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_keyword TEXT NOT NULL DEFAULT ''`);
  await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb`);
  await query(`
    CREATE TABLE IF NOT EXISTS media (
      id SERIAL PRIMARY KEY,
      path TEXT UNIQUE NOT NULL,
      mime TEXT NOT NULL,
      bytes BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  for (const [name, slug] of DEFAULT_CATEGORIES) {
    await query(
      `INSERT INTO categories (name, slug)
       SELECT $1, $2
       WHERE NOT EXISTS (SELECT 1 FROM categories WHERE lower(name) = lower($1) OR slug = $2)`,
      [name, slug],
    );
  }
  schemaReady = true;
}

export function dbErrorMessage(error: unknown, fallback: string) {
  const text = error instanceof Error ? error.message : "";
  if (/unique|duplicate/i.test(text)) return "Já existe um registro com esse nome ou endereço.";
  if (/does not exist|undefined column/i.test(text)) {
    return "O banco ainda estava desatualizado. Recarregue a página e tente de novo.";
  }
  return fallback;
}
