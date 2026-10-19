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

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
