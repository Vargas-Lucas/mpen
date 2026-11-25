"use client";

import { startTransition, useActionState, useLayoutEffect, useState, type FormEvent } from "react";
import { loginBroker, registerBroker, requestBrokerReset, type BrokerField, type BrokerState } from "@/actions/brokers";
import { PasswordField } from "@/components/PasswordField";

const initial: BrokerState = { ok: false, message: "" };

const emptyRegister = {
  name: "",
  cpf: "",
  creci: "",
  agency: "",
  phone: "",
  email: "",
  password: "",
  confirm: "",
};

type RegisterValues = typeof emptyRegister;

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

function Submit({ children, pending }: { children: string; pending: boolean }) {
  return (
    <button className="btn btn-solid" type="submit" disabled={pending}>
      {pending ? "Enviando…" : children}
    </button>
  );
}

function submitForm(event: FormEvent<HTMLFormElement>, action: (payload: FormData) => void) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  startTransition(() => {
    action(data);
  });
}

function Notice({ state }: { state: BrokerState }) {
  if (!state.message || state.field) return null;
  return <p className={state.ok ? "ok" : "err"}>{state.message}</p>;
}

function fieldInvalid(state: BrokerState, field: BrokerField) {
  return Boolean(state.message) && !state.ok && state.field === field;
}

function FieldError({ state, field, id }: { state: BrokerState; field: BrokerField; id: string }) {
  if (!fieldInvalid(state, field)) return null;
  return (
    <span className="field-error" id={id} role="alert">
      {state.message}
    </span>
  );
}

function maskCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function maskPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length > 11) digits = digits.slice(2);
  digits = digits.slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length < 3) return `(${digits}`;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (digits.length < 7) return `(${ddd}) ${rest}`;
  if (digits.length < 11) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

function clearField<T extends Record<string, string>>(current: T, field: string | undefined) {
  if (!field || !(field in current) || current[field] === "") return current;
  return { ...current, [field]: "" };
}

export function BrokerGate() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [registerValues, setRegisterValues] = useState<RegisterValues>(emptyRegister);
  const [loginState, loginAction, loginPending] = useActionState(loginBroker, initial);
  const [registerState, registerAction, registerPending] = useActionState(registerBroker, initial);
  const [resetState, resetAction, resetPending] = useActionState(requestBrokerReset, initial);

  useLayoutEffect(() => {
    if (loginState.ok || !loginState.field) return;
    if (loginState.field === "email") setLoginEmail("");
    if (loginState.field === "password") setLoginPassword("");
    document.querySelector<HTMLInputElement>(`.broker-gate form[data-form="login"] [data-field="${loginState.field}"]`)?.focus();
  }, [loginState]);

  useLayoutEffect(() => {
    if (resetState.ok || resetState.field !== "email") return;
    setForgotEmail("");
    document.querySelector<HTMLInputElement>(`.broker-gate form[data-form="forgot"] [data-field="email"]`)?.focus();
  }, [resetState]);

  useLayoutEffect(() => {
    if (registerState.ok || !registerState.field) return;
    const field = registerState.field;
    setRegisterValues((current) => clearField(current, field));
    document.querySelector<HTMLInputElement>(`.broker-gate form[data-form="register"] [data-field="${field}"]`)?.focus();
  }, [registerState]);

  function setRegister<K extends keyof RegisterValues>(key: K, value: RegisterValues[K]) {
    setRegisterValues((current) => ({ ...current, [key]: value }));
  }

  const loginEmailInvalid = fieldInvalid(loginState, "email");
  const loginPasswordInvalid = fieldInvalid(loginState, "password");

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
        <form className="form" data-form="forgot" onSubmit={(event) => submitForm(event, resetAction)}>
          <p className="broker-note">Informe o e-mail do cadastro. Enviaremos um link para criar uma nova senha.</p>
          <p className="form-required">* campo obrigatório</p>
          <label>
            <Required>E-mail</Required>
            <input
              name="email"
              data-field="email"
              type="email"
              autoComplete="username"
              required
              value={forgotEmail}
              className={fieldInvalid(resetState, "email") ? "is-invalid" : undefined}
              aria-invalid={fieldInvalid(resetState, "email") || undefined}
              aria-describedby={fieldInvalid(resetState, "email") ? "forgot-email-error" : undefined}
              onChange={(event) => setForgotEmail(event.target.value)}
            />
            <FieldError state={resetState} field="email" id="forgot-email-error" />
          </label>
          <Notice state={resetState} />
          <Submit pending={resetPending}>Enviar link</Submit>
          <button className="broker-forgot" type="button" onClick={() => setMode("login")}>
            Voltar ao login
          </button>
        </form>
      ) : mode === "login" ? (
        <form className="form" data-form="login" onSubmit={(event) => submitForm(event, loginAction)}>
          <p className="form-required">* campo obrigatório</p>
          <label>
            <Required>E-mail</Required>
            <input
              name="email"
              data-field="email"
              type="email"
              autoComplete="username"
              required
              value={loginEmail}
              aria-invalid={loginEmailInvalid || undefined}
              aria-describedby={loginEmailInvalid ? "login-email-error" : undefined}
              className={loginEmailInvalid ? "is-invalid" : undefined}
              onChange={(event) => setLoginEmail(event.target.value)}
            />
            <FieldError state={loginState} field="email" id="login-email-error" />
          </label>
          <label>
            <Required>Senha</Required>
            <PasswordField
              name="password"
              autoComplete="current-password"
              value={loginPassword}
              onChange={setLoginPassword}
              invalid={loginPasswordInvalid}
              describedBy={loginPasswordInvalid ? "login-password-error" : undefined}
            />
            <FieldError state={loginState} field="password" id="login-password-error" />
          </label>
          <button className="broker-forgot" type="button" onClick={() => setMode("forgot")}>
            Esqueceu a senha?
          </button>
          <Notice state={loginState} />
          <Submit pending={loginPending}>Entrar</Submit>
        </form>
      ) : registerState.ok ? (
        <div className="form-success" role="status">
          <h3>Cadastro enviado</h3>
          <p>A MPEN vai analisar e liberar o seu acesso.</p>
          <button className="btn btn-solid" type="button" onClick={() => setMode("login")}>
            Ir para o login
          </button>
        </div>
      ) : (
        <form className="form" data-form="register" onSubmit={(event) => submitForm(event, registerAction)}>
          <p className="form-required">* campo obrigatório</p>
          <label>
            <Required>Nome completo</Required>
            <input
              name="name"
              data-field="name"
              autoComplete="name"
              required
              value={registerValues.name}
              aria-invalid={fieldInvalid(registerState, "name") || undefined}
              aria-describedby={fieldInvalid(registerState, "name") ? "register-name-error" : undefined}
              className={fieldInvalid(registerState, "name") ? "is-invalid" : undefined}
              onChange={(event) => setRegister("name", event.target.value)}
            />
            <FieldError state={registerState} field="name" id="register-name-error" />
          </label>
          <label>
            <Required>CPF</Required>
            <input
              name="cpf"
              data-field="cpf"
              inputMode="numeric"
              autoComplete="off"
              required
              maxLength={14}
              placeholder="000.000.000-00"
              value={registerValues.cpf}
              aria-invalid={fieldInvalid(registerState, "cpf") || undefined}
              aria-describedby={fieldInvalid(registerState, "cpf") ? "register-cpf-error" : undefined}
              className={fieldInvalid(registerState, "cpf") ? "is-invalid" : undefined}
              onChange={(event) => setRegister("cpf", maskCpf(event.target.value))}
            />
            <FieldError state={registerState} field="cpf" id="register-cpf-error" />
          </label>
          <label>
            <Required>CRECI</Required>
            <input
              name="creci"
              data-field="creci"
              autoComplete="off"
              required
              value={registerValues.creci}
              aria-invalid={fieldInvalid(registerState, "creci") || undefined}
              aria-describedby={fieldInvalid(registerState, "creci") ? "register-creci-error" : undefined}
              className={fieldInvalid(registerState, "creci") ? "is-invalid" : undefined}
              onChange={(event) => setRegister("creci", event.target.value)}
            />
            <FieldError state={registerState} field="creci" id="register-creci-error" />
          </label>
          <label>
            <Required>Imobiliária</Required>
            <input
              name="agency"
              data-field="agency"
              autoComplete="organization"
              required
              value={registerValues.agency}
              aria-invalid={fieldInvalid(registerState, "agency") || undefined}
              aria-describedby={fieldInvalid(registerState, "agency") ? "register-agency-error" : undefined}
              className={fieldInvalid(registerState, "agency") ? "is-invalid" : undefined}
              onChange={(event) => setRegister("agency", event.target.value)}
            />
            <FieldError state={registerState} field="agency" id="register-agency-error" />
          </label>
          <label>
            <Required>Telefone de contato</Required>
            <span className={fieldInvalid(registerState, "phone") ? "phone-field is-invalid" : "phone-field"}>
              <span className="phone-prefix">+55</span>
              <input
                name="phone"
                data-field="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                required
                maxLength={22}
                placeholder="(00) 00000-0000"
                value={registerValues.phone}
                aria-invalid={fieldInvalid(registerState, "phone") || undefined}
                aria-describedby={fieldInvalid(registerState, "phone") ? "register-phone-error" : undefined}
                onChange={(event) => setRegister("phone", maskPhone(event.target.value))}
              />
            </span>
            <FieldError state={registerState} field="phone" id="register-phone-error" />
          </label>
          <label>
            <Required>E-mail vinculado à imobiliária</Required>
            <input
              name="email"
              data-field="email"
              type="email"
              autoComplete="email"
              required
              value={registerValues.email}
              aria-invalid={fieldInvalid(registerState, "email") || undefined}
              aria-describedby={fieldInvalid(registerState, "email") ? "register-email-error" : undefined}
              className={fieldInvalid(registerState, "email") ? "is-invalid" : undefined}
              onChange={(event) => setRegister("email", event.target.value)}
            />
            <FieldError state={registerState} field="email" id="register-email-error" />
          </label>
          <label>
            <Required>Senha</Required>
            <PasswordField
              name="password"
              autoComplete="new-password"
              value={registerValues.password}
              onChange={(value) => setRegister("password", value)}
              invalid={fieldInvalid(registerState, "password")}
              describedBy={fieldInvalid(registerState, "password") ? "register-password-error" : "register-password-hint"}
            />
            {fieldInvalid(registerState, "password") ? (
              <FieldError state={registerState} field="password" id="register-password-error" />
            ) : (
              <span className="field-hint" id="register-password-hint">
                Mínimo de 8 caracteres.
              </span>
            )}
          </label>
          <label>
            <Required>Confirmar senha</Required>
            <PasswordField
              name="confirm"
              autoComplete="new-password"
              value={registerValues.confirm}
              onChange={(value) => setRegister("confirm", value)}
              invalid={fieldInvalid(registerState, "confirm")}
              describedBy={fieldInvalid(registerState, "confirm") ? "register-confirm-error" : undefined}
            />
            <FieldError state={registerState} field="confirm" id="register-confirm-error" />
          </label>
          <Notice state={registerState} />
          <Submit pending={registerPending}>Cadastrar</Submit>
        </form>
      )}
    </div>
  );
}
