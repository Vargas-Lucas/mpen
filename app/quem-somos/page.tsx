import Link from "next/link";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import { PageHeader } from "@/components/PageHeader";
import { getDevelopments } from "@/lib/data";

export const metadata = { title: "Quem somos" };

function Mission() {
  return (
    <svg className="line" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 3.2v2.1M12 18.7v2.1M3.2 12h2.1M18.7 12h2.1" />
      <path d="M12 7.1 13.35 12 12 13.6 10.65 12Z" />
    </svg>
  );
}

function Vision() {
  return (
    <svg className="line" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.4 12S6.4 6.6 12 6.6 21.6 12 21.6 12 17.6 17.4 12 17.4 2.4 12 2.4 12Z" />
      <circle cx="12" cy="12" r="2.35" />
    </svg>
  );
}

function Values() {
  return (
    <svg className="line" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.2 19.6 9.1 12 20.8 4.4 9.1Z" />
      <path d="M4.4 9.1h15.2M8.1 9.1 12 3.2 15.9 9.1M8.1 9.1 12 20.8 15.9 9.1" />
    </svg>
  );
}

const values = [
  {
    title: "Missão",
    icon: <Mission />,
    text: "Promover o crescimento planejado e sustentável, imprimindo um toque único em cada projeto.",
  },
  {
    title: "Visão",
    icon: <Vision />,
    text: "Ser referência em qualidade no mercado de construção civil, unindo engenharia de ponta, arquitetura sofisticada e perfeição nos acabamentos.",
  },
  {
    title: "Valores",
    icon: <Values />,
    text: "Ética, transparência, compromisso e relacionamentos sólidos com parceiros e clientes.",
  },
];

export default async function AboutPage() {
  const projects = (await getDevelopments()).slice(0, 6);
  return (
    <>
      <PageHeader
        title="Quem somos"
        lede="Construtora e incorporadora com mais de 20 anos no sul da Ilha de Florianópolis."
        compact
      />

      <section className="about-banner">
        <img src="/images/sobre/capa.png" alt="" />
        <div className="container">
          <h2>Construção com alto potencial de valorização.</h2>
          <p>
            Com mais de duas décadas de atuação e 100% focada no sul da Ilha de Florianópolis, a
            MPEN se consolida como uma incorporadora que antecipa tendências, mapeia oportunidades
            e entrega projetos com alto potencial de valorização.
          </p>
          <p>
            Desde 2003, combinamos{" "}
            <strong>localização estratégica, arquitetura inteligente e engenharia de alto padrão</strong>{" "}
            para criar empreendimentos pensados para o futuro — tanto de quem investe quanto de quem
            vive.
          </p>
        </div>
      </section>

      <section className="principles">
        <div className="principles-glow" aria-hidden="true" />
        <div className="container">
          <p className="principles-kicker">O que nos move</p>
          <div className="principles-grid">
            {values.map((item, index) => (
              <article key={item.title} className="principle" style={{ animationDelay: `${index * 140}ms` }}>
                <span className="principle-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="principle-orb">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-intro">
          <img src="/images/sobre/prazos.jpg" alt="Ampulheta representando o cumprimento de prazos" />
          <div className="prose">
            <h2>Pontualidade e compromisso</h2>
            <p>
              Na MPEN, acreditamos que cumprir prazos é essencial para manter a confiança dos nossos
              clientes e parceiros. Com um histórico positivo de entregas pontuais, nossos
              empreendimentos seguem um rigoroso cronograma de planejamento, execução e finalização,
              garantindo que cada projeto seja entregue na data prevista, sem atrasos.
            </p>
            <Link className="btn btn-solid" href="/seja-parceiro">
              Descubra como ser um corretor parceiro.
            </Link>
          </div>
        </div>
      </section>

      <section className="section about-band">
        <div className="container">
          <h2 className="about-title">Alguns de nossos projetos</h2>
          <div className="dev-grid">
            {projects.map((item) => (
              <DevelopmentCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
