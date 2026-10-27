import { DevelopmentCard } from "@/components/DevelopmentCard";
import { PageHeader } from "@/components/PageHeader";
import { getDevelopments } from "@/lib/data";

export const metadata = { title: "Conheça a Mpen" };

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
    text: "Desenvolver empreendimentos residenciais que unam qualidade construtiva, arquitetura e funcionalidade, contribuindo para novas formas de morar no Sul da Ilha de Florianópolis.",
  },
  {
    title: "Visão",
    icon: <Vision />,
    text: "Ser reconhecida como uma incorporadora de referência no Sul da Ilha de Florianópolis, pela qualidade dos empreendimentos, pelo conhecimento da região e pela confiança construída com clientes e parceiros.",
  },
  {
    title: "Valores",
    icon: <Values />,
    text: "Ética, transparência e responsabilidade em cada etapa. Valorizamos a qualidade construtiva, o respeito aos compromissos assumidos e as relações duradouras com clientes, parceiros e comunidade.",
  },
];

export default async function AboutPage() {
  const projects = (await getDevelopments()).slice(0, 6);
  return (
    <>
      <PageHeader
        title="Conheça a Mpen"
        lede="Incorporadora residencial no Sul da Ilha de Florianópolis desde 2003."
        compact
        className="about-hero"
      />

      <section className="about-banner">
        <div className="container">
          <img src="/images/sobre/capa.png" alt="Profissional da construtora MPEN no Sul da Ilha de Florianópolis" />
          <h2>Construímos histórias no Sul da Ilha de Florianópolis.</h2>
        </div>
      </section>

      <section className="section about-story-wrap">
        <div className="container about-story">
          <p>
            Desde 2003, a MPEN Incorporadora participa do desenvolvimento imobiliário do Sul da Ilha
            de Florianópolis, uma região que reúne natureza, identidade cultural e novas
            possibilidades de morar.
          </p>
          <p>
            Ao longo de mais de duas décadas, construímos uma trajetória marcada por empreendimentos
            residenciais que valorizam a localização, a qualidade construtiva e a arquitetura
            pensada para o cotidiano.
          </p>
          <p>
            Nossa atuação parte de um conhecimento próximo da região e das transformações que fazem
            parte do seu crescimento. É esse olhar que orienta nossas escolhas, do planejamento de
            cada projeto à entrega de espaços preparados para diferentes momentos da vida.
          </p>
          <p>
            Mais do que desenvolver imóveis, buscamos criar empreendimentos que façam sentido para
            as pessoas e para os lugares onde estão inseridos.
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
          <img src="/images/sobre/compromisso.jpg" alt="Obra em execução ao pôr do sol" />
          <div className="prose">
            <h2>Compromisso em cada etapa</h2>
            <p>
              Na MPEN Incorporadora, acreditamos que a confiança se constrói com planejamento,
              transparência e responsabilidade.
            </p>
            <p>
              Desde 2003, desenvolvemos nossa trajetória no Sul da Ilha de Florianópolis,
              acompanhando cada empreendimento com atenção às etapas de planejamento, execução e
              entrega.
            </p>
            <p>
              Nosso compromisso é manter uma relação próxima e transparente com clientes e
              parceiros, respeitando os acordos estabelecidos e buscando qualidade em cada projeto.
            </p>
            <p>
              Mais do que construir empreendimentos residenciais, queremos construir relações de
              confiança que permaneçam ao longo do tempo.
            </p>
          </div>
        </div>
      </section>

      <section className="section about-band">
        <div className="container">
          <h2 className="about-title">Conheça nossos empreendimentos em Florianópolis</h2>
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
