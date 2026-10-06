# Denormal Labs / Empower. Innovate. Sustain.

Eight-page landscape company and product brochure, revised 2026-10-01.

## Design

The brochure is an issued drawing set, on the same lines as denormal.in. Every
page is a sheet with a frame, margin grid references (1–8, A–E) and a title
block at the foot: Title, Dwg no., Rev, Sheet, Issued, Scale. Drawing numbers
match the website's sheets, so DL-101 is PCI in print and online.

1. DL-000 Cover: the website's landing sheet in print. Duotone wind-and-solar
   photograph, "Empower. Innovate. Sustain.", the A1/A2 photo callouts, and a
   title block whose drawing register doubles as the contents.
2. DL-400 Why: vision, values, "Welcome home." and who the systems are for.
3. DL-200 How: the six Lean moves drawn as one production line, on the
   site's dark plate.
4. DL-101 to 8. DL-105 The five systems. Each sheet has a photo viewport,
   then the system drawn as it runs (input, three gates, decision, outcomes),
   with the gate that carries its rule in yellow. Below: the line it won't
   cross and two verified figures. OneLegal leads with the 301-question
   playbook and closes with "Start with one document" and the website QR.

Type is the website's: Archivo (440 display, 400 body, 580 for small
headings) and JetBrains Mono 600 for labels. Colour is the site's olive
palette; the one yellow signal marks each system's rule and the call to start.

The logo is set in type as on denormal.in: the wordmark in Archivo 800 at 125%
width and -0.055 em tracking, the three-cell ruler with its orange first cell,
and LABS in JetBrains Mono 600. It is large on the cover and small in the title
block on every other sheet. Print floors keep it legible at small sizes: LABS
never under 6.5 pt, ruler strokes never under 0.3 mm. The supplied logo PNGs
and SVGs (assets/, brand-source.json) are kept for reference only.

## Photography and provenance

The photographs are the website's, with its credits and shortened captions
(site/content/photos.mjs; licence records in site/licenses/ in the website
repository). Each sheet credits its photograph in the title block. Eduard
Galeev is the Latin transliteration of the Pexels name Эдуард Галеев, as the
brochure fonts carry no Cyrillic.

| Sheet | Photograph | Credit | Licence |
|---|---|---|---|
| Cover | Wind and solar at sunrise | Quang Nguyen Vinh / Pexels | Pexels License |
| Why | The crew at golden hour | Eduard Galeev / Pexels | Pexels License |
| PCI | Pipework and machinery | Magda Ehlers / Pexels | Pexels License |
| Sentinel | Scaffold around a column | Aravind P.S / Pexels | Pexels License |
| Labour Compliance | At the worksite | Nazmul Haque / Pexels | Pexels License |
| NexusRef | Project documents with the site team | Burst / Pexels | CC0 1.0 |
| OneLegal | Drawings and sketches on the desk | Tima Miroshnichenko / Pexels | Pexels License |

The Pexels License permits print marketing, subject to its restrictions,
including no implied endorsement. All are stock photographs: none shows a
Denormal Labs employee, customer or project. assets/photos/ holds working
copies sized for this brochure only; do not offer them as standalone stock.

The system drawings are original vector illustrations of each workflow's
structure. They are concepts, not product screenshots or measured data. Every
figure and rule is taken from content.json, the current website content.

## Print specification

A4 landscape: 297 x 210 mm trim, 3 mm bleed on every side; 303 x 216 mm media.
Eight separate pages in reading order; the printer handles imposition and crop
marks. Photographs are baked to the site duotone (#2A2C12 to #ECE6CF) and
converted to CMYK through the profile; the cover is 3578 x 2550 px over the
bleed, and the interior viewports print at 300 dpi, except Sentinel (about
240 dpi, from a 1261 px source). Small dark text
prints from the black plate only. Lines are at least 0.35 pt. Fonts are
subset-embedded.

The QR is the supplied website pattern, printed as light modules on the dark
start plate on page 8, with the plate as its quiet zone. It decodes to
HTTPS://DENORMAL.IN.

The embedded output intent is macOS Generic CMYK; the file is not certified
PDF/X. Rebuild with the printer's profile (for example ISO Coated v2 /
FOGRA39) and ask for a colour proof: the muted yellow (#CCA845) is the colour
most likely to shift. The cover's darkening gradients are native CMYK Multiply
shadings and need a PDF-capable RIP.

## Rebuild

Dependencies: reportlab, Pillow, fonttools, brotli, numpy, pypdf; OpenCV for
the QR check in preflight.

    python build_brochure.py --output Denormal-Labs-Brochure-CMYK.pdf
    python build_brochure.py --profile /path/to/printer.icc --output brochure.pdf

build_brochure.py lays out the pages; print_sheet.py holds the shared parts
(palette, fonts, logo, frame, title block, duotone). The bundled fonts and
photographs make the source independent of the website repository.

    pdftocairo -png -r 300 -f 8 -l 8 Denormal-Labs-Brochure-CMYK.pdf qr
    python preflight.py --pdf Denormal-Labs-Brochure-CMYK.pdf --rendered-page qr-8.png

Preflight checks page boxes, font embedding, CMYK-only images and shadings,
required and forbidden content, text inside the safety margins and the QR.
