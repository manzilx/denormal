"""Turn approved stock originals (photos-src/, gitignored) into the committed
greyscale web images in site/assets/img/. Run locally, never in CI:

    python3 scripts/process-photos.py

Needs Pillow and cwebp. Each slot is cropped (to keep faces and brand marks
out of frame), converted to greyscale so the set reads as one, and written as
JPEG and WebP at up to four widths. Prints the dimensions for photos.mjs.
"""
import json, subprocess, argparse
from pathlib import Path
from PIL import Image, ImageOps

SRC, OUT = Path('photos-src'), Path('site/assets/img')
WIDTHS = [640, 1024, 1600, 2400]  # 2400 for the full-bleed covers and bands
HIRES = {'pci', 'labour-compliance', 'systems-plant'}
QUALITY = {slot: 82 for slot in HIRES}
MAXW = {}

# slot: (file, crop box as fractions of the original (x0, y0, x1, y1) or None)
SLOTS = {
    'landing': ('landing.png', None),                # supplied generated aerial, from the FIELDWORK concept
    'hero': ('hero.jpg', None),
    'pci': ('pci.jpg', (0, 0, 0.77, 0.75)),
    'onelegal': ('onelegal.jpg', None),
    'systems-plant': ('systems-plant.jpg', None),
    'refinery-detail': ('refinery-detail.jpg', (0, 0, 1, 0.58)),
    'nexusref': ('anonymous-planning.jpg', None),
    'sentinel': ('sentinel-crop.jpg', None),          # scaffold only; workers cropped out
    'labour-compliance': ('labour-compliance.jpg', None),
    'deployment': ('deployment-crop.jpg', None),      # far corridor; maker badges cropped out
}

OUT.mkdir(parents=True, exist_ok=True)
parser = argparse.ArgumentParser()
parser.add_argument("--slots", nargs="*")
selected = parser.parse_args().slots
report = {}
for slot, (name, box) in SLOTS.items():
    if selected and slot not in selected:
        continue
    src = SRC / name
    if not src.exists():
        print(f'skip {slot}: {src} missing')
        continue
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    if box:
        w, h = im.size
        im = im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))
    grey = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=0.5)
    candidates = WIDTHS + ([3840] if slot in HIRES else [])
    widths = [w for w in candidates if w <= min(grey.width, MAXW.get(slot, 10**6))]
    if slot not in MAXW and grey.width < WIDTHS[-1] and (not widths or grey.width - widths[-1] > 200):
        widths.append(grey.width)  # a small crop still ships at its full width
    for w in widths:
        h = round(grey.height * w / grey.width)
        r = grey.resize((w, h), Image.LANCZOS)
        jpg = OUT / f'{slot}-{w}.jpg'
        q = QUALITY.get(slot, 72)
        r.save(jpg, quality=q, optimize=True, progressive=True)
        subprocess.run(['cwebp', '-quiet', '-q', str(q), str(jpg), '-o', str(OUT / f'{slot}-{w}.webp')], check=True)
    report[slot] = {'widths': widths, 'w': widths[-1], 'h': round(grey.height * widths[-1] / grey.width)}
    print(slot, report[slot], f"{sum((OUT / f'{slot}-{w}.webp').stat().st_size for w in widths) // 1024} KB webp")
print(json.dumps(report))
