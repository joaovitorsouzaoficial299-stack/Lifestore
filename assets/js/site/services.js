export function renderServices() {
const ic={
 tela:'<path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM10 19h4"/>',
 bat:'<path d="M3 8h15v8H3zM21 11v2M7 12h5"/>',
 agua:'<path d="M12 3s6 6.500 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z"/>',
 cam:'<path d="M4 8h4l2-3h4l2 3h4v11H4zM12 16a3 3 0 1 0 0-.1"/>',
 troca:'<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
 loja:'<path d="M4 9l1-5h14l1 5M5 9v11h14V9M9 20v-6h6v6"/>',
 som:'<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.500 6.500a8 8 0 0 1 0 11"/>',
 soft:'<path d="M4 6l8-3 8 3v6c0 5-4 8-8 9-4-1-8-4-8-9zM9 12l2 2 4-4"/>'};
const serv=[["tela","Troca de tela","Telas para iPhone e outros modelos, com instalação no mesmo dia."],["bat","Troca de bateria","Saúde da bateria de volta a 100% e mais horas de uso."],["agua","Danos por líquido","Limpeza técnica e recuperação de aparelhos molhados."],["cam","Câmeras e vidro traseiro","Substituição de câmera, lente e tampa traseira."],["som","Áudio e conectores","Alto-falante, microfone e conector de carga."],["soft","Software e dados","Atualização, restauração e backup sem perder fotos."],["troca","Avaliação para troca","Pega Apple na troca: avaliamos seu aparelho e abatemos no novo."],["loja","Smartphones e acessórios","Aparelhos, fones, caixas de som e tecnologia na nossa loja."]];
document.getElementById("serv").innerHTML=serv.map(s=>`<div class="frame"><svg viewBox="0 0 24 24">${ic[s[0]]}</svg><h3>${s[1]}</h3><p>${s[2]}</p></div>`).join("");
}
