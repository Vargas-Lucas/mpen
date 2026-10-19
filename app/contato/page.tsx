import { TalkToUs } from "@/components/TalkToUs";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Contato" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        className="copy-justified"
        title="Fale conosco"
        lede="Entre em contato com a MPEN Incorporadora em Florianópolis. Nossa equipe está disponível para esclarecer dúvidas sobre empreendimentos, oportunidades comerciais e assuntos relacionados aos nossos projetos."
        compact
      />
      <section className="section talk-section">
        <div className="container">
          <TalkToUs mode="page" />
        </div>
      </section>
    </>
  );
}
