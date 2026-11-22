"use client";

import { deleteDevelopment } from "@/actions/developments";

export function DeleteDevelopmentButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteDevelopment}
      onSubmit={(event) => {
        if (!confirm(`Excluir “${name}”? Essa ação não pode ser desfeita.`)) {
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
