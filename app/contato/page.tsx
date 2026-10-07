import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Contato" };

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contato" lede="Fale com o comercial ou com a engenharia da MPEN." />
      <section className="section">
        <div className="container detail">
          <div className="prose">
            <h2>Comercial</h2>
            <p>
              <a href="mailto:comercial@mpen.net.br">comercial@mpen.net.br</a>
              <br />
              <a href="tel:+5548991050594">(048) 99105-0594</a>
            </p>
            <h2>Engenharia</h2>
            <p>
              <a href="mailto:iorhan.wagner@mpen.net.br">iorhan.wagner@mpen.net.br</a>
              <br />
              <a href="tel:+5548999311323">(048) 99931-1323</a>
            </p>
          </div>
          <aside className="panel">
            <h2>Envie uma mensagem</h2>
            <ContactForm source="contato" />
          </aside>
        </div>
      </section>
    </>
  );
}
