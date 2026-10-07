import Link from "next/link";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import { Hero } from "@/components/Hero";
import { PostCard } from "@/components/PostCard";
import { getDevelopments, getPosts } from "@/lib/data";

export default async function HomePage() {
  const [developments, posts] = await Promise.all([
    getDevelopments(),
    getPosts({ limit: 3 }),
  ]);

  return (
    <>
      <Hero slides={developments} />

      <section className="section band">
        <div className="container split">
          <div>
            <p className="kicker">A MPEN</p>
            <h2>Transformando vidas</h2>
          </div>
          <div>
            <p>
              A MPEN transforma vidas através de empreendimentos que unem sofisticação, qualidade e
              inovação. São mais de 20 anos no sul da Ilha de Florianópolis.
            </p>
            <Link className="btn btn-solid" href="/quem-somos">
              Quem somos
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Conheça nossos empreendimentos</h2>
          <div className="filters">
            <Link href="/empreendimentos?status=lancamento">Lançamentos</Link>
            <Link href="/empreendimentos?status=construcao">Em construção</Link>
            <Link href="/empreendimentos?status=entregue">Entregues</Link>
          </div>
          <div className="dev-grid">
            {developments.slice(0, 6).map((item) => (
              <DevelopmentCard key={item.id} item={item} />
            ))}
          </div>
          <div className="center-link">
            <Link className="btn btn-solid" href="/empreendimentos">
              Ver mais empreendimentos
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Blog da MPEN</h2>
          <p className="section-lede">Novidades da empresa e dos empreendimentos.</p>
          {posts.length > 0 ? (
            <div className="post-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>Nenhum artigo publicado ainda. A listagem do blog já está pronta para receber os posts.</p>
            </div>
          )}
          <div className="center-link">
            <Link className="btn btn-solid" href="/blog">
              Visite o blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
