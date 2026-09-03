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

document.querySelectorAll('[data-intake-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('[data-submit]');
    if (button) button.innerHTML = 'Specification transmitted <span>→</span>';
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
