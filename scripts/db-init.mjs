import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Defina DATABASE_URL (connection string do Postgres).");
  process.exit(1);
}

const root = path.dirname(fileURLToPath(import.meta.url));
const sql = fs.readFileSync(path.join(root, "..", "db", "init.sql"), "utf8");

const pool = new pg.Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await pool.query(sql);
  console.log("Tabelas e empreendimentos criados.");
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
} finally {
  await pool.end();
}
