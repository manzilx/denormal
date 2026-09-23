# Deploying denormal.in

The site is a **Cloudflare Worker with static assets**, deployed by Workers
Builds on every push to `main` (the GitHub check is named
*Workers Builds: denormal*). There is no CI workflow in this repo — Cloudflare
does the build itself. It is not a Pages project, whatever older notes say.

**`wrangler.jsonc` is load-bearing.** Without it, `wrangler deploy`
auto-detects the framework, finds Astro in `package.json`, runs `astro build`
itself and ships the old site from `src/` — the build still reports success.
The config names the Worker (`denormal`, which must match the dashboard),
runs `pnpm build` before every deploy, and serves `dist/` as static assets.
`_headers` and `_redirects` in `dist/` are honoured by the assets layer.

**What gets built.** The site is designed in Claude Design and exported to
`export/` as three self-unpacking HTML files (Light, Dark, Brochure).
`pnpm build` runs `scripts/build-site.mjs`, which unpacks them at build time
into `dist/`: real HTML, and every font and script as a content-hashed file
under `/assets/`. It also adds the About page (`site/about.mjs`), the About
tab, redirects for the old Astro URLs, and applies `site/corrections.mjs`.

| Path | Source |
|---|---|
| `/` · `/dark/` | `export/Denormal Website - Light.html` · `- Dark.html` |
| `/about/` · `/dark/about/` | `site/about.mjs` |
| `/brochure/` | `export/Denormal Brochure.html` |

To ship a new design: re-export from Claude Design over the files in
`export/`, run `pnpm build`, check it with the `site` preview, push. The build
fails loudly if the export no longer contains the markup it patches (theme
toggle, nav), rather than shipping a page without them.

The previous Astro site is still in `src/` and builds with
`pnpm astro:build`; switching back is a one-line change to `build` in
`package.json`.

Domain `denormal.in` is registered at Hostinger; its DNS is served by
Cloudflare. Hostinger hosting is not used.

## Build settings

All in `wrangler.jsonc`; the dashboard's build and deploy commands can stay at
their defaults (`npx wrangler deploy`). To check a deploy without publishing:

    npx wrangler deploy --dry-run

It should print `[custom build] Running: pnpm build` and read ~33 files from
`dist/`. If it mentions Astro, the config is not being picked up.

`NODE_VERSION` = `22` in the dashboard's build variables is still wise.

## Settings that live in the dashboard, not in this repo

Three things cannot be expressed in the build output and will be silently
missing if the project is ever recreated:

**1 · `www` → apex redirect.** Cloudflare Pages' `_redirects` file only
accepts *relative* paths in the source position, so a hostname match such as
`https://www.denormal.in/*` is rejected at deploy time with
`Only relative URLs are allowed [code: 100324]`. The redirect is therefore a
**Redirect Rule**: Cloudflare dashboard → the `denormal.in` zone → Rules →
Redirect Rules → Create.

- If: `Hostname equals www.denormal.in`
- Then: Dynamic → `concat("https://denormal.in", http.request.uri.path)`
- Status: 301, preserve query string

**2 · Always Use HTTPS.** SSL/TLS → Edge Certificates → Always Use HTTPS.
The build does not force TLS; the edge does.

**3 · Custom domains.** The Pages project must list both `denormal.in` and
`www.denormal.in`, or the redirect rule above has nothing to fire on.

**4 · Email routing for `hello@denormal.in`.** The site publishes that
address and the intake form makes no network request, so it is the only way
anyone reaches you. Cloudflare dashboard → the `denormal.in` zone → Email →
Email Routing → add `hello@` as a custom address forwarding to the inbox you
actually read, and accept the MX records it offers. Until that exists, mail to
the published address bounces.

**5 · Web Analytics.** Workers &amp; Pages → the project → Metrics → enable
Cloudflare Web Analytics. It is free, cookieless, needs no consent banner, and
injects its own beacon, so nothing is hardcoded in this repo. It is also the
only way to answer the question the marketing plan is built around: which
piece of writing preceded an enquiry.

**6 · Intake delivery secrets.** The form at `/api/intake` posts to a Pages
Function that sends through Resend. Workers &amp; Pages → the project → Settings
→ Variables and Secrets:

| Name | Value | Required |
|---|---|---|
| `RESEND_API_KEY` | From resend.com, as a **secret** | yes |
| `INTAKE_TO` | Where enquiries land. Defaults to `hello@denormal.in` | no |
| `INTAKE_FROM` | Must be on a domain verified in Resend. Defaults to `intake@denormal.in` | no |

Resend needs `denormal.in` verified before it will send — it hands you DKIM
and SPF records to add in Cloudflare DNS.

Until `RESEND_API_KEY` exists the endpoint returns 503 and the form tells the
visitor to email instead. That is deliberate: it never shows a thank-you for a
message it did not deliver.

## What *is* in the repo

- `public/_headers` — security headers and the cache policy. Fingerprinted
  files under `/_astro/` are immutable for a year; anything on a stable path
  revalidates, so a deploy reaches people who have visited before.
- `astro.config.mjs` — `site` is the canonical host. It stamps every
  canonical tag and the sitemap. Changing hosts means changing that one line
  (or setting `SITE_URL`), and nothing else.

## Verifying a deploy

```bash
curl -sI https://denormal.in/zzz-nonsense/ | head -1   # expect 404, not 200
curl -sI https://www.denormal.in/ | head -2            # expect 301 to the apex
curl -s https://denormal.in/robots.txt                 # sitemap must say denormal.in
```

A `200` on a nonsense path means something other than this site is answering
— historically Hostinger's parked-domain page, which responds to every path.
