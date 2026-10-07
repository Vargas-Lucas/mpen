import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Termos de uso" };

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Termos de uso" />
      <section className="section">
        <div className="container prose" style={{ maxWidth: 760 }}>
          <p>O texto oficial dos termos de uso da MPEN entra nesta página.</p>
        </div>
      </section>
    </>
  );
}
