/** Efeitos ligados à rolagem: revelar blocos, girar o iPhone e animar os cards de serviços. */
export function initScrollEffects() {
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));
return { io, spin, svScroll };
}
