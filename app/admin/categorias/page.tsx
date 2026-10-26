import Link from "next/link";
import { CategoryCreateForm } from "@/components/CategoryCreateForm";
import { deleteCategory } from "@/actions/categories";
import { requireEditor } from "@/lib/auth";
import { getAdminCategories } from "@/lib/data";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; uso?: string }>;
}) {
  await requireEditor();
  const { salvo, uso } = await searchParams;
  const categories = await getAdminCategories();

  return (
    <section className="admin-panel">
      <div className="admin-head">
        <div>
          <p className="admin-kicker">Blog</p>
          <h1>Categorias</h1>
          <p>Crie as categorias usadas nos artigos e no filtro do blog. Um artigo precisa de uma categoria para ser organizado.</p>
        </div>
        <Link className="admin-link" href="/admin">
          Voltar aos artigos
        </Link>
      </div>

      {salvo ? (
        <p className="ok" role="status">
          Categoria salva.
        </p>
      ) : null}
      {uso ? (
        <p className="err" role="status">
          Essa categoria ainda tem artigo. Mova ou apague os artigos antes de excluí-la.
        </p>
      ) : null}

      <CategoryCreateForm />

      {categories.length === 0 ? (
        <div className="admin-empty">
          <p>Nenhuma categoria ainda. Crie a primeira para começar a classificar os artigos.</p>
        </div>
      ) : (
        <ul className="admin-list">
          {categories.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>
                  {item.posts === 1 ? "1 artigo" : `${item.posts} artigos`}
                </p>
              </div>
              {item.posts === 0 ? (
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="admin-danger" type="submit">
                    Excluir
                  </button>
                </form>
              ) : (
                <span className="admin-hint">Em uso</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
