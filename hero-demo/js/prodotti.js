// Prodotti di prova: nomi letti dalle foto del fotografo, da confermare col titolare.
// sezione: vini | birre | distillati · tipo: il filtro dentro la sezione
// top: true = tra "I più richiesti" · daConfermare: true = riga provvisoria, la pagina lo scrive accanto
// Vini → pagina L'enoteca. Distillati, birre e cocktail → pagina Birre e distillati (js/birre-distillati.js):
// lì per aggiungere una bottiglia, una birra o un cocktail basta una riga in questo file.
window.SEZIONI = {
  vini: { nome: "Vini", tipi: ["Bianchi", "Rossi", "Rosati", "Bollicine"] },
  birre: { nome: "Birre", tipi: [] },
  distillati: { nome: "Distillati", tipi: ["Gin", "Rum", "Whisky", "Amari e liquori"] }
};

window.PRODOTTI = [
  // Vini
  { id: "aime", sezione: "vini", tipo: "Bianchi", nome: "Aimè", cantina: "Abruzzo DOC Pecorino", zona: "Abruzzo", foto: "aime.jpg" },
  { id: "marina-cvetic", sezione: "vini", tipo: "Rossi", nome: "Marina Cvetic", cantina: "Montepulciano d'Abruzzo DOC", zona: "Abruzzo", foto: "marina-cvetic.jpg", top: true },
  { id: "praesidium", sezione: "vini", tipo: "Rossi", nome: "Praesidium Riserva", cantina: "Montepulciano d'Abruzzo", zona: "Abruzzo", foto: "praesidium.jpg" },
  { id: "collefrisio", sezione: "vini", tipo: "Rossi", nome: "Collefrisio", cantina: "Montepulciano d'Abruzzo", zona: "Abruzzo", foto: "collefrisio.jpg" },
  { id: "doncamillo", sezione: "vini", tipo: "Rossi", nome: "donCamillo", cantina: "Fantini · Sangiovese e Cabernet Sauvignon", zona: "", foto: "doncamillo.jpg" },
  // Calalenta: in foto c'è scritto Merlot, bottiglia chiara. Rosato da confermare.
  { id: "calalenta", sezione: "vini", tipo: "Rosati", nome: "Calalenta", cantina: "Fantini · Merlot", zona: "", foto: "calalenta.jpg" },
  { id: "altemasi", sezione: "vini", tipo: "Bollicine", nome: "Altemasi Millesimato", cantina: "Trento DOC Brut", zona: "Trentino", foto: "altemasi.jpg", top: true },
  // Alla spina: rosato frizzante del Veneto. Cantina, comune e uva da confermare (post su Facebook di Be Wine).
  { id: "rosato-spina", sezione: "vini", tipo: "Rosati", nome: "Rosato frizzante alla spina", cantina: "Veneto · alla spina, anche da portare via", zona: "Veneto", foto: "spina.jpg" },

  // Vini dalle foto della pagina Facebook di Be Wine (ricerca del 10 novembre 2026), con la cantina cercata in rete.
  // Senza foto per ora: quando arrivano, basta scrivere il nome del file in "foto" (cartella img/prodotti/).
  { id: "marina-cvetic-syrah", sezione: "vini", tipo: "Rossi", nome: "Marina Cvetic Syrah", cantina: "Colline Pescaresi IGT", zona: "Abruzzo", foto: "" },
  { id: "in-out", sezione: "vini", tipo: "Rossi", nome: "In & Out", cantina: "Montepulciano d'Abruzzo", zona: "Abruzzo", foto: "" },
  { id: "collefrisio-anniversary", sezione: "vini", tipo: "Rossi", nome: "Anniversary", cantina: "Montepulciano d'Abruzzo", zona: "Abruzzo", foto: "" },
  { id: "opi", sezione: "vini", tipo: "Rossi", nome: "Opi", cantina: "Colline Teramane Riserva", zona: "Abruzzo", foto: "" },
  { id: "amami", sezione: "vini", tipo: "Rossi", nome: "Amami", cantina: "Cinquesegni · Primitivo Puglia IGP", zona: "Puglia", foto: "" },
  { id: "kerrias", sezione: "vini", tipo: "Rossi", nome: "Kerrias", cantina: "Montepulciano d'Abruzzo DOC", zona: "Abruzzo", foto: "" },
  { id: "bella-del-priore", sezione: "vini", tipo: "Bollicine", nome: "La Bella del Priore", cantina: "Spumante Passerina Brut", zona: "Abruzzo", foto: "" },
  { id: "ilikias", sezione: "vini", tipo: "Rossi", nome: "Ilikias", cantina: "Montepulciano d'Abruzzo DOC", zona: "Abruzzo", foto: "" },
  { id: "negus", sezione: "vini", tipo: "Rossi", nome: "Negus", cantina: "Montepulciano d'Abruzzo DOC", zona: "Abruzzo", foto: "" },
  { id: "ipnosi", sezione: "vini", tipo: "Rossi", nome: "Ipnosi", cantina: "Colline Teramane DOCG", zona: "Abruzzo", foto: "" },
  { id: "stilla-rubra", sezione: "vini", tipo: "Rossi", nome: "Stilla Rubra", cantina: "Montepulciano d'Abruzzo", zona: "Abruzzo", foto: "" },
  { id: "crognaleto", sezione: "vini", tipo: "Rossi", nome: "Crognaleto", cantina: "Montepulciano d'Abruzzo DOC", zona: "Abruzzo", foto: "" },
  { id: "shaman", sezione: "vini", tipo: "Rossi", nome: "Shàman", cantina: "Montepulciano d'Abruzzo Riserva DOC", zona: "Abruzzo", foto: "" },
  { id: "tenuta-professore", sezione: "vini", tipo: "Bianchi", nome: "Tenuta del Professore", cantina: "Trebbiano d'Abruzzo DOC", zona: "Abruzzo", foto: "" },
  { id: "rosso-5", sezione: "vini", tipo: "Rossi", nome: "Rosso 5", cantina: "Tenuta Nicola Di Sipio", zona: "Abruzzo", foto: "" },
  { id: "di-sipio-rose", sezione: "vini", tipo: "Rosati", nome: "Di Sipio Rosé", cantina: "Rosato", zona: "Abruzzo", foto: "" },
  { id: "mazzamurello", sezione: "vini", tipo: "Rossi", nome: "Mazzamurello", cantina: "Montepulciano d'Abruzzo DOC", zona: "Abruzzo", foto: "" },
  { id: "santinumi", sezione: "vini", tipo: "Rossi", nome: "Santinumi", cantina: "Montepulciano d'Abruzzo Terre dei Vestini Riserva", zona: "Abruzzo", foto: "" },
  { id: "santa-giusta", sezione: "vini", tipo: "Rossi", nome: "Santa Giusta", cantina: "Pinot Nero Terre Aquilane IGP", zona: "Abruzzo", foto: "" },
  { id: "contesa-riserva", sezione: "vini", tipo: "Rossi", nome: "Contesa Riserva", cantina: "Montepulciano d'Abruzzo Riserva", zona: "Abruzzo", foto: "" },
  { id: "chiedi-alla-polvere", sezione: "vini", tipo: "Rossi", nome: "Chiedi alla Polvere", cantina: "Montepulciano d'Abruzzo Riserva DOC", zona: "Abruzzo", foto: "" },
  { id: "pieluni", sezione: "vini", tipo: "Rossi", nome: "Pieluni", cantina: "Colline Teramane Riserva DOCG", zona: "Abruzzo", foto: "" },
  { id: "inferi", sezione: "vini", tipo: "Rossi", nome: "Inferi", cantina: "Montepulciano d'Abruzzo Riserva DOC", zona: "Abruzzo", foto: "" },
  { id: "tolos", sezione: "vini", tipo: "Rossi", nome: "Tolos", cantina: "Montepulciano d'Abruzzo Riserva", zona: "Abruzzo", foto: "" },
  { id: "passerina-terra-daligi", sezione: "vini", tipo: "Bianchi", nome: "Passerina", cantina: "Terra d'Aligi", zona: "Abruzzo", foto: "" },
  { id: "lapis", sezione: "vini", tipo: "Rossi", nome: "Lapis", cantina: "Montepulciano d'Abruzzo", zona: "Abruzzo", foto: "" },
  { id: "ikebana", sezione: "vini", tipo: "Rossi", nome: "Ikebana", cantina: "Novello", zona: "Abruzzo", foto: "" },
  { id: "lunanuova", sezione: "vini", tipo: "Rossi", nome: "Lunanuova", cantina: "Novello", zona: "Abruzzo", foto: "" },
  { id: "surfine", sezione: "vini", tipo: "Bollicine", nome: "Surfine", cantina: "Cuvée Brut", zona: "Veneto", foto: "" },
  { id: "adami-prosecco", sezione: "vini", tipo: "Bollicine", nome: "Prosecco Superiore", cantina: "Valdobbiadene DOCG", zona: "Veneto", foto: "" },
  { id: "corvee-brut", sezione: "vini", tipo: "Bollicine", nome: "Corvée Brut", cantina: "Trento DOC", zona: "Trentino", foto: "" },

  // Birre: poche, in bottiglia, niente spine. Sulla pagina sono una lista scritta: nome, birrificio, stile, formato.
  // "foto" è già pronto per quando arriveranno le foto (file in img/prodotti/): oggi la pagina non lo usa.
  // Menabrea e Peroni sono righe provvisorie: quali birre, stile e formato vanno chiesti al titolare.
  { id: "menabrea", sezione: "birre", tipo: "", nome: "Menabrea", birrificio: "Birra Menabrea, Biella", stile: "Lager", formato: "Bottiglia 33 cl", foto: "", daConfermare: true },
  { id: "peroni", sezione: "birre", tipo: "", nome: "Peroni", birrificio: "Birra Peroni, Roma", stile: "Lager", formato: "Bottiglia 33 cl", foto: "", daConfermare: true },

  // Distillati: "cantina" è il tipo scritto in etichetta, "zona" la provenienza
  { id: "tanqueray-ten", sezione: "distillati", tipo: "Gin", nome: "Tanqueray No. Ten", cantina: "London Dry Gin", zona: "Regno Unito", foto: "tanqueray-ten.jpg", top: true },
  { id: "nordes", sezione: "distillati", tipo: "Gin", nome: "Nordés", cantina: "Gin atlantico", zona: "Galizia, Spagna", foto: "nordes.jpg" },
  { id: "bobbys", sezione: "distillati", tipo: "Gin", nome: "Bobby's", cantina: "Schiedam Dry Gin", zona: "Paesi Bassi", foto: "bobbys.jpg" },
  { id: "elephant", sezione: "distillati", tipo: "Gin", nome: "Elephant Gin", cantina: "London Dry Gin", zona: "Germania", foto: "elephant.jpg" },
  { id: "gin-mare-capri", sezione: "distillati", tipo: "Gin", nome: "Gin Mare Capri", cantina: "Gin mediterraneo", zona: "Spagna", foto: "gin-mare-capri.jpg" },
  { id: "no3", sezione: "distillati", tipo: "Gin", nome: "No. 3", cantina: "London Dry Gin", zona: "Regno Unito", foto: "no3.jpg" },
  { id: "don-papa-baroko", sezione: "distillati", tipo: "Rum", nome: "Don Papa Baroko", cantina: "Rum", zona: "Filippine", foto: "don-papa-baroko.jpg", top: true },
  { id: "don-papa-masskara", sezione: "distillati", tipo: "Rum", nome: "Don Papa Masskara", cantina: "Rum", zona: "Filippine", foto: "don-papa-masskara.jpg" },
  { id: "kirk-sweeney", sezione: "distillati", tipo: "Rum", nome: "Kirk and Sweeney Reserva", cantina: "Rum", zona: "Repubblica Dominicana", foto: "kirk-sweeney.jpg" },
  { id: "cartavio-12", sezione: "distillati", tipo: "Rum", nome: "Cartavio Solera 12", cantina: "Rum", zona: "Perù", foto: "cartavio-12.jpg" },
  { id: "oban", sezione: "distillati", tipo: "Whisky", nome: "Oban", cantina: "Single Malt Scotch Whisky", zona: "Scozia", foto: "oban.jpg" },
  { id: "vermouth-professore", sezione: "distillati", tipo: "Amari e liquori", nome: "Vermouth del Professore", cantina: "Vermouth di Torino", zona: "Piemonte", foto: "vermouth-professore.jpg" },
  { id: "italicus", sezione: "distillati", tipo: "Amari e liquori", nome: "Italicus", cantina: "Rosolio di bergamotto", zona: "", foto: "italicus.jpg" },
  { id: "strozzapreti", sezione: "distillati", tipo: "Amari e liquori", nome: "Strozzapreti", cantina: "Tirabuccia · liquore", zona: "", foto: "strozzapreti.jpg" },
  // Dalla pagina Facebook di Be Wine: vino aromatizzato, sta con amari e vermouth. Senza foto per ora.
  { id: "barolo-chinato", sezione: "distillati", tipo: "Amari e liquori", nome: "Barolo Chinato", cantina: "Erbaluna", zona: "La Morra, Piemonte", foto: "" }
];

// Cocktail: lista scritta sotto lo scaffale dei distillati (nome e ingredienti).
// Finché l'elenco è vuoto la sezione non compare. I nomi veri li dà il titolare: non inventarne.
// Una riga = un cocktail. "distillato" è l'id della bottiglia con cui è fatto (uno degli id qui sopra).
// Riga di esempio, da copiare tra le parentesi quadre senza le due barre:
//   { nome: "Nome del cocktail", ingredienti: "primo ingrediente, secondo, terzo", distillato: "tanqueray-ten" },
window.COCKTAIL = [
];
