import { rootUrl } from "../shared/utils.js";

// iPhone 17 Pro Max em 3D real (three.js via CDN, carregado no index.html).
// Se o 3D não carregar, o iPhone simples em CSS continua aparecendo.
export const gl = { ready: false, lastP: 0, draw() {}, onReady() {} };

export async function initIphone3D() {
try{
 if(!window.THREE)return;
 const M=await (await fetch(rootUrl("assets/models/iphone-17-pro-max.json"))).json();
 const T=THREE,cv=document.getElementById("gl");
 const u8=s=>{const b=atob(s),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a};
 const q=new Int16Array(u8(M.pos).buffer),pos=new Float32Array(q.length);
 for(let i=0;i<q.length;i++){const a=i%3;pos[i]=M.min[a]+(q[i]+32768)/65535*(M.max[a]-M.min[a])}
 const geo=new T.BufferGeometry();
 geo.setAttribute("position",new T.BufferAttribute(pos,3));
 geo.setAttribute("normal",new T.BufferAttribute(new Int8Array(u8(M.nor).buffer),3,true));
 geo.setAttribute("uv",new T.BufferAttribute(new Uint16Array(u8(M.uv).buffer),2,true));
 geo.setIndex(new T.BufferAttribute(M.i32?new Uint32Array(u8(M.idx).buffer):new Uint16Array(u8(M.idx).buffer),1));
 M.groups.forEach(g=>geo.addGroup(g[0],g[1],g[2]));
 const ren=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
 let w=Math.min(340,innerWidth*.82),h=Math.round(w*1.66);
 ren.setPixelRatio(Math.min(devicePixelRatio||1,2));ren.setSize(w,h);
 const scene=new T.Scene(),cam=new T.PerspectiveCamera(28,w/h,.1,20);cam.position.set(0,0,3.9);
 // reflexos: cenário de luz procedural (softboxes)
 const env=new T.Scene();
 env.add(new T.Mesh(new T.BoxGeometry(12,12,12),new T.MeshBasicMaterial({color:0x1a140c,side:T.BackSide})));
 const box=(x,y,z,sx,sy,sz,c)=>{const m=new T.Mesh(new T.BoxGeometry(sx,sy,sz),new T.MeshBasicMaterial({color:c}));m.position.set(x,y,z);env.add(m)};
 box(0,5.5,0,8,.2,8,new T.Color(5,5,5));box(-5.5,0,2,.2,8,3,new T.Color(4,4,4));box(5.5,0,-1,.2,8,3,new T.Color(5,3.6,1.8));box(0,0,5.5,6,3,.2,new T.Color(2.5,2.5,2.5));box(0,-5.5,0,8,.2,8,new T.Color(1.2,.8,.4));
 scene.environment=new T.PMREMGenerator(ren).fromScene(env,.03).texture;
 const dl=new T.DirectionalLight(0xffffff,.8);dl.position.set(2,3,4);scene.add(dl);
 const rim=new T.DirectionalLight(0xe6c77e,.7);rim.position.set(-3,1,-3);scene.add(rim);
 scene.add(new T.AmbientLight(0xffffff,.35));
 // texturas
 const tl=new T.TextureLoader();let pend=2;
 const logoM=/url\("?([^")]+)"?\)/.exec(getComputedStyle(document.querySelector(".mark")).backgroundImage||"");
 if(logoM)pend++;
 const fin=()=>{if(--pend>0)return;cv.hidden=false;document.getElementById("ph3d").style.display="none";gl.ready=true;gl.onReady()};
 const texS=tl.load(M.texScreen,fin,undefined,fin),texC=tl.load(M.texCam,fin,undefined,fin);
 texS.anisotropy=4;
 const S=(c,m,r)=>new T.MeshStandardMaterial({color:c,metalness:m,roughness:r,side:T.DoubleSide});
 const mats=[];for(let i=0;i<19;i++)mats.push(S(0x222222,.5,.5));
 mats[0]=S(0xd0320f,.55,.32);mats[1]=S(0x9c2006,.85,.28);
 mats[3]=new T.MeshBasicMaterial({map:texS,side:T.DoubleSide});
 mats[4]=S(0x060606,.2,.4);mats[5]=S(0x6a6a6a,.9,.35);
 mats[6]=S(0x07070a,.6,.06);                       // vidro escuro: ilha dinâmica e lentes
 mats[7]=S(0xe94413,.3,.22);mats[8]=S(0xb98a1d,.9,.3);
 mats[9]=new T.MeshBasicMaterial({map:texC,side:T.DoubleSide});
 mats[10]=S(0xd23611,.35,.25);mats[12]=S(0x2a2a2a,.6,.4);mats[18]=S(0x0b0b0e,.9,.08);
 const grp=new T.Group();grp.add(new T.Mesh(geo,mats));
 if(logoM){ // logo da loja no centro das costas, sobre o vidro laranja
  const lt=tl.load(logoM[1],fin,undefined,fin);
  const dec=new T.Mesh(new T.CircleGeometry(.17,64),new T.MeshBasicMaterial({map:lt}));
  dec.position.set(0,-.235,-.0475);dec.rotation.y=Math.PI;grp.add(dec);
 }
 scene.add(grp);
 gl.draw=p=>{grp.rotation.y=-.45+p*Math.PI*2;ren.render(scene,cam)};
 addEventListener("resize",()=>{w=Math.min(340,innerWidth*.82);h=Math.round(w*1.66);ren.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();if(gl.ready)gl.draw(gl.lastP)});
}catch(e){console.warn("3D indisponível, usando versão simples",e)}
}
