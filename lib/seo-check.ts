export type SeoCheck = { ok: boolean; label: string };

function hasKeyword(value: string, keyword: string) {
  return keyword.length > 0 && value.toLowerCase().includes(keyword.toLowerCase());
}

export function articleSeoChecks(input: {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  keyword: string;
}): SeoCheck[] {
  const keyword = input.keyword.trim();
  const title = input.seoTitle.trim() || input.title.trim();
  const description = input.seoDescription.trim() || input.excerpt.trim();
  const text = `${input.title} ${input.excerpt} ${input.body}`;

  return [
    { ok: keyword.length > 1, label: "Palavra-chave principal preenchida" },
    { ok: hasKeyword(title, keyword), label: "Palavra-chave no título" },
    { ok: hasKeyword(input.slug, keyword), label: "Palavra-chave no endereço" },
    { ok: hasKeyword(description, keyword), label: "Palavra-chave na descrição" },
    { ok: hasKeyword(text, keyword), label: "Palavra-chave no texto" },
    { ok: title.length > 0 && title.length <= 60, label: "Título do Google até 60 caracteres" },
    {
      ok: description.length >= 50 && description.length <= 160,
      label: "Descrição do Google entre 50 e 160 caracteres",
    },
  ];
}
