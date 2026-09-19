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

---

## Brochure — denormal-brochure.html

The five-product leave-behind. One self-contained HTML file; the CSS is inline
and there is no build step for the page itself. `denormal-brochure.pdf` is
rendered from it by `./build.sh`.

### Rendering

    ./brand/build.sh

Run it in the background and poll the output — the foreground form regularly
outlives a two-minute timeout:

    ./brand/build.sh & for i in $(seq 1 20); do [ -s brand/denormal-brochure.pdf ] && break; sleep 5; done

Headless Chrome needs a **fresh `--user-data-dir` on every run**; reusing one
makes it hang indefinitely. `build.sh` creates and removes one per invocation.

### What print does that the screen does not

Page numbers and the running product name come from CSS `@page` margin boxes.
Chrome supports those, and it supports **named pages** (`@page p1 { … }` with
`#p1 { page: p1 }`), which is how each product gets its own footer. It silently
drops `string-set` / `string()`, so the running head cannot be derived from the
heading — it is written out once per product instead. Both behaviours were
confirmed against a rendered PDF, not assumed.

Print also pins several grids that are `auto-fit` on screen. An `auto-fit` track
that breaks 2+1 leaves a visible empty cell, because the dividers are drawn as
per-cell `box-shadow`s over a card-coloured ground. Where a row can come up
short, pin the columns and span the last cell.

### Diagram rules

Marks are built on a 24- or 32-unit grid with orthogonal or 45° geometry only,
square caps, mitred joins, and **exactly one accent element per mark**, which is
always the load-bearing part of the mechanism. This is the same construction as
`src/components/Glyph.astro`, from which the five product glyphs are copied.

The per-product mechanism panel is **HTML, not SVG**, on purpose: the labels are
real text, so they reflow at page width, stay legible through a greyscale
photocopy, and can be grepped back against the source they were taken from.

> Every stage name inside a panel is a verbatim identifier from that product's
> code, and every threshold is the value in the source. If you change one,
> re-run the check: extract the `<li>` contents from each `.mech-stages` and
> `grep -rIlF` each against its repository. Nothing goes in a panel that cannot
> be found this way.
