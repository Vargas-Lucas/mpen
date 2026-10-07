import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Seja parceiro" };

export default function PartnerPage() {
  return (
    <>
      <PageHeader
        title="Seja parceiro"
        lede="Corretores que querem vender os empreendimentos da MPEN."
      />
      <section className="section">
        <div className="container detail">
          <div className="prose">
            <p>
              A MPEN trabalha com parceiros comerciais no sul da Ilha de Florianópolis. Deixe seus
              dados para a equipe comercial retornar.
            </p>
          </div>
          <aside className="panel">
            <h2>Quero ser parceiro</h2>
            <ContactForm source="parceiro" />
          </aside>
        </div>
      </section>
    </>
  );
}
