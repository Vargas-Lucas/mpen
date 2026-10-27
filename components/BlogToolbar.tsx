"use client";

import { useRouter } from "next/navigation";
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

  return (
    <form className="blog-toolbar" action="/blog" method="get">
      <label className="blog-toolbar-search">
        <span className="sr-only">Buscar artigos</span>
        <input name="q" defaultValue={q} placeholder="Buscar artigos" />
      </label>
      <label className="blog-toolbar-category">
        <span className="sr-only">Categoria</span>
        <select
          name="categoria"
          defaultValue={category}
          aria-label="Filtrar por categoria"
          onChange={(event) => {
            const form = event.currentTarget.form;
            const nextQ = String(form ? new FormData(form).get("q") : q).trim();
            router.push(blogHref(nextQ, event.currentTarget.value));
          }}
        >
          <option value="">Todas as categorias</option>
          {categories.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Buscar</button>
    </form>
  );
}
