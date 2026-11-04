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

// "Scopri chi siamo": la pagina scende da sola fino a Chi siamo, parte di scatto
// e frena forte all'arrivo. Se si tocca lo schermo o si usa la rotella, si ferma.
(function () {
  var link = document.querySelector(".scroll");
  var target = link && document.querySelector(link.getAttribute("href"));
  if (!target) return;

  // curva come cubic-bezier(.5, 0, .05, 1): spinta rapida, lunga frenata
  function ease(x) {
    var x1 = .5, y1 = 0, x2 = .05, y2 = 1;
    function at(t, p1, p2) { return 3 * p1 * t * (1 - t) * (1 - t) + 3 * p2 * t * t * (1 - t) + t * t * t; }
    var lo = 0, hi = 1, t = x;
    for (var i = 0; i < 24; i++) {
      t = (lo + hi) / 2;
      if (at(t, x1, x2) < x) lo = t; else hi = t;
    }
    return at(t, y1, y2);
  }

  var frame = 0;
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    ["wheel", "touchstart", "keydown"].forEach(function (type) { window.removeEventListener(type, stop); });
  }

  link.addEventListener("click", function (e) {
    e.preventDefault();
    var from = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var to = Math.min(max, target.getBoundingClientRect().top + from);
    history.pushState(null, "", link.getAttribute("href"));
    target.setAttribute("tabindex", "-1");

    function arrive() {
      target.focus({ preventScroll: true });
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, to);
      arrive();
      return;
    }

    stop();
    var duration = 1000;
    var start = performance.now();
    ["wheel", "touchstart", "keydown"].forEach(function (type) { window.addEventListener(type, stop, { passive: true }); });
    function step(now) {
      var p = Math.min(1, (now - start) / duration);
      window.scrollTo(0, from + (to - from) * ease(p));
      if (p < 1) { frame = requestAnimationFrame(step); } else { stop(); arrive(); }
    }
    frame = requestAnimationFrame(step);
  });
})();
