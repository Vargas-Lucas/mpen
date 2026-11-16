import { AdminHub } from "@/components/AdminHub";
import { LoginForm } from "@/components/LoginForm";
import { getEditorSession } from "@/lib/auth";

export default async function AdminPage() {
  const editor = await getEditorSession();

  if (!editor) {
    return (
      <section className="admin-card">
        <p className="admin-kicker">Acesso restrito</p>
        <h1>Painel</h1>
        <p>Entre com o e-mail autorizado para cuidar do site da MPEN.</p>
        <LoginForm />
      </section>
    );
  }

  return <AdminHub name={editor.name} />;
}
