# Be Wine v3: decisioni prese (20 ottobre 2026)

## Cartelle
- `hero-demo/`: la hero approvata ("stupendo"). Per ora con nome e data segnaposto (Enoteca Rossi, dal 1987). Si apre con `python -m http.server` dentro la cartella.
- `brief/`: tutto il materiale per il lavoro con Opus (riferimenti, foto, domande per il titolare, codice di prenotazione di Be Wine v1).
- `foto be wine/`: foto del locale, già presente.

## Il metodo che ha funzionato
Riferimento forte (hero di Agence Van den Abeele) più foto pulita e nitida, non altre skill né giudici. Hero costruita per prima, controllata a 1440 e 390 px.
Font: Instrument Serif per i titoli, DM Sans per il resto (eccezione approvata al font unico). Titolo = nome più dato di fatto, nessuno slogan, rosso vino solo sul dato.

## Struttura del sito (aggiornata il 27 ottobre 2026)
Menu: **Home · L'enoteca · Prenota**. Si apre con `python -m http.server 8765 --directory hero-demo` (o dal pannello browser, configurazione `hero-demo`).
1. **Home (`index.html`):** hero centrata con foto, "4,7 stelle su Google", titolo "Be Wine. / Montesilvano. / Dal 2015."; Chi siamo con foto e 90 parole; 3 recensioni Google a 5 stelle; piede rosso vino con contatti, orari, social, privacy e cookie (testi legali e P. IVA ancora da fare).
2. **L'enoteca (`enoteca.html`):** pagine Cantine ed Enoteca unite. Mappa d'Italia con le cantine; per ogni cantina una scheda con le sue bottiglie; filtri Bianchi/Rossi/Rosati/Bollicine che accendono le regioni. Sotto, "Oltre il vino": Distillati (Gin, Rum, Whisky, Amari e liquori) e Birre in griglia. Dati in `js/cantine.js` e `js/prodotti.js`.
3. **Prenota:** non è più una pagina. Il tasto apre WhatsApp con "Buonasera, vorrei prenotare un tavolo da Be Wine per " già scritto. Il modulo con giorni e orari è stato tolto.

Le prove scartate (versioni della hero, cantine a lista e a griglia, enoteca a schede) sono in `hero-demo/archivio/`.

## Regole di stile decise
- Dimensioni in multipli: testi piccoli 12 px, sottotitoli 24 px, titoli di sezione 48 px, titolo home 120 px su computer (60 su telefono). Spazi 6 · 12 · 24 · 48 · 96.
- Fondo sotto la hero crema chiarissimo `#fbf7f0`; piede e dettagli in vino scuro `#7a1f2c`.
- Tasti del menu: solo testo, senza bordi; tre stati (riposo, passaggio con linea, clic con colore più caldo e ingrandimento).
- Sottotitoli brevi e decisi, mai una spiegazione di cosa c'è sotto; si propongono in chat prima di metterli.
- Foto del fotografo in `foto be wine/be wine 2/` (BeWine-…). Tagliere: non lo fanno più, niente foto né testi sui taglieri. Prodotti da tutta Italia.

## Attenzione quando si porta il codice di prenotazione
Nel codice vecchio ci sono numero WhatsApp (393351618047), il nome "Be Wine" nel messaggio e gli orari (mar-ven 17-24, sab 18-24, lun e dom chiuso, ultimo arrivo 22:30). Vanno confermati col titolare e adattati.
Non è un invio automatico: il cliente deve premere Invia in WhatsApp e la prenotazione vale quando il titolare risponde.

## Riferimenti
- `brief/riferimenti/01`: hero (Agence Van den Abeele).
- `brief/riferimenti/02`: home sotto la hero (Alzavino Wine Tavern).
- **Mancano** riferimenti per catalogo e recensioni. Mandare indirizzi di siti: li catturo a piena risoluzione con Playwright.
- `brief/riferimenti-candidati/`: altri siti catturati, non scelti.

## Da chiedere al titolare (10 domande, in `brief/DOMANDE-TITOLARE-corto.md`)
Orari, WhatsApp, indirizzo (civico 421 o 423), persone massime e coperti, 4-6 best seller veri, scheda dei vini con gradazione, una frase per ogni best seller, foto (specifiche e diritti), scacchi e giochi, trasparenza sui prezzi.
Domanda extra: quale prodotto porta i clienti la prima volta e quale rende di più a fine serata (spine contro bottiglie).

## Scelte sul tono e sui contenuti
- Home: una riga e una foto sulle spine di rame come elemento distintivo.
- Pagina enoteca: prima le bottiglie, poi la spina.
- Scacchi: nella cartella `foto be wine/` c'è già "vino e scacchi.jpg", quindi la scena viene dal locale. Resta da capire quanto i clienti li usino, prima di nominarli nei testi.

## Cose da fare, in ordine
1. Visita al titolare: risposte alle 10 domande, accordo sulle foto.
2. Portare 2 o 3 riferimenti per catalogo e recensioni.
3. Riscrivere il prompt per Opus: `brief/PROMPT.txt` è la versione vecchia, pensata per una sola pagina senza recensioni. Va aggiornata con la struttura a tre pagine, la prenotazione WhatsApp, il catalogo senza prezzi e i dati veri.
4. Lanciare Opus, una sezione alla volta, con screenshot a 1440 e 390 px.
