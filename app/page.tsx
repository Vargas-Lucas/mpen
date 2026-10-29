import Link from "next/link";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import { HomeFacts } from "@/components/HomeFacts";
import { Hero } from "@/components/Hero";
import { PostCard } from "@/components/PostCard";
import { ui } from "@/lib/copy/ui";
import { getLocale } from "@/lib/i18n-server";
import { localizePosts } from "@/lib/post-i18n";
import { heroImage } from "@/lib/images";
import { getDevelopments, getPosts, getSpotlightDevelopments } from "@/lib/data";

export default async function HomePage() {
  const locale = await getLocale();
  const t = ui(locale);
  const [developments, slides, storedPosts] = await Promise.all([
    getDevelopments(),
    getSpotlightDevelopments(),
    getPosts({ limit: 3 }),
  ]);
  const posts = localizePosts(storedPosts, locale);
  const lcpImage = slides[0] ? heroImage(slides[0].slug) : "";

  return (
    <>
      {lcpImage ? <link rel="preload" as="image" href={lcpImage} fetchPriority="high" /> : null}
      <h1 className="sr-only">{t.home.h1}</h1>
      <Hero slides={slides} />

      <section className="home-intro">
        <div className="container home-intro-grid">
          <div>
            <h2 className="kicker kicker-plain">{t.home.kicker}</h2>
            <h2 className="home-intro-title">{t.home.title}</h2>
          </div>
          <div className="home-intro-copy">
            <p>{t.home.p1}</p>
            <p>{t.home.p2}</p>
            <Link className="btn btn-solid" href="/quem-somos">
              {t.home.cta}
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
              <h2>{t.home.catalogTitle}</h2>
              <p>{t.home.catalogLede}</p>
            </div>
            <nav className="home-paths" aria-label={t.home.filterAria}>
              <Link href="/empreendimentos?status=lancamento">{t.home.launches}</Link>
              <Link href="/empreendimentos?status=construcao">{t.home.building}</Link>
              <Link href="/empreendimentos?status=entregue">{t.home.delivered}</Link>
            </nav>
          </div>
          <div className="dev-grid">
            {developments.slice(0, 6).map((item) => (
              <DevelopmentCard key={item.id} item={item} />
            ))}
          </div>
          <div className="center-link">
            <Link className="btn btn-solid" href="/empreendimentos">
              {t.home.more}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">{t.home.blogTitle}</h2>
          <p className="section-lede">{t.home.blogLede}</p>
          {posts.length > 0 ? (
            <div className="post-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}
          <div className="center-link">
            <Link className="btn btn-solid" href="/blog">
              {t.home.visitBlog}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
