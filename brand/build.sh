#!/usr/bin/env bash
# Renders denormal-brochure.html to denormal-brochure.pdf.
#
# Run this in the background and poll the output file — the foreground form
# regularly outlives a two-minute tool timeout:
#
#   ./brand/build.sh & for i in $(seq 1 20); do [ -s brand/denormal-brochure.pdf ] && break; sleep 5; done
#
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
chrome=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
[ -x "$chrome" ] || { echo "Chrome not found at: $chrome (override with \$CHROME)" >&2; exit 1; }

# A fresh profile per run. Reusing one makes headless Chrome hang indefinitely.
prof=$(mktemp -d)
trap 'rm -rf "$prof"' EXIT

"$chrome" --headless=new --disable-gpu --user-data-dir="$prof" \
  --no-pdf-header-footer --virtual-time-budget=20000 \
  --print-to-pdf="$here/denormal-brochure.pdf" \
  "file://$here/denormal-brochure.html" >/dev/null 2>&1

echo "wrote $here/denormal-brochure.pdf ($(wc -c <"$here/denormal-brochure.pdf" | tr -d ' ') bytes)"
