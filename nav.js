(function () {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("menu-principal");
  if (!toggle || !nav) return;

  const mobileQuery = window.matchMedia("(max-width: 900px)");

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (!mobileQuery.matches) return;
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!mobileQuery.matches) return;
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    setOpen(false);
  });

  const closeOnDesktop = () => {
    if (!mobileQuery.matches) setOpen(false);
  };

  if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", closeOnDesktop);
  else mobileQuery.addListener(closeOnDesktop);
})();
