"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { contactChannels, type ContactChannel } from "@/lib/contacts";

function ChannelPanel({ channel }: { channel: ContactChannel }) {
  return (
    <div className="talk-panel">
      <div className="talk-panel-head">
        <h3>{channel.label}</h3>
        {channel.whatsapp ? (
          <a
            className="talk-whatsapp"
            href={`https://wa.me/${channel.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${channel.label}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.3-1.65a11.9 11.9 0 0 0 5.76 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.16-3.45-8.44zM12.07 21.8h-.01a9.86 9.86 0 0 1-5.02-1.38l-.36-.21-3.74.98 1-3.64-.23-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.13 1.03 7 2.9a9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.86-9.9 9.86zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
              />
            </svg>
          </a>
        ) : null}
      </div>
      <ContactForm source={`fale-${channel.id}`} fields={channel.details === "aftersales" ? "aftersales" : "contact"} />
      <p className="form-privacy">
        <Link href="/politica-de-privacidade">Política de privacidade</Link>
      </p>
    </div>
  );
}

function TalkReveal({ channel }: { channel: ContactChannel | null }) {
  const [shown, setShown] = useState(channel);

  if (channel && shown?.id !== channel.id) {
    setShown(channel);
  }

  function onTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "grid-template-rows") return;
    if (!channel) setShown(null);
  }

  return (
    <div className={channel ? "talk-reveal is-open" : "talk-reveal"} onTransitionEnd={onTransitionEnd}>
      <div className="talk-reveal-inner">{shown ? <ChannelPanel key={shown.id} channel={shown} /> : null}</div>
    </div>
  );
}

function Chooser({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const main = contactChannels.filter((channel) => channel.details !== "aftersales");
  const quiet = contactChannels.filter((channel) => channel.details === "aftersales");

  return (
    <div>
      <div className="talk-choices" role="list">
        {main.map((channel) => (
          <button
            key={channel.id}
            type="button"
            className={activeId === channel.id ? "talk-choice is-on" : "talk-choice"}
            aria-pressed={activeId === channel.id}
            onClick={() => onSelect(channel.id)}
          >
            {channel.label}
          </button>
        ))}
      </div>
      {quiet.map((channel) => (
        <button
          key={channel.id}
          type="button"
          className={activeId === channel.id ? "talk-quiet is-on" : "talk-quiet"}
          aria-pressed={activeId === channel.id}
          onClick={() => onSelect(channel.id)}
        >
          {channel.label}
        </button>
      ))}
    </div>
  );
}

export function TalkToUs({ mode = "button" }: { mode?: "button" | "page" }) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(mode === "page" ? "comercial" : null);
  const active = contactChannels.find((channel) => channel.id === activeId) ?? null;

  function toggle(id: string) {
    setActiveId((current) => (current === id ? null : id));
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const chooser = (
    <>
      <Chooser activeId={activeId} onSelect={toggle} />
      <TalkReveal channel={active} />
    </>
  );

  if (mode === "page") {
    return <div className="talk talk-page">{chooser}</div>;
  }

  return (
    <>
      <button
        type="button"
        className="talk-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        Fale conosco
      </button>
      {open && mounted
        ? createPortal(
            <div className="talk-overlay" onClick={() => setOpen(false)}>
              <div
                className="talk-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="talk-dialog-head">
                  <h2 id={titleId}>Fale conosco</h2>
                  <button type="button" className="talk-close" onClick={() => setOpen(false)} aria-label="Fechar">
                    ×
                  </button>
                </div>
                {chooser}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
