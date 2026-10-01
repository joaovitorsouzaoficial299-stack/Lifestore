import { createProductsRepository } from "../data/products-repository.js";
import { bindWhatsAppLinks } from "./whatsapp.js";
import { renderServices } from "./services.js";
import { initStore, showLoadError } from "./store.js";
import { initScrollEffects } from "./scroll-effects.js";
import { initOrcamento } from "./orcamento.js";
import { initIphone3D, gl } from "./iphone3d.js";
import { initRouter } from "./router.js";

async function boot() {
  bindWhatsAppLinks();
  renderServices();

  // Produtos: vêm do "repositório" (hoje data/products.json; amanhã o banco de dados).
  try {
    const repo = await createProductsRepository();
    initStore(await repo.list());
  } catch (e) {
    console.error(e);
    showLoadError();
  }

  const fx = initScrollEffects();
  gl.onReady = fx.spin;
  initOrcamento();
  initIphone3D();
  initRouter(fx);
}

boot();
