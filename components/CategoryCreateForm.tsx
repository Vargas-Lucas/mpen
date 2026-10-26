"use client";

import { useActionState } from "react";
import { createCategory, type CategoryState } from "@/actions/categories";

const initial: CategoryState = { ok: false, message: "" };

export function CategoryCreateForm() {
  const [state, action] = useActionState(createCategory, initial);

  return (
    <form className="form admin-form admin-category-form" action={action}>
      <label>
        Nova categoria
        <input name="name" required minLength={2} placeholder="Ex.: Arquitetura" />
      </label>
      <button className="admin-submit" type="submit">
        Criar categoria
      </button>
      {state.message ? (
        <p className="err" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
