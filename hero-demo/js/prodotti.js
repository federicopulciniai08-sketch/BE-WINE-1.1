// Prodotti di prova: nomi letti dalle foto del fotografo, da confermare col titolare.
// sezione: vini | birre | distillati · tipo: il filtro dentro la sezione
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

  // Birre: nessuna foto nella cartella, solo segnaposto
  { id: "birra-1", sezione: "birre", tipo: "", nome: "Birra artigianale", cantina: "Esempio", zona: "", foto: "" },
  { id: "birra-2", sezione: "birre", tipo: "", nome: "Birra artigianale", cantina: "Esempio", zona: "", foto: "" },
  { id: "birra-3", sezione: "birre", tipo: "", nome: "Birra artigianale", cantina: "Esempio", zona: "", foto: "" },

  // Distillati
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
  { id: "strozzapreti", sezione: "distillati", tipo: "Amari e liquori", nome: "Strozzapreti", cantina: "Tirabuccia · liquore", zona: "", foto: "strozzapreti.jpg" }
];
