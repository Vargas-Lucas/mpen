import { blogImageSrc } from "@/lib/blog-image";

type JSONContent = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: JSONContent[];
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function normalizeHref(value: string) {
  const href = value.trim();
  if (!href) return "";
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  const withProtocol = /^(https?:)?\/\//i.test(href)
    ? href
    : href.startsWith("www.")
      ? `https://${href}`
      : `https://${href}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    return "";
  }
  return "";
}

function inlineToHtml(text: string) {
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(\s*<?([^)\s>]+)>?\)|(https?:\/\/[^\s<]+)/g;
  let last = 0;
  let html = "";
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > last) html += escapeHtml(text.slice(last, match.index));
    if (match[1]) html += `<strong>${escapeHtml(match[1])}</strong>`;
    else if (match[2]) html += `<em>${escapeHtml(match[2])}</em>`;
    else if (match[3] && match[4]) {
      const href = normalizeHref(match[4]);
      html += href
        ? `<a href="${escapeHtml(href)}">${escapeHtml(match[3])}</a>`
        : escapeHtml(match[3]);
    } else if (match[5]) {
      const href = normalizeHref(match[5]);
      html += href
        ? `<a href="${escapeHtml(href)}">${escapeHtml(match[5])}</a>`
        : escapeHtml(match[5]);
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) html += escapeHtml(text.slice(last));
  return html;
}

export function markdownToHtml(body: string) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inlineToHtml(paragraph.join(" "))}</p>`);
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
      html.push(`<h3>${inlineToHtml(text.slice(4))}</h3>`);
      continue;
    }
    if (text.startsWith("## ")) {
      flush();
      html.push(`<h2>${inlineToHtml(text.slice(3))}</h2>`);
      continue;
    }
    const image = text.match(/^!\[([^\]]*)\]\(\s*([^)]+)\)$/);
    if (image) {
      flush();
      const src = blogImageSrc(image[2].trim()) || image[2].trim();
      html.push(`<img src="${escapeHtml(src)}" alt="${escapeHtml(image[1])}">`);
      continue;
    }
    paragraph.push(text);
  }

  flush();
  return html.join("") || "<p></p>";
}

function marksToMarkdown(text: string, marks?: JSONContent["marks"]) {
  let value = text;
  const list = marks || [];
  const italic = list.some((mark) => mark.type === "italic");
  const bold = list.some((mark) => mark.type === "bold");
  const link = list.find((mark) => mark.type === "link");
  if (italic) value = `*${value}*`;
  if (bold) value = `**${value}**`;
  if (link?.attrs?.href) value = `[${value}](${String(link.attrs.href)})`;
  return value;
}

function inlineToMarkdown(content?: JSONContent[]): string {
  if (!content?.length) return "";
  return content
    .map((node) => {
      if (node.type === "hardBreak") return "\n";
      if (node.type === "text") return marksToMarkdown(node.text || "", node.marks);
      if (node.type === "image") {
        return `![${node.attrs?.alt || ""}](${node.attrs?.src || ""})`;
      }
      return inlineToMarkdown(node.content);
    })
    .join("");
}

export function jsonToMarkdown(doc: JSONContent) {
  const blocks: string[] = [];
  for (const node of doc.content || []) {
    if (node.type === "heading") {
      const hashes = node.attrs?.level === 3 ? "###" : "##";
      const text = inlineToMarkdown(node.content).trim();
      if (text) blocks.push(`${hashes} ${text}`);
      continue;
    }
    if (node.type === "image") {
      const src = String(node.attrs?.src || "");
      if (src) blocks.push(`![${node.attrs?.alt || ""}](${src})`);
      continue;
    }
    const text = inlineToMarkdown(node.content).trim();
    if (text) blocks.push(text);
  }
  return blocks.join("\n\n");
}
