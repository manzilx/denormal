# Denormal Labs visiting card

85 x 55 mm trim, 3 mm bleed (91 x 61 mm media), two pages per PDF: page 1
front, page 2 back. Page boxes are set (TrimBox 85 x 55), so the printer cuts
at the trim instead of guessing.

- **Denormal-Visiting-Card-Paper-CMYK.pdf** (chosen): the mark in black on the
  stock, bottom left, 46 mm wide (LOGO_W in build_card.py).
  Locked: a frozen copy and its source are in locked/.
- **Denormal-Visiting-Card-Paper-No-Boundary-CMYK.pdf**: the same card with no
  corner marks.
- **Denormal-Visiting-Card-Paper-Sheet-Frame-CMYK.pdf**: a drawing-sheet border,
  a hairline frame with grid divisions ticked inward; on the back the contact
  details become the sheet's title block, meeting the frame.
- **Denormal-Visiting-Card-Olive-CMYK.pdf**: the locked front knocked out of
  the site's olive plate (#3C3F1E). The back is identical.

The boundary is BOUNDARY in build_card.py: 'corners', 'none' or 'sheet'. A
full frame 4.5 mm from the edge shows any unevenness in the cut more than
corner marks do; ask the printer for their cutting tolerance.

## Why the previous card printed poorly, and what changed

| Previous file | This file |
|---|---|
| Exported from Chrome: RGB colour, left to the printer to convert | CMYK throughout |
| Fonts converted to Type 3 glyphs, which many RIPs render coarsely | TrueType fonts, subset-embedded |
| Near-black and grey text built from four inks: small type blurs if the plates shift | All text is 100% black (K only), or knocked out of a solid |
| Labels at about 5.5 pt in a warm grey, printed as a dot screen | No text under 6.5 pt; no tints anywhere in the type |
| Off-white background printed as a tint | The back is unprinted stock |
| No trim box on a 91 x 61 page | Trim and bleed boxes set |

## Print specification

- Stock: an uncoated or lightly textured white or natural-white board,
  350–450 gsm. Ask the printer what they hold.
- The olive front is a solid: ask for a hard proof, or for the olive to be
  matched to a Pantone spot by the printer. Rebuild with their profile:
  `python build_card.py --profile /path/to/printer.icc`.
- The corner marks sit 4.5 mm inside the trim. If the printer's cutting
  tolerance is wider than about 0.5 mm, uneven margins can show; ask, or
  remove them (`ticks()` in build_card.py).
- The QR decodes to HTTPS://DENORMAL.IN and keeps a quiet zone of at least
  four modules.

## Edit and rebuild

Names and numbers live in **card.json**. Type, colour, logo and QR come from
`../brochure/print_sheet.py`, so the card, brochure and denormal.in share one
system: Archivo, JetBrains Mono, the type-set logo, the site's palette.

    python build_card.py
    python preflight.py

Preflight checks the page boxes, fonts (no Type 3), CMYK-only colour, that all
text is solid black or knocked out at 6.5 pt or more, the safe area, and the QR.
