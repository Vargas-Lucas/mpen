import { TalkToUs } from "@/components/TalkToUs";
import { PageHeader } from "@/components/PageHeader";
import { ui } from "@/lib/copy/ui";
import { getLocale } from "@/lib/i18n-server";
import { canonical } from "@/lib/seo";

export async function generateMetadata() {
  return { title: ui(await getLocale()).contact.title, ...canonical("/contato") };
}

export default async function ContactPage() {
  const t = ui(await getLocale());
  return (
    <>
      <PageHeader className="copy-justified" title={t.contact.title} lede={t.contact.lede} compact />
      <section className="section talk-section">
        <div className="container">
          <TalkToUs mode="page" />
        </div>
      </section>
    </>
  );
}
