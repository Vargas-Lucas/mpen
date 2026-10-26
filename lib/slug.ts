export function slugify(value: string, max = 120) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) return "artigo";
  if (slug.length <= max) return slug;
  const cut = slug.slice(0, max);
  const atHyphen = cut.lastIndexOf("-");
  return (atHyphen > 40 ? cut.slice(0, atHyphen) : cut).replace(/-+$/g, "") || "artigo";
}

export const DEFAULT_CATEGORIES = ["MPEN", "Empreendimentos", "Sul da Ilha", "Institucional", "Novidades"] as const;
