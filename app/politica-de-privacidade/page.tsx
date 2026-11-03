import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { privacySections } from "@/lib/copy/legal";
import { ui } from "@/lib/copy/ui";
import { getLocale } from "@/lib/i18n-server";

const email = "contato@mpen.com.br";

const emails = [email, "eduardo@mpen.net.br"];

function Text({ value }: { value: string }) {
  const pattern = new RegExp(`(${emails.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const parts = value.split(pattern);
  if (parts.length === 1) return value;
  return (
    <>
      {parts.map((part, index) =>
        emails.includes(part) ? (
          <a key={index} href={`mailto:${part}`}>
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

export async function generateMetadata() {
  return { title: ui(await getLocale()).privacy.title };
}

export default async function PrivacyPage() {
  const t = ui(await getLocale()).privacy;
  const sections = privacySections(await getLocale());

  return (
    <>
      <PageHeader compact title={t.title} lede={t.lede} />
      <section className="policy-wrap">
        <div className="container policy">
          <nav className="policy-nav" aria-label={t.nav}>
            <p className="kicker">{t.onPage}</p>
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
            <p className="policy-lead">{t.lead}</p>
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
              {t.related} <Link href="/compliance">{t.relatedLink}</Link>.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
