export const LOCALES = ["pt", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_COOKIE = "mpen_lang";

export type Trio = { pt: string; en: string; es: string };

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "pt" || value === "en" || value === "es";
}

export function s(pt: string, en: string, es: string): Trio {
  return { pt, en, es };
}

export function htmlLang(locale: Locale) {
  if (locale === "pt") return "pt-BR";
  if (locale === "es") return "es";
  return "en";
}

export function intlLocale(locale: Locale) {
  if (locale === "pt") return "pt-BR";
  if (locale === "es") return "es-419";
  return "en";
}

type Resolved<T> = T extends Trio
  ? string
  : T extends readonly (infer U)[]
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

function isTrio(value: unknown): value is Trio {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  return keys.length === 3 && keys.every((key) => key === "pt" || key === "en" || key === "es") && typeof record.pt === "string";
}

export function resolve<T>(locale: Locale, value: T): Resolved<T> {
  if (isTrio(value)) return value[locale] as Resolved<T>;
  if (Array.isArray(value)) return value.map((item) => resolve(locale, item)) as Resolved<T>;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) out[key] = resolve(locale, item);
    return out as Resolved<T>;
  }
  return value as Resolved<T>;
}
