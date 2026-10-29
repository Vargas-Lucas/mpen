"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@/components/Analytics";
import { CookieBar } from "@/components/CookieBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppChat } from "@/components/WhatsAppChat";

export function SiteShell({ children, gaId = "" }: { children: React.ReactNode; gaId?: string }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <div className="admin-root">{children}</div>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppChat />
      <CookieBar />
      <Analytics measurementId={gaId} />
    </>
  );
}
