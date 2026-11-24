import { logoutBroker } from "@/actions/brokers";
import { BrokerGate } from "@/components/BrokerGate";
import { PageHeader } from "@/components/PageHeader";
import { getBrokerSession } from "@/lib/broker-auth";
import { ui } from "@/lib/copy/ui";
import { contactChannel } from "@/lib/contacts";
import { getDevelopments } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";
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

export async function generateMetadata() {
  const copy = ui(await getLocale());
  return { title: copy.nav.broker, ...canonical("/canal-do-corretor") };
}

export default async function BrokerChannelPage() {
  const copy = ui(await getLocale());
  const t = copy.partner;
  const broker = await getBrokerSession();
  const total = (await getDevelopments()).length;
  const comercial = contactChannel("comercial");

  return (
    <>
      <PageHeader compact className="copy-justified" title={copy.nav.broker} lede={t.lede} />

      <section className="partner-intro">
        <div className="container partner-layout">
          <div className="partner-copy">
            <p className="kicker">{t.kicker}</p>
            <h2>{t.h2}</h2>
            <p>{t.p1}</p>
            <p>{t.p2}</p>
            <p>{t.p3}</p>
            <ul className="partner-points">
              <li>
                <strong>
                  {total} {copy.listing.manyDev}
                </strong>
                <span>{t.portfolio}</span>
              </li>
              <li>
                <strong>{t.since}</strong>
                <span>{t.sinceText}</span>
              </li>
              <li>
                <strong>{t.direct}</strong>
                <span>{t.directText}</span>
              </li>
            </ul>
            {comercial ? (
              <p className="partner-alt">
                {t.prefer}{" "}
                <a href={`https://wa.me/${comercial.whatsapp}`} target="_blank" rel="noreferrer">
                  {t.whatsapp}
                </a>
              </p>
            ) : null}
          </div>

          <aside>
            {broker ? (
              <div className="broker-panel">
                <p className="broker-hello">Olá, {broker.name}. As pastas dos empreendimentos estão aqui.</p>
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
          </aside>
        </div>
      </section>
    </>
  );
}
