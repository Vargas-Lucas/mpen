import { TalkToUs } from "@/components/TalkToUs";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Contato" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Fale conosco"
        lede="Envie a mensagem. Ela segue direto para a equipe certa."
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
