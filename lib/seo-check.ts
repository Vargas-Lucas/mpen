export type SeoCheck = { ok: boolean; label: string; help: string };

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
    {
      ok: keyword.length > 1,
      label: "Palavra-chave preenchida",
      help: "Escreva o tema principal em 1 ou 2 palavras, como Sul da Ilha ou Florianópolis.",
    },
    {
      ok: hasKeyword(title, keyword),
      label: "Aparece no título",
      help: "Inclua a palavra-chave no título do Google ou no título do artigo.",
    },
    {
      ok: hasKeyword(input.slug, keyword),
      label: "Aparece no endereço",
      help: "O endereço fica mais claro se tiver a palavra, sem acento: /blog/sul-da-ilha.",
    },
    {
      ok: hasKeyword(description, keyword),
      label: "Aparece na descrição",
      help: "Repita a palavra-chave na descrição do Google ou no resumo.",
    },
    {
      ok: hasKeyword(text, keyword),
      label: "Aparece no texto",
      help: "Use a palavra-chave de forma natural no corpo do artigo.",
    },
    {
      ok: title.length > 0 && title.length <= 60,
      label: "Título com até 60 caracteres",
      help: "Títulos longos o Google corta. Fique perto de 50 a 60 caracteres.",
    },
    {
      ok: description.length >= 50 && description.length <= 160,
      label: "Descrição entre 50 e 160 caracteres",
      help: "Esse tamanho costuma aparecer inteiro no resultado da busca.",
    },
  ];
}
