"use server";

import { contactChannel } from "@/lib/contacts";
import { query } from "@/lib/db";
import { sendContactEmail } from "@/lib/mail";

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
  const developmentName = read(formData, "developmentName");
  const unit = read(formData, "unit");
  const channelId = source.startsWith("fale-") ? source.slice("fale-".length) : "";
  const channel = channelId ? contactChannel(channelId) : undefined;

  if (channel?.details === "aftersales") {
    if (phone.length < 8) return { ok: false, message: "Informe o telefone." };
    if (developmentName.length < 2) return { ok: false, message: "Informe o empreendimento." };
    if (!unit) return { ok: false, message: "Informe a unidade." };
  }

  if (variant === "newsletter") {
    name = name || "Assinante";
  } else if (name.length < 2) {
    return { ok: false, message: "Informe seu nome." };
  }

  const storedMessage = developmentName
    ? [`Empreendimento: ${developmentName}`, `Unidade: ${unit}`, message].filter(Boolean).join("\n")
    : message;

  try {
    await query(
      `INSERT INTO leads (name, email, phone, message, source, development_slug)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, phone, storedMessage, source, developmentSlug || null],
    );
  } catch {
    return { ok: false, message: "Não foi possível enviar agora. Tente de novo em instantes." };
  }

  if (variant === "newsletter") {
    return { ok: true, message: "Inscrição recebida. Você vai receber as novidades da MPEN." };
  }

  if (channel) {
    const comercial = contactChannel("comercial");
    const recipients = channel.emails?.length ? channel.emails : [channel.email];
    const copy =
      !channel.emails && comercial && !recipients.some((item) => item.toLowerCase() === comercial.email.toLowerCase())
        ? comercial.email
        : undefined;
    try {
      await sendContactEmail({
        to: recipients,
        cc: copy,
        sector: channel.label,
        name,
        email,
        phone,
        message,
        developmentName,
        unit,
      });
    } catch {
      return {
        ok: false,
        message: "A mensagem foi registrada, mas o e-mail não saiu. Tente de novo em instantes.",
      };
    }
    return { ok: true, message: `Mensagem enviada para ${channel.label}.` };
  }

  if (source === "parceiro") {
    const comercial = contactChannel("comercial");
    if (comercial) {
      try {
        await sendContactEmail({
          to: comercial.email,
          sector: "Parceria comercial",
          name,
          email,
          phone,
          message,
        });
      } catch {
        return {
          ok: false,
          message: "A mensagem foi registrada, mas o e-mail não saiu. Tente de novo em instantes.",
        };
      }
      return { ok: true, message: "Cadastro enviado para o comercial." };
    }
  }

  return { ok: true, message: "Mensagem recebida. Em breve a equipe da MPEN retorna o contato." };
}
