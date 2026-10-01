// Moving pieces for the landing sheet: the annotated aerial, the rule
// ticker, the figures strip, the systems accordion, and two isometric
// scenes drawn in CSS 3D (the layer stack and a document's route through a
// system). Scenes are aria-hidden; the text beside each carries the content.
import { esc } from '../lib/html.mjs';
import { picture, split, zoneHead } from './components.mjs';
import { SYSTEMS } from '../content/systems.mjs';
import { TRACES } from '../content/traces.mjs';
import { LAYERS } from '../content/site.mjs';
import { PHOTOS } from '../content/photos.mjs';

// ── The aerial, annotated ────────────────────────────────────────────────
// Drawn in the image's own pixel space (1536 × 1024) so the callouts sit on
// the plant at any viewport; the canvas is sized to cover the way the image is.
export function aerial(photo, slot) {
  return `<div class="canvas">
    ${picture(photo, slot, { eager: true })}
    <svg class="hud" viewBox="0 0 1536 1024" aria-hidden="true">
      <path class="hud-flow" d="M1000 760 L1120 720 L1280 760 L1530 840"/>
      <g class="hud-box" style="--d:2.1s"><path d="M935 359v-24h24M976 335h24v24M1000 426v24h-24M959 450h-24v-24"/></g>
      <g class="hud-call" style="--d:2.4s"><path d="M1000 335 L1060 266 H1190"/><text x="1066" y="256">A1 · WIND</text></g>
      <g class="hud-box" style="--d:2.5s"><path d="M700 684v-24h24M976 660h24v24M1000 766v24h-24M724 790h-24v-24"/></g>
      <g class="hud-call" style="--d:2.8s"><path d="M1000 660 L1040 620 H1200"/><text x="1046" y="608">A2 · SOLAR ARRAY</text></g>
      <circle class="hud-ping" cx="962" cy="426" r="6" style="--d:3s"/>
      <circle class="hud-ping" cx="766" cy="400" r="6" style="--d:3.4s"/>
      <circle class="hud-dot" cx="1120" cy="720" r="4"/><circle class="hud-dot" cx="1280" cy="760" r="4"/><circle class="hud-dot" cx="1530" cy="840" r="4"/>
    </svg>
    <span class="hud-scan" aria-hidden="true"></span>
  </div>
  <div class="cover-readout" aria-hidden="true"><span class="mono">Grid ref</span><b data-gridref>F · 07</b><span class="mono">View A · NTS</span></div>`;
}

// ── Ticker: the five rules, moving ───────────────────────────────────────
export function ticker() {
  const run = SYSTEMS.map((s) => `<span class="tk"><b>${esc(s.name)}</b><i>${esc(s.rule.short)}</i></span><span class="tk-sep">◆</span>`).join('');
  return `<div class="ticker" aria-hidden="true"><div class="ticker-track"><div class="ticker-run">${run}</div><div class="ticker-run">${run}</div></div></div>`;
}

// ── Figures: one fixed figure from each system, counted up ───────────────
export function figures() {
  return `<ul class="figs">${SYSTEMS.map((s) => {
    const p = s.proof[0];
    return `<li class="fig"><span class="fig-v">${esc(p.v)}</span><span class="fig-l">${esc(p.l)}</span><a class="fig-s mono" href="/systems/${s.slug}/">${esc(s.name)} →</a></li>`;
  }).join('')}</ul>`;
}

// ── Accordion: the five systems, in the field ────────────────────────────
export function accordion() {
  return `<div class="acc" data-acc>${SYSTEMS.map((s, i) => `<article class="acc-i${i === 0 ? ' is-open' : ''}" data-acc-item>
      <button class="acc-tab" type="button" aria-expanded="${i === 0}" aria-controls="acc-${s.slug}"><span class="mono">DL-10${i + 1}</span><span class="acc-name">${esc(s.name)}</span></button>
      <div class="acc-panel" id="acc-${s.slug}">
        <div class="acc-media duo">${picture(PHOTOS[s.slug], s.slug, { sizes: '(min-width: 960px) 60vw, 100vw' })}</div>
        <div class="acc-body">
          <p class="mono acc-k">${esc(s.code)} · ${esc(PHOTOS[s.slug].caption)}</p>
          <h3>${esc(s.name)}</h3>
          <p class="acc-line">${esc(s.line)}</p>
          <p class="acc-rule"><span class="rule-k">Rule</span>${esc(s.rule.short)}</p>
          <a class="btn btn-photo" href="/systems/${s.slug}/">Open sheet DL-10${i + 1}<span aria-hidden="true"> →</span></a>
        </div>
      </div>
    </article>`).join('')}</div>`;
}

// ── Isometric kit ────────────────────────────────────────────────────────
// A box is three visible faces (top, south, west) on a 3D-preserving div.
const box = (cls, w, d, t, top = '') => `<div class="bx ${cls}" style="--w:${w}px;--d:${d}px;--t:${t}px"><i class="f-top">${top}</i><i class="f-s"></i><i class="f-w"></i></div>`;
const tag = (x, y, z, html, cls = '') => `<span class="bb ${cls}" style="--x:${x}px;--y:${y}px;--z:${z}px">${html}</span>`;

// The layer stack: four slabs that separate as you scroll, the Control layer
// on top. Beside it, the same four layers as text.
export function stackScene({ id, letter, sheet }) {
  const order = [...LAYERS].reverse(); // bottom (documents) first
  const slabs = order.map((l, k) => `<div class="slab${l.accent ? ' slab-ctl' : ''}" style="--k:${k}" data-layer="${k}">
      ${box(`hatch-${l.n}`, 300, 300, 16)}
      ${tag(318, 300, 0, `<b>${l.n}</b> ${esc(l.t)}`, 'bb-layer')}
    </div>`).join('');
  return `<section class="zone scrub stack-zone" id="${id}" data-zone="${letter}" data-scrub="stack" aria-labelledby="${id}-h" style="--len:2.4">
  <div class="scrub-stage"><span class="scrub-progress" aria-hidden="true"></span><div class="wrap scrub-grid">
    <div class="scrub-copy">
      ${zoneHead({ letter, id, title: 'Section through every system.', sheet, lede: 'The five systems share one construction. Your documents at the bottom, rules the code enforces above them, models bounded to what they were shown, and the decision on top.' })}
      <ol class="stack-list">${LAYERS.map((l) => `<li data-layer="${3 - LAYERS.indexOf(l)}"${l.accent ? ' class="is-ctl"' : ''}><span class="mono">${l.n}</span><div><b>${esc(l.t)}</b><p>${esc(l.d)}</p></div></li>`).join('')}</ol>
    </div>
    <div class="iso-scene" aria-hidden="true"><div class="scene-grid"></div><span class="scene-meta mono">Architecture / exploded view</span><div class="iso iso-stack">${slabs}<div class="stack-axis"></div></div><span class="scene-note mono">01—04 / scroll to separate the layers</span></div>
  </div></div>
</section>`;
}

// A document's route through one system: an input stack, three gates, a
// decision. The token travels with the scroll; the rule gate fires; at the
// decision a marker rises for the person who decides.
export function pipeScene({ id, letter, sheet }) {
  const S = 150;
  const data = TRACES.map((t) => {
    const s = SYSTEMS.find((x) => x.slug === t.slug);
    return { slug: t.slug, name: t.name, caption: t.caption, labels: [s.input, ...s.gates.map((g) => g.t), s.decision], rule: s.gates.findIndex((g) => g.rule) + 1, steps: t.steps };
  });
  const first = data[0];
  const heads = ['In', 'Gate 1', 'Gate 2', 'Gate 3', 'Decision'];
  const stations = [
    `<div class="st st-in" data-st="0">${box('doc', 70, 90, 5)}${box('doc d2', 70, 90, 5)}${box('doc d3', 70, 90, 5)}</div>`,
    ...[1, 2, 3].map((i) => `<div class="st st-gate${i === first.rule ? ' is-rule' : ''}" data-st="${i}" style="--x:${i * S}px"><i class="gate"></i></div>`),
    `<div class="st st-out" data-st="4" style="--x:${4 * S}px">${box('dec', 56, 56, 34)}</div>`,
  ].join('');
  const labels = first.labels.map((l, i) => tag(i * S - 46, 168, 0, `<b>${heads[i]}</b><span data-lab="${i}">${esc(l)}</span>`, 'bb-st')).join('');
  const steps = first.steps.map((st, i) => `<li data-step="${i}" class="st-${st.state}"><span class="mono">${esc(st.k)}</span><p>${esc(st.d)}</p></li>`).join('');
  return `<section class="zone scrub pipe-zone" id="${id}" data-zone="${letter}" data-scrub="pipe" aria-labelledby="${id}-h" style="--len:3.2">
  <div class="scrub-stage"><span class="scrub-progress" aria-hidden="true"></span><div class="wrap scrub-grid">
    <div class="scrub-copy">
      ${zoneHead({ letter, id, title: 'Trace one document through a system.', sheet })}
      <div class="pipe-switch" role="group" aria-label="Choose a system">${data.map((d, i) => `<button type="button" data-pipe="${i}" aria-pressed="${i === 0}">${esc(SYSTEMS.find((s) => s.slug === d.slug).abbr)}</button>`).join('')}</div>
      <p class="pipe-cap"><span class="synthetic">Illustrative · synthetic input</span><span data-pipe-cap>${esc(first.caption)}</span></p>
      <ol class="pipe-steps" aria-live="polite">${steps}</ol>
      <p class="trace-foot"><a data-pipe-link href="/systems/${first.slug}/">${esc(first.name)}, sheet DL-101 →</a></p>
    </div>
    <div class="iso-scene" aria-hidden="true"><div class="scene-grid"></div><span class="scene-meta mono">Document / decision path</span><div class="iso iso-pipe" style="--S:${S}px">
      <div class="track"><i class="track-fill"></i></div>
      ${stations}
      <div class="token">${box('tok', 38, 50, 6, '<b></b><b></b><b></b>')}</div>
      <i class="person"></i>
      ${tag(4 * S - 40, 60, 150, 'A person decides', 'bb-person')}
      ${labels}
    </div><span class="scene-note mono">Input / checks / human decision</span></div>
  </div></div>
  <script type="application/json" id="pipe-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
</section>`;
}

// The three beats as kinetic type: two rows that travel with the page in
// opposite directions and lean with the speed of the scroll. The separators
// are the logo's ruler in miniature.
export function kinetic() {
  const run = ['It reads', 'The rule checks', 'You decide'].map((w) => `<span>${w}</span><i class="k-cell"></i>`).join('');
  return `<section class="kinetic" aria-label="It reads. The rule checks. You decide."><div class="k-row" data-k="1" aria-hidden="true"><div class="k-track">${run.repeat(4)}</div></div><div class="k-row k-out" data-k="-1" aria-hidden="true"><div class="k-track">${run.repeat(4)}</div></div></section>`;
}

// A photograph that follows the pointer over the systems list.
export function follower() {
  return `<div class="follow" aria-hidden="true">${SYSTEMS.map((s) => `<div class="follow-i duo" data-follow="${s.slug}">${picture(PHOTOS[s.slug], s.slug, { sizes: '320px' })}</div>`).join('')}</div>`;
}

export { split };
