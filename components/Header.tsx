"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/empreendimentos", label: "Empreendimentos" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={isHome ? "header is-home" : "header"}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="MPEN">
          <img src="/logo.png" alt="MPEN" />
        </Link>

        <button
          className="menu"
          type="button"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={open ? "header-panel open" : "header-panel"}>
          <nav className="nav" aria-label="Principal">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <a href="https://portaldocliente.expertsystem.com.br/entrar/mpen" target="_blank" rel="noopener noreferrer">
              Área do cliente
            </a>
            <Link href="/contato">Contato</Link>
            <Link href="/seja-parceiro">Seja parceiro</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
