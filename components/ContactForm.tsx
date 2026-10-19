"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLead, type LeadState } from "@/actions/leads";

const initial: LeadState = { ok: false, message: "" };

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-solid" type="submit" disabled={pending}>
      {pending ? "Enviando..." : label}
    </button>
  );
}

export function ContactForm({
  source,
  variant = "contact",
  developmentSlug,
  fields = "contact",
  submitLabel = "Enviar",
}: {
  source: string;
  variant?: "contact" | "newsletter";
  developmentSlug?: string;
  fields?: "contact" | "aftersales" | "partner";
  submitLabel?: string;
}) {
  const [state, action] = useActionState(createLead, initial);

  if (variant === "newsletter") {
    return (
      <form className="form newsletter" action={action}>
        <input type="hidden" name="variant" value="newsletter" />
        <input type="hidden" name="source" value={source} />
        <label>
          <span className="sr-only">E-mail</span>
          <input name="email" type="email" required placeholder="Informe o seu e-mail" autoComplete="email" />
        </label>
        <Submit label="Cadastrar" />
        {state.message ? <p className={state.ok ? "ok" : "err"}>{state.message}</p> : null}
      </form>
    );
  }

  if (state.received) {
    const title =
      fields === "partner"
        ? state.ok
          ? "Cadastro enviado"
          : "Cadastro registrado"
        : state.ok
          ? "Mensagem enviada"
          : "Mensagem registrada";
    return (
      <div className={state.ok ? "form-success" : "form-success is-warning"} role="status">
        <h3>{title}</h3>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form className="form" action={action}>
      <input type="hidden" name="variant" value="contact" />
      <input type="hidden" name="source" value={source} />
      {developmentSlug ? <input type="hidden" name="development" value={developmentSlug} /> : null}
      <label>
        Nome
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        E-mail
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Telefone
        <input name="phone" type="tel" autoComplete="tel" required={fields === "aftersales"} />
      </label>
      {fields === "aftersales" ? (
        <>
          <label>
            Empreendimento
            <input name="developmentName" required />
          </label>
          <label>
            Unidade
            <input name="unit" required />
          </label>
        </>
      ) : null}
      {fields === "partner" ? (
        <>
          <label>
            CRECI
            <input name="creci" autoComplete="off" />
          </label>
          <label>
            Imobiliária
            <input name="company" autoComplete="organization" />
          </label>
        </>
      ) : null}
      <label>
        Mensagem
        <textarea name="message" />
      </label>
      <Submit label={submitLabel} />
      {state.message ? (
        <p className={state.ok ? "ok" : "err"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
