import { defineConfig } from 'astro/config';

// GitHub Pages serves a project repo from a subpath, so the Pages build sets
// SITE_BASE=/denormal (see .github/workflows/deploy.yml). Everything else —
// local dev, and any host that serves from a domain root such as Cloudflare
// Pages or Netlify — builds at '/'. Internal links go through src/lib/url.ts,
// which reads whichever base is configured, so both shapes work unchanged.
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://manzilx.github.io',
  base,
  output: 'static',
  trailingSlash: 'always'
});
