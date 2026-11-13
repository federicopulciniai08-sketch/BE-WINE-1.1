# Mappa di una regione per la pagina L'enoteca (hero-demo/img/mappe/).
# 1. Scarica i comuni della regione da openpolis (N = codice ISTAT della regione, es. 5 Veneto, 13 Abruzzo):
#    https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_R_N_municipalities.geojson
# 2. python strumenti/mappa-regione.py comuni.geojson hero-demo/img/mappe/<regione>.svg 0.6
# 3. Il "centro" stampato va in REGIONI_ENOTECA (hero-demo/js/cantine.js).
# 4. python strumenti/mappe-js.py  (copia le mappe in js/mappe.js, per chi apre il sito dal file)
# Semplifica i confini tenendo uniti quelli in comune tra due comuni; disegna province e confine regionale.
import json, math, sys
from collections import defaultdict

src, out = sys.argv[1], sys.argv[2]
TOL = float(sys.argv[3]) if len(sys.argv) > 3 else 0.45
W = 600.0

d = json.load(open(src, encoding="utf8"))
feats = d["features"]

bx = d["bbox"]
lon0 = (bx[0] + bx[2]) / 2
lat0 = (bx[1] + bx[3]) / 2
kx = math.cos(math.radians(lat0))

def q(p):
    return (round(p[0], 6), round(p[1], 6))

rings = []  # (feature index, list of keys, closed)
for i, f in enumerate(feats):
    g = f["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    for poly in polys:
        for ring in poly:
            ks = [q(p) for p in ring]
            if ks[0] == ks[-1]:
                ks = ks[:-1]
            # drop consecutive duplicates
            clean = [k for j, k in enumerate(ks) if k != ks[j - 1]]
            if len(clean) >= 3:
                rings.append((i, clean))

edge_owners = defaultdict(set)
neigh = defaultdict(set)
for i, ks in rings:
    n = len(ks)
    for j in range(n):
        a, b = ks[j], ks[(j + 1) % n]
        edge_owners[frozenset((a, b))].add(i)
        neigh[a].add(b)
        neigh[b].add(a)

cnt = defaultdict(int)
for e, o in edge_owners.items():
    cnt[len(o)] += 1
print("edges by owner count", dict(cnt), file=sys.stderr)

junction = {v for v, s in neigh.items() if len(s) != 2}

# projection
xs, ys = [], []
def proj(k):
    return ((k[0] - lon0) * kx, (lat0 - k[1]))
allp = [proj(v) for v in neigh]
minx = min(p[0] for p in allp); maxx = max(p[0] for p in allp)
miny = min(p[1] for p in allp); maxy = max(p[1] for p in allp)
PAD = 4
s = (W - 2 * PAD) / (maxx - minx)
H = (maxy - miny) * s + 2 * PAD
def P(k):
    x, y = proj(k)
    return ((x - minx) * s + PAD, (y - miny) * s + PAD)

def dp(pts, tol):
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = pts[a]; bx, by = pts[b]
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy)
        best, bi = -1, -1
        for i in range(a + 1, b):
            px, py = pts[i]
            if L == 0:
                dd = math.hypot(px - ax, py - ay)
            else:
                dd = abs(dy * px - dx * py + bx * ay - by * ax) / L
            if dd > best:
                best, bi = dd, i
        if best > tol:
            keep[bi] = True
            stack.append((a, bi)); stack.append((bi, b))
    return [p for p, k in zip(pts, keep) if k]

arc_cache = {}
arcs_meta = {}  # canonical key -> (owners, simplified points)

def arc_simplified(verts):
    key = tuple(verts)
    rkey = tuple(reversed(verts))
    canon = min(key, rkey)
    if canon not in arc_cache:
        pts = [P(v) for v in canon]
        simp = dp(pts, TOL)
        arc_cache[canon] = simp
        owners = edge_owners[frozenset((verts[0], verts[1]))]
        arcs_meta[canon] = (frozenset(owners), simp)
    simp = arc_cache[canon]
    return simp if key == canon else list(reversed(simp))

feat_paths = defaultdict(list)
for i, ks in rings:
    n = len(ks)
    cuts = [j for j in range(n) if ks[j] in junction]
    if not cuts:
        m = min(range(n), key=lambda j: ks[j])
        cuts = [m]
    pts = []
    for c_i, c in enumerate(cuts):
        nxt = cuts[(c_i + 1) % len(cuts)]
        L = (nxt - c) % n or n
        seg = [ks[(c + t) % n] for t in range(L + 1)]
        part = arc_simplified(seg)
        pts.extend(part[:-1])
    if len(pts) >= 3:
        feat_paths[i].append(pts)

def fmt(v):
    t = f"{v:.1f}"
    return t[:-2] if t.endswith(".0") else t

def ring_d(pts):
    out = "M" + fmt(pts[0][0]) + " " + fmt(pts[0][1])
    px, py = round(pts[0][0], 1), round(pts[0][1], 1)
    for x, y in pts[1:]:
        x, y = round(x, 1), round(y, 1)
        out += "l" + fmt(x - px) + " " + fmt(y - py)
        px, py = x, y
    return out + "z"

def line_d(pts):
    out = "M" + fmt(pts[0][0]) + " " + fmt(pts[0][1])
    px, py = round(pts[0][0], 1), round(pts[0][1], 1)
    for x, y in pts[1:]:
        x, y = round(x, 1), round(y, 1)
        out += "l" + fmt(x - px) + " " + fmt(y - py)
        px, py = x, y
    return out

# centro della regione (lon, lat): media dei baricentri degli anelli esterni pesata sull'area
sa = sx = sy = 0.0
for i, ks in rings:
    a = cx = cy = 0.0
    n = len(ks)
    for j in range(n):
        x0, y0 = ks[j]; x1, y1 = ks[(j + 1) % n]
        c = x0 * y1 - x1 * y0
        a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
    if a == 0:
        continue
    # i buchi hanno verso opposto e si sottraggono da soli
    sa += a / 2; sx += cx / 6; sy += cy / 6
centro = (round(sx / sa, 3), round(sy / sa, 3))
print("centro", centro, file=sys.stderr)

lines = []
lines.append(f'<svg viewBox="0 0 {fmt(W)} {fmt(H)}" xmlns="http://www.w3.org/2000/svg" data-centro="{centro[0]},{centro[1]}">')
lines.append('<g class="abr__comuni">')
for i, f in enumerate(feats):
    pr = f["properties"]
    d_ = "".join(ring_d(r) for r in feat_paths[i])
    name = pr["name"].replace("&", "&amp;").replace('"', "&quot;")
    lines.append(f'<path data-comune="{name}" data-prov="{pr["prov_acr"]}" d="{d_}"/>')
lines.append("</g>")
prov_d, reg_d = [], []
for canon, (owners, simp) in arcs_meta.items():
    if len(owners) == 1:
        reg_d.append(line_d(simp))
    elif len(owners) == 2:
        a, b = list(owners)
        if feats[a]["properties"]["prov_acr"] != feats[b]["properties"]["prov_acr"]:
            prov_d.append(line_d(simp))
lines.append('<path class="abr__prov" d="' + "".join(prov_d) + '"/>')
lines.append('<path class="abr__reg" d="' + "".join(reg_d) + '"/>')
lines.append("</svg>")
open(out, "w", encoding="utf8").write("\n".join(lines))
print("size", W, H, "junctions", len(junction), file=sys.stderr)
