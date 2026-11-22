import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { ensureBrokerSchema } from "@/lib/ensure-schema";

const COOKIE = "mpen_broker";
const WEEK = 60 * 60 * 24 * 7;

export type BrokerSession = {
  id: number;
  name: string;
  email: string;
};

type BrokerRow = BrokerSession & {
  password_hash: string;
};

function secret() {
  const value = process.env.AUTH_SECRET || "";
  if (value.length < 16) throw new Error("AUTH_SECRET ausente");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function pack(email: string) {
  const value = `broker|${email}|${Date.now() + WEEK * 1000}`;
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
  const [kind, email, exp] = value.split("|");
  if (kind !== "broker" || !email || !exp || Number(exp) < Date.now()) return null;
  return email;
}

export async function findBrokerByEmail(email: string) {
  await ensureBrokerSchema();
  const rows = await query<BrokerRow>(
    "SELECT id, name, email, password_hash FROM brokers WHERE lower(email) = $1",
    [email.trim().toLowerCase()],
  );
  return rows[0] ?? null;
}

export async function createBrokerSession(email: string) {
  const jar = await cookies();
  jar.set(COOKIE, pack(email.trim().toLowerCase()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}

export async function clearBrokerSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getBrokerSession(): Promise<BrokerSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const email = unpack(token);
    if (!email) return null;
    const broker = await findBrokerByEmail(email);
    if (!broker) return null;
    return { id: broker.id, name: broker.name, email: broker.email };
  } catch {
    return null;
  }
}
