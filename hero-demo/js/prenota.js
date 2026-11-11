// Prenota: ogni link "Prenota" (WhatsApp con "prenotare" nel testo) apre una piccola finestra
// con tre cose sole: nome, persone, giorno. Al tasto si apre WhatsApp con il messaggio già completo.
// Se questo script non parte, il link resta quello di prima e porta comunque a WhatsApp.
(function () {
  "use strict";
  if (!window.HTMLDialogElement) return;

  var NUMERO_WA = "393351618047";
  // 0 = domenica … 6 = sabato. Orari da DECISIONI.md, da confermare col titolare.
  var ORARI = { 2: [17, 24], 3: [17, 24], 4: [17, 24], 5: [17, 24], 6: [18, 24] };
  var ULTIMO_ARRIVO = 22.5; // dopo le 22:30 "stasera" non si propone più
  var GIORNI_MOSTRATI = 6;
  var MAX_PERSONE = 20;

  var link = Array.prototype.filter.call(document.querySelectorAll('a[href*="wa.me"]'), function (a) {
    return /prenotare/i.test(decodeURIComponent(a.getAttribute("href")));
  });
  if (!link.length) return;

  var giorniLunghi = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" });
  var giornoSett = new Intl.DateTimeFormat("it-IT", { weekday: "short" });
  var giornoNum = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short" });

  // data e ora di adesso a Montesilvano, qualunque sia il fuso di chi guarda
  function adessoRoma() {
    var p = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { data: new Date(+p.year, +p.month - 1, +p.day, 12), ore: +p.hour + +p.minute / 60 };
  }
  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function daIso(s) {
    var x = s.split("-");
    return new Date(+x[0], +x[1] - 1, +x[2], 12);
  }

  // ---------- la finestra ----------
  var box = document.createElement("dialog");
  box.className = "sheet sheet--prenota";
  box.setAttribute("aria-labelledby", "prenota-titolo");
  box.innerHTML =
    '<button class="sheet__close" type="button" data-chiudi aria-label="Chiudi">×</button>' +
    '<h2 class="sheet__name" id="prenota-titolo">Prenota un tavolo</h2>' +
    '<form class="prenota" novalidate>' +
      '<div class="prenota__campo">' +
        '<label class="prenota__label" for="prenota-nome">Nome</label>' +
        '<input class="prenota__input" id="prenota-nome" name="nome" type="text" autocomplete="given-name" autocapitalize="words" enterkeyhint="next" required>' +
        '<p class="prenota__errore" id="prenota-errore-nome" hidden>Scrivi il tuo nome.</p>' +
      "</div>" +
      '<div class="prenota__campo">' +
        '<span class="prenota__label" id="prenota-persone-label">Persone</span>' +
        '<div class="prenota__passi" role="group" aria-labelledby="prenota-persone-label">' +
          '<button class="prenota__passo" type="button" data-meno aria-label="Una persona in meno">−</button>' +
          '<output class="prenota__numero" data-persone aria-live="polite">2</output>' +
          '<button class="prenota__passo" type="button" data-piu aria-label="Una persona in più">+</button>' +
        "</div>" +
      "</div>" +
      '<fieldset class="prenota__campo">' +
        '<legend class="prenota__label">Giorno</legend>' +
        '<div class="prenota__giorni" data-giorni></div>' +
        '<input class="prenota__input prenota__altra" type="date" data-altra hidden aria-label="Scegli un altro giorno">' +
        '<p class="prenota__errore" data-errore-giorno hidden></p>' +
      "</fieldset>" +
      '<button class="btn btn--pieno prenota__invia" type="submit">Invia su WhatsApp</button>' +
    "</form>";
  document.body.appendChild(box);

  var modulo = box.querySelector("form");
  var campoNome = box.querySelector("#prenota-nome");
  var erroreNome = box.querySelector("#prenota-errore-nome");
  var uscita = box.querySelector("[data-persone]");
  var meno = box.querySelector("[data-meno]");
  var piu = box.querySelector("[data-piu]");
  var boxGiorni = box.querySelector("[data-giorni]");
  var altra = box.querySelector("[data-altra]");
  var erroreGiorno = box.querySelector("[data-errore-giorno]");
  var persone = 2;

  function mostraPersone() {
    uscita.textContent = persone;
    meno.disabled = persone <= 1;
    piu.disabled = persone >= MAX_PERSONE;
  }
  meno.addEventListener("click", function () { if (persone > 1) { persone--; mostraPersone(); } });
  piu.addEventListener("click", function () { if (persone < MAX_PERSONE) { persone++; mostraPersone(); } });

  // i prossimi giorni di apertura, un tocco ciascuno; "Altra data" apre il calendario
  function costruisciGiorni() {
    var ora = adessoRoma();
    var d = new Date(ora.data);
    var html = "";
    var n = 0;
    for (var k = 0; n < GIORNI_MOSTRATI && k < 21; k++) {
      var g = d.getDay();
      var aperto = ORARI[g] && !(k === 0 && ora.ore >= ULTIMO_ARRIVO);
      if (aperto) {
        var nome = k === 0 ? "Stasera" : k === 1 ? "Domani" : giornoSett.format(d).replace(".", "");
        html += '<label class="prenota__giorno"><input type="radio" name="giorno" value="' + iso(d) + '">' +
          '<span><b>' + nome + "</b>" + giornoNum.format(d) + "</span></label>";
        n++;
      }
      d.setDate(d.getDate() + 1);
    }
    html += '<label class="prenota__giorno"><input type="radio" name="giorno" value="altra"><span><b>Altra</b>data</span></label>';
    boxGiorni.innerHTML = html;
    altra.min = iso(ora.data);
    altra.hidden = true;
    altra.value = "";
  }

  function giornoScelto() {
    var r = boxGiorni.querySelector("input:checked");
    if (!r) return null;
    if (r.value !== "altra") return daIso(r.value);
    return altra.value ? daIso(altra.value) : null;
  }

  function segnalaGiorno(testo) {
    erroreGiorno.textContent = testo || "";
    erroreGiorno.hidden = !testo;
  }

  boxGiorni.addEventListener("change", function () {
    var r = boxGiorni.querySelector("input:checked");
    altra.hidden = !(r && r.value === "altra");
    segnalaGiorno("");
    if (!altra.hidden) {
      altra.focus();
      if (altra.showPicker) { try { altra.showPicker(); } catch (e) { /* alcuni browser lo vietano */ } }
    }
  });
  altra.addEventListener("change", function () {
    var d = giornoScelto();
    segnalaGiorno(d && !ORARI[d.getDay()] ? "Il " + giorniLunghi.format(d) + " siamo chiusi: scegli un altro giorno." : "");
  });
  campoNome.addEventListener("input", function () {
    if (campoNome.value.trim()) { erroreNome.hidden = true; campoNome.removeAttribute("aria-invalid"); }
  });

  modulo.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = campoNome.value.trim();
    var d = giornoScelto();
    var chiuso = d && !ORARI[d.getDay()];
    erroreNome.hidden = !!nome;
    if (nome) campoNome.removeAttribute("aria-invalid"); else campoNome.setAttribute("aria-invalid", "true");
    if (!d) segnalaGiorno("Scegli il giorno.");
    else if (chiuso) segnalaGiorno("Il " + giorniLunghi.format(d) + " siamo chiusi: scegli un altro giorno.");
    if (!nome) { campoNome.focus(); return; }
    if (!d || chiuso) { (altra.hidden ? boxGiorni.querySelector("input") : altra).focus(); return; }

    var saluto = adessoRoma().ore < 17 ? "Buongiorno" : "Buonasera";
    var quando = iso(d) === iso(adessoRoma().data) ? "stasera" : giorniLunghi.format(d);
    var testo = saluto + ", sono " + nome + ". Vorrei prenotare un tavolo da Be Wine per " +
      persone + " " + (persone === 1 ? "persona" : "persone") + ", " + quando + ". Grazie!";
    box.close();
    apriWhatsApp(testo);
  });

  // Apre WhatsApp direttamente, senza la pagina intermedia di wa.me.
  // Telefono: l'app, col messaggio già scritto. Se l'app non c'è (la pagina resta visibile), si passa a wa.me.
  // Computer: WhatsApp Web in una nuova scheda, già sulla chat col messaggio.
  function apriWhatsApp(testo) {
    var t = encodeURIComponent(testo);
    var waMe = "https://wa.me/" + NUMERO_WA + "?text=" + t;
    var telefono = window.matchMedia("(pointer: coarse)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (telefono) {
      var riserva = setTimeout(function () {
        if (document.visibilityState === "visible") window.location.href = waMe;
      }, 1500);
      document.addEventListener("visibilitychange", function via() {
        if (document.visibilityState === "hidden") { clearTimeout(riserva); document.removeEventListener("visibilitychange", via); }
      });
      window.location.href = "whatsapp://send?phone=" + NUMERO_WA + "&text=" + t;
      return;
    }
    var web = "https://web.whatsapp.com/send?phone=" + NUMERO_WA + "&text=" + t;
    var w = window.open(web, "_blank");
    if (w) w.opener = null; else window.location.href = web;
  }

  // ---------- apertura e chiusura ----------
  function apri(e) {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // nuova scheda: lascia il link
    e.preventDefault();
    costruisciGiorni();
    segnalaGiorno("");
    erroreNome.hidden = true;
    mostraPersone();
    box.showModal();
    // su telefono la tastiera coprirebbe la finestra: il cursore va nel nome solo su computer
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) campoNome.focus();
    else box.querySelector("[data-chiudi]").blur();
  }
  link.forEach(function (a) {
    a.addEventListener("click", apri);
    a.setAttribute("aria-haspopup", "dialog");
  });
  box.querySelector("[data-chiudi]").addEventListener("click", function () { box.close(); });
  box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
})();
