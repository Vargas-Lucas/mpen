import Link from "next/link";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import { PageHeader } from "@/components/PageHeader";
import { getDevelopments } from "@/lib/data";

export const metadata = { title: "Empreendimentos" };

const filters = [
  { key: "", label: "Todos" },
  { key: "lancamento", label: "Lançamentos" },
  { key: "construcao", label: "Em construção" },
  { key: "entregue", label: "Entregues" },
];

function listingHref(status: string, q: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/empreendimentos?${query}` : "/empreendimentos";
}

function resultLabel(count: number, status: string, q: string) {
  const noun =
    status === "lancamento"
      ? count === 1
        ? "lançamento"
        : "lançamentos"
      : status === "construcao"
        ? "em construção"
        : status === "entregue"
          ? count === 1
            ? "entregue"
            : "entregues"
          : count === 1
            ? "empreendimento"
            : "empreendimentos";
  const base = `${count} ${noun}`;
  return q ? `${base} para “${q}”` : base;
}

export default async function DevelopmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; cidade?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const status = params.status || "";
  const city = params.cidade || "";
  const items = await getDevelopments({ q, status, city });

  return (
    <>
      <PageHeader
        compact
        title="Empreendimentos"
        lede="Lançamentos, obras e entregas da MPEN no sul da Ilha de Florianópolis."
      />
      <section className="listing">
        <div className="container">
          <div className="listing-bar">
            <form className="listing-search" action="/empreendimentos" method="get">
              {status ? <input type="hidden" name="status" value={status} /> : null}
              <input name="q" defaultValue={q} placeholder="Busque por bairro ou empreendimento" />
              <button type="submit">Buscar</button>
            </form>
            <nav className="home-paths" aria-label="Filtrar empreendimentos">
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
                {resultLabel(items.length, status, q)}
                {q || status ? <Link href="/empreendimentos">Limpar filtros</Link> : null}
              </p>
              <div className="dev-grid">
                {items.map((item, index) => (
                  <DevelopmentCard key={item.id} item={item} priority={index === 0} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty">
              <p>{q ? `Nenhum empreendimento encontrado para “${q}”.` : "Nenhum empreendimento encontrado com esses filtros."}</p>
              <Link href="/empreendimentos">Ver todos os empreendimentos</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
