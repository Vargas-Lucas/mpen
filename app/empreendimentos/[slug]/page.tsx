import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { ProjectGallery } from "@/components/ProjectGallery";
import { getEditorSession } from "@/lib/auth";
import { getDevelopment } from "@/lib/data";
import { ui } from "@/lib/copy/ui";
import { localizeStory, resolveWebsite } from "@/lib/development-content";
import { deliveryLabel, developmentAlt, statusLabel } from "@/lib/format";
import { getLocale } from "@/lib/i18n-server";
import { resolveCover, resolveGallery } from "@/lib/images";
import { canonical } from "@/lib/seo";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const copy = ui(await getLocale());
  const item = await getDevelopment(slug);
  const isPreview = preview === "1" && Boolean(await getEditorSession());
  return {
    title: item?.name ?? copy.project.fallback,
    ...(item && !isPreview ? canonical(`/empreendimentos/${item.slug}`) : {}),
    ...(isPreview ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function DevelopmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const locale = await getLocale();
  const copy = ui(locale);
  const item = await getDevelopment(slug);
  if (!item) notFound();
  const isPreview = preview === "1" && Boolean(await getEditorSession());
  const images = [...new Set([resolveCover(item), ...resolveGallery(item)].filter(Boolean))];
  const story = await localizeStory(item, locale);
  const website = resolveWebsite(item);

  return (
    <>
      {isPreview ? (
        <div className="article-preview-bar">
          <div className="container article-preview-inner">
            <p>{copy.project.preview}</p>
            <Link href={`/admin/empreendimentos/${item.id}`}>{copy.project.backToEdit}</Link>
          </div>
        </div>
      ) : null}
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
            {website ? (
              <a className="project-site" href={website} target="_blank" rel="noopener noreferrer">
                {copy.project.knowMore}
              </a>
            ) : null}
            {story ? (
              <div className="project-story">
                {story.title ? <h2>{story.title}</h2> : null}
                {story.paragraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph}`}>{paragraph}</p>
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
