import { CATS } from "../shared/utils.js";
import { card } from "../shared/product-card.js";

/** Loja por categorias (gaveta com rolagem lateral). */
export function initStore(P) {
const catsEl=document.getElementById("cats"),tabs=document.getElementById("tabs");
let cur="Tudo";
function render(){
 catsEl.innerHTML=CATS.filter(c=>cur==="Tudo"||c===cur).map(c=>{const l=P.filter(p=>p.cat===c);if(!l.length)return"";
  return `<div class="cat"><div class="cathead"><h3>${c}</h3><div class="arrows"><button aria-label="Anterior" data-dir="-1">‹</button><button aria-label="Próximo" data-dir="1">›</button></div></div>${l.length?`<div class="drawer" tabindex="0" aria-label="${c}">${l.map(card).join("")}</div>`:`<p class="sub">Nenhum produto nesta categoria.</p>`}</div>`}).join("");
}
["Tudo",...CATS].forEach(t=>{const b=document.createElement("button");b.className="tab";b.textContent=t;b.setAttribute("aria-pressed",t===cur);b.onclick=()=>{cur=t;tabs.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));render()};tabs.appendChild(b)});
render();
catsEl.addEventListener("click",e=>{
 const b=e.target.closest("[data-dir]");if(b){const d=b.closest(".cat").querySelector(".drawer");if(d)d.scrollBy({left:b.dataset.dir*d.clientWidth*.8,behavior:"smooth"});return}
});
let dr=null,x0=0,s0=0;
catsEl.addEventListener("pointerdown",e=>{const d=e.target.closest(".drawer");if(d&&e.pointerType==="mouse"&&!e.target.closest("a,button")){dr=d;x0=e.clientX;s0=d.scrollLeft;d.style.scrollSnapType="none"}});
addEventListener("pointerup",()=>{if(dr){dr.style.scrollSnapType="";dr=null}});
addEventListener("pointermove",e=>{if(dr)dr.scrollLeft=s0-(e.clientX-x0)});
}

export function showLoadError() {
  const el = document.getElementById("cats");
  if (el) el.innerHTML = '<p class="sub">Não foi possível carregar os produtos agora. Tente novamente em instantes.</p>';
}
