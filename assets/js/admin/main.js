import { createProductsRepository } from "../data/products-repository.js";
import { createAuth } from "../data/auth.js";
import { initAdminApp } from "./app.js";

initAdminApp({ repo: await createProductsRepository(), auth: await createAuth() });
