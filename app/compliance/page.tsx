import { statSync } from "node:fs";
import path from "node:path";
import { PageHeader } from "@/components/PageHeader";
import { ui } from "@/lib/copy/ui";
import { getLocale } from "@/lib/i18n-server";

function fileSize(href: string) {
  const bytes = statSync(path.join(process.cwd(), "public", href)).size;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3.5h7.1L19 8.3V20.5H7Z" />
      <path d="M14 3.8V8.5h4.6" />
      <path d="M9.6 12.4h5.2M9.6 16h5.2" />
    </svg>
  );
}

export async function generateMetadata() {
  return { title: ui(await getLocale()).compliance.title };
}

export default async function CompliancePage() {
  const t = ui(await getLocale()).compliance;
  const documents = [
    {
      title: t.privacyTitle,
      kicker: t.privacyKicker,
      text: t.privacyText,
      href: "/docs/regulamento-de-privacidade.pdf",
      filename: "Regulamento de privacidade MPEN.pdf",
    },
    {
      title: t.ethicsTitle,
      kicker: t.ethicsKicker,
      text: t.ethicsText,
      href: "/docs/codigo-de-etica-e-conduta.pdf",
      filename: "Codigo de etica e conduta MPEN.pdf",
    },
  ];

  return (
    <>
      <PageHeader compact title={t.title} lede={t.lede} />
      <section className="docs-section">
        <div className="container">
          <ul className="docs-grid">
            {documents.map((doc) => (
              <li key={doc.href} className="doc-card">
                <span className="doc-icon">
                  <DocIcon />
                </span>
                <div>
                  <p className="kicker">{doc.kicker}</p>
                  <h2>{doc.title}</h2>
                  <p>{doc.text}</p>
                </div>
                <p className="doc-meta">PDF · {fileSize(doc.href)}</p>
                <div className="doc-actions">
                  <a className="doc-open" href={doc.href} target="_blank" rel="noreferrer">
                    {t.open}
                    <span className="sr-only"> {doc.title}</span>
                  </a>
                  <a className="doc-save" href={doc.href} download={doc.filename}>
                    {t.download}
                    <span className="sr-only"> {doc.title}</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
