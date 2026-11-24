"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { resetBrokerPassword, type BrokerState } from "@/actions/brokers";

const initial: BrokerState = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-solid" type="submit" disabled={pending}>
      {pending ? "Enviando…" : "Salvar nova senha"}
    </button>
  );
}

export function BrokerResetForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetBrokerPassword, initial);

  return (
    <form className="form" action={action}>
      <input type="hidden" name="token" value={token} />
      <p className="form-required">* campo obrigatório</p>
      <label>
        <span>
          Nova senha
          <abbr className="req" title="obrigatório">
            *
          </abbr>
        </span>
        <input name="password" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <label>
        <span>
          Confirmar senha
          <abbr className="req" title="obrigatório">
            *
          </abbr>
        </span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      {state.message ? <p className={state.ok ? "ok" : "err"}>{state.message}</p> : null}
      <Submit />
    </form>
  );
}
