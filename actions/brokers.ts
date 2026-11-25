"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth";
import {
  approveBroker,
  clearBrokerSession,
  createBrokerSession,
  findActiveBrokerReset,
  findBrokerApproval,
  findBrokerByEmail,
  issueBrokerApproval,
  issueBrokerReset,
  saveBrokerPassword,
} from "@/lib/broker-auth";
import { contactChannel } from "@/lib/contacts";
import { query } from "@/lib/db";
import { ensureBrokerSchema } from "@/lib/ensure-schema";
import { mailIsConfigured, sendBrokerApprovalRequest, sendBrokerApprovedEmail, sendBrokerResetEmail } from "@/lib/mail";

export type BrokerField = "name" | "cpf" | "creci" | "agency" | "phone" | "email" | "password" | "confirm";

export type BrokerState = {
  ok: boolean;
  message: string;
  field?: BrokerField;
};

function invalid(field: BrokerField, message: string): BrokerState {
  return { ok: false, message, field };
}

function read(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validCpf(value: string) {
  if (!/^\d{11}$/.test(value) || /^(\d)\1{10}$/.test(value)) return false;
  const check = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) sum += Number(value[index]) * (length + 1 - index);
    const mod = (sum * 10) % 11;
    return (mod === 10 ? 0 : mod) === Number(value[length]);
  };
  return check(9) && check(10);
}

export async function loginBroker(_state: BrokerState, formData: FormData): Promise<BrokerState> {
  const email = read(formData, "email").toLowerCase();
  const password = read(formData, "password");
  if (!email) return invalid("email", "Informe o e-mail.");
  if (!password) return invalid("password", "Informe a senha.");
  const broker = await findBrokerByEmail(email);
  if (!broker || !verifyPassword(password, broker.password_hash)) {
    return invalid("password", "E-mail ou senha não conferem.");
  }
  if (!broker.approved) {
    return { ok: false, message: "Seu cadastro ainda aguarda a aprovação da MPEN." };
  }
  await createBrokerSession(broker.email);
  redirect("/canal-do-corretor");
}

function formatCpf(value: string) {
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatPhone(value: string) {
  if (value.length === 11) return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  if (value.length === 10) return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
  return value;
}

export async function registerBroker(_state: BrokerState, formData: FormData): Promise<BrokerState> {
  const name = read(formData, "name");
  const cpf = digits(read(formData, "cpf"));
  const creci = read(formData, "creci");
  const agency = read(formData, "agency");
  const phone = digits(read(formData, "phone"));
  const email = read(formData, "email").toLowerCase();
  const password = read(formData, "password");
  const confirm = read(formData, "confirm");

  if (!name) return invalid("name", "Informe o nome completo.");
  if (!creci) return invalid("creci", "Informe o CRECI.");
  if (!agency) return invalid("agency", "Informe a imobiliária.");
  if (!validCpf(cpf)) return invalid("cpf", "Informe um CPF válido.");
  if (phone.length < 10) return invalid("phone", "Informe um telefone com DDD.");
  if (!validEmail(email)) return invalid("email", "Informe um e-mail válido.");
  if (password.length < 8) return invalid("password", "A senha precisa ter pelo menos 8 caracteres.");
  if (password !== confirm) return invalid("confirm", "A confirmação da senha não confere.");

  const comercial = contactChannel("comercial");
  if (!comercial) return { ok: false, message: "O envio de e-mail não está disponível agora. Tente mais tarde." };
  if (!mailIsConfigured()) {
    return { ok: false, message: "O envio de e-mail não está disponível agora. Tente mais tarde." };
  }

  await ensureBrokerSchema();
  const sameEmail = await findBrokerByEmail(email);
  if (sameEmail?.approved) return invalid("email", "Este e-mail já está cadastrado. Entre com a senha.");
  if (sameEmail) return invalid("email", "Este cadastro já foi enviado e aguarda a aprovação da MPEN.");
  const sameCpf = await query<{ id: number }>("SELECT id FROM brokers WHERE cpf = $1", [cpf]);
  if (sameCpf.length > 0) return invalid("cpf", "Este CPF já está cadastrado.");

  const created = await query<{ id: number }>(
    `INSERT INTO brokers (name, cpf, creci, agency, phone, email, password_hash, approved)
     VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE)
     RETURNING id`,
    [name, cpf, creci, agency, phone, email, hashPassword(password)],
  );
  const brokerId = created[0]?.id;
  if (!brokerId) return { ok: false, message: "Não foi possível enviar o cadastro agora. Tente de novo em instantes." };

  const token = await issueBrokerApproval(brokerId);
  try {
    const origin = await publicOrigin();
    await sendBrokerApprovalRequest({
      to: comercial.email,
      name,
      cpf: formatCpf(cpf),
      creci,
      agency,
      phone: formatPhone(phone),
      email,
      url: `${origin}/canal-do-corretor/aprovar?token=${encodeURIComponent(token)}`,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "falha desconhecida";
    console.error(`Falha ao enviar a aprovação de ${email}: ${reason}`);
    await query(`DELETE FROM brokers WHERE id = $1`, [brokerId]);
    return { ok: false, message: "Não foi possível enviar o cadastro agora. Tente de novo em instantes." };
  }
  return { ok: true, message: "Cadastro enviado. A MPEN vai analisar e liberar o seu acesso." };
}

const RESET_SENT = {
  ok: true,
  message: "Se este e-mail estiver cadastrado, enviamos um link para criar uma nova senha.",
};

const RESET_HOSTS = new Set(["localhost:8080", "127.0.0.1:8080", "mpen.com.br", "www.mpen.com.br", "teste.mpen.com.br"]);

async function publicOrigin() {
  const incoming = await headers();
  const host = (incoming.get("x-forwarded-host") || incoming.get("host") || "").split(",")[0].trim().toLowerCase();
  if (!RESET_HOSTS.has(host)) return "https://mpen.com.br";
  const proto = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${proto}://${host}`;
}

export async function requestBrokerReset(_state: BrokerState, formData: FormData): Promise<BrokerState> {
  const email = read(formData, "email").toLowerCase();
  if (!validEmail(email)) return invalid("email", "Informe um e-mail válido.");
  const broker = await findBrokerByEmail(email);
  if (!broker) return RESET_SENT;
  if (!mailIsConfigured()) {
    return { ok: false, message: "O envio de e-mail não está disponível agora. Tente mais tarde." };
  }
  const token = await issueBrokerReset(broker.id);
  try {
    const origin = await publicOrigin();
    await sendBrokerResetEmail(broker.email, broker.name, `${origin}/canal-do-corretor/redefinir?token=${encodeURIComponent(token)}`);
  } catch {
    await query(`DELETE FROM broker_password_resets WHERE broker_id = $1`, [broker.id]);
    return { ok: false, message: "Não foi possível enviar o e-mail agora. Tente de novo em instantes." };
  }
  return RESET_SENT;
}

export async function resetBrokerPassword(_state: BrokerState, formData: FormData): Promise<BrokerState> {
  const token = read(formData, "token");
  const password = read(formData, "password");
  const confirm = read(formData, "confirm");
  if (password.length < 8) return invalid("password", "A senha precisa ter pelo menos 8 caracteres.");
  if (password !== confirm) return invalid("confirm", "A confirmação da senha não confere.");
  const reset = await findActiveBrokerReset(token);
  if (!reset) return { ok: false, message: "Este link expirou ou já foi usado. Peça um novo." };
  await saveBrokerPassword(reset.broker_id, hashPassword(password));
  if (!reset.approved) {
    return { ok: true, message: "Senha atualizada. O acesso será liberado depois da aprovação da MPEN." };
  }
  await createBrokerSession(reset.email);
  redirect("/canal-do-corretor");
}

export async function approveBrokerRegistration(_state: BrokerState, formData: FormData): Promise<BrokerState> {
  const token = read(formData, "token");
  const approval = await findBrokerApproval(token);
  if (!approval) return { ok: false, message: "Este link expirou ou já foi usado." };
  if (!approval.approved) await approveBroker(approval.broker_id, approval.id);
  try {
    const origin = await publicOrigin();
    await sendBrokerApprovedEmail(approval.email, approval.name, `${origin}/canal-do-corretor`);
  } catch {
    return { ok: true, message: "Cadastro aprovado. O corretor já pode entrar no Canal do corretor." };
  }
  return { ok: true, message: "Cadastro aprovado. Avisamos o corretor por e-mail." };
}

export async function logoutBroker() {
  await clearBrokerSession();
  redirect("/canal-do-corretor");
}
