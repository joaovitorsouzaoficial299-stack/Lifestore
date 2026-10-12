/* ==========================================================
   CONFIGURAÇÃO DO SITE — troque pelos dados reais da loja.
   ========================================================== */
window.SITE = {
  nome: "TechFix Assistência",
  titulo: "Conserto de celular, notebook e tablet com garantia",
  slogan: "Celular quebrado? Consertamos hoje, com garantia.",
  descricao:
    "Troca de tela, bateria, conector de carga e reparo de placa. Diagnóstico grátis, orçamento antes de qualquer serviço e acompanhamento pelo WhatsApp.",

  whatsapp: "5511999999999",           // 55 + DDD + número, só dígitos
  instagram: "techfix.assistencia",
  endereco: "Av. Principal, 456, Centro",
  cidade: "São Paulo, SP",
  mapaUrl: "https://www.google.com/maps/search/?api=1&query=Av+Principal+456+Sao+Paulo",

  // 0 = domingo ... 6 = sábado. null = fechado.
  horarios: { 0: null, 1: ["09:00","19:00"], 2: ["09:00","19:00"], 3: ["09:00","19:00"], 4: ["09:00","19:00"], 5: ["09:00","19:00"], 6: ["09:00","14:00"] },

  diferenciais: [
    { t: "Garantia de 90 dias", d: "Em todos os reparos e peças trocadas." },
    { t: "Orçamento sem compromisso", d: "Você só paga se aprovar o valor." },
    { t: "Peças testadas", d: "Cada peça é conferida antes de ser instalada." },
    { t: "Acompanhe pelo WhatsApp", d: "Avisamos a cada etapa do conserto." },
  ],

  // Serviços por tipo de aparelho. preco = "a partir de" (R$). tempo = prazo médio.
  servicos: {
    "Celular": [
      { nome: "Troca de tela", preco: 180, tempo: "1 hora" },
      { nome: "Troca de bateria", preco: 90, tempo: "40 minutos" },
      { nome: "Conector de carga", preco: 120, tempo: "1 hora" },
      { nome: "Vidro traseiro e câmera", preco: 130, tempo: "1h30" },
      { nome: "Celular molhado ou oxidado", preco: 150, tempo: "1 a 2 dias" },
      { nome: "Não liga (reparo de placa)", preco: 200, tempo: "1 a 3 dias" },
    ],
    "Notebook": [
      { nome: "Limpeza e pasta térmica", preco: 120, tempo: "1 dia" },
      { nome: "Troca de tela", preco: 350, tempo: "1 a 2 dias" },
      { nome: "Troca de teclado", preco: 160, tempo: "1 dia" },
      { nome: "SSD e formatação", preco: 220, tempo: "1 dia" },
    ],
    "Tablet": [
      { nome: "Troca de tela", preco: 220, tempo: "1 a 2 dias" },
      { nome: "Troca de bateria", preco: 130, tempo: "2 horas" },
      { nome: "Conector de carga", preco: 110, tempo: "1 hora" },
    ],
    "Computador": [
      { nome: "Formatação com backup", preco: 100, tempo: "1 dia" },
      { nome: "Upgrade de memória ou SSD", preco: 150, tempo: "2 horas" },
      { nome: "Limpeza e manutenção", preco: 90, tempo: "1 dia" },
      { nome: "Remoção de vírus", preco: 80, tempo: "3 horas" },
    ],
  },

  processo: [
    { t: "Diagnóstico grátis", d: "Testamos o aparelho na sua frente e dizemos o que tem." },
    { t: "Orçamento aprovado por você", d: "Valor e prazo combinados antes de abrir o aparelho." },
    { t: "Reparo", d: "Peças testadas e técnico dedicado ao seu aparelho." },
    { t: "Entrega com garantia", d: "Você confere tudo funcionando e leva 90 dias de garantia." },
  ],

  /* ---- Celular desmontando com a rolagem ----
     A animação padrão é um modelo 3D feito em CSS (não precisa de imagens).
     Para usar frames reais (fotos ou vídeo exportado em sequência), preencha "frames":
       frames: { pasta: "assets/frames/", total: 120, ext: "jpg" }
     Os arquivos devem se chamar 001.jpg, 002.jpg ... (3 dígitos). */
  stage: { frames: null },

  // 6 momentos da animação. "orc" pré-preenche o orçamento ao clicar no botão.
  partes: [
    { id: "intro",   t: "Seu celular, por dentro", d: "Role a página para desmontar o aparelho peça por peça. É assim que fazemos cada reparo.", orc: null },
    { id: "glass",   t: "Vidro frontal",  d: "O primeiro a sofrer em quedas. Trocamos o vidro e aplicamos película nova.", orc: ["Celular", "Troca de tela"] },
    { id: "display", t: "Display",        d: "Linhas, manchas ou tela apagada? Substituímos o display e testamos o touch.", orc: ["Celular", "Troca de tela"] },
    { id: "board",   t: "Placa-mãe",      d: "Não liga, não carrega ou reinicia sozinho: reparo em nível de componente.", orc: ["Celular", "Não liga (reparo de placa)"] },
    { id: "battery", t: "Bateria",        d: "Dura pouco ou está estufada? Bateria nova, calibrada e com garantia.", orc: ["Celular", "Troca de bateria"] },
    { id: "case",    t: "Carcaça e conectores", d: "Entrada de carga, botões, câmera e vidro traseiro ficam aqui.", orc: ["Celular", "Conector de carga"] },
  ],

  depoimentos: [
    { nome: "Rafael S.", texto: "Levei o celular com a tela trincada de manhã e busquei no fim do dia funcionando. Preço igual ao combinado." },
    { nome: "Mariana L.", texto: "Meu notebook estava lento demais. Trocaram o SSD, formataram e ele parece novo." },
    { nome: "Carlos P.", texto: "Caiu na água e acharam que não tinha mais jeito. Voltou a ligar e ainda recebi o aviso pelo WhatsApp." },
  ],

  faq: [
    { p: "O diagnóstico é grátis mesmo?", r: "Sim. Testamos o aparelho, explicamos o defeito e passamos o valor. Você decide se quer consertar." },
    { p: "Quanto tempo leva o conserto?", r: "Troca de tela e de bateria costumam ficar prontas no mesmo dia. Reparos de placa levam de 1 a 3 dias." },
    { p: "Perco meus dados?", r: "Na maioria dos reparos, não. Mesmo assim, recomendamos backup antes de trazer o aparelho." },
    { p: "Como funciona a garantia?", r: "São 90 dias para o serviço e para a peça trocada. Mau uso, queda e líquido depois do reparo não entram." },
    { p: "Posso pagar no cartão?", r: "Aceitamos Pix, débito e crédito em até 6x." },
  ],
};
