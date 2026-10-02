import { waLink } from "../shared/utils.js";

/** Orçamento rápido: abre o WhatsApp da loja com a mensagem pronta. */
export function initOrcamento() {
["Tela quebrada","Bateria fraca","Não liga","Molhou","Câmera","Não carrega"].forEach(t=>{const b=document.createElement("button");b.type="button";b.className="tab";b.textContent=t;b.onclick=()=>{const f=document.querySelector("#orc [name=problema]");f.value=f.value?f.value.replace(/[ ,]+$/,"")+", "+t.toLowerCase():t};document.getElementById("chips").appendChild(b)});
(function(){const f=document.getElementById("orc"),a=document.getElementById("orcsend"),v=n=>f.elements[n].value.trim();
 const msg=()=>`Olá! Quero um orçamento.\n\nMarca: ${v("marca")}\nModelo: ${v("modelo")}\nProblema: ${v("problema")}`;
 const sync=()=>{a.href=waLink(msg())};
 f.addEventListener("input",sync);sync();
 a.addEventListener("click",e=>{if(!f.checkValidity()){e.preventDefault();f.reportValidity();return}sync()});
 f.addEventListener("submit",e=>{e.preventDefault();if(f.checkValidity()){sync();a.click()}else f.reportValidity()});
})();
}
