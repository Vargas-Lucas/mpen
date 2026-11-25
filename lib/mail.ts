import { setDefaultResultOrder } from "node:dns";
import nodemailer from "nodemailer";

setDefaultResultOrder("ipv4first");

type Transporter = ReturnType<typeof nodemailer.createTransport>;

let transport: Transporter | null = null;
let transportKey = "";

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
  const key = `${host}:${port}:${user}`;
  if (!transport || transportKey !== key) {
    transport?.close();
    transportKey = key;
    transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user, pass },
      pool: true,
      maxConnections: 1,
      maxMessages: 100,
      connectionTimeout: 20_000,
      greetingTimeout: 20_000,
      socketTimeout: 30_000,
    });
  }
  return { transporter: transport, from };
}

function resetTransport() {
  transport?.close();
  transport = null;
  transportKey = "";
}

function canRetry(error: unknown) {
  const failure = error as { code?: string; responseCode?: number };
  const code = failure.code || "";
  const responseCode = failure.responseCode || 0;
  return ["ECONNECTION", "ETIMEDOUT", "ESOCKET", "EAI_AGAIN", "EDNS", "ECONNRESET"].includes(code) || [421, 450, 451, 452].includes(responseCode);
}

async function deliver(send: (transporter: Transporter, from: string) => Promise<unknown>) {
  let last: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const { transporter, from } = mailTransport();
    try {
      await send(transporter, from);
      return;
    } catch (error) {
      last = error;
      resetTransport();
      if (attempt === 3 || !canRetry(error)) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  throw last;
}

export async function sendContactEmail(input: ContactMail) {
  await deliver((transporter, from) => transporter.sendMail({
    from: `MPEN Incorporadora <${from}>`,
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
  }));
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
  await deliver((transporter, from) => transporter.sendMail({
    from: `MPEN Incorporadora <${from}>`,
    to: input.to,
    replyTo: input.email,
    subject: `Aprovar cadastro de ${input.name} — ${input.email}`,
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
  }));
}

export async function sendBrokerApprovedEmail(to: string, name: string, url: string) {
  await deliver((transporter, from) => transporter.sendMail({
    from: `MPEN Incorporadora <${from}>`,
    to,
    subject: `Cadastro aprovado — ${name}`,
    text: [
      `Olá, ${name}.`,
      "",
      "Seu cadastro no Canal do corretor foi aprovado. Você já pode entrar:",
      "",
      url,
      "",
      "MPEN Incorporadora",
    ].join("\n"),
  }));
}

export async function sendBrokerResetEmail(to: string, name: string, url: string) {
  await deliver((transporter, from) => transporter.sendMail({
    from: `MPEN Incorporadora <${from}>`,
    to,
    subject: `Redefinir senha — ${name}`,
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
  }));
}
