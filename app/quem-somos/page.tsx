import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Quem somos" };

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Quem somos"
        lede="Construtora e incorporadora com mais de 20 anos no sul da Ilha de Florianópolis."
      />
      <section className="section">
        <div className="container prose" style={{ maxWidth: 760 }}>
          <p>
            Com mais de duas décadas de atuação e foco no sul da Ilha, a MPEN antecipa tendências,
            mapeia oportunidades e entrega empreendimentos com potencial de valorização.
          </p>
          <p>
            A MPEN transforma vidas através de empreendimentos que unem sofisticação, qualidade e
            inovação, em projetos localizados para valorizar natureza e conforto.
          </p>
        </div>
      </section>
    </>
  );
}
