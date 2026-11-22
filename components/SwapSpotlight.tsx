"use client";

import { useState } from "react";
import { swapSpotlight } from "@/actions/developments";

export function SwapSpotlight({
  id,
  options,
}: {
  id: number;
  options: { id: number; name: string }[];
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button className="admin-swap-open" type="button" onClick={() => setOpen(true)}>
        Trocar destaque
      </button>
    );
  }

  return (
    <form className="admin-swap" action={swapSpotlight}>
      <input name="out" type="hidden" value={id} />
      <label>
        <span className="sr-only">Escolha qual entra no lugar</span>
        <select name="in" defaultValue="" required>
          <option value="" disabled>
            Escolha qual entra no lugar
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Colocar</button>
      <button type="button" onClick={() => setOpen(false)}>
        Cancelar
      </button>
    </form>
  );
}
