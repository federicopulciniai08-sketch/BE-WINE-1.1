// Un clic veloce dura meno di 100 ms: tengo lo stato "premuto" almeno 160 ms
// perché colore e ingrandimento si vedano davvero.
document.querySelectorAll(".nav__link").forEach(function (link) {
  var down = 0;
  link.addEventListener("pointerdown", function () {
    down = Date.now();
    link.classList.add("is-pressed");
  });
  function release() {
    var wait = Math.max(0, 160 - (Date.now() - down));
    setTimeout(function () { link.classList.remove("is-pressed"); }, wait);
  }
  link.addEventListener("pointerup", release);
  link.addEventListener("pointercancel", release);
  link.addEventListener("pointerleave", release);
});

// Barra rapida con Prenota: compare quando il menu e il tasto Prenota della prima schermata
// sono usciti dallo schermo. Su telefono si nasconde quando si arriva al piede, dove i contatti ci sono già.
(function () {
  var dock = document.querySelector("[data-dock]");
  var foot = document.querySelector(".footer");
  if (!dock || !("IntersectionObserver" in window)) return;
  var guardati = Array.prototype.slice.call(document.querySelectorAll(".bar, .hero__cta"));
  var telefono = window.matchMedia("(max-width: 760px)");
  var inVista = new Set();
  var piede = false;
  function aggiorna() {
    var mostra = inVista.size === 0 && !(telefono.matches && piede);
    dock.classList.toggle("is-visible", mostra);
    dock.toggleAttribute("inert", !mostra);
  }
  var io = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) {
      if (v.target === foot) piede = v.isIntersecting;
      else if (v.isIntersecting) inVista.add(v.target);
      else inVista.delete(v.target);
    });
    aggiorna();
  });
  guardati.forEach(function (el) { io.observe(el); });
  if (foot) io.observe(foot);
  if (telefono.addEventListener) telefono.addEventListener("change", aggiorna);
})();
