import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { ui } from "@/lib/copy/ui";
import { contactChannel } from "@/lib/contacts";
import { getDevelopments } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";

export async function generateMetadata() {
  return { title: ui(await getLocale()).partner.title };
}

export default async function PartnerPage() {
  const copy = ui(await getLocale());
  const t = copy.partner;
  const total = (await getDevelopments()).length;
  const comercial = contactChannel("comercial");
  const steps = [
    { title: t.step1, text: t.step1Text },
    { title: t.step2, text: t.step2Text },
    { title: t.step3, text: t.step3Text },
  ];

  return (
    <>
      <PageHeader compact className="copy-justified" title={t.title} lede={t.lede} />

      <section className="partner-intro">
        <div className="container partner-layout">
          <div className="partner-copy">
            <p className="kicker">{t.kicker}</p>
            <h2>{t.h2}</h2>
            <p>{t.p1}</p>
            <p>{t.p2}</p>
            <p>{t.p3}</p>
            <ul className="partner-points">
              <li>
                <strong>
                  {total} {copy.listing.manyDev}
                </strong>
                <span>{t.portfolio}</span>
              </li>
              <li>
                <strong>{t.since}</strong>
                <span>{t.sinceText}</span>
              </li>
              <li>
                <strong>{t.direct}</strong>
                <span>{t.directText}</span>
              </li>
            </ul>
            {comercial ? (
              <p className="partner-alt">
                {t.prefer}{" "}
                <a href={`https://wa.me/${comercial.whatsapp}`} target="_blank" rel="noreferrer">
                  {t.whatsapp}
                </a>
              </p>
            ) : null}
          </div>

          <aside className="partner-card">
            <h2>{t.cardTitle}</h2>
            <p>{t.cardText}</p>
            <ContactForm source="parceiro" fields="partner" submitLabel={t.submit} />
          </aside>
        </div>
      </section>

      <section className="partner-steps">
        <div className="container">
          <p className="kicker">{t.how}</p>
          <h2>{t.howTitle}</h2>
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
