import nodemailer from "nodemailer";

type ContactMail = {
  to: string | string[];
  cc?: string;
  sector: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  developmentName?: string;
  unit?: string;
};

export function mailIsConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendContactEmail(input: ContactMail) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP não configurado");
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const from = process.env.SMTP_FROM || user;
  if (!from.toLowerCase().endsWith("@mpen.net.br")) {
    throw new Error("O remetente do site precisa ser um e-mail @mpen.net.br");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: input.to,
    cc: input.cc,
    replyTo: input.email,
    subject: `Contato pelo site — ${input.sector}`,
    text: [
      `Setor: ${input.sector}`,
      `Nome: ${input.name}`,
      `E-mail: ${input.email}`,
      `Telefone: ${input.phone || "não informado"}`,
      ...(input.developmentName ? [`Empreendimento: ${input.developmentName}`, `Unidade: ${input.unit || "não informada"}`] : []),
      "",
      input.message || "Sem mensagem.",
    ].join("\n"),
  });
}
