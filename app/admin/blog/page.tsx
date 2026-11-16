import Link from "next/link";
import { DeletePostButton } from "@/components/DeletePostButton";
import { requireEditor } from "@/lib/auth";
import { getAdminPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function AdminBlogPage() {
  await requireEditor();
  const posts = await getAdminPosts();

  return (
    <section className="admin-panel">
      <p className="admin-back">
        <Link href="/admin">Painel</Link>
        {" · "}
        <Link href="/admin/categorias">Categorias</Link>
      </p>
      <div className="admin-head">
        <div>
          <p className="admin-kicker">Blog</p>
          <h1>Artigos</h1>
          <p>Crie, edite e publique os conteúdos do blog. Rascunhos ficam só no painel.</p>
        </div>
        <Link className="admin-submit admin-submit-inline" href="/admin/artigos/novo">
          Novo artigo
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="admin-empty">
          <p>Nenhum artigo ainda. O primeiro pode ser um rascunho — ele só entra no site quando você publicar.</p>
        </div>
      ) : (
        <ul className="admin-list">
          {posts.map((post) => (
            <li key={post.id}>
              <div>
                <strong>{post.title}</strong>
                <p>
                  {post.category}
                  {" · "}
                  {post.published_at ? `Publicado em ${formatDate(post.published_at)}` : "Rascunho"}
                </p>
              </div>
              <div className="admin-row-actions">
                {post.published_at ? (
                  <a className="admin-link" href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                    Ver
                  </a>
                ) : null}
                <Link className="admin-link" href={`/admin/artigos/${post.id}`}>
                  Editar
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
