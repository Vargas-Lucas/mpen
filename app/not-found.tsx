import Link from "next/link";
import { ui } from "@/lib/copy/ui";
import { getLocale } from "@/lib/i18n-server";

export default async function NotFound() {
  const t = ui(await getLocale());
  return (
    <section className="section">
      <div className="container empty">
        <h1>{t.missing.title}</h1>
        <p>{t.missing.text}</p>
        <Link className="btn btn-solid" href="/">
          {t.missing.home}
        </Link>
      </div>
    </section>
  );
}
