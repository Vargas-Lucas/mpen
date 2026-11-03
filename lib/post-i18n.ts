import { blogPostCopy } from "@/lib/copy/blog-posts";
import type { Locale } from "@/lib/i18n";
import type { Post, PostTranslation, PostTranslations } from "@/lib/types";

const fields = ["title", "excerpt", "body", "cover_alt", "seo_title", "seo_description"] as const;

export function emptyTranslation(): PostTranslation {
  return { title: "", excerpt: "", body: "", cover_alt: "", seo_title: "", seo_description: "" };
}

export function readTranslations(value: unknown): PostTranslations {
  let raw = value;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return {};
    }
  }
  if (!raw || typeof raw !== "object") return {};
  const record = raw as PostTranslations;
  return { en: record.en, es: record.es };
}

function pick(saved: string | undefined, bundled: string | undefined, fallback: string) {
  const fromEditor = saved?.trim();
  if (fromEditor) return fromEditor;
  const fromBundle = bundled?.trim();
  if (fromBundle) return fromBundle;
  return fallback;
}

export function localizePost<T extends Post>(post: T, locale: Locale): T {
  if (locale === "pt") return post;
  const saved = readTranslations(post.translations)[locale];
  const bundled = blogPostCopy[post.slug]?.[locale];
  if (!saved && !bundled) return post;
  return {
    ...post,
    title: pick(saved?.title, bundled?.title, post.title),
    excerpt: pick(saved?.excerpt, bundled?.excerpt, post.excerpt),
    body: pick(saved?.body, bundled?.body, post.body),
    cover_alt: pick(saved?.cover_alt, bundled?.cover_alt, post.cover_alt),
    seo_title: pick(saved?.seo_title, bundled?.seo_title, post.seo_title),
    seo_description: pick(saved?.seo_description, bundled?.seo_description, post.seo_description),
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
