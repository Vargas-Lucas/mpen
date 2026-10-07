"use server";

import { query } from "@/lib/db";

export type LeadState = { ok: boolean; message: string };

function read(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const variant = read(formData, "variant") || "contact";
  const email = read(formData, "email");
  const source = read(formData, "source") || (variant === "newsletter" ? "newsletter" : "contato");
  const developmentSlug = read(formData, "development");

  if (!validEmail(email)) {
    return { ok: false, message: "Informe um e-mail válido." };
  }

  let name = read(formData, "name");
  const phone = read(formData, "phone");
  const message = read(formData, "message");

  if (variant === "newsletter") {
    name = name || "Assinante";
  } else if (name.length < 2) {
    return { ok: false, message: "Informe seu nome." };
  }

  try {
    await query(
      `INSERT INTO leads (name, email, phone, message, source, development_slug)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, phone, message, source, developmentSlug || null],
    );
  } catch {
    return { ok: false, message: "Não foi possível enviar agora. Tente de novo em instantes." };
  }

  if (variant === "newsletter") {
    return { ok: true, message: "Inscrição recebida. Você vai receber as novidades da MPEN." };
  }

  return { ok: true, message: "Mensagem recebida. Em breve a equipe da MPEN retorna o contato." };
}
