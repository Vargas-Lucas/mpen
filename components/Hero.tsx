"use client";

import Link from "next/link";
import { rememberReturn } from "@/components/BackButton";
import { useEffect, useState } from "react";
import { heroImage, logoImage } from "@/lib/images";
import { deliveryLabel } from "@/lib/format";
import type { Development } from "@/lib/types";

const SLIDE_MS = 980;

export function Hero({ slides }: { slides: Development[] }) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    if (leaving === null) return;
    const timer = window.setTimeout(() => setLeaving(null), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, index]);

  function goTo(next: number, dir: 1 | -1) {
    if (slides.length < 2 || next === index) return;
    setDirection(dir);
    setHasMoved(true);
    setLeaving(index);
    setIndex(next);
  }

  function go(step: number) {
    if (slides.length < 2) return;
    const dir: 1 | -1 = step > 0 ? 1 : -1;
    goTo((index + step + slides.length) % slides.length, dir);
  }

  return (
    <section
      className={[
        "hero",
        hasMoved ? "has-moved" : "",
        leaving !== null ? "is-moving" : "",
        direction < 0 ? "dir-prev" : "dir-next",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {slides.map((item, slideIndex) => {
        const image = heroImage(item.slug);
        const logo = logoImage(item.slug);
        const state =
          slideIndex === index ? "is-on" : slideIndex === leaving ? "is-leaving" : "";
        return (
          <div
            key={item.id}
            className={state ? `hero-slide ${state}` : "hero-slide"}
            aria-hidden={slideIndex !== index}
            inert={slideIndex !== index}
          >
            {image ? <img className="hero-photo" src={image} alt="" /> : null}
            <div className="hero-shade" />
            <div className="hero-copy">
              {logo && item.slug === "sunset-village" ? (
                <>
                  <h1 className="sr-only">{item.name}</h1>
                  <a className="hero-logo-link" href="https://sunsetvillage.com.br/">
                    <img className="hero-logo wide" src={logo} alt="Sunset Village" />
                  </a>
                  {item.summary ? (
                    <Link href={`/empreendimentos/${item.slug}`} onClick={rememberReturn}>
                      <p className="hero-summary">{item.summary}</p>
                    </Link>
                  ) : null}
                </>
              ) : (
                <Link href={`/empreendimentos/${item.slug}`} onClick={rememberReturn}>
                  {logo ? (
                    <>
                      <h1 className="sr-only">{item.name}</h1>
                      <img
                        className={
                          item.slug === "jai"
                            ? "hero-logo"
                            : item.slug === "carpe-diem"
                              ? "hero-logo mid"
                              : "hero-logo wide"
                        }
                        src={logo}
                        alt=""
                      />
                    </>
                  ) : (
                    <>
                      <h1>{item.name}</h1>
                      <p className="hero-kicker">{item.neighborhood}</p>
                      {item.delivery ? <p className="hero-meta">{deliveryLabel(item)}</p> : null}
                    </>
                  )}
                  {item.summary ? <p className="hero-summary">{item.summary}</p> : null}
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {slides.length > 1 ? (
        <>
          <button type="button" className="hero-arrow prev" aria-label="Empreendimento anterior" onClick={() => go(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M14.5 5.5 8 12l6.5 6.5" />
            </svg>
          </button>
          <button type="button" className="hero-arrow next" aria-label="Próximo empreendimento" onClick={() => go(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M9.5 5.5 16 12l-6.5 6.5" />
            </svg>
          </button>
        </>
      ) : null}

      {slides.length > 1 ? (
        <div className="hero-nav">
          {slides.map((item, dotIndex) => (
            <button
              key={item.id}
              type="button"
              className={dotIndex === index ? "dot on" : "dot"}
              aria-label={`Ir para ${item.name}`}
              aria-current={dotIndex === index ? "true" : undefined}
              onClick={() => goTo(dotIndex, dotIndex > index ? 1 : -1)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
