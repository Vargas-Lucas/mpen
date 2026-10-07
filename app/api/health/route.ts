import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query<{ ok: number }>("SELECT 1 AS ok");
  return NextResponse.json({ ok: rows[0]?.ok === 1 });
}
