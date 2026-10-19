"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const minScale = 1;
const maxScale = 3;

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === "left" ? "M14.5 5.5 8 12l6.5 6.5" : "M9.5 5.5 16 12l-6.5 6.5"} />
    </svg>
  );
}

export function ProjectGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);
  const moved = useRef(false);
  const frame = useRef<HTMLDivElement>(null);
  const count = images.length;
  const current = images[index] ?? images[0];

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const go = useCallback(
    (next: number) => {
      if (count < 1) return;
      setIndex((next + count) % count);
      resetZoom();
    },
    [count, resetZoom],
  );

  const changeScale = useCallback(
    (next: number) => {
      const value = Math.min(maxScale, Math.max(minScale, Math.round(next * 100) / 100));
      setScale(value);
      if (value === 1) setOffset({ x: 0, y: 0 });
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key === "+" || event.key === "=") changeScale(scale + 0.5);
      if (event.key === "-" || event.key === "_") changeScale(scale - 0.5);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, scale, go, changeScale]);

  useEffect(() => {
    const node = frame.current;
    if (!open || !node) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      changeScale(scale + (event.deltaY < 0 ? 0.25 : -0.25));
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [open, scale, changeScale]);

  if (!current) return null;

  const caption = `${name}, foto ${index + 1} de ${count}`;

  const lightbox = (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Fotos de ${name}`}>
      <button className="lightbox-close" type="button" onClick={() => setOpen(false)}>
        Fechar
      </button>
      {count > 1 ? (
        <button className="lightbox-nav prev" type="button" onClick={() => go(index - 1)} aria-label="Foto anterior">
          <Chevron direction="left" />
        </button>
      ) : null}
      <div
        className={scale > 1 ? "lightbox-stage is-zoomed" : "lightbox-stage"}
        ref={frame}
        onPointerDown={(event) => {
          if (scale === 1 || event.button !== 0) return;
          drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) + Math.abs(dy) > 4) start.moved = true;
          setOffset({ x: start.ox + dx, y: start.oy + dy });
        }}
        onPointerUp={() => {
          moved.current = Boolean(drag.current?.moved);
          drag.current = null;
        }}
        onClick={() => {
          if (moved.current) {
            moved.current = false;
            return;
          }
          changeScale(scale === 1 ? 2 : 1);
        }}
      >
        <img
          src={current}
          alt={caption}
          draggable={false}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
        />
      </div>
      {count > 1 ? (
        <button className="lightbox-nav next" type="button" onClick={() => go(index + 1)} aria-label="Próxima foto">
          <Chevron direction="right" />
        </button>
      ) : null}
      <div className="lightbox-tools">
        <button type="button" onClick={() => changeScale(scale - 0.5)} disabled={scale <= minScale}>
          Diminuir
        </button>
        <span>
          {index + 1} / {count}
        </span>
        <button type="button" onClick={() => changeScale(scale + 0.5)} disabled={scale >= maxScale}>
          Aumentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="viewer">
      <div className="viewer-stage">
        <button
          className="viewer-open"
          type="button"
          onClick={() => {
            resetZoom();
            setOpen(true);
          }}
        >
          <img src={current} alt={caption} />
          <span>Ampliar</span>
        </button>
        {count > 1 ? (
          <>
            <button className="viewer-nav prev" type="button" onClick={() => go(index - 1)} aria-label="Foto anterior">
              <Chevron direction="left" />
            </button>
            <button className="viewer-nav next" type="button" onClick={() => go(index + 1)} aria-label="Próxima foto">
              <Chevron direction="right" />
            </button>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <>
          <p className="viewer-caption">
            <span>
              {index + 1} / {count}
            </span>
            Clique na foto para ampliar e dar zoom
          </p>
          <div className="viewer-thumbs">
            {images.map((src, photo) => (
              <button
                key={src}
                type="button"
                className={photo === index ? "is-active" : undefined}
                aria-label={`Foto ${photo + 1}`}
                aria-current={photo === index ? "true" : undefined}
                onClick={(event) => {
                  go(photo);
                  event.currentTarget.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
                }}
              >
                <img src={src} alt={`${name}, foto ${photo + 1} de ${count}`} />
              </button>
            ))}
          </div>
        </>
      ) : null}
      {open ? createPortal(lightbox, document.body) : null}
    </div>
  );
}
