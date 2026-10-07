import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { getDevelopment } from "@/lib/data";
import { deliveryLabel, statusLabel } from "@/lib/format";
import { coverImage } from "@/lib/images";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getDevelopment(slug);
  return { title: item?.name ?? "Empreendimento" };
}

export default async function DevelopmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getDevelopment(slug);
  if (!item) notFound();
  const image = coverImage(item.slug);

  return (
    <>
      <PageHeader title={item.name} lede={item.summary || `${item.neighborhood}, ${item.city}`} />
      <div className="container detail">
        <div>
          {image ? <img className="detail-photo" src={image} alt="" /> : null}
          <div className="prose">
            <p>
              {item.summary ||
                "A descrição, as fotos e as plantas deste empreendimento entram pelo banco, nesta página."}
            </p>
          </div>
          <dl className="facts">
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
        <aside className="panel">
          <h2>Fale sobre este empreendimento</h2>
          <ContactForm source="empreendimento" developmentSlug={item.slug} />
        </aside>
      </div>
    </>
  );
}
