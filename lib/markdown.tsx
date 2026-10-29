import type { ReactNode } from "react";
import { blogImageSrc } from "@/lib/blog-image";

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "img"; alt: string; src: string }
  | { type: "p"; text: string };

function safeHref(value: string) {
  const href = value.trim();
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  const withProtocol = /^(https?:)?\/\//i.test(href)
    ? href
    : href.startsWith("www.") || /^[a-z0-9-]+\.[a-z]{2,}/i.test(href)
      ? `https://${href}`
      : href;
  try {
    const url = new URL(withProtocol);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    return "";
  }
  return "";
}

function safeImage(src: string) {
  return blogImageSrc(src);
}

function trimUrl(value: string) {
  return value.replace(/[.,;:!?]+$/g, "");
}

function linkEl(key: number, href: string, label: string) {
  const safe = safeHref(href);
  if (!safe) return label;
  const external = safe.startsWith("http");
  return (
    <a key={key} href={safe} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {label}
    </a>
  );
}

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(\s*<?([^)\s>]+)>?\)|(https?:\/\/[^\s<]+)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) {
      parts.push(<strong key={key}>{match[1]}</strong>);
    } else if (match[2]) {
      parts.push(<em key={key}>{match[2]}</em>);
    } else if (match[3] && match[4]) {
      parts.push(linkEl(key, match[4], match[3]));
    } else if (match[5]) {
      const href = trimUrl(match[5]);
      parts.push(linkEl(key, href, href));
    }
    key += 1;
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function parseBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "p", text: paragraph.join(" ") });
    paragraph = [];
  };

  for (const line of lines) {
    const text = line.trim();
    if (!text) {
      flush();
      continue;
    }
    if (text.startsWith("### ")) {
      flush();
      blocks.push({ type: "h3", text: text.slice(4) });
      continue;
    }
    if (text.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: text.slice(3) });
      continue;
    }
    const image = text.match(/^!\[([^\]]*)\]\(\s*([^)]+)\)$/);
    if (image) {
      flush();
      blocks.push({ type: "img", alt: image[1], src: image[2].trim() });
      continue;
    }
    paragraph.push(text);
  }

  flush();
  return blocks;
}

export function ArticleBody({ body }: { body: string }) {
  const blocks = parseBlocks(body);
  if (!blocks.length) return null;

  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        if (block.type === "h2") return <h2 key={index}>{inline(block.text)}</h2>;
        if (block.type === "h3") return <h3 key={index}>{inline(block.text)}</h3>;
        if (block.type === "img") {
          const src = safeImage(block.src);
          return src ? <img key={index} src={src} alt={block.alt} /> : null;
        }
        return <p key={index}>{inline(block.text)}</p>;
      })}
    </div>
  );
}
