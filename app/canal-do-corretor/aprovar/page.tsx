import Link from "next/link";
import { BrokerApproveForm } from "@/components/BrokerApproveForm";
import { PageHeader } from "@/components/PageHeader";
import { findBrokerApproval } from "@/lib/broker-auth";

export function generateMetadata() {
  return { title: "Aprovar cadastro", robots: { index: false, follow: false } };
}

function formatCpf(value: string) {
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatPhone(value: string) {
  if (value.length === 11) return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  if (value.length === 10) return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
  return value;
}

export default async function ApproveBrokerPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const approval = token ? await findBrokerApproval(token) : null;

  return (
    <>
      <PageHeader
        compact
        title="Aprovar cadastro"
        lede={
          approval
            ? "Confira os dados e libere o acesso ao Canal do corretor."
            : "Este link expirou ou já foi usado."
        }
      />
      <section className="broker-section">
        <div className="container broker-layout">
          <div className="broker-gate">
            {approval ? (
              <>
                <dl className="broker-review">
                  <div>
                    <dt>Nome</dt>
                    <dd>{approval.name}</dd>
                  </div>
                  <div>
                    <dt>CPF</dt>
                    <dd>{formatCpf(approval.cpf)}</dd>
                  </div>
                  <div>
                    <dt>CRECI</dt>
                    <dd>{approval.creci}</dd>
                  </div>
                  <div>
                    <dt>Imobiliária</dt>
                    <dd>{approval.agency}</dd>
                  </div>
                  <div>
                    <dt>Telefone</dt>
                    <dd>{formatPhone(approval.phone)}</dd>
                  </div>
                  <div>
                    <dt>E-mail</dt>
                    <dd>{approval.email}</dd>
                  </div>
                </dl>
                {approval.approved ? (
                  <p className="ok">Este cadastro já foi aprovado.</p>
                ) : (
                  <BrokerApproveForm token={token} />
                )}
              </>
            ) : (
              <Link className="broker-return" href="/canal-do-corretor">
                Voltar ao Canal do corretor
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
