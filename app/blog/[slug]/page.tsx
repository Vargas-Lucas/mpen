import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getPost } from "@/lib/data";
import { formatDate } from "@/lib/format";
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }} />
      <PageHeader title={post.title} lede={post.excerpt} />
      <article className="container article">
        {post.cover ? (
          <img className="article-cover" src={post.cover} alt={post.title} />
        ) : null}
        <p className="meta">
          {post.category} · {post.published_at ? formatDate(post.published_at) : ""}
        </p>
        {post.body.split("\n").filter(Boolean).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </>
  );
}
