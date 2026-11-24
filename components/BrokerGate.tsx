"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginBroker, registerBroker, requestBrokerReset, type BrokerState } from "@/actions/brokers";

const initial: BrokerState = { ok: false, message: "" };

function Required({ children }: { children: string }) {
  return (
    <span>
      {children}
      <abbr className="req" title="obrigatório">
        *
      </abbr>
    </span>
  );
}

function Submit({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-solid" type="submit" disabled={pending}>
      {pending ? "Enviando…" : children}
    </button>
  );
}

function Notice({ state }: { state: BrokerState }) {
  if (!state.message) return null;
  return <p className={state.ok ? "ok" : "err"}>{state.message}</p>;
}

export function BrokerGate() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [loginState, loginAction] = useActionState(loginBroker, initial);
  const [registerState, registerAction] = useActionState(registerBroker, initial);
  const [resetState, resetAction] = useActionState(requestBrokerReset, initial);

  return (
    <div className="broker-gate">
      <div className="broker-switch" role="tablist" aria-label="Acesso do corretor">
        <button type="button" className={mode !== "register" ? "is-on" : ""} onClick={() => setMode("login")}>
          Já me cadastrei
        </button>
        <button type="button" className={mode === "register" ? "is-on" : ""} onClick={() => setMode("register")}>
          Não possuo cadastro
        </button>
      </div>

      {mode === "forgot" ? (
        <form className="form" action={resetAction}>
          <p className="broker-note">Informe o e-mail do cadastro. Enviaremos um link para criar uma nova senha.</p>
          <p className="form-required">* campo obrigatório</p>
          <label>
            <Required>E-mail</Required>
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <Notice state={resetState} />
          <Submit>Enviar link</Submit>
          <button className="broker-forgot" type="button" onClick={() => setMode("login")}>
            Voltar ao login
          </button>
        </form>
      ) : mode === "login" ? (
        <form className="form" action={loginAction}>
          <p className="form-required">* campo obrigatório</p>
          <label>
            <Required>E-mail</Required>
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            <Required>Senha</Required>
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="broker-forgot" type="button" onClick={() => setMode("forgot")}>
            Esqueceu a senha?
          </button>
          <Notice state={loginState} />
          <Submit>Entrar</Submit>
        </form>
      ) : (
        <form className="form" action={registerAction}>
          <p className="form-required">* campo obrigatório</p>
          <label>
            <Required>Nome completo</Required>
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            <Required>CPF</Required>
            <input name="cpf" inputMode="numeric" autoComplete="off" required />
          </label>
          <label>
            <Required>CRECI</Required>
            <input name="creci" autoComplete="off" required />
          </label>
          <label>
            <Required>Imobiliária</Required>
            <input name="agency" autoComplete="organization" required />
          </label>
          <label>
            <Required>Telefone de contato</Required>
            <input name="phone" type="tel" autoComplete="tel" required />
          </label>
          <label>
            <Required>E-mail vinculado à imobiliária</Required>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <Required>Senha</Required>
            <input name="password" type="password" autoComplete="new-password" minLength={8} required />
          </label>
          <label>
            <Required>Confirmar senha</Required>
            <input name="confirm" type="password" autoComplete="new-password" minLength={8} required />
          </label>
          <Notice state={registerState} />
          <Submit>Cadastrar</Submit>
        </form>
      )}
    </div>
  );
}
