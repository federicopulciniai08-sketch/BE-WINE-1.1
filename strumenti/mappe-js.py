# Copia le mappe di hero-demo/img/mappe/ dentro hero-demo/js/mappe.js.
# Serve quando il sito si apre col doppio clic sul file (indirizzo file://): lì il browser
# non lascia leggere gli .svg con fetch, ma carica gli script. Sul sito vero mappe.js non si scarica.
# Va rilanciato ogni volta che si aggiunge o si rifà una mappa:
#    python strumenti/mappe-js.py
import json, pathlib

radice = pathlib.Path(__file__).resolve().parent.parent / "hero-demo"
mappe = {}
for f in sorted((radice / "img" / "mappe").glob("*.svg")):
    mappe["img/mappe/" + f.name] = f.read_text(encoding="utf8")

testo = ("// Fatto da strumenti/mappe-js.py: non modificare a mano.\n"
         "// Le mappe di img/mappe/ per chi apre il sito dal file (file://), dove fetch non funziona.\n"
         "window.MAPPE_SVG = " + json.dumps(mappe, ensure_ascii=False) + ";\n")
(radice / "js" / "mappe.js").write_text(testo, encoding="utf8")
print("scritte", len(mappe), "mappe in hero-demo/js/mappe.js")
