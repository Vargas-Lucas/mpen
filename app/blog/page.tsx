import Link from "next/link";
import { BlogToolbar } from "@/components/BlogToolbar";
import { ContactForm } from "@/components/ContactForm";
import { PostCard } from "@/components/PostCard";
import { getCategories, getPosts } from "@/lib/data";

export const metadata = {
  title: { absolute: "Blog MPEN: Florianópolis, arquitetura e mercado imobiliário" },
  description:
    "Conteúdos sobre o mercado imobiliário de Florianópolis, arquitetura, construção civil e qualidade de vida em Santa Catarina. Conheça tendências, informações sobre a região e novidades dos empreendimentos da MPEN Incorporadora.",
};

function blogHref(q: string, category = "") {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("categoria", category);
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const category = params.categoria?.trim() || "";
  const [posts, categories] = await Promise.all([
    getPosts({ q, category: category || undefined }),
    getCategories(),
  ]);
  const [lead, ...rest] = posts;
  const filtered = Boolean(q || category);

  return (
    <>
      <section className="page-hero blog-hero">
        <div className="container">
          <h1>
            <span className="blog-hero-short">Blog MPEN</span>
            <span className="blog-hero-full">
              Blog MPEN: Florianópolis, arquitetura e mercado imobiliário
            </span>
          </h1>
          <p>
            Conteúdos sobre o mercado imobiliário de Florianópolis, arquitetura, construção civil e
            qualidade de vida em Santa Catarina. Conheça tendências, informações sobre a região e
            novidades dos empreendimentos da MPEN Incorporadora.
          </p>
        </div>
      </section>
      <section className="section blog-index">
        <div className="container">
          <BlogToolbar key={`${q}-${category}`} q={q} category={category} categories={categories} />

          {posts.length === 0 ? (
            <div className="empty">
              <p>
                {category
                  ? `Nenhum artigo em ${category} ainda. Veja todas as categorias.`
                  : q
                    ? "Nenhum artigo encontrado. Tente outra palavra-chave."
                    : "Nenhum artigo publicado ainda."}
              </p>
              {category ? (
                <p>
                  <Link href={blogHref(q)}>Ver todos os artigos</Link>
                </p>
              ) : null}
            </div>
          ) : (
            <div className="blog-feature">
              {lead ? <PostCard post={lead} large /> : null}
              <div className="blog-side">
                {rest.slice(0, 2).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {rest.length > 2 ? (
            <>
              <h2 className="section-title" style={{ marginTop: 48 }}>
                Últimas do blog
              </h2>
              <div className="post-grid">
                {rest.slice(2).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : null}

          <div className="newsletter-band">
            <h2>Novidades do blog</h2>
            <p>Deixe seu e-mail para receber os próximos artigos da MPEN.</p>
            <ContactForm source="newsletter" variant="newsletter" />
          </div>
        </div>
      </section>
    </>
  );
}
