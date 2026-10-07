"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function CookieBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("mpen-cookies")) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="cookie" role="dialog" aria-label="Aviso de cookies">
      <p>
        Usamos cookies para melhorar a sua experiência neste site.{" "}
        <Link href="/politica-de-privacidade">Política de privacidade</Link>
      </p>
      <button
        className="btn btn-solid"
        type="button"
        onClick={() => {
          window.localStorage.setItem("mpen-cookies", "1");
          setOpen(false);
        }}
      >
        Aceitar
      </button>
    </div>
  );
}
