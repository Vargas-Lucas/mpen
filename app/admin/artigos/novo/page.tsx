import Link from "next/link";
import { PostForm } from "@/components/PostForm";
import { requireEditor } from "@/lib/auth";

export default async function NewPostPage() {
  await requireEditor();

  return (
    <section className="admin-panel admin-editor">
      <p className="admin-kicker">Novo artigo</p>
      <h1>Escrever</h1>
      <p>Salve como rascunho para revisar, ou publique para aparecer no blog.</p>
      <PostForm />
      <p className="admin-back">
        <Link href="/admin">Voltar aos artigos</Link>
      </p>
    </section>
  );
}
