import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img src="/logo.png" alt="MPEN" className="footer-logo" />
          <p>Construtora e incorporadora no sul da Ilha de Florianópolis, desde 2003.</p>
        </div>
        <div>
          <h2>Navegação</h2>
          <Link href="/quem-somos">Quem somos</Link>
          <Link href="/empreendimentos">Empreendimentos</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/seja-parceiro">Seja parceiro</Link>
          <Link href="/contato">Contato</Link>
        </div>
        <div>
          <h2>Institucional</h2>
          <Link href="/faq">FAQ</Link>
          <Link href="/compliance">Compliance</Link>
          <Link href="/politica-de-privacidade">Política de privacidade</Link>
          <Link href="/termos-de-uso">Termos de uso</Link>
        </div>
        <div>
          <h2>Contato</h2>
          <a href="mailto:comercial@mpen.net.br">comercial@mpen.net.br</a>
          <a href="tel:+5548991050594">(048) 99105-0594</a>
          <a href="mailto:iorhan.wagner@mpen.net.br">iorhan.wagner@mpen.net.br</a>
          <a href="tel:+5548999311323">(048) 99931-1323</a>
          <a href="https://www.instagram.com/mpenincorporadora/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>
      <div className="container footer-base">
        <p>© {new Date().getFullYear()} MPEN Incorporadora</p>
      </div>
    </footer>
  );
}
