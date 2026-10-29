import Link from "next/link";
import { blogImageSrc } from "@/lib/blog-image";
import { dateTimeAttr, formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  const cover = blogImageSrc(post.cover);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${large ? "post-card large" : "post-card"}${cover ? " has-cover" : ""}`}
      style={cover ? { ["--post-cover" as string]: `url("${cover}")` } : undefined}
    >
      <span>{post.category}</span>
      <strong>{post.title}</strong>
      {post.excerpt ? <em>{post.excerpt}</em> : null}
      {post.published_at ? <time dateTime={dateTimeAttr(post.published_at)}>{formatDate(post.published_at)}</time> : null}
    </Link>
  );
}
