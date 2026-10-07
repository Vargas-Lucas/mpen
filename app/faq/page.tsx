import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <>
      <PageHeader title="Perguntas frequentes" lede="Respostas rápidas sobre a MPEN." />
      <section className="section">
        <div className="container faq" style={{ maxWidth: 760 }}>
          <details open>
            <summary>Onde a MPEN atua?</summary>
            <p>No sul da Ilha de Florianópolis.</p>
          </details>
          <details>
            <summary>Como falo com o comercial?</summary>
            <p>
              Pelo e-mail comercial@mpen.net.br, pelo telefone (048) 99105-0594 ou pelo formulário
              de contato.
            </p>
          </details>
          <details>
            <summary>Onde acesso a área do cliente?</summary>
            <p>
              No botão Área do cliente, que abre o portal já usado pela MPEN.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
