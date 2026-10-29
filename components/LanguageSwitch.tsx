"use client";

import { LOCALES, type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/I18nProvider";

const names: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
};

function Flag({ locale }: { locale: Locale }) {
  if (locale === "pt") {
    return (
      <svg viewBox="0 0 60 42" aria-hidden="true">
        <rect width="60" height="42" fill="#009c3b" />
        <polygon points="30,3.5 56.5,21 30,38.5 3.5,21" fill="#ffdf00" />
        <circle cx="30" cy="21" r="8.2" fill="#002776" />
      </svg>
    );
  }

  if (locale === "en") {
    return (
      <svg viewBox="0 0 60 42" aria-hidden="true">
        <rect width="60" height="42" fill="#b22234" />
        <g fill="#fff">
          <rect y="3.23" width="60" height="3.23" />
          <rect y="9.69" width="60" height="3.23" />
          <rect y="16.15" width="60" height="3.23" />
          <rect y="22.62" width="60" height="3.23" />
          <rect y="29.08" width="60" height="3.23" />
          <rect y="35.54" width="60" height="3.23" />
        </g>
        <rect width="25" height="22.6" fill="#3c3b6e" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 42" aria-hidden="true">
      <rect width="60" height="42" fill="#aa151b" />
      <rect y="11" width="60" height="20" fill="#f1bf00" />
    </svg>
  );
}

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="lang-switch" role="group" aria-label={t.langLabel}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={locale === code ? "is-on" : undefined}
          aria-pressed={locale === code}
          aria-label={names[code]}
          lang={code === "pt" ? "pt-BR" : code}
          title={names[code]}
          onClick={() => setLocale(code)}
        >
          <Flag locale={code} />
        </button>
      ))}
    </div>
  );
}
