const memory = new Map<string, string>();
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

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

  const translated = (await googleTranslate(source, target)) || (await memoryTranslate(source, target));
  if (!translated) return null;
  memory.set(key, translated);
  return translated;
}

async function readJson(url: string): Promise<unknown | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json", "User-Agent": userAgent },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function accepted(source: string, translated: string) {
  const text = decodeEntities(translated).trim();
  if (!text || /MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(text)) return "";
  if (text.length > 20 && text.toLowerCase() === source.trim().toLowerCase()) return "";
  return text;
}

function decodeEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function textFromGtx(data: unknown) {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return "";
  return data[0]
    .map((part) => (Array.isArray(part) && typeof part[0] === "string" ? part[0] : ""))
    .join("");
}

function textFromClients(data: unknown): string {
  if (typeof data === "string") return data;
  if (!Array.isArray(data)) return "";
  return data
    .map((part) => {
      if (typeof part === "string") return part;
      if (Array.isArray(part) && typeof part[0] === "string") return part[0];
      return "";
    })
    .join("");
}

async function googleTranslate(source: string, target: "en" | "es") {
  const gtx = new URL("https://translate.googleapis.com/translate_a/single");
  gtx.searchParams.set("client", "gtx");
  gtx.searchParams.set("sl", "pt");
  gtx.searchParams.set("tl", target);
  gtx.searchParams.set("dt", "t");
  gtx.searchParams.set("q", source);
  const fromGtx = accepted(source, textFromGtx(await readJson(gtx.toString())));
  if (fromGtx) return fromGtx;

  const clients = new URL("https://clients5.google.com/translate_a/t");
  clients.searchParams.set("client", "dict-chrome-ex");
  clients.searchParams.set("sl", "pt");
  clients.searchParams.set("tl", target);
  clients.searchParams.set("q", source);
  return accepted(source, textFromClients(await readJson(clients.toString())));
}

async function memoryTranslate(source: string, target: "en" | "es") {
  const pieces = splitLongText(source, 400);
  const translated: string[] = [];
  for (const piece of pieces) {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", piece);
    url.searchParams.set("langpair", `pt|${target}`);
    url.searchParams.set("de", "contato@mpen.com.br");
    const data = (await readJson(url.toString())) as { responseData?: { translatedText?: unknown } } | null;
    const text = accepted(piece, typeof data?.responseData?.translatedText === "string" ? data.responseData.translatedText : "");
    if (!text) return null;
    translated.push(text);
  }
  return translated.join(" ");
}

function splitLongText(value: string, limit = 1800) {
  const pieces: string[] = [];
  let rest = value;
  while (rest.length > limit) {
    const window = rest.slice(0, limit);
    const breakAt = Math.max(window.lastIndexOf(". "), window.lastIndexOf(" "));
    const cut = breakAt > Math.min(200, limit / 2) ? breakAt + 1 : limit;
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
