import Link from "next/link";
import { FooterLogo } from "@/components/FooterLogo";
import { TalkToUs } from "@/components/TalkToUs";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <FooterLogo />
          <p className="footer-about">
            Há mais de 20 anos desenvolvendo empreendimentos residenciais no Sul da Ilha de
            Florianópolis, com qualidade construtiva, arquitetura e compromisso com cada projeto.
          </p>
        </div>
        <div>
          <Link href="/quem-somos">Quem somos</Link>
          <Link href="/empreendimentos">Empreendimentos</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/seja-parceiro">Seja parceiro</Link>
        </div>
        <div>
          <Link href="/faq">FAQ</Link>
          <Link href="/compliance">Compliance</Link>
          <Link href="/politica-de-privacidade">Política de privacidade</Link>
          <Link href="/termos-de-uso">Termos de uso</Link>
        </div>
        <div className="footer-contact">
          <TalkToUs />
          <div className="footer-social">
            <a href="https://www.instagram.com/mpenincorporadora/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="16.7" cy="7.3" r="0.9" fill="currentColor" />
              </svg>
            </a>
            <a href="https://www.facebook.com/people/MPEN-Incorporadora/61574061021201/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M14.2 8.4V6.9c0-.7.4-.9 1.1-.9H16.6V3.6h-1.9C12.3 3.6 11 4.9 11 7v1.4H9.1v2.6H11V20.4h3.2v-9.4h2.2l.3-2.6h-2.5Z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/mpenincorporadora" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M6.4 9.4H3.7V20h2.7V9.4ZM5.05 3.8c-.95 0-1.65.7-1.65 1.6s.7 1.6 1.65 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6ZM20.2 13.2c0-2.6-1.4-3.8-3.3-3.8-1.5 0-2.2.8-2.6 1.4V9.4h-2.6V20h2.7v-5.8c0-.3 0-.6.1-.8.2-.6.8-1.2 1.8-1.2 1.3 0 1.8 1 1.8 2.4V20h2.7v-6.8h-.6Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-base">
        <p>© {new Date().getFullYear()} MPEN Incorporadora</p>
      </div>
    </footer>
  );
}
