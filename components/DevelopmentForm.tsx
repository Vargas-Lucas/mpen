"use client";

import { useActionState, useState } from "react";
import { saveDevelopment, type DevelopmentState } from "@/actions/developments";
import { uploadPostImage } from "@/actions/posts";
import type { DevelopmentFormValues } from "@/lib/development-content";
import { shrinkImage } from "@/lib/shrink-image";
import { slugify } from "@/lib/slug";

const initial: DevelopmentState = { ok: false, message: "" };

const STATUSES = [
  ["lancamento", "Lançamento"],
  ["construcao", "Em construção"],
  ["entregue", "Entregue"],
] as const;

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === "left" ? "M14.5 5.5 8 12l6.5 6.5" : "M9.5 5.5 16 12l-6.5 6.5"} />
    </svg>
  );
}

export function DevelopmentForm({ values, saved = false }: { values: DevelopmentFormValues; saved?: boolean }) {
  const [state, action, pending] = useActionState(saveDevelopment, initial);
  const [name, setName] = useState(values.name);
  const [slug, setSlug] = useState(values.slug);
  const [slugEdited, setSlugEdited] = useState(values.id > 0);
  const [cover, setCover] = useState(values.cover);
  const [gallery, setGallery] = useState(values.gallery);
  const [website, setWebsite] = useState(values.website);
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const locked = values.id > 0;
  const images = [...new Set([cover, ...gallery].filter(Boolean))];
  const currentIndex = Math.min(index, Math.max(images.length - 1, 0));
  const current = images[currentIndex] || "";

  async function upload(file: File) {
    const next = await shrinkImage(file);
    const data = new FormData();
    data.set("image", next);
    data.set("slug", slug || slugify(name || "empreendimento"));
    return uploadPostImage(data);
  }

  async function onPhotos(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setNote("");
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) {
        const result = await upload(file);
        if (!result.ok || !result.url) {
          setNote(result.message || "Não foi possível guardar uma das fotos.");
          break;
        }
        added.push(result.url);
      }
      if (!added.length) return;
      if (!cover) {
        setCover(added[0]);
        setGallery((items) => [...items, ...added.slice(1).filter((url) => !items.includes(url))]);
      } else {
        setGallery((items) => [...items, ...added.filter((url) => url !== cover && !items.includes(url))]);
      }
      setIndex(images.length);
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Não foi possível guardar a foto.");
    } finally {
      setBusy(false);
    }
  }

  function removeCurrent() {
    if (!current) return;
    if (current === cover) setCover("");
    setGallery((items) => items.filter((item) => item !== current));
    setIndex(0);
  }

  function makeCover() {
    if (!current || current === cover) return;
    setGallery((items) => [cover, ...items.filter((item) => item !== current)].filter(Boolean));
    setCover(current);
    setIndex(0);
  }

  return (
    <form className="studio" action={action}>
      <input type="hidden" name="id" value={values.id || ""} />
      <input type="hidden" name="cover" value={cover} />
      {gallery.map((url) => (
        <input key={url} type="hidden" name="gallery" value={url} />
      ))}

      <section className="page-hero is-compact">
        <div className="container">
          <a className="back-link" href="/admin/empreendimentos">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3.5 5.5 8 10 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar
          </a>
          <input
            className="studio-title"
            name="name"
            required
            minLength={2}
            value={name}
            placeholder="Nome do empreendimento"
            onChange={(event) => {
              const next = event.target.value;
              setName(next);
              if (!slugEdited) setSlug(next.trim() ? slugify(next) : "");
            }}
          />
          <textarea className="studio-lede" name="summary" rows={2} defaultValue={values.summary} placeholder="Resumo que aparece abaixo do nome" />
          <label className="studio-slug">
            /empreendimentos/
            <input
              name="slug"
              value={locked ? values.slug : slug}
              placeholder="endereco"
              readOnly={locked}
              aria-label="Endereço"
              onChange={(event) => {
                setSlugEdited(true);
                const next = event.target.value.trim();
                setSlug(next ? slugify(next) : "");
              }}
            />
          </label>
        </div>
      </section>

      <section className="project">
        <div className="container project-layout">
          <div className="project-main">
            <div className="viewer">
              {current ? (
                <div className="viewer-stage">
                  <div className="viewer-open">
                    <img src={current} alt="" />
                    {current === cover ? <span>Capa</span> : null}
                  </div>
                  {images.length > 1 ? (
                    <>
                      <button className="viewer-nav prev" type="button" aria-label="Foto anterior" onClick={() => setIndex((currentIndex - 1 + images.length) % images.length)}>
                        <Chevron direction="left" />
                      </button>
                      <button className="viewer-nav next" type="button" aria-label="Próxima foto" onClick={() => setIndex((currentIndex + 1) % images.length)}>
                        <Chevron direction="right" />
                      </button>
                    </>
                  ) : null}
                </div>
              ) : (
                <label className="viewer-open studio-drop">
                  {busy ? "Enviando…" : "Adicionar fotos"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    disabled={busy || pending}
                    onChange={(event) => {
                      const input = event.target;
                      const files = input.files;
                      input.value = "";
                      void onPhotos(files);
                    }}
                  />
                </label>
              )}
              {current ? (
                <>
                  <p className="viewer-caption">
                    <span>
                      {currentIndex + 1} / {images.length}
                    </span>
                    {current === cover ? "Esta foto é a capa." : "Esta foto entra na galeria."}
                  </p>
                  <div className="viewer-thumbs">
                    {images.map((src, photo) => (
                      <button
                        key={src}
                        type="button"
                        className={photo === currentIndex ? "is-active" : undefined}
                        aria-label={`Foto ${photo + 1}`}
                        onClick={() => setIndex(photo)}
                      >
                        <img src={src} alt="" />
                      </button>
                    ))}
                    <label className="studio-add">
                      {busy ? "…" : "+"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={busy || pending}
                        onChange={(event) => {
                          const input = event.target;
                          const files = input.files;
                          input.value = "";
                          void onPhotos(files);
                        }}
                      />
                    </label>
                  </div>
                  <div className="studio-photo-actions">
                    <label>
                      Adicionar fotos
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={busy || pending}
                        onChange={(event) => {
                          const input = event.target;
                          const files = input.files;
                          input.value = "";
                          void onPhotos(files);
                        }}
                      />
                    </label>
                    {current !== cover ? (
                      <button type="button" onClick={makeCover}>
                        Usar como capa
                      </button>
                    ) : null}
                    <button type="button" onClick={removeCurrent}>
                      Tirar foto
                    </button>
                  </div>
                </>
              ) : null}
            </div>

            <div className="project-facts">
              <div>
                <p className="fact-kicker">Situação</p>
                <select name="status" defaultValue={values.status}>
                  {STATUSES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="fact-kicker">Cidade</p>
                <input name="city" defaultValue={values.city} placeholder="Florianópolis" />
              </div>
              <div className="studio-wide">
                <p className="fact-kicker">Região</p>
                <textarea name="neighborhood" rows={2} defaultValue={values.neighborhood} />
              </div>
              <div>
                <p className="fact-kicker">Entrega</p>
                <input name="delivery" defaultValue={values.delivery} />
              </div>
              <div>
                <p className="fact-kicker">Tipologia</p>
                <input name="typology" defaultValue={values.typology} />
              </div>
              <div>
                <p className="fact-kicker">Metragem</p>
                <input name="area" defaultValue={values.area} />
              </div>
            </div>

            <label className="studio-website">
              <span className="fact-kicker">Site externo</span>
              <input name="website" type="url" value={website} placeholder="https://" onChange={(event) => setWebsite(event.target.value)} />
            </label>
            {website.startsWith("http") ? (
              <a className="project-site" href={website} target="_blank" rel="noreferrer">
                Conheça mais
              </a>
            ) : null}

            <div className="project-story">
              <label className="studio-description">
                Descrição
                <textarea
                  name="description"
                  rows={8}
                  defaultValue={[values.story.pt.title, values.story.pt.body].filter((part) => part.trim()).join("\n\n")}
                  placeholder="Descrição do empreendimento. Separe os parágrafos com uma linha em branco."
                />
              </label>
              <p className="studio-translate-note">Este texto é traduzido sozinho quando o idioma da página muda.</p>
              <label className="studio-note">
                <input name="story_note" type="checkbox" defaultChecked={values.story.note} />
                Mostrar a linha “construído com”
              </label>
            </div>
          </div>

          <aside className="project-card">
            <p className="kicker">Painel</p>
            <h2>Salvar</h2>
            <p>As fotos, a ficha e o texto entram na página do empreendimento.</p>
            <label className="studio-note">
              <input name="featured" type="checkbox" defaultChecked={values.featured} />
              Destaque na home
            </label>
            {saved ? <p className="ok">Empreendimento salvo.</p> : null}
            {note ? <p className="err">{note}</p> : null}
            {state.message ? <p className="err">{state.message}</p> : null}
            <button className="admin-submit" type="submit" disabled={pending || busy}>
              {pending ? "Salvando…" : "Salvar empreendimento"}
            </button>
          </aside>
        </div>
      </section>
    </form>
  );
}
