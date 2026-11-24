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
  creci?: string;
  company?: string;
};

export function mailIsConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function mailTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP não configurado");
  }

  const from = "email@mpen.com.br";
  if (user.toLowerCase() !== from) {
    throw new Error("O envio do site precisa autenticar como email@mpen.com.br");
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
  });
  return { transporter, from };
}

export async function sendContactEmail(input: ContactMail) {
  const { transporter, from } = mailTransport();

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
      ...(input.creci ? [`CRECI: ${input.creci}`] : []),
      ...(input.company ? [`Imobiliária: ${input.company}`] : []),
      "",
      input.message || "Sem mensagem.",
    ].join("\n"),
  });
}

export async function sendBrokerApprovalRequest(input: {
  to: string;
  name: string;
  cpf: string;
  creci: string;
  agency: string;
  phone: string;
  email: string;
  url: string;
}) {
  const { transporter, from } = mailTransport();
  await transporter.sendMail({
    from,
    to: input.to,
    replyTo: input.email,
    subject: "Aprovar cadastro — Canal do corretor",
    text: [
      "Há um novo cadastro no Canal do corretor aguardando aprovação.",
      "",
      `Nome: ${input.name}`,
      `CPF: ${input.cpf}`,
      `CRECI: ${input.creci}`,
      `Imobiliária: ${input.agency}`,
      `Telefone: ${input.phone}`,
      `E-mail: ${input.email}`,
      "",
      "Para liberar o acesso, abra o link:",
      input.url,
      "",
      "O link vale por 30 dias.",
      "",
      "MPEN Incorporadora",
    ].join("\n"),
  });
}

export async function sendBrokerApprovedEmail(to: string, name: string, url: string) {
  const { transporter, from } = mailTransport();
  await transporter.sendMail({
    from,
    to,
    subject: "Cadastro aprovado — Canal do corretor",
    text: [
      `Olá, ${name}.`,
      "",
      "Seu cadastro no Canal do corretor foi aprovado. Você já pode entrar:",
      "",
      url,
      "",
      "MPEN Incorporadora",
    ].join("\n"),
  });
}

export async function sendBrokerResetEmail(to: string, name: string, url: string) {
  const { transporter, from } = mailTransport();
  await transporter.sendMail({
    from,
    to,
    subject: "Redefinir senha do Canal do corretor",
    text: [
      `Olá, ${name}.`,
      "",
      "Recebemos um pedido para redefinir a senha do Canal do corretor.",
      "Abra o link abaixo para criar uma nova senha. Ele vale por 1 hora:",
      "",
      url,
      "",
      "Se você não pediu isso, ignore este e-mail.",
      "",
      "MPEN Incorporadora",
    ].join("\n"),
  });
}
