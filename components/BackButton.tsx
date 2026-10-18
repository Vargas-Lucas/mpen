"use client";

import { useRouter } from "next/navigation";

const returnKey = "mpen-return";
const freshKey = "mpen-return-fresh";

export function rememberReturn() {
  try {
    sessionStorage.setItem("mpen-return", window.location.pathname + window.location.search + window.location.hash);
    sessionStorage.setItem("mpen-return-fresh", "1");
  } catch {
    /* navegação privada */
  }
}

export function BackButton() {
  const router = useRouter();

  function onClick() {
    let stored = "";
    let fresh = false;
    try {
      stored = sessionStorage.getItem(returnKey) || "";
      fresh = sessionStorage.getItem(freshKey) === "1";
      sessionStorage.removeItem(freshKey);
    } catch {
      /* navegação privada */
    }

    if (fresh && stored && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fresh && stored ? stored : "/empreendimentos");
  }

  return (
    <button type="button" className="back-link" onClick={onClick}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M10 3.5 5.5 8 10 12.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Voltar
    </button>
  );
}
