#!/usr/bin/env python3
"""Export the approved print brochure to one offline HTML file.

Requires Poppler (pdftocairo and pdftotext). Pillow is optional and reduces the
cover's embedded image size. Edit build_brochure.py to change the artwork, then
rebuild the PDF and run this script. Typography and graphics remain SVG paths.
"""
import argparse
import base64
import html
import io
import re
import subprocess
import tempfile
from pathlib import Path
import xml.etree.ElementTree as ET

SVG = "http://www.w3.org/2000/svg"
XLINK = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG)
ET.register_namespace("xlink", XLINK)
LABELS = ["Cover", "Why · our purpose", "How · the Lean method", "PCI", "Sentinel",
          "Labour Compliance", "NexusRef", "OneLegal + start"]


def prepare_svg(path, number):
    root = ET.parse(path).getroot()
    # The approved PDF has a 3 mm bleed surrounding an A4 landscape trim.
    bleed = 3 * 72 / 25.4
    width, height = 297 * 72 / 25.4, 210 * 72 / 25.4
    root.set("viewBox", f"{bleed:.6f} {bleed:.6f} {width:.6f} {height:.6f}")
    root.set("width", "100%")
    root.set("height", "100%")
    root.set("role", "img")
    root.set("aria-labelledby", f"page-{number}-title")
    title = ET.Element(f"{{{SVG}}}title", id=f"page-{number}-title")
    title.text = f"Denormal Labs brochure, page {number}: {LABELS[number - 1]}"
    root.insert(0, title)

    names = {e.attrib["id"]: f"p{number}-{e.attrib['id']}" for e in root.iter()
             if "id" in e.attrib and e is not title}
    for element in root.iter():
        if element.attrib.get("id") in names:
            element.set("id", names[element.attrib["id"]])
        for key, value in list(element.attrib.items()):
            if key == "id":
                continue
            if value.startswith("#") and value[1:] in names:
                value = "#" + names[value[1:]]
            value = re.sub(r"url\(#([^)]+)\)",
                           lambda m: "url(#" + names.get(m[1], m[1]) + ")", value)
            element.set(key, value)
        if element.tag == f"{{{SVG}}}image":
            key = f"{{{XLINK}}}href"
            data = element.attrib.get(key, "")
            if data.startswith("data:image/png;base64,"):
                try:
                    from PIL import Image
                    image = Image.open(io.BytesIO(base64.b64decode(data.split(",", 1)[1])))
                    if image.mode in ("RGB", "CMYK"):
                        image = image.convert("RGB")
                        image.thumbnail((4200, 4200), Image.Resampling.LANCZOS)
                        buffer = io.BytesIO()
                        image.save(buffer, "JPEG", quality=95, subsampling=0, optimize=True)
                        element.set(key, "data:image/jpeg;base64," +
                                    base64.b64encode(buffer.getvalue()).decode("ascii"))
                except ImportError:
                    pass
    return ET.tostring(root, encoding="unicode")


CSS = """
:root { color-scheme: dark; font-family: system-ui, sans-serif; background: #161916; color: #f1f2e9; }
* { box-sizing: border-box; }
body { margin: 0; }
.toolbar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 12px;
  padding: 14px 24px; background: #20251f; border-bottom: 1px solid #474d40; }
.brand { margin-right: auto; font-size: 14px; font-weight: 650; letter-spacing: .04em; }
.brand small { display: block; font-size: 11px; font-weight: 400; color: #b5bdac; margin-top: 4px; }
select, button { background: #30372c; color: #f1f2e9; border: 1px solid #57624b; border-radius: 4px;
  padding: 9px 12px; font: inherit; font-size: 13px; cursor: pointer; }
button:disabled { opacity: .35; cursor: default; }
button:hover:not(:disabled), select:hover { background: #414b37; }
:focus-visible { outline: 2px solid #d4cc87; outline-offset: 3px; }
main { width: min(1320px, calc(100% - 48px)); margin: 28px auto 60px; }
.page { scroll-margin-top: 102px; margin: 0 0 36px; }
.sheet { width: 100%; aspect-ratio: 297 / 210; overflow: hidden; background: #fff;
  box-shadow: 0 8px 30px #0005; }
.sheet svg { display: block; width: 100%; height: 100%; }
figcaption { padding: 12px 0; font-size: 12px; color: #aeb6a3; display: flex; justify-content: space-between; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0, 0, 0, 0); white-space: pre-line; border: 0; }
@media (max-width: 620px) {
  .toolbar { padding: 10px 12px; gap: 6px; flex-wrap: wrap; }
  .brand { flex-basis: 100%; margin-bottom: 4px; }
  .brand small { display: none; }
  select { flex: 1; min-width: 0; }
  main { width: calc(100% - 20px); margin-top: 16px; }
  .page { margin-bottom: 18px; scroll-margin-top: 112px; }
}
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
@page { size: A4 landscape; margin: 0; }
@media print {
  :root, body { background: white; }
  .toolbar, figcaption { display: none; }
  main { width: 297mm; margin: 0; }
  .page { margin: 0; width: 297mm; height: 210mm; break-after: page; page-break-after: always; }
  .page:last-child { break-after: auto; page-break-after: auto; }
  .sheet { width: 297mm; height: 210mm; box-shadow: none; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
}
"""
JS = """
const pages = Array.from(document.querySelectorAll('.page'));
const select = document.getElementById('page-choice');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
let current = 1;
function setPage(n) {
  current = Math.max(1, Math.min(pages.length, n));
  select.value = String(current);
  previous.disabled = current === 1;
  next.disabled = current === pages.length;
}
function jump(n) { setPage(n); pages[current - 1].scrollIntoView({block: 'start'}); }
select.addEventListener('change', () => jump(Number(select.value)));
previous.addEventListener('click', () => jump(current - 1));
next.addEventListener('click', () => jump(current + 1));
document.getElementById('print').addEventListener('click', () => window.print());
const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
  if (visible.length) setPage(Number(visible[0].target.dataset.page));
}, {threshold: [0.2, 0.5, 0.8]});
pages.forEach(p => observer.observe(p));
setPage(1);
"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    pages = []
    with tempfile.TemporaryDirectory(prefix="denormal-html-") as temporary:
        for number, label in enumerate(LABELS, 1):
            svg = Path(temporary) / f"page-{number}.svg"
            subprocess.run(["pdftocairo", "-f", str(number), "-l", str(number),
                            "-svg", str(args.pdf), str(svg)], check=True)
            text = subprocess.check_output(["pdftotext", "-f", str(number), "-l", str(number),
                                            "-layout", str(args.pdf), "-"], text=True).strip()
            pages.append(f'<figure class="page" id="page-{number}" data-page="{number}">'
                         f'<div class="sheet">{prepare_svg(svg, number)}</div>'
                         f'<div class="sr-only">{html.escape(text)}</div>'
                         f'<figcaption><span>{html.escape(label)}</span><span>{number:02d} / 08</span>'
                         '</figcaption></figure>')
    options = "".join(f'<option value="{n}">{n:02d} — {html.escape(label)}</option>'
                      for n, label in enumerate(LABELS, 1))
    document = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
                '<meta name="viewport" content="width=device-width, initial-scale=1">'
                '<meta name="description" content="Denormal Labs: Empower. Innovate. Sustain. '
                'Company and five systems, as a drawing set. Eight-page landscape brochure.">'
                '<title>Denormal Labs — Company + Product Brochure</title>'
                f'<style>{CSS}</style></head><body>'
                '<header class="toolbar"><div class="brand">DENORMAL LABS'
                '<small>Company + product brochure · 8 pages · A4 landscape</small></div>'
                '<label class="sr-only" for="page-choice">Go to page</label>'
                f'<select id="page-choice">{options}</select>'
                '<button id="previous" aria-label="Previous page">←</button>'
                '<button id="next" aria-label="Next page">→</button>'
                '<button id="print">Print / Save PDF</button></header>'
                f'<main>{"".join(pages)}</main><script>{JS}</script></body></html>')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(document, encoding="utf-8")
    print(f"Exported {len(pages)} pages: {args.output} ({args.output.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
