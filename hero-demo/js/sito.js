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

// Menu del telefono (11 novembre 2026), come nel riferimento: sulla barra restano il logo e il tasto menu,
// che apre un menu a tutto schermo. Le pagine si prendono dal menu del computer, così restano sempre uguali.
// Va costruito prima di js/prenota.js, che collega al modulo anche il "Prenota un tavolo" di questo menu.
(function () {
  var bar = document.querySelector(".hero .bar, .page-head .bar");
  var nav = bar && bar.querySelector(".nav");
  if (!nav || !window.HTMLDialogElement) return;
  var prenota = nav.querySelector(".nav__link--cta");
  var telefono = window.matchMedia("(max-width: 760px)");

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "menu-btn";
  btn.setAttribute("aria-label", "Apri il menu");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "menu-telefono");
  btn.innerHTML = "<span></span><span></span><span></span>";
  bar.appendChild(btn);

  var menu = document.createElement("dialog");
  menu.className = "menu";
  menu.id = "menu-telefono";
  menu.setAttribute("aria-label", "Menu");
  var voci = Array.prototype.filter.call(nav.querySelectorAll(".nav__link"), function (a) { return a !== prenota; })
    .map(function (a, i) {
      return '<a class="menu__voce" style="--i:' + i + '" href="' + a.getAttribute("href") + '"' +
        (a.hasAttribute("aria-current") ? ' aria-current="page"' : "") + ">" + a.textContent + "</a>";
    }).join("");
  menu.innerHTML =
    '<div class="menu__top">' +
      '<a class="menu__brand" href="index.html"><img src="img/logo-scuro.png" alt="Be Wine" width="776" height="254"></a>' +
      '<button class="menu__chiudi" type="button" aria-label="Chiudi il menu"><span></span><span></span></button>' +
    "</div>" +
    '<nav class="menu__voci" aria-label="Pagine">' + voci + "</nav>" +
    (prenota ? '<a class="btn btn--pieno menu__prenota" href="' + prenota.getAttribute("href") + '" target="_blank" rel="noopener">Prenota un tavolo</a>' : "") +
    '<ul class="menu__altro">' +
      '<li><a href="tel:+393351618047">Chiama 335 161 8047</a></li>' +
      '<li><a href="https://www.instagram.com/bewinemontesilvano/" target="_blank" rel="noopener">Instagram</a></li>' +
      '<li><a href="https://www.facebook.com/BeWinePescara/" target="_blank" rel="noopener">Facebook</a></li>' +
      '<li class="menu__dove">Corso Umberto I, 423 · Montesilvano<br>Martedì – venerdì 17–24 · Sabato 18–24</li>' +
    "</ul>";
  document.body.appendChild(menu);

  function chiudi() { if (menu.open) menu.close(); }
  btn.addEventListener("click", function () {
    // la riga in alto del menu cade dove sta la barra, qualunque pagina sia
    menu.style.setProperty("--menu-su", Math.max(0, btn.getBoundingClientRect().top) + "px");
    menu.showModal();
    document.documentElement.classList.add("menu-aperto");
    btn.setAttribute("aria-expanded", "true");
    menu.querySelector(".menu__chiudi").focus();
  });
  menu.addEventListener("close", function () {
    document.documentElement.classList.remove("menu-aperto");
    btn.setAttribute("aria-expanded", "false");
  });
  menu.querySelector(".menu__chiudi").addEventListener("click", chiudi);
  // un tocco su una voce chiude il menu (il modulo Prenota si apre poi da solo)
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) chiudi(); });
  if (telefono.addEventListener) telefono.addEventListener("change", function () { if (!telefono.matches) chiudi(); });
})();

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
