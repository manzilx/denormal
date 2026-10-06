"""Denormal Labs print system v2: the brochure as an issued drawing set.

Shared primitives: site palette (CMYK via ICC), Archivo/JetBrains Mono
instances, the type-set logo with print floors, the drawing-sheet frame
(margin grid references + title block), duotone photos baked for print.
Coordinates are millimetres from the top-left of the trim.
"""
from pathlib import Path
import math, os, re, tempfile
import xml.etree.ElementTree as ET
import numpy as np
from PIL import Image, ImageCms, ImageOps, ImageEnhance
from fontTools.ttLib import TTFont as Font
from fontTools.varLib.instancer import instantiateVariableFont
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader

BRO = Path(__file__).parent
FONTS = BRO / 'fonts'
PHOTOS = BRO / 'assets/photos'
W, H, BLEED = 297, 210, 3
PROFILE = os.environ.get('DN_PROFILE', '/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc')
_prof = ImageCms.getOpenProfile(PROFILE)
ICC = _prof.tobytes()
_srgb = ImageCms.createProfile('sRGB')
_rgb2cmyk = ImageCms.buildTransform(_srgb, _prof, 'RGB', 'CMYK')

# The site's olive palette (site/assets/site.css, :root[data-palette=olive]).
HEX = dict(
    sheet='EEEDE4', paper='F8F7F0', ink='1A1B11', ink2='3B3D2C', muted='5F614B',
    line='CDCBB8', line2='DFDDCD', hatch='ABA98E', accent='CCA845', accentink='525527',
    signal='86680F', plate='3C3F1E', plateink='EEEDE4', duodark='2A2C12', duolight='ECE6CF',
    dsheet='0E0F09', dpaper='15160E', dink='ECEBDE', dink2='CAC9B6', dmuted='999982',
    dline='2B2C1D', dhatch='44462D', daccent='D1B053', onphoto='F3F1EA', orange='EA580C',
)
TMP = Path(tempfile.mkdtemp(prefix='denormal-brochure-'))

def hex2rgb(h): return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def to_cmyk(rgb):
    q = ImageCms.applyTransform(Image.new('RGB', (1, 1), rgb), _rgb2cmyk)
    return tuple(v / 255 for v in q.getpixel((0, 0)))
COL = {k: to_cmyk(hex2rgb(v)) for k, v in HEX.items()}
COL['black'] = (0, 0, 0, 1); COL['none'] = None
# Small text in ink prints as rich-free 100K for crisp registration.
COL['k'] = (0, 0, 0, 1)

# ── Fonts ────────────────────────────────────────────────────────────────
def _instance(name, wght, wdth=100):
    out = TMP / f'{name}.ttf'
    if not out.exists():
        f = instantiateVariableFont(Font(FONTS / 'archivo-var-latin.woff2'), {'wght': wght, 'wdth': wdth})
        f.flavor = None
        for rec in f['name'].names:
            if rec.nameID in (1, 4, 6): rec.string = ('Dn' + name).encode(rec.getEncoding())
        f.save(out)
    pdfmetrics.registerFont(TTFont(name, str(out)))
    return Font(out)
def _static(name, file):
    out = TMP / f'{name}.ttf'
    if not out.exists():
        f = Font(FONTS / file); f.flavor = None
        for rec in f['name'].names:
            if rec.nameID in (1, 4, 6): rec.string = ('Dn' + name).encode(rec.getEncoding())
        f.save(out)
    pdfmetrics.registerFont(TTFont(name, str(out)))
    return Font(out)

_instance('Display', 440)      # site h1/h2: 430-450
_instance('Light', 340)
_instance('Body', 400)
_instance('Strong', 580)
LOGOF = _instance('LogoWord', 800, 125)
_static('Mono', 'jbmono-400.woff2')
LABSF = _static('MonoB', 'jbmono-600.woff2')
LOGO_ASC = LOGOF['glyf']['d'].yMax / LOGOF['head'].unitsPerEm
LOGO_CAP = LABSF['glyf']['L'].yMax / LABSF['head'].unitsPerEm
LOGO_LS = -.055
LOGO_ADV = pdfmetrics.stringWidth('denormal', 'LogoWord', 1) + 8 * LOGO_LS + .01

PT = 25.4 / 72  # mm per point


class Sheet:
    def __init__(self, path, title='Denormal Labs'):
        self.c = canvas.Canvas(str(path), pagesize=((W + 2 * BLEED) * mm, (H + 2 * BLEED) * mm), pageCompression=1, initialFontName='Body')
        self.c.setTitle(title); self.c.setAuthor('Denormal Labs')
        self.n = 0; self.records = []

    # ── page lifecycle
    def begin(self, n, ground='sheet'):
        self.n = n; c = self.c
        c.saveState(); c.translate(BLEED * mm, BLEED * mm)
        self.rect(-BLEED, -BLEED, W + 2 * BLEED, H + 2 * BLEED, ground)
    def end(self):
        self.c.restoreState(); self.c.showPage()
    def save(self): self.c.save()

    # ── paint
    def fill(self, v, a=1):
        self.c.setFillColorCMYK(*(COL[v] if isinstance(v, str) else v)); self.c.setFillAlpha(a)
    def stroke(self, v, a=1):
        self.c.setStrokeColorCMYK(*(COL[v] if isinstance(v, str) else v)); self.c.setStrokeAlpha(a)
    def rect(self, x, y, w, h, color=None, edge=None, lw=.25, a=1):
        lw = max(lw, .35)  # points; press minimum
        if color: self.fill(color, a)
        if edge: self.stroke(edge, a); self.c.setLineWidth(lw)
        self.c.rect(x * mm, (H - y - h) * mm, w * mm, h * mm, fill=bool(color), stroke=bool(edge))
        self.c.setFillAlpha(1); self.c.setStrokeAlpha(1)
    def line(self, x1, y1, x2, y2, color='ink', lw=.25, dash=None, a=1, cap=0):
        lw = max(lw, .35)  # points; press minimum
        self.stroke(color, a); self.c.setLineWidth(lw); self.c.setDash(dash or []); self.c.setLineCap(cap)
        self.c.line(x1 * mm, (H - y1) * mm, x2 * mm, (H - y2) * mm)
        self.c.setDash([]); self.c.setStrokeAlpha(1)
    def poly(self, pts, color=None, edge=None, lw=.25, close=True, a=1):
        lw = max(lw, .35)  # points; press minimum
        p = self.c.beginPath(); p.moveTo(pts[0][0] * mm, (H - pts[0][1]) * mm)
        for x, y in pts[1:]: p.lineTo(x * mm, (H - y) * mm)
        if close: p.close()
        if color: self.fill(color, a)
        if edge: self.stroke(edge, a); self.c.setLineWidth(lw)
        self.c.drawPath(p, fill=bool(color), stroke=bool(edge))
        self.c.setFillAlpha(1); self.c.setStrokeAlpha(1)
    def circle(self, x, y, r, color=None, edge=None, lw=.25):
        lw = max(lw, .35)  # points; press minimum
        if color: self.fill(color)
        if edge: self.stroke(edge); self.c.setLineWidth(lw)
        self.c.circle(x * mm, (H - y) * mm, r * mm, fill=bool(color), stroke=bool(edge))
    def gradient(self, x, y, w, h, stops, vertical=True, multiply=False):
        """stops: [(pos, colorkey, alpha)] painted as a CMYK shading."""
        c = self.c; c.saveState()
        if multiply: c.setBlendMode('Multiply')
        p = c.beginPath(); p.rect(x * mm, (H - y - h) * mm, w * mm, h * mm); c.clipPath(p, fill=0, stroke=0)
        cols = [mixw(COL[k], a) for _, k, a in stops]
        pos = [s for s, _, _ in stops]
        if vertical: c.linearGradient(0, (H - y) * mm, 0, (H - y - h) * mm, cols, pos, extend=True)
        else: c.linearGradient(x * mm, 0, (x + w) * mm, 0, cols, pos, extend=True)
        c.restoreState()

    # ── type. y is the top of the line box; size in points.
    def text(self, t, x, y, size=9, font='Body', color='ink', align='left', track=0, a=1):
        # Small dark text prints from the black plate alone, for crisp registration.
        if color == 'ink' and size <= 12: color = 'k'
        elif color == 'ink2' and size <= 9.6: color = (0, 0, 0, .82)
        width = pdfmetrics.stringWidth(t, font, size) + max(0, len(t) - 1) * track * size
        px = x * mm - (width if align == 'right' else width / 2 if align == 'center' else 0)
        self.fill(color, a)
        o = self.c.beginText(); o.setFont(font, size); o.setCharSpace(track * size)
        o.setTextOrigin(px, (H - y) * mm - size * .78); o.textOut(t); self.c.drawText(o)
        self.c.setFillAlpha(1)
        self.text_rec(t, px / mm, y, width / mm, size)
        return width / mm
    def text_rec(self, t, x, y, w, size):
        self.records.append({'page': self.n, 'text': t, 'bounds_mm': [x, y, x + w, y + size * PT]})
    def label(self, t, x, y, color='muted', size=6.5, align='left', track=.12):
        return self.text(t.upper(), x, y, max(6.5, size), 'MonoB', color, align, track)
    def display(self, lines, x, y, size, color='ink', lead=.96, track=-.045, font='Display'):
        for i, t in enumerate(lines):
            self.text(t, x - size * PT * .04, y + i * size * PT * lead, size, font, color, track=track)
        return y + len(lines) * size * PT * lead
    def para(self, t, x, y, w, size=9.5, color='ink', lead=1.42, font='Body', track=-.005):
        lines = self.wrap(t, w, size, font, track)
        for i, s_ in enumerate(lines): self.text(s_, x, y + i * size * PT * lead, size, font, color, track=track)
        return y + len(lines) * size * PT * lead
    def wrap(self, t, w, size, font='Body', track=-.005):
        lines, s = [], ''
        for word in t.split():
            q = (s + ' ' + word).strip()
            if pdfmetrics.stringWidth(q, font, size) + len(q) * track * size > w * mm and s: lines.append(s); s = word
            else: s = q
        if s: lines.append(s)
        return lines
    def width(self, t, size, font, track=0):
        return (pdfmetrics.stringWidth(t, font, size) + max(0, len(t) - 1) * track * size) / mm

    # ── the logo, set in type. w = ruler width (mm). Print floors: LABS
    # never under 6pt, ruler strokes never under .3mm, ruler at least 1.5mm.
    def logo(self, x, y, w, ink='ink', labs=True, labs_ink=None, labs_min=6.5):
        f = w / LOGO_ADV  # wordmark size in mm
        base = y + LOGO_ASC * f
        self.fill(ink)
        o = self.c.beginText(); o.setFont('LogoWord', f / PT); o.setCharSpace(LOGO_LS * f / PT)
        o.setTextOrigin(x * mm, (H - base) * mm); o.textOut('denormal'); self.c.drawText(o)
        self.text_rec('denormal', x, y, w, f / PT)
        st = max(.3, .055 * f); h = max(1.5, .2 * f); top = base + .236 * f
        # As .logo-rule on the site: ink strokes left, right and along the
        # base; two inner ticks; three equal cells, the first filled orange
        # inside the strokes (it never covers the left stroke or the base).
        cell = (w - 4 * st) / 3
        self.rect(x, top + h - st, w, st, ink)
        for xx in (x, x + st + cell, x + 2 * st + 2 * cell, x + w - st):
            self.rect(xx, top, st, h, ink)
        self.rect(x + st, top, cell, h - st, 'orange')
        bottom = top + h
        if labs:
            size = max(labs_min, .089 * f / PT)
            capmm = size * PT * LOGO_CAP
            gap = max(.1 * f, 1.2)
            self.text('LABS', x, bottom + gap - size * PT * (.78 - LOGO_CAP) + 0, size, 'MonoB', labs_ink or ink, track=.34)  # solid: a tint this small prints as a fuzzy screen
            bottom += gap + capmm
        return bottom

    # ── drawing-sheet frame: margin grid refs and the frame line.
    FR = 8  # frame inset (mm)
    def frame(self, ink='ink', ref='muted', cols=8, rows=5, a=1, tb_top=None):
        F = self.FR; x0, y0, x1, y1 = F, F, W - F, H - F
        self.rect(x0, y0, x1 - x0, y1 - y0, None, ink, .35, a)
        cw = (x1 - x0) / cols; rh = (y1 - y0) / rows
        for i in range(cols + 1):
            xx = x0 + i * cw
            self.line(xx, y0 - 2.4, xx, y0, ink, .25, a=a); self.line(xx, y1, xx, y1 + 2.4, ink, .25, a=a)
        for i in range(cols):
            xx = x0 + (i + .5) * cw
            self.text(str(i + 1), xx, 2.3, 6.5, 'MonoB', ref, 'center', a=a)
            self.text(str(i + 1), xx, H - 6.3, 6.5, 'MonoB', ref, 'center', a=a)
        for j in range(rows + 1):
            yy = y0 + j * rh
            self.line(x0 - 2.4, yy, x0, yy, ink, .25, a=a); self.line(x1, yy, x1 + 2.4, yy, ink, .25, a=a)
        for j in range(rows):
            yy = y0 + (j + .5) * rh - 1
            self.text('ABCDEFGH'[j], 4, yy, 6.5, 'MonoB', ref, 'center', a=a)
            self.text('ABCDEFGH'[j], W - 4, yy, 6.5, 'MonoB', ref, 'center', a=a)

    # ── title block across the foot of the frame
    def title_block(self, title, dwg, sheet, of=8, ink='ink', key='muted', rule='line', ground=None,
                    register=None, current=None, h=17, mark=True, extra=None, credit=None):
        F = self.FR; x0, x1 = F, W - F; y1 = H - F; y0 = y1 - h
        if register: y0 -= 9
        if ground: self.rect(x0, y0, x1 - x0, y1 - y0, ground[0], a=ground[1])
        self.line(x0, y0, x1, y0, ink, .5)
        fr = (x1 - x0) / 9.6
        cells = [('mark', 2.2), ('Title', 2.4), ('Dwg no.', 1), ('Rev', 1), ('Sheet', 1), ('Issued', 1), ('Scale', 1)]
        vals = {'Title': title, 'Dwg no.': dwg, 'Rev': 'A', 'Sheet': f'{sheet:02d} of {of:02d}', 'Issued': '2026-10', 'Scale': 'NTS'}
        if extra: vals.update(extra)
        x = x0; top = y0
        for name, span in cells:
            cw = span * fr
            if x > x0: self.line(x, top, x, top + h, rule, .25)
            if name == 'mark':
                if mark: self.logo(x + 3.5, top + 3.4, 31, ink)
                else:
                    self.label('Owner', x + 3, top + 3.2, key, 5.4)
                    self.text('Denormal Labs', x + 3, top + 9.6, 9.6, 'Strong', ink, track=-.01)
                    self.label('denormal.in', x + 2.2 * fr - 3, top + 3.2, key, 5.4, 'right')
            else:
                self.label(name, x + 3, top + 3.2, key, 5.4)
                v = vals[name]
                font = 'Strong' if name == 'Title' else 'MonoB'
                size = 9.6 if name == 'Title' else 8
                self.text(v, x + 3, top + 9.6, size, font, ink, track=-.01 if name == 'Title' else 0)
                if name == 'Title' and credit: self.text(credit, x + 3, top + 13.4, 6.5, 'Mono', key)
            x += cw
        if register:
            ry = top + h
            self.line(x0, ry, x1, ry, rule, .25)
            self.label('Drawing register', x0 + 3, ry + 3.1, key, 5.4)
            rx = x0 + 2.2 * fr + 3; step = (x1 - rx) / len(register)
            for i, (dn, t) in enumerate(register):
                xx = rx + i * step
                on = current == i
                self.text(dn, xx, ry + 2.7, 6.5, 'MonoB', 'accent' if on else key, track=.06)
                self.text(t, xx + 11.6, ry + 2.6, 7.4, 'Strong' if on else 'Body', ink)
        return y0

    # ── photograph baked to the site duotone (grey -> duo-dark..duo-light)
    def duo_photo(self, src, x, y, w, h, dark='duodark', light='duolight', crop=None, contrast=1.12,
                  name=None, focus=(.5, .5), gamma=1.0):
        im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
        if crop:
            iw, ih = im.size; im = im.crop((int(crop[0] * iw), int(crop[1] * ih), int(crop[2] * iw), int(crop[3] * ih)))
        iw, ih = im.size
        s = max(w / iw, h / ih); pw, ph = iw * s, ih * s
        # crop to the box at 300 dpi max
        cx = (pw - w) * focus[0]; cy = (ph - h) * focus[1]
        box = (cx / s, cy / s, (cx + w) / s, (cy + h) / s)
        im = im.crop(tuple(int(round(v)) for v in box))
        px = int(min(im.width, w / 25.4 * 300))
        im = im.resize((px, int(px * h / w)), Image.LANCZOS)
        g = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=.5)
        g = np.asarray(g, dtype=np.float32) / 255
        g = np.clip((g - .5) * contrast + .5, 0, 1) ** gamma
        D = np.array(hex2rgb(HEX[dark])) / 255; L = np.array(hex2rgb(HEX[light])) / 255
        scr = 1 - (1 - g[..., None]) * (1 - D)
        out = (scr * L * 255).clip(0, 255).astype(np.uint8)
        rgb = Image.fromarray(out, 'RGB')
        cm = ImageCms.applyTransform(rgb, _rgb2cmyk)
        p = TMP / f'{name or Path(src).stem}-{int(w)}x{int(h)}.jpg'
        cm.save(p, quality=94, icc_profile=ICC)
        self.c.drawImage(ImageReader(str(p)), x * mm, (H - y - h) * mm, w * mm, h * mm)
        return g  # grey array for further use

    # ── QR, the supplied pattern as filled modules
    def qr(self, x, y, w, color='ink'):
        svg = ET.parse(BRO / 'original-qr-white.svg').getroot()
        shape = next(e for e in svg.iter() if e.tag.endswith('path'))
        bx, by, bw, bh = map(float, svg.attrib['viewBox'].split())
        factor = float(re.search(r'scale\(([^)]+)\)', shape.attrib['transform']).group(1))
        left, top, size = bx / factor, by / factor, bw / factor
        parts = re.findall(r'([MmHh])([^MmHh]+)', shape.attrib['d']); px = py = 0; sc = w / size
        # One filled path; each run overlaps the row below by a hair, so
        # adjacent modules print as one solid shape with no seams.
        path = self.c.beginPath(); lap = .03
        for cmd, value in parts:
            nums = [float(v) for v in re.findall(r'-?\d+(?:\.\d+)?', value)]
            if cmd in 'Mm':
                if cmd == 'M': px, py = nums
                else: px += nums[0]; py += nums[1]
            else:
                end = nums[0] if cmd == 'H' else px + nums[0]
                rx = x + (min(px, end) - left) * sc; ry = y + (py - .5 - top) * sc
                path.rect(rx * mm, (H - ry - sc - lap) * mm, abs(end - px) * sc * mm, (sc + lap) * mm); px = end
        self.fill(color); self.c.drawPath(path, fill=1, stroke=0, fillMode=1)  # FILL_NON_ZERO: overlaps stay filled


def mixw(cmyk, a):
    """CMYK colour at alpha a over white, for Multiply shadings."""
    return tuple(v * a for v in cmyk)

REGISTER = [('000', 'Cover'), ('400', 'Why'), ('200', 'How'), ('101', 'PCI'),
            ('102', 'Sentinel'), ('103', 'Labour'), ('104', 'NexusRef'), ('105', 'OneLegal')]
