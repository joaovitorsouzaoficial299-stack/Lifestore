import { CONFIG } from "../config.js";
import { rootUrl } from "../shared/utils.js";
import { NotConfiguredError } from "./errors.js";
export const normalizeProduct=p=>({id:p.id??null,nome:p.nome??"",cat:p.cat??"Outros",det:p.det??"",un:Number.isFinite(+p.un)?+p.un:0,cor:p.cor||"#2b2b2e",preco:p.preco==null||p.preco===""?null:+p.preco,desc:Number.isFinite(+p.desc)?+p.desc:0,img:p.img||"",ativo:p.ativo!==false});
class StaticProductsRepository{
  readonly=true;
  async list({includeInactive=false}={}){const res=await fetch(rootUrl("data/products.json"),{cache:"no-cache"});if(!res.ok)throw new Error("Não foi possível carregar os produtos ("+res.status+").");const{produtos=[]}=await res.json();const all=produtos.map(normalizeProduct);return includeInactive?all:all.filter(p=>p.ativo);}
  async save(){throw new NotConfiguredError("Edição indisponível: conecte o banco de dados.");}
  async remove(){throw new NotConfiguredError("Exclusão indisponível: conecte o banco de dados.");}
  async uploadImage(){throw new NotConfiguredError("Envio de imagens indisponível: conecte o banco de dados.");}
}
export async function createProductsRepository(){
  if(CONFIG.backend==="supabase"){const m=await import("./supabase.js");return m.createSupabaseProductsRepository(CONFIG.supabase);}
  if(CONFIG.backend==="test"){const m=await import("./test.js");return m.createTestProductsRepository();}
  return new StaticProductsRepository();
}
