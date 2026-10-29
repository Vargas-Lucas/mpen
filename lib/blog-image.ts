const BLOG_FILE = /^\/images\/blog\/([^/?#]+)$/i;
const MEDIA_FILE = /^\/api\/media\/([^/?#]+)$/i;
const EXTENSION = /\.(jpg|jpeg|png|webp)$/i;
const MEDIA_ID = /^[a-z0-9][a-z0-9._-]*$/i;

function mediaId(file: string) {
  const id = file.replace(EXTENSION, "");
  return MEDIA_ID.test(id) ? id : "";
}

export function blogImageSrc(stored: string | null | undefined) {
  const value = (stored || "").trim();
  if (!value) return "";

  const blog = value.match(BLOG_FILE);
  if (blog) {
    const id = mediaId(blog[1]);
    return id ? `/api/media/${id}` : "";
  }

  const media = value.match(MEDIA_FILE);
  if (media) {
    const id = mediaId(media[1]);
    return id ? `/api/media/${id}` : "";
  }

  if (value.startsWith("/images/") && !value.startsWith("//")) return value;
  return "";
}
