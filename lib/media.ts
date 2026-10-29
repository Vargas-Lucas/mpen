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

const NAME_PATTERN = /^[a-z0-9][a-z0-9._-]*$/i;
const EXTENSION = /\.(jpg|jpeg|png|webp)$/i;

function mediaId(name: string) {
  const decoded = decodeURIComponent(name).trim();
  if (!NAME_PATTERN.test(decoded)) return "";
  const id = decoded.replace(EXTENSION, "");
  return NAME_PATTERN.test(id) ? id : "";
}

export async function saveBlogImage(file: File, slug: string) {
  await ensureBlogSchema();
  const ext = BLOG_IMAGE_TYPES[file.type];
  if (!ext) throw new Error("A imagem precisa ser JPG, PNG ou WebP.");
  if (file.size > MAX_BLOG_IMAGE) throw new Error("A imagem pode ter no máximo 5 MB.");

  const id = `${slug}-${Date.now()}`;
  const fileName = `${id}.${ext}`;
  const url = `/api/media/${id}`;
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
    await writeFile(path.join(dir, fileName), bytes);
  } catch {
    // Disk is optional. Hostinger wipes it on rebuild; Postgres keeps the file.
  }

  return url;
}

export async function readBlogImage(name: string) {
  const id = mediaId(name);
  if (!id) return null;
  await ensureBlogSchema();

  const rows = await query<{ mime: string; bytes: Buffer }>(
    `SELECT mime, bytes FROM media
     WHERE path = $1 OR path = $2 OR path LIKE $3 OR path LIKE $4
     ORDER BY CASE
       WHEN path = $1 THEN 0
       WHEN path LIKE $4 THEN 1
       ELSE 2
     END
     LIMIT 1`,
    [`/api/media/${id}`, `/images/blog/${id}`, `/images/blog/${id}.%`, `/api/media/${id}.%`],
  );
  if (rows[0]) return rows[0];

  const dir = path.join(process.cwd(), "public", "images", "blog");
  for (const fileName of [`${id}.jpg`, `${id}.jpeg`, `${id}.png`, `${id}.webp`]) {
    try {
      const bytes = await readFile(path.join(dir, fileName));
      const lower = fileName.toLowerCase();
      const mime = lower.endsWith(".png")
        ? "image/png"
        : lower.endsWith(".webp")
          ? "image/webp"
          : "image/jpeg";
      return { mime, bytes };
    } catch {
      /* try next extension */
    }
  }
  return null;
}
