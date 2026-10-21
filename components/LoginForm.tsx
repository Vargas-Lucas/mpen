"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginEditor, type LoginState } from "@/actions/auth";

const initial: LoginState = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="admin-submit" type="submit" disabled={pending}>
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(loginEditor, initial);

  return (
    <form className="form admin-form" action={action}>
      <label>
        E-mail
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label>
        Senha
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <Submit />
      {state.message ? (
        <p className="err" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
