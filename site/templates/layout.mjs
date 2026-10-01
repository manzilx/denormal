// The sheet every page is drawn on: header with the wordmark ruler, column
// references, a margin rail of zone letters, and a title block as the footer.
import { esc, asset } from '../lib/html.mjs';
import { BRAND } from '../content/brand.mjs';
import { SITE, NAV } from '../content/site.mjs';
import { POLICIES } from '../content/policies.mjs';
import { SYSTEMS } from '../content/systems.mjs';

// The drawing register. Sheet numbers are real navigation: every page states
// its number, and the title block counts against this list.
export const SHEETS = [
  { path: '/', dwg: 'DL-000', title: 'General arrangement' },
  { path: '/systems/', dwg: 'DL-100', title: 'Systems · five workflows' },
  ...SYSTEMS.map((s, i) => ({ path: `/systems/${s.slug}/`, dwg: `DL-10${i + 1}`, title: s.name })),
  { path: '/how-we-work/', dwg: 'DL-200', title: 'How we work' },
  { path: '/deployment/', dwg: 'DL-300', title: 'Deployment' },
  { path: '/about/', dwg: 'DL-400', title: 'About' },
  ...POLICIES.map(p=>({path:p.path,dwg:p.code,title:p.title,policy:true})),
];
export const ISSUED = '2026-09-29';
export const REV = 'A';

export function sheetFor(path) {
  const i = SHEETS.findIndex((s) => s.path === path);
  return i < 0 ? null : { ...SHEETS[i], n: i + 1, of: SHEETS.length };
}

const pad = (n) => String(n).padStart(2, '0');

// Runs before the stylesheet so a dark-theme visitor never sees a light flash.
// It also shows the page as drawn if site.js has not run within three seconds.
// Olive is the chosen palette; a palette saved during exploration is ignored.
const THEME_BOOT = `(function(d){d.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.dataset.theme=t;if(sessionStorage.getItem('shutter')){sessionStorage.removeItem('shutter');d.classList.add('shutter-in');}}catch(e){}setTimeout(function(){if(!window.__dn)d.classList.add('no-motion');},3000);})(document.documentElement);`;

// Exploration only: a dock to compare the three palettes on the real pages.
// Remove (EXPLORE = false) once a palette is chosen.
const EXPLORE = false;
const PALETTES = [
  { id: 'olive', label: 'Olive', sw: ['#3C3F1E', '#6B6E3A', '#CCA845'] },
  { id: 'sage', label: 'Sage', sw: ['#2F4038', '#6E8277', '#C9A94E'] },
  { id: 'stone', label: 'Stone', sw: ['#4A463C', '#8C867A', '#C7A551'] },
];
function paletteDock() {
  if (!EXPLORE) return '';
  return `<details class="appearance"><summary>Appearance</summary><div class="palette-dock" role="group" aria-label="Colour palette">${PALETTES.map((p) => `<button type="button" data-palette-set="${p.id}" aria-pressed="false"><i aria-hidden="true">${p.sw.map((c) => `<b style="background:${c}"></b>`).join('')}</i>${p.label}</button>`).join('')}</div></details>`;
}

// The logo, set in type rather than traced: the Archivo wordmark, a ruler
// in three cells with the first filled, and LABS below. Every measure is a
// proportion of the wordmark's font size, taken from the supplied master
// (site.css, "Logo"), so one font-size scales the whole lockup.
function wordmark() {
  return `<span class="logo" aria-hidden="true"><span class="logo-word">${BRAND.name}</span><span class="logo-rule"><i></i></span><span class="logo-labs">${BRAND.descriptor}</span></span>`;
}

// The supplied QR code (it reads HTTPS://DENORMAL.IN), drawn inline in the
// ink colour. Cropped to its 21 modules, without the quiet-zone margin.
const QR = 'M4 4.5h7m1 0h3m3 0h7m-21 1h1m5 0h1m5 0h1m1 0h1m5 0h1m-21 1h1m1 0h3m1 0h1m4 0h2m1 0h1m1 0h3m1 0h1m-21 1h1m1 0h3m1 0h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h1m-21 1h1m1 0h3m1 0h1m1 0h2m2 0h1m1 0h1m1 0h3m1 0h1m-21 1h1m5 0h1m1 0h2m2 0h1m1 0h1m5 0h1m-21 1h7m1 0h1m1 0h1m1 0h1m1 0h7m-13 1h1m2 0h1m-12 1h1m3 0h1m1 0h4m2 0h6m2 0h1m-21 1h3m2 0h1m6 0h1m1 0h1m4 0h1m-16 1h7m1 0h1m2 0h1m1 0h2m1 0h1m-19 1h4m1 0h4m2 0h1m5 0h1m-20 1h1m3 0h3m3 0h3m2 0h1m3 0h2m-13 1h3m1 0h4m1 0h2m-19 1h7m1 0h2m3 0h2m1 0h1m3 0h1m-21 1h1m5 0h1m2 0h1m2 0h2m1 0h1m3 0h1m-20 1h1m1 0h3m1 0h1m1 0h2m1 0h2m1 0h1m3 0h2m-20 1h1m1 0h3m1 0h1m3 0h2m2 0h2m1 0h4m-21 1h1m1 0h3m1 0h1m2 0h1m2 0h1m4 0h2m-19 1h1m5 0h1m3 0h1m1 0h3m1 0h2m2 0h1m-21 1h7m1 0h2m3 0h1m1 0h3m1 0h2';
function qr() {
  return `<a class="tb-qr" href="${SITE.origin}/" aria-label="QR code for denormal.in"><svg viewBox="4 4 21 21" aria-hidden="true" focusable="false" shape-rendering="crispEdges"><path d="${QR}"/></svg><span class="mono">denormal.in</span></a>`;
}

function header(path, cover) {
  const links = NAV.map((n) => `<li><a href="${n.href}"${path.startsWith(n.href) ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('');
  const cols = Array.from({ length: 12 }, (_, i) => `<span>${i + 1}</span>`).join('');
  return `
<header class="masthead${cover ? ' is-over' : ''}">
  <span class="brand-progress masthead-progress" aria-hidden="true"></span>
  <div class="masthead-bar wrap">
    <a class="brand" href="/" aria-label="Denormal Labs, home">${wordmark()}</a>
    <nav class="nav" aria-label="Primary"><ul>${links}</ul></nav>
    <div class="masthead-actions">
      <button class="motion-toggle" type="button" data-motion-toggle aria-pressed="false" aria-label="Pause motion"><span aria-hidden="true">Ⅱ</span></button>
      <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Dark theme">
        <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.25"/><path class="theme-half" d="M8 1.75a6.25 6.25 0 0 1 0 12.5z"/></svg>
      </button>
      <a class="btn btn-plate masthead-start" href="/#start">Start<span aria-hidden="true"> →</span></a>
      <button class="menu-open" type="button" data-menu-open aria-haspopup="dialog" aria-controls="menu">Menu</button>
    </div>
  </div>
  <div class="colrefs wrap" aria-hidden="true"><div class="colrefs-grid">${cols}</div></div>
</header>
<dialog class="menu" id="menu" aria-label="Menu">
  <div class="menu-head"><span class="mono">Sheet index</span><button type="button" class="menu-close" data-menu-close>Close</button></div>
  <ul class="menu-list">
    <li><a href="/"><span class="mono">DL-000</span>Home</a></li>
    ${NAV.map((n) => `<li><a href="${n.href}"><span class="mono">${sheetFor(n.href)?.dwg ?? ''}</span>${esc(n.label)}</a></li>`).join('')}
  </ul>
  <a class="btn btn-plate menu-start" href="/#start">Start with one document<span aria-hidden="true"> →</span></a>
</dialog>`;
}

function rail(zones) {
  if (!zones?.length) return '';
  return `<nav class="rail" aria-label="Zones on this sheet"><ol>${zones.map((z) => `<li><a href="#${z.id}" data-zone-link="${z.id}" title="${esc(z.label)}"><span>${z.letter}</span></a></li>`).join('')}</ol></nav><div class="rail-r" aria-hidden="true"></div>`;
}

export function titleBlock(path, title) {
  const s = sheetFor(path) ?? { dwg: 'DL-404', title, n: 0, of: SHEETS.length };
  const sitemap = SHEETS.filter(x=>!x.policy).map((x) => `<li><a href="${x.path}"><span class="mono">${x.dwg}</span>${esc(x.title)}</a></li>`).join('');
  return `
<footer class="titleblock" aria-label="Title block">
  <div class="wrap">
    <a class="footer-display" href="/" aria-label="Denormal Labs, home">${wordmark()}</a>
    <div class="tb">
      <div class="tb-cell tb-mark"><a href="/" aria-label="Denormal Labs, home">${wordmark()}</a><span class="tb-owner">Denormal Labs</span>${qr()}</div>
      <div class="tb-cell tb-title"><span class="tb-k">Title</span><span class="tb-v">${esc(s.title)}</span></div>
      <div class="tb-cell tb-dwg"><span class="tb-k">Dwg no.</span><span class="tb-v mono-v">${s.dwg}</span></div>
      <div class="tb-cell tb-revno"><span class="tb-k">Rev</span><span class="tb-v mono-v">${REV}</span></div>
      <div class="tb-cell tb-sheet"><span class="tb-k">Sheet</span><span class="tb-v mono-v">${s.n ? `${pad(s.n)} of ${pad(s.of)}` : '—'}</span></div>
      <div class="tb-cell tb-issued"><span class="tb-k">Issued</span><span class="tb-v mono-v">${ISSUED}</span></div>
      <div class="tb-cell tb-scale"><span class="tb-k">Scale</span><span class="tb-v mono-v">NTS</span></div>
      <div class="tb-cell tb-mail"><span class="tb-k">Mail</span><a class="tb-v" href="mailto:${SITE.email}">${SITE.email}</a></div>
      <div class="tb-cell tb-city"><span class="tb-k">Based in</span><span class="tb-v">${esc(SITE.city)}</span></div>
      <div class="tb-cell tb-rev">
        <span class="tb-k">Revisions</span>
        <table class="revtable"><thead><tr><th scope="col">Rev</th><th scope="col">Date</th><th scope="col">Description</th></tr></thead>
        <tbody><tr><td>A</td><td>${ISSUED}</td><td>First issue of this sheet</td></tr></tbody></table>
      </div>
      <nav class="tb-cell tb-index" aria-label="All sheets"><span class="tb-k">Drawing register</span><ul>${sitemap}</ul></nav>
    </div>
    <nav class="footer-policies" aria-label="Policies">${POLICIES.map(p=>`<a href="${p.path}">${esc(p.title)}</a>`).join('')}</nav>
    <p class="tb-foot"><span>© 2026 Denormal Labs</span><span>Claims limited to shipped capability · no certifications asserted</span></p>
  </div>
</footer>`;
}

export function layout({ path, title, description, zones = [], main, noindex = false, cover = false }) {
  const s = sheetFor(path);
  const full = path === '/' ? `${SITE.name}: empower, innovate, sustain` : `${title} · ${SITE.name}`;
  const canonical = SITE.origin + path;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description || SITE.description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta name="theme-color" content="#EEEDE4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E0F09" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description || SITE.description)}">
<meta property="og:image" content="${SITE.origin}/og.png">
<meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>${THEME_BOOT}</script>
<link rel="preload" href="${asset('fonts/archivo-var-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset('site.css')}">
<link rel="stylesheet" href="${asset('experience.css')}">
<script src="${asset('site.js')}" defer></script>
</head>
<body${s ? ` data-sheet="${s.dwg}"` : ''}${cover ? ' class="has-cover at-cover"' : ''}>
<div class="shutter" aria-hidden="true"><i></i><i></i><i></i></div>
<a class="skip" href="#main">Skip to content</a>
${header(path, cover)}
${rail(zones)}
<main id="main" tabindex="-1">
${main}
</main>
${titleBlock(path, title)}
${paletteDock()}
</body>
</html>
`;
}
