// Product glyphs on the house 32-unit grid: orthogonal or 45-degree geometry,
// square caps, mitred joins. Exactly one element per glyph carries the
// accent, and it is always the load-bearing part of the mechanism.
// Classes: .g-a accent stroke · .g-af accent fill · .g-f ink fill.
// Drawn from src/components/Glyph.astro and the export's Labour glyph.

export const GLYPHS = {
  // A citation bracket closing on the one passage that grounded the finding.
  pci: `<path class="g-a" d="M9 13.5H5v6h4"/><path d="M13 7h15M13 12h15"/><path class="g-a" d="M13 16.5h11"/><path d="M13 21h15M13 26h9"/>`,
  // Two interlocked links inside a set whose lid is sealed shut.
  onelegal: `<rect class="g-af" x="4" y="6.5" width="24" height="3"/><rect x="4" y="10.5" width="24" height="17.5"/><rect x="9" y="15" width="8" height="8"/><rect x="15" y="15" width="8" height="8"/>`,
  // A letter entering a connected project register.
  nexusref: `<rect class="g-af" x="3" y="9" width="6.5" height="4"/><path d="M9.5 4h19.5v24H9.5zM14 9h10M14 14h10M14 19h10M14 24h6"/>`,
  // Capture brackets around a measured value standing on a floor.
  sentinel: `<path d="M4 10V4h6M22 4h6v6M4 22v6h6M22 28h6v-6M16 20v-9"/><path class="g-a" d="M7 20h18"/>`,
  // A register on a clipboard, its clip and the tick both carrying the decision.
  'labour-compliance': `<rect x="8" y="5" width="16" height="22"/><rect class="g-af" x="12" y="2.5" width="8" height="4.5"/><path class="g-a" d="M12 14.5l3 3 6-7"/><path d="M12 22h8"/>`,
};

export function glyph(slug, { size = 32, label } = {}) {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg class="glyph" viewBox="0 0 32 32" width="${size}" height="${size}" ${a11y}>${GLYPHS[slug]}</svg>`;
}
