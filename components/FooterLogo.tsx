"use client";

export function FooterLogo() {
  return (
    <a
      href="#"
      className="footer-logo-link"
      aria-label="MPEN, voltar ao início"
      onClick={(event) => {
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <img src="/logo.png" alt="" className="footer-logo" />
    </a>
  );
}
