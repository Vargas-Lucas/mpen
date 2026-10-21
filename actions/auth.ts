"use server";

import { redirect } from "next/navigation";
import { clearEditorSession, createEditorSession, findEditor, verifyPassword } from "@/lib/auth";

export type LoginState = { ok: boolean; message: string };

export async function loginEditor(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { ok: false, message: "Informe o e-mail e a senha." };
  }

  try {
    const editor = await findEditor(email);
    if (!editor || !verifyPassword(password, editor.password_hash)) {
      return { ok: false, message: "E-mail ou senha inválidos." };
    }
    await createEditorSession(editor.email);
  } catch {
    return { ok: false, message: "Não foi possível entrar agora. Tente de novo em instantes." };
  }

  redirect("/admin");
}

export async function logoutEditor() {
  await clearEditorSession();
  redirect("/admin");
}
