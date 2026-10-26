export type SeoCheck = { ok: boolean; label: string; help: string };

function folded(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function hasKeyword(value: string, keyword: string) {
  const needle = folded(keyword);
  return needle.length > 0 && folded(value).includes(needle);
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
  const googleTitle = input.seoTitle.trim() || (input.title.trim() ? `${input.title.trim()} — MPEN` : "");
  const googleDescription = input.seoDescription.trim() || input.excerpt.trim();
  const text = `${input.title} ${input.excerpt} ${input.body}`;

  return [
    {
      ok: keyword.length > 1,
      label: "Palavra-chave preenchida",
      help: "Escreva o tema principal em 1 ou 2 palavras, como Sul da Ilha ou Florianópolis.",
    },
    {
      ok: hasKeyword(googleTitle, keyword),
      label: "Aparece no título",
      help: "Inclua a palavra-chave no título azul da prévia.",
    },
    {
      ok: hasKeyword(input.slug, keyword),
      label: "Aparece no endereço",
      help: "Conta hífen e acento: Santa Catarina e /blog/santa-catarina são a mesma coisa.",
    },
    {
      ok: hasKeyword(googleDescription, keyword),
      label: "Aparece na descrição",
      help: "Repita a palavra-chave no texto cinza da prévia.",
    },
    {
      ok: hasKeyword(text, keyword),
      label: "Aparece no texto",
      help: "Use a palavra-chave de forma natural no corpo do artigo.",
    },
    {
      ok: googleTitle.length > 0 && googleTitle.length <= 60,
      label: "Título com até 60 caracteres",
      help: "Encurte o título azul da prévia. O título do artigo, em cima, pode ficar longo.",
    },
    {
      ok: googleDescription.length >= 50 && googleDescription.length <= 160,
      label: "Descrição entre 50 e 160 caracteres",
      help: "Ajuste o texto cinza da prévia para 50 a 160 caracteres.",
    },
  ];
}
