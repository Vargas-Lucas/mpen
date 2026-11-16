import { adminHub, type AdminToolIcon } from "@/lib/admin-hub";

const icons: Record<AdminToolIcon, React.ReactNode> = {
  blog: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3.5h7.2L19 8.2V20.5H7z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14.2 3.5V8.2H19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 12.5h5.5M10 16h5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  developments: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20.5h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 20.5V9.2L12 4.5l5.5 4.7v11.3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 20.5v-4.2h4V20.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
};

export function AdminHub({ name }: { name: string }) {
  return (
    <section className="admin-hub">
      <div className="admin-hub-intro">
        <p className="admin-kicker">Painel</p>
        <h1>Olá, {name}</h1>
        <p>Escolha o que vai cuidar agora. Novas ferramentas de controle entram aqui.</p>
      </div>
      {adminHub.map((section) => (
        <section key={section.title} className="admin-hub-section">
          <h2>{section.title}</h2>
          <p>{section.description}</p>
          <div className="admin-hub-grid">
            {section.tools.map((tool) => (
              <a key={tool.href} className="admin-hub-card" href={tool.href}>
                <span className="admin-hub-icon">{icons[tool.icon]}</span>
                <strong>{tool.title}</strong>
                <em>{tool.tag}</em>
                <span>{tool.description}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
