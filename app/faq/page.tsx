import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { faqContent } from "@/lib/copy/faq";
import { ui } from "@/lib/copy/ui";
import { getLocale } from "@/lib/i18n-server";

export async function generateMetadata() {
  return { title: ui(await getLocale()).faq.title };
}

export default async function FaqPage() {
  const locale = await getLocale();
  const t = ui(locale);
  const groups = faqContent(locale);

  return (
    <>
      <PageHeader className="copy-justified" title={t.faq.title} lede={t.faq.lede} />
      <section className="section">
        <div className="container faq" style={{ maxWidth: 760 }}>
          {groups.map((group) => (
            <div className="faq-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>
                    {item.parts.map((part, index) =>
                      part.href ? (
                        part.href.startsWith("/") ? (
                          <Link key={`${item.question}-${index}`} href={part.href}>
                            {part.text}
                          </Link>
                        ) : (
                          <a
                            key={`${item.question}-${index}`}
                            href={part.href}
                            {...("external" in part && part.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          >
                            {part.text}
                          </a>
                        )
                      ) : (
                        <span key={`${item.question}-${index}`}>{part.text}</span>
                      ),
                    )}
                  </p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
