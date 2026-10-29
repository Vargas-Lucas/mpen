"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor, type NodeViewProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { jsonToMarkdown, markdownToHtml, normalizeHref } from "@/lib/editor-markdown";

const ArticleImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ArticleImageView);
  },
});

function ArticleImageView({ node, deleteNode }: NodeViewProps) {
  const src = String(node.attrs.src || "");
  const alt = String(node.attrs.alt || "");
  return (
    <NodeViewWrapper className="admin-editor-image">
      <img src={src} alt={alt} />
      <button type="button" className="admin-tool admin-tool-danger" contentEditable={false} onClick={deleteNode}>
        Excluir imagem
      </button>
    </NodeViewWrapper>
  );
}

type Props = {
  value: string;
  onChange: (markdown: string) => void;
  uploadImage: (file: File) => Promise<{ ok: boolean; url?: string; message?: string }>;
};

export function ArticleEditor({ value, onChange, uploadImage }: Props) {
  const imageRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [imageMessage, setImageMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        listKeymap: false,
        strike: false,
        underline: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        },
      }),
      ArticleImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({
        placeholder: "Escreva o artigo aqui. O texto já aparece como no site.",
      }),
    ],
    content: markdownToHtml(value),
    editorProps: {
      attributes: { class: "admin-visual-area" },
    },
    onUpdate: ({ editor: current }) => {
      onChange(jsonToMarkdown(current.getJSON()));
    },
  });

  function applyLink() {
    if (!editor) return;
    const href = normalizeHref(linkUrl);
    if (!href) return;
    if (editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: href.replace(/^https?:\/\//, ""),
          marks: [{ type: "link", attrs: { href } }],
        })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkOpen(false);
    setLinkUrl("https://");
  }

  function onLinkClick() {
    if (!editor) return;
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      setLinkOpen(false);
      return;
    }
    const previous = editor.getAttributes("link").href as string | undefined;
    setLinkUrl(previous || "https://");
    setLinkOpen(true);
  }

  async function onPickImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editor) return;
    setUploading(true);
    setImageMessage("");
    const result = await uploadImage(file);
    setUploading(false);
    if (!result.ok || !result.url) {
      setImageMessage(result.message || "Não foi possível guardar a imagem.");
      return;
    }
    const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    editor.chain().focus().setImage({ src: result.url, alt }).run();
  }

  if (!ready || !editor) {
    return <div className="admin-visual" aria-hidden="true" />;
  }

  return (
    <div className="admin-body-wrap">
      <div className="admin-toolbar" role="toolbar" aria-label="Formatação do texto">
        <button
          type="button"
          className={editor.isActive("bold") ? "admin-tool admin-tool-bold is-on" : "admin-tool admin-tool-bold"}
          aria-pressed={editor.isActive("bold")}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Negrito
        </button>
        <button
          type="button"
          className={editor.isActive("italic") ? "admin-tool admin-tool-italic is-on" : "admin-tool admin-tool-italic"}
          aria-pressed={editor.isActive("italic")}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Itálico
        </button>
        <button
          type="button"
          className={editor.isActive("heading", { level: 2 }) ? "admin-tool is-on" : "admin-tool"}
          aria-pressed={editor.isActive("heading", { level: 2 })}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          Subtítulo
        </button>
        <button
          type="button"
          className={editor.isActive("link") ? "admin-tool is-on" : "admin-tool"}
          aria-pressed={editor.isActive("link")}
          onMouseDown={(event) => event.preventDefault()}
          onClick={onLinkClick}
        >
          {editor.isActive("link") ? "Tirar link" : "Link"}
        </button>
        <button
          type="button"
          className="admin-tool"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => imageRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Enviando..." : "Imagem"}
        </button>
        {editor.isActive("image") ? (
          <button
            type="button"
            className="admin-tool admin-tool-danger"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().deleteSelection().run()}
          >
            Excluir imagem
          </button>
        ) : null}
      </div>

      {linkOpen ? (
        <div className="admin-link-panel">
          <label>
            Endereço do link
            <input
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://www.google.com"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyLink();
                }
              }}
            />
          </label>
          <p className="admin-hint">Selecione o texto antes, ou o endereço vira o próprio link.</p>
          <div className="admin-toolbar">
            <button className="admin-tool is-on" type="button" onClick={applyLink}>
              Aplicar link
            </button>
            <button className="admin-tool" type="button" onClick={() => setLinkOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      <input ref={imageRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onPickImage} />
      <div className="admin-visual">
        <EditorContent editor={editor} />
      </div>
      <p className="admin-hint">
        Selecione um trecho e clique em Negrito, Itálico ou Link. Para foto, clique em Imagem. Clique na foto e em Excluir imagem para tirá-la do texto.
      </p>
      {imageMessage ? <p className="err">{imageMessage}</p> : null}
    </div>
  );
}
