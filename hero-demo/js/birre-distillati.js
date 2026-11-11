// Pagina Birre e distillati: due schede (Distillati, Birre) disegnate dai dati di js/prodotti.js.
// Per aggiungere una bottiglia, una birra o un cocktail basta una riga in prodotti.js: qui non si tocca niente.
(function () {
  "use strict";
  var PRODOTTI = window.PRODOTTI || [];
  var SEZIONI = window.SEZIONI || {};
  var COCKTAIL = window.COCKTAIL || [];
  var PER_ID = {};
  PRODOTTI.forEach(function (p) { PER_ID[p.id] = p; });
  function della(sezione) { return PRODOTTI.filter(function (p) { return p.sezione === sezione; }); }

  function crea(tag, classe, testo) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (testo) el.textContent = testo;
    return el;
  }
  function blocco(el) { return el.closest("[data-blocco]"); }

  // Foto della bottiglia; se manca, un riquadro col nome
  function foto(p, classe) {
    var box = crea("span", "tile__media" + (p.foto ? " tile__media--photo" : "") + (classe ? " " + classe : ""));
    if (p.foto) {
      var img = crea("img");
      img.loading = "lazy";
      img.width = 800;
      img.height = 1000;
      img.alt = "";
      img.src = "img/prodotti/" + p.foto;
      box.appendChild(img);
    } else {
      box.appendChild(crea("span", "tile__label", p.nome));
    }
    return box;
  }
  // Tipo scritto in etichetta, nome, provenienza: le righe vuote non compaiono
  function scritte(p, classeNome, tagNome) {
    var pezzi = [];
    if (p.cantina || p.tipo) pezzi.push(crea("span", "tile__nick", p.cantina || p.tipo));
    pezzi.push(crea(tagNome || "span", classeNome, p.nome));
    if (p.zona) pezzi.push(crea("span", "tile__zone", p.zona));
    return pezzi;
  }

  // ================= Scheda Distillati =================
  var distillati = della("distillati");

  // 1. I più richiesti: i prodotti con top: true, più grandi degli altri
  var topBox = document.querySelector("[data-top]");
  var richiesti = distillati.filter(function (p) { return p.top; });
  topBox.textContent = "";
  blocco(topBox).hidden = richiesti.length === 0;
  richiesti.forEach(function (p) {
    var li = crea("li", "feature__item");
    li.appendChild(foto(p, "feature__photo"));
    var testo = crea("div", "feature__text");
    scritte(p, "feature__name", "h3").forEach(function (x) { testo.appendChild(x); });
    li.appendChild(testo);
    topBox.appendChild(li);
  });

  // 2. Scaffale: tutte le bottiglie, con i filtri di SEZIONI. Un filtro senza prodotti non compare.
  var filtriBox = document.querySelector("[data-filtri]");
  var scaffale = document.querySelector("[data-scaffale]");
  var tipi = ((SEZIONI.distillati || {}).tipi || []).filter(function (t) {
    return distillati.some(function (p) { return p.tipo === t; });
  });
  var scelto = "tutti";
  filtriBox.textContent = "";
  filtriBox.hidden = tipi.length < 2; // con un tipo solo non c'è niente da filtrare
  ["tutti"].concat(tipi).forEach(function (t) {
    var b = crea("button", "filter", t === "tutti" ? "Tutti" : t);
    b.type = "button";
    b.dataset.v = t;
    b.addEventListener("click", function () { scelto = t; disegnaScaffale(); });
    filtriBox.appendChild(b);
  });
  function disegnaScaffale() {
    filtriBox.querySelectorAll(".filter").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.v === scelto));
    });
    scaffale.textContent = "";
    distillati.filter(function (p) { return scelto === "tutti" || p.tipo === scelto; }).forEach(function (p, i) {
      // a ogni cambio di filtro le bottiglie rientrano una dopo l'altra (al massimo 240 ms di attesa)
      var li = crea("li", "is-entering");
      li.style.setProperty("--i", Math.min(i, 6));
      var casella = crea("div", "tile");
      casella.appendChild(foto(p));
      scritte(p, "tile__name").forEach(function (x) { casella.appendChild(x); });
      li.appendChild(casella);
      scaffale.appendChild(li);
    });
  }
  blocco(scaffale).hidden = distillati.length === 0;
  disegnaScaffale();

  // 3. Cocktail: nome e ingredienti, ognuno legato al distillato con cui è fatto.
  //    Finché COCKTAIL (in prodotti.js) è vuoto la sezione non compare.
  var cocktailBox = document.querySelector("[data-cocktail]");
  var cocktail = COCKTAIL.filter(function (c) { return c && c.nome; });
  cocktailBox.textContent = "";
  blocco(cocktailBox).hidden = cocktail.length === 0;
  cocktail.forEach(function (c) {
    var d = PER_ID[c.distillato];
    if (c.distillato && !d) console.warn('Cocktail "' + c.nome + '": in prodotti.js non c\'è un distillato con id', c.distillato);
    var li = crea("li", "row");
    li.appendChild(crea("span", "row__name", c.nome));
    var dx = crea("span", "row__side");
    if (c.ingredienti) dx.appendChild(crea("span", "row__text", c.ingredienti));
    if (d) dx.appendChild(crea("span", "tile__nick", "Con " + d.nome));
    li.appendChild(dx);
    cocktailBox.appendChild(li);
  });

  // ================= Scheda Birre =================
  // Lista scritta: birrificio, nome, stile, formato. Il campo "foto" c'è già nei dati ma qui non si usa ancora.
  var birreBox = document.querySelector("[data-birre]");
  birreBox.textContent = "";
  della("birre").forEach(function (p) {
    var li = crea("li", "row");
    var sx = crea("span", "row__main");
    if (p.birrificio || p.daConfermare) {
      var sopra = crea("span", "tile__nick", p.birrificio || "");
      if (p.daConfermare) sopra.appendChild(crea("span", "row__flag", (p.birrificio ? " · " : "") + "da confermare"));
      sx.appendChild(sopra);
    }
    sx.appendChild(crea("span", "row__name", p.nome));
    li.appendChild(sx);
    var dx = crea("span", "row__metas");
    if (p.stile) dx.appendChild(crea("span", "row__meta", p.stile));
    if (p.formato) dx.appendChild(crea("span", "row__meta", p.formato));
    li.appendChild(dx);
    birreBox.appendChild(li);
  });

  // ================= Le due schede =================
  // La scheda aperta si legge dall'indirizzo (#distillati, #birre): così si può mandare il link giusto.
  var tasti = Array.prototype.slice.call(document.querySelectorAll("[data-tab]"));
  var pannelli = Array.prototype.slice.call(document.querySelectorAll("[data-pannello]"));
  var nomi = tasti.map(function (t) { return t.dataset.tab; });
  function daIndirizzo() {
    var h = decodeURIComponent(location.hash.replace("#", "")).toLowerCase();
    return nomi.indexOf(h) >= 0 ? h : null;
  }
  function apri(k) {
    tasti.forEach(function (t) {
      var aperta = t.dataset.tab === k;
      t.setAttribute("aria-selected", String(aperta));
      t.tabIndex = aperta ? 0 : -1;
    });
    pannelli.forEach(function (p) { p.hidden = p.dataset.pannello !== k; });
  }
  function scegli(k, fuoco) {
    // l'indirizzo cambia senza aggiungere un passo alla cronologia: "indietro" torna alla pagina di prima
    if (history.replaceState) history.replaceState(null, "", "#" + k);
    else location.hash = k;
    apri(k);
    if (fuoco) tasti[nomi.indexOf(k)].focus();
  }
  tasti.forEach(function (t, i) {
    t.addEventListener("click", function (e) { e.preventDefault(); scegli(t.dataset.tab); });
    // frecce della tastiera: si passa da una scheda all'altra
    t.addEventListener("keydown", function (e) {
      var passo = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (e.key === "Home") scegli(nomi[0], true);
      else if (e.key === "End") scegli(nomi[nomi.length - 1], true);
      else if (passo) scegli(nomi[(i + passo + nomi.length) % nomi.length], true);
      else if (e.key === " ") scegli(t.dataset.tab);
      else return;
      e.preventDefault();
    });
  });
  // gli altri indirizzi con # (privacy, cookie) non cambiano scheda
  addEventListener("hashchange", function () { var k = daIndirizzo(); if (k) apri(k); });
  apri(daIndirizzo() || nomi[0]); // senza indirizzo, o con uno sbagliato, si apre la prima
})();
