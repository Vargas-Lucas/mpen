import Link from "next/link";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import { HomeFacts } from "@/components/HomeFacts";
import { Hero } from "@/components/Hero";
import { PostCard } from "@/components/PostCard";
import { heroImage } from "@/lib/images";
import { getDevelopments, getPosts, getSpotlightDevelopments } from "@/lib/data";

export default async function HomePage() {
  const [developments, slides, posts] = await Promise.all([
    getDevelopments(),
    getSpotlightDevelopments(),
    getPosts({ limit: 3 }),
  ]);
  const lcpImage = slides[0] ? heroImage(slides[0].slug) : "";

  return (
    <>
      {lcpImage ? <link rel="preload" as="image" href={lcpImage} fetchPriority="high" /> : null}
      <h1 className="sr-only">MPEN | Construtora e Incorporadora no Sul da Ilha de Florianópolis</h1>
      <Hero slides={slides} />

      <section className="home-intro">
        <div className="container home-intro-grid">
          <div>
            <h2 className="kicker kicker-plain">A MPEN</h2>
            <h2 className="home-intro-title">MPEN Incorporadora: transformando vidas no Sul da Ilha</h2>
          </div>
          <div className="home-intro-copy">
            <p>
              Há mais de 20 anos, a MPEN é uma construtora que desenvolve empreendimentos
              residenciais no Sul da Ilha de Florianópolis, unindo arquitetura, qualidade construtiva
              e soluções pensadas para diferentes formas de morar.
            </p>
            <p>
              Conheça nossos apartamentos e empreendimentos imobiliários em Florianópolis, dos
              lançamentos aos projetos em construção e já entregues.
            </p>
            <Link className="btn btn-solid" href="/quem-somos">
              Conheça a MPEN
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
              <h2>Conheça nossos empreendimentos em Florianópolis</h2>
              <p>
                Explore os lançamentos, empreendimentos em construção e imóveis já entregues pela
                MPEN no Sul da Ilha de Florianópolis.
              </p>
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
          ) : null}
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
