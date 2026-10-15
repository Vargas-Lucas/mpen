import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Política de privacidade" };

const email = "contato@mpen.com.br";

const sections = [
  {
    id: "coleta",
    title: "Coleta de informações",
    paragraphs: [
      "Coletamos informações pessoais através de formulários disponíveis em nosso site. As informações que podemos coletar incluem:",
    ],
    items: [
      "Nome completo",
      "Endereço de e-mail",
      "Número de telefone",
      "Outras informações fornecidas voluntariamente pelo usuário",
    ],
    after: [
      "Esses dados são coletados para que possamos entrar em contato, fornecer informações sobre nossos serviços e aprimorar a experiência do usuário.",
      "Além disso, podemos coletar informações não pessoais automaticamente, como endereço IP, tipo de navegador e páginas visitadas, com a finalidade de melhorar a navegação e personalizar conteúdo.",
    ],
  },
  {
    id: "uso",
    title: "Uso das informações",
    paragraphs: ["Os dados coletados são utilizados exclusivamente para os seguintes propósitos:"],
    items: [
      "Entrar em contato com o usuário",
      "Enviar informações sobre nossos empreendimentos, produtos e serviços",
      "Personalizar a experiência do usuário em nosso site",
      "Melhorar nosso atendimento e suporte ao cliente",
      "Atender a obrigações legais e regulatórias",
    ],
    after: [
      "O mpen.com.br não utiliza os dados coletados para fins além dos descritos nesta política, sem a autorização expressa do usuário.",
    ],
  },
  {
    id: "compartilhamento",
    title: "Compartilhamento de dados",
    paragraphs: ["Não compartilhamos suas informações pessoais com terceiros, exceto nos seguintes casos:"],
    items: [
      "Quando necessário para o processamento de solicitações específicas do usuário",
      "Para cumprimento de obrigações legais e regulamentares",
      "Em caso de fusão, aquisição ou reorganização societária, sempre respeitando as normas de privacidade aplicáveis",
    ],
    after: [
      "Nos comprometemos a exigir de qualquer terceiro envolvido a proteção adequada dos dados compartilhados, em conformidade com esta Política de Privacidade.",
    ],
  },
  {
    id: "seguranca",
    title: "Segurança das informações",
    paragraphs: [
      "Adotamos medidas técnicas e administrativas para garantir a segurança dos dados coletados, protegendo-os contra:",
    ],
    items: [
      "Acesso não autorizado",
      "Uso indevido ou alteração indevida",
      "Perda, destruição ou vazamento de informações",
    ],
    after: [
      "Apesar de nossos esforços, nenhum sistema é completamente seguro. Portanto, incentivamos os usuários a adotarem medidas de segurança online, como o uso de senhas fortes e a não compartilhamento de informações sensíveis por meios inseguros.",
    ],
  },
  {
    id: "direitos",
    title: "Direitos do usuário",
    paragraphs: ["De acordo com a legislação vigente, você tem o direito de:"],
    items: [
      "Acessar suas informações pessoais armazenadas",
      "Solicitar a correção de dados imprecisos ou incompletos",
      "Solicitar a exclusão de seus dados pessoais, salvo quando houver necessidade de manutenção para cumprimento de obrigação legal",
      "Revogar o consentimento para o uso de suas informações, quando aplicável",
    ],
    after: [
      `Caso deseje exercer qualquer um desses direitos, entre em contato pelo e-mail ${email}.`,
    ],
  },
  {
    id: "cookies",
    title: "Cookies e tecnologias semelhantes",
    paragraphs: [
      "Nosso site pode utilizar cookies e tecnologias semelhantes para aprimorar a experiência do usuário, armazenando preferências e coletando informações sobre navegação. Você pode gerenciar as configurações de cookies diretamente no seu navegador.",
    ],
  },
  {
    id: "alteracoes",
    title: "Alterações nesta política",
    paragraphs: [
      "Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na legislação vigente. As alterações serão publicadas nesta página e, sempre que necessário, notificaremos os usuários sobre mudanças significativas.",
      "Recomendamos que você revise esta política regularmente para se manter informado sobre como protegemos seus dados.",
    ],
  },
  {
    id: "contato",
    title: "Contato",
    paragraphs: [
      `Se tiver qualquer dúvida sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato pelo e-mail ${email}.`,
    ],
  },
];

function Text({ value }: { value: string }) {
  if (!value.includes(email)) return value;
  const [before, after] = value.split(email);
  return (
    <>
      {before}
      <a href={`mailto:${email}`}>{email}</a>
      {after}
    </>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        compact
        title="Política de privacidade"
        lede="A segurança e a privacidade dos seus dados são prioridades para o site mpen.com.br. Esta política explica como coletamos, usamos, armazenamos e protegemos suas informações pessoais."
      />
      <section className="policy-wrap">
        <div className="container policy">
          <nav className="policy-nav" aria-label="Nesta política">
            <p className="kicker">Nesta página</p>
            <ol>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="policy-body">
            <p className="policy-lead">Ao utilizar nosso site, você concorda com os termos descritos abaixo.</p>
            {sections.map((section, index) => (
              <section id={section.id} key={section.id}>
                <h2>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    <Text value={paragraph} />
                  </p>
                ))}
                {section.items ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.after?.map((paragraph) => (
                  <p key={paragraph}>
                    <Text value={paragraph} />
                  </p>
                ))}
              </section>
            ))}
            <p className="policy-related">
              O regulamento de privacidade em PDF está na página de <Link href="/compliance">Compliance</Link>.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
