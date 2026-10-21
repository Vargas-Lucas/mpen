"use client";

import { deletePost } from "@/actions/posts";

export function DeletePostButton({ id, title }: { id: number; title: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        if (!confirm(`Excluir “${title}”? Essa ação não pode ser desfeita.`)) {
          event.preventDefault();
        }
      }}
    >
      <input name="id" type="hidden" value={id} />
      <button className="admin-danger" type="submit">
        Excluir
      </button>
    </form>
  );
}
