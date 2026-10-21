import { logoutEditor } from "@/actions/auth";
import { getEditorSession } from "@/lib/auth";

export const metadata = {
  title: "Painel do blog",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const editor = await getEditorSession();

  return (
    <div className="admin">
      <header className="admin-bar">
        <a className="admin-brand" href="/admin">
          MPEN · Blog
        </a>
        {editor ? (
          <form action={logoutEditor}>
            <span>{editor.email}</span>
            <button className="admin-quiet" type="submit">
              Sair
            </button>
          </form>
        ) : null}
      </header>
      {children}
    </div>
  );
}
