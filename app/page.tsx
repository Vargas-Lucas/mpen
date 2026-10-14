import Link from "next/link";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import { HomeFacts } from "@/components/HomeFacts";
import { Hero } from "@/components/Hero";
import { PostCard } from "@/components/PostCard";
import { getDevelopments, getPosts, getSpotlightDevelopments } from "@/lib/data";

export default async function HomePage() {
  const [developments, slides, posts] = await Promise.all([
    getDevelopments(),
    getSpotlightDevelopments(),
    getPosts({ limit: 3 }),
  ]);

  return (
    <>
      <Hero slides={slides} />

      <section className="home-intro">
        <div className="container home-intro-grid">
          <div>
            <p className="kicker">A MPEN</p>
            <h2>Transformando vidas</h2>
          </div>
          <div className="home-intro-copy">
            <p>
              A MPEN transforma vidas através de empreendimentos que unem sofisticação, qualidade e
              inovação. São mais de 20 anos no sul da Ilha de Florianópolis.
            </p>
            <Link className="btn btn-solid" href="/quem-somos">
              Quem somos
            </Link>
          </div>
        </div>
        <div className="container">
          <HomeFacts projectCount={developments.length} />
        </div>
      </section>

      <section className="home-catalog">
        <div className="container">
          <div className="home-catalog-head">
            <div>
              <h2>Conheça nossos empreendimentos</h2>
              <p>Escolha por etapa ou percorra os projetos mais recentes.</p>
            </div>
            <nav className="home-paths" aria-label="Filtrar empreendimentos">
              <Link href="/empreendimentos?status=lancamento">Lançamentos</Link>
              <Link href="/empreendimentos?status=construcao">Em construção</Link>
              <Link href="/empreendimentos?status=entregue">Entregues</Link>
            </nav>
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
