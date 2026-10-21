import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { PostCard } from "@/components/PostCard";
import { getPosts } from "@/lib/data";
import { POST_CATEGORIES } from "@/lib/slug";

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
  const posts = await getPosts({ q, category: category || undefined });
  const [lead, ...rest] = posts;
  const filtered = Boolean(q || category);

  return (
    <>
      <PageHeader
        title="Blog MPEN: Florianópolis, arquitetura e mercado imobiliário"
        lede="Conteúdos sobre o mercado imobiliário de Florianópolis, arquitetura, construção civil e qualidade de vida em Santa Catarina. Conheça tendências, informações sobre a região e novidades dos empreendimentos da MPEN Incorporadora."
      />
      <section className="section">
        <div className="container">
          <form className="blog-search" action="/blog" method="get">
            {category ? <input type="hidden" name="categoria" value={category} /> : null}
            <input name="q" defaultValue={q} placeholder="Buscar artigos..." />
            <button type="submit">Buscar</button>
          </form>

          <nav className="blog-filters" aria-label="Categorias do blog">
            <Link className={!category ? "is-on" : undefined} href={blogHref(q)}>
              Todas
            </Link>
            {POST_CATEGORIES.map((item) => (
              <Link
                key={item}
                className={category === item ? "is-on" : undefined}
                href={blogHref(q, item)}
              >
                {item}
              </Link>
            ))}
          </nav>

          {posts.length === 0 ? (
            <div className="empty">
              <p>
                {filtered
                  ? "Nenhum artigo encontrado. Tente outra palavra-chave ou categoria."
                  : "Nenhum artigo publicado ainda."}
              </p>
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
