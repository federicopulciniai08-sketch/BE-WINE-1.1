// Pagina L'enoteca: una mappa per regione (si apre sull'Abruzzo) con un segnaposto per ogni comune delle cantine.
// Regole prese dalla mappa "Syndicus" di Agence Van den Abeele: comuni chiari, al passaggio il comune si scurisce,
// compare il nome e gli altri segnaposti spariscono. Fuori dalla mappa, le frecce puntano verso le altre regioni
// trattate: cliccandole la vista scorre in quella direzione e arriva alla mappa della regione.
(function () {
  var REGIONI = window.REGIONI_ENOTECA;
  var IDS = Object.keys(REGIONI);
  var CANT = window.CANTINE_ENOTECA;
  var PROD = {};
  window.PRODOTTI.forEach(function (p) { PROD[p.id] = p; });

  var palco = document.querySelector("[data-palco]");
  var vistaBox = document.querySelector("[data-vista]");
  var elenco = document.querySelector("[data-elenco]");
  var titolo = document.querySelector("[data-titolo-regione]");
  var conteggio = document.querySelector("[data-conteggio]");
  var tutte = document.querySelector("[data-tutte]");
  var calmo = matchMedia("(prefers-reduced-motion: reduce)");
  var stato = { regione: IDS[0], comune: null, tipo: "tutti" };
  var vista = null; // la mappa sullo schermo: { id, el, punti }

  function bottiglieDi(c, t) {
    return c.bottiglie.filter(function (id) { return PROD[id] && (t === "tutti" || PROD[id].tipo === t); });
  }
  function visibili() {
    return CANT.filter(function (c) {
      return c.regione === stato.regione && (!stato.comune || c.comune === stato.comune) &&
        bottiglieDi(c, stato.tipo).length > 0;
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
    var lista = scheda.querySelector("[data-bottiglie]");
    lista.textContent = "";
    c.bottiglie.forEach(function (id) {
      var p = PROD[id];
      var li = document.createElement("li");
      // senza foto: al posto della bottiglia resta un riquadro vuoto della stessa misura, così i nomi restano in fila
      li.innerHTML = (p.foto ? '<img src="img/prodotti/' + p.foto + '" alt="" width="80" height="100">' : '<span class="sheet__nofoto" aria-hidden="true"></span>') +
        '<span><span class="tile__nick">' + p.tipo + '</span><span class="tile__name">' + p.nome + '</span>' +
        '<span class="tile__zone">' + p.cantina + '</span></span>';
      lista.appendChild(li);
    });
    scheda.showModal();
  }

  // ---------- Mappe: si caricano da img/mappe/ solo quando servono ----------
  // Aperta dal file (file://) fetch non funziona: le mappe arrivano da js/mappe.js (strumenti/mappe-js.py).
  var caricate = {};
  var mappeLocali = null;
  function daFile(percorso) {
    if (!mappeLocali) {
      mappeLocali = new Promise(function (ok, no) {
        if (window.MAPPE_SVG) return ok();
        var s = document.createElement("script");
        s.src = "js/mappe.js";
        s.onload = ok;
        s.onerror = function () { mappeLocali = null; no(new Error("js/mappe.js non trovato")); };
        document.head.appendChild(s);
      });
    }
    return mappeLocali.then(function () {
      var testo = window.MAPPE_SVG && window.MAPPE_SVG[percorso];
      if (!testo) throw new Error("Mappa non trovata: " + percorso);
      return testo;
    });
  }
  function carica(id) {
    if (!caricate[id] && location.protocol === "file:") {
      caricate[id] = daFile(REGIONI[id].mappa);
      caricate[id].catch(function () { delete caricate[id]; });
    }
    if (!caricate[id]) {
      caricate[id] = fetch(REGIONI[id].mappa).then(function (r) {
        if (!r.ok) throw new Error("Mappa non trovata: " + REGIONI[id].mappa);
        return r.text();
      });
      caricate[id].catch(function () { delete caricate[id]; });
    }
    return caricate[id];
  }

  // segnaposto come quelli di Google Maps: goccia vino con un punto crema, la punta sul comune
  var GOCCIA = '<svg class="abr__drop" viewBox="0 0 24 34" aria-hidden="true">' +
    '<path d="M12 33.2C9.6 29.5 .5 20.3 .5 12a11.5 11.5 0 0 1 23 0c0 8.3-9.1 17.5-11.5 21.2z"/>' +
    '<circle cx="12" cy="12" r="4.3"/></svg>';

  function costruisciVista(id, testo) {
    var el = document.createElement("div");
    el.className = "abr";
    el.innerHTML = testo + '<div class="abr__pins"></div>';
    var svg = el.querySelector("svg");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Mappa: " + REGIONI[id].nome + " con i comuni delle nostre cantine");
    // ogni regione ha la sua forma: sta tutta dentro il riquadro quadrato, al centro
    var vb = svg.viewBox.baseVal;
    var r = vb.width / vb.height;
    el.style.width = (r >= 1 ? 100 : r * 100) + "%";
    el.style.height = (r >= 1 ? 100 / r : 100) + "%";
    vistaBox.appendChild(el);

    var v = { id: id, el: el, punti: [] };
    var comuni = {};
    svg.querySelectorAll("[data-comune]").forEach(function (p) { comuni[p.dataset.comune] = p; });
    CANT.forEach(function (c) {
      if (c.regione !== id || !c.comune) return;
      var path = comuni[c.comune];
      if (!path) { console.warn("Comune non trovato sulla mappa:", c.comune); return; }
      var punto = v.punti.filter(function (o) { return o.comune === c.comune; })[0];
      if (!punto) { punto = { comune: c.comune, path: path, cantine: [] }; v.punti.push(punto); }
      punto.cantine.push(c);
    });

    var strato = el.querySelector(".abr__pins");
    v.punti.forEach(function (o, k) {
      var b = o.path.getBBox();
      o.path.classList.add("has-wine");
      var pin = document.createElement("button");
      pin.type = "button";
      pin.className = "abr__pin";
      pin.style.left = ((b.x + b.width / 2 - vb.x) / vb.width * 100) + "%";
      pin.style.top = ((b.y + b.height / 2 - vb.y) / vb.height * 100) + "%";
      pin.style.setProperty("--i", k);
      pin.innerHTML = GOCCIA + '<span class="abr__label"><span class="abr__name">' +
        o.cantine.map(function (c) { return c.nome; }).join(" · ") +
        '</span><span class="abr__place">' + o.comune + '</span></span>';
      o.pin = pin;
      strato.appendChild(pin);

      function scegli() {
        if (o.cantine.length === 1) apriScheda(o.cantine[0]);
        else { stato.comune = o.comune; disegna(); }
      }
      pin.addEventListener("click", scegli);
      o.path.addEventListener("click", function () { if (!pin.classList.contains("is-off")) scegli(); });
      [pin, o.path].forEach(function (x) {
        x.addEventListener("pointerenter", function () { accendi(o); });
        x.addEventListener("pointerleave", function () { accendi(null); });
      });
      pin.addEventListener("focus", function () { accendi(o); });
      pin.addEventListener("blur", function () { accendi(null); });
    });

    var confine = svg.querySelector(".abr__reg");
    confine.style.setProperty("--len", Math.ceil(confine.getTotalLength()));
    return v;
  }

  // Entrata di una mappa: il confine si disegna, i comuni compaiono, poi i segnaposti cadono uno alla volta
  function entra(v) {
    v.el.classList.add("abr--in");
    void v.el.offsetWidth; // il browser registra prima lo stato di partenza, così la transizione parte
    v.el.classList.remove("abr--pending");
    // finita l'entrata tornano le transizioni normali (passaggio del mouse, filtri)
    setTimeout(function () { v.el.classList.remove("abr--in"); }, 450 + v.punti.length * 70 + 500);
  }

  // un solo segnaposto acceso: il suo comune si scurisce, il nome compare, gli altri spariscono
  function accendi(o) {
    if (!vista) return;
    if (o && o.pin.classList.contains("is-off")) o = null;
    vista.el.classList.toggle("is-hovering", !!o);
    vista.punti.forEach(function (p) {
      p.pin.classList.toggle("is-hot", p === o);
      p.path.classList.toggle("is-hot", p === o);
    });
  }
  function puntoDi(c) {
    return vista && vista.id === c.regione ? vista.punti.filter(function (o) { return o.comune === c.comune; })[0] : null;
  }

  // ---------- Frecce verso le altre regioni ----------
  // La direzione è quella vera sulla carta: dal centro di questa regione al centro dell'altra.
  // Ogni freccia sta sul bordo del riquadro, dove la sua direzione lo incontra.
  var frecce = [];
  var KX = Math.cos(44 * Math.PI / 180); // un grado di longitudine è più corto di uno di latitudine
  var DISTANZA_MINIMA = 40;              // gradi tra due frecce, così non puntano mai tutte uguali
  function gradiNormali(g) { return ((g + 180) % 360 + 360) % 360 - 180; }

  // Le regioni quasi nella stessa direzione (Veneto e Trentino viste dall'Abruzzo) si aprono a ventaglio:
  // l'ordine resta quello vero, la più a ovest resta la più a sinistra.
  function direzioni(da) {
    var lista = IDS.filter(function (id) { return id !== stato.regione; }).map(function (id) {
      var a = REGIONI[id].centro;
      return { id: id, g: Math.atan2(-(a[1] - da[1]), (a[0] - da[0]) * KX) * 180 / Math.PI };
    });
    if (lista.length < 2) return lista;
    var mx = 0, my = 0;
    lista.forEach(function (o) { mx += Math.cos(o.g * Math.PI / 180); my += Math.sin(o.g * Math.PI / 180); });
    var media = Math.atan2(my, mx) * 180 / Math.PI;
    lista.forEach(function (o) { o.r = gradiNormali(o.g - media); });
    lista.sort(function (a, b) { return a.r - b.r; });
    for (var giro = 0; giro < 30; giro += 1) {
      for (var k = 1; k < lista.length; k += 1) {
        var manca = DISTANZA_MINIMA - (lista[k].r - lista[k - 1].r);
        if (manca > 0) { lista[k - 1].r -= manca / 2; lista[k].r += manca / 2; }
      }
    }
    lista.forEach(function (o) { o.g = gradiNormali(o.r + media); });
    return lista;
  }

  function creaFrecce() {
    frecce.forEach(function (f) { f.el.remove(); });
    frecce = [];
    direzioni(REGIONI[stato.regione].centro).forEach(function (o) {
      var id = o.id;
      var dx = Math.cos(o.g * Math.PI / 180), dy = Math.sin(o.g * Math.PI / 180);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "abr-arrow";
      b.setAttribute("aria-label", "Vai alla mappa: " + REGIONI[id].nome);
      b.style.setProperty("--a", o.g.toFixed(1) + "deg");
      b.innerHTML = '<span class="abr-arrow__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        '<span class="abr-arrow__label">' + REGIONI[id].nome + '</span>';
      var f = { id: id, el: b, dx: dx, dy: dy };
      b.addEventListener("click", function () { vai(f); });
      palco.appendChild(b);
      frecce.push(f);
    });
    posizionaFrecce();
  }
  function posizionaFrecce() {
    var W = palco.clientWidth, H = palco.clientHeight;
    var R = palco.querySelector(".abr-arrow__icon") ? palco.querySelector(".abr-arrow__icon").offsetWidth / 2 : 24; // metà del cerchio
    var M = R + 6;       // il centro del cerchio sta a 24 px dal bordo del riquadro
    var SPAZIO = 12;
    var lati = { top: [], bottom: [], left: [], right: [] };
    // su telefono ai lati non c'è posto: le frecce stanno solo sopra o sotto la mappa
    var stretto = W < 480;
    frecce.forEach(function (f) {
      var tx = f.dx ? (W / 2 - M) / Math.abs(f.dx) : Infinity;
      var ty = f.dy ? (H / 2 - M) / Math.abs(f.dy) : Infinity;
      if (stretto) {
        f.lato = f.dy < 0 ? "top" : "bottom";
        f.x = W / 2 + f.dx * (H / 2 - M) / Math.max(Math.abs(f.dy), 0.2);
        f.y = f.dy < 0 ? M : H - M;
        f.el.dataset.lato = f.lato;
        lati[f.lato].push(f);
        return;
      }
      var t = Math.min(tx, ty);
      f.x = W / 2 + f.dx * t;
      f.y = H / 2 + f.dy * t;
      f.lato = ty <= tx ? (f.dy < 0 ? "top" : "bottom") : (f.dx < 0 ? "left" : "right");
      f.el.dataset.lato = f.lato;
      lati[f.lato].push(f);
    });
    // sopra e sotto: nome a destra della freccia; se due frecce si toccano, si scostano lungo il bordo
    ["top", "bottom"].forEach(function (lato) {
      var fila = lati[lato].sort(function (a, b) { return a.x - b.x; });
      var fine = -Infinity;
      fila.forEach(function (f) {
        f.w = f.el.offsetWidth;
        f.x0 = Math.max(f.x - R, fine + SPAZIO, 0);
        fine = f.x0 + f.w;
      });
      var limite = W;
      fila.slice().reverse().forEach(function (f) {
        f.x0 = Math.min(f.x0, limite - f.w);
        limite = f.x0 - SPAZIO;
      });
      fila.forEach(function (f) {
        f.el.style.left = f.x0 + "px";
        f.el.style.top = (f.y - R) + "px";
      });
    });
    // a sinistra e a destra: nome sotto la freccia
    ["left", "right"].forEach(function (lato) {
      var fila = lati[lato].sort(function (a, b) { return a.y - b.y; });
      var fine = -Infinity;
      fila.forEach(function (f) {
        var y0 = Math.max(f.y - R, fine + SPAZIO);
        f.el.style.top = y0 + "px";
        f.el.style.left = (lato === "left" ? f.x - R : f.x + R - f.el.offsetWidth) + "px";
        fine = y0 + f.el.offsetHeight;
      });
    });
  }
  if (window.ResizeObserver) new ResizeObserver(posizionaFrecce).observe(palco);
  else addEventListener("resize", posizionaFrecce);

  // Viaggio verso un'altra regione: la mappa vecchia scivola via all'indietro, la nuova arriva dalla direzione
  // della freccia, come se la carta scorresse sotto gli occhi. Poi i segnaposti cadono sulla nuova.
  var inViaggio = false;
  function vai(f) {
    if (inViaggio || f.id === stato.regione) return;
    inViaggio = true;
    f.el.classList.add("is-going");
    carica(f.id).then(function (testo) {
      var vecchia = vista;
      var nuova = costruisciVista(f.id, testo);
      vista = nuova;
      stato.regione = f.id;
      stato.comune = null;
      disegna();
      if (calmo.matches || !nuova.el.animate) {
        vecchia.el.remove();
        creaFrecce();
        inViaggio = false;
        return;
      }
      var d = 45; // quanto scorre la carta, in % della mappa
      vecchia.el.classList.add("is-leaving");
      vecchia.el.animate([
        { transform: "translate(0, 0)", opacity: 1 },
        { transform: "translate(" + (-f.dx * d) + "%, " + (-f.dy * d) + "%)", opacity: 0 }
      ], { duration: 420, easing: "cubic-bezier(.55, 0, .45, 1)", fill: "forwards" });
      // la mappa vecchia se ne va comunque, anche se il browser ha messo in pausa le animazioni
      setTimeout(function () { vecchia.el.remove(); }, 480);
      nuova.el.classList.add("abr--pending");
      nuova.el.animate([
        { transform: "translate(" + (f.dx * d) + "%, " + (f.dy * d) + "%)", opacity: 0 },
        { transform: "translate(0, 0)", opacity: 1 }
      ], { duration: 520, delay: 60, easing: "cubic-bezier(.16, 1, .3, 1)", fill: "backwards" });
      entra(nuova);
      frecce.forEach(function (x) { x.el.classList.add("is-leaving"); });
      setTimeout(function () { creaFrecce(); inViaggio = false; }, 460);
    }).catch(function (e) {
      console.error(e);
      f.el.classList.remove("is-going");
      inViaggio = false;
    });
  }

  // ---------- Filtro per tipo di vino ----------
  var tipiBox = document.querySelector("[data-tipi-vino]");
  ["tutti"].concat(window.SEZIONI.vini.tipi).forEach(function (v) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "filter";
    b.dataset.v = v;
    b.textContent = v === "tutti" ? "Tutti i vini" : v;
    b.addEventListener("click", function () { stato.tipo = v; disegna(); });
    tipiBox.appendChild(b);
  });
  tutte.addEventListener("click", function () { stato.comune = null; disegna(); });

  // L'elenco mostra le prime 4 cantine; il tasto "Vedi tutte" apre le altre ("Mostra meno" le richiude).
  // Toccando un segnaposto restano le sole cantine di quel comune, tutte.
  var PRIME = 4;
  var apriElenco = document.querySelector("[data-apri-elenco]");
  var apriTesto = document.querySelector("[data-apri-testo]");
  var elencoAperto = false;
  apriElenco.addEventListener("click", function () {
    elencoAperto = !elencoAperto;
    var giaVisibili = elencoAperto ? PRIME : 0;
    disegna(giaVisibili);
    // richiudendo, se il tasto è finito sopra lo schermo lo si riporta in vista
    if (!elencoAperto && apriElenco.getBoundingClientRect().top < 0) apriElenco.scrollIntoView({ block: "center" });
  });

  // salta: quante cantine in cima erano già sullo schermo (non rifanno l'entrata)
  function disegna(salta) {
    salta = salta || 0;
    tipiBox.querySelectorAll(".filter").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.v === stato.tipo)); });

    // sulla mappa restano solo i segnaposti con vini del tipo scelto
    (vista ? vista.punti : []).forEach(function (o) {
      var n = o.cantine.reduce(function (s, c) { return s + bottiglieDi(c, stato.tipo).length; }, 0);
      var spento = n === 0 || (stato.comune && o.comune !== stato.comune);
      o.pin.classList.toggle("is-off", spento);
      o.pin.tabIndex = spento ? -1 : 0;
      o.pin.setAttribute("aria-label", o.cantine.map(function (c) { return c.nome; }).join(", ") + ", " + o.comune + ": " + n + (n === 1 ? " vino" : " vini"));
      o.path.classList.toggle("is-dim", spento);
    });

    var lista = visibili();
    titolo.textContent = stato.comune || REGIONI[stato.regione].nome;
    tutte.hidden = !stato.comune;
    conteggio.textContent = lista.length + (lista.length === 1 ? " cantina" : " cantine");
    var tutteVisibili = elencoAperto || !!stato.comune || lista.length <= PRIME;
    apriElenco.hidden = !!stato.comune || lista.length <= PRIME;
    apriElenco.setAttribute("aria-expanded", String(elencoAperto));
    apriTesto.textContent = elencoAperto ? "Mostra meno" : "Vedi tutte";
    if (!tutteVisibili) lista = lista.slice(0, PRIME);
    elenco.textContent = "";
    if (!CANT.some(function (c) { return c.regione === stato.regione; })) {
      var vuoto = document.createElement("li");
      vuoto.className = "draft-note atlas__empty";
      vuoto.textContent = "Cantine " + (REGIONI[stato.regione].nome === "Veneto" ? "del Veneto" : "di questa regione") + " da inserire: nomi e comuni da chiedere al titolare.";
      elenco.appendChild(vuoto);
    }
    lista.forEach(function (c, i) {
      // nell'elenco al massimo tre foto; le bottiglie senza foto non compaiono qui, solo nella scheda
      var foto = c.bottiglie.filter(function (id) { return PROD[id].foto; }).slice(0, 3).map(function (id) {
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
      var bottone = li.querySelector("button");
      bottone.addEventListener("click", function () { apriScheda(c); });
      // passando sulla cantina nell'elenco si accende il suo segnaposto
      bottone.addEventListener("pointerenter", function () { accendi(puntoDi(c)); });
      bottone.addEventListener("pointerleave", function () { accendi(null); });
      // a ogni cambio di filtro le cantine rientrano una dopo l'altra (al massimo 240 ms di attesa)
      if (i >= salta) {
        li.className = "is-entering";
        li.style.setProperty("--i", Math.min(i - salta, 6));
      }
      elenco.appendChild(li);
    });
  }
  disegna();

  // ---------- Prima mappa ----------
  carica(stato.regione).then(function (testo) {
    vista = costruisciVista(stato.regione, testo);
    disegna();
    creaFrecce();
    if (!calmo.matches) {
      vista.el.classList.add("abr--pending");
      var prima = vista;
      quandoVisibile(palco, 0.8, function () { entra(prima); });
    }
    // le altre mappe si preparano mentre il visitatore guarda la prima
    setTimeout(function () { IDS.forEach(function (id) { carica(id).catch(function () {}); }); }, 1500);
  }).catch(function (e) { console.error(e); });
})();
