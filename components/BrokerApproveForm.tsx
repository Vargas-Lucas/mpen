"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { approveBrokerRegistration, type BrokerState } from "@/actions/brokers";

const initial: BrokerState = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-solid" type="submit" disabled={pending}>
      {pending ? "Enviando…" : "Aprovar cadastro"}
    </button>
  );
}

export function BrokerApproveForm({ token }: { token: string }) {
  const [state, action] = useActionState(approveBrokerRegistration, initial);
  if (state.ok) return <p className="ok">{state.message}</p>;

  return (
    <form className="form" action={action}>
      <input type="hidden" name="token" value={token} />
      {state.message ? <p className="err">{state.message}</p> : null}
      <Submit />
    </form>
  );
}
