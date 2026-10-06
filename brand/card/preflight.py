"""Press checks for the visiting card: boxes, fonts, colour, type floors, QR."""
from pathlib import Path
import json, re, subprocess, sys, tempfile
import cv2
from pypdf import PdfReader
from pypdf.generic import ContentStream

ROOT = Path(__file__).parent
card = json.loads((ROOT / 'card.json').read_text())
report = {}
for variant in ('Olive', 'Paper', 'Paper-No-Boundary', 'Paper-Sheet-Frame'):
    pdf = ROOT / f'Denormal-Visiting-Card-{variant}-CMYK.pdf'
    r = PdfReader(pdf); assert len(r.pages) == 2
    for n, p in enumerate(r.pages, 1):
        mm = lambda box: [round(float(v) * 25.4 / 72, 2) for v in box]
        assert mm(p.trimbox) == [3, 3, 88, 58], mm(p.trimbox)
        assert mm(p.mediabox) == [0, 0, 91, 61] == mm(p.bleedbox)
        for ref in p['/Resources']['/Font'].values():
            f = ref.get_object()
            assert f['/Subtype'] != '/Type3', 'Type 3 font'
            assert '/FontFile2' in f['/FontDescriptor'], 'font not embedded'
        ops = ContentStream(p.get_contents(), r).operations
        assert not {b'rg', b'RG', b'g', b'G', b'sc', b'scn', b'SC', b'SCN'} & {op for _, op in ops}, 'non-CMYK colour'
        # Every glyph run is solid black or a knock-out: no tints, no rich black.
        fillc = None
        for v, op in ops:
            if op == b'k': fillc = tuple(round(float(x), 3) for x in v)
            if op == b'Tf': size = float(v[1]); assert size >= 6.5, f'text under 6.5 pt: {size}'
            if op in (b'Tj', b'TJ'): assert fillc in ((0, 0, 0, 1), (0, 0, 0, 0)), f'tinted text {fillc} on page {n}'
    layout = json.loads((ROOT / f'text-layout-{variant.lower()}.json').read_text())
    for t in layout:
        x, y, right, bottom = t['bounds_mm']
        assert x >= 4 and right <= 81 and y >= 4 and bottom <= 51, t
    text = subprocess.check_output(['pdftotext', str(pdf), '-'], text=True)
    for v in card.values(): assert v in text, v
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(['pdftocairo', '-png', '-r', '600', '-f', '2', '-l', '2', str(pdf), f'{d}/b'], check=True)
        im = cv2.imread(next(Path(d).glob('b*.png')).as_posix())
        payload = cv2.QRCodeDetector().detectAndDecode(im)[0]
    assert payload.casefold().rstrip('/') == 'https://denormal.in', payload
    report[variant] = {'pages': 2, 'trim_mm': [85, 55], 'bleed_mm': 3, 'fonts': 'TrueType, subset-embedded; no Type 3',
                       'colour': 'CMYK only; all text 100% K or knocked out of a solid', 'min_text_pt': 6.5,
                       'safe_area_mm': 4, 'qr': payload}
(ROOT / 'preflight-report.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
