# Denormal Labs — Brochure code and HTML

The current approved eight-page company and product brochure, exported 2026-10-01.

## Open the brochure

Double-click **Denormal-Labs-Brochure.html**. It is completely self-contained:
no server, dependencies or internet connection are needed. Use the page selector,
arrow buttons or ordinary scrolling. The print button opens the browser print dialog.

## Edit the design

The editable artwork is in **build_brochure.py**, with shared drawing-sheet parts
in **print_sheet.py**. Company and product copy is in **content.json**. The supplied
QR, licensed photographs, fonts and their provenance are included. See **README-print.md** for the full
print-production and licence notes.

The HTML preserves the approved artwork as scalable SVG. Text and diagrams are
vector outlines for faithful rendering, with a screen-reader text transcript for
every page. To change the copy or layout, edit the Python source and rebuild;
the outlined HTML is a presentation export rather than a semantic HTML redesign.

## Rebuild

Install the dependencies stated in README-print.md. Poppler supplies pdftocairo
and pdftotext; on macOS it can be installed with `brew install poppler`.

    python build_brochure.py --output Denormal-Labs-Brochure-CMYK.pdf
    python export_brochure_html.py Denormal-Labs-Brochure-CMYK.pdf Denormal-Labs-Brochure.html

Pillow is optional for the HTML export and reduces the cover image file size.
The approved CMYK PDF is included for reference and professional printing.
Browser displays and browser-generated PDFs use RGB; send the supplied CMYK PDF
to the printer for production rather than a browser-generated PDF.
