import { CONFIG } from "../config.js";
import { NotConfiguredError } from "./errors.js";
class NoAuth { available = false; async getSession(){return null;} async signIn(){throw new NotConfiguredError("Login do administrador ainda não configurado.");} async signOut(){} }
export async function createAuth(){
  if(CONFIG.backend==="supabase"){const m=await import("./supabase.js");return m.createSupabaseAuth(CONFIG.supabase);}
  if(CONFIG.backend==="test"){const m=await import("./test.js");return m.createTestAuth();}
  return new NoAuth();
}
