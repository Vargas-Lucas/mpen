import { DeleteDevelopmentButton } from "@/components/DeleteDevelopmentButton";
import { SwapSpotlight } from "@/components/SwapSpotlight";
import { requireEditor } from "@/lib/auth";
import { getDevelopments, getSpotlightDevelopments } from "@/lib/data";

const STATUS: Record<string, string> = {
  lancamento: "Lançamento",
  construcao: "Em construção",
  entregue: "Entregue",
};

export default async function DevelopmentsAdminPage() {
  await requireEditor();
  const [items, spotlight] = await Promise.all([getDevelopments(), getSpotlightDevelopments()]);
  const spotlightIds = new Set(spotlight.map((item) => item.id));
  const replacements = items.filter((item) => !spotlightIds.has(item.id));

  return (
    <section className="admin-panel">
      <p className="admin-back">
        <a href="/admin">Painel</a>
      </p>
      <div className="admin-head">
        <div>
          <p className="admin-kicker">Empreendimentos</p>
          <h1>Empreendimentos</h1>
          <p>Crie a ficha, envie as fotos e escreva o texto em português, inglês e espanhol. Os três destaques aparecem no carrossel da home.</p>
        </div>
        <a className="admin-submit admin-submit-inline" href="/admin/empreendimentos/novo">
          Novo empreendimento
        </a>
      </div>
      {items.length ? (
        <ul className="admin-list">
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>
                  {item.name}
                  {spotlightIds.has(item.id) ? <span className="admin-spot">Destaque</span> : null}
                </strong>
                <p>
                  {STATUS[item.status] || item.status}
                  {item.neighborhood ? ` · ${item.neighborhood}` : ""}
                  {item.city ? ` · ${item.city}` : ""}
                </p>
              </div>
              <div className="admin-row-actions">
                {spotlightIds.has(item.id) && replacements.length ? (
                  <SwapSpotlight
                    id={item.id}
                    options={replacements.map((option) => ({ id: option.id, name: option.name }))}
                  />
                ) : null}
                <a className="admin-link" href={`/empreendimentos/${item.slug}?preview=1`} target="_blank" rel="noreferrer">
                  Ver
                </a>
                <a className="admin-link" href={`/admin/empreendimentos/${item.id}`}>
                  Editar
                </a>
                <DeleteDevelopmentButton id={item.id} name={item.name} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="admin-empty">Nenhum empreendimento cadastrado.</p>
      )}
    </section>
  );
}
