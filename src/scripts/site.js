const root = document.documentElement;
const themeButton = document.querySelector('#dnrm-theme');

const syncThemeButton = () => {
  if (themeButton) themeButton.textContent = root.dataset.theme === 'dark' ? 'LT' : 'DK';
};

syncThemeButton();
themeButton?.addEventListener('click', () => {
  const dark = root.dataset.theme === 'dark';
  if (dark) delete root.dataset.theme;
  else root.dataset.theme = 'dark';
  try { localStorage.setItem('dnrm-theme', dark ? 'light' : 'dark'); } catch {}
  syncThemeButton();
});

// The form posts to a Pages Function. It keeps a native action and method, so
// with JavaScript unavailable it still submits — the response is then a JSON
// body rather than a styled page, which is ugly but delivers the message.
// Nothing here claims success the server did not report.
document.querySelectorAll('[data-intake-form]').forEach((form) => {
  const button = form.querySelector('[data-submit]');
  const status = form.querySelector('[data-intake-status]');
  const label = button ? button.innerHTML : '';

  const say = (text, kind) => {
    if (!status) return;
    status.textContent = text;
    status.className = `intake-status ${kind}`;
    status.hidden = false;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button) {
      button.disabled = true;
      button.innerHTML = 'Transmitting…';
    }
    if (status) status.hidden = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        form.reset();
        say('Specification received. We will reply to the address you gave.', 'ok');
        if (button) button.innerHTML = 'Specification transmitted <span>→</span>';
        return;
      }
      say(data.error || 'That did not send. Please write to hello@denormal.in.', 'err');
    } catch {
      say('That did not send — check your connection, or write to hello@denormal.in.', 'err');
    }

    if (button) {
      button.disabled = false;
      button.innerHTML = label;
    }
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  const bar = document.querySelector('#dnrm-bar');
  const word = document.querySelector('.brand-word');
  const fill = document.querySelector('#dnrm-fill');
  const progress = document.querySelector('#dnrm-progress');

  const onScroll = () => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop) / max));
    const dense = ratio > 0.01;
    if (bar) bar.style.minHeight = dense ? '60px' : '76px';
    if (word) word.style.fontSize = dense ? '22px' : '30px';
    if (fill) fill.setAttribute('width', String(62 + ratio * 132));
    if (progress) progress.style.width = `${(ratio * 100).toFixed(2)}%`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const rows = [...document.querySelectorAll('[data-node]')];
  let active = 0;
  const applyRow = (index) => rows.forEach((row, rowIndex) => row.classList.toggle('active', index === rowIndex));
  applyRow(active);
  if (rows.length > 1) window.setInterval(() => { active = (active + 1) % rows.length; applyRow(active); }, 4200);
}

// Hero lattice. A 26px node field with a slow diagonal wave and a square
// cursor neighbourhood, painted to canvas so the per-frame work stays off the
// document. Ported from the frozen design, including its one per-page
// difference: the home hero draws its cursor connectors horizontally, a
// product hero vertically.
//
// Two guards the design file does not carry, neither of them visible: the loop
// is parked while the hero is scrolled out of view, and it stops entirely if
// the canvas context is unavailable.
document.querySelectorAll('[data-hero-field]').forEach((cv) => {
  const ctx = cv.getContext('2d');
  if (!ctx) return;

  const vertical = cv.dataset.heroField === 'v';
  const STEP = 26;
  const R = 150;
  const mouse = { x: -9999, y: -9999 };
  let w = 0;
  let h = 0;
  let raf = 0;
  let running = false;

  const onMove = (event) => {
    const rect = cv.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  };
  const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = cv.clientWidth;
    h = cv.clientHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  window.addEventListener('resize', resize);
  new ResizeObserver(resize).observe(cv);

  // getComputedStyle returns a live declaration, so the field repaints in the
  // new palette the moment the theme toggle flips without re-reading anything.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cs = getComputedStyle(document.documentElement);
  const t0 = performance.now();

  const frame = (now) => {
    const t = reduce ? 0 : (now - t0) / 1000;
    const ink = cs.getPropertyValue('--ink').trim() || '#18181B';
    const acc = cs.getPropertyValue('--accent').trim() || '#EA580C';
    ctx.clearRect(0, 0, w, h);
    const cols = Math.ceil(w / STEP);
    const rows = Math.ceil(h / STEP);

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = i * STEP;
        const y = j * STEP;
        const wave = (Math.sin((x + y) / 220 - t * 0.7) + 1) / 2;
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const near = d < R ? 1 - d / R : 0;
        const a = 0.05 + wave * 0.07 + near * 0.5;
        const sq = 1 + near * 3.2 + wave * 0.6;
        const hot = near > 0.62 || wave > 0.985;

        ctx.fillStyle = hot ? acc : ink;
        ctx.globalAlpha = hot ? Math.min(1, a + 0.2) : a;
        ctx.fillRect(x - sq / 2, y - sq / 2, sq, sq);

        if (near > 0.35 && (vertical ? j < rows : i < cols)) {
          ctx.globalAlpha = (near - 0.35) * 0.35;
          ctx.strokeStyle = ink;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          if (vertical) ctx.lineTo(x, y + STEP);
          else ctx.lineTo(x + STEP, y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  };

  const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
  }).observe(cv);
});

// Portfolio card emphasis. The accent rule is the design's scarcest gesture —
// a 2px top border in exactly one place site-wide — and it is spent on the one
// card the reader has picked out. Nothing is accented on load, and clicking
// the same card again clears it.
//
// Deliberately pointer-only and not in the tab order: the mark carries no
// information a keyboard user would otherwise miss, so making every card a
// focus stop ahead of its own link would cost more than it gives.
const selectable = [...document.querySelectorAll('[data-select-card]')];
selectable.forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    const on = card.classList.contains('accent');
    selectable.forEach((other) => other.classList.remove('accent'));
    if (!on) card.classList.add('accent');
  });
});
