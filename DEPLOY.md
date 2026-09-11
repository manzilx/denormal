# Deploying denormal.in

The site is a static Astro build hosted on **Cloudflare Pages**, which builds
this repo directly on every push to `main`. There is no CI workflow in this
repo — Cloudflare does the build itself.

Domain `denormal.in` is registered at Hostinger; its DNS is served by
Cloudflare. Hostinger hosting is not used.

## Build settings (Cloudflare dashboard)

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `pnpm build` |
| Output directory | `dist` |
| `NODE_VERSION` | `22` |

`NODE_VERSION` is not optional. Cloudflare defaults to an older Node than
Astro 7 supports, and the failure message does not clearly say so.

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
