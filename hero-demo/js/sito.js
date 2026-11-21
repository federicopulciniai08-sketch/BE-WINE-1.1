// Su iPhone Safari lo stato :active (la risposta al tocco dei tasti) si vede solo se la pagina ascolta i tocchi.
document.addEventListener("touchstart", function () {}, { passive: true });

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
    .map(function (a) {
      return '<a class="menu__voce" href="' + a.getAttribute("href") + '"' +
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
      '<li class="menu__dove">Corso Umberto I, 423 · Montesilvano<br>Martedì – sabato 17–00:30</li>' +
    "</ul>";
  document.body.appendChild(menu);
  // le voci entrano una dopo l'altra: il ritardo si mette da qui e non con un attributo style nell'HTML,
  // così le regole di sicurezza (Content-Security-Policy in vercel.json) possono vietare gli stili scritti nella pagina
  Array.prototype.forEach.call(menu.querySelectorAll(".menu__voce"), function (a, i) { a.style.setProperty("--i", i); });

  // Apertura e chiusura animate (21 novembre 2026): il menu entra da destra, dal lato del tasto toccato,
  // ed esce dalla stessa parte. È una transizione e non un'animazione fissa: se si tocca di nuovo a metà,
  // il pannello torna indietro da dove si trova, senza salti. Il dialogo si chiude davvero solo a pannello uscito.
  var tasti = [btn]; // i tasti che aprono il menu: quello della barra e, nella home, quello della barra che ricompare
  function segna(aperto) { tasti.forEach(function (t) { t.setAttribute("aria-expanded", String(aperto)); }); }
  function apri(e) {
    // la riga in alto del menu cade dove sta il tasto toccato, qualunque pagina sia
    var da = (e && e.currentTarget) || btn;
    menu.style.setProperty("--menu-su", Math.max(0, da.getBoundingClientRect().top) + "px");
    if (!menu.open) menu.showModal();
    document.documentElement.classList.add("menu-aperto");
    segna(true);
    void menu.offsetWidth; // il browser registra il pannello fuori schermo, così la transizione parte
    menu.classList.add("is-open");
    menu.querySelector(".menu__chiudi").focus();
  }
  function chiudi() {
    if (!menu.open || !menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    segna(false);
    var fatto = false;
    function fine(e) {
      if (fatto || (e && e.target !== menu)) return;
      fatto = true;
      menu.removeEventListener("transitionend", fine);
      if (!menu.classList.contains("is-open")) menu.close(); // riaperto nel frattempo: resta aperto
    }
    menu.addEventListener("transitionend", fine);
    setTimeout(fine, 500); // se la transizione non parte (scheda in secondo piano), si chiude lo stesso
  }
  btn.addEventListener("click", apri);
  // Esc: chiusura animata anche da tastiera
  menu.addEventListener("cancel", function (e) { e.preventDefault(); chiudi(); });
  menu.addEventListener("close", function () {
    menu.classList.remove("is-open");
    document.documentElement.classList.remove("menu-aperto");
    segna(false);
  });
  menu.querySelector(".menu__chiudi").addEventListener("click", chiudi);
  // un tocco su una voce chiude il menu (il modulo Prenota si apre poi da solo)
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) chiudi(); });
  if (telefono.addEventListener) telefono.addEventListener("change", function () { if (!telefono.matches) chiudi(); });

  // Barra che ricompare risalendo (21 novembre 2026): solo nella home e solo su telefono.
  // Quando la barra della foto è uscita dallo schermo, scorrendo verso l'alto scende dall'alto una barra crema
  // con logo e tasto menu (stesso stile della barra rapida); scorrendo verso il basso torna su e lascia spazio.
  // Tornati in cima sparisce: lì c'è già la barra bianca sulla foto.
  if (!bar.closest(".hero")) return;
  var testa = document.createElement("div");
  testa.className = "testa";
  testa.innerHTML =
    '<a class="testa__brand" href="index.html"><img class="testa__scuro" src="img/logo-scuro.png" alt="Be Wine" width="776" height="254">' +
      '<img class="testa__chiaro" src="img/logo.png" alt="" width="776" height="254"></a>' +
    '<button class="menu-btn testa__menu" type="button" aria-label="Apri il menu" aria-expanded="false" aria-controls="menu-telefono">' +
      "<span></span><span></span><span></span></button>";
  document.body.appendChild(testa);
  var btnTesta = testa.querySelector(".testa__menu");
  btnTesta.addEventListener("click", apri);
  tasti.push(btnTesta);

  var SOGLIA = 8; // pixel di scorrimento prima di cambiare idea: i piccoli tremolii del dito non contano
  var ultimo = window.scrollY;
  var visibile = false;
  var inCoda = false;
  function mostra(si) {
    if (si === visibile) return;
    visibile = si;
    testa.classList.toggle("is-visible", si);
    testa.toggleAttribute("inert", !si); // nascosta, non si raggiunge col tasto Tab
  }
  testa.setAttribute("inert", "");
  var piede = document.querySelector(".footer");
  function guarda() {
    inCoda = false;
    var y = window.scrollY;
    // sopra il piede color vino la barra a vetro diventa chiara: logo e tre linee bianchi, come sulla foto
    testa.classList.toggle("su-scuro", !!piede && piede.getBoundingClientRect().top < testa.offsetHeight);
    // la barra della foto è ancora sullo schermo (o non siamo su telefono): la barra crema non serve
    if (!telefono.matches || bar.getBoundingClientRect().bottom > 0) { mostra(false); ultimo = y; return; }
    if (y < ultimo - SOGLIA) { mostra(true); ultimo = y; }
    else if (y > ultimo + SOGLIA) { mostra(false); ultimo = y; }
  }
  window.addEventListener("scroll", function () { if (!inCoda) { inCoda = true; requestAnimationFrame(guarda); } }, { passive: true });
  if (telefono.addEventListener) telefono.addEventListener("change", guarda);
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
