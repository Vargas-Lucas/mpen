import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { query } from "@/lib/db";
import { ensureBlogSchema } from "@/lib/ensure-schema";

export const BLOG_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const MAX_BLOG_IMAGE = 5 * 1024 * 1024;

const NAME_PATTERN = /^[a-z0-9][a-z0-9._-]*\.(jpg|jpeg|png|webp)$/i;

export async function saveBlogImage(file: File, slug: string) {
  await ensureBlogSchema();
  const ext = BLOG_IMAGE_TYPES[file.type];
  if (!ext) throw new Error("A imagem precisa ser JPG, PNG ou WebP.");
  if (file.size > MAX_BLOG_IMAGE) throw new Error("A imagem pode ter no máximo 5 MB.");

  const name = `${slug}-${Date.now()}.${ext}`;
  const url = `/images/blog/${name}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await query(
    `INSERT INTO media (path, mime, bytes)
     VALUES ($1, $2, $3)
     ON CONFLICT (path) DO UPDATE SET mime = EXCLUDED.mime, bytes = EXCLUDED.bytes`,
    [url, file.type, bytes],
  );

  try {
    const dir = path.join(process.cwd(), "public", "images", "blog");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
  } catch {
    // Disk is optional. Hostinger wipes it on rebuild; Postgres keeps the file.
  }

  return url;
}

export async function readBlogImage(name: string) {
  if (!NAME_PATTERN.test(name)) return null;
  await ensureBlogSchema();

  const url = `/images/blog/${name}`;
  const rows = await query<{ mime: string; bytes: Buffer }>(
    "SELECT mime, bytes FROM media WHERE path = $1",
    [url],
  );
  if (rows[0]) return rows[0];

  try {
    const bytes = await readFile(path.join(process.cwd(), "public", "images", "blog", name));
    const lower = name.toLowerCase();
    const mime = lower.endsWith(".png")
      ? "image/png"
      : lower.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";
    return { mime, bytes };
  } catch {
    return null;
  }
}
