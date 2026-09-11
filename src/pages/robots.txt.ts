import type { APIRoute } from 'astro';

// Generated rather than kept in public/ so the sitemap line always matches the
// configured canonical host — a hardcoded robots.txt silently points at the
// wrong domain the moment the site moves.
export const GET: APIRoute = ({ site }) => {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('sitemap-index.xml', site)}`,
    ''
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
