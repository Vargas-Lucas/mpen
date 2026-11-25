"use client";

import { startTransition, useActionState, useLayoutEffect, useState, type FormEvent } from "react";
import { resetBrokerPassword, type BrokerState } from "@/actions/brokers";
import { PasswordField } from "@/components/PasswordField";

const initial: BrokerState = { ok: false, message: "" };

function Submit({ pending }: { pending: boolean }) {
  return (
    <button className="btn btn-solid" type="submit" disabled={pending}>
      {pending ? "Enviando…" : "Salvar nova senha"}
    </button>
  );
}

export function BrokerResetForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, action, pending] = useActionState(resetBrokerPassword, initial);
  const passwordInvalid = Boolean(state.message) && !state.ok && state.field === "password";
  const confirmInvalid = Boolean(state.message) && !state.ok && state.field === "confirm";

  useLayoutEffect(() => {
    if (state.ok || !state.field) return;
    if (state.field === "password") setPassword("");
    if (state.field === "confirm") setConfirm("");
    document.querySelector<HTMLInputElement>(`.broker-gate form[data-form="reset"] [data-field="${state.field}"]`)?.focus();
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => {
      action(data);
    });
  }

  return (
    <form className="form" data-form="reset" onSubmit={onSubmit}>
      <input type="hidden" name="token" value={token} />
      <p className="form-required">* campo obrigatório</p>
      <label>
        <span>
          Nova senha
          <abbr className="req" title="obrigatório">
            *
          </abbr>
        </span>
        <PasswordField
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          invalid={passwordInvalid}
          describedBy={passwordInvalid ? "reset-password-error" : "reset-password-hint"}
        />
        {passwordInvalid ? (
          <span className="field-error" id="reset-password-error" role="alert">
            {state.message}
          </span>
        ) : (
          <span className="field-hint" id="reset-password-hint">
            Mínimo de 8 caracteres.
          </span>
        )}
      </label>
      <label>
        <span>
          Confirmar senha
          <abbr className="req" title="obrigatório">
            *
          </abbr>
        </span>
        <PasswordField
          name="confirm"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          invalid={confirmInvalid}
          describedBy={confirmInvalid ? "reset-confirm-error" : undefined}
        />
        {confirmInvalid ? (
          <span className="field-error" id="reset-confirm-error" role="alert">
            {state.message}
          </span>
        ) : null}
      </label>
      {state.message && !state.field ? <p className={state.ok ? "ok" : "err"}>{state.message}</p> : null}
      <Submit pending={pending} />
    </form>
  );
}
