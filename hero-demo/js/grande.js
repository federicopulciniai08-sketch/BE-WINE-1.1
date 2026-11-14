// Chi siamo: entrata quando la sezione arriva sullo schermo (titolo, paragrafo, poi le tre voci).
// Con "riduci movimento" l'entrata non parte e tutto resta fermo.
// Su computer resta accesa una voce alla volta: quella più vicina al centro dello schermo,
// oppure quella su cui passa il puntatore. Le altre si schiariscono (regole in sito.css).
(function () {
  var section = document.querySelector(".about");
  if (!section) return;

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.classList.add("anim");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { section.classList.add("is-in"); io.disconnect(); }
      });
    }, { rootMargin: "0px 0px -20% 0px" }); // parte quando la sezione supera l'ultimo quinto dello schermo
    io.observe(section);
  }

  var items = Array.prototype.slice.call(section.querySelectorAll(".about__item"));
  if (!items.length) return;
  section.classList.add("about--live");

  function activate(item) {
    items.forEach(function (it) { it.classList.toggle("is-active", it === item); });
  }
  var ticking = false;
  function pick() {
    ticking = false;
    var mid = window.innerHeight / 2;
    var best = items[0], gap = Infinity;
    items.forEach(function (it) {
      var r = it.getBoundingClientRect();
      var d = Math.abs(r.top + r.height / 2 - mid);
      if (d < gap) { gap = d; best = it; }
    });
    activate(best);
  }
  function ask() { if (!ticking) { ticking = true; requestAnimationFrame(pick); } }
  window.addEventListener("scroll", ask, { passive: true });
  window.addEventListener("resize", ask);
  items.forEach(function (it) { it.addEventListener("mouseenter", function () { activate(it); }); });
  pick();
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
