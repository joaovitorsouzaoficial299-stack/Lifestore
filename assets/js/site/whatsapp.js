import { waLink } from "../shared/utils.js";

export function bindWhatsAppLinks() {
document.querySelectorAll("[data-wa]").forEach(a=>{a.href=waLink(a.dataset.wa);a.target="_blank";a.rel="noopener"});
}
