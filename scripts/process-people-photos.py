"""Prepare licensed, non-identifying people/process imagery for the site.
The output excludes visible faces and branding; provenance in site/licenses/.
Run from the repository root with Pillow installed.
"""
from pathlib import Path
from PIL import Image, ImageOps
SLOTS = {
 'engineering-team': ('anonymous-planning.jpg', None),
 'site-planning': ('site-measurement.jpg', None),
 'process-inspection': ('process-inspection.jpg', (.16, .44, .70, .96)),
}
for slot, (name, box) in SLOTS.items():
 im=ImageOps.exif_transpose(Image.open(Path('photos-src')/name)).convert('RGB')
 if box:
  w,h=im.size
  im=im.crop(tuple(round(v*(w if i%2==0 else h)) for i,v in enumerate(box)))
 grey=ImageOps.autocontrast(ImageOps.grayscale(im),cutoff=.5)
 widths=[w for w in [640,1024,1600,2400] if w<=grey.width]
 if grey.width<2400 and grey.width-widths[-1]>200:widths.append(grey.width)
 # Delete only derivatives owned by these three slots, before resizing.
 for path in Path('site/assets/img').glob(slot+'-*'):
  if path.suffix in ['.jpg','.webp']:path.unlink()
 for w in widths:
  r=grey.resize((w,round(grey.height*w/grey.width)),Image.Resampling.LANCZOS)
  r.save(f'site/assets/img/{slot}-{w}.jpg',quality=78,optimize=True,progressive=True)
  r.save(f'site/assets/img/{slot}-{w}.webp',quality=78,method=6)
 thumb=im.copy();thumb.thumbnail((900,500));thumb.save('/tmp/'+slot+'-rights-check.jpg')
 print(slot, widths, grey.size)
