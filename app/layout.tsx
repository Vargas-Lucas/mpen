import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import { gaMeasurementId, googleSiteVerification } from "@/lib/analytics";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = SITE_URL;
const siteTitle = "MPEN | Construtora e Incorporadora no Sul da Ilha de Florianópolis";
const siteDescription =
  "Há mais de 20 anos, a MPEN é a construtora no Sul da Ilha de Florianópolis. Incorporação residencial com sofisticação e arquitetura.";

const siteVerification = googleSiteVerification();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s — MPEN",
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/images/sobre/capa.png",
        alt: "Construtora MPEN no Sul da Ilha de Florianópolis",
      },
    ],
  },
  ...(siteVerification ? { verification: { google: siteVerification } } : {}),
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={manrope.className}>
        <SiteShell gaId={gaMeasurementId()}>{children}</SiteShell>
      </body>
    </html>
  );
}
