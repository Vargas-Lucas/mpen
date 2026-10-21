import type { Metadata } from "next";
import type { Post } from "@/lib/types";

export const SITE_URL = "https://teste.mpen.com.br";
export const SITE_NAME = "MPEN Incorporadora";

const TITLE_FALLBACK = "MPEN";
const DEFAULT_IMAGE = "/images/sobre/capa.png";

export function articleSeo(
  post: Pick<Post, "title" | "slug" | "excerpt" | "cover" | "cover_alt" | "seo_title" | "seo_description">,
) {
  const title = post.seo_title.trim() || (post.title.trim() ? `${post.title.trim()} — MPEN` : TITLE_FALLBACK);
  const description =
    post.seo_description.trim() ||
    post.excerpt.trim() ||
    `${post.title} no blog da MPEN Incorporadora.`;
  const path = `/blog/${post.slug}`;
  const image = post.cover.startsWith("/images/") ? post.cover : DEFAULT_IMAGE;
  const imageAlt = post.cover_alt?.trim() || post.title;
  return { title, description, path, image, imageAlt };
}

function isoDate(value: string | Date | null) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function articleMetadata(post: Post): Metadata {
  const seo = articleSeo(post);
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: seo.path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "article",
      url: seo.path,
      publishedTime: isoDate(post.published_at),
      locale: "pt_BR",
      siteName: SITE_NAME,
      images: [{ url: seo.image, alt: seo.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
}

export function articleJsonLd(post: Post) {
  const seo = articleSeo(post);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: seo.title,
    description: seo.description,
    image: `${SITE_URL}${seo.image}`,
    datePublished: isoDate(post.published_at),
    mainEntityOfPage: `${SITE_URL}${seo.path}`,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };
}
