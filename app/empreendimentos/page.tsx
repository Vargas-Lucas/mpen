import Link from "next/link";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import { PageHeader } from "@/components/PageHeader";
import { getDevelopments } from "@/lib/data";

export const metadata = { title: "Empreendimentos" };

const filters = [
  { key: "", label: "Todos", href: "/empreendimentos" },
  { key: "lancamento", label: "Lançamentos", href: "/empreendimentos?status=lancamento" },
  { key: "construcao", label: "Em construção", href: "/empreendimentos?status=construcao" },
  { key: "entregue", label: "Entregues", href: "/empreendimentos?status=entregue" },
];

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
        title="Empreendimentos"
        lede="Lançamentos, obras e entregas da MPEN no sul da Ilha de Florianópolis."
      />
      <section className="section">
        <div className="container">
          <form className="blog-search" action="/empreendimentos" method="get">
            {status ? <input type="hidden" name="status" value={status} /> : null}
            <input name="q" defaultValue={q} placeholder="Busque por bairro ou empreendimento" />
            <button type="submit">Buscar</button>
          </form>
          <div className="filters">
            {filters.map((filter) => (
              <Link key={filter.key} href={filter.href} className={status === filter.key ? "active" : ""}>
                {filter.label}
              </Link>
            ))}
          </div>
          {items.length > 0 ? (
            <div className="dev-grid">
              {items.map((item) => (
                <DevelopmentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>Nenhum empreendimento encontrado com esses filtros.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
