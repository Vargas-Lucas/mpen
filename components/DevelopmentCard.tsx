import Link from "next/link";
import { deliveryLabel, statusLabel } from "@/lib/format";
import { coverImage } from "@/lib/images";
import type { Development } from "@/lib/types";

export function DevelopmentCard({ item }: { item: Development }) {
  const image = coverImage(item.slug);

  return (
    <article className={`dev-card status-${item.status}`}>
      <Link href={`/empreendimentos/${item.slug}`}>
        <div className="dev-media">{image ? <img src={image} alt="" /> : null}</div>
        <div className="dev-body">
          <p className="dev-status">{statusLabel(item.status)}</p>
          <h3>{item.name}</h3>
          <p className="dev-place">
            {item.neighborhood.startsWith("Loteamento") ? item.neighborhood : `Bairro ${item.neighborhood}`}
          </p>
          {item.summary ? <p className="dev-summary">{item.summary}</p> : null}
          {item.delivery ? <p className="dev-meta">{deliveryLabel(item)}</p> : null}
          <span className="dev-consult">Consulte</span>
        </div>
      </Link>
    </article>
  );
}
