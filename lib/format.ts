import type { Development } from "@/lib/types";

export function developmentAlt(item: Pick<Development, "name" | "neighborhood">) {
  const place = item.neighborhood.split(" - ").pop()?.trim() || item.neighborhood;
  return `${item.name} no ${place} - MPEN`;
}

export function statusLabel(status: string) {
  if (status === "lancamento") return "Lançamento";
  if (status === "construcao") return "Em construção";
  if (status === "entregue") return "Entregue";
  return status;
}

export function deliveryLabel(item: Pick<Development, "status" | "delivery">) {
  if (!item.delivery) return "";
  if (item.status === "entregue") return `Entregue em ${item.delivery}`;
  if (item.delivery === "2029") return `Em construção - entrega em ${item.delivery}`;
  return `Entrega em ${item.delivery}`;
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value instanceof Date ? value : new Date(value));
}

export function dateTimeAttr(value: string | Date | null | undefined) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function readingMinutes(body: string) {
  const words = body
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .replace(/[#*_>`]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(value))
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
