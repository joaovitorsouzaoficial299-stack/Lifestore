import { esc, brl, fin, waLink } from "./utils.js";

/** Desenho padrão do produto quando não há foto. */
export const art_=(c,cat)=>cat==="Aparelhos"?`<svg viewBox="0 0 80 160"><rect x="4" y="2" width="72" height="156" rx="14" fill="${c}" stroke="#e6c77e" stroke-opacity=".5" stroke-width="2"/><rect x="12" y="10" width="34" height="34" rx="9" fill="#000" fill-opacity=".45"/><circle cx="22" cy="20" r="6" fill="#0a0a0a" stroke="#888"/><circle cx="36" cy="20" r="6" fill="#0a0a0a" stroke="#888"/><circle cx="29" cy="34" r="6" fill="#0a0a0a" stroke="#888"/></svg>`
:cat==="Sons"?`<svg viewBox="0 0 200 90"><rect x="6" y="14" width="188" height="74" rx="30" fill="${c}" stroke="#e6c77e" stroke-opacity=".5" stroke-width="2"/><path d="M50 14c10-14 90-14 100 0" fill="none" stroke="#e6c77e" stroke-width="5"/><circle cx="55" cy="52" r="20" fill="#000"/><circle cx="145" cy="52" r="20" fill="#000"/><circle cx="55" cy="52" r="8" fill="#c19a4b"/><circle cx="145" cy="52" r="8" fill="#c19a4b"/></svg>`
:cat==="Fones"?`<svg viewBox="0 0 120 120"><rect x="12" y="46" width="96" height="62" rx="20" fill="${c}" stroke="#e6c77e" stroke-opacity=".6" stroke-width="2"/><path d="M38 46V22M82 46V22" stroke="#e6c77e" stroke-width="9" stroke-linecap="round"/></svg>`
:`<svg viewBox="0 0 120 120"><rect x="24" y="24" width="72" height="72" rx="18" fill="${c}" stroke="#e6c77e" stroke-opacity=".6" stroke-width="2"/><circle cx="60" cy="60" r="14" fill="none" stroke="#e6c77e" stroke-width="4"/></svg>`;

/** Foto do produto (ou o desenho padrão). */
export const productPic = p => p.img ? `<img src="${p.img}" alt="${esc(p.nome)}" loading="lazy">` : art_(p.cor || "#2b2b2e", p.cat);

/** Card de produto do site público. */
export const card=p=>{const d=p.desc||0,out=p.un<=0;
 const pic=productPic(p);
 const price=p.preco?(d>0?`<p class="price"><s>${brl(p.preco)}</s><b>${brl(fin(p))}</b></p>`:`<p class="price"><b>${brl(p.preco)}</b></p>`):`<p class="price">Consulte o valor</p>`;
 const msg="Olá! Tenho interesse no "+p.nome+(p.det?" ("+p.det+")":"")+(p.preco?" por "+brl(fin(p)):"")+".";
 return `<article class="item"><div class="pic"><span class="tag ${out||p.un<3?"low":""}">${out?"Esgotado":p.un<3?"Últimas unidades":"Em estoque"}</span>${d>0?`<span class="tag off">-${d}%</span>`:""}${pic}</div><div class="info"><h3>${esc(p.nome)}</h3><p class="meta">${esc(p.det)} · ${p.un} un.</p>${price}<a class="btn" href="${waLink(msg)}" target="_blank" rel="noopener">${out?"Avise-me":"Consultar"}</a></div></article>`};
