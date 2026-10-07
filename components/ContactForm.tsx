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
}: {
  source: string;
  variant?: "contact" | "newsletter";
  developmentSlug?: string;
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
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label>
        Mensagem
        <textarea name="message" />
      </label>
      <Submit label="Enviar" />
      {state.message ? (
        <p className={state.ok ? "ok" : "err"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
