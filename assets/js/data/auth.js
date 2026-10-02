import { CONFIG } from "../config.js";
import { NotConfiguredError } from "./errors.js";

/**
 * CONTRATO de autenticação do administrador:
 *   available            -> boolean (false = não há login configurado)
 *   getSession()         -> Promise<sessão | null>
 *   signIn(email, senha) -> Promise<sessão>
 *   signOut()            -> Promise<void>
 *
 * Hoje não existe login configurado, então o painel /admin fica trancado.
 * Não há senha nem usuário no código.
 */
class NoAuth {
  available = false;
  async getSession() { return null; }
  async signIn() { throw new NotConfiguredError("Login do administrador ainda não configurado."); }
  async signOut() {}
}

export async function createAuth() {
  if (CONFIG.backend === "supabase") {
    const m = await import("./supabase.js");
    return m.createSupabaseAuth(CONFIG.supabase);
  }
  return new NoAuth();
}
