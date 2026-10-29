import { intlLocale, type Locale } from "@/lib/i18n";
import { ui } from "@/lib/copy/ui";
import type { Development } from "@/lib/types";

export function developmentAlt(item: Pick<Development, "name" | "neighborhood">, locale: Locale = "pt") {
  const place = item.neighborhood.split(" - ").pop()?.trim() || item.neighborhood;
  const link = ui(locale).status.inPlace;
  return `${item.name} ${link} ${place} - MPEN`;
}

export function statusLabel(status: string, locale: Locale = "pt") {
  const labels = ui(locale).status;
  if (status === "lancamento") return labels.launch;
  if (status === "construcao") return labels.building;
  if (status === "entregue") return labels.delivered;
  return status;
}

export function deliveryLabel(item: Pick<Development, "status" | "delivery">, locale: Locale = "pt") {
  if (!item.delivery) return "";
  const labels = ui(locale).status;
  if (item.status === "entregue") return `${labels.deliveredIn} ${item.delivery}`;
  if (item.delivery === "2029") return `${labels.buildingDelivery} ${item.delivery}`;
  return `${labels.deliveryIn} ${item.delivery}`;
}

export function placeLabel(neighborhood: string, locale: Locale = "pt") {
  const labels = ui(locale).status;
  if (neighborhood.startsWith("Loteamento")) {
    const rest = neighborhood.slice("Loteamento".length).trim();
    return `${labels.subdivision} ${rest}`;
  }
  return `${labels.neighborhood} ${neighborhood}`;
}

export function formatDate(value: string | Date, locale: Locale = "pt") {
  return new Intl.DateTimeFormat(intlLocale(locale), {
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

export function toDatetimeLocal(value: string | Date | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const year = read("year");
  const month = read("month");
  const day = read("day");
  const hour = read("hour");
  const minute = read("minute");
  if (!year || !month || !day || !hour || !minute) return "";
  return `${year}-${month}-${day}T${hour}:${minute}`;
}
