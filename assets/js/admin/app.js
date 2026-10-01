import { CATS, esc, brl, fin } from "../shared/utils.js";
import { productPic } from "../shared/product-card.js";
import { NotConfiguredError } from "../data/errors.js";
import { ask, toast, fileToJpeg } from "./ui.js";

/**
 * Painel administrativo. Não conhece o banco: usa apenas
 * `repo` (contrato em data/products-repository.js) e `auth` (contrato em data/auth.js).
 */
export async function initAdminApp({ repo, auth }) {
  const $ = id => document.getElementById(id);
  const gate = $("gate"), panel = $("panel"), logout = $("logout"), list = $("alist");
  let products = [];

  const errMsg = e => e instanceof NotConfiguredError ? e.message : (e && e.message) || "Algo deu errado. Tente de novo.";

  // ---------- acesso ----------
  function showGate() {
    panel.hidden = true; gate.hidden = false; logout.hidden = true;
    $("notconf").hidden = auth.available; $("login").hidden = !auth.available;
  }
  async function showPanel() { gate.hidden = true; panel.hidden = false; logout.hidden = false; await reload(); }

  $("login").addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target, btn = f.querySelector("button");
    btn.disabled = true;
    try { await auth.signIn(f.email.value.trim(), f.senha.value); f.reset(); await showPanel(); }
    catch (err) { toast(err instanceof NotConfiguredError ? err.message : "E-mail ou senha inválidos."); }
    finally { btn.disabled = false; }
  });
  logout.addEventListener("click", async e => { e.preventDefault(); try { await auth.signOut(); } catch (_) {} products = []; list.innerHTML = ""; showGate(); });

  // ---------- lista ----------
  $("fcat").insertAdjacentHTML("beforeend", CATS.map(c => `<option>${c}</option>`).join(""));
  async function reload() {
    try { products = await repo.list({ includeInactive: true }); render(); }
    catch (e) { toast(errMsg(e)); }
  }
  function render() {
    const q = $("q").value.trim().toLowerCase(), cat = $("fcat").value, st = $("fst").value;
    const l = products.filter(p => (!q || (p.nome + " " + p.det).toLowerCase().includes(q)) && (!cat || p.cat === cat) && (!st || (st === "1") === p.ativo));
    list.innerHTML = l.length ? l.map(adminCard).join("") : '<p class="aempty">Nenhum produto encontrado.</p>';
  }
  const adminCard = p => {
    const d = p.desc || 0, out = p.un <= 0;
    const price = p.preco ? (d > 0 ? `<p class="price"><s>${brl(p.preco)}</s><b>${brl(fin(p))}</b></p>` : `<p class="price"><b>${brl(p.preco)}</b></p>`) : `<p class="price">Consulte o valor</p>`;
    return `<article class="item aitem ${p.ativo ? "" : "off"}"><div class="pic"><span class="tag ${out || p.un < 3 ? "low" : ""}">${out ? "Esgotado" : p.un < 3 ? "Últimas unidades" : "Em estoque"}</span>${d > 0 ? `<span class="tag off">-${d}%</span>` : ""}${productPic(p)}</div>
      <div class="info"><h3>${esc(p.nome)}</h3><p class="meta">${esc(p.cat)} · ${esc(p.det)} · ${p.un} un.</p>${price}
      <label class="sw"><input type="checkbox" data-ativo="${p.id}" ${p.ativo ? "checked" : ""}> Ativo no site</label>
      <div class="acts"><button type="button" class="tab" data-edit="${p.id}">Editar</button><button type="button" class="tab" data-del="${p.id}">Excluir</button></div></div></article>`;
  };
  ["q", "fcat", "fst"].forEach(id => $(id).addEventListener("input", render));
  $("new").addEventListener("click", () => openForm(null));

  list.addEventListener("click", async e => {
    const ed = e.target.closest("[data-edit]"); if (ed) { openForm(ed.dataset.edit); return; }
    const dl = e.target.closest("[data-del]");
    if (dl) {
      const p = products.find(x => String(x.id) === dl.dataset.del); if (!p) return;
      if (await ask("Excluir \"" + p.nome + "\"? Essa ação não pode ser desfeita.", "Excluir")) {
        try { await repo.remove(p.id); products = products.filter(x => x.id !== p.id); render(); toast("Produto excluído."); }
        catch (err) { toast(errMsg(err)); }
      }
    }
  });
  list.addEventListener("change", async e => {
    const t = e.target.closest("[data-ativo]"); if (!t) return;
    const p = products.find(x => String(x.id) === t.dataset.ativo); if (!p) return;
    try { const s = await repo.save({ ...p, ativo: t.checked }); products = products.map(x => x.id === p.id ? s : x); }
    catch (err) { t.checked = !t.checked; toast(errMsg(err)); }
    render();
  });

  // ---------- formulário (criar/editar) ----------
  function openForm(id) {
    const old = id ? products.find(x => String(x.id) === String(id)) : null;
    const p = old ? { ...old } : { id: null, nome: "", cat: $("fcat").value || "Aparelhos", det: "", un: 1, cor: "#2b2b2e", preco: null, desc: 0, img: "", ativo: true };
    const m = document.createElement("div"); m.className = "modal";
    m.innerHTML = `<form class="mbox fm" autocomplete="off"><h3>${old ? "Editar produto" : "Novo produto"}</h3>
 <label>Nome<input name="nome" required maxlength="60" value="${esc(p.nome)}"></label>
 <div class="two"><label>Categoria<select name="cat">${CATS.map(c => `<option ${c === p.cat ? "selected" : ""}>${c}</option>`).join("")}</select></label>
 <label>Estoque (un.)<input name="un" type="number" min="0" step="1" value="${p.un}"></label></div>
 <label>Detalhe<input name="det" maxlength="80" placeholder="Ex.: Rosa · 128 GB" value="${esc(p.det)}"></label>
 <div class="two"><label>Preço (R$)<input name="preco" type="number" min="0" step="0.01" inputmode="decimal" placeholder="Vazio = consulte" value="${p.preco == null ? "" : p.preco}"></label>
 <label>Desconto (%)<input name="desc" type="number" min="0" max="90" step="1" inputmode="numeric" value="${p.desc || 0}"></label></div>
 <label class="sw"><input name="ativo" type="checkbox" ${p.ativo ? "checked" : ""}> Ativo no site</label>
 <label>Imagem<input name="img" type="file" accept="image/*"></label>
 <div class="prev" data-prev></div>
 <div class="mrow"><button type="button" class="btn ghost" data-rm>Remover imagem</button></div>
 <div class="mrow"><button type="button" class="btn ghost" data-x>Cancelar</button><button type="submit" class="btn">Salvar</button></div></form>`;
    document.body.appendChild(m);
    const f = m.querySelector("form"), pv = m.querySelector("[data-prev]"), saveBtn = f.querySelector("[type=submit]");
    let preview = p.img;
    const showPrev = () => { pv.innerHTML = preview ? `<img src="${preview}" alt="">` : "Sem imagem (usa o desenho padrão)"; }; showPrev();
    f.img.onchange = async () => {
      const file = f.img.files[0]; if (!file) return;
      saveBtn.disabled = true; pv.textContent = "Enviando…";
      try { const { blob, previewUrl } = await fileToJpeg(file); p.img = await repo.uploadImage(blob, file.name); preview = previewUrl; }
      catch (err) { toast(errMsg(err)); f.img.value = ""; }
      saveBtn.disabled = false; showPrev();
    };
    m.querySelector("[data-rm]").onclick = () => { p.img = ""; preview = ""; f.img.value = ""; showPrev(); };
    const close = () => { m.remove(); removeEventListener("keydown", esk); }; const esk = e => { if (e.key === "Escape") close(); }; addEventListener("keydown", esk);
    m.querySelector("[data-x]").onclick = close;
    m.addEventListener("pointerdown", e => { if (e.target === m) close(); });
    f.onsubmit = async e => {
      e.preventDefault();
      p.nome = f.nome.value.trim(); if (!p.nome) return;
      p.cat = f.cat.value; p.det = f.det.value.trim();
      p.un = Math.max(0, parseInt(f.un.value, 10) || 0);
      const v = f.preco.value.trim().replace(",", "."); p.preco = v === "" ? null : Math.max(0, parseFloat(v) || 0) || null;
      p.desc = Math.min(90, Math.max(0, parseInt(f.desc.value, 10) || 0));
      p.ativo = f.ativo.checked;
      saveBtn.disabled = true;
      try {
        const s = await repo.save(p);
        products = old ? products.map(x => x.id === s.id ? s : x) : [...products, s];
        close(); render(); toast("Produto salvo.");
      } catch (err) { toast(errMsg(err)); saveBtn.disabled = false; }
    };
  }

  // ---------- início ----------
  let session = null;
  try { session = await auth.getSession(); } catch (_) {}
  if (session) await showPanel(); else showGate();
}
