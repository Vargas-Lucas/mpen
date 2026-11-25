const memory = new Map<string, string>();

export async function translateText(text: string, target: "en" | "es"): Promise<string | null> {
  const source = text.trim();
  if (!source) return "";
  if (source.length > 1800) {
    const pieces = splitLongText(source);
    const translated: string[] = [];
    for (const piece of pieces) {
      const part = await translateText(piece, target);
      if (part === null) return null;
      translated.push(part);
    }
    return translated.join(" ");
  }

  const key = `${target}\n${source}`;
  const cached = memory.get(key);
  if (cached) return cached;

  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "pt");
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", source);

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const data = (await response.json()) as Array<Array<[string] | null>>;
    const translated = (data[0] || [])
      .map((part) => (Array.isArray(part) ? part[0] : ""))
      .join("")
      .trim();
    if (!translated) return null;
    memory.set(key, translated);
    return translated;
  } catch {
    return null;
  }
}

function splitLongText(value: string) {
  const pieces: string[] = [];
  let rest = value;
  while (rest.length > 1800) {
    const window = rest.slice(0, 1800);
    const breakAt = Math.max(window.lastIndexOf(". "), window.lastIndexOf(" "));
    const cut = breakAt > 200 ? breakAt + 1 : 1800;
    pieces.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) pieces.push(rest);
  return pieces;
}

export async function translateFromPortuguese(text: string, target: "en" | "es") {
  const translated = await translateText(text, target);
  if (translated === null) return text.trim();
  return translated;
}

export async function translateDescription(text: string, target: "en" | "es") {
  const parts = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  const translated = await Promise.all(parts.map((part) => translateFromPortuguese(part, target)));
  return translated.join("\n\n");
}
