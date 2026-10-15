import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { contactChannel } from "@/lib/contacts";
import { getDevelopments } from "@/lib/data";

export const metadata = { title: "Seja parceiro" };

const steps = [
  {
    title: "Envie o cadastro",
    text: "Nome, contato e uma mensagem sobre a sua atuação como corretor.",
  },
  {
    title: "Fale com o comercial",
    text: "A equipe recebe o cadastro e retorna para alinhar a parceria.",
  },
  {
    title: "Apresente os empreendimentos",
    text: "Você passa a oferecer os projetos residenciais da MPEN.",
  },
];

export default async function PartnerPage() {
  const total = (await getDevelopments()).length;
  const comercial = contactChannel("comercial");

  return (
    <>
      <PageHeader
        compact
        title="Seja parceiro"
        lede="Corretores que apresentam os empreendimentos da MPEN no sul da Ilha de Florianópolis."
      />

      <section className="partner-intro">
        <div className="container partner-layout">
          <div className="partner-copy">
            <p className="kicker">Parceria comercial</p>
            <h2>Uma parceria para quem vende no sul da Ilha.</h2>
            <p>
              A MPEN atua desde 2003 com empreendimentos residenciais no sul da Ilha de
              Florianópolis. O cadastro chega direto à equipe comercial.
            </p>
            <ul className="partner-points">
              <li>
                <strong>{total} empreendimentos</strong>
                <span>Portfólio residencial concentrado na região.</span>
              </li>
              <li>
                <strong>Desde 2003</strong>
                <span>Mais de duas décadas de obras no sul da Ilha.</span>
              </li>
              <li>
                <strong>Contato direto</strong>
                <span>O comercial recebe o cadastro e retorna o contato.</span>
              </li>
            </ul>
            {comercial ? (
              <p className="partner-alt">
                Prefere falar agora?{" "}
                <a href={`https://wa.me/${comercial.whatsapp}`} target="_blank" rel="noreferrer">
                  WhatsApp do comercial
                </a>
              </p>
            ) : null}
          </div>

          <aside className="partner-card">
            <h2>Quero ser parceiro</h2>
            <p>Preencha o cadastro. A mensagem segue para a equipe comercial.</p>
            <ContactForm source="parceiro" />
          </aside>
        </div>
      </section>

      <section className="partner-steps">
        <div className="container">
          <p className="kicker">Como funciona</p>
          <h2>Do cadastro ao retorno do comercial.</h2>
          <ol className="partner-steps-grid">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
