import Link from "next/link";
import { notFound } from "next/navigation";
import { DeletePostButton } from "@/components/DeletePostButton";
import { PostForm } from "@/components/PostForm";
import { requireEditor } from "@/lib/auth";
import { getAdminPost, getCategories } from "@/lib/data";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ salvo?: string; publicado?: string; rascunho?: string }>;
}) {
  await requireEditor();
  const { id } = await params;
  const { salvo, publicado, rascunho } = await searchParams;
  let post: Awaited<ReturnType<typeof getAdminPost>> = null;
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    [post, categories] = await Promise.all([getAdminPost(Number(id)), getCategories()]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível ler o artigo.";
    return (
      <section className="admin-panel">
        <h1>Não foi possível abrir o artigo</h1>
        <p>{message}</p>
        <p className="admin-back">
          <Link href="/admin">Voltar aos artigos</Link>
        </p>
      </section>
    );
  }
  if (!post) notFound();
  const saved = Boolean(salvo || publicado || rascunho);
  const status = publicado
    ? "Artigo publicado. Ele já aparece no blog."
    : rascunho
      ? "Rascunho salvo. Só aparece no painel."
      : salvo
        ? "Artigo salvo."
        : "";

  return (
    <section className="admin-panel admin-editor">
      <p className="admin-kicker">{post.published_at ? "Publicado" : "Rascunho"}</p>
      <h1>Editar artigo</h1>
      <p>Altere o texto e escolha se ele continua no ar ou volta para rascunho.</p>
      {status ? (
        <p className="ok" role="status">
          {status}
        </p>
      ) : null}
      <PostForm post={post} categories={categories} saved={saved} />
      <div className="admin-footer-row">
        <p className="admin-back">
          <Link href="/admin">Voltar aos artigos</Link>
          <>
            {" · "}
            <a href={`/blog/${post.slug}${post.published_at ? "" : "?preview=1"}`} target="_blank" rel="noreferrer">
              {post.published_at ? "Ver no site" : "Ver como"}
            </a>
          </>
        </p>
        <DeletePostButton id={post.id} title={post.title} />
      </div>
    </section>
  );
}
