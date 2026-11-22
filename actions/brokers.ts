"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { clearBrokerSession, createBrokerSession, findBrokerByEmail } from "@/lib/broker-auth";
import { query } from "@/lib/db";
import { ensureBrokerSchema } from "@/lib/ensure-schema";

export type BrokerState = { ok: boolean; message: string };

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
  if (!email || !password) return { ok: false, message: "Preencha o e-mail e a senha." };
  const broker = await findBrokerByEmail(email);
  if (!broker || !verifyPassword(password, broker.password_hash)) {
    return { ok: false, message: "E-mail ou senha não conferem." };
  }
  await createBrokerSession(broker.email);
  redirect("/canal-do-corretor");
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

  if (!name || !creci || !agency) return { ok: false, message: "Preencha todos os campos." };
  if (!validCpf(cpf)) return { ok: false, message: "Informe um CPF válido." };
  if (phone.length < 10) return { ok: false, message: "Informe um telefone com DDD." };
  if (!validEmail(email)) return { ok: false, message: "Informe um e-mail válido." };
  if (password.length < 8) return { ok: false, message: "A senha precisa ter pelo menos 8 caracteres." };
  if (password !== confirm) return { ok: false, message: "A confirmação da senha não confere." };

  await ensureBrokerSchema();
  const sameEmail = await findBrokerByEmail(email);
  if (sameEmail) return { ok: false, message: "Este e-mail já está cadastrado. Entre com a senha." };
  const sameCpf = await query<{ id: number }>("SELECT id FROM brokers WHERE cpf = $1", [cpf]);
  if (sameCpf.length > 0) return { ok: false, message: "Este CPF já está cadastrado." };

  await query(
    `INSERT INTO brokers (name, cpf, creci, agency, phone, email, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [name, cpf, creci, agency, phone, email, hashPassword(password)],
  );
  await createBrokerSession(email);
  redirect("/canal-do-corretor");
}

export async function logoutBroker() {
  await clearBrokerSession();
  redirect("/canal-do-corretor");
}
