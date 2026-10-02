import { CONFIG } from "../config.js";
import { rootUrl } from "../shared/utils.js";
import { NotConfiguredError } from "./errors.js";

/**
 * Formato de um produto (usado pelo site e pelo painel):
 * { id, nome, cat, det, un (estoque), cor, preco (número|null), desc (% 0-90), img (URL|""), ativo (boolean) }
 *
 * CONTRATO que todo adaptador de dados precisa cumprir (todos retornam Promise):
 *   list({ includeInactive })  -> Product[]   (o site público chama sem includeInactive)
 *   save(product)              -> Product     (cria se id == null, senão atualiza)
 *   remove(id)                 -> void
 *   uploadImage(blob, nome)    -> string      (URL pública da imagem)
 */
export const normalizeProduct = p => ({
  id: p.id ?? null,
  nome: p.nome ?? "",
  cat: p.cat ?? "Outros",
  det: p.det ?? "",
  un: Number.isFinite(+p.un) ? +p.un : 0,
  cor: p.cor || "#2b2b2e",
  preco: p.preco == null || p.preco === "" ? null : +p.preco,
  desc: Number.isFinite(+p.desc) ? +p.desc : 0,
  img: p.img || "",
  ativo: p.ativo !== false,
});

/** Adaptador atual: lê data/products.json. Somente leitura. */
class StaticProductsRepository {
  readonly = true;
  async list({ includeInactive = false } = {}) {
    const res = await fetch(rootUrl("data/products.json"), { cache: "no-cache" });
    if (!res.ok) throw new Error("Não foi possível carregar os produtos (" + res.status + ").");
    const { produtos = [] } = await res.json();
    const all = produtos.map(normalizeProduct);
    return includeInactive ? all : all.filter(p => p.ativo);
  }
  async save() { throw new NotConfiguredError("Edição indisponível: conecte o banco de dados (docs/SUPABASE.md)."); }
  async remove() { throw new NotConfiguredError("Exclusão indisponível: conecte o banco de dados (docs/SUPABASE.md)."); }
  async uploadImage() { throw new NotConfiguredError("Envio de imagens indisponível: conecte o banco de dados (docs/SUPABASE.md)."); }
}

export async function createProductsRepository() {
  if (CONFIG.backend === "supabase") {
    const m = await import("./supabase.js");
    return m.createSupabaseProductsRepository(CONFIG.supabase);
  }
  return new StaticProductsRepository();
}
