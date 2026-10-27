// Pagina L'enoteca: mappa delle cantine con i vini dentro, poi "Oltre il vino" per distillati e birre
(function () {
  var REG = window.REGIONI_ENOTECA;
  var CANT = window.CANTINE_ENOTECA;
  var PROD = {};
  window.PRODOTTI.forEach(function (p) { PROD[p.id] = p; });

  var mappa = document.querySelector("[data-mappa]");
  var elenco = document.querySelector("[data-elenco]");
  var titolo = document.querySelector("[data-titolo-regione]");
  var conteggio = document.querySelector("[data-conteggio]");
  var stato = { regione: "tutte", tipo: "tutti" };

  function haTipo(c, t) {
    return t === "tutti" || c.bottiglie.some(function (id) { return PROD[id] && PROD[id].tipo === t; });
  }
  function visibili() {
    return CANT.filter(function (c) {
      return (stato.regione === "tutte" || c.regione === stato.regione) && haTipo(c, stato.tipo);
    });
  }

  // Chiama fn una volta, quando la parte alta di el supera "quota" (frazione dell'altezza dello schermo)
  var inAttesa = [];
  function quandoVisibile(el, quota, fn) { inAttesa.push({ el: el, quota: quota, fn: fn }); controlla(); }
  var controlloInCoda = false;
  function controlla() {
    controlloInCoda = false;
    inAttesa = inAttesa.filter(function (o) {
      if (!o.el.isConnected) return false;
      var r = o.el.getBoundingClientRect();
      if (r.top < innerHeight * o.quota && r.bottom > 0) { o.fn(); return false; }
      return true;
    });
  }
  function accoda() { if (!controlloInCoda) { controlloInCoda = true; requestAnimationFrame(controlla); } }
  addEventListener("scroll", accoda, { passive: true });
  addEventListener("resize", accoda);

  // ---------- Scheda della cantina, con le sue bottiglie ----------
  var scheda = document.querySelector("[data-scheda]");
  scheda.querySelector("[data-chiudi]").addEventListener("click", function () { scheda.close(); });
  scheda.addEventListener("click", function (e) { if (e.target === scheda) scheda.close(); });
  function apriScheda(c) {
    scheda.querySelectorAll("[data-s]").forEach(function (el) { el.textContent = c[el.dataset.s]; });
    var box = scheda.querySelector("[data-bottiglie]");
    box.textContent = "";
    c.bottiglie.forEach(function (id) {
      var p = PROD[id];
      var li = document.createElement("li");
      li.innerHTML = '<img src="img/prodotti/' + p.foto + '" alt="" width="80" height="100">' +
        '<span><span class="tile__nick">' + p.tipo + '</span><span class="tile__name">' + p.nome + '</span>' +
        '<span class="tile__zone">' + p.cantina + '</span></span>';
      box.appendChild(li);
    });
    scheda.showModal();
  }

  // ---------- Mappa ----------
  var tip = document.querySelector("[data-tip]");
  var figura = mappa.parentElement;
  mappa.querySelectorAll("path").forEach(function (p) {
    var r = p.dataset.regione;
    if (!REG[r]) return;
    p.classList.add("has-wine");
    p.setAttribute("tabindex", "0");
    p.setAttribute("role", "button");
    p.setAttribute("aria-label", REG[r]);
    p.addEventListener("click", function () { scegliRegione(r); });
    p.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); scegliRegione(r); }
    });
    p.addEventListener("pointerenter", function () {
      tip.textContent = "Esplora le cantine " + window.DI_REGIONE[r];
      tip.classList.add("is-on");
    });
    p.addEventListener("pointermove", function (e) {
      var b = figura.getBoundingClientRect();
      tip.style.left = (e.clientX - b.left) + "px";
      tip.style.top = (e.clientY - b.top) + "px";
    });
    p.addEventListener("pointerleave", function () { tip.classList.remove("is-on"); });
  });

  // ---------- Filtri: regione e tipo di vino ----------
  function bottoni(box, valori, etichetta, alClic) {
    valori.forEach(function (v) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filter";
      b.dataset.v = v;
      b.textContent = etichetta(v);
      b.addEventListener("click", function () { alClic(v); });
      box.appendChild(b);
    });
    return function (scelto) {
      box.querySelectorAll(".filter").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.v === scelto)); });
    };
  }
  var segnaRegione = bottoni(document.querySelector("[data-filtri]"), ["tutte"].concat(Object.keys(REG)),
    function (v) { return v === "tutte" ? "Tutte" : REG[v]; }, scegliRegione);
  var segnaTipo = bottoni(document.querySelector("[data-tipi-vino]"), ["tutti"].concat(window.SEZIONI.vini.tipi),
    function (v) { return v === "tutti" ? "Tutti i vini" : v; }, function (t) { stato.tipo = t; disegna(); });

  function scegliRegione(r) { stato.regione = r; disegna(); }

  function disegna() {
    segnaRegione(stato.regione);
    segnaTipo(stato.tipo);
    // sulla mappa restano accese solo le regioni con cantine di quel tipo di vino
    mappa.querySelectorAll("path.has-wine").forEach(function (p) {
      var r = p.dataset.regione;
      var conTipo = CANT.some(function (c) { return c.regione === r && haTipo(c, stato.tipo); });
      p.classList.toggle("is-dim", !conTipo || (stato.regione !== "tutte" && r !== stato.regione));
    });
    var lista = visibili();
    titolo.textContent = stato.regione === "tutte" ? "Tutta Italia" : REG[stato.regione];
    conteggio.textContent = lista.length + (lista.length === 1 ? " cantina" : " cantine");
    elenco.textContent = "";
    lista.forEach(function (c, i) {
      var foto = c.bottiglie.map(function (id) {
        return '<img src="img/prodotti/' + PROD[id].foto + '" alt="" width="48" height="60" loading="lazy">';
      }).join("");
      var li = document.createElement("li");
      li.innerHTML =
        '<button class="card card--bottles" type="button">' +
          '<span><span class="tile__nick">' + c.soprannome + '</span>' +
          '<span class="card__name">' + c.nome + '</span>' +
          '<span class="tile__zone">' + c.zona + '</span></span>' +
          '<span class="card__thumbs">' + foto + '</span>' +
        '</button>';
      li.querySelector("button").addEventListener("click", function () { apriScheda(c); });
      // a ogni cambio di filtro le cantine rientrano una dopo l'altra (al massimo 240 ms di attesa)
      li.className = "is-entering";
      li.style.setProperty("--i", Math.min(i, 6));
      elenco.appendChild(li);
    });
  }
  disegna();

  // ---------- La mappa si disegna quando arriva sullo schermo ----------
  // prima i confini da nord a sud, poi il vino riempie le regioni con cantine
  (function () {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var percorsi = [].slice.call(mappa.querySelectorAll("path"));
    percorsi
      .map(function (p) { return { p: p, y: p.getBBox().y }; })
      .sort(function (a, b) { return a.y - b.y; })
      .forEach(function (o, k) {
        o.p.style.setProperty("--len", Math.ceil(o.p.getTotalLength()));
        var ritardo = Math.round(k * 30);
        if (o.p.classList.contains("has-wine")) ritardo += 700;
        o.p.style.setProperty("--d", ritardo + "ms");
      });
    mappa.classList.add("map-pending");
    quandoVisibile(mappa, 0.75, function () {
      mappa.classList.add("map-drawing");
      setTimeout(function () { mappa.classList.remove("map-pending"); }, 30);
      // finito il disegno tornano le transizioni normali (passaggio del mouse, filtri)
      setTimeout(function () { mappa.classList.remove("map-drawing"); }, 2600);
    });
  })();

  // ---------- Oltre il vino: galleria dei distillati ----------
  // Come la galleria di Tripletta: mentre la sezione scorre, ogni foto sale o scende per conto suo,
  // con un movimento ammorbidito. Qui gli spostamenti sono circa un terzo dei loro.
  var muro = document.querySelector("[data-galleria]");
  var sezione = muro.closest(".gallery");
  var distillati = window.PRODOTTI.filter(function (p) { return p.sezione === "distillati" && p.foto; });
  var stretto = matchMedia("(max-width: 760px)");
  var calmo = matchMedia("(prefers-reduced-motion: reduce)");
  // da dove parte e dove arriva ogni foto, in % della sua altezza (inizio sezione → fine sezione)
  var PERCORSI = [[18, -18], [-8, 14], [26, -6], [4, -22], [-14, 10], [22, 2]];
  var foto = [];

  function costruisci() {
    var n = stretto.matches ? 2 : 4;
    muro.textContent = "";
    var colonne = [];
    for (var i = 0; i < n; i += 1) {
      var col = document.createElement("div");
      col.className = "gallery__col";
      muro.appendChild(col);
      colonne.push(col);
    }
    foto = distillati.map(function (p, i) {
      var f = document.createElement("figure");
      f.className = "gallery__item" + (i % 3 === 1 ? " gallery__item--small" : "");
      f.innerHTML = '<span class="gallery__frame"><img src="img/prodotti/' + p.foto + '" alt="' + p.nome + '" width="800" height="1000" loading="lazy"></span>' +
        '<figcaption><span class="tile__nick">' + p.tipo + '</span><span class="tile__name">' + p.nome + '</span>' +
        '<span class="tile__zone">' + [p.cantina, p.zona].filter(Boolean).join(" · ") + '</span></figcaption>';
      colonne[i % n].appendChild(f);
      var percorso = PERCORSI[i % PERCORSI.length];
      return { el: f, da: percorso[0], a: percorso[1], ora: null };
    });
    aggiorna();
  }

  var giro = null;
  function aggiorna() {
    giro = null;
    if (calmo.matches) { foto.forEach(function (o) { o.el.style.transform = ""; }); return; }
    var r = sezione.getBoundingClientRect();
    // 0 quando la sezione entra dal basso, 1 quando esce dall'alto
    var p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
    var ancora = false;
    foto.forEach(function (o) {
      // su telefono le foto sono vicine: metà movimento, così non si coprono
      var meta = (o.da + (o.a - o.da) * p) * (stretto.matches ? 0.5 : 1);
      // ogni passo copre solo una parte della distanza: il movimento arriva morbido, senza scatti
      o.ora = o.ora === null ? meta : o.ora + (meta - o.ora) * 0.12;
      if (Math.abs(meta - o.ora) > 0.05) ancora = true;
      o.el.style.transform = "translate3d(0," + o.ora.toFixed(2) + "%,0)";
    });
    if (ancora) giro = requestAnimationFrame(aggiorna);
  }
  function chiedi() { if (!giro) giro = requestAnimationFrame(aggiorna); }
  addEventListener("scroll", chiedi, { passive: true });
  addEventListener("resize", chiedi);
  stretto.addEventListener("change", costruisci);
  costruisci();
})();
