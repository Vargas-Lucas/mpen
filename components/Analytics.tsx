"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const CONSENT = "mpen-cookies";

export function Analytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!measurementId) return;
    const enable = () => setAllowed(true);
    if (window.localStorage.getItem(CONSENT) === "1") enable();
    window.addEventListener("mpen-cookies-accepted", enable);
    return () => window.removeEventListener("mpen-cookies-accepted", enable);
  }, [measurementId]);

  useEffect(() => {
    if (!allowed || !measurementId || !window.gtag) return;
    window.gtag("event", "page_view", { page_path: pathname });
  }, [allowed, measurementId, pathname]);

  if (!measurementId || !allowed) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false, anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
