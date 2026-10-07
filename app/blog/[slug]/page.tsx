import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getPost } from "@/lib/data";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post?.title ?? "Artigo" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <PageHeader title={post.title} lede={post.excerpt} />
      <article className="container article">
        <p className="meta">
          {post.category} · {formatDate(post.published_at)}
        </p>
        {post.body.split("\n").filter(Boolean).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </>
  );
}
