import type { ReactNode } from "react";

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "img"; alt: string; src: string }
  | { type: "p"; text: string };

function safeHref(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return value;
  } catch {
    return "";
  }
  return "";
}

function safeImage(src: string) {
  return src.startsWith("/images/") ? src : "";
}

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[0].startsWith("**")) {
      parts.push(<strong key={key}>{match[0].slice(2, -2)}</strong>);
    } else {
      const href = safeHref(match[3] || "");
      parts.push(
        href ? (
          <a key={key} href={href}>
            {match[2]}
          </a>
        ) : (
          match[2]
        ),
      );
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
    const image = text.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flush();
      blocks.push({ type: "img", alt: image[1], src: image[2] });
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
