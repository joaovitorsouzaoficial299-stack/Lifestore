// Configuração do site. Nada aqui é segredo.
// Para ligar o painel a um banco de dados real, veja docs/SUPABASE.md.
export const CONFIG = {
  // WhatsApp da loja (55 + DDD + número, só dígitos)
  whatsapp: "5562993013945",

  // De onde vêm os produtos e quem pode editá-los:
  //   "static"   -> lê data/products.json (somente leitura; painel /admin bloqueado)
  //   "supabase" -> banco real + login do administrador (ainda não implementado)
  backend: "static",

  // Só é usado quando backend = "supabase".
  // A chave "anon" é pública por desenho (a segurança vem das regras RLS do banco).
  // NUNCA coloque aqui a chave "service_role" nem senhas.
  supabase: {
    url: "",
    anonKey: "",
    table: "products",
    bucket: "product-images",
  },
};
