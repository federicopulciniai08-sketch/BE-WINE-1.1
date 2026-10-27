/* Be Wine · demosito6 */
(() => {
  'use strict';

  /* ---------- comparse allo scroll (per prime: se il resto fallisce, i contenuti si vedono comunque) ---------- */
  window.BWok = 1;
  const haIO = 'IntersectionObserver' in window;
  const elementi = [...document.querySelectorAll('.reveal')];
  if (!haIO) {
    elementi.forEach((el) => el.classList.add('is-in'));
  } else {
    elementi.forEach((el) => {
      const fratelli = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      let i = fratelli.indexOf(el);
      const card = el.closest('.arco-card');
      if (card) i = [...card.parentElement.children].indexOf(card); // sfalsamento tra le card ad arco
      el.style.setProperty('--i', Math.max(0, i));
    });
    const ioReveal = new IntersectionObserver((v) => {
      v.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('is-in'); ioReveal.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    elementi.forEach((el) => ioReveal.observe(el));
  }

  /* ---------- aperto adesso? (ora di Roma) ---------- */
  // 0 = domenica … 6 = sabato. Orari dalla scheda Google (aggiornati dal titolare).
  const ORARI = { 2: [17, 24], 3: [17, 24], 4: [17, 24], 5: [17, 24], 6: [18, 24] };
  const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  const SIGLE = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function oraDiRoma() {
    const parti = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());
    const val = (t) => parti.find((p) => p.type === t).value;
    return { giorno: SIGLE[val('weekday')], ore: Number(val('hour')) + Number(val('minute')) / 60 };
  }

  function stato({ giorno, ore }) {
    const oggi = ORARI[giorno];
    if (oggi && ore >= oggi[0] && ore < oggi[1]) return { aperto: true, testo: 'Aperto adesso, fino a mezzanotte' };
    if (oggi && ore < oggi[0]) return { aperto: false, testo: `Chiuso, apre alle ${oggi[0]}` };
    for (let k = 1; k <= 7; k += 1) {
      const g = (giorno + k) % 7;
      if (ORARI[g]) return { aperto: false, testo: `Chiuso, apre ${k === 1 ? 'domani' : GIORNI[g]} alle ${ORARI[g][0]}` };
    }
    return { aperto: false, testo: '' };
  }

  function aggiornaStato() {
    const ora = oraDiRoma();
    const s = stato(ora);
    document.querySelectorAll('[data-stato]').forEach((el) => {
      el.classList.toggle('is-aperto', s.aperto);
      const t = el.querySelector('[data-stato-testo]');
      if (t) t.textContent = s.testo;
    });
    document.querySelectorAll('[data-cella-stato]').forEach((c) => c.removeAttribute('hidden'));
    document.querySelectorAll('.tab-orari tr').forEach((tr) => {
      const g = Number(tr.dataset.giorno);
      tr.classList.toggle('is-chiuso', !ORARI[g]);
      const oggi = g === ora.giorno;
      tr.classList.toggle('is-oggi', oggi);
      const th = tr.querySelector('th');
      const eti = th.querySelector('.oggi');
      if (oggi && !eti) th.insertAdjacentHTML('beforeend', ' <span class="oggi">oggi</span>');
      if (!oggi && eti) eti.remove();
    });
  }

  aggiornaStato();
  setInterval(aggiornaStato, 60 * 1000);

  const navH = () => document.querySelector('.nav')?.offsetHeight || 64;

  /* ---------- menu mobile ---------- */
  const bottoneMenu = document.querySelector('.nav__menu');
  const menu = document.getElementById('menu-mobile');
  if (bottoneMenu && menu) {
    let yApertura = 0;
    const chiudi = () => { menu.hidden = true; bottoneMenu.setAttribute('aria-expanded', 'false'); bottoneMenu.textContent = 'Menu'; };
    bottoneMenu.addEventListener('click', () => {
      const apri = menu.hidden;
      menu.hidden = !apri;
      bottoneMenu.setAttribute('aria-expanded', String(apri));
      bottoneMenu.textContent = apri ? 'Chiudi' : 'Menu';
      yApertura = scrollY;
    });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) chiudi(); });
    document.addEventListener('click', (e) => { if (!menu.hidden && !e.target.closest('.nav')) chiudi(); });
    addEventListener('scroll', () => { if (!menu.hidden && Math.abs(scrollY - yApertura) > 48) chiudi(); }, { passive: true });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { chiudi(); bottoneMenu.focus(); }
    });
  }

  /* ---------- barra mobile: in home dopo i bottoni dell'hero, altrove da subito; nascosta dove ci sono altri bottoni ---------- */
  const barra = document.querySelector('[data-barra-mobile]');
  if (barra && haIO) {
    const azioniHero = document.querySelector('[data-azioni-hero]');
    let heroPassato = !azioniHero; // senza hero (enoteca) la barra c'è dall'arrivo
    const inVista = new Set();
    const aggiorna = () => barra.classList.toggle('is-visibile', heroPassato && !inVista.size);
    if (azioniHero) {
      new IntersectionObserver(([v]) => {
        heroPassato = !v.isIntersecting;
        aggiorna();
      }, { rootMargin: `-${navH()}px 0px 0px 0px` }).observe(azioniHero);
    }
    const ioZone = new IntersectionObserver((voci) => {
      voci.forEach((v) => (v.isIntersecting ? inVista.add(v.target) : inVista.delete(v.target)));
      aggiorna();
    });
    document.querySelectorAll('[data-prenota], [data-azioni-contatti]').forEach((el) => ioZone.observe(el));
    aggiorna();
  }

  /* ---------- richiesta di prenotazione: compone il messaggio e apre WhatsApp ---------- */
  const modulo = document.querySelector('[data-prenota]');
  if (modulo) {
    const NUMERO_WA = '393351618047';
    const ULTIMO_ARRIVO = 22.5; // l'ultimo orario proposto è le 22:30: il locale chiude a mezzanotte
    const GIORNI_PROPOSTI = 12; // tre file da quattro
    const boxGiorni = modulo.querySelector('[data-giorni]');
    const boxOre = modulo.querySelector('[data-ore]');
    const oraVuoto = modulo.querySelector('[data-ora-vuoto]');
    const campoPersone = modulo.querySelector('#p-persone');
    const campoNome = modulo.querySelector('#p-nome');
    const campoOccasione = modulo.querySelector('#p-occasione');
    const riepilogo = modulo.querySelector('[data-riepilogo]');
    const nota = modulo.querySelector('[data-nota]');
    const aiuto = modulo.querySelector('.modulo__aiuto');
    const meno = modulo.querySelector('[data-meno]');
    const piu = modulo.querySelector('[data-piu]');
    const errore = (k) => modulo.querySelector(`[data-errore="${k}"]`);

    const fmtCorto = new Intl.DateTimeFormat('it-IT', { weekday: 'short', timeZone: 'UTC' });
    const fmtGiorno = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', timeZone: 'UTC' });
    const fmtLungo = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
    const hhmm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;

    // oggi secondo l'ora di Roma, come data "pura" (mezzogiorno UTC: niente salti per l'ora legale)
    function oggiRoma() {
      const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      return new Date(`${p}T12:00:00Z`);
    }

    function orariDelGiorno(data, eOggi) {
      const apertura = ORARI[data.getUTCDay()];
      if (!apertura) return [];
      let da = apertura[0];
      if (eOggi) da = Math.max(da, Math.ceil((oraDiRoma().ore + 0.5) * 2) / 2); // almeno mezz'ora d'anticipo
      const slot = [];
      for (let h = da; h <= ULTIMO_ARRIVO; h += 0.5) slot.push(h);
      return slot;
    }

    function costruisciGiorni() {
      const oggi = oggiRoma();
      boxGiorni.textContent = '';
      let messi = 0;
      for (let k = 0; messi < GIORNI_PROPOSTI && k < 31; k += 1) {
        const d = new Date(oggi.getTime() + k * 864e5);
        if (!orariDelGiorno(d, k === 0).length) continue;
        const iso = d.toISOString().slice(0, 10);
        const nome = k === 0 ? 'Oggi' : k === 1 ? 'Domani' : fmtCorto.format(d).replace('.', '');
        const label = document.createElement('label');
        label.className = 'giorno';
        label.innerHTML = `<input type="radio" name="giorno" value="${iso}" data-oggi="${k === 0}"><span><b>${nome}</b><small>${fmtGiorno.format(d)}</small></span>`;
        label.querySelector('input').setAttribute('aria-label', `${k < 2 ? `${nome}, ` : ''}${fmtLungo.format(d)}`);
        boxGiorni.append(label);
        messi += 1;
      }
      // già scelto il primo giorno con orari liberi (oggi, se si fa ancora in tempo): gli orari si vedono subito
      const primo = boxGiorni.querySelector('input');
      if (primo) primo.checked = true;
    }

    function giornoScelto() {
      const r = modulo.querySelector('input[name="giorno"]:checked');
      return r ? { data: new Date(`${r.value}T12:00:00Z`), oggi: r.dataset.oggi === 'true' } : null;
    }
    const oraScelta = () => modulo.querySelector('input[name="ora"]:checked')?.value || '';

    // dopo il giorno, tutti gli orari disponibili si vedono insieme come caselle (niente menu a tendina)
    function aggiornaOrari() {
      const g = giornoScelto();
      const prima = oraScelta();
      boxOre.textContent = '';
      boxOre.hidden = !g;
      oraVuoto.hidden = !!g;
      if (!g) return;
      orariDelGiorno(g.data, g.oggi).forEach((h) => {
        const v = hhmm(h);
        const label = document.createElement('label');
        label.className = 'giorno';
        label.innerHTML = `<input type="radio" name="ora" value="${v}"${v === prima ? ' checked' : ''}><span><small>${v}</small></span>`;
        label.querySelector('input').setAttribute('aria-label', `alle ${v}`);
        boxOre.append(label);
      });
    }

    const persone = () => Math.min(20, Math.max(1, parseInt(campoPersone.value, 10) || 1));

    function aggiornaRiepilogo() {
      const g = giornoScelto();
      const ora = oraScelta();
      const n = persone();
      // aria-disabled e non disabled: un bottone disattivato mentre ha il focus lo farebbe perdere
      meno.setAttribute('aria-disabled', String(n <= 1));
      piu.setAttribute('aria-disabled', String(n >= 20));
      if (!g || !ora) { riepilogo.textContent = ''; return; }
      const occ = campoOccasione.value.trim();
      riepilogo.textContent = `Richiesta per ${n} ${n === 1 ? 'persona' : 'persone'}, ${fmtLungo.format(g.data)} alle ${ora}${occ ? ` (${occ})` : ''}.`;
    }

    function segnala(k, attivo, el) {
      errore(k).hidden = !attivo;
      el.setAttribute('aria-invalid', String(attivo));
      if (attivo) el.setAttribute('aria-describedby', `errore-${k}`); else el.removeAttribute('aria-describedby');
    }
    ['giorno', 'ora', 'nome'].forEach((k) => { errore(k).id = `errore-${k}`; });
    // giorno e orario sono gruppi di radio: errore descritto dal fieldset e segnato su ogni radio
    const segnalaGruppo = (k, box, attivo) => {
      segnala(k, attivo, box.closest('fieldset'));
      box.querySelectorAll('input').forEach((r) => r.setAttribute('aria-invalid', String(attivo)));
    };

    meno.addEventListener('click', () => { if (persone() > 1) { campoPersone.value = persone() - 1; aggiornaRiepilogo(); } });
    piu.addEventListener('click', () => { if (persone() < 20) { campoPersone.value = persone() + 1; aggiornaRiepilogo(); } });
    campoPersone.addEventListener('change', () => { campoPersone.value = persone(); aggiornaRiepilogo(); });
    const movimento = matchMedia('(prefers-reduced-motion: no-preference)');
    boxGiorni.addEventListener('change', () => {
      segnalaGruppo('giorno', boxGiorni, false);
      aggiornaOrari();
      aggiornaRiepilogo();
      // sul telefono gli orari possono finire sotto il bordo: li porta in vista
      boxOre.closest('fieldset').scrollIntoView({ block: 'nearest', behavior: movimento.matches ? 'smooth' : 'auto' });
    });
    boxOre.addEventListener('change', () => { segnalaGruppo('ora', boxOre, false); aggiornaRiepilogo(); });
    campoNome.addEventListener('input', () => { if (campoNome.value.trim()) segnala('nome', false, campoNome); });
    campoOccasione.addEventListener('input', aggiornaRiepilogo);

    modulo.addEventListener('submit', (e) => {
      e.preventDefault();
      const g = giornoScelto();
      const ora = oraScelta();
      const nome = campoNome.value.trim();
      segnalaGruppo('giorno', boxGiorni, !g);
      segnalaGruppo('ora', boxOre, !!g && !ora);
      segnala('nome', !nome, campoNome);
      const primo = !g ? boxGiorni.querySelector('input') : !ora ? boxOre.querySelector('input') : !nome ? campoNome : null;
      if (primo) { primo.focus(); return; }
      const n = persone();
      const occ = campoOccasione.value.trim();
      const saluto = oraDiRoma().ore < 17 ? 'Buongiorno' : 'Buonasera';
      const testo = `${saluto}, vorrei prenotare un tavolo da Be Wine per ${n} ${n === 1 ? 'persona' : 'persone'}, ${fmtLungo.format(g.data)} alle ${ora}.${occ ? ` Occasione: ${occ}.` : ''} Nome: ${nome}. Grazie.`;
      const url = `https://wa.me/${NUMERO_WA}?text=${encodeURIComponent(testo)}`;
      const finestra = window.open(url, '_blank'); // con 'noopener' window.open restituisce sempre null
      if (finestra) finestra.opener = null; else window.location.href = url;
      nota.hidden = false;
      aiuto.hidden = true;
    });

    costruisciGiorni();
    aggiornaOrari();
    aggiornaRiepilogo();
    addEventListener('pageshow', (e) => { if (e.persisted) { aggiornaOrari(); aggiornaRiepilogo(); } });
  }

})();
