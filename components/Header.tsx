"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useI18n } from "@/components/I18nProvider";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();
  const isHome = pathname === "/";
  const links = [
    { href: "/quem-somos", label: t.nav.about },
    { href: "/empreendimentos", label: t.nav.developments },
    { href: "/blog", label: t.nav.blog },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      const next = window.scrollY > 12;
      setScrolled((current) => (current === next ? current : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const className = [
    "header",
    isHome ? "is-home" : "",
    open ? "is-open" : "",
    isHome && scrolled ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={className}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="MPEN">
          <img src="/logo.png" alt={t.logoAlt} />
        </Link>

        <button
          className="menu"
          type="button"
          aria-expanded={open}
          aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={open ? "header-panel open" : "header-panel"}>
          <nav className="nav" aria-label={t.nav.main}>
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <a href="https://portaldocliente.expertsystem.com.br/entrar/mpen" target="_blank" rel="noopener noreferrer">
              {t.nav.client}
            </a>
            <Link href="/contato">{t.nav.contact}</Link>
            <Link href="/seja-parceiro">{t.nav.partner}</Link>
            <LanguageSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
