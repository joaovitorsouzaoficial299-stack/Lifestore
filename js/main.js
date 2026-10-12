/* ==========================================================
   INTERAÇÕES — lê config.js, monta o site e controla o celular 3D
   ========================================================== */
(() => {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = t => t * t * (3 - 2 * t);
  const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
  const pad = n => String(n).padStart(2, '0');
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

  /* ---------- Textos e links ---------- */
  document.title = `${S.nome} | ${S.titulo}`;
  $$('[data-site]').forEach(e => { e.textContent = S[e.dataset.site] ?? ''; });
  $('#ano').textContent = new Date().getFullYear();
  const waLink = txt => `https://wa.me/${S.whatsapp}${txt ? '?text=' + encodeURIComponent(txt) : ''}`;
  $('#waFloat').href = waLink(`Olá! Vim pelo site da ${S.nome} e gostaria de um orçamento.`);
  $('#ctaWhats').href = waLink(`Olá! Vim pelo site da ${S.nome}.`);
  $('#ctaMapa').href = S.mapaUrl;
  $('#ctaInsta').href = `https://instagram.com/${S.instagram}`;
  $('#ctaInsta').textContent = `@${S.instagram} no Instagram`;
  $('#trust').innerHTML = S.diferenciais.slice(0, 3).map(d => `<li>${d.t}</li>`).join('');
  $('#diffList').innerHTML = S.diferenciais.map(d => `<li><b>${d.t}</b><span>${d.d}</span></li>`).join('');
  $('#quotes').innerHTML = S.depoimentos.map(d => `<blockquote><p>&ldquo;${d.texto}&rdquo;</p><cite>${d.nome}</cite></blockquote>`).join('');
  $('#faq').innerHTML = S.faq.map(f => `<details><summary>${f.p}</summary><p>${f.r}</p></details>`).join('');
  $$('#faq details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('#faq details').forEach(o => o !== d && (o.open = false)); }));
  const hoje = new Date().getDay();
  $('#hours').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(i => `<li class="${i === hoje ? 'today' : ''}"><span>${DIAS[i][0].toUpperCase() + DIAS[i].slice(1)}</span><span>${S.horarios[i] ? S.horarios[i].join(' às ') : 'Fechado'}</span></li>`).join('');

  /* ---------- Aberto agora ---------- */
  (function status() {
    const n = new Date(), h = S.horarios[n.getDay()], m = n.getHours() * 60 + n.getMinutes();
    let on = false, txt = 'Fechado no momento';
    if (h && m >= toMin(h[0]) && m < toMin(h[1])) { on = true; txt = `Aberto agora, fecha às ${h[1]}`; }
    else for (let i = 0; i <= 7; i++) {
      const d = new Date(n); d.setDate(n.getDate() + i); const hh = S.horarios[d.getDay()];
      if (!hh || (i === 0 && m >= toMin(hh[0]))) continue;
      txt = `Fechado agora, abre ${i === 0 ? 'hoje' : i === 1 ? 'amanhã' : 'na ' + DIAS[d.getDay()]} às ${hh[0]}`; break;
    }
    $('#status').classList.toggle('off', !on); $('#status span').textContent = txt;
  })();

  /* ---------- Orçamento rápido ---------- */
  const devs = Object.keys(S.servicos);
  const Q = { dev: devs[0] };
  function renderDevs() {
    $('#devs').innerHTML = devs.map(d => `<button type="button" class="dev" data-d="${d}" aria-pressed="${d === Q.dev}">${d}</button>`).join('');
  }
  function fillProb() {
    $('#prob').innerHTML = S.servicos[Q.dev].map((s, i) => `<option value="${i}">${s.nome}</option>`).join('') + '<option value="-1">Outro problema ou não sei qual é</option>';
    renderEst();
  }
  function renderEst() {
    const i = +$('#prob').value, s = S.servicos[Q.dev][i];
    $('#est').innerHTML = s
      ? `<b>A partir de ${brl(s.preco)}</b>Prazo médio: ${s.tempo}. Diagnóstico grátis.`
      : `<b>Diagnóstico grátis</b>Traga o aparelho e dizemos o que ele tem, sem compromisso.`;
  }
  $('#devs').addEventListener('click', e => { const b = e.target.closest('.dev'); if (!b) return; Q.dev = b.dataset.d; renderDevs(); fillProb(); });
  $('#prob').addEventListener('change', renderEst);
  function setQuote(dev, nome) {
    Q.dev = dev; renderDevs(); fillProb();
    const i = S.servicos[dev].findIndex(s => s.nome === nome);
    if (i >= 0) { $('#prob').value = i; renderEst(); }
    $('#orcamento').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }
  $('#orcamento').addEventListener('submit', e => e.preventDefault());
  $('#enviar').addEventListener('click', e => {
    const nome = $('#nome').value.trim(), erro = $('#erro');
    if (nome.length < 2) {
      e.preventDefault(); erro.hidden = false; erro.textContent = 'Digite seu nome para continuar.'; $('#nome').focus(); return;
    }
    erro.hidden = true;
    const i = +$('#prob').value, s = S.servicos[Q.dev][i], modelo = $('#modelo').value.trim();
    const msg = [
      `Olá! Quero um orçamento na ${S.nome}.`, '',
      `Aparelho: ${Q.dev}${modelo ? ' (' + modelo + ')' : ''}`,
      `Problema: ${s ? `${s.nome} (a partir de ${brl(s.preco)})` : 'não sei qual é, preciso de diagnóstico'}`,
      `Nome: ${nome}`,
    ].join('\n');
    const a = $('#enviar'); a.href = waLink(msg); a.target = '_blank'; a.rel = 'noopener';
  });
  renderDevs(); fillProb();

  /* ---------- Serviços ---------- */
  let tab = devs[0];
  $('#tabs').innerHTML = devs.map(d => `<button class="tab" role="tab" data-t="${d}" aria-selected="${d === tab}">${d}</button>`).join('');
  function renderSvc() {
    $('#svcList').innerHTML = S.servicos[tab].map(s => `
      <li><h3>${s.nome}</h3><span class="tempo">Prazo: ${s.tempo}</span>
      <span class="preco"><small>a partir de</small>${brl(s.preco)}</span>
      <button class="orcar" data-n="${s.nome}">Pedir orçamento</button></li>`).join('');
  }
  $('#tabs').addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b) return;
    tab = b.dataset.t; $$('.tab').forEach(t => t.setAttribute('aria-selected', t === b)); renderSvc();
  });
  $('#svcList').addEventListener('click', e => { const b = e.target.closest('.orcar'); if (b) setQuote(tab, b.dataset.n); });
  renderSvc();

  /* ---------- Processo (linha que avança com a rolagem) ---------- */
  $('#proc').innerHTML = S.processo.map(p => `<li><h3>${p.t}</h3><p>${p.d}</p></li>`).join('');
  const procEl = $('#proc'), procLi = $$('li', procEl);
  function updateProc() {
    const r = procEl.getBoundingClientRect();
    const f = clamp((innerHeight * .85 - r.top) / (innerHeight * .45));
    procEl.style.setProperty('--f', f.toFixed(3));
    procLi.forEach((li, i) => li.classList.toggle('on', f > 0 && f >= i / (procLi.length - 1) - .001));
  }

  /* ==========================================================
     CELULAR DESMONTANDO COM A ROLAGEM
     p = 0 (montado) ... 1 (todas as peças separadas).
     Rolando de volta, p diminui e as peças se encaixam de novo.
     ========================================================== */
  const stage = $('#por-dentro'), scene = $('#scene'), view = $('#stView');
  const layers = $$('.layer', scene);               // índice 0 = carcaça ... 4 = vidro
  const GAP = 118;                                  // distância final entre as peças (px)
  const START = { 4: .06, 3: .16, 2: .26, 1: .36 }; // quando cada peça começa a subir
  const DUR = .30;                                  // duração do movimento de cada peça
  const BOUNDS = [0, .06, .16, .26, .36, .64, 1];   // fronteiras dos 6 momentos
  const LAYER_OF = { 1: 4, 2: 3, 3: 2, 4: 1, 5: 0 };
  let sc = 1, idx = -1, ticking = false;

  // Modo opcional: sequência de imagens (frames) em canvas
  const F = S.stage && S.stage.frames;
  let imgs = [], ctx = null;
  const canvas = $('#frameCanvas');
  if (F) {
    scene.hidden = true; canvas.hidden = false; ctx = canvas.getContext('2d');
    for (let i = 1; i <= F.total; i++) { const im = new Image(); im.src = `${F.pasta}${String(i).padStart(3, '0')}.${F.ext}`; imgs.push(im); }
  }
  function drawFrame(p) {
    const im = imgs[Math.round(p * (F.total - 1))];
    if (!im || !im.naturalWidth) return;
    const dpr = devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const k = Math.min(canvas.width / im.naturalWidth, canvas.height / im.naturalHeight);
    const dw = im.naturalWidth * k, dh = im.naturalHeight * k;
    ctx.drawImage(im, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
  }

  function fit() {
    const r = view.getBoundingClientRect();
    sc = Math.max(.4, Math.min(r.width / 470, r.height / 740));
    scene.style.setProperty('--sc', sc.toFixed(3));
  }

  // Legenda lateral
  const partes = S.partes;
  $('#stList').innerHTML = partes.slice(1).map((p, k) => `<li><button type="button" data-k="${k + 1}">${p.t}</button></li>`).join('');
  function targetFor(k) { return (BOUNDS[k] + BOUNDS[k + 1]) / 2; }
  function scrollToP(p) {
    const top = stage.getBoundingClientRect().top + scrollY;
    const total = stage.offsetHeight - innerHeight;
    scrollTo({ top: top + p * total, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  $('#stList').addEventListener('click', e => { const b = e.target.closest('button'); if (b) scrollToP(targetFor(+b.dataset.k)); });

  function setPart(k) {
    idx = k; const p = partes[k];
    $('#partTitle').textContent = p.t; $('#partText').textContent = p.d;
    const btn = $('#partBtn');
    if (p.orc) { btn.hidden = false; btn.textContent = `Orçar: ${p.orc[1].toLowerCase()}`; btn.onclick = () => setQuote(p.orc[0], p.orc[1]); }
    else btn.hidden = true;
    $$('#stList button').forEach(b => b.classList.toggle('on', +b.dataset.k === k));
    layers.forEach((l, i) => l.classList.toggle('on', k >= 1 && LAYER_OF[k] === i && !F));
  }

  function updateStage() {
    const r = stage.getBoundingClientRect();
    const total = stage.offsetHeight - innerHeight;
    const p = clamp(-r.top / total);

    // Qual momento está ativo
    let k = 0; while (k < 5 && p >= BOUNDS[k + 1]) k++;
    if (k !== idx) setPart(k);

    $('#stFill').style.width = (p * 100).toFixed(1) + '%';
    $('#hint').classList.toggle('gone', p > .02);

    if (F) { drawFrame(p); return; }

    // Inclinação da cena: de frente (montado) para vista isométrica (desmontado)
    const tilt = ease(clamp(p / .28));
    const rx = tilt * 60, rz = -tilt * 30 - clamp((p - .3) / .7) * 16;
    let zTop = 0;
    layers.forEach((l, i) => {
      const z = i === 0 ? 0 : i * GAP * ease(clamp((p - START[i]) / DUR));
      l.style.setProperty('--z', z.toFixed(1) + 'px');
      if (i === 4) zTop = z;
    });
    const ty = (zTop / 2) * Math.sin(rx * Math.PI / 180) * sc * 0.9;   // mantém o conjunto centralizado
    scene.style.setProperty('--rx', rx.toFixed(2));
    scene.style.setProperty('--rz', rz.toFixed(2));
    scene.style.setProperty('--ty', ty.toFixed(1) + 'px');
  }

  /* ---------- Menu, link ativo e rolagem ---------- */
  const menu = $('#menu'), burger = $('#burger');
  burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  menu.addEventListener('click', e => { if (e.target.matches('a')) { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });
  const links = $$('#menu a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = $(a.getAttribute('href')); s && spy.observe(s); });

  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { updateStage(); updateProc(); ticking = false; });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { fit(); onScroll(); });
  fit(); setPart(0); updateStage(); updateProc();
  if ('ResizeObserver' in window) new ResizeObserver(() => { fit(); updateStage(); }).observe(view);
})();
