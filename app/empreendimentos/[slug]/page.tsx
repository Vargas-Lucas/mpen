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
            <dl className="project-facts">
              <div>
                <dt>Status</dt>
                <dd>{statusLabel(item.status)}</dd>
              </div>
              <div>
                <dt>Cidade</dt>
                <dd>{item.city}</dd>
              </div>
              <div>
                <dt>Região</dt>
                <dd>{item.neighborhood}</dd>
              </div>
              {item.delivery ? (
                <div>
                  <dt>Entrega</dt>
                  <dd>{deliveryLabel(item)}</dd>
                </div>
              ) : null}
              {item.typology ? (
                <div>
                  <dt>Tipologia</dt>
                  <dd>{item.typology}</dd>
                </div>
              ) : null}
              {item.area ? (
                <div>
                  <dt>Metragem</dt>
                  <dd>{item.area}</dd>
                </div>
              ) : null}
            </dl>
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
