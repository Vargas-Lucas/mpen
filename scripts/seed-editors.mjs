import { randomBytes, scryptSync } from "crypto";
import pg from "pg";

const editors = [
  { email: "lucasvargaspi@gmail.com", name: "Lucas" },
  { email: "vitoriapalavroduarte@gmail.com", name: "Vitória" },
];

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function passwordFor(name) {
  const envKey = name === "Lucas" ? "EDITOR_LUCAS_PASSWORD" : "EDITOR_VITORIA_PASSWORD";
  return process.env[envKey] || `Mpen${name}${randomBytes(3).toString("hex")}`;
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

await pool.query(`
  CREATE TABLE IF NOT EXISTS editors (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);

for (const editor of editors) {
  const password = passwordFor(editor.name);
  const password_hash = hashPassword(password);
  await pool.query(
    `INSERT INTO editors (email, name, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash`,
    [editor.email, editor.name, password_hash],
  );
  console.log(`${editor.email} ${password}`);
}

await pool.end();
