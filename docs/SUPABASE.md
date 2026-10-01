# Conectar o painel ao Supabase (próxima etapa)

Nada aqui precisa ser feito agora. O código já está organizado para esta etapa:

| Parte                     | Onde                                   | O que falta                              |
|---------------------------|----------------------------------------|------------------------------------------|
| Login do administrador    | `assets/js/data/auth.js` → `supabase.js` (`createSupabaseAuth`) | implementar com Supabase Auth |
| Tabela de produtos        | `assets/js/data/supabase.js` (`createSupabaseProductsRepository`) | implementar `list/save/remove` |
| Imagens dos produtos      | mesmo arquivo (`uploadImage`)          | enviar ao Supabase Storage e devolver a URL pública |
| Preços, estoque, ativo    | colunas da tabela `products` (abaixo)  | só mapear (já há `toRow` / `fromRow`)    |
| Ligar tudo                | `assets/js/config.js`                  | `backend: "supabase"` + `url` e `anonKey` |

O site público e o painel **não mudam**: eles só chamam o contrato `list / save / remove / uploadImage`
(documentado em `assets/js/data/products-repository.js`) e `getSession / signIn / signOut`.

## 1. Tabela e regras (SQL Editor do Supabase)

```sql
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  categoria   text not null check (categoria in ('Sons','Aparelhos','Acessórios','Fones','Outros')),
  detalhe     text not null default '',
  preco       numeric(10,2) check (preco is null or preco >= 0),   -- null = "Consulte o valor"
  desconto    smallint not null default 0 check (desconto between 0 and 90),
  estoque     integer  not null default 0 check (estoque >= 0),
  cor         text not null default '#2b2b2e',                      -- cor do desenho quando não há foto
  imagem_url  text,
  ativo       boolean not null default true,
  ordem       integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger products_touch before update on public.products
for each row execute function public.touch_updated_at();

-- Administrador = usuário cujo app_metadata.role = 'admin' (definido só por você, no servidor)
create or replace function public.is_admin() returns boolean language sql stable as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

alter table public.products enable row level security;

create policy "público lê produtos ativos" on public.products
  for select using (ativo = true);
create policy "admin lê tudo" on public.products
  for select to authenticated using (public.is_admin());
create policy "admin cria" on public.products
  for insert to authenticated with check (public.is_admin());
create policy "admin edita" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin exclui" on public.products
  for delete to authenticated using (public.is_admin());
```

## 2. Imagens (Storage)

```sql
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "imagens: leitura pública" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "imagens: admin envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
create policy "imagens: admin altera" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());
create policy "imagens: admin apaga" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());
```

O painel já reduz a foto para no máximo 640 px (JPEG) antes de chamar `uploadImage(blob, nome)`.

## 3. Administrador

1. *Authentication → Providers → Email*: **desligue "Allow new users to sign up"** (ninguém se cadastra sozinho).
2. *Authentication → Users → Add user*: crie o e-mail e uma senha forte do administrador (a senha fica só no Supabase).
3. Marque-o como admin (SQL Editor):

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
where email = 'ADMIN@SEU-EMAIL.com';
```

Só quem tem esse papel passa nas regras acima. Mesmo que alguém abra `/admin` ou use a chave `anon`, o banco recusa escrita.

## 4. Implementar o adaptador (`assets/js/data/supabase.js`)

- Carregar o cliente (`@supabase/supabase-js`) via `<script>` de CDN pinado nas duas páginas, ou `import` de um CDN ESM pinado.
- `list({includeInactive})`: `select * from products order by ordem, nome`; sem `includeInactive`, filtrar `ativo = true`. Converter com `fromRow`.
- `save(p)`: se `p.id == null` → `insert(toRow(p))`, senão `update(toRow(p)).eq('id', p.id)`; devolver `fromRow(linha)`.
- `remove(id)`: `delete().eq('id', id)`.
- `uploadImage(blob, nome)`: `storage.from(bucket).upload(<uuid>.jpg, blob)` e devolver `getPublicUrl(...)`.
- `createSupabaseAuth`: `signInWithPassword`, `getSession`, `signOut`; trocar `available` para `true`.
- Em `config.js`: `backend: "supabase"`, `supabase.url` e `supabase.anonKey` (a chave **anon**, nunca a `service_role`).

## 5. Migrar os produtos atuais

Os 14 produtos de exemplo estão em `data/products.json`. Importe-os (Table Editor → Import CSV, ou um `insert`)
mapeando: `nome→nome`, `cat→categoria`, `det→detalhe`, `un→estoque`, `desc→desconto`, `img→imagem_url`, `ativo→ativo`.
Depois de tudo funcionando, `data/products.json` deixa de ser usado.
