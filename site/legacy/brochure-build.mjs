// /brochure/ is still built from its Claude Design export: a self-unpacking
// bundle (a gzip+base64 manifest of resources keyed by UUID, and a template
// that references them). This does the loader's work once, at build time:
// every resource becomes a real file under /assets/, named by content hash.
// Moved here unchanged from scripts/build-site.mjs when the rest of the site
// became hand-built static pages.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { CORRECTIONS } from '../corrections.mjs';
import { addProductPages } from '../brochure.mjs';

const EXT = {
  'text/javascript': 'js', 'application/javascript': 'js', 'font/woff2': 'woff2',
  'image/svg+xml': 'svg', 'image/png': 'png', 'image/jpeg': 'jpg', 'text/css': 'css',
};

function block(src, type) {
  const m = src.match(new RegExp(`<script type="${type}">([\\s\\S]*?)</script>`));
  return m ? m[1] : null;
}

function unbundle(file, out) {
  const src = readFileSync(file, 'utf8');
  const manifest = JSON.parse(block(src, '__bundler/manifest'));
  let html = JSON.parse(block(src, '__bundler/template'));
  const ext = JSON.parse(block(src, '__bundler/ext_resources') || '[]');

  const url = {};
  const written = [];
  for (const [uuid, entry] of Object.entries(manifest)) {
    let bytes = Buffer.from(entry.data, 'base64');
    if (entry.compressed) bytes = gunzipSync(bytes);
    const name = `${createHash('sha256').update(bytes).digest('hex').slice(0, 16)}.${EXT[entry.mime] || 'bin'}`;
    const path = join(out, 'assets', name);
    if (!existsSync(path)) writeFileSync(path, bytes);
    written.push(path);
    url[uuid] = `/assets/${name}`;
  }
  for (const [uuid, u] of Object.entries(url)) html = html.split(uuid).join(u);

  // SRI attributes were computed for the CDN copies; the files are now ours.
  // The resource map lets the runtime load React from /assets/ instead of unpkg.
  html = html.replace(/\s+integrity="[^"]*"/gi, '').replace(/\s+crossorigin="[^"]*"/gi, '');
  const map = {};
  for (const e of ext) if (url[e.uuid]) map[e.id] = url[e.uuid];
  const resources = `<script>window.__resources = ${JSON.stringify(map).replace(/<\//g, '<\\/')};</script>`;
  html = html.replace(/<head[^>]*>/i, (m) => m + resources);
  return { html, written };
}

export function buildBrochure({ exportDir, out }) {
  const used = new Set();
  const correct = (html) => {
    CORRECTIONS.forEach(([find, replace], i) => {
      const next = find instanceof RegExp ? html.replace(find, replace) : html.split(find).join(replace);
      if (next !== html) used.add(i);
      html = next;
    });
    return html;
  };
  const { html: raw, written } = unbundle(join(exportDir, 'Denormal Brochure.html'), out);
  // NexusRef and Supply Chain Control Tower join the export's five systems as
  // pages 09 and 10; see site/brochure.mjs.
  let html = addProductPages(correct(raw));
  html = html.replace(/<html>/i, '<html lang="en">')
    .replace(/<\/title>/i, (m) => `${m}\n<meta name="robots" content="noindex">\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">`);
  const unused = CORRECTIONS.filter((_, i) => !used.has(i)).map(([, , why]) => why);
  return { html, assets: written, unused };
}
