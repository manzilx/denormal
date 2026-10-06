"""Denormal Labs / Empower. Innovate. Sustain.

The brochure as an issued drawing set, on the lines of denormal.in: every page
is a sheet with margin grid references and a title block, set in Archivo and
JetBrains Mono on the site's olive palette, with photographs printed in the
site's duotone. Drawing numbers match the website's sheets (DL-101 is PCI in
both places). Copy comes from content.json, a snapshot of the site content.
"""
from pathlib import Path
import argparse, hashlib, json, os

ap = argparse.ArgumentParser()
ap.add_argument('--output', default='Denormal-Labs-Brochure-CMYK.pdf')
ap.add_argument('--profile', default='/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc')
args = ap.parse_args()
os.environ['DN_PROFILE'] = args.profile

from print_sheet import *  # noqa: E402
from pypdf import PdfReader, PdfWriter  # noqa: E402
from pypdf.generic import NameObject, ArrayObject, NumberObject, FloatObject, DictionaryObject, TextStringObject, DecodedStreamObject  # noqa: E402

ROOT = Path(__file__).parent
OUT = Path(args.output)
data = json.loads((ROOT / 'content.json').read_text())
SYS = {s['slug']: s for s in data['SYSTEMS']}
ART = TMP / 'artwork.pdf'
S = Sheet(ART, 'Denormal Labs / Empower. Innovate. Sustain.')

# Photographs: the site's slots, its captions and credits (site/content/photos.mjs).
PHOTO = {
    'landing': ('Quang Nguyen Vinh', 'Pexels License', 'https://www.pexels.com/photo/aerial-view-of-wind-turbines-and-solar-panels-at-sunrise-35105432/'),
    'people-decisions': ('Eduard Galeev', 'Pexels License', None),
    'pci': ('Magda Ehlers', 'Pexels License', None),
    'sentinel': ('Aravind P.S', 'Pexels License', None),
    'labour-compliance': ('Nazmul Haque', 'Pexels License', None),
    'nexusref': ('Burst', 'CC0 1.0', None),
    'onelegal': ('Tima Miroshnichenko', 'Pexels License', None),
}
def credit(slot): return f'Photo: {PHOTO[slot][0]} / Pexels'  # all seven are hosted on Pexels

L, R = 16, 281          # content edges inside the frame
TB = H - 8 - 17         # top of a standard title block


# ── shared drawing parts ─────────────────────────────────────────────────
def viewport(slot, x, y, w, h, caption, focus=(.5, .5)):
    S.duo_photo(PHOTOS / f'{slot}.jpg', x, y, w, h, name=slot, focus=focus)
    S.label(caption, x, y + h + 2.2, 'muted')
    S.label('NTS', x + w, y + h + 2.2, 'muted', align='right')

def gate(x, y, h, rule=False, ink='ink', ground='sheet'):
    """A gate: two jaws the line passes between. The rule gate is solid signal."""
    jaw = h * .36
    S.rect(x - 1.6, y - h / 2, 3.2, jaw, 'accent' if rule else ground, ink, .35)
    S.rect(x - 1.6, y + h / 2 - jaw, 3.2, jaw, 'accent' if rule else ground, ink, .35)

def flow(s, y, ink='ink', key='muted'):
    """The system drawn as it runs: input, three gates, a decision, outcomes."""
    S.label('Drawn as it runs', L, y - 23, key)
    S.label('Input · three gates · decision', R, y - 23, key, align='right')
    S.line(L, y - 18, R, y - 18, 'line', .25)
    S.rect(L, y - 6, 31, 12, 'paper', ink, .35)
    S.label('Input', L + 2.5, y - 4.4, key)
    S.para(s['input'], L + 2.5, y + .2 - (1.6 if S.width(s['input'], 8.4, 'Strong') > 26 else 0), 27, 8.4, ink, lead=1.12, font='Strong')
    gx = [L + 60, L + 109, L + 158]; dx = L + 205
    S.line(L + 31, y, dx - 7, y, ink, .45)
    for i, (g, xx) in enumerate(zip(s['gates'], gx)):
        rule = g.get('rule')
        gate(xx, y, 16, rule, ink)
        S.label(f'Gate 0{i + 1}' + (' · the rule' if rule else ''), xx - 1.6, y + 11, 'signal' if rule else key)
        S.text(g['t'], xx - 1.6, y + 15.3, 9, 'Strong', ink)
        S.para(g['m'][0].upper() + g['m'][1:] + '.', xx - 1.6, y + 19.8, 41, 7.6, 'ink2', lead=1.3)
    S.poly([(dx, y - 7), (dx + 7, y), (dx, y + 7), (dx - 7, y)], 'ink')
    S.label('Decision', dx - 7, y + 11, key)
    S.text(s['decision'], dx - 7, y + 15.3, 9, 'Strong', ink)
    ox = R - 37; n = len(s['outcomes'])
    for j, o in enumerate(s['outcomes']):
        oy = y + (j - (n - 1) / 2) * 9
        S.poly([(dx + 7, y), (dx + 15, y), (ox - 6, oy), (ox, oy)], None, ink, .3, close=False)
        S.circle(ox, oy, .8, ink)
        S.text(o, ox + 2.5, oy - 1.7, 8.2, 'Body', ink)

def rule_box(text, long, x, y, w):
    S.rect(x, y, 2.6, 24, 'accent')
    S.label("The line it won't cross", x + 7, y + .4, 'signal')
    S.text(text, x + 7, y + 5.4, 12.5, 'Display', 'ink', track=-.02)
    S.para(long, x + 7, y + 12.6, w - 7, 7.8, 'ink2', lead=1.3)

def proof(p, x, y, w):
    S.line(x, y, x + w, y, 'ink', .35)
    vw = S.width(p['v'], 28, 'Display', -.03)
    S.text(p['v'], x - .4, y + 2.4, 28, 'Display', 'ink', track=-.03)
    tx = x + max(vw, 11) + 3.5
    S.label(p['l'], tx, y + 3.2, 'muted')
    S.para(p['d'].replace('“', '"').replace('”', '"'), tx, y + 8, x + w - tx, 7.4, 'ink2', lead=1.3)

def system_sheet(n, slug, kicker, heading, lede, view, focus=(.5, .5), bottom=None):
    s = SYS[slug]
    S.begin(n, 'sheet'); S.frame('ink', 'muted')
    viewport(slug, 148, 16, 133, 74, view, focus)
    S.label(kicker, L, 17, 'signal')
    name = s['abbr'] if s.get('abbr') else s['name']
    # The name fills the column, capped at 96 pt; it gives way if the lede
    # would otherwise run into the drawing below.
    lines = len(S.wrap(lede, 118, 9.6))
    size = min(96, 125 / S.width(name, 1, 'Display', -.04))
    while 23 + size * PT * .96 + 3 + 2 * 30 * PT + 3 + lines * 9.6 * PT * 1.42 > 97: size -= 2
    y = S.display([name], L, 23, size, 'ink', track=-.04)
    y = S.display(heading, L, y + 3, 30, 'ink', lead=1.0)
    S.para(lede, L + .4, y + 3, 118, 9.6, 'ink2')
    flow(s, 125)
    if bottom: bottom(s)
    else:
        rule_box(heading_rule(s), s['rule']['long'].split('. ')[0].rstrip('.') + '.', L, 157, 122)
        for k, p in enumerate(s['proof']): proof(p, 148 + k * 68, 157, 63)
    S.title_block(s['name'], f'DL-10{s["n"][-1]}', n, credit=credit(slug))
    S.end()

RULES = {  # the brochure's one-line statement of each system's rule
    'pci': 'Unverified is a gap. Never compliance.',
    'sentinel': 'Below the floor, no generated answer.',
    'labour-compliance': 'Agents propose. A person approves.',
    'nexusref': 'Uncertain filing is marked for triage.',
    'onelegal': 'Unsealed evidence. No draft.',
}
def heading_rule(s): return RULES[s['slug']]


# ── 01 · DL-000 · Cover: the site's landing sheet, printed ───────────────
def callout(x, y, tx, tag, align='left'):
    S.circle(x, y, .7, 'onphoto'); S.circle(x, y, 2.4, None, 'onphoto', .25)
    S.line(x, y, tx, y, 'onphoto', .25, a=.85)
    S.label(tag, tx + (1.5 if align == 'left' else -1.5), y - 3.9, 'onphoto', align=align)

S.begin(1, 'duodark')
S.duo_photo(PHOTOS / 'landing.jpg', -3, -3, 303, 216, name='landing')
S.gradient(-3, -3, 303, 60, [(0, 'duodark', .55), (1, 'duodark', 0)], multiply=True)
S.gradient(-3, 70, 303, 143, [(0, 'duodark', 0), (.45, 'duodark', .55), (1, 'duodark', .92)], multiply=True)
S.gradient(-3, -3, 170, 216, [(0, 'duodark', .45), (1, 'duodark', 0)], vertical=False, multiply=True)
S.frame('onphoto', 'onphoto', a=.55)
S.logo(L, 17, 92, 'onphoto')
S.label('Lean digital workflows', R, 17.5, 'onphoto', align='right')
S.label('for infrastructure, power + complex operations', R, 22, 'onphoto', align='right')
callout(84.7, 65.2, 118, 'A1 · Wind')
callout(250, 131, R, 'A2 · Solar array', 'right')
S.label('Our core purpose', L, 92, 'accent')
S.line(L, 97.5, 30, 97.5, 'accent', .5)
y = S.display(['Empower.', 'Innovate. Sustain.'], L, 102, 74, 'onphoto')
S.para('Human-centered, lean digital workflows that enable innovation and create lasting impact.', L + .5, y + 4, 118, 11.5, 'onphoto')
S.label('Designed for', R, 150, 'accent', align='right')
for i, t in enumerate(data['AUDIENCE']):
    S.text(t, R, 155 + i * 4.2, 7.8, 'Body', 'onphoto', 'right')
S.title_block('Lean digital workflows', 'DL-000', 1, ink='onphoto', key='onphoto', rule='onphoto',
              ground=('duodark', .55), register=REGISTER, current=0, mark=False, credit=credit('landing'))
S.end()


# ── 02 · DL-400 · Why: purpose, values and the invitation ───────────────
P = data['PURPOSE']; A = data['ABOUT']
S.begin(2, 'sheet'); S.frame('ink', 'muted')
viewport('people-decisions', 148, 16, 133, 86, 'The crew at golden hour · stock photograph', (.5, .55))
S.label('Why · our purpose', L, 17, 'signal')
y = S.display(['A better tomorrow,', 'built around people.'], L, 23, 34, 'ink', lead=1.0)
y = S.para(P['vision']['statement'], L + .4, y + 4, 120, 11.2, 'ink', font='Body', lead=1.38)
y = S.para(A['lede'], L + .4, y + 3, 120, 9.2, 'ink2')
for i, t in enumerate(P['vision']['foot'].split('. ')):
    S.label(t.rstrip('.') + '.', L, y + 5 + i * 4.6, 'muted')
# values, as four columns of the sheet
S.line(L, 116, R, 116, 'ink', .35)
S.label('Values', L, 119, 'muted')
S.label('Four commitments behind every system', R, 119, 'muted', align='right')
short = ['Intentional craft. Less bloat.', 'Structure teams can understand.',
         'Protect time, attention and energy.', 'Add useful value to the work.']
for i, v in enumerate(data['VALUES']):
    x = L + i * 66.5
    S.label(v['n'], x, 127, 'signal')
    S.text(['Lean software. Deep care.', 'Clarity in complexity.', 'Efficiency meets empathy.', 'Value that matters.'][i],
           x, 131.5, 10.5, 'Strong', 'ink', track=-.01)
    S.para(short[i], x, 137.2, 58, 8.6, 'ink2')
    if i: S.line(x - 4, 127, x - 4, 147, 'line', .25)
# the invitation
S.line(L, 155, R, 155, 'line', .25)
S.text('Welcome home.', L - .5, 159, 30, 'Display', 'ink', track=-.04)
S.para("Let's build something meaningful, together.", L + .4, 172, 110, 10, 'ink2')
S.label('Designed for', 148, 160, 'muted')
S.para(' · '.join(data['AUDIENCE']), 148, 165, 133, 9, 'ink')
S.title_block('Why · our purpose', 'DL-400', 2, credit=credit('people-decisions'))
S.end()


# ── 03 · DL-200 · How: the Lean method as one production line ───────────
S.begin(3, 'plate'); S.frame('plateink', 'plateink', a=.5)
M = data['MISSION']
S.label('How · the Lean method', L, 17, 'accent')
S.display(['Complex operations.', 'Lean digital workflows.'], L, 23, 34, 'plateink', lead=1.0)
S.label('Six moves · one continuous method', 168, 24, 'accent')
S.para(P['mission']['statement'], 168, 29.5, 113, 10, 'plateink', lead=1.4)
# The production line, from irregular input to a person's decision.
T = lambda x, y: (L + (x - 14) * .985, y - 24)
def tl(x1, y1, x2, y2, color, lw): S.line(*T(x1, y1), *T(x2, y2), color, lw)
def tb(pts, color, lw):
    p = S.c.beginPath(); q = [T(*pt) for pt in pts]
    p.moveTo(q[0][0] * mm, (H - q[0][1]) * mm)
    for i in range(1, len(q), 3):
        a, b, d = q[i:i + 3]; p.curveTo(a[0] * mm, (H - a[1]) * mm, b[0] * mm, (H - b[1]) * mm, d[0] * mm, (H - d[1]) * mm)
    S.stroke(color); S.c.setLineWidth(lw * mm / mm); S.c.drawPath(p, fill=0, stroke=1)
for yy in (109, 121, 133):
    tb([(14, yy + 6), (34, yy - 21), (46, yy + 24), (62, yy), (82, yy - 11), (95, yy - 9), (110, yy)], 'dmuted', 1.2)
    tl(110, yy, 183, yy, 'plateink', 1.2)
    tb([(183, yy), (195, yy), (198, 121), (210, 121)], 'plateink', 1.2)
tl(210, 121, 269, 121, 'accent', 3.2)
for x in (14, 59.5, 105, 150.5, 196, 241.5):
    S.line(*T(x, 100), *T(x, 151), 'plateink', .25, a=.3)
    tl(x, 100, x + 6, 100, 'dink2', .5); tl(x, 151, x + 6, 151, 'dink2', .5)
for x, y_, r in ((21, 108, 2.2), (32, 136, 1.9), (42, 116, 2.8), (48, 137, 1.8)):
    S.circle(*T(x, y_), r, 'dink2')
for x, y_ in ((69, 113), (80, 120), (91, 127)):
    q = T(x - 2.6, y_ - 2.6); S.rect(q[0], q[1], 5.2, 5.2, 'plate', 'accent', .4)
for x in (115, 127, 139):
    for y_ in (109, 121, 133):
        q = T(x - 2.2, y_ - 2.2); S.rect(q[0], q[1], 4.4, 4.4, 'plateink')
tb([(167, 133), (170, 145), (181, 146), (184, 146)], 'dmuted', .6)
S.circle(*T(184, 146), 2, None, 'dmuted', .4)
tl(181.5, 143.5, 186.5, 148.5, 'dmuted', .6); tl(181.5, 148.5, 186.5, 143.5, 'dmuted', .6)
q = T(210, 105); S.rect(q[0], q[1], 7, 13, 'accent'); q = T(210, 124); S.rect(q[0], q[1], 7, 13, 'accent')
q = T(221, 109); S.rect(q[0], q[1], 4.5, 4.5, None, 'accent', .5)
tb([(223, 113), (228, 105), (233, 105), (235, 105)], 'accent', .4)
S.circle(*T(237, 105), 1.2, 'accent')
S.circle(*T(263, 121), 9.3, 'plate', 'accent', .9)
S.circle(*T(263, 121), 3.6, 'accent')
S.label('A person decides', R, 132, 'accent', align='right')
S.label('Waste leaves the line', T(190, 150)[0], 128, 'dmuted')
for i, m in enumerate(M):
    x = L + i * 44.4
    S.label(f"{m['n']} / {m['lean']}", x, 140, 'accent')
    S.text(['See the real work.', 'Map the value.', 'Repeat what works.', 'Remove the waste.', 'Catch errors early.', 'Keep people in control.'][i],
           x, 145, 9.6, 'Strong', 'plateink', track=-.01)
    S.para(m['d'], x, 150.5, 39, 7.4, 'dink2', lead=1.32)
S.label('Find the friction. Change the flow. Catch the error early.', L, 176, 'dmuted')
S.title_block('How · the Lean method', 'DL-200', 3, ink='plateink', key='dmuted', rule='dhatch')
S.end()


# ── 04–08 · DL-101…105 · the five systems ────────────────────────────────
system_sheet(4, 'pci', 'System 01 · Pre-award tender review', ['See the risk', 'before you bid.'],
             'Bring the tender pack into one review. Find contractual exposure, prepare deviations and pre-bid queries, and give the bid team a clearer basis for its decision.',
             'Pipework and machinery · stock photograph', (.5, .45))
system_sheet(5, 'sentinel', 'System 02 · Site safety and permits', ['Observe.', 'Ground. Act.'],
             'Turn a site observation into a structured hazard report, retrieve cited countermeasures and review permit controls with the evidence in view.',
             'Scaffold around a column · stock photograph', (.5, .5))
system_sheet(6, 'labour-compliance', 'System 03 · Labour Compliance · month-close', ['Close the month.', 'Keep the record.'],
             'Collect contractor records, reconcile wages and contributions, and bring proposed reminders, notices and updates to a person for approval.',
             'At the worksite · stock photograph', (.5, .4))
system_sheet(7, 'nexusref', 'System 04 · Project correspondence', ['Every message.', 'In its place.'],
             'Bring mail, letters and attachments into a connected project record. Preserve the filing context, the formal reference and each identifiable revision.',
             'Project documents with the site team · stock photograph', (.5, .5))

def close_onelegal(s):
    """OneLegal's rule and its playbook figure, then the call to start."""
    rule_box(RULES['onelegal'], 'Drafting refuses to run over an evidence set that has not been sealed.', L, 157, 78)
    proof(s['proof'][0], 101, 157, 60)
    x, y, w, h = 168, 150, 113, 31
    S.rect(x, y, w, h, 'plate')
    S.qr(x + 4, y + 4, 23, 'plateink')
    S.label('Start · fixed scope · fixed fee', x + 32, y + 4, 'accent')
    S.text('Start with one document.', x + 32, y + 9, 15, 'Display', 'plateink', track=-.03)
    S.text('hello@denormal.in', x + 32, y + 17.4, 9, 'Strong', 'plateink')
    S.label('Scan · denormal.in · New Delhi, India', x + 32, y + 23.6, 'dink2')
    S.c.linkURL('https://denormal.in', ((x + 4) * mm, (H - y - 27) * mm, (x + 27) * mm, (H - y - 4) * mm), relative=1, thickness=0)
    S.c.linkURL('mailto:hello@denormal.in', ((x + 32) * mm, (H - y - 21) * mm, (x + 70) * mm, (H - y - 17) * mm), relative=1, thickness=0)

system_sheet(8, 'onelegal', 'System 05 · Contract risk review + claims', ['Know the risk.', 'Build the claim.'],
             'Run the contract through a playbook of 301 questions. Every answer is cited to its clause and every clause is scored against a market baseline. When a claim follows, notices and a Statement of Claim draft from evidence counsel has sealed.',
             'Drawings and sketches on the desk · stock photograph', (.5, .5), bottom=close_onelegal)
S.save()

# ── PDF/X boxes, output intent, manifest ─────────────────────────────────
r = PdfReader(ART); out = PdfWriter(); out.clone_document_from_reader(r)
for p in out.pages:
    p[NameObject('/TrimBox')] = ArrayObject([FloatObject(v * mm) for v in (3, 3, 300, 213)])
    p[NameObject('/BleedBox')] = ArrayObject([FloatObject(v * mm) for v in (0, 0, 303, 216)])
    p[NameObject('/CropBox')] = p['/MediaBox']
    p[NameObject('/Group')] = DictionaryObject({NameObject('/Type'): NameObject('/Group'), NameObject('/S'): NameObject('/Transparency'), NameObject('/CS'): NameObject('/DeviceCMYK')})
icc = DecodedStreamObject(); icc.set_data(ICC); icc[NameObject('/N')] = NumberObject(4)
intent = DictionaryObject({NameObject('/Type'): NameObject('/OutputIntent'), NameObject('/S'): NameObject('/GTS_PDFX'),
                           NameObject('/OutputConditionIdentifier'): TextStringObject('Generic CMYK'),
                           NameObject('/Info'): TextStringObject('Generic CMYK Profile; rebuild with --profile set to the printer\'s profile (e.g. ISO Coated v2 / FOGRA39)'),
                           NameObject('/DestOutputProfile'): out._add_object(icc)})
out._root_object[NameObject('/OutputIntents')] = ArrayObject([out._add_object(intent)])
out.add_metadata({'/Title': 'Denormal Labs / Empower. Innovate. Sustain.', '/Author': 'Denormal Labs',
                  '/Subject': '8 sheets; A4 landscape; drawing-set layout matching denormal.in; duotone stock photographs; logo set in type; original website QR; 3 mm bleed',
                  '/Keywords': 'Denormal Labs, PCI, Sentinel, Labour Compliance, NexusRef, OneLegal'})
with OUT.open('wb') as stream: out.write(stream)
manifest = {
    'pages': 8, 'trim_mm': [297, 210], 'bleed_mm': 3, 'profile': f'{Path(args.profile).name} (embedded)',
    'layout': 'Drawing set: margin grid references and a title block on every sheet; drawing numbers match denormal.in',
    'type': 'Archivo (440 display, 400 body, 580 strong; 800 at 125% width for the wordmark) and JetBrains Mono 600; SIL OFL 1.1',
    'colour': 'denormal.in olive palette converted through the ICC profile; photographs baked to the site duotone (#2A2C12 to #ECE6CF) then converted to CMYK',
    'logo': 'Set in type as on denormal.in; print floors: LABS at least 6.5 pt, ruler strokes at least 0.3 mm',
    'photographs': {k: {'author': a, 'licence': l, **({'url': u} if u else {})} for k, (a, l, u) in PHOTO.items()},
    'photo_records': 'site/licenses/*.json in the website repository',
    'graphics': 'Original vector drawings of each system as it runs (input, three gates, decision); conceptual, not product screenshots',
    'qr': 'Supplied website QR, HTTPS://DENORMAL.IN, light modules on the dark start plate',
    'copy_source': 'content.json, snapshot of the denormal.in content, 2026-10-01',
    'sha256': hashlib.sha256(OUT.read_bytes()).hexdigest(),
}
(ROOT / 'production-manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
(ROOT / 'text-layout.json').write_text(json.dumps(S.records, indent=2, ensure_ascii=False))
print(f'Created {OUT}: {len(out.pages)} pages; {OUT.stat().st_size:,} bytes')
