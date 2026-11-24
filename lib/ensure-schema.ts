import { query } from "@/lib/db";

const DEFAULT_CATEGORIES = [
  ["MPEN", "mpen"],
  ["Empreendimentos", "empreendimentos"],
  ["Sul da Ilha", "sul-da-ilha"],
  ["Institucional", "institucional"],
  ["Novidades", "novidades"],
] as const;

let schemaReady = false;
let developmentSchemaReady = false;
let brokerSchemaReady = false;
let brokerResetSchemaReady = false;
let brokerApprovalSchemaReady = false;

export async function ensureBrokerSchema() {
  if (!brokerSchemaReady) {
    await query(`
      CREATE TABLE IF NOT EXISTS brokers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        creci TEXT NOT NULL,
        agency TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    brokerSchemaReady = true;
  }
  if (!brokerResetSchemaReady) {
    await query(`
      CREATE TABLE IF NOT EXISTS broker_password_resets (
        id SERIAL PRIMARY KEY,
        broker_id INT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
        token_hash TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    brokerResetSchemaReady = true;
  }
  if (brokerApprovalSchemaReady) return;
  await query(`ALTER TABLE brokers ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT TRUE`);
  await query(`
    CREATE TABLE IF NOT EXISTS broker_approvals (
      id SERIAL PRIMARY KEY,
      broker_id INT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
      token_hash TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  brokerApprovalSchemaReady = true;
}

export async function ensureDevelopmentSchema() {
  if (developmentSchemaReady) return;
  await query(`ALTER TABLE developments ADD COLUMN IF NOT EXISTS cover TEXT`);
  await query(`ALTER TABLE developments ADD COLUMN IF NOT EXISTS gallery JSONB`);
  await query(`ALTER TABLE developments ADD COLUMN IF NOT EXISTS story JSONB`);
  await query(`ALTER TABLE developments ADD COLUMN IF NOT EXISTS website TEXT NOT NULL DEFAULT ''`);
  developmentSchemaReady = true;
}

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
  await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_alt TEXT NOT NULL DEFAULT ''`).catch(() => undefined);
  await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_title TEXT NOT NULL DEFAULT ''`).catch(() => undefined);
  await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_description TEXT NOT NULL DEFAULT ''`).catch(() => undefined);
  await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_keyword TEXT NOT NULL DEFAULT ''`).catch(() => undefined);
  let translationsOk = true;
  try {
    await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb`);
  } catch {
    translationsOk = false;
  }
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
  if (translationsOk) schemaReady = true;
}

export function dbErrorMessage(error: unknown, fallback: string) {
  const text = error instanceof Error ? error.message : "";
  if (/unique|duplicate/i.test(text)) return "Já existe um registro com esse nome ou endereço.";
  if (/does not exist|undefined column/i.test(text)) {
    return "O banco ainda estava desatualizado. Recarregue a página e tente de novo.";
  }
  return fallback;
}
