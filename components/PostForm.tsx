"use client";

import dynamic from "next/dynamic";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { createCategory, type CategoryState } from "@/actions/categories";
import { draftPost, previewPost, publishPost, uploadPostImage, type PostState } from "@/actions/posts";

const ArticleEditor = dynamic(
  () => import("@/components/ArticleEditor").then((mod) => mod.ArticleEditor),
  {
    ssr: false,
    loading: () => <div className="admin-visual" aria-hidden="true" />,
  },
);
import { articleSeoChecks } from "@/lib/seo-check";
import { SITE_URL } from "@/lib/seo";
import { slugify } from "@/lib/slug";
import { toDatetimeLocal } from "@/lib/format";
import type { Category, Post } from "@/lib/types";

const initial: PostState = { ok: false, message: "" };
const host = SITE_URL.replace(/^https?:\/\//, "");

type SaveAction = (formData: FormData) => void;

function Actions({
  published,
  publish,
  preview,
  draft,
}: {
  published?: boolean;
  publish: SaveAction;
  preview: SaveAction;
  draft: SaveAction;
}) {
  const { pending } = useFormStatus();
  const [clicked, setClicked] = useState("");
  return (
    <div className={pending ? "admin-publish is-pending" : "admin-publish"}>
      <button
        className="admin-submit is-publish"
        type="submit"
        formAction={publish}
        onClick={() => setClicked("publish")}
      >
        {pending && clicked === "publish" ? "Publicando..." : published ? "Atualizar" : "Publicar"}
      </button>
      <button
        className="admin-secondary is-preview"
        type="submit"
        formAction={preview}
        onClick={() => setClicked("preview")}
      >
        {pending && clicked === "preview" ? "Abrindo prévia..." : "Ver como"}
      </button>
      <button
        className="admin-secondary is-draft"
        type="submit"
        formAction={draft}
        onClick={() => setClicked("draft")}
      >
        {pending && clicked === "draft" ? "Salvando..." : published ? "Voltar para rascunho" : "Salvar rascunho"}
      </button>
    </div>
  );
}

function SeoMeter({ length, min, max }: { length: number; min: number; max: number }) {
  const state = length > max ? "over" : length >= min ? "ok" : length > 0 ? "short" : "empty";
  const pct = Math.min(100, (length / max) * 100);
  return (
    <div className={`seo-meter is-${state}`} aria-hidden="true">
      <span style={{ width: `${Math.max(pct, length > 0 ? 4 : 0)}%` }} />
    </div>
  );
}

const categoryInitial: CategoryState = { ok: false, message: "" };
const DRAFT_KEY = "mpen-draft-novo";

type LocalDraft = {
  title?: string;
  slug?: string;
  slugTouched?: boolean;
  excerpt?: string;
  body?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeyword?: string;
  category?: string;
};

export function PostForm({
  post,
  categories,
  saved,
}: {
  post?: Post;
  categories: Category[];
  saved?: boolean;
}) {
  const [publishState, publishAction] = useActionState(publishPost, initial);
  const [previewState, previewAction] = useActionState(previewPost, initial);
  const [draftState, draftAction] = useActionState(draftPost, initial);
  const state = publishState.message
    ? publishState
    : previewState.message
      ? previewState
      : draftState;
  const [categoryState, addCategory] = useActionState(createCategory, categoryInitial);
  const [catPending, startCategory] = useTransition();
  const [draftReady, setDraftReady] = useState(Boolean(post));
  const [restored, setRestored] = useState(false);
  const [names, setNames] = useState(() => {
    const list = categories.map((item) => item.name);
    if (post?.category && !list.includes(post.category)) list.unshift(post.category);
    return list;
  });
  const [category, setCategory] = useState(
    post?.category || categories.find((item) => item.name === "MPEN")?.name || categories[0]?.name || "",
  );
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [seoKeyword, setSeoKeyword] = useState(post?.seo_keyword ?? "");
  const [preview, setPreview] = useState(post?.cover || "");
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (saved) {
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
    }
    if (post) {
      setDraftReady(true);
      return;
    }
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const data = JSON.parse(raw) as LocalDraft;
        if (data.title) setTitle(data.title);
        if (data.slug) setSlug(data.slug);
        if (data.slugTouched) setSlugTouched(true);
        if (data.excerpt) setExcerpt(data.excerpt);
        if (data.body) setBody(data.body);
        if (data.seoTitle) setSeoTitle(data.seoTitle);
        if (data.seoDescription) setSeoDescription(data.seoDescription);
        if (data.seoKeyword) setSeoKeyword(data.seoKeyword);
        if (data.category) {
          setNames((current) => (current.includes(data.category!) ? current : [...current, data.category!]));
          setCategory(data.category);
        }
        setRestored(Boolean(data.title || data.body || data.excerpt));
      }
    } catch {
      /* ignore broken local draft */
    }
    setDraftReady(true);
  }, [post, saved]);

  useEffect(() => {
    if (!slugTouched) setSlug(title ? slugify(title) : "");
  }, [title, slugTouched]);

  useEffect(() => {
    if (post || !draftReady) return;
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            title,
            slug,
            slugTouched,
            excerpt,
            body,
            seoTitle,
            seoDescription,
            seoKeyword,
            category,
          } satisfies LocalDraft),
        );
      } catch {
        /* quota */
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [post, draftReady, title, slug, slugTouched, excerpt, body, seoTitle, seoDescription, seoKeyword, category]);

  useEffect(() => {
    if (categoryState.ok && categoryState.name) {
      setNames((current) => (current.includes(categoryState.name!) ? current : [...current, categoryState.name!]));
      setCategory(categoryState.name);
      setAddingCategory(false);
      setNewCategory("");
    }
  }, [categoryState]);

  function discardLocalDraft() {
    sessionStorage.removeItem(DRAFT_KEY);
    setTitle(post?.title ?? "");
    setSlug(post?.slug ?? "");
    setSlugTouched(Boolean(post?.slug));
    setExcerpt(post?.excerpt ?? "");
    setBody(post?.body ?? "");
    setSeoTitle(post?.seo_title ?? "");
    setSeoDescription(post?.seo_description ?? "");
    setSeoKeyword(post?.seo_keyword ?? "");
    setCategory(post?.category || categories.find((item) => item.name === "MPEN")?.name || categories[0]?.name || "");
    setRestored(false);
    setEditorKey((current) => current + 1);
  }

  const fallbackTitle = title.trim() ? `${title.trim()} — MPEN` : "";
  const fallbackDescription = excerpt.trim();
  const snippetTitle = seoTitle !== "" ? seoTitle : fallbackTitle;
  const snippetDescription = seoDescription !== "" ? seoDescription : fallbackDescription;
  const checks = articleSeoChecks({
    title,
    slug,
    excerpt,
    body,
    seoTitle,
    seoDescription,
    keyword: seoKeyword,
  });
  const ready = checks.filter((item) => item.ok).length;

  function submitNewCategory() {
    const name = newCategory.trim();
    if (name.length < 2) return;
    const data = new FormData();
    data.set("name", name);
    data.set("stay", "1");
    startCategory(() => {
      addCategory(data);
    });
  }

  return (
    <form className="form admin-form" action={draftAction}>
      {post ? <input name="id" type="hidden" value={post.id} /> : null}
      <input name="seo_title" type="hidden" value={seoTitle} />
      <input name="seo_description" type="hidden" value={seoDescription} />
      {restored ? (
        <p className="ok admin-draft-banner" role="status">
          Rascunho local restaurado.{" "}
          <button className="admin-tool" type="button" onClick={discardLocalDraft}>
            Começar em branco
          </button>
        </p>
      ) : null}
      {state.message ? (
        <p className="err" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="admin-editor-grid">
        <div className="admin-write">
          <label className="admin-title-field">
            <span className="sr-only">Título</span>
            <input
              className="admin-title-input"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Adicionar título"
              required
              minLength={3}
            />
          </label>

          <p className="admin-permalink">
            <span>Endereço:</span>
            <span className="admin-permalink-base">
              {host}/blog/
            </span>
            <input
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              placeholder="titulo-do-artigo"
            />
          </p>

          <input name="body" type="hidden" value={body} />
          {draftReady ? (
            <ArticleEditor
              key={editorKey}
              value={body}
              onChange={setBody}
              uploadImage={async (file) => {
                const data = new FormData();
                data.set("image", file);
                data.set("slug", slug || "artigo");
                return uploadPostImage(data);
              }}
            />
          ) : (
            <div className="admin-visual" aria-hidden="true" />
          )}

          <fieldset className="admin-seo">
            <legend>SEO</legend>
            <p className="seo-lead">
              A palavra-chave só serve para esta revisão. O Google vê o título azul, o endereço e a
              descrição cinza da prévia.
            </p>

            <div className="seo-block">
              <label>
                Palavra-chave principal
                <input
                  name="seo_keyword"
                  value={seoKeyword}
                  onChange={(event) => setSeoKeyword(event.target.value)}
                  placeholder="Ex.: Santa Catarina"
                />
              </label>
            </div>

            <div className="seo-block">
              <h3>Prévia no Google</h3>
              <p className="admin-hint">Edite aqui o que aparece na busca. O título do artigo pode ficar longo.</p>
              <div className="seo-snippet">
                <label className="seo-snippet-field">
                  <span className="sr-only">Título no Google</span>
                  <input
                    className="seo-preview-title"
                    value={snippetTitle}
                    onChange={(event) => setSeoTitle(event.target.value)}
                    maxLength={120}
                    placeholder="Título que aparece no Google"
                  />
                </label>
                <div className="seo-meter-row">
                  <SeoMeter length={snippetTitle.length} min={50} max={60} />
                  <span className={snippetTitle.length > 60 ? "admin-count is-long" : "admin-count"}>
                    {snippetTitle.length}/60
                  </span>
                </div>
                <p className="seo-preview-url">
                  {host} › blog › {slug || "titulo-do-artigo"}
                </p>
                <label className="seo-snippet-field">
                  <span className="sr-only">Descrição no Google</span>
                  <textarea
                    className="seo-preview-desc"
                    rows={3}
                    value={snippetDescription}
                    onChange={(event) => setSeoDescription(event.target.value)}
                    maxLength={320}
                    placeholder="Descrição que aparece no Google"
                  />
                </label>
                <div className="seo-meter-row">
                  <SeoMeter length={snippetDescription.length} min={50} max={160} />
                  <span className={snippetDescription.length > 160 ? "admin-count is-long" : "admin-count"}>
                    {snippetDescription.length}/160
                  </span>
                </div>
              </div>
            </div>

            <div className="seo-block">
              <div className="seo-review-head">
                <h3>Análise</h3>
                <span className={ready === checks.length ? "seo-score is-ok" : "seo-score"}>
                  {ready} de {checks.length} pontos ok
                </span>
              </div>
              <ul className="seo-checks">
                {checks.map((item) => (
                  <li key={item.label} className={item.ok ? "is-ok" : "is-off"}>
                    <span className="seo-status">{item.ok ? "Ok" : "Falta"}</span>
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.help}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </fieldset>
        </div>

        <aside className="admin-side">
          <div className="admin-box">
            <h3>Publicar</h3>
            <Actions
              published={Boolean(post?.published_at)}
              publish={publishAction}
              preview={previewAction}
              draft={draftAction}
            />
            {state.message ? (
              <p className="err" role="status">
                {state.message}
              </p>
            ) : null}
          </div>

          <div className="admin-box">
            <h3>Categoria</h3>
            <label>
              <span className="sr-only">Categoria</span>
              <select name="category" value={category} onChange={(event) => setCategory(event.target.value)} required>
                {names.length === 0 ? <option value="">Crie uma categoria primeiro</option> : null}
                {names.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            {addingCategory ? (
              <div className="admin-category-new">
                <label>
                  Nome da nova categoria
                  <input
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        submitNewCategory();
                      }
                    }}
                    minLength={2}
                    placeholder="Ex.: Arquitetura"
                  />
                </label>
                <div className="admin-toolbar">
                  <button className="admin-secondary" type="button" onClick={submitNewCategory} disabled={catPending}>
                    {catPending ? "Salvando..." : "Salvar categoria"}
                  </button>
                  <button className="admin-tool" type="button" onClick={() => setAddingCategory(false)}>
                    Cancelar
                  </button>
                </div>
                {categoryState.message ? <p className="err">{categoryState.message}</p> : null}
              </div>
            ) : (
              <button className="admin-tool" type="button" onClick={() => setAddingCategory(true)}>
                Nova categoria
              </button>
            )}
          </div>

          <div className="admin-box">
            <h3>Imagem de capa</h3>
            <label>
              <span className="sr-only">Capa</span>
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
              Texto alternativo
              <input name="cover_alt" defaultValue={post?.cover_alt ?? ""} />
            </label>
          </div>

          <div className="admin-box">
            <h3>Resumo</h3>
            <label>
              <span className="sr-only">Resumo</span>
              <textarea name="excerpt" rows={4} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} />
            </label>
            <p className="admin-hint">Aparece na listagem do blog. Se a descrição do Google ficar vazia, usamos este texto.</p>
          </div>

          <div className="admin-box">
            <h3>Publicação</h3>
            <label>
              Data
              <input name="published_at" type="datetime-local" defaultValue={toDatetimeLocal(post?.published_at ?? null)} />
            </label>
            <label className="admin-check">
              <input name="featured" type="checkbox" defaultChecked={post?.featured} />
              Destacar na listagem
            </label>
          </div>
        </aside>
      </div>
    </form>
  );
}
