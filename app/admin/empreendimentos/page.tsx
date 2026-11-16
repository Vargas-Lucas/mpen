import { requireEditor } from "@/lib/auth";
import { getDevelopments } from "@/lib/data";

const STATUS: Record<string, string> = {
  lancamento: "Lançamento",
  construcao: "Em construção",
  entregue: "Entregue",
};

export default async function DevelopmentsAdminPage() {
  await requireEditor();
  const items = await getDevelopments();

  return (
    <section className="admin-panel">
      <p className="admin-back">
        <a href="/admin">Painel</a>
      </p>
      <div className="admin-head">
        <div>
          <p className="admin-kicker">Empreendimentos</p>
          <h1>Empreendimentos</h1>
          <p>Crie a ficha, envie as fotos e escreva o texto em português, inglês e espanhol.</p>
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
                <strong>{item.name}</strong>
                <p>
                  {STATUS[item.status] || item.status}
                  {item.neighborhood ? ` · ${item.neighborhood}` : ""}
                  {item.city ? ` · ${item.city}` : ""}
                </p>
              </div>
              <div className="admin-row-actions">
                <a className="admin-link" href={`/empreendimentos/${item.slug}?preview=1`} target="_blank" rel="noreferrer">
                  Ver
                </a>
                <a className="admin-link" href={`/admin/empreendimentos/${item.id}`}>
                  Editar
                </a>
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
