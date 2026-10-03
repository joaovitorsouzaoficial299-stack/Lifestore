import { createProductsRepository } from "../data/products-repository.js";
import { bindWhatsAppLinks } from "./whatsapp.js";
import { initStore, showLoadError } from "./store.js";
import { initScrollEffects } from "./scroll-effects.js";
import { initOrcamento } from "./orcamento.js";
import { initRouter } from "./router.js";

async function boot() {
  bindWhatsAppLinks();
  // Produtos: vêm do "repositório" (hoje data/products.json; amanhã o banco de dados).
  try {
    const repo = await createProductsRepository();
    initStore(await repo.list());
  } catch (e) {
    console.error(e);
    showLoadError();
  }

  const fx = initScrollEffects();
  initOrcamento();
  initRouter(fx);
}

boot();
