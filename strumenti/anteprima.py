# Anteprima locale con gli stessi header che mette Vercel.
# Legge hero-demo/vercel.json e aggiunge quegli header a ogni risposta: così le regole di sicurezza
# (Content-Security-Policy e le altre) si provano sul computer prima di pubblicare.
# Risponde solo a questo computer (127.0.0.1), non alla rete di casa.
#
# Uso:  python strumenti/anteprima.py          (porta 8770)
#       python strumenti/anteprima.py 8791     (un'altra porta)
import functools
import http.server
import json
import os
import re
import sys

RADICE = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "hero-demo"))
PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 8770


def regole():
    # riletto a ogni richiesta: si cambia vercel.json e si ricarica la pagina, senza riavviare
    with open(os.path.join(RADICE, "vercel.json"), encoding="utf-8") as f:
        return json.load(f).get("headers", [])


class Gestore(http.server.SimpleHTTPRequestHandler):
    # i caratteri con il loro tipo giusto, come fa Vercel
    extensions_map = dict(http.server.SimpleHTTPRequestHandler.extensions_map, **{".woff2": "font/woff2"})

    def end_headers(self):
        percorso = self.path.split("?")[0].split("#")[0]
        for regola in regole():
            if re.fullmatch(regola["source"], percorso):
                for h in regola["headers"]:
                    self.send_header(h["key"], h["value"])
        super().end_headers()


if __name__ == "__main__":
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORTA), functools.partial(Gestore, directory=RADICE))
    print("Anteprima su http://localhost:%d (header da vercel.json)" % PORTA)
    server.serve_forever()
