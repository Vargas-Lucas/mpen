const memory = new Map<string, string>();

export async function translateFromPortuguese(text: string, target: "en" | "es") {
  const source = text.trim();
  if (!source) return "";
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
    if (!response.ok) return source;
    const data = (await response.json()) as Array<Array<[string] | null>>;
    const translated = (data[0] || [])
      .map((part) => (Array.isArray(part) ? part[0] : ""))
      .join("")
      .trim();
    if (!translated) return source;
    memory.set(key, translated);
    return translated;
  } catch {
    return source;
  }
}

export async function translateDescription(text: string, target: "en" | "es") {
  const parts = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  const translated = await Promise.all(parts.map((part) => translateFromPortuguese(part, target)));
  return translated.join("\n\n");
}
