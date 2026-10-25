(() => {
  const entry = document.querySelector("#blank-record");
  if (!entry || !window.matchMedia("(hover: none)").matches) return;

  entry.addEventListener("click", (event) => {
    if (entry.classList.contains("is-revealed")) return;
    event.preventDefault();
    entry.classList.add("is-revealed");
    entry.setAttribute("aria-label", "众人手记入口已展开；再次轻触进入");
  });
})();
