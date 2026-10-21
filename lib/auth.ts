import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

export const EDITOR_EMAILS = ["lucasvargaspi@gmail.com", "vitoriapalavroduarte@gmail.com"] as const;

const COOKIE = "mpen_editor";
const WEEK = 60 * 60 * 24 * 7;

export type Editor = {
  email: string;
  name: string;
};

function allowed(email: string) {
  return EDITOR_EMAILS.includes(email.toLowerCase() as (typeof EDITOR_EMAILS)[number]);
}

function secret() {
  const value = process.env.AUTH_SECRET || "";
  if (value.length < 16) {
    throw new Error("AUTH_SECRET ausente");
  }
  return value;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const current = Buffer.from(hash, "hex");
  if (current.length !== next.length) return false;
  return timingSafeEqual(current, next);
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function pack(email: string) {
  const exp = Date.now() + WEEK * 1000;
  const value = `${email}|${exp}`;
  return `${value}.${sign(value)}`;
}

function unpack(token: string): string | null {
  const cut = token.lastIndexOf(".");
  if (cut < 0) return null;
  const value = token.slice(0, cut);
  const proof = token.slice(cut + 1);
  const expected = sign(value);
  const a = Buffer.from(proof);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const [email, exp] = value.split("|");
  if (!email || !exp || Number(exp) < Date.now()) return null;
  if (!allowed(email)) return null;
  return email;
}

export async function findEditor(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!allowed(normalized)) return null;
  const rows = await query<{ email: string; name: string; password_hash: string }>(
    "SELECT email, name, password_hash FROM editors WHERE lower(email) = $1",
    [normalized],
  );
  return rows[0] ?? null;
}

export async function createEditorSession(email: string) {
  const jar = await cookies();
  jar.set(COOKIE, pack(email.toLowerCase()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}

export async function clearEditorSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getEditorSession(): Promise<Editor | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const email = unpack(token);
    if (!email) return null;
    const editor = await findEditor(email);
    if (!editor) return null;
    return { email: editor.email, name: editor.name };
  } catch {
    return null;
  }
}

export async function requireEditor() {
  const editor = await getEditorSession();
  if (!editor) redirect("/admin");
  return editor;
}
