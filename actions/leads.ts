"use server";

import { isLocale, type Locale } from "@/lib/i18n";
import { channelLabel, ui } from "@/lib/copy/ui";
import { contactChannel } from "@/lib/contacts";
import { query } from "@/lib/db";
import { sendContactEmail } from "@/lib/mail";

export type LeadState = { ok: boolean; message: string; received?: boolean };

function read(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const rawLocale = read(formData, "locale");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "pt";
  const copy = ui(locale).lead;
  const variant = read(formData, "variant") || "contact";
  const email = read(formData, "email");
  const source = read(formData, "source") || (variant === "newsletter" ? "newsletter" : "contato");
  const developmentSlug = read(formData, "development");

  if (!validEmail(email)) {
    return { ok: false, message: copy.invalidEmail };
  }

  let name = read(formData, "name");
  const phone = read(formData, "phone");
  const message = read(formData, "message");
  const developmentName = read(formData, "developmentName");
  const unit = read(formData, "unit");
  const creci = read(formData, "creci");
  const company = read(formData, "company");
  const channelId = source.startsWith("fale-") ? source.slice("fale-".length) : "";
  const channel = channelId ? contactChannel(channelId) : undefined;

  if (channel?.details === "aftersales") {
    if (phone.length < 8) return { ok: false, message: copy.phone };
    if (developmentName.length < 2) return { ok: false, message: copy.development };
    if (!unit) return { ok: false, message: copy.unit };
  }

  if (variant === "newsletter") {
    name = name || copy.subscriber;
  } else if (name.length < 2) {
    return { ok: false, message: copy.name };
  }

  const storedMessage = [
    developmentName ? `Empreendimento: ${developmentName}` : "",
    developmentName ? `Unidade: ${unit}` : "",
    creci ? `CRECI: ${creci}` : "",
    company ? `Imobiliária: ${company}` : "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await query(
      `INSERT INTO leads (name, email, phone, message, source, development_slug)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, phone, storedMessage, source, developmentSlug || null],
    );
  } catch {
    return { ok: false, message: copy.fail };
  }

  if (variant === "newsletter") {
    return { ok: true, message: copy.newsletter };
  }

  if (channel) {
    const comercial = contactChannel("comercial");
    const recipients = channel.emails?.length ? channel.emails : [channel.email];
    const cc =
      !channel.emails && comercial && !recipients.some((item) => item.toLowerCase() === comercial.email.toLowerCase())
        ? comercial.email
        : undefined;
    try {
      await sendContactEmail({
        to: recipients,
        cc,
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
        received: true,
        message: copy.emailFail,
      };
    }
    return { ok: true, received: true, message: `${copy.sentTo} ${channelLabel(channel.id, locale)}.` };
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
          creci,
          company,
        });
      } catch {
        return {
          ok: false,
          received: true,
          message: copy.emailFail,
        };
      }
      return {
        ok: true,
        received: true,
        message: copy.partnerOk,
      };
    }
  }

  return { ok: true, message: copy.received };
}
