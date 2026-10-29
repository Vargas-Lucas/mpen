import Link from "next/link";
import { notFound } from "next/navigation";
import { getEditorSession } from "@/lib/auth";
import { getPost, getPostBySlug, getRelatedPosts } from "@/lib/data";
import { categoryLabel, ui } from "@/lib/copy/ui";
import { getLocale } from "@/lib/i18n-server";
import { localizePost, localizePosts } from "@/lib/post-i18n";
import { dateTimeAttr, formatDate, readingMinutes } from "@/lib/format";
import { blogImageSrc } from "@/lib/blog-image";
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
  const { post: stored, isPreview } = await loadArticle(slug, preview);
  if (!stored) return { title: ui(await getLocale()).blog.article };
  const locale = await getLocale();
  const post = localizePost(stored, locale);
  const meta = articleMetadata(post, ui(locale).blog.seoAbout);
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
  const { post: stored, isPreview } = await loadArticle(slug, preview);
  if (!stored) notFound();
  const locale = await getLocale();
  const t = ui(locale).blog;
  const post = localizePost(stored, locale);
  const related = localizePosts(await getRelatedPosts(post), locale);
  const minutes = readingMinutes(post.body);
  const cover = blogImageSrc(post.cover);
  const coverAlt = post.cover_alt?.trim() || post.title;
  const dateLabel = post.published_at ? formatDate(post.published_at, locale) : t.previewDate;
  const lede = post.excerpt.trim() && post.excerpt.trim() !== post.title.trim() ? post.excerpt.trim() : "";

  return (
    <>
      {post.published_at && !isPreview ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post, t.seoAbout)) }} />
      ) : null}
      {isPreview ? (
        <div className="article-preview-bar">
          <div className="container article-preview-inner">
            <p>
              {post.published_at ? t.previewLive : t.previewDraft}
            </p>
            <Link href={`/admin/artigos/${post.id}`}>{t.edit}</Link>
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
              {t.back}
            </Link>
            <h1>{post.title}</h1>
            <p className="story-meta">
              <Link href={`/blog?categoria=${encodeURIComponent(post.category)}`}>{categoryLabel(post.category, locale)}</Link>
              <span aria-hidden="true">·</span>
              <time dateTime={dateTimeAttr(post.published_at)}>{dateLabel}</time>
              <span aria-hidden="true">·</span>
              <span>
                {minutes} {t.minutes}
              </span>
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
              <h2>{t.ctaTitle}</h2>
              <p>{t.ctaText}</p>
            </div>
            <div className="story-cta-actions">
              <Link className="btn btn-solid" href="/empreendimentos">
                {t.seeDev}
              </Link>
              <Link className="btn btn-ghost" href="/contato">
                {t.talk}
              </Link>
            </div>
          </div>

          {related.length > 0 ? (
            <div className="story-related">
              <h2>{t.keepReading}</h2>
              <ul>
                {related.map((item) => {
                  const relatedCover = blogImageSrc(item.cover);
                  return (
                    <li key={item.id}>
                      <Link href={`/blog/${item.slug}`}>
                        {relatedCover ? (
                          <img src={relatedCover} alt="" />
                        ) : (
                          <span className="story-related-ph" aria-hidden="true" />
                        )}
                        <span>
                          <em>{categoryLabel(item.category, locale)}</em>
                          <strong>{item.title}</strong>
                          {item.published_at ? <time dateTime={dateTimeAttr(item.published_at)}>{formatDate(item.published_at, locale)}</time> : null}
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
