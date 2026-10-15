import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Termos de uso" };

const email = "contato@mpen.com.br";

const sections = [
  {
    id: "aceitacao",
    title: "Aceitação dos termos",
    paragraphs: [
      "Ao acessar e utilizar o site mpen.com.br, você declara ter lido, compreendido e concordado com os presentes Termos de Uso. O uso contínuo do site significa a aceitação integral destes termos.",
    ],
  },
  {
    id: "uso",
    title: "Uso permitido",
    groups: [
      {
        label: "Você pode:",
        items: [
          "Navegar pelo site e acessar conteúdo para fins informativos",
          "Baixar informações disponibilizadas publicamente, desde que não sejam alteradas ou reproduzidas para fins comerciais",
          "Entrar em contato com a MPEN para obter informações ou esclarecer dúvidas sobre os serviços oferecidos",
        ],
      },
      {
        label: "É proibido:",
        items: [
          "Utilizar qualquer conteúdo do site para fins comerciais sem autorização prévia",
          "Copiar, modificar, distribuir, transmitir ou explorar indevidamente qualquer parte do site",
          "Praticar qualquer ato que possa comprometer a segurança, funcionamento ou integridade do site",
        ],
      },
    ],
  },
  {
    id: "propriedade",
    title: "Propriedade intelectual",
    paragraphs: [
      "Todo o conteúdo presente no site mpen.com.br, incluindo textos, imagens, logotipos, ícones, vídeos e outros materiais, é de propriedade exclusiva da MPEN ou licenciado para seu uso e encontra-se protegido por leis de direitos autorais e propriedade intelectual.",
      "O uso indevido de qualquer material do site sem autorização expressa poderá resultar em penalidades legais.",
    ],
  },
  {
    id: "responsabilidade",
    title: "Limitação de responsabilidade",
    paragraphs: [
      "Nos esforçamos para manter as informações do site atualizadas e precisas. No entanto, não garantimos que todas as informações estejam livres de erros, omissões ou desatualizações.",
      "A MPEN não se responsabiliza por:",
    ],
    items: [
      "Qualquer dano ou prejuízo resultante do uso ou impossibilidade de uso do site",
      "Conteúdo de terceiros acessado por meio de links disponibilizados no site",
      "Falhas técnicas, interrupções ou indisponibilidade temporária do site",
    ],
    after: ["O uso do site é de responsabilidade do próprio usuário."],
  },
  {
    id: "alteracoes",
    title: "Alterações nos termos",
    paragraphs: [
      "A MPEN reserva-se o direito de modificar estes Termos de Uso a qualquer momento, sem aviso prévio. As alterações entrarão em vigor imediatamente após sua publicação no site.",
      "Recomendamos que os usuários revisitem esta página regularmente para se manterem atualizados sobre eventuais mudanças.",
    ],
  },
  {
    id: "contato",
    title: "Contato",
    paragraphs: [
      `Para quaisquer dúvidas, solicitações ou questionamentos sobre estes Termos de Uso, entre em contato pelo e-mail ${email}.`,
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

export default function TermsPage() {
  return (
    <>
      <PageHeader
        compact
        title="Termos de uso"
        lede="A utilização do site mpen.com.br está sujeita aos seguintes Termos de Uso."
      />
      <section className="policy-wrap">
        <div className="container policy">
          <nav className="policy-nav" aria-label="Nestes termos">
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
            <p className="policy-lead">
              Ao acessar e navegar pelo site, você concorda em cumprir os termos estabelecidos abaixo. Caso não
              concorde, recomendamos que interrompa o uso deste site imediatamente.
            </p>
            {sections.map((section, index) => (
              <section id={section.id} key={section.id}>
                <h2>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>
                    <Text value={paragraph} />
                  </p>
                ))}
                {section.groups?.map((group) => (
                  <div key={group.label}>
                    <p className="policy-label">{group.label}</p>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {"items" in section && section.items ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {"after" in section &&
                  section.after?.map((paragraph) => (
                    <p key={paragraph}>
                      <Text value={paragraph} />
                    </p>
                  ))}
              </section>
            ))}
            <p className="policy-related">
              O tratamento de dados pessoais está na <Link href="/politica-de-privacidade">Política de privacidade</Link>.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
