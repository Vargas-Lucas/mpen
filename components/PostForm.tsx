"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { savePost, uploadPostImage, type PostState } from "@/actions/posts";
import { articleSeoChecks } from "@/lib/seo-check";
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
  const [body, setBody] = useState(post?.body ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [seoKeyword, setSeoKeyword] = useState(post?.seo_keyword ?? "");
  const [preview, setPreview] = useState(post?.cover || "");
  const [imageMessage, setImageMessage] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slugTouched) setSlug(title ? slugify(title) : "");
  }, [title, slugTouched]);

  const googleTitle = seoTitle.trim() || (title.trim() ? `${title.trim()} — MPEN` : "Título do artigo — MPEN");
  const googleDescription =
    seoDescription.trim() || excerpt.trim() || "O resumo ou a descrição de SEO aparece aqui.";
  const googleUrl = `teste.mpen.com.br › blog › ${slug || "titulo-do-artigo"}`;
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

  function insertMarkup(before: string, after = "", placeholder = "") {
    const field = bodyRef.current;
    const start = field?.selectionStart ?? body.length;
    const end = field?.selectionEnd ?? body.length;
    const selected = body.slice(start, end) || placeholder;
    const next = `${body.slice(0, start)}${before}${selected}${after}${body.slice(end)}`;
    setBody(next);
    requestAnimationFrame(() => {
      field?.focus();
      const cursor = start + before.length + selected.length;
      field?.setSelectionRange(cursor, cursor);
    });
  }

  async function onBodyImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const data = new FormData();
    data.set("image", file);
    data.set("slug", slug || "artigo");
    const result = await uploadPostImage(data);
    if (!result.ok || !result.url) {
      setImageMessage(result.message || "Não foi possível guardar a imagem.");
      return;
    }
    setImageMessage("");
    insertMarkup(`![`, `](${result.url})`, "descreva a imagem");
  }

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

      <div className="admin-body-wrap">
        <span>Texto</span>
        <div className="admin-toolbar">
          <button type="button" className="admin-tool" onClick={() => insertMarkup("## ", "", "Subtítulo")}>
            Subtítulo
          </button>
          <button type="button" className="admin-tool" onClick={() => insertMarkup("[", "](https://)", "texto do link")}>
            Link
          </button>
          <button type="button" className="admin-tool" onClick={() => imageRef.current?.click()}>
            Imagem
          </button>
        </div>
        <input
          ref={imageRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={onBodyImage}
        />
        <textarea
          ref={bodyRef}
          className="admin-body"
          name="body"
          rows={14}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        <span className="admin-hint">Use os botões para subtítulo, link e imagem no meio do texto.</span>
        {imageMessage ? <p className="err">{imageMessage}</p> : null}
      </div>

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
        Texto alternativo da capa
        <input name="cover_alt" defaultValue={post?.cover_alt ?? ""} />
        <span className="admin-hint">Descreve a foto para busca e acessibilidade.</span>
      </label>

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
        <legend>Como o Google mostra este artigo</legend>
        <p className="seo-lead">
          Esta área é só uma revisão para você e a Vitória. Nada aqui impede publicar. Se o título e a
          descrição do Google ficarem vazios, o site usa o título e o resumo do artigo.
        </p>

        <div className="seo-block">
          <h3>Prévia na busca</h3>
          <p className="admin-hint">É assim que o resultado tende a aparecer quando alguém pesquisa no Google.</p>
          <div className="seo-preview" aria-label="Prévia na busca do Google">
            <p className="seo-preview-url">{googleUrl}</p>
            <p className="seo-preview-title">
              {googleTitle.length > 60 ? `${googleTitle.slice(0, 57)}...` : googleTitle}
            </p>
            <p className="seo-preview-desc">
              {googleDescription.length > 160 ? `${googleDescription.slice(0, 157)}...` : googleDescription}
            </p>
          </div>
        </div>

        <div className="seo-block">
          <h3>Palavra-chave</h3>
          <p className="admin-hint">
            O tema principal do artigo, em 1 ou 2 palavras. Exemplos: Sul da Ilha, Florianópolis, Sunset Village.
          </p>
          <label>
            Palavra-chave principal
            <input name="seo_keyword" value={seoKeyword} onChange={(event) => setSeoKeyword(event.target.value)} />
          </label>
        </div>

        <div className="seo-block">
          <div className="seo-review-head">
            <h3>Revisão</h3>
            <span className={ready === checks.length ? "seo-score is-ok" : "seo-score"}>
              {ready} de {checks.length} pontos ok
            </span>
          </div>
          <p className="admin-hint">O Google não vê esta lista. Ela só mostra se a palavra-chave e os tamanhos estão alinhados.</p>
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

        <div className="seo-block">
          <h3>Título e descrição</h3>
          <p className="admin-hint">
            O título azul e o texto cinza da prévia vêm daqui. Deixe vazios se o título e o resumo do artigo já
            estiverem bons.
          </p>
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
        </div>
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
