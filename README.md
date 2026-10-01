# Life Store — site + painel administrativo

Site da **Life Store** (assistência técnica e loja de celulares, Anápolis - GO), pronto para GitHub + Vercel.
É um site **estático** (HTML, CSS e JavaScript puros): não precisa de build, de Node nem de Claude/Lovable para funcionar.

```
/        → site público (index.html)
/admin   → painel administrativo (admin/index.html)  ← trancado até o banco de dados ser conectado
```

## Estrutura

```
life-store/
├─ index.html                      site público (Início + Loja, igual ao que já existia)
├─ admin/
│  └─ index.html                   painel administrativo (rota /admin)
├─ data/
│  └─ products.json                produtos atuais (fonte de dados temporária, somente leitura)
├─ assets/
│  ├─ css/
│  │  ├─ styles.css                todo o visual do site (o mesmo CSS de antes)
│  │  └─ admin.css                 só o que é exclusivo do painel
│  ├─ img/logo.jpg                 logo da loja
│  ├─ models/iphone-17-pro-max.json  modelo 3D do iPhone
│  └─ js/
│     ├─ config.js                 WhatsApp da loja + qual "backend" usar (static | supabase)
│     ├─ shared/                   código usado pelo site e pelo painel (utilitários, card de produto)
│     ├─ data/                     CAMADA DE DADOS: contrato + adaptadores (aqui entra o Supabase)
│     │  ├─ products-repository.js   lê os produtos (hoje: data/products.json)
│     │  ├─ auth.js                  login do administrador (hoje: não configurado)
│     │  └─ supabase.js              ponto de conexão com o Supabase (ainda não implementado)
│     ├─ site/                     lógica do site público (loja, orçamento, 3D, rolagem, rotas)
│     └─ admin/                    lógica do painel (listar, criar, editar, excluir, ativar/desativar)
├─ docs/
│  ├─ SUPABASE.md                  SQL das tabelas, regras de segurança e passo a passo
│  └─ MIGRACAO-DO-ARTIFACT.md      o que foi mudado ao sair do Claude Artifact
└─ .gitignore
```

## Rodar localmente

O site usa módulos JavaScript e `fetch`, então **não abra o `index.html` com duplo clique**; sirva a pasta:

```bash
cd life-store
python3 -m http.server 3000      # ou:  npx serve .
```

Abra http://localhost:3000 (site) e http://localhost:3000/admin (painel).
O 3D do iPhone, as fontes e o logo do WhatsApp dependem de internet (three.js e Google Fonts via CDN).

## Colocar no GitHub

1. Crie um repositório vazio em https://github.com/new (ex.: `life-store`), **sem** README/.gitignore.
2. Na pasta do projeto:

```bash
git init
git add .
git commit -m "Life Store: site estático + painel admin (base)"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/life-store.git
git push -u origin main
```

(Alternativa sem terminal: no repositório vazio, clique em **uploading an existing file** e arraste o conteúdo da pasta.)

## Conectar a Vercel

1. Em https://vercel.com/new, escolha **Import Git Repository** e selecione `life-store`.
2. **Framework Preset:** `Other`. **Build Command:** vazio. **Output Directory:** vazio (a raiz do repositório já é o site). **Install Command:** vazio.
3. Clique em **Deploy**. O site abre em `https://SEU-PROJETO.vercel.app` e o painel em `.../admin`.
4. A cada `git push` na branch `main`, a Vercel publica de novo automaticamente.

Não é preciso `vercel.json`. O domínio próprio e o DNS **não foram tocados**: configure só quando quiser, em *Project → Settings → Domains*.

## Como o painel vai funcionar (próxima etapa)

O painel `/admin` já está pronto (lista, busca, filtros, criar, editar, excluir, preço, desconto, estoque,
imagem, ativar/desativar), mas **fica trancado** enquanto não existir login real: ele não grava nada sozinho
e não usa `localStorage`. Todo acesso a dados passa pela camada `assets/js/data/`, então conectar o Supabase
é implementar `assets/js/data/supabase.js` e trocar `backend` para `"supabase"` em `assets/js/config.js`.
Passo a passo em [`docs/SUPABASE.md`](docs/SUPABASE.md).

Segurança: não há senha, usuário nem chave secreta no código. A chave `anon` do Supabase é pública por
desenho; a proteção real vem das regras RLS do banco (somente o administrador escreve). Nunca use a chave `service_role` no site.

## Editar produtos hoje (antes do banco)

Edite `data/products.json` (um objeto por produto; `"ativo": false` esconde o produto do site) e faça `git push`.
