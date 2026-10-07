import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Política de privacidade" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Política de privacidade" />
      <section className="section">
        <div className="container prose" style={{ maxWidth: 760 }}>
          <p>
            Esta página recebe o texto oficial de privacidade da MPEN. Os formulários do site
            guardam nome, e-mail, telefone e mensagem no banco da própria empresa, para retorno
            comercial.
          </p>
        </div>
      </section>
    </>
  );
}
