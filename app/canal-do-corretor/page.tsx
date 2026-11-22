import { logoutBroker } from "@/actions/brokers";
import { BrokerGate } from "@/components/BrokerGate";
import { PageHeader } from "@/components/PageHeader";
import { getBrokerSession } from "@/lib/broker-auth";
import { canonical } from "@/lib/seo";

const FOLDERS = [
  {
    name: "Sunset Village",
    href: "https://drive.google.com/drive/folders/1BIcCAM1BXrfog5UPvH011csZAJIZb_ng?usp=drive_link",
  },
  {
    name: "Porto das Marés",
    href: "https://drive.google.com/drive/folders/1iIimWFMpcvzlK7oxmYRZKQWIWNzAGhz_",
  },
] as const;

export function generateMetadata() {
  return { title: "Canal do corretor", ...canonical("/canal-do-corretor") };
}

export default async function BrokerChannelPage() {
  const broker = await getBrokerSession();

  return (
    <>
      <PageHeader
        compact
        title="Canal do corretor"
        lede={broker ? `Olá, ${broker.name}. As pastas dos empreendimentos estão aqui.` : "Entre com seu cadastro ou crie um acesso para ver as pastas dos empreendimentos."}
      />
      <section className="broker-section">
        <div className="container broker-layout">
          {broker ? (
            <div className="broker-panel">
              <ul className="broker-folders">
                {FOLDERS.map((folder) => (
                  <li key={folder.href}>
                    <a href={folder.href} target="_blank" rel="noopener noreferrer">
                      <strong>{folder.name}</strong>
                      <span>Abrir pasta</span>
                    </a>
                  </li>
                ))}
              </ul>
              <form action={logoutBroker}>
                <button className="btn" type="submit">
                  Sair
                </button>
              </form>
            </div>
          ) : (
            <BrokerGate />
          )}
        </div>
      </section>
    </>
  );
}
