"use client";

import { useI18n } from "@/components/I18nProvider";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const { t } = useI18n();
  return (
    <section className="section">
      <div className="container empty">
        <h1>{t.error.title}</h1>
        <p>{t.error.text}</p>
        <button className="btn btn-solid" type="button" onClick={() => reset()}>
          {t.error.retry}
        </button>
      </div>
    </section>
  );
}
