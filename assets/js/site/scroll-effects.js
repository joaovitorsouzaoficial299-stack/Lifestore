/** Efeitos ligados à rolagem: revelar blocos, girar o iPhone e animar os cards de serviços. */
export function initScrollEffects() {
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));
// Três iPhones avançam/recuam suavemente conforme a rolagem do hero.
const phones=document.querySelectorAll(".scroll-phone");
function spin(){
 const h=document.querySelector(".hero"); if(!h)return;
 const r=Math.max(h.offsetHeight*1.8-90,1);
 const p=Math.min(Math.max(scrollY/r,0),1);
 phones.forEach((phone,i)=>{
   const mobile = innerWidth <= 820;
   const verySmall = innerWidth <= 480;
   const spread = verySmall ? Math.min(72, innerWidth * .18) : mobile ? Math.min(105, innerWidth * .22) : 120;
   const side=i===0?-1:i===2?1:0;
   const depth=i===1?0:-1;
   const x=(side*(spread-(spread*.78)*p));
   const y=(i===1?-4*p:8-8*p);
   const z=depth*(mobile?45:90-(75*p));
   const rot=side*(mobile?10:18-16*p);
   const scale=i===1?(mobile ? .96+.08*p : 1+.10*p):(mobile ? .78+.12*p : .88+.12*p);
   phone.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateY(${rot}deg) scale(${scale})`;
   phone.style.opacity=.78+.22*p;
 });
}
addEventListener("scroll",spin,{passive:true});addEventListener("resize",spin);spin();
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
