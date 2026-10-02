/** Páginas do site (Início e Loja) no mesmo documento, por #hash. */
export function initRouter({ io, spin, svScroll }) {
let view="home";
function route(){
 const h=location.hash.slice(1);
 if(h==="loja")view="loja";else if(h!=="contato")view="home";
 document.getElementById("top").hidden=view!=="home";
 document.getElementById("view-loja").hidden=view!=="loja";
 document.querySelectorAll("nav a").forEach(a=>a.style.color=(a.getAttribute("href")==="#loja"&&view==="loja")?"var(--gold2)":"");
 const t=h&&!["top","loja"].includes(h)?document.getElementById(h):null;
 if(t)t.scrollIntoView();else scrollTo({top:0,behavior:"instant"});
 document.querySelectorAll(".rv:not(.on)").forEach(el=>io.observe(el));spin();svScroll();
}
addEventListener("hashchange",route);route();
}
