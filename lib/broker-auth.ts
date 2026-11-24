import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
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
  approved: boolean;
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
    "SELECT id, name, email, password_hash, approved FROM brokers WHERE lower(email) = $1",
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

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function issueBrokerReset(brokerId: number) {
  await ensureBrokerSchema();
  const token = randomBytes(32).toString("base64url");
  await query(`DELETE FROM broker_password_resets WHERE broker_id = $1`, [brokerId]);
  await query(
    `INSERT INTO broker_password_resets (broker_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
    [brokerId, hashToken(token)],
  );
  return token;
}

export async function findActiveBrokerReset(token: string) {
  await ensureBrokerSchema();
  if (!/^[A-Za-z0-9_-]{20,}$/.test(token)) return null;
  const rows = await query<{ id: number; broker_id: number; email: string; approved: boolean }>(
    `SELECT r.id, r.broker_id, b.email, b.approved
     FROM broker_password_resets r
     JOIN brokers b ON b.id = r.broker_id
     WHERE r.token_hash = $1 AND r.used_at IS NULL AND r.expires_at > NOW()`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
}

export type BrokerApproval = {
  id: number;
  broker_id: number;
  name: string;
  email: string;
  cpf: string;
  creci: string;
  agency: string;
  phone: string;
  approved: boolean;
};

export async function issueBrokerApproval(brokerId: number) {
  await ensureBrokerSchema();
  const token = randomBytes(32).toString("base64url");
  await query(`DELETE FROM broker_approvals WHERE broker_id = $1 AND used_at IS NULL`, [brokerId]);
  await query(
    `INSERT INTO broker_approvals (broker_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
    [brokerId, hashToken(token)],
  );
  return token;
}

export async function findBrokerApproval(token: string) {
  await ensureBrokerSchema();
  if (!/^[A-Za-z0-9_-]{20,}$/.test(token)) return null;
  const rows = await query<BrokerApproval>(
    `SELECT a.id, a.broker_id, b.name, b.email, b.cpf, b.creci, b.agency, b.phone, b.approved
     FROM broker_approvals a
     JOIN brokers b ON b.id = a.broker_id
     WHERE a.token_hash = $1 AND a.used_at IS NULL AND a.expires_at > NOW()`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
}

export async function approveBroker(brokerId: number, approvalId: number) {
  await query(`UPDATE brokers SET approved = TRUE WHERE id = $1`, [brokerId]);
  await query(`UPDATE broker_approvals SET used_at = NOW() WHERE id = $1`, [approvalId]);
}

export async function saveBrokerPassword(brokerId: number, passwordHash: string) {
  await query(`UPDATE brokers SET password_hash = $1 WHERE id = $2`, [passwordHash, brokerId]);
  await query(
    `UPDATE broker_password_resets SET used_at = NOW() WHERE broker_id = $1 AND used_at IS NULL`,
    [brokerId],
  );
}

export async function getBrokerSession(): Promise<BrokerSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const email = unpack(token);
    if (!email) return null;
    const broker = await findBrokerByEmail(email);
    if (!broker || !broker.approved) return null;
    return { id: broker.id, name: broker.name, email: broker.email };
  } catch {
    return null;
  }
}
