"use client";

import Link from "next/link";
import { rememberReturn } from "@/components/BackButton";
import { deliveryLabel, developmentAlt, statusLabel } from "@/lib/format";
import { coverImage } from "@/lib/images";
import type { Development } from "@/lib/types";

export function DevelopmentCard({ item, priority = false }: { item: Development; priority?: boolean }) {
  const image = coverImage(item.slug);

  return (
    <article className={`dev-card status-${item.status}`} data-slug={item.slug}>
      <Link href={`/empreendimentos/${item.slug}`} onClick={rememberReturn}>
        <div className="dev-media">
          {image ? (
            <img
              src={image}
              alt={developmentAlt(item)}
              width={800}
              height={500}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "low"}
              decoding="async"
            />
          ) : null}
        </div>
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
