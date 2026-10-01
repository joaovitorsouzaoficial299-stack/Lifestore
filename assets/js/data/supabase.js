// PONTO DE CONEXÃO COM O SUPABASE (ainda não implementado).
// O passo a passo, o SQL das tabelas e as regras de segurança estão em docs/SUPABASE.md.
//
// Para ativar: implemente as funções abaixo e troque CONFIG.backend para "supabase" em config.js.
import { NotConfiguredError } from "./errors.js";

const PENDENTE = () => new NotConfiguredError("Adaptador do Supabase ainda não implementado (docs/SUPABASE.md).");

/** Produto do site -> linha da tabela `products`. */
export const toRow = p => ({
  nome: p.nome,
  categoria: p.cat,
  detalhe: p.det,
  preco: p.preco,
  desconto: p.desc,
  estoque: p.un,
  cor: p.cor,
  imagem_url: p.img || null,
  ativo: p.ativo !== false,
});

/** Linha da tabela `products` -> produto do site. */
export const fromRow = r => ({
  id: r.id,
  nome: r.nome,
  cat: r.categoria,
  det: r.detalhe || "",
  un: r.estoque,
  cor: r.cor || "#2b2b2e",
  preco: r.preco,
  desc: r.desconto || 0,
  img: r.imagem_url || "",
  ativo: r.ativo,
});

export function createSupabaseProductsRepository(/* cfg */) {
  // TODO: const client = supabase.createClient(cfg.url, cfg.anonKey)
  return {
    async list(/* { includeInactive } */) { throw PENDENTE(); },   // select * from products (+ where ativo = true no site público)
    async save(/* product */) { throw PENDENTE(); },              // insert (id == null) ou update por id
    async remove(/* id */) { throw PENDENTE(); },                 // delete por id
    async uploadImage(/* blob, nome */) { throw PENDENTE(); },    // storage.from(bucket).upload(...) -> URL pública
  };
}

export function createSupabaseAuth(/* cfg */) {
  // TODO: auth.signInWithPassword / getSession / signOut do Supabase Auth
  return {
    available: false, // troque para true quando o login estiver implementado
    async getSession() { return null; },
    async signIn() { throw PENDENTE(); },
    async signOut() {},
  };
}
