/** Efeitos de rolagem e revelação dos blocos. */
export function initScrollEffects() {
  const io = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("on");
        io.unobserve(entry.target);
      }
    }),
    { threshold: 0.15 }
  );

  document.querySelectorAll(".rv").forEach(el => io.observe(el));

  return { io };
}
