/**
 * Intake endpoint — Cloudflare Pages Function at POST /api/intake.
 *
 * Delivers a submission by email through Resend. Three deliberate choices:
 *
 *  - It never reports success it did not achieve. If the mail provider is
 *    unconfigured or errors, the caller is told so and given the address to
 *    write to, rather than shown a thank-you over a dropped message.
 *  - Spam is handled without a CAPTCHA: a honeypot field bots fill and humans
 *    never see, plus a per-IP rate limit.
 *  - The submitter's address goes in Reply-To, never in From. Sending as the
 *    visitor would fail SPF and land the mail in spam.
 */

interface Env {
  RESEND_API_KEY?: string;
  INTAKE_TO?: string;
  INTAKE_FROM?: string;
}

const MAX_FIELD = 4000;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

// Per-isolate, so it is a speed bump rather than a guarantee — enough to stop
// a naive flood. Durable Objects would be the real answer at volume.
const hits = new Map<string, number[]>();

// Split into a read and a write on purpose. A rejected submission — bad email,
// empty scope, honeypot — must not consume the caller's budget, or someone who
// mistypes their address twice is locked out for a minute. Only an actual
// delivery attempt is recorded.
function overLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.set(ip, recent);
  return recent.length >= MAX_PER_WINDOW;
}

function recordAttempt(ip: string): void {
  const recent = hits.get(ip) ?? [];
  recent.push(Date.now());
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
}

const clean = (v: FormDataEntryValue | null): string =>
  typeof v === 'string' ? v.trim().slice(0, MAX_FIELD) : '';

const escape = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (overLimit(ip)) {
    return json({ ok: false, error: 'Too many submissions. Try again in a minute.' }, 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'Could not read that submission.' }, 400);
  }

  // Honeypot. A real browser never fills a hidden, unlabelled field; answering
  // 200 means a bot sees success and does not retry with a different shape.
  if (clean(form.get('company_website'))) return json({ ok: true }, 200);

  const name = clean(form.get('name'));
  const email = clean(form.get('email'));
  const product = clean(form.get('product'));
  const deployment = clean(form.get('deployment'));
  const scope = clean(form.get('scope'));

  if (!email || !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, error: 'A valid email address is required.' }, 400);
  }
  if (!scope) {
    return json({ ok: false, error: 'Tell us which process is breaking down.' }, 400);
  }

  recordAttempt(ip);

  const to = env.INTAKE_TO ?? 'hello@denormal.in';
  const from = env.INTAKE_FROM ?? 'Denormal Intake <intake@denormal.in>';

  if (!env.RESEND_API_KEY) {
    return json(
      { ok: false, error: `Intake delivery is not configured yet. Please write to ${to}.` },
      503
    );
  }

  const rows: [string, string][] = [
    ['Name', name || '—'],
    ['Email', email],
    ['Product', product || '—'],
    ['Deployment', deployment || '—']
  ];

  const html = [
    '<h2 style="font:600 16px system-ui;margin:0 0 12px">Intake submission</h2>',
    '<table style="border-collapse:collapse;font:14px system-ui">',
    ...rows.map(
      ([k, v]) =>
        `<tr><td style="padding:4px 14px 4px 0;color:#71717A">${k}</td><td style="padding:4px 0">${escape(v)}</td></tr>`
    ),
    '</table>',
    '<p style="font:600 12px system-ui;color:#71717A;margin:18px 0 6px">PROCESS</p>',
    `<p style="font:14px/1.5 system-ui;white-space:pre-wrap;margin:0">${escape(scope)}</p>`
  ].join('');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Intake — ${name || email}${product ? ` · ${product}` : ''}`,
        html
      })
    });

    if (!res.ok) {
      // Log the provider's reason for the operator; never return it, since it
      // can carry key and account detail.
      console.error('resend failed', res.status, await res.text());
      return json({ ok: false, error: `Could not send that. Please write to ${to}.` }, 502);
    }
  } catch (err) {
    console.error('resend threw', err);
    return json({ ok: false, error: `Could not send that. Please write to ${to}.` }, 502);
  }

  return json({ ok: true }, 200);
};

// A GET here is someone poking at the endpoint, not a browser mistake.
export const onRequestGet: PagesFunction = () =>
  json({ ok: false, error: 'POST a form to this endpoint.' }, 405);
