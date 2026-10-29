"use client";

import Link from "next/link";
import { rememberReturn } from "@/components/BackButton";
import { useI18n } from "@/components/I18nProvider";
import { deliveryLabel, developmentAlt, placeLabel, statusLabel } from "@/lib/format";
import { coverImage } from "@/lib/images";
import type { Development } from "@/lib/types";

export function DevelopmentCard({ item, priority = false }: { item: Development; priority?: boolean }) {
  const { locale, t } = useI18n();
  const image = coverImage(item.slug);

  return (
    <article className={`dev-card status-${item.status}`} data-slug={item.slug}>
      <Link href={`/empreendimentos/${item.slug}`} onClick={rememberReturn}>
        <div className="dev-media">
          {image ? (
            <img
              src={image}
              alt={developmentAlt(item, locale)}
              width={800}
              height={500}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "low"}
              decoding="async"
            />
          ) : null}
        </div>
        <div className="dev-body">
          <p className="dev-status">{statusLabel(item.status, locale)}</p>
          <h3>{item.name}</h3>
          <p className="dev-place">{placeLabel(item.neighborhood, locale)}</p>
          {item.summary ? <p className="dev-summary">{item.summary}</p> : null}
          {item.delivery ? <p className="dev-meta">{deliveryLabel(item, locale)}</p> : null}
          <span className="dev-consult">{t.status.consult}</span>
        </div>
      </Link>
    </article>
  );
}
