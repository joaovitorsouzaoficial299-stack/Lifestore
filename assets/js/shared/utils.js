import { CONFIG } from "../config.js";

export const CATS = ["Sons", "Aparelhos", "Acessórios", "Fones", "Outros"];

export const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const brl=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
export const fin=p=>p.preco*(1-(p.desc||0)/100);

/** Link do WhatsApp da loja com mensagem pronta. */
export const waLink = t => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;

/** URL de um arquivo a partir da raiz do site (funciona em / e em /admin). */
export const rootUrl = p => new URL("../../../" + p, import.meta.url).href;
