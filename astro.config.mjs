import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ─────────────────────────────────────────────────────────────────────────────
// The live domain, no trailing slash, https.
// It is the canonical host: it stamps canonical URLs and the sitemap, and the
// .htaccess redirects every other spelling (http, www) to it. Getting it wrong
// means search engines index two versions of every page.
const SITE = process.env.SITE_URL || 'https://denormal.in';
// ─────────────────────────────────────────────────────────────────────────────

// Hostinger serves from the domain root, so base stays '/'. It is still driven
// by an env var because internal links go through src/lib/url.ts, which lets
// the same source build for a subpath host without touching any markup.
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site: SITE,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()]
});
