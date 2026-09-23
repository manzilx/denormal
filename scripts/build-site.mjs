// Builds dist/ for Cloudflare Pages from the Claude Design exports in export/.
//
// Each export is a self-unpacking bundle: a loader script, a gzip+base64
// manifest of resources keyed by UUID, and a template that references those
// UUIDs. The loader does the substitution in the browser on every visit,
// behind an "Unpacking..." screen. This does it once, at build time: every
// resource becomes a real file under /assets/ (named by content hash, so the
// fonts and React the three exports share are written once and cached
// forever), and the template is served as ordinary HTML.
//
// No dependencies — Cloudflare's build image only guarantees Node.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { renderAbout } from '../site/about.mjs';
import { CORRECTIONS, BANNED } from '../site/corrections.mjs';

const OUT = 'dist';
const EXPORT = 'export';
const EXT = {
  'text/javascript': 'js', 'application/javascript': 'js', 'font/woff2': 'woff2',
  'image/svg+xml': 'svg', 'image/png': 'png', 'image/jpeg': 'jpg', 'text/css': 'css',
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'assets'), { recursive: true });
cpSync('public', OUT, { recursive: true });

function block(src, type) {
  const m = src.match(new RegExp(`<script type="${type}">([\\s\\S]*?)</script>`));
  return m ? m[1] : null;
}

function unbundle(file) {
  const src = readFileSync(join(EXPORT, file), 'utf8');
  const manifest = JSON.parse(block(src, '__bundler/manifest'));
  let html = JSON.parse(block(src, '__bundler/template'));
  const ext = JSON.parse(block(src, '__bundler/ext_resources') || '[]');

  const url = {};
  for (const [uuid, entry] of Object.entries(manifest)) {
    let bytes = Buffer.from(entry.data, 'base64');
    if (entry.compressed) bytes = gunzipSync(bytes);
    const name = `${createHash('sha256').update(bytes).digest('hex').slice(0, 16)}.${EXT[entry.mime] || 'bin'}`;
    const path = join(OUT, 'assets', name);
    if (!existsSync(path)) writeFileSync(path, bytes);
    url[uuid] = `/assets/${name}`;
  }
  for (const [uuid, u] of Object.entries(url)) html = html.split(uuid).join(u);

  // Same two steps the loader performs. SRI attributes were computed for the
  // CDN copies; the files are now ours. The resource map lets the runtime load
  // React from /assets/ instead of unpkg.
  html = html.replace(/\s+integrity="[^"]*"/gi, '').replace(/\s+crossorigin="[^"]*"/gi, '');
  const map = {};
  for (const e of ext) if (url[e.uuid]) map[e.id] = url[e.uuid];
  const resources = `<script>window.__resources = ${JSON.stringify(map).replace(/<\//g, '<\\/')};</script>`;
  html = html.replace(/<head[^>]*>/i, (m) => m + resources);
  return html;
}

const used = new Set();
function correct(html) {
  CORRECTIONS.forEach(([find, replace], i) => {
    const next = find instanceof RegExp ? html.replace(find, replace) : html.split(find).join(replace);
    if (next !== html) used.add(i);
    html = next;
  });
  return html;
}

function must(html, find, replace, label) {
  if (!html.includes(find)) throw new Error(`build: expected text not found (${label}): ${find.slice(0, 80)}`);
  return html.split(find).join(replace);
}

const META = `
<meta name="description" content="Denormal Labs fixes processes, using technology, so complex operations run lean and fully digital.">
<meta property="og:title" content="Denormal Labs — built from the operating side">
<meta property="og:image" content="https://denormal.in/og.png">
<meta property="og:url" content="https://denormal.in/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">`;

function finish(html, { theme, label }) {
  html = html.replace(/<html>/i, '<html lang="en">').replace(/<\/title>/i, (m) => m + META);
  if (theme === 'dark') html = html.replace(/<title>[^<]*<\/title>/i, '<title>Denormal Labs — built from the operating side</title>');

  // Theme toggle: the exports link to each other by download filename.
  html = theme === 'light'
    ? must(html, 'href="Denormal%20Website%20-%20Dark.html"', 'href="/dark/"', 'toggle')
    : must(html, 'href="Denormal%20Website%20-%20Light.html"', 'href="/"', 'toggle');

  // The CAD cursor (crosshair, square and coordinate label that follow the
  // mouse) is switched off. Forced here rather than through the canvas's
  // cadCursor prop, so a fresh export with the prop left on cannot restore it;
  // the mousemove handler already returns early when the elements are absent.
  html = must(html, 'cad: (this.props.cadCursor ?? true) && st.fine && !this.reduced,', 'cad: false,', 'CAD cursor');

  // The Lean section's Vision block is pinned (position:sticky) so it can sit
  // beside the Mission list while that scrolls. Its grid only has two columns
  // from 983px wide; below that they stack, the pin stays, and the Mission
  // list scrolled straight through the Vision text on tablets and phones.
  // Un-pin it below 1000px — the margin covers a desktop scrollbar, which
  // narrows the grid but not the media query.
  html = must(html, '<div style="position:sticky;top:120px">', '<div data-dn-vision style="position:sticky;top:120px">', 'Vision pin');

  // About tab: appended to the primary nav, after the three section links.
  const inactive = theme === 'light' ? '#18181B' : '#F4F4F5';
  const about = theme === 'light' ? '/about/' : '/dark/about/';
  html = must(html,
    `navItems: SECTIONS.slice(1, 4).map((x, i) => ({`,
    `navItems: [...SECTIONS.slice(1, 4).map((x, i) => ({`, 'nav open');
  html = must(html,
    `line: st.active === i + 1 ? 'inset 0 -2px 0 #EA580C' : 'inset 0 0 0 #EA580C' })),`,
    `line: st.active === i + 1 ? 'inset 0 -2px 0 #EA580C' : 'inset 0 0 0 #EA580C' })), { href: '${about}', num: '06', label: 'About', color: '${inactive}', line: 'inset 0 0 0 #EA580C' }],`,
    'nav close');

  // Below 1040px the canvas hides its nav, which would leave About unreachable
  // on tablets and phones. A compact link sits beside the theme toggle there.
  // The header CTA is dropped under 560px: it ran 149px off a phone screen,
  // and the hero repeats the same call to action. So is the LABS tag beside
  // the logo, which otherwise pushes the About link off a 360px screen.
  const toggle = html.indexOf(theme === 'light' ? '<a href="/dark/"' : '<a href="/"');
  const close = html.indexOf('</a>', toggle) + 4;
  if (toggle < 0 || close < 4) throw new Error('build: theme toggle not found for the mobile About link');
  html = html.slice(0, close)
    + `<a href="${about}" data-dn-about style="align-items:center;padding:10px 11px;flex:0 0 auto;white-space:nowrap;color:${inactive};font:600 11px/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.13em;text-transform:uppercase">About</a>`
    + html.slice(close);
  html = html.replace(/<\/head>/i, `<style>html{overflow-x:clip}[data-dn-about]{display:none}@media (max-width:1039.98px){[data-dn-about]{display:flex}}@media (max-width:999.98px){[data-dn-vision]{position:static!important}}@media (max-width:560px){header a[href="#start"]{display:none!important}header a[aria-label="Denormal Labs home"]+span{display:none!important}}</style></head>`);

  return correct(html);
}

const light = finish(unbundle('Denormal Website - Light.html'), { theme: 'light' });
const dark = finish(unbundle('Denormal Website - Dark.html'), { theme: 'dark' });
let brochure = correct(unbundle('Denormal Brochure.html'));
brochure = brochure.replace(/<html>/i, '<html lang="en">').replace(/<\/title>/i, (m) => m + '\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">');

// The About page reuses the site's own @font-face rules, already rewritten
// to /assets/ paths, so it loads nothing the home page has not cached.
const fontCss = (light.match(/@font-face\s*{[^}]*}/g) || []).join('\n');

const pages = {
  'index.html': light,
  'dark/index.html': dark,
  'about/index.html': renderAbout({ theme: 'light', fontCss }),
  'dark/about/index.html': renderAbout({ theme: 'dark', fontCss }),
  'brochure/index.html': brochure,
};
for (const [path, html] of Object.entries(pages)) {
  mkdirSync(join(OUT, path, '..'), { recursive: true });
  writeFileSync(join(OUT, path), html);
}

// The previous site was a multi-page Astro build. Its URLs are in search
// results, the old brochure and people's history; send them somewhere real.
writeFileSync(join(OUT, '_redirects'), [
  '/products/*   /#systems   301',
  '/security/    /#deploy    301',
  '/security     /#deploy    301',
  '/contact/     /#start     301',
  '/contact      /#start     301',
  '/about        /about/     301',
  '',
].join('\n'));

// Hashed asset names never change content, so they cache hard. Pages must
// revalidate, or a deploy never reaches someone who has visited before.
writeFileSync(join(OUT, '_headers'), readFileSync('public/_headers', 'utf8')
  .replace('/_astro/*', '/assets/*')
  .replace(/\n# Astro fingerprints[^\n]*\n# contents[^\n]*\n/, '\n# Asset names are content hashes, so those URLs can never change contents.\n')
  + '\n/*/\n  Cache-Control: public, max-age=0, must-revalidate\n');

// A correction that matched nothing anywhere usually means the export's
// wording changed; the BANNED check below decides whether that matters.
CORRECTIONS.forEach(([, , why], i) => { if (!used.has(i)) console.warn(`  note: correction unused — ${why}`); });
const leaks = [];
for (const [path, html] of Object.entries(pages)) for (const b of BANNED) if (html.includes(b)) leaks.push(`${path}: "${b}"`);
if (leaks.length) throw new Error(`build: disproved claims reached dist/ — fix site/corrections.mjs\n  ${leaks.join('\n  ')}`);

const n = readFileSync(join(OUT, 'index.html')).length;
console.log(`built ${Object.keys(pages).length} pages → ${OUT}/ (home ${Math.round(n / 1024)} KB)`);
