import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { ProjectGallery } from "@/components/ProjectGallery";
import { getDevelopment } from "@/lib/data";
import { deliveryLabel, statusLabel } from "@/lib/format";
import { coverImage, galleryImages } from "@/lib/images";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getDevelopment(slug);
  return { title: item?.name ?? "Empreendimento" };
}

export default async function DevelopmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getDevelopment(slug);
  if (!item) notFound();
  const images = [...new Set([coverImage(item.slug), ...galleryImages(item.slug)].filter(Boolean))];

  return (
    <>
      <PageHeader
        compact
        back
        title={item.name}
        lede={item.summary || `${item.neighborhood}, ${item.city}`}
      />
      <section className="project">
        <div className="container project-layout">
          <div className="project-main">
            <ProjectGallery images={images} name={item.name} />
            <div className={item.slug === "sunset-village" ? "project-facts has-site" : "project-facts"}>
              {item.slug === "sunset-village" ? (
                <a className="project-fact-link" href="https://sunsetvillage.com.br/">
                  <span>Site</span>
                  Conheça mais
                </a>
              ) : null}
              <div>
                <p className="fact-kicker">Status</p>
                <p className="fact-value">{statusLabel(item.status)}</p>
              </div>
              <div>
                <p className="fact-kicker">Cidade</p>
                <p className="fact-value">{item.city}</p>
              </div>
              <div>
                <p className="fact-kicker">Região</p>
                <p className="fact-value">
                  {item.slug === "sunset-village" ? "Ribeirão da Ilha" : item.neighborhood}
                </p>
              </div>
              {item.delivery ? (
                <div>
                  <p className="fact-kicker">Entrega</p>
                  <p className="fact-value">
                    {item.slug === "sunset-village" ? "Agosto/29" : deliveryLabel(item)}
                  </p>
                </div>
              ) : null}
              {item.typology ? (
                <div>
                  <p className="fact-kicker">Tipologia</p>
                  <p className="fact-value">{item.typology}</p>
                </div>
              ) : null}
              {item.area ? (
                <div>
                  <p className="fact-kicker">Metragem</p>
                  <p className="fact-value">{item.area}</p>
                </div>
              ) : null}
            </div>
            {item.slug === "sunset-village" ? (
              <div className="project-story">
                <h2>Sunset Village: Apartamentos no Sul da Ilha de Florianópolis</h2>
                <p>
                  O Sunset Village é um empreendimento residencial da MPEN Incorporadora, localizado no
                  Loteamento Portal do Ribeirão, entre o Morro das Pedras e o Ribeirão da Ilha, no Sul
                  de Florianópolis.
                </p>
                <p>
                  Com apartamentos de diferentes tipologias, incluindo studios e unidades de 2 e 3
                  dormitórios, o projeto foi pensado para oferecer praticidade, conforto e espaços que
                  acompanham diferentes estilos de vida.
                </p>
                <p>
                  Entre os diferenciais estão rooftop com piscina, academia, coworking e lavanderia
                  compartilhada, ambientes planejados para ampliar as possibilidades de uso do
                  condomínio.
                </p>
                <p>
                  Atualmente em construção, com entrega prevista para 2029, o Sunset Village reúne
                  soluções residenciais contemporâneas em uma região que combina características
                  urbanas e a identidade do Sul da Ilha.
                </p>
              </div>
            ) : null}
            {item.slug === "village-du-soleil" ? (
              <div className="project-story">
                <h2>Village du Soleil: casas residenciais no Campeche, Florianópolis</h2>
                <p>
                  O Village du Soleil é um conjunto residencial de casas de alto padrão da MPEN
                  Incorporadora, localizado no bairro Campeche, no Sul da Ilha de Florianópolis.
                </p>
                <p>
                  Com arquitetura contemporânea, o projeto integra o portfólio de empreendimentos da
                  MPEN na região, reforçando sua atuação no desenvolvimento imobiliário do Sul da Ilha.
                </p>
                <p>
                  Entregue em 2023, o Village du Soleil representa mais uma etapa da trajetória da
                  incorporadora em Florianópolis, reunindo características arquitetônicas modernas em
                  uma das regiões residenciais da cidade.
                </p>
              </div>
            ) : null}
            {item.slug === "iconic" ? (
              <div className="project-story">
                <h2>Iconic: empreendimento residencial no Morro das Pedras, Florianópolis</h2>
                <p>
                  O Iconic é um empreendimento residencial da MPEN Incorporadora, localizado no bairro
                  Morro das Pedras, no Sul da Ilha de Florianópolis.
                </p>
                <p>
                  Com arquitetura contemporânea, o projeto apresenta uma fachada marcada por linhas
                  retas, contrastes de materiais e elementos arquitetônicos que valorizam sua
                  identidade visual.
                </p>
                <p>
                  Entregue em 2023, o Iconic integra o portfólio de empreendimentos concluídos da MPEN,
                  reforçando sua trajetória no desenvolvimento de projetos residenciais em
                  Florianópolis.
                </p>
                <p>
                  Localizado no Morro das Pedras, o empreendimento faz parte de uma região do Sul da
                  Ilha conhecida pela proximidade com a natureza e pelas características residenciais.
                </p>
                <p className="project-story-note">Construído em parceria com a CDE Via Sul</p>
              </div>
            ) : null}
            {item.slug === "chez-soleil" ? (
              <div className="project-story">
                <h2>Chez Soleil: apartamentos no Campeche, Florianópolis</h2>
                <p>
                  O Chez Soleil é um empreendimento residencial da MPEN Incorporadora, localizado no
                  Campeche, no Sul da Ilha de Florianópolis.
                </p>
                <p>
                  Entregue em 2019, o residencial apresenta arquitetura contemporânea, com linhas
                  retas, amplas aberturas e varandas que valorizam a iluminação natural e a integração
                  dos ambientes.
                </p>
                <p>
                  O empreendimento reúne apartamentos de diferentes configurações, incluindo unidades
                  de 1 e 2 dormitórios, além de espaços de lazer e convivência.
                </p>
                <p>
                  Localizado em uma região próxima à Praia do Campeche, o Chez Soleil integra o
                  portfólio de empreendimentos entregues pela MPEN, refletindo sua atuação no
                  desenvolvimento de projetos residenciais no Sul de Florianópolis.
                </p>
              </div>
            ) : null}
            {item.slug === "vivace" ? (
              <div className="project-story">
                <h2>Vivace: apartamentos e coberturas no Campeche, Florianópolis</h2>
                <p>
                  O Vivace é um empreendimento residencial da MPEN Incorporadora, localizado no
                  Campeche, no Sul da Ilha de Florianópolis.
                </p>
                <p>
                  Entregue em 2018, o projeto reúne diferentes tipologias residenciais, incluindo
                  studios, apartamentos, duplex e coberturas, com plantas pensadas para atender a
                  diferentes necessidades e estilos de vida.
                </p>
                <p>
                  A arquitetura contemporânea se destaca pela combinação de materiais, amplas aberturas
                  e varandas, criando uma identidade visual própria para o empreendimento.
                </p>
                <p>
                  Entre os diferenciais estão a piscina e o espaço gourmet, ambientes destinados ao
                  lazer e à convivência dos moradores.
                </p>
                <p>
                  Localizado na Rua dos Jades, o Vivace integra o portfólio de empreendimentos
                  entregues pela MPEN no Sul de Florianópolis, em uma região que reúne infraestrutura
                  urbana e proximidade com as praias da Ilha.
                </p>
              </div>
            ) : null}
            {item.slug === "moana" ? (
              <div className="project-story">
                <h2>Moana Beach Home Style: apartamentos e coberturas no Novo Campeche, Florianópolis</h2>
                <p>
                  O Moana Beach Home Style é um empreendimento residencial localizado no Novo Campeche,
                  no Sul da Ilha de Florianópolis, entregue em 2017.
                </p>
                <p>
                  O residencial oferece apartamentos de 2 e 3 dormitórios, com varanda, churrasqueira e
                  hobby box, além de coberturas com amplos terraços, spa e churrasqueira.
                </p>
                <p>
                  A estrutura de lazer reúne piscina, espaço fitness, salão de festas, brinquedoteca,
                  espaço gourmet e ambientes de convivência, proporcionando diferentes possibilidades
                  de lazer dentro do condomínio.
                </p>
                <p>
                  Localizado na Avenida Campeche, o Moana está inserido em uma região residencial
                  próxima à Praia do Novo Campeche, conhecida por suas ruas arborizadas e pela
                  integração entre infraestrutura urbana e natureza.
                </p>
                <p>
                  O empreendimento integra o portfólio da MPEN no Sul de Florianópolis e representa sua
                  participação em projetos residenciais desenvolvidos em parceria com outras empresas
                  do setor.
                </p>
                <p className="project-story-note">Construído em parceria com a CDE Via Sul</p>
              </div>
            ) : null}
            {item.slug === "carpe-diem" ? (
              <div className="project-story">
                <h2>Carpe Diem Beach Residence: apartamentos e coberturas no Sul de Florianópolis</h2>
                <p>
                  O Carpe Diem Beach Residence é um empreendimento residencial localizado no Morro das
                  Pedras, no Sul da Ilha de Florianópolis, próximo à Praia do Campeche.
                </p>
                <p>
                  Entregue em 2017, o residencial foi desenvolvido em torre única, com diferentes
                  configurações de plantas, incluindo studios, apartamentos e coberturas.
                </p>
                <p>
                  O projeto valoriza a iluminação natural, o conforto dos ambientes e a integração com
                  a paisagem. Entre os diferenciais estão a piscina e o espaço gourmet, destinados ao
                  lazer e à convivência dos moradores.
                </p>
                <p>
                  Localizado na Avenida Tucumã, o Carpe Diem reúne arquitetura contemporânea e
                  proximidade com o litoral, integrando o portfólio de empreendimentos entregues da
                  MPEN em Florianópolis.
                </p>
                <p className="project-story-note">Construído em parceria com a CDE Via Sul</p>
              </div>
            ) : null}
            {item.slug === "sanct" ? (
              <div className="project-story">
                <h2>Sanct: empreendimento residencial no Rio Tavares, Florianópolis</h2>
                <p>
                  O Sanct é um empreendimento residencial localizado no Rio Tavares, no Sul da Ilha de
                  Florianópolis, entregue em 2014.
                </p>
                <p>
                  O projeto combina arquitetura contemporânea, ambientes amplos e grandes aberturas que
                  favorecem a iluminação natural e a integração com a paisagem.
                </p>
                <p>
                  Entre seus diferenciais estão soluções sustentáveis, como estação própria de
                  tratamento de esgoto, aproveitamento da água da chuva e sensores inteligentes de
                  iluminação nas áreas comuns.
                </p>
                <p>
                  O empreendimento também conta com piscina, espaço gourmet e sala de fitness,
                  oferecendo ambientes dedicados ao lazer e à convivência.
                </p>
                <p>
                  Integrado ao entorno natural do Rio Tavares, o Sanct faz parte da trajetória da MPEN
                  no desenvolvimento de empreendimentos residenciais no Sul de Florianópolis.
                </p>
                <p className="project-story-note">Construído em parceria com a CDE Via Sul</p>
              </div>
            ) : null}
            {item.slug === "jai" ? (
              <div className="project-story">
                <h2>JAI Home Relax Residence: apartamentos e coberturas no Novo Campeche, Florianópolis</h2>
                <p>
                  O JAI Home Relax Residence é um empreendimento residencial localizado no Loteamento
                  Novo Campeche, no Sul da Ilha de Florianópolis, entregue em 2014.
                </p>
                <p>
                  Inspirado na integração entre arquitetura e natureza, o projeto combina elementos
                  contemporâneos com materiais e acabamentos que valorizam sua identidade
                  arquitetônica.
                </p>
                <p>
                  O residencial reúne apartamentos de 2 e 3 dormitórios, além de coberturas com 3
                  suítes, oferecendo diferentes configurações de plantas para quem busca conforto e
                  espaços bem distribuídos.
                </p>
                <p>
                  Localizado na Rua Otávio Cruz, o JAI está inserido em uma região próxima à Praia do
                  Novo Campeche, caracterizada por ruas residenciais e áreas de vegetação nativa.
                </p>
                <p>
                  O empreendimento integra o portfólio da MPEN em Florianópolis e representa sua
                  participação em projetos que valorizam a relação entre moradia, arquitetura e
                  entorno natural.
                </p>
                <p className="project-story-note">Construído em parceria com a CDE Via Sul</p>
              </div>
            ) : null}
            {item.slug === "riozinho-o2" ? (
              <div className="project-story">
                <h2>Riozinho O2: apartamentos e coberturas no Campeche, Florianópolis</h2>
                <p>
                  O Riozinho O2 é um empreendimento residencial localizado no Campeche, no Sul da Ilha
                  de Florianópolis. Entregue em 2013, o projeto integra o portfólio de empreendimentos
                  da MPEN Incorporadora.
                </p>
                <p>
                  Desenvolvido em meio a uma área de vegetação nativa, o residencial combina arquitetura
                  contemporânea, privacidade e soluções voltadas à sustentabilidade.
                </p>
                <p>
                  O empreendimento reúne apartamentos com uma suíte, unidades de dois dormitórios e
                  coberturas com duas suítes, com áreas privativas que variam de 55 m² a 143 m².
                </p>
                <p>
                  Entre seus diferenciais estão o reaproveitamento da água da chuva, o sistema próprio
                  de tratamento de esgoto, a iluminação com sensores de presença nas áreas comuns e o
                  paisagismo com vegetação nativa.
                </p>
                <p>
                  Próximo à Praia do Campeche e à região do Riozinho, o Riozinho O2 representa uma
                  proposta residencial que valoriza a relação entre moradia, conforto e preservação
                  ambiental.
                </p>
                <p className="project-story-note">Construído em parceria com a CDE Via Sul</p>
              </div>
            ) : null}
            {item.slug === "sanctuary" ? (
              <div className="project-story">
                <h2>
                  Sanctuary: empreendimento residencial com vista para o mar no Rio Tavares,
                  Florianópolis
                </h2>
                <p>
                  O Sanctuary é um empreendimento residencial localizado no Rio Tavares, no Sul da Ilha
                  de Florianópolis, entregue em 2011.
                </p>
                <p>
                  Com apenas 19 unidades, o projeto foi desenvolvido a partir do conceito Ocean Front,
                  valorizando a conexão entre os ambientes internos, a paisagem natural e a vista para
                  o mar por meio de grandes janelas.
                </p>
                <p>
                  A arquitetura apresenta elementos contemporâneos e espaços planejados para
                  proporcionar conforto e privacidade aos moradores.
                </p>
                <p>
                  A infraestrutura de lazer inclui piscina, espaço gourmet, sala de fitness e solarium
                  no terraço, criando ambientes dedicados ao descanso e à convivência.
                </p>
                <p>
                  Localizado na Servidão Pedro Edmundo de Bitencourt, o Sanctuary integra o portfólio
                  de empreendimentos entregues da MPEN em Florianópolis, destacando a relação entre
                  arquitetura, natureza e qualidade de vida.
                </p>
                <p className="project-story-note">Construído em parceria com a CDE Via Sul</p>
              </div>
            ) : null}
            {item.slug === "riozinho-style" ? (
              <div className="project-story">
                <h2>Riozinho Style: apartamentos no Campeche com certificação Carbono Neutro</h2>
                <p>
                  O Riozinho Style é um empreendimento residencial localizado no Campeche, no Sul da
                  Ilha de Florianópolis, entregue em 2009.
                </p>
                <p>
                  Inspirado na natureza e nas características do seu entorno, o projeto se destaca por
                  ter sido o primeiro residencial de Santa Catarina entregue com certificação Carbono
                  Neutro, compensando as emissões de dióxido de carbono geradas durante a construção
                  por meio do plantio de árvores em projetos ambientais.
                </p>
                <p>
                  O empreendimento reúne apartamentos de 2 e 3 dormitórios e incorpora soluções
                  ambientais, como sistema próprio de tratamento de esgoto, reaproveitamento da água da
                  chuva, sensores de presença nas áreas comuns e paisagismo com vegetação nativa.
                </p>
                <p>
                  Localizado na Servidão Catavento, próximo à região do Riozinho e à Praia do Campeche,
                  o Riozinho Style integra o portfólio de empreendimentos entregues da MPEN,
                  representando uma proposta residencial que valoriza a relação entre arquitetura,
                  sustentabilidade e qualidade de vida.
                </p>
                <p className="project-story-note">Construído em parceria com a CDE Via Sul</p>
              </div>
            ) : null}
            {item.slug === "porto-das-mares" ? (
              <div className="project-story">
                <h2>Porto das Marés: apartamentos pé na areia no Morro das Pedras, Florianópolis</h2>
                <p>
                  O Porto das Marés é um empreendimento residencial localizado no Morro das Pedras, no
                  Sul da Ilha de Florianópolis. Entregue em 2003, integra o portfólio de
                  empreendimentos da MPEN Incorporadora.
                </p>
                <p>
                  Com localização privilegiada junto à Praia do Morro das Pedras, o condomínio oferece
                  acesso exclusivo à praia, proporcionando uma relação direta com o litoral e a
                  paisagem natural da região.
                </p>
                <p>
                  O residencial reúne apartamentos com áreas de 39 m² a 134 m², contemplando diferentes
                  necessidades de espaço e estilos de vida.
                </p>
                <p>
                  Entre os diferenciais estão a piscina e a portaria 24 horas, que complementam a
                  infraestrutura de lazer, conforto e segurança do condomínio.
                </p>
                <p>
                  O Porto das Marés representa um dos primeiros empreendimentos da trajetória da MPEN
                  no Sul de Florianópolis, com uma proposta residencial que valoriza a proximidade com
                  o mar.
                </p>
              </div>
            ) : null}
            {item.slug === "island" ? (
              <div className="project-story">
                <h2>Island Home & Resort: apartamentos frente-mar no Morro das Pedras, Florianópolis</h2>
                <p>
                  O Island Home & Resort é um empreendimento residencial localizado em frente à Praia
                  do Morro das Pedras, no Sul da Ilha de Florianópolis. O projeto combina arquitetura
                  contemporânea, paisagismo e uma proposta de moradia inspirada no conforto de um
                  resort.
                </p>
                <p>
                  O residencial oferece apartamentos de dois dormitórios e coberturas, com varandas
                  amplas e piscinas privativas em determinadas unidades voltadas para o mar.
                </p>
                <p>
                  Entre os diferenciais estão as piscinas adulto e infantil, academia, brinquedoteca,
                  salão de festas e café-bistrô, além da proposta de serviços inspirados na hotelaria.
                </p>
                <p>
                  A localização frente-mar proporciona uma relação privilegiada com a paisagem da Praia
                  do Morro das Pedras, em uma região marcada pela presença da natureza.
                </p>
                <p>
                  O Island Home & Resort integra o portfólio de empreendimentos da MPEN em
                  Florianópolis, destacando-se pela combinação entre localização, lazer e arquitetura.
                </p>
                <p className="project-story-note">Construído em parceria com a CDE Via Sul</p>
              </div>
            ) : null}
          </div>
          <aside className="project-card">
            <p className="kicker">Interesse</p>
            <h2>Fale sobre este empreendimento</h2>
            <p>Deixe seu contato. A equipe da MPEN retorna sobre {item.name}.</p>
            <ContactForm source="empreendimento" developmentSlug={item.slug} />
          </aside>
        </div>
      </section>
    </>
  );
}
