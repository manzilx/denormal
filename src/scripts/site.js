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
