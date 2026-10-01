import { gl } from "./iphone3d.js";

/** Efeitos ligados à rolagem: revelar blocos, girar o iPhone e animar os cards de serviços. */
export function initScrollEffects() {
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));
// iPhone gira 360° enquanto o início rola para cima
const ph=document.getElementById("ph3d");
function spin(){const h=document.querySelector(".hero");const r=Math.max(h.offsetHeight-90,1);const p=Math.min(Math.max(scrollY/r,0),1);ph.style.transform=`rotateX(-6deg) rotateY(${-25+p*360}deg)`;gl.lastP=p;if(gl.ready)gl.draw(p)}
addEventListener("scroll",spin,{passive:true});addEventListener("resize",spin);
// Assistência técnica: os cards se movem conforme a rolagem
const still=matchMedia("(prefers-reduced-motion:reduce)").matches;
function svScroll(){
 const sec=document.getElementById("servicos");if(!sec||sec.offsetParent===null)return;
 const vh=innerHeight,r=sec.getBoundingClientRect();
 document.getElementById("sprog").style.width=Math.min(Math.max((vh*.85-r.top)/(r.height*.85),0),1)*100+"%";
 document.querySelectorAll("#serv .frame").forEach((c,i)=>{
  const t=c.getBoundingClientRect().top,p=still?1:Math.min(Math.max((vh*.95-t)/(vh*.45),0),1);
  c.style.opacity=p;c.style.transform=`translate3d(${(i%2?1:-1)*(1-p)*40}px,${(1-p)*60}px,0) scale(${.92+.08*p})`;
 });
}
addEventListener("scroll",svScroll,{passive:true});addEventListener("resize",svScroll);
return { io, spin, svScroll };
}
