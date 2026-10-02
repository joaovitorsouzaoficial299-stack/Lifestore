# Migração: de Claude Artifact para site independente

## O que era exclusivo do Claude Artifact (removido/substituído)

| Antes (arquivo único)                                         | Agora                                                        |
|---------------------------------------------------------------|--------------------------------------------------------------|
| `claude.use("user")` / `canEdit()` (quem é admin)             | `assets/js/data/auth.js` (login real, futuramente Supabase)  |
| `claude.use("artifact")` / `art.publish(html)` (salvar)       | `repo.save / remove / uploadImage` (futuramente banco real)  |
| `buildHTML()` (a página reescrevia o próprio HTML e republicava) | removido; os dados ficam fora do HTML                      |
| `<template id="tpl">` + `#root` + `data-keep` (para regravar) | marcação direta no `index.html`                              |
| Produtos embutidos em `<script id="data">`                    | `data/products.json` (+ campo `ativo`)                       |
| Modelo 3D embutido em `<script id="mdl">`                     | `assets/models/iphone-17-pro-max.json` (carregado por `fetch`) |
| Logo em base64 dentro do CSS                                  | `assets/img/logo.jpg`                                        |
| Painel dentro da própria Loja (barra "Modo administrador", `#admin`) | página separada `/admin`; o site público não tem código de admin |

## O que já funcionava no navegador e foi preservado sem mudança de comportamento

Visual completo (CSS idêntico), textos, cores, animações, iPhone 3D girando com a rolagem (e o iPhone em CSS como
reserva), efeito de rolagem nos serviços, Loja por categorias com gaveta lateral, filtros, orçamento rápido →
WhatsApp, botões de WhatsApp, rotas Início/Loja por `#hash`, botão flutuante verde, tema branco.
O código foi apenas dividido em módulos; as funções foram copiadas, não reescritas.

## O que continua dependendo de backend

Editar produtos de verdade (criar, editar, excluir, preço, estoque, imagens, ativar/desativar) e o login do
administrador. Até lá, o painel `/admin` fica trancado e os produtos vêm de `data/products.json`.

## Verificação feita

Capturas de tela do site antigo e do novo (desktop e celular, início, rolagens, orçamento, loja e rodapé):
posições e tamanhos de todos os blocos idênticos; diferença residual apenas de suavização de borda em 2 linhas.
Testes automatizados no navegador: carregamento dos 14 produtos, categorias, filtros, rota da Loja, mensagem do
WhatsApp, `/admin` trancado sem backend e fluxo completo do painel com adaptadores de teste (login, criar, editar,
ativar, excluir). O 3D foi testado com three.js simulado (fluxo, decodificação e redesenho na rolagem); a renderização
WebGL real depende do CDN e deve ser conferida no navegador.
