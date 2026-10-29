import Link from "next/link";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import { PageHeader } from "@/components/PageHeader";
import { ui, type Ui } from "@/lib/copy/ui";
import { getDevelopments } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";

function listingHref(status: string, q: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/empreendimentos?${query}` : "/empreendimentos";
}

function resultLabel(count: number, status: string, q: string, listing: Ui["listing"]) {
  const noun =
    status === "lancamento"
      ? count === 1
        ? listing.oneLaunch
        : listing.manyLaunch
      : status === "construcao"
        ? listing.building
        : status === "entregue"
          ? count === 1
            ? listing.oneDelivered
            : listing.manyDelivered
          : count === 1
            ? listing.oneDev
            : listing.manyDev;
  const base = `${count} ${noun}`;
  return q ? `${base} ${listing.forQuery} “${q}”` : base;
}

export async function generateMetadata() {
  return { title: ui(await getLocale()).listing.title };
}

export default async function DevelopmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; cidade?: string }>;
}) {
  const locale = await getLocale();
  const t = ui(locale);
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const status = params.status || "";
  const city = params.cidade || "";
  const items = await getDevelopments({ q, status, city });
  const filters = [
    { key: "", label: t.listing.all },
    { key: "lancamento", label: t.home.launches },
    { key: "construcao", label: t.home.building },
    { key: "entregue", label: t.home.delivered },
  ];

  return (
    <>
      <PageHeader compact title={t.listing.title} lede={t.listing.lede} />
      <section className="listing">
        <div className="container">
          <div className="listing-bar">
            <form className="listing-search" action="/empreendimentos" method="get">
              {status ? <input type="hidden" name="status" value={status} /> : null}
              <input name="q" defaultValue={q} placeholder={t.listing.searchPlaceholder} />
              <button type="submit">{t.listing.search}</button>
            </form>
            <nav className="home-paths" aria-label={t.home.filterAria}>
              {filters.map((filter) => (
                <Link
                  key={filter.key || "todos"}
                  href={listingHref(filter.key, q)}
                  className={status === filter.key ? "is-on" : undefined}
                  aria-current={status === filter.key ? "page" : undefined}
                >
                  {filter.label}
                </Link>
              ))}
            </nav>
          </div>
          {items.length > 0 ? (
            <>
              <p className="listing-meta">
                {resultLabel(items.length, status, q, t.listing)}
                {q || status ? <Link href="/empreendimentos">{t.listing.clear}</Link> : null}
              </p>
              <div className="dev-grid">
                {items.map((item, index) => (
                  <DevelopmentCard key={item.id} item={item} priority={index === 0} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty">
              <p>
                {q ? `${t.listing.emptyQuery} “${q}”.` : t.listing.emptyFilters}
              </p>
              <Link href="/empreendimentos">{t.listing.seeAll}</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
