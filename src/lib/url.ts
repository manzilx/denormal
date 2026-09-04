// GitHub Pages serves this site from a subpath, so every internal link has to
// carry Astro's configured `base`. Astro rewrites asset URLs on its own but
// leaves authored href strings alone — route them all through here.
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function url(path: string): string {
  return path.startsWith('/') ? `${BASE}${path}` : path;
}
