import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { PostCard } from "@/components/PostCard";
import { getPosts } from "@/lib/data";

export const metadata = { title: "Blog" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const posts = await getPosts({ q });
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHeader
        title="Blog da MPEN"
        lede="Conteúdos e notícias da empresa e dos empreendimentos no sul da Ilha."
      />
      <section className="section">
        <div className="container">
          <form className="blog-search" action="/blog" method="get">
            <input name="q" defaultValue={q} placeholder="Busque no blog" />
            <button type="submit">Buscar</button>
          </form>

          {posts.length === 0 ? (
            <div className="empty">
              <p>
                {q
                  ? "Nenhum artigo encontrado para essa busca."
                  : "Nenhum artigo publicado ainda. Quando os posts entrarem no banco, eles aparecem aqui com destaque, lista e categoria."}
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
