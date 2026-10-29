"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

export function CookieBar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("mpen-cookies")) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="cookie" role="dialog" aria-label={t.cookie.aria}>
      <p>
        {t.cookie.text}{" "}
        <Link href="/politica-de-privacidade">{t.contact.privacy}</Link>
      </p>
      <button
        className="btn btn-solid"
        type="button"
        onClick={() => {
          window.localStorage.setItem("mpen-cookies", "1");
          window.dispatchEvent(new Event("mpen-cookies-accepted"));
          setOpen(false);
        }}
      >
        {t.cookie.accept}
      </button>
    </div>
  );
}
