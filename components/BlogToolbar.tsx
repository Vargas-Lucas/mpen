"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import { categoryLabel } from "@/lib/copy/ui";
import type { Category } from "@/lib/types";

function blogHref(q: string, category = "") {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("categoria", category);
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function BlogToolbar({
  q,
  category,
  categories,
}: {
  q: string;
  category: string;
  categories: Category[];
}) {
  const router = useRouter();
  const { t, locale } = useI18n();

  return (
    <form className="blog-toolbar" action="/blog" method="get">
      <label className="blog-toolbar-search">
        <span className="sr-only">{t.blog.searchLabel}</span>
        <input name="q" defaultValue={q} placeholder={t.blog.searchPlaceholder} />
      </label>
      <label className="blog-toolbar-category">
        <span className="sr-only">{t.blog.category}</span>
        <select
          name="categoria"
          defaultValue={category}
          aria-label={t.blog.filterCategory}
          onChange={(event) => {
            const form = event.currentTarget.form;
            const nextQ = String(form ? new FormData(form).get("q") : q).trim();
            router.push(blogHref(nextQ, event.currentTarget.value));
          }}
        >
          <option value="">{t.blog.allCategories}</option>
          {categories.map((item) => (
            <option key={item.id} value={item.name}>
              {categoryLabel(item.name, locale)}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">{t.blog.search}</button>
    </form>
  );
}
