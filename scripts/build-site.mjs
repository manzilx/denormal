// Builds dist/ for the Cloudflare Worker (static assets) that serves denormal.in.
//
// The site is hand-built static HTML rendered from data in site/content/ by the
// templates in site/templates/ and site/pages/. Assets are content-hashed.
// /brochure/ uses the same verified portfolio content. Guards fail the build if a
// disproved claim, an identity detail or a broken internal link reaches dist/.
//
// No dependencies: Cloudflare's build image only guarantees Node.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, extname, relative } from 'node:path';
import { setAssets } from '../site/lib/html.mjs';
import { BANNED } from '../site/corrections.mjs';


const OUT = 'dist';
const SRC = 'site/assets';
const ORIGIN = 'https://denormal.in';

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'assets'), { recursive: true });
cpSync('public', OUT, { recursive: true });

// ── Assets: fonts and images first, then CSS (with url()s rewritten), then JS.
const hash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 10);
const map = {};
function emit(name, buf) {
  const ext = extname(name);
  const base = name.slice(0, -ext.length).replace(/[/\\]/g, '-');
  const file = `${base}.${hash(buf)}${ext}`;
  writeFileSync(join(OUT, 'assets', file), buf);
  map[name] = `/assets/${file}`;
}
function walk(dir) {
  return readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
}
const files = walk(SRC).map((p) => relative(SRC, p).split('\\').join('/'));
for (const f of files.filter((f) => !/\.(css|js)$/.test(f))) emit(f, readFileSync(join(SRC, f)));
for (const f of files.filter((f) => f.endsWith('.css'))) {
  const css = readFileSync(join(SRC, f), 'utf8').replace(/url\('([^')]+)'\)/g, (m, u) => {
    if (/^(data:|https?:)/.test(u)) return m;
    if (!map[u]) throw new Error(`build: ${f} references a missing asset: ${u}`);
    return `url('${map[u]}')`;
  });
  emit(f, Buffer.from(css));
}
for (const f of files.filter((f) => f.endsWith('.js'))) emit(f, readFileSync(join(SRC, f)));
setAssets(map);

// Pages import content lazily, after assets exist.
const { renderPolicy } = await import('../site/pages/policies.mjs');
const { POLICIES } = await import('../site/content/policies.mjs');
const { renderPortfolioBrief } = await import('../site/pages/portfolio-brief.mjs');
const { renderHome } = await import('../site/pages/home.mjs');
const { renderSystemsIndex, renderSystem, renderHowWeWork, renderDeployment, renderAbout, render404 } = await import('../site/pages/inner.mjs');
const { SYSTEMS } = await import('../site/content/systems.mjs');
const { SHEETS } = await import('../site/templates/layout.mjs');

const pages = {
  'index.html': renderHome(),
  'systems/index.html': renderSystemsIndex(),
  ...Object.fromEntries(SYSTEMS.map((s, i) => [`systems/${s.slug}/index.html`, renderSystem(s, i)])),
  'how-we-work/index.html': renderHowWeWork(),
  'deployment/index.html': renderDeployment(),
  'about/index.html': renderAbout(),
  '404.html': render404(),
  ...Object.fromEntries(POLICIES.map(p=>[p.path.slice(1)+'index.html',renderPolicy(p)])),
};

pages['brochure/index.html'] = renderPortfolioBrief();
// Keep the retired product URL useful in a plain local static preview too.
// Cloudflare serves the permanent redirect from _redirects instead.
pages['systems/peak-logic/index.html'] = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/systems/"><title>Portfolio updated · Denormal Labs</title></head><body><p>The portfolio has been updated. <a href="/systems/">Explore the current systems</a>.</p></body></html>`;


for (const [path, html] of Object.entries(pages)) {
  mkdirSync(dirname(join(OUT, path)), { recursive: true });
  writeFileSync(join(OUT, path), html);
}

// ── Platform files ──────────────────────────────────────────────────────
// Old URLs from the Astro site and the previous home page's anchors and
// theme route. Specific rules first: the first match wins.
const REDIRECTS = [
  ['/products/power-contract-intelligence*', '/systems/pci/'],
  ['/products/onelegal*', '/systems/onelegal/'],
  ['/systems/peak-logic*', '/systems/'],
  ['/products/peaklogic*', '/systems/'],
  ['/products/nexusref*', '/systems/nexusref/'],
  ['/products/sentinel*', '/systems/sentinel/'],
  ['/products/*', '/systems/'],
  ['/portfolio*', '/systems/'],
  ['/security*', '/deployment/'],
  ['/contact*', '/#start'],
  ['/dark/about*', '/about/'],
  ['/dark/*', '/'],
  ['/dark', '/'],
];
writeFileSync(join(OUT, '_redirects'), REDIRECTS.map(([a, b]) => `${a}  ${b}  301`).join('\n') + '\n');

writeFileSync(join(OUT, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: geolocation=(), microphone=(), camera=()

# Asset names are content hashes, so those URLs can never change contents.
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Pages must revalidate, or a deploy never reaches someone who has visited before.
/*.html
  Cache-Control: public, max-age=0, must-revalidate
/
  Cache-Control: public, max-age=0, must-revalidate
/*/
  Cache-Control: public, max-age=0, must-revalidate
/sitemap.xml
  Cache-Control: public, max-age=0, must-revalidate
/robots.txt
  Cache-Control: public, max-age=0, must-revalidate
`);

writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SHEETS.map((s) => `  <url><loc>${ORIGIN}${s.path}</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /brochure/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

// ── Guards ──────────────────────────────────────────────────────────────
const problems = [];
const own = walk(OUT).filter((p) => /\.(html|js|css)$/.test(p));
const text = Object.fromEntries(own.map((p) => [p, readFileSync(p, 'utf8')]));

// 1. Claims shown to be false, and wording that would bring "halts the work"
//    back for systems that only flag or rule.
const claims = [...BANNED, 'halts the', 'blocks the work', 'locks the line'];
for (const [p, t] of Object.entries(text)) for (const b of claims) if (t.includes(b)) problems.push(`claim "${b}" in ${p}`);

// 2. Identity: no person, credential or biographic number. Names that must
//    never enter the repo live in a gitignored .identity-banned, one per line.
const identity = [/two decades/i, /\bFMS\b/, /\bNERIST\b/, /\bCIDC\b/, /\bASSOCHAM\b/, /\bIACCM\b/, /\bMBA\b/, /\bB\.Tech\b/, /personally accountable/i];
if (existsSync('.identity-banned')) {
  for (const line of readFileSync('.identity-banned', 'utf8').split('\n').map((l) => l.trim()).filter(Boolean)) {
    identity.push(new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
}
for (const [p, t] of Object.entries(text)) for (const r of identity) if (r.test(t)) problems.push(`identity ${r} in ${p}`);

// 3. Internal links and assets on the hand-built pages must resolve.
const redirectFrom = REDIRECTS.map(([a]) => new RegExp('^' + a.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'));
for (const [path, html] of Object.entries(pages)) {
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const u = m[1];
    if (u.startsWith('//')) continue;
    const f = join(OUT, u.endsWith('/') ? join(u, 'index.html') : u);
    if (!existsSync(f) && !redirectFrom.some((r) => r.test(u))) problems.push(`broken link ${u} in ${path}`);
  }
}

if (problems.length) throw new Error(`build: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);

const kb = (p) => Math.round(readFileSync(join(OUT, p)).length / 1024);
console.log(`built ${Object.keys(pages).length} pages → ${OUT}/ (home ${kb('index.html')} KB, css ${kb(map['site.css'])} KB)`);
