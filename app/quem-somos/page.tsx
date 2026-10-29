import type { ReactNode } from "react";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import { PageHeader } from "@/components/PageHeader";
import { ui } from "@/lib/copy/ui";
import { getDevelopments } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";

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

export async function generateMetadata() {
  return { title: ui(await getLocale()).about.title };
}

export default async function AboutPage() {
  const t = ui(await getLocale());
  const projects = (await getDevelopments()).slice(0, 6);
  const values: { title: string; icon: ReactNode; text: string }[] = [
    { title: t.about.mission, icon: <Mission />, text: t.about.missionText },
    { title: t.about.vision, icon: <Vision />, text: t.about.visionText },
    { title: t.about.values, icon: <Values />, text: t.about.valuesText },
  ];

  return (
    <>
      <PageHeader title={t.about.title} lede={t.about.lede} compact className="about-hero" />

      <section className="about-banner">
        <img src="/images/sobre/capa.png" alt={t.about.bannerAlt} />
        <div className="container">
          <p className="about-banner-kicker">{t.about.kicker}</p>
          <h2>{t.about.h2}</h2>
        </div>
      </section>

      <section className="section about-story-wrap">
        <div className="container about-story">
          <p className="about-story-lede">{t.about.lede2}</p>
          <div className="about-story-copy">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p>{t.about.p3}</p>
          </div>
        </div>
      </section>

      <section className="principles">
        <div className="principles-glow" aria-hidden="true" />
        <div className="container">
          <p className="principles-kicker">{t.about.move}</p>
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
          <img src="/images/sobre/compromisso.jpg" alt={t.about.commitAlt} />
          <div className="prose">
            <h2>{t.about.commitTitle}</h2>
            <p>{t.about.c1}</p>
            <p>{t.about.c2}</p>
            <p>{t.about.c3}</p>
            <p>{t.about.c4}</p>
          </div>
        </div>
      </section>

      <section className="section about-band">
        <div className="container">
          <h2 className="about-title">{t.home.catalogTitle}</h2>
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
