import Link from "next/link";
import type { Post } from "@/lib/types";

export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className={large ? "post-card large" : "post-card"}>
      <span>{post.category}</span>
      <strong>{post.title}</strong>
      {post.excerpt ? <em>{post.excerpt}</em> : null}
    </Link>
  );
}
