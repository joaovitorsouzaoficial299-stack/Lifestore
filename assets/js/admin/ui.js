// Componentes simples do painel: confirmação, aviso e redução de imagem.

export function ask(text, okLabel) {
  return new Promise(res => {
    const m = document.createElement("div"); m.className = "modal";
    m.innerHTML = '<div class="mbox" role="dialog" aria-modal="true"><h3>Confirmar</h3><p class="sub" style="margin:8px 0 18px"></p><div class="mrow"><button type="button" class="btn ghost" data-n>Cancelar</button><button type="button" class="btn" data-y></button></div></div>';
    m.querySelector(".sub").textContent = text; m.querySelector("[data-y]").textContent = okLabel || "Confirmar";
    const k = e => { if (e.key === "Escape") done(false); };
    const done = v => { m.remove(); removeEventListener("keydown", k); res(v); };
    addEventListener("keydown", k);
    m.querySelector("[data-n]").onclick = () => done(false); m.querySelector("[data-y]").onclick = () => done(true);
    m.addEventListener("pointerdown", e => { if (e.target === m) done(false); });
    document.body.appendChild(m); m.querySelector("[data-y]").focus();
  });
}

export function toast(t) {
  const n = document.createElement("div"); n.className = "toast"; n.textContent = t; n.setAttribute("role", "status");
  document.body.appendChild(n); setTimeout(() => n.remove(), 4200);
}

/** Reduz a imagem (máx. 640 px) e devolve { blob, previewUrl } em JPEG. */
export function fileToJpeg(file) {
  return new Promise((res, rej) => {
    const r = new FileReader(); r.onerror = rej;
    r.onload = () => {
      const im = new Image(); im.onerror = rej;
      im.onload = () => {
        const k = Math.min(1, 640 / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        const x = c.getContext("2d"); x.fillStyle = "#12110e"; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
        c.toBlob(b => b ? res({ blob: b, previewUrl: c.toDataURL("image/jpeg", .8) }) : rej(new Error("falha ao converter")), "image/jpeg", .8);
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
}
