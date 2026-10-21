import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PostCard } from "@/components/PostCard";
import { getPost, getRelatedPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { ArticleBody } from "@/lib/markdown";
import { articleJsonLd, articleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Artigo" };
  return articleMetadata(post);
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }} />
      <PageHeader title={post.title} lede={post.excerpt} />
      <article className="container article">
        {post.cover ? (
          <img className="article-cover" src={post.cover} alt={post.cover_alt?.trim() || post.title} />
        ) : null}
        <p className="meta">
          {post.category} · {post.published_at ? formatDate(post.published_at) : ""}
        </p>
        <ArticleBody body={post.body} />
      </article>
      <section className="section article-more">
        <div className="container">
          {related.length > 0 ? (
            <>
              <h2 className="section-title">Outros artigos</h2>
              <div className="post-grid">
                {related.map((item) => (
                  <PostCard key={item.id} post={item} />
                ))}
              </div>
            </>
          ) : null}
          <p className="article-cta">
            <Link href="/empreendimentos">Conheça os empreendimentos da MPEN</Link>
          </p>
        </div>
      </section>
    </>
  );
}
