// Chi siamo: entrata quando la sezione arriva sullo schermo e foto che si muove
// appena allo scorrere. Con "riduci movimento" non parte niente e tutto resta fermo.
(function () {
  var section = document.querySelector(".about");
  if (!section || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // titolo diviso in parole, il colore vino resta sulla sua parte
  var title = section.querySelector(".title");
  var i = 0;
  function split(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var w = document.createElement("span");
          w.className = "w";
          var inner = document.createElement("span");
          inner.style.setProperty("--i", i++);
          inner.textContent = part;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        split(child);
      }
    });
  }
  if (title) {
    title.setAttribute("aria-label", title.textContent);
    split(title);
    title.querySelectorAll(".w").forEach(function (w) { w.setAttribute("aria-hidden", "true"); });
  }

  section.classList.add("anim");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { section.classList.add("is-in"); io.disconnect(); }
    });
  }, { rootMargin: "0px 0px -20% 0px" }); // parte quando la sezione supera l'ultimo quinto dello schermo
  io.observe(section);

  // la foto scorre un poco più lenta della pagina
  var photo = section.querySelector(".about__photo img");
  var ticking = false;
  function move() {
    ticking = false;
    var r = section.getBoundingClientRect();
    var vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    var progress = (vh - r.top) / (vh + r.height); // 0 entra, 1 esce
    photo.style.setProperty("--py", ((progress - .5) * -48).toFixed(1) + "px");
  }
  if (photo) {
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(move); }
    }, { passive: true });
    move();
  }
})();
