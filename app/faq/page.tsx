import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Perguntas frequentes" };

const clientArea = "https://portaldocliente.expertsystem.com.br/entrar/mpen";

const groups = [
  {
    title: "Sobre a MPEN",
    items: [
      {
        question: "1. O que é a MPEN Incorporadora?",
        answer: (
          <p>
            A MPEN é uma incorporadora com atuação no mercado imobiliário do Sul da Ilha de
            Florianópolis desde 2003. Ao longo de sua trajetória, participou do desenvolvimento de
            empreendimentos residenciais que valorizam a localização, a arquitetura e a qualidade
            construtiva.
          </p>
        ),
      },
      {
        question: "2. Em quais regiões de Florianópolis a MPEN atua?",
        answer: (
          <p>
            A MPEN concentra sua atuação no Sul da Ilha de Florianópolis, com empreendimentos em
            regiões como Campeche, Morro das Pedras, Rio Tavares e Ribeirão da Ilha.
          </p>
        ),
      },
      {
        question: "3. Quais empreendimentos a MPEN já desenvolveu?",
        answer: (
          <p>
            O portfólio da MPEN reúne empreendimentos residenciais entregues, projetos em construção
            e lançamentos no Sul de Florianópolis. Você pode conhecer cada um deles, visualizar
            fotografias e consultar suas características na{" "}
            <Link href="/empreendimentos">página de empreendimentos</Link>.
          </p>
        ),
      },
    ],
  },
  {
    title: "Empreendimentos e oportunidades",
    items: [
      {
        question: "4. A MPEN possui apartamentos à venda em Florianópolis?",
        answer: (
          <p>
            A disponibilidade de imóveis varia conforme o empreendimento e a etapa de
            comercialização. Para conhecer as unidades disponíveis e receber informações
            atualizadas, entre em contato com a equipe comercial da MPEN.
          </p>
        ),
      },
      {
        question: "5. Quais empreendimentos da MPEN estão em construção?",
        answer: (
          <p>
            O Sunset Village é um dos empreendimentos em construção da MPEN, localizado no
            Loteamento Portal do Ribeirão, no Sul da Ilha de Florianópolis, com previsão de entrega
            em 2029. Para consultar informações atualizadas sobre os projetos em andamento, acesse a{" "}
            <Link href="/empreendimentos">página de empreendimentos</Link>.
          </p>
        ),
      },
      {
        question: "6. Como posso conhecer as plantas e os diferenciais dos empreendimentos?",
        answer: (
          <p>
            Na página de cada empreendimento, você encontra fotografias, informações sobre a
            localização e características do projeto. Para consultar plantas, disponibilidade de
            unidades e condições comerciais, entre em contato com nossa equipe.
          </p>
        ),
      },
    ],
  },
  {
    title: "Clientes e acompanhamento de obras",
    items: [
      {
        question: "7. Como posso acompanhar o andamento da minha obra?",
        answer: (
          <p>
            Clientes da MPEN podem acessar a{" "}
            <a href={clientArea} target="_blank" rel="noopener noreferrer">
              Área do Cliente
            </a>
            , disponível no menu principal do site, para utilizar os serviços e consultar as
            informações disponibilizadas no portal.
          </p>
        ),
      },
      {
        question: "8. Como entro em contato com a MPEN?",
        answer: (
          <p>
            Você pode entrar em contato com a equipe comercial pelo e-mail{" "}
            <a href="mailto:comercial@mpen.net.br">comercial@mpen.net.br</a>, pelo telefone{" "}
            <a href="tel:+5548991050594">(48) 99105-0594</a> ou pelo formulário disponível na{" "}
            <Link href="/contato">página de contato</Link>.
          </p>
        ),
      },
    ],
  },
  {
    title: "Parcerias comerciais",
    items: [
      {
        question: "9. Sou corretor de imóveis. Como posso me tornar parceiro da MPEN?",
        answer: (
          <p>
            Corretores de imóveis e imobiliárias interessados em apresentar os empreendimentos da
            MPEN podem preencher o formulário disponível na página{" "}
            <Link href="/seja-parceiro">Seja parceiro</Link>. Nossa equipe comercial receberá o
            cadastro para avaliar as possibilidades de parceria.
          </p>
        ),
      },
      {
        question: "10. A MPEN trabalha com imobiliárias parceiras?",
        answer: (
          <p>
            A MPEN disponibiliza um canal de contato para corretores e imobiliárias interessados em
            estabelecer parcerias comerciais. Para saber mais, acesse a página{" "}
            <Link href="/seja-parceiro">Seja parceiro</Link> e envie seus dados à equipe comercial.
          </p>
        ),
      },
      {
        question: "11. Como posso receber informações sobre os lançamentos da MPEN?",
        answer: (
          <p>
            Para conhecer os lançamentos e acompanhar as novidades dos empreendimentos da MPEN,
            consulte nosso site ou entre em contato com a equipe comercial. Assim, você poderá
            receber informações atualizadas sobre os projetos e as oportunidades disponíveis.
          </p>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        className="copy-justified"
        title="Perguntas frequentes"
        lede="Tire suas dúvidas sobre a MPEN Incorporadora, nossos empreendimentos no Sul da Ilha de Florianópolis, obras em andamento, atendimento e parcerias comerciais."
      />
      <section className="section">
        <div className="container faq" style={{ maxWidth: 760 }}>
          {groups.map((group) => (
            <div className="faq-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  {item.answer}
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
