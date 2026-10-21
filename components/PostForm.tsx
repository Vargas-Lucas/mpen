"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { savePost, type PostState } from "@/actions/posts";
import { POST_CATEGORIES, slugify } from "@/lib/slug";
import { toDatetimeLocal } from "@/lib/format";
import type { Post } from "@/lib/types";

const initial: PostState = { ok: false, message: "" };

function Actions() {
  const { pending } = useFormStatus();
  return (
    <div className="admin-actions">
      <button className="admin-secondary" name="intent" value="draft" type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar rascunho"}
      </button>
      <button className="admin-submit admin-submit-inline" name="intent" value="publish" type="submit" disabled={pending}>
        {pending ? "Publicando..." : "Publicar"}
      </button>
    </div>
  );
}

export function PostForm({ post }: { post?: Post }) {
  const [state, action] = useActionState(savePost, initial);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [preview, setPreview] = useState(post?.cover || "");

  useEffect(() => {
    if (!slugTouched) setSlug(title ? slugify(title) : "");
  }, [title, slugTouched]);

  const googleTitle = seoTitle.trim() || (title.trim() ? `${title.trim()} — MPEN` : "Título do artigo — MPEN");
  const googleDescription =
    seoDescription.trim() || excerpt.trim() || "O resumo ou a descrição de SEO aparece aqui.";
  const googleUrl = `teste.mpen.com.br › blog › ${slug || "titulo-do-artigo"}`;

  return (
    <form className="form admin-form" action={action}>
      {post ? <input name="id" type="hidden" value={post.id} /> : null}

      <label>
        Título
        <input
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          minLength={3}
        />
      </label>

      <label>
        Endereço no site
        <input
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
        />
        <span className="admin-hint">Fica em /blog/{slug || "titulo-do-artigo"}</span>
      </label>

      <label>
        Categoria
        <input name="category" defaultValue={post?.category || "MPEN"} list="post-categories" />
        <datalist id="post-categories">
          {POST_CATEGORIES.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </label>

      <label>
        Resumo
        <textarea name="excerpt" rows={3} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} />
      </label>

      <label>
        Texto
        <textarea className="admin-body" name="body" rows={14} defaultValue={post?.body ?? ""} />
      </label>

      <label>
        Capa
        <input
          name="cover"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : post?.cover || "");
          }}
        />
        <span className="admin-hint">JPG, PNG ou WebP, até 5 MB.</span>
      </label>

      {preview ? (
        <div className="admin-cover-preview">
          <img src={preview} alt="" />
          {post?.cover ? (
            <label className="admin-check">
              <input name="remove_cover" type="checkbox" />
              Remover capa
            </label>
          ) : null}
        </div>
      ) : null}

      <label>
        Data de publicação
        <input name="published_at" type="datetime-local" defaultValue={toDatetimeLocal(post?.published_at ?? null)} />
        <span className="admin-hint">Se ficar vazio na hora de publicar, usamos a data de agora.</span>
      </label>

      <label className="admin-check">
        <input name="featured" type="checkbox" defaultChecked={post?.featured} />
        Destacar na listagem do blog
      </label>

      <fieldset className="admin-seo">
        <legend>Busca no Google</legend>
        <p className="admin-hint">Se ficar vazio, usamos o título e o resumo do artigo.</p>

        <div className="seo-preview" aria-label="Prévia na busca do Google">
          <p className="seo-preview-url">{googleUrl}</p>
          <p className="seo-preview-title">{googleTitle.length > 60 ? `${googleTitle.slice(0, 57)}...` : googleTitle}</p>
          <p className="seo-preview-desc">
            {googleDescription.length > 160 ? `${googleDescription.slice(0, 157)}...` : googleDescription}
          </p>
        </div>

        <label>
          Título no Google
          <input name="seo_title" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} maxLength={120} />
          <span className={seoTitle.length > 60 ? "admin-count is-long" : "admin-count"}>{seoTitle.length}/60</span>
        </label>

        <label>
          Descrição no Google
          <textarea
            name="seo_description"
            rows={3}
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            maxLength={320}
          />
          <span className={seoDescription.length > 160 ? "admin-count is-long" : "admin-count"}>
            {seoDescription.length}/160
          </span>
        </label>
      </fieldset>

      <Actions />
      {state.message ? (
        <p className="err" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
