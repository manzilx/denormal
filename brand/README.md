# Brand assets

## QR code — denormal.in

Encodes `HTTPS://DENORMAL.IN`. Scheme and host are case-insensitive (RFC 3986),
so the uppercase form resolves identically but lets the symbol use alphanumeric
mode instead of byte mode — which drops it from 25×25 to **21×21, the smallest
QR that exists**. Bigger modules at business-card size, which is the only thing
that matters for print scannability.

Verified: decoded back with OpenCV, and re-decoded cleanly at 220px, 140px and
90px square to simulate small print. The decoded string returns HTTP 200.

| File | Use |
|---|---|
| `denormal-qr-print.svg` | Pure black, transparent background. **Give this to the printer.** |
| `denormal-qr.svg` | `#18181B` on white — matches the card's ink rather than pure black. |
| `denormal-qr.png` | 1160px raster, for layout tools that will not take vector. |

Print at **18–20mm square minimum**. Keep the white margin that is built in —
that quiet zone is four modules wide and scanners need it. Do not crop to the
edge of the black.

To regenerate after a URL change, the encoding is one line with `segno`:

    segno.make("HTTPS://DENORMAL.IN", error='m').save("denormal-qr.svg", scale=10, border=4, unit='mm')
