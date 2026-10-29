"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@/components/Analytics";
import { CookieBar } from "@/components/CookieBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { I18nProvider } from "@/components/I18nProvider";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import type { Locale } from "@/lib/i18n";

export function SiteShell({
  children,
  gaId = "",
  locale,
}: {
  children: React.ReactNode;
  gaId?: string;
  locale: Locale;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return (
      <I18nProvider locale={locale}>
        <div className="admin-root">{children}</div>
      </I18nProvider>
    );
  }

  return (
    <I18nProvider locale={locale}>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppChat />
      <CookieBar />
      <Analytics measurementId={gaId} />
    </I18nProvider>
  );
}
