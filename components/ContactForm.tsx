"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLead, type LeadState } from "@/actions/leads";
import { useI18n } from "@/components/I18nProvider";

const initial: LeadState = { ok: false, message: "" };

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-solid" type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export function ContactForm({
  source,
  variant = "contact",
  developmentSlug,
  fields = "contact",
  submitLabel,
}: {
  source: string;
  variant?: "contact" | "newsletter";
  developmentSlug?: string;
  fields?: "contact" | "aftersales" | "partner";
  submitLabel?: string;
}) {
  const { locale, t } = useI18n();
  const [state, action] = useActionState(createLead, initial);
  const label = submitLabel || t.form.send;

  if (variant === "newsletter") {
    return (
      <form className="form newsletter" action={action}>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="variant" value="newsletter" />
        <input type="hidden" name="source" value={source} />
        <label>
          <span className="sr-only">{t.form.email}</span>
          <input name="email" type="email" required placeholder={t.form.emailPlaceholder} autoComplete="email" />
        </label>
        <Submit label={t.form.subscribe} pendingLabel={t.form.sending} />
        {state.message ? <p className={state.ok ? "ok" : "err"}>{state.message}</p> : null}
      </form>
    );
  }

  if (state.received) {
    const title =
      fields === "partner"
        ? state.ok
          ? t.form.partnerSent
          : t.form.partnerSaved
        : state.ok
          ? t.form.sent
          : t.form.saved;
    return (
      <div className={state.ok ? "form-success" : "form-success is-warning"} role="status">
        <h3>{title}</h3>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form className="form" action={action}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="variant" value="contact" />
      <input type="hidden" name="source" value={source} />
      {developmentSlug ? <input type="hidden" name="development" value={developmentSlug} /> : null}
      <label>
        {t.form.name}
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        {t.form.email}
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        {t.form.phone}
        <input name="phone" type="tel" autoComplete="tel" required={fields === "aftersales"} />
      </label>
      {fields === "aftersales" ? (
        <>
          <label>
            {t.form.development}
            <input name="developmentName" required />
          </label>
          <label>
            {t.form.unit}
            <input name="unit" required />
          </label>
        </>
      ) : null}
      {fields === "partner" ? (
        <>
          <label>
            {t.form.creci}
            <input name="creci" autoComplete="off" />
          </label>
          <label>
            {t.form.company}
            <input name="company" autoComplete="organization" />
          </label>
        </>
      ) : null}
      <label>
        {t.form.message}
        <textarea name="message" />
      </label>
      <Submit label={label} pendingLabel={t.form.sending} />
      {state.message ? (
        <p className={state.ok ? "ok" : "err"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
