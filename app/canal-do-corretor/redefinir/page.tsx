import Link from "next/link";
import { BrokerResetForm } from "@/components/BrokerResetForm";
import { PageHeader } from "@/components/PageHeader";
import { findActiveBrokerReset } from "@/lib/broker-auth";

export function generateMetadata() {
  return { title: "Nova senha", robots: { index: false, follow: false } };
}

export default async function ResetBrokerPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const reset = token ? await findActiveBrokerReset(token) : null;

  return (
    <>
      <PageHeader
        compact
        title="Nova senha"
        lede={
          reset
            ? "Crie uma nova senha para entrar no Canal do corretor."
            : "Este link expirou ou já foi usado. Peça um novo em Esqueceu a senha."
        }
      />
      <section className="broker-section">
        <div className="container broker-layout">
          <div className="broker-gate">
            {reset ? (
              <BrokerResetForm token={token} />
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
