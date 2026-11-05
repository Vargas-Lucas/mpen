"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLead, type LeadState } from "@/actions/leads";
import { useI18n } from "@/components/I18nProvider";

const initial: LeadState = { ok: false, message: "" };

function Consent() {
  const { t } = useI18n();
  return (
    <p className="form-consent">
      {t.form.consentBefore}
      <Link href="/politica-de-privacidade">{t.form.consentLink}</Link>
      {t.form.consentAfter}
    </p>
  );
}

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  const { t } = useI18n();
  return (
    <span>
      {children}
      {required ? (
        <abbr className="req" title={t.form.required}>
          *
        </abbr>
      ) : null}
    </span>
  );
}

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
          <span className="sr-only">
            {t.form.email} ({t.form.required})
          </span>
          <input name="email" type="email" required placeholder={t.form.emailPlaceholder} autoComplete="email" aria-required="true" />
        </label>
        <p className="form-required">{t.form.requiredLegend}</p>
        <Submit label={t.form.subscribe} pendingLabel={t.form.sending} />
        <Consent />
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
      <p className="form-required">{t.form.requiredLegend}</p>
      <label>
        <FieldLabel required>{t.form.name}</FieldLabel>
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        <FieldLabel required>{t.form.email}</FieldLabel>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        <FieldLabel required={fields === "aftersales"}>{t.form.phone}</FieldLabel>
        <input name="phone" type="tel" autoComplete="tel" required={fields === "aftersales"} />
      </label>
      {fields === "aftersales" ? (
        <>
          <label>
            <FieldLabel required>{t.form.development}</FieldLabel>
            <input name="developmentName" required />
          </label>
          <label>
            <FieldLabel required>{t.form.unit}</FieldLabel>
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
      <Consent />
      {state.message ? (
        <p className={state.ok ? "ok" : "err"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
