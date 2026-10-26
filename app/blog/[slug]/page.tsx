import Link from "next/link";
import { notFound } from "next/navigation";
import { getEditorSession } from "@/lib/auth";
import { getPost, getPostBySlug, getRelatedPosts } from "@/lib/data";
import { formatDate, readingMinutes } from "@/lib/format";
import { ArticleBody } from "@/lib/markdown";
import { articleJsonLd, articleMetadata } from "@/lib/seo";

async function loadArticle(slug: string, preview?: string) {
  const wantsPreview = preview === "1";
  const editor = wantsPreview ? await getEditorSession() : null;
  const post = editor ? await getPostBySlug(slug) : await getPost(slug);
  return { post, editor, isPreview: Boolean(editor && post) };
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const { post, isPreview } = await loadArticle(slug, preview);
  if (!post) return { title: "Artigo" };
  const meta = articleMetadata(post);
  if (isPreview) {
    return { ...meta, robots: { index: false, follow: false } };
  }
  return meta;
}

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const { post, isPreview } = await loadArticle(slug, preview);
  if (!post) notFound();
  const related = await getRelatedPosts(post);
  const minutes = readingMinutes(post.body);
  const cover = post.cover.startsWith("/images/") ? post.cover : "";
  const coverAlt = post.cover_alt?.trim() || post.title;
  const dateLabel = post.published_at ? formatDate(post.published_at) : "Prévia";
  const lede = post.excerpt.trim() && post.excerpt.trim() !== post.title.trim() ? post.excerpt.trim() : "";

  return (
    <>
      {post.published_at && !isPreview ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }} />
      ) : null}
      {isPreview ? (
        <div className="article-preview-bar">
          <div className="container article-preview-inner">
            <p>
              {post.published_at
                ? "Prévia de como o artigo aparece no site."
                : "Prévia — este artigo ainda não está no ar."}
            </p>
            <Link href={`/admin/artigos/${post.id}`}>Voltar a editar</Link>
          </div>
        </div>
      ) : null}

      <article className="story">
        <header className="story-hero">
          <div className="container story-col">
            <Link className="back-link" href="/blog">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M10 3.5 5.5 8 10 12.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Voltar ao blog
            </Link>
            <h1>{post.title}</h1>
            <p className="story-meta">
              <Link href={`/blog?categoria=${encodeURIComponent(post.category)}`}>{post.category}</Link>
              <span aria-hidden="true">·</span>
              <time dateTime={post.published_at || undefined}>{dateLabel}</time>
              <span aria-hidden="true">·</span>
              <span>{minutes} min de leitura</span>
            </p>
          </div>
        </header>

        <div className="container story-col">
          {cover ? (
            <figure className="story-cover">
              <img src={cover} alt={coverAlt} />
            </figure>
          ) : null}
          {lede ? <p className="story-lede">{lede}</p> : null}
          <ArticleBody body={post.body} />
        </div>
      </article>

      <section className="story-after">
        <div className="container story-col">
          <div className="story-cta">
            <div className="story-cta-copy">
              <h2>Conheça os imóveis da MPEN no Sul da Ilha</h2>
              <p>Residencial com arquitetura e qualidade construtiva, a poucos minutos do mar.</p>
            </div>
            <div className="story-cta-actions">
              <Link className="btn btn-solid" href="/empreendimentos">
                Ver empreendimentos
              </Link>
              <Link className="btn btn-ghost" href="/contato">
                Fale com a MPEN
              </Link>
            </div>
          </div>

          {related.length > 0 ? (
            <div className="story-related">
              <h2>Continue lendo</h2>
              <ul>
                {related.map((item) => {
                  const relatedCover = item.cover.startsWith("/images/") ? item.cover : "";
                  return (
                    <li key={item.id}>
                      <Link href={`/blog/${item.slug}`}>
                        {relatedCover ? (
                          <img src={relatedCover} alt="" />
                        ) : (
                          <span className="story-related-ph" aria-hidden="true" />
                        )}
                        <span>
                          <em>{item.category}</em>
                          <strong>{item.title}</strong>
                          {item.published_at ? <time dateTime={item.published_at}>{formatDate(item.published_at)}</time> : null}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
