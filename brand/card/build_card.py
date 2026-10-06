"""Denormal Labs visiting card, 85 x 55 mm, built for press.

Front: the mark across the card, on the olive plate (or on paper). Back: the
name, then the contact details as a title block, the same idiom as the
brochure and denormal.in. Everything a reader must read is solid black (K
only) or knocked out of a solid, at 6.5 pt or more; nothing small is a tint.
"""
from pathlib import Path
import argparse, json, os, sys

ap = argparse.ArgumentParser()
ap.add_argument('--profile', default='/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc')
args = ap.parse_args()
os.environ['DN_PROFILE'] = args.profile
ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT.parent / 'brochure'))
import print_sheet as ps  # noqa: E402
from print_sheet import Sheet, mm, PT, LOGO_ADV, ICC  # noqa: E402
from pypdf import PdfReader, PdfWriter  # noqa: E402
from pypdf.generic import NameObject, ArrayObject, FloatObject, NumberObject, DictionaryObject, TextStringObject, DecodedStreamObject  # noqa: E402

ps.W, ps.H = 85, 55          # trim; Sheet reads these at draw time
W, H, B = 85, 55, 3
M = 6.5                      # type margin (safe area 4 mm)
K = (0, 0, 0, 1)
PAPER = (0, 0, 0, 0)         # knock-out: the stock shows through

CARD = json.loads((ROOT / 'card.json').read_text())
LOGO_W = 46                  # ruler width of the front mark, mm


BOUNDARY = 'corners'          # 'corners' (locked), 'none', or 'sheet'

def boundary(S, ink, lw, titled=False):
    if BOUNDARY == 'corners': ticks(S, ink, lw=lw)
    elif BOUNDARY == 'sheet': sheet_frame(S, ink, lw, titled=titled)

def sheet_frame(S, ink, lw, inset=4.5, k=1.4, titled=False):
    """A drawing-sheet border: one hairline frame with grid divisions
    ticked inward, four across and two down, as on the brochure sheets."""
    x0, y0, x1, y1 = inset, inset, W - inset, H - inset
    S.rect(x0, y0, x1 - x0, y1 - y0, None, ink, lw)
    for i in range(1, 4):
        x = x0 + i * (x1 - x0) / 4
        S.line(x, y0, x, y0 + k, ink, lw)
        if not titled: S.line(x, y1, x, y1 - k, ink, lw)  # the title block owns the foot
    if not titled:
        y = (y0 + y1) / 2
        S.line(x0, y, x0 + k, y, ink, lw); S.line(x1, y, x1 - k, y, ink, lw)

def ticks(S, ink, inset=4.5, k=2.4, lw=.5):
    """Corner brackets at the safe line: the site's viewport marks."""
    for x, y, sx, sy in ((inset, inset, 1, 1), (W - inset, inset, -1, 1), (inset, H - inset, 1, -1), (W - inset, H - inset, -1, -1)):
        S.line(x, y, x + sx * k, y, ink, lw)
        S.line(x, y, x, y + sy * k, ink, lw)


def front(S, dark=True):
    S.begin(1, 'plate' if dark else PAPER)
    ink = PAPER if dark else K
    boundary(S, ink, .6 if dark else .4)
    S.label('Lean digital workflows', M, M + .4, ink, 7 if dark else 6.5)
    S.label('denormal.in', W - M, M + .4, ink, 7 if dark else 6.5, 'right')
    # The mark, bottom left. LABS keeps a print floor: 7.5 pt reversed, 6.5 pt on paper.
    w = LOGO_W
    f = w / LOGO_ADV; labs = 7.5 if dark else 6.5
    top = H - M - 1.2 - (ps.LOGO_ASC * f + .236 * f + .2 * f + max(.1 * f, 1.2) + labs * PT * ps.LOGO_CAP)
    S.logo(M, top, w, ink, labs_ink=ink, labs_min=labs)
    S.end()


def back(S):
    S.begin(2, PAPER)
    boundary(S, K, .4, titled=True)
    c = CARD
    S.text(c['name'], M - .3, M, 13, 'Strong', K, track=-.02)
    S.text(c['role'], M, M + 6.4, 8, 'Body', K)
    # QR with a four-module quiet zone: nothing printed within 2.6 mm.
    q = 15.5
    S.qr(W - M - q, M, q, K)
    # Contact details as a title block: one heavier rule, hairline cells.
    # On the sheet frame the title block meets the border, as on a drawing.
    sheet = BOUNDARY == 'sheet'; e0, e1 = (4.5, W - 4.5) if sheet else (M, W - M)
    row = 9.6; y0 = H - 4.5 - 2 * row if sheet else 30.5
    S.line(e0, y0, e1, y0, K, .75)
    S.line(e0, y0 + row, e1, y0 + row, K, .35)
    cells = [[('Tel', c['tel'], M, 44), ('Web', c['web'], 44, W - M)],
             [('Mail', c['mail'], M, 54), ('Based in', c['city'], 54, W - M)]]
    for r, line_ in enumerate(cells):
        top = y0 + r * row
        for i, (k, v, x0, x1) in enumerate(line_):
            if i: S.line(x0, top, x0, H - 4.5 if sheet and r else top + row, K, .35)
            px = x0 + (2.2 if i else 0)
            S.label(k, px, top + 1.7, K)
            S.text(v, px, top + 5.2, 8, 'Mono', K)
    S.c.linkURL(f"mailto:{c['mail']}", ((M) * mm, (H - y0 - 2 * row) * mm, 54 * mm, (H - y0 - row) * mm), relative=1, thickness=0)
    S.c.linkURL('https://denormal.in', ((W - M - q) * mm, (H - M - q) * mm, (W - M) * mm, (H - M) * mm), relative=1, thickness=0)
    S.end()


def build(out, dark):
    tmp = ps.TMP / f'card-{dark}.pdf'
    S = Sheet(tmp, f"{CARD['name']} · Denormal Labs")
    front(S, dark); back(S); S.save()
    r = PdfReader(tmp); w = PdfWriter(); w.clone_document_from_reader(r)
    for p in w.pages:
        p[NameObject('/TrimBox')] = ArrayObject([FloatObject(v * mm) for v in (B, B, W + B, H + B)])
        p[NameObject('/BleedBox')] = ArrayObject([FloatObject(v * mm) for v in (0, 0, W + 2 * B, H + 2 * B)])
    icc = DecodedStreamObject(); icc.set_data(ICC); icc[NameObject('/N')] = NumberObject(4)
    intent = DictionaryObject({NameObject('/Type'): NameObject('/OutputIntent'), NameObject('/S'): NameObject('/GTS_PDFX'),
                               NameObject('/OutputConditionIdentifier'): TextStringObject('Generic CMYK'),
                               NameObject('/DestOutputProfile'): w._add_object(icc)})
    w._root_object[NameObject('/OutputIntents')] = ArrayObject([w._add_object(intent)])
    w.add_metadata({'/Title': f"{CARD['name']} · Denormal Labs visiting card", '/Author': 'Denormal Labs',
                    '/Subject': '85 x 55 mm trim, 3 mm bleed; page 1 front, page 2 back; CMYK'})
    with open(out, 'wb') as f: w.write(f)
    (ROOT / f'text-layout-{Path(out).stem.replace("Denormal-Visiting-Card-", "").replace("-CMYK", "").lower()}.json').write_text(json.dumps(S.records, indent=2, ensure_ascii=False))
    print('Created', out)


build(ROOT / 'Denormal-Visiting-Card-Olive-CMYK.pdf', True)
build(ROOT / 'Denormal-Visiting-Card-Paper-CMYK.pdf', False)     # locked
for BOUNDARY, tag in (('none', 'No-Boundary'), ('sheet', 'Sheet-Frame')):
    build(ROOT / f'Denormal-Visiting-Card-Paper-{tag}-CMYK.pdf', False)
BOUNDARY = 'corners'
