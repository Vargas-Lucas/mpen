"use client";

import { useEffect, useId, useState } from "react";
import { contactChannel } from "@/lib/contacts";

const DEFAULT_TEXT = "Olá, vim pelo site da MPEN e gostaria de mais informações.";

const TOPICS = [
  {
    label: "Empreendimentos",
    text: "Olá, vim pelo site da MPEN e quero conhecer os empreendimentos no Sul da Ilha.",
  },
  {
    label: "Falar com comercial",
    text: "Olá, vim pelo site da MPEN e gostaria de falar com o comercial.",
  },
  {
    label: "Agendar visita",
    text: "Olá, vim pelo site da MPEN e gostaria de agendar uma visita.",
  },
] as const;

function whatsappUrl(phone: string, text: string) {
  const message = text.trim() || DEFAULT_TEXT;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const WA_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.3-1.65a11.9 11.9 0 0 0 5.76 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.16-3.45-8.44zM12.07 21.8h-.01a9.86 9.86 0 0 1-5.02-1.38l-.36-.21-3.74.98 1-3.64-.23-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.13 1.03 7 2.9a9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.86-9.9 9.86zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
    />
  </svg>
);

export function WhatsAppChat() {
  const titleId = useId();
  const cardId = `${titleId}-card`;
  const phone = contactChannel("comercial")?.whatsapp || "5548991050594";
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [topic, setTopic] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function chooseTopic(label: string, message: string) {
    setTopic(label);
    setText(message);
  }

  function send(message: string) {
    window.open(whatsappUrl(phone, message), "_blank", "noopener,noreferrer");
    setOpen(false);
    setText("");
    setTopic(null);
  }

  return (
    <div className="wa-dock">
      {open ? (
        <section id={cardId} className="wa-card" role="dialog" aria-modal="false" aria-labelledby={titleId}>
          <header className="wa-card-head">
            <span className="wa-avatar">
              <img src="/images/whatsapp-atendente.jpg" alt="Atendente da MPEN" width={48} height={48} />
              <span className="wa-online" aria-hidden="true" />
            </span>
            <div className="wa-card-id">
              <strong id={titleId}>Atendimento</strong>
              <span>Online</span>
            </div>
            <img className="wa-brand" src="/logo.png" alt="MPEN" />
          </header>

          <div className="wa-body">
            <p className="wa-from">MPEN</p>
            <p className="wa-bubble">Olá! Que bom ter você por aqui. Como posso ajudar?</p>
            <p className="wa-bubble">Escolha um assunto ou escreva abaixo. A conversa segue no WhatsApp.</p>
            <div className="wa-topics">
              {TOPICS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={topic === item.label ? "wa-topic is-on" : "wa-topic"}
                  aria-pressed={topic === item.label}
                  onClick={() => chooseTopic(item.label, item.text)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <form
            className="wa-compose"
            onSubmit={(event) => {
              event.preventDefault();
              send(text);
            }}
          >
            <label className="sr-only" htmlFor={`${titleId}-message`}>
              Mensagem para o WhatsApp
            </label>
            <input
              id={`${titleId}-message`}
              name="message"
              type="text"
              autoComplete="off"
              placeholder="Escreva sua mensagem"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setTopic(null);
              }}
            />
            <button type="submit" className="wa-send" aria-label="Enviar no WhatsApp">
              {WA_ICON}
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="float-contact"
        aria-label={open ? "Fechar WhatsApp" : "Abrir WhatsApp"}
        aria-expanded={open}
        aria-controls={open ? cardId : undefined}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <span className="wa-fab-close" aria-hidden="true">
            ×
          </span>
        ) : (
          WA_ICON
        )}
      </button>
    </div>
  );
}
