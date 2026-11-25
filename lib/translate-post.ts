import { blogPostCopy } from "@/lib/copy/blog-posts";
import { query } from "@/lib/db";
import { readTranslations } from "@/lib/post-i18n";
import { translateText } from "@/lib/translate";
import type { Post, PostTranslation, PostTranslations } from "@/lib/types";

const locales = ["en", "es"] as const;
const fields = ["title", "excerpt", "body", "cover_alt", "seo_title", "seo_description"] as const;

type LocaleCode = (typeof locales)[number];
type Field = (typeof fields)[number];
type Slot = { kind: "bold" | "italic" | "link" | "url"; url?: string };

export type PortuguesePost = Record<Field, string>;

const inlinePattern = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(\s*<?([^)\s>]+)>?\)|(https?:\/\/[^\s<]+)/g;
const inflight = new Map<number, Promise<PostTranslations | null>>();

function emptyTranslation(): PostTranslation {
  return { title: "", excerpt: "", body: "", cover_alt: "", seo_title: "", seo_description: "" };
}

function hasCopy(item?: Partial<PostTranslation>) {
  return Boolean(item?.title?.trim() || item?.excerpt?.trim() || item?.body?.trim());
}

export function bundledPost(slug: string) {
  return Boolean(blogPostCopy[slug]);
}

async function translateChunk(text: string, target: LocaleCode) {
  if (!text.trim()) return text;
  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  const translated = await translateText(text, target);
  if (translated === null) return null;
  return `${leading}${translated}${trailing}`;
}

function maskInline(text: string) {
  const slots: Slot[] = [];
  let masked = "";
  let last = 0;
  const pattern = new RegExp(inlinePattern.source, "g");
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    masked += text.slice(last, match.index);
    const id = slots.length;
    if (match[1]) {
      slots.push({ kind: "bold" });
      masked += `{{${id}}}${match[1]}{{/${id}}}`;
    } else if (match[2]) {
      slots.push({ kind: "italic" });
      masked += `{{${id}}}${match[2]}{{/${id}}}`;
    } else if (match[3] && match[4]) {
      slots.push({ kind: "link", url: match[4] });
      masked += `{{${id}}}${match[3]}{{/${id}}}`;
    } else if (match[5]) {
      slots.push({ kind: "url", url: match[5] });
      masked += `{{${id}}}`;
    }
    last = match.index + match[0].length;
  }
  masked += text.slice(last);
  return { masked, slots };
}

function restoreInline(translated: string, slots: Slot[]) {
  let output = translated.replace(/\{\{\s*(\/?\d+)\s*\}\}/g, "{{$1}}");
  for (let id = 0; id < slots.length; id += 1) {
    const slot = slots[id];
    if (slot.kind === "url") {
      const token = `{{${id}}}`;
      if (!output.includes(token)) return null;
      output = output.replace(token, slot.url || "");
      continue;
    }
    const open = `{{${id}}}`;
    const close = `{{/${id}}}`;
    const start = output.indexOf(open);
    const end = output.indexOf(close);
    if (start < 0 || end < start) return null;
    const inner = output.slice(start + open.length, end);
    const wrapped =
      slot.kind === "bold" ? `**${inner}**` : slot.kind === "italic" ? `*${inner}*` : `[${inner}](${slot.url})`;
    output = `${output.slice(0, start)}${wrapped}${output.slice(end + close.length)}`;
  }
  if (/\{\{\/?\d+\}\}/.test(output)) return null;
  return output;
}

async function translatePieces(text: string, target: LocaleCode) {
  const parts: string[] = [];
  const pattern = new RegExp(inlinePattern.source, "g");
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    const plain = await translateChunk(text.slice(last, match.index), target);
    if (plain === null) return null;
    parts.push(plain);
    if (match[1]) {
      const inner = await translateChunk(match[1], target);
      if (inner === null) return null;
      parts.push(`**${inner.trim()}**`);
    } else if (match[2]) {
      const inner = await translateChunk(match[2], target);
      if (inner === null) return null;
      parts.push(`*${inner.trim()}*`);
    } else if (match[3] && match[4]) {
      const label = await translateInline(match[3], target);
      if (label === null) return null;
      parts.push(`[${label.trim()}](${match[4]})`);
    } else if (match[5]) {
      parts.push(match[5]);
    }
    last = match.index + match[0].length;
  }
  const tail = await translateChunk(text.slice(last), target);
  if (tail === null) return null;
  parts.push(tail);
  return parts.join("");
}

export async function translateInline(text: string, target: LocaleCode) {
  if (!text.trim()) return text;
  if (!text.includes("*") && !text.includes("[") && !/https?:\/\//.test(text)) return translateChunk(text, target);
  const masked = maskInline(text);
  const translated = await translateChunk(masked.masked, target);
  if (translated !== null) {
    const restored = restoreInline(translated, masked.slots);
    if (restored !== null) return restored;
  }
  return translatePieces(text, target);
}

export async function translateMarkdown(body: string, target: LocaleCode) {
  if (!body.trim()) return "";
  const parts = body.replace(/\r\n/g, "\n").split(/(\n{2,})/);
  const translated: string[] = [];
  for (const part of parts) {
    if (/^\n{2,}$/.test(part)) {
      translated.push(part);
      continue;
    }
    const lines = part.split("\n");
    const next: string[] = [];
    for (const line of lines) {
      const image = line.match(/^!\[([^\]]*)\]\(\s*([^)]+)\)$/);
      if (image) {
        const alt = await translateInline(image[1], target);
        if (alt === null) return null;
        next.push(`![${alt.trim()}](${image[2].trim()})`);
        continue;
      }
      const heading = line.match(/^(#{2,3})\s+(.+)$/);
      if (heading) {
        const text = await translateInline(heading[2], target);
        if (text === null) return null;
        next.push(`${heading[1]} ${text.trim()}`);
        continue;
      }
      const text = await translateInline(line, target);
      if (text === null) return null;
      next.push(text);
    }
    translated.push(next.join("\n"));
  }
  return translated.join("");
}

async function translateLocale(source: PortuguesePost, target: LocaleCode): Promise<PostTranslation | null> {
  const [title, excerpt, body, coverAlt, seoTitle, seoDescription] = await Promise.all([
    translateInline(source.title, target),
    translateInline(source.excerpt, target),
    translateMarkdown(source.body, target),
    translateInline(source.cover_alt, target),
    translateInline(source.seo_title, target),
    translateInline(source.seo_description, target),
  ]);
  if ([title, excerpt, body, coverAlt, seoTitle, seoDescription].some((item) => item === null)) return null;
  return {
    title: title?.trim() || "",
    excerpt: excerpt?.trim() || "",
    body: body || "",
    cover_alt: coverAlt?.trim() || "",
    seo_title: seoTitle?.trim() || "",
    seo_description: seoDescription?.trim() || "",
  };
}

function fieldNeedsAuto(manual: string, previous: string, sourceChanged: boolean) {
  if (manual && manual !== previous) return false;
  return !manual || sourceChanged;
}

function chooseField(manual: string, previous: string, sourceChanged: boolean, auto: string | undefined) {
  if (manual && manual !== previous) return manual;
  if (!manual || sourceChanged) return auto ?? previous;
  return previous || manual;
}

export async function buildStoredTranslations(options: {
  slug: string;
  source: PortuguesePost;
  submitted: PostTranslations;
  previous?: PostTranslations;
  previousSource?: PortuguesePost | null;
}) {
  if (bundledPost(options.slug)) {
    return {
      en: { ...emptyTranslation(), ...options.submitted.en },
      es: { ...emptyTranslation(), ...options.submitted.es },
    };
  }

  const needed = locales.filter((locale) =>
    fields.some((field) => {
      const sourceChanged = !options.previousSource || options.previousSource[field].trim() !== options.source[field].trim();
      return fieldNeedsAuto(
        options.submitted[locale]?.[field]?.trim() || "",
        options.previous?.[locale]?.[field]?.trim() || "",
        sourceChanged,
      );
    }),
  );
  const generated = new Map<LocaleCode, PostTranslation | null>();
  await Promise.all(
    needed.map(async (locale) => {
      generated.set(locale, await translateLocale(options.source, locale));
    }),
  );
  const translations: PostTranslations = {};
  for (const locale of locales) {
    const auto = generated.get(locale);
    const submitted = options.submitted[locale];
    const previous = options.previous?.[locale];
    const next = emptyTranslation();
    for (const field of fields) {
      const sourceChanged = !options.previousSource || options.previousSource[field].trim() !== options.source[field].trim();
      next[field] = chooseField(
        submitted?.[field]?.trim() || "",
        previous?.[field]?.trim() || "",
        sourceChanged,
        auto?.[field],
      );
    }
    translations[locale] = next;
  }
  return translations;
}

function needsLocale(item?: Partial<PostTranslation>) {
  return !hasCopy(item);
}

async function storeMissingTranslations(row: Post): Promise<PostTranslations | null> {
  const source: PortuguesePost = {
    title: row.title || "",
    excerpt: row.excerpt || "",
    body: row.body || "",
    cover_alt: row.cover_alt || "",
    seo_title: row.seo_title || "",
    seo_description: row.seo_description || "",
  };
  const saved = readTranslations(row.translations);
  const next: PostTranslations = { ...saved };
  let changed = false;
  await Promise.all(
    locales.map(async (locale) => {
      if (!needsLocale(saved[locale])) return;
      const auto = await translateLocale(source, locale);
      if (!auto || !hasCopy(auto)) return;
      next[locale] = auto;
      changed = true;
    }),
  );
  if (!changed) return null;
  await query(`UPDATE posts SET translations = $1::jsonb WHERE id = $2`, [JSON.stringify(next), row.id]);
  return next;
}

export async function ensureStoredTranslations<T extends Post>(rows: T[]) {
  const pending = rows.filter((row) => row.slug && !bundledPost(row.slug) && locales.some((locale) => needsLocale(readTranslations(row.translations)[locale])));
  await Promise.all(
    pending.map(async (row) => {
      const id = Number(row.id);
      let task = inflight.get(id);
      if (!task) {
        task = storeMissingTranslations(row)
          .catch(() => null)
          .finally(() => inflight.delete(id));
        inflight.set(id, task);
      }
      const next = await task;
      if (next) row.translations = next;
    }),
  );
  return rows;
}
