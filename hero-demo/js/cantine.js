// le cantine vere delle bottiglie in foto, con i loro vini dentro.
// "comune": dove sta la cantina, deve essere scritto come nei dati ISTAT (mette il segnaposto sulla mappa della sua regione).
// Senza "comune" la cantina resta nell'elenco ma non ha segnaposto.
// "bottiglie" usa gli id di window.PRODOTTI (js/prodotti.js). Testi da confermare col titolare.
// Le regioni con una mappa: la prima è quella che si apre. "centro" (lon, lat) serve a puntare le frecce
// verso le altre regioni. Le mappe si rifanno con lo script dei confini ISTAT (vedi DECISIONI.md).
window.REGIONI_ENOTECA = {
  abruzzo: { nome: "Abruzzo", mappa: "img/mappe/abruzzo.svg", centro: [13.855, 42.227] },
  veneto: { nome: "Veneto", mappa: "img/mappe/veneto.svg", centro: [11.856, 45.648] },
  "trentino-alto-adige": { nome: "Trentino-Alto Adige", mappa: "img/mappe/trentino-alto-adige.svg", centro: [11.282, 46.442] }
};

window.CANTINE_ENOTECA = [
  {
    regione: "abruzzo",
    soprannome: "La storica",
    nome: "Masciarelli",
    comune: "San Martino sulla Marrucina",
    zona: "San Martino sulla Marrucina (CH)",
    testo: "Una delle cantine che hanno fatto conoscere il Montepulciano d'Abruzzo nel mondo. Marina Cvetic è la linea che porta il nome di chi la guida oggi.",
    bottiglie: ["marina-cvetic", "marina-cvetic-syrah"]
  },
  {
    regione: "abruzzo",
    soprannome: "La montagna",
    nome: "Praesidium",
    comune: "Prezza",
    zona: "Prezza (AQ)",
    testo: "Piccola azienda di famiglia nella Valle Peligna, in quota. Il suo rosso di punta è la Riserva, che vale la pena aspettare.",
    bottiglie: ["praesidium"]
  },
  {
    regione: "abruzzo",
    soprannome: "Le colline del Chietino",
    nome: "Collefrisio",
    comune: "Frisa",
    zona: "Frisa (CH)",
    testo: "Vigne tra le colline e il mare, a pochi chilometri dalla costa. Montepulciano pieno e moderno.",
    bottiglie: ["collefrisio", "in-out", "collefrisio-anniversary"]
  },
  {
    regione: "abruzzo",
    soprannome: "Di casa",
    nome: "Fantini",
    comune: "Ortona",
    zona: "Ortona (CH)",
    testo: "Una delle firme abruzzesi più conosciute, a mezz'ora dal locale. Dal rosso importante al vino da aperitivo. Amami è della loro linea Cinquesegni, con uve di Puglia.",
    bottiglie: ["doncamillo", "calalenta", "opi", "amami"]
  },
  {
    regione: "abruzzo",
    soprannome: "Il bianco",
    nome: "Aimè",
    zona: "Abruzzo · cantina da confermare",
    testo: "Pecorino d'Abruzzo: il bianco del territorio, fresco e profumato.",
    bottiglie: ["aime"]
  },
  {
    regione: "trentino-alto-adige",
    soprannome: "Le bollicine",
    nome: "Altemasi",
    comune: "Trento",
    zona: "Trento",
    testo: "Metodo classico Trento DOC, dalle colline del Trentino. Il Millesimato è la bottiglia per le occasioni.",
    bottiglie: ["altemasi"]
  },
  {
    // Cantina e comune da prendere dal post su Facebook di Be Wine: con "comune" compare il segnaposto sul Veneto.
    regione: "veneto",
    soprannome: "Alla spina",
    nome: "Rosato frizzante",
    zona: "Veneto · cantina da confermare",
    testo: "Il rosato frizzante che esce dalle spine di rame del bancone. Si beve al banco o si porta via.",
    bottiglie: ["rosato-spina"]
  },
  // ---- Cantine dalle foto della pagina Facebook di Be Wine (10 novembre 2026): cantina e comune cercati in rete. ----
  // I testi dicono solo fatti trovati sui siti delle cantine o dei rivenditori: da confermare col titolare.
  {
    regione: "abruzzo",
    soprannome: "Colline Pescaresi",
    nome: "Tenuta del Priore",
    comune: "Collecorvino",
    zona: "Collecorvino (PE)",
    testo: "Cantina di Collecorvino, con la linea Col del Mondo. Kerrias porta il nome che i Sanniti davano alla dea dell'agricoltura.",
    bottiglie: ["kerrias", "bella-del-priore"]
  },
  {
    regione: "abruzzo",
    soprannome: "Di Montesilvano",
    nome: "Monteselva",
    comune: "Montesilvano",
    zona: "Montesilvano (PE)",
    testo: "La cantina di casa: sta a Montesilvano, come Be Wine. Ilikias è il loro Montepulciano da vigne vecchie.",
    bottiglie: ["ilikias"]
  },
  {
    regione: "abruzzo",
    soprannome: "Chietino",
    nome: "Cascina del Colle",
    comune: "Villamagna",
    zona: "Villamagna (CH)",
    testo: "Negus è il loro Montepulciano affinato in barrique.",
    bottiglie: ["negus"]
  },
  {
    regione: "abruzzo",
    soprannome: "Colline Teramane",
    nome: "Biagi",
    zona: "Colline Teramane (TE) · comune da confermare",
    testo: "Ipnosi è un Montepulciano Colline Teramane DOCG, affinato a lungo in piccole botti di rovere.",
    bottiglie: ["ipnosi"]
  },
  {
    regione: "abruzzo",
    soprannome: "Biologico",
    nome: "Buccicatino",
    comune: "Vacri",
    zona: "Vacri (CH)",
    testo: "Azienda di famiglia con vigne tra Vacri e Bucchianico, coltivate in biologico.",
    bottiglie: ["stilla-rubra"]
  },
  {
    regione: "abruzzo",
    soprannome: "Ai piedi della Majella",
    nome: "Santoleri",
    comune: "Guardiagrele",
    zona: "Guardiagrele (CH)",
    testo: "Crognaleto è la contrada di Guardiagrele da cui prende il nome il loro Montepulciano.",
    bottiglie: ["crognaleto"]
  },
  {
    regione: "abruzzo",
    soprannome: "Biodinamico",
    nome: "Rosarubra",
    comune: "Pietranico",
    zona: "Pietranico (PE)",
    testo: "Cantina biologica e biodinamica a quasi 400 metri, nell'entroterra pescarese.",
    bottiglie: ["shaman"]
  },
  {
    regione: "abruzzo",
    soprannome: "Il Trebbiano",
    nome: "D'Alesio Sciarr",
    comune: "Città Sant'Angelo",
    zona: "Città Sant'Angelo (PE)",
    testo: "Azienda della famiglia D'Alesio, in biologico. Tenuta del Professore è il loro Trebbiano.",
    bottiglie: ["tenuta-professore"]
  },
  {
    regione: "abruzzo",
    soprannome: "Chietino",
    nome: "Nicola Di Sipio",
    comune: "Ripa Teatina",
    zona: "Ripa Teatina (CH)",
    testo: "Cantina di famiglia nata nel 2004, con vigne e ulivi insieme. Lavora soprattutto Montepulciano e Pecorino.",
    bottiglie: ["rosso-5", "di-sipio-rose"]
  },
  {
    regione: "abruzzo",
    soprannome: "Biologico",
    nome: "Torre dei Beati",
    comune: "Loreto Aprutino",
    zona: "Loreto Aprutino (PE)",
    testo: "Vigne in biologico dagli anni 2000. Mazzamurello passa venti mesi in barrique.",
    bottiglie: ["mazzamurello"]
  },
  {
    regione: "abruzzo",
    soprannome: "Terre dei Vestini",
    nome: "Marchesi de Cordano",
    comune: "Loreto Aprutino",
    zona: "Loreto Aprutino (PE)",
    testo: "Circa 50 ettari di vigne a Loreto Aprutino. Santinumi è la loro Riserva di Montepulciano.",
    bottiglie: ["santinumi", "santa-giusta"]
  },
  {
    regione: "abruzzo",
    soprannome: "Colline Pescaresi",
    nome: "Contesa",
    comune: "Collecorvino",
    zona: "Collecorvino (PE)",
    testo: "Cantina di famiglia fondata nel 2001 dall'enologo Rocco Pasetti.",
    bottiglie: ["contesa-riserva", "chiedi-alla-polvere"]
  },
  {
    regione: "abruzzo",
    soprannome: "Colline Teramane",
    nome: "Illuminati",
    comune: "Controguerra",
    zona: "Controguerra (TE)",
    testo: "Fanno vino dal 1890, al confine con le Marche. Pieluni è il loro rosso di punta.",
    bottiglie: ["pieluni"]
  },
  {
    regione: "abruzzo",
    soprannome: "Colline Pescaresi",
    nome: "Marramiero",
    comune: "Rosciano",
    zona: "Rosciano (PE)",
    testo: "Inferi è la loro Riserva, dalle vigne più vecchie, affinata per più di tre anni.",
    bottiglie: ["inferi"]
  },
  {
    regione: "abruzzo",
    soprannome: "Val di Sangro",
    nome: "Terra d'Aligi",
    comune: "Atessa",
    zona: "Atessa (CH)",
    testo: "La linea della famiglia Spinelli, ad Atessa dal 1973. Tolos prende il nome dai ricoveri in pietra dei pastori.",
    bottiglie: ["tolos", "passerina-terra-daligi"]
  },
  {
    regione: "abruzzo",
    soprannome: "Di Ortona",
    nome: "Dora Sarchese",
    comune: "Ortona",
    zona: "Ortona (CH)",
    testo: "Cantina di famiglia a Villa Caldari, quella della fontana del vino sul Cammino di San Tommaso.",
    bottiglie: ["lapis"]
  },
  {
    regione: "abruzzo",
    soprannome: "Vino e arte",
    nome: "Zaccagnini",
    comune: "Bolognano",
    zona: "Bolognano (PE)",
    testo: "Cantina fondata nel 1978, conosciuta anche per le opere d'arte tra le vigne. Ikebana è il loro novello.",
    bottiglie: ["ikebana"]
  },
  {
    regione: "abruzzo",
    soprannome: "Val Vibrata",
    nome: "Torri Cantine",
    comune: "Torano Nuovo",
    zona: "Torano Nuovo (TE)",
    testo: "Cantina nata nel 1966, con vigne tra Colonnella, Controguerra e Torano. Lunanuova è il loro novello.",
    bottiglie: ["lunanuova"]
  },
  {
    regione: "veneto",
    soprannome: "Il Prosecco",
    nome: "Foss Marai",
    comune: "Valdobbiadene",
    zona: "Guia di Valdobbiadene (TV)",
    testo: "Spumanti dalle colline del Prosecco Superiore, dal 1986.",
    bottiglie: ["surfine"]
  },
  {
    regione: "veneto",
    soprannome: "Il Prosecco",
    nome: "Adami",
    comune: "Vidor",
    zona: "Colbertaldo di Vidor (TV)",
    testo: "Prosecco Superiore di Valdobbiadene, dalle colline di Colbertaldo.",
    bottiglie: ["adami-prosecco"]
  },
  {
    regione: "trentino-alto-adige",
    soprannome: "Spumanti di montagna",
    nome: "Corvée",
    comune: "Cembra Lisignago",
    zona: "Cembra Lisignago (TN)",
    testo: "Trento DOC di Chardonnay dalle terrazze ripide della Val di Cembra, sopra i 500 metri.",
    bottiglie: ["corvee-brut"]
  }
];
