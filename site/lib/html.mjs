// Small helpers shared by the templates. No dependencies.

export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Hashed asset URLs, filled in by the build before any page renders.
let ASSETS = {};
export function setAssets(map) { ASSETS = map; }
export function asset(name) {
  if (!ASSETS[name]) throw new Error(`asset not built: ${name}`);
  return ASSETS[name];
}
