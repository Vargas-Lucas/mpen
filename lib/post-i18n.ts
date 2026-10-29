import type { Locale } from "@/lib/i18n";
import type { Post, PostTranslation, PostTranslations } from "@/lib/types";

const fields = ["title", "excerpt", "body", "cover_alt", "seo_title", "seo_description"] as const;

export function emptyTranslation(): PostTranslation {
  return { title: "", excerpt: "", body: "", cover_alt: "", seo_title: "", seo_description: "" };
}

export function readTranslations(value: unknown): PostTranslations {
  if (!value || typeof value !== "object") return {};
  const record = value as PostTranslations;
  return { en: record.en, es: record.es };
}

function translated(value: string | undefined, fallback: string) {
  const next = value?.trim();
  return next ? value!.trim() : fallback;
}

export function localizePost<T extends Post>(post: T, locale: Locale): T {
  if (locale === "pt") return post;
  const copy = readTranslations(post.translations)[locale];
  if (!copy) return post;
  return {
    ...post,
    title: translated(copy.title, post.title),
    excerpt: translated(copy.excerpt, post.excerpt),
    body: translated(copy.body, post.body),
    cover_alt: translated(copy.cover_alt, post.cover_alt),
    seo_title: translated(copy.seo_title, post.seo_title),
    seo_description: translated(copy.seo_description, post.seo_description),
  };
}

export function localizePosts<T extends Post>(posts: T[], locale: Locale) {
  return posts.map((post) => localizePost(post, locale));
}

export function translationFromForm(formData: FormData, locale: "en" | "es"): PostTranslation {
  const prefix = locale === "en" ? "en" : "es";
  const translation = emptyTranslation();
  for (const field of fields) {
    translation[field] = String(formData.get(`${field}_${prefix}`) || "").trim();
  }
  return translation;
}
