import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Compliance" };

export default function CompliancePage() {
  return (
    <>
      <PageHeader title="Compliance" lede="Canal institucional da MPEN." />
      <section className="section">
        <div className="container prose" style={{ maxWidth: 760 }}>
          <p>O texto do programa de compliance da MPEN entra nesta página.</p>
        </div>
      </section>
    </>
  );
}
