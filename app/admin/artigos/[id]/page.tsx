import Link from "next/link";
import { notFound } from "next/navigation";
import { DeletePostButton } from "@/components/DeletePostButton";
import { PostForm } from "@/components/PostForm";
import { requireEditor } from "@/lib/auth";
import { getAdminPost } from "@/lib/data";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ salvo?: string }>;
}) {
  await requireEditor();
  const { id } = await params;
  const { salvo } = await searchParams;
  const post = await getAdminPost(Number(id));
  if (!post) notFound();

  return (
    <section className="admin-panel admin-editor">
      <p className="admin-kicker">{post.published_at ? "Publicado" : "Rascunho"}</p>
      <h1>Editar artigo</h1>
      <p>Altere o texto e escolha se ele continua no ar ou volta para rascunho.</p>
      {salvo ? (
        <p className="ok" role="status">
          Artigo salvo.
        </p>
      ) : null}
      <PostForm post={post} />
      <div className="admin-footer-row">
        <p className="admin-back">
          <Link href="/admin">Voltar aos artigos</Link>
          {post.published_at ? (
            <>
              {" · "}
              <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                Ver no site
              </a>
            </>
          ) : null}
        </p>
        <DeletePostButton id={post.id} title={post.title} />
      </div>
    </section>
  );
}
