/** Páginas do site (Início e Loja) no mesmo documento, por #hash. */
export function initRouter({ io }) {
  let view = "home";

  function route() {
    const h = location.hash.slice(1);
    view = h === "loja" ? "loja" : "home";

    document.getElementById("top").hidden = view !== "home";
    document.getElementById("view-loja").hidden = view !== "loja";

    document.querySelectorAll("nav a").forEach(a => {
      a.style.color = (a.getAttribute("href") === "#loja" && view === "loja")
        ? "var(--gold2)"
        : "";
    });

    const target = h && !["top", "loja"].includes(h)
      ? document.getElementById(h)
      : null;

    if (target) {
      requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    } else if (view === "home") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    document.querySelectorAll(".rv:not(.on)").forEach(el => io.observe(el));
  }

  addEventListener("hashchange", route);
  route();
}
