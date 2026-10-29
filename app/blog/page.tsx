import Link from "next/link";
import { BlogToolbar } from "@/components/BlogToolbar";
import { ContactForm } from "@/components/ContactForm";
import { PostCard } from "@/components/PostCard";
import { categoryLabel, ui } from "@/lib/copy/ui";
import { getCategories, getPosts } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";
import { localizePosts } from "@/lib/post-i18n";

function blogHref(q: string, category = "") {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("categoria", category);
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export async function generateMetadata() {
  const t = ui(await getLocale()).blog;
  return {
    title: { absolute: t.title },
    description: t.lede,
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const locale = await getLocale();
  const t = ui(locale).blog;
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const category = params.categoria?.trim() || "";
  const [storedPosts, categories] = await Promise.all([
    getPosts({ q, category: category || undefined }),
    getCategories(),
  ]);
  const posts = localizePosts(storedPosts, locale);
  const [lead, ...rest] = posts;
  const categoryName = categoryLabel(category, locale);

  return (
    <>
      <section className="page-hero blog-hero">
        <div className="container">
          <h1>
            <span className="blog-hero-short">{t.short}</span>
            <span className="blog-hero-full">{t.title}</span>
          </h1>
          <p>{t.lede}</p>
        </div>
      </section>
      <section className="section blog-index">
        <div className="container">
          <BlogToolbar key={`${q}-${category}`} q={q} category={category} categories={categories} />

          {posts.length === 0 ? (
            <div className="empty">
              <p>
                {category
                  ? `${t.emptyCategory} ${categoryName} ${t.emptyCategoryAfter}`
                  : q
                    ? t.emptyQuery
                    : t.empty}
              </p>
              {category ? (
                <p>
                  <Link href={blogHref(q)}>{t.seeAll}</Link>
                </p>
              ) : null}
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
                {t.latest}
              </h2>
              <div className="post-grid">
                {rest.slice(2).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : null}

          <div className="newsletter-band">
            <h2>{t.newsTitle}</h2>
            <p>{t.newsText}</p>
            <ContactForm source="newsletter" variant="newsletter" />
          </div>
        </div>
      </section>
    </>
  );
}
