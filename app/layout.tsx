import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import { gaMeasurementId, googleSiteVerification } from "@/lib/analytics";
import { ui } from "@/lib/copy/ui";
import { htmlLang } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = SITE_URL;
const siteVerification = googleSiteVerification();

export async function generateMetadata(): Promise<Metadata> {
  const t = ui(await getLocale());
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t.home.h1,
      template: "%s — MPEN",
    },
    description: t.meta.description,
    openGraph: {
      title: t.home.h1,
      description: t.meta.description,
      type: "website",
      url: siteUrl,
      images: [{ url: "/images/sobre/capa.png", alt: t.meta.imageAlt }],
    },
    ...(siteVerification ? { verification: { google: siteVerification } } : {}),
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={htmlLang(locale)}>
      <body className={manrope.className}>
        <SiteShell gaId={gaMeasurementId()} locale={locale}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
