export function slugify(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "artigo";
}

export const POST_CATEGORIES = ["MPEN", "Empreendimentos", "Sul da Ilha", "Institucional", "Novidades"] as const;
