"use client";

import { useI18n } from "@/components/I18nProvider";

export function FooterLogo() {
  const { t } = useI18n();
  return (
    <a
      href="#"
      className="footer-logo-link"
      aria-label={t.missing.home}
      onClick={(event) => {
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <img src="/logo.png" alt={t.logoAlt} className="footer-logo" />
    </a>
  );
}
