import { projectStory, projectStoryDraft } from "@/lib/copy/stories";
import { coverImage, galleryImages } from "@/lib/images";
import { translateDescription } from "@/lib/translate";
import type { Locale } from "@/lib/i18n";
import type { Development, DevelopmentStory } from "@/lib/types";

export const SUNSET_WEBSITE = "https://sunsetvillage.com.br/";

const emptyLocale = { title: "", body: "" };

export function emptyStory(): DevelopmentStory {
  return { note: false, pt: { ...emptyLocale }, en: { ...emptyLocale }, es: { ...emptyLocale } };
}

function portugueseDescription(item: Pick<Development, "story">) {
  const saved = item.story?.pt;
  if (!saved) return "";
  return [saved.title, saved.body]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}

function descriptionBlocks(text: string) {
  const parts = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length > 1 && parts[0].length <= 140) {
    return { title: parts[0], paragraphs: parts.slice(1) };
  }
  return { title: "", paragraphs: parts };
}

export async function localizeStory(item: Pick<Development, "slug" | "name" | "story">, locale: Locale) {
  const source = portugueseDescription(item);
  if (!source) return projectStory(item.slug, locale);
  const text = locale === "pt" ? source : await translateDescription(source, locale);
  return { ...descriptionBlocks(text), note: Boolean(item.story?.note) };
}

export function resolveWebsite(item: Pick<Development, "slug" | "website">) {
  const site = item.website?.trim();
  if (site) return site;
  if (item.slug === "sunset-village") return SUNSET_WEBSITE;
  return "";
}

export type DevelopmentFormValues = {
  id: number;
  name: string;
  slug: string;
  status: Development["status"];
  neighborhood: string;
  city: string;
  typology: string;
  area: string;
  summary: string;
  delivery: string;
  featured: boolean;
  website: string;
  cover: string;
  gallery: string[];
  story: DevelopmentStory;
};

export function developmentFormValues(item: Development | null): DevelopmentFormValues {
  if (!item) {
    return {
      id: 0,
      name: "",
      slug: "",
      status: "lancamento",
      neighborhood: "Sul da Ilha",
      city: "Florianópolis",
      typology: "",
      area: "",
      summary: "",
      delivery: "",
      featured: false,
      website: "",
      cover: "",
      gallery: [],
      story: emptyStory(),
    };
  }

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    status: item.status,
    neighborhood: item.neighborhood,
    city: item.city,
    typology: item.typology,
    area: item.area,
    summary: item.summary,
    delivery: item.delivery,
    featured: item.featured,
    website: item.website.trim() || (item.slug === "sunset-village" ? SUNSET_WEBSITE : ""),
    cover: item.cover ?? coverImage(item.slug),
    gallery: item.gallery ?? galleryImages(item.slug),
    story: item.story ?? projectStoryDraft(item.slug) ?? emptyStory(),
  };
}
