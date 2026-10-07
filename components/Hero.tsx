"use client";

import Link from "next/link";
import { useState } from "react";
import { heroImage, logoImage } from "@/lib/images";
import { deliveryLabel } from "@/lib/format";
import type { Development } from "@/lib/types";

export function Hero({ slides }: { slides: Development[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const image = slide ? heroImage(slide.slug) : "";
  const logo = slide ? logoImage(slide.slug) : "";

  function go(step: number) {
    if (slides.length < 2) return;
    setIndex((current) => (current + step + slides.length) % slides.length);
  }

  return (
    <section className="hero">
      {image ? <img className="hero-photo" src={image} alt="" /> : null}
      <div className="hero-shade" />

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

      <div className="hero-copy">
        {slide ? (
          <Link href={`/empreendimentos/${slide.slug}`}>
            {logo ? (
              <>
                <h1 className="sr-only">{slide.name}</h1>
                <img
                  className={
                    slide.slug === "jai"
                      ? "hero-logo"
                      : slide.slug === "carpe-diem"
                        ? "hero-logo mid"
                        : slide.slug === "island"
                          ? "hero-logo badge"
                          : "hero-logo wide"
                  }
                  src={logo}
                  alt=""
                />
              </>
            ) : (
              <>
                <h1>{slide.name}</h1>
                <p className="hero-kicker">{slide.neighborhood}</p>
                {slide.delivery ? <p className="hero-meta">{deliveryLabel(slide)}</p> : null}
              </>
            )}
            {slide.summary ? <p className="hero-summary">{slide.summary}</p> : null}
          </Link>
        ) : (
          <>
            <h1>MPEN</h1>
            <p className="hero-kicker">Florianópolis</p>
          </>
        )}
      </div>

      {slides.length > 1 ? (
        <div className="hero-nav">
          {slides.map((item, dotIndex) => (
            <button
              key={item.id}
              type="button"
              className={dotIndex === index ? "dot on" : "dot"}
              aria-label={`Ir para ${item.name}`}
              aria-current={dotIndex === index ? "true" : undefined}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
