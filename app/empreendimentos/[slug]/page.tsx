import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { ProjectGallery } from "@/components/ProjectGallery";
import { getDevelopment } from "@/lib/data";
import { ui } from "@/lib/copy/ui";
import { projectStory } from "@/lib/copy/stories";
import { deliveryLabel, developmentAlt, statusLabel } from "@/lib/format";
import { getLocale } from "@/lib/i18n-server";
import { coverImage, galleryImages } from "@/lib/images";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const copy = ui(await getLocale());
  const item = await getDevelopment(slug);
  return { title: item?.name ?? copy.project.fallback };
}

export default async function DevelopmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const copy = ui(locale);
  const item = await getDevelopment(slug);
  if (!item) notFound();
  const images = [...new Set([coverImage(item.slug), ...galleryImages(item.slug)].filter(Boolean))];
  const story = projectStory(item.slug, locale);

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
            <ProjectGallery images={images} name={developmentAlt(item, locale)} />
            <div className="project-facts">
              <div>
                <p className="fact-kicker">{copy.project.status}</p>
                <p className="fact-value">{statusLabel(item.status, locale)}</p>
              </div>
              <div>
                <p className="fact-kicker">{copy.project.city}</p>
                <p className="fact-value">{item.city}</p>
              </div>
              <div>
                <p className="fact-kicker">{copy.project.region}</p>
                <p className="fact-value">
                  {item.slug === "sunset-village" ? "Ribeirão da Ilha" : item.neighborhood}
                </p>
              </div>
              {item.delivery ? (
                <div>
                  <p className="fact-kicker">{copy.project.delivery}</p>
                  <p className="fact-value">
                    {item.slug === "sunset-village" ? "Agosto/29" : deliveryLabel(item, locale)}
                  </p>
                </div>
              ) : null}
              {item.typology ? (
                <div>
                  <p className="fact-kicker">{copy.project.typology}</p>
                  <p className="fact-value">{item.typology}</p>
                </div>
              ) : null}
              {item.area ? (
                <div>
                  <p className="fact-kicker">{copy.project.area}</p>
                  <p className="fact-value">{item.area}</p>
                </div>
              ) : null}
            </div>
            {item.slug === "sunset-village" ? (
              <a className="project-site" href="https://sunsetvillage.com.br/">
                {copy.project.knowMore}
              </a>
            ) : null}
            {story ? (
              <div className="project-story">
                <h2>{story.title}</h2>
                {story.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {story.note ? <p className="project-story-note">{copy.project.builtWith}</p> : null}
              </div>
            ) : null}
          </div>
          <aside className="project-card">
            <p className="kicker">{copy.project.interest}</p>
            <h2>{copy.project.talk}</h2>
            <p>{copy.project.leave} {item.name}.</p>
            <ContactForm source="empreendimento" developmentSlug={item.slug} />
          </aside>
        </div>
      </section>
    </>
  );
}
