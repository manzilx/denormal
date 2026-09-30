// Drawing components. Each one is a piece of drawing-sheet notation doing a
// job: a decision line you can trace, a section cut through the architecture,
// a programme chart for how you buy, plan views of the data boundary,
// dimension lines for figures, revision clouds for what is not built yet.
import { esc, asset } from '../lib/html.mjs';
import { glyph } from '../glyphs.mjs';
import { LAYERS, PHASES, DEPLOYMENT, START, SITE } from '../content/site.mjs';

// Words wrapped for the masked rise. The text stays whole for assistive
// technology; only the visual line is split.
export function split(text, start = 0) {
  return esc(text).split(' ').map((w, i) => `<span class="w"><span style="--i:${i + start}">${w}</span></span>`).join(' ');
}

export function picture(photo, slot, { sizes = '100vw', eager = false } = {}) {
  const set = (ext) => photo.widths.map((w) => `${asset(`img/${slot}-${w}.${ext}`)} ${w}w`).join(', ');
  const small = photo.widths[Math.min(1, photo.widths.length - 1)];
  return `<picture><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="${asset(`img/${slot}-${small}.jpg`)}" srcset="${set('jpg')}" sizes="${sizes}" width="${photo.w}" height="${photo.h}" alt="${esc(photo.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture><span class="duo-tone" aria-hidden="true"></span>`;
}

// The cover: a sheet that opens full-bleed on a photograph, with the title
// set over it and a base strip along the foot.
export function cover({ id = 'top', letter = 'A', kicker, title, line, lede, actions = '', base = '', photo, slot, view = 'A', cls = '', next, media = '' }) {
  // A landscape image covering a tall viewport is wider than the viewport
  // before cropping. Select its source for that rendered width.
  const coverSizes = `(max-aspect-ratio: ${photo.w}/${photo.h}) ${(100 * photo.w / photo.h).toFixed(2)}vh, 100vw`;
  return `<section class="cover ${cls}" id="${id}" data-zone="${letter}" aria-labelledby="${id}-h">
  <div class="cover-media duo">${media || picture(photo, slot, { eager: true, sizes: coverSizes })}</div>
  <div class="cover-shade" aria-hidden="true"></div>
  <div class="cover-body wrap">
    <p class="cover-kicker"><span class="mono">${esc(kicker)}</span></p>
    <h1 id="${id}-h" class="cover-title">${split(title)}</h1>
    ${line ? `<p class="cover-line">${esc(line)}</p>` : ''}
    ${lede ? `<p class="cover-lede">${esc(lede)}</p>` : ''}
    ${actions ? `<div class="actions">${actions}</div>` : ''}
  </div>
  <div class="cover-base"><div class="cover-base-in wrap">
    ${base}
    <p class="cover-cap mono"><b>View ${view}</b> · ${esc(photo.caption)}</p>
    ${next ? `<a class="cover-cue" href="#${next}" aria-label="Scroll to the next section"></a>` : ''}
  </div></div>
</section>`;
}

// A photograph between zones that opens to full bleed as it scrolls in.
export function band({ photo, slot, view, kicker, title, body }) {
  return `<section class="band" aria-label="${esc(title)}">
  <div class="band-frame duo">${picture(photo, slot)}</div>
  <div class="band-body wrap">
    <p class="band-k mono"><span>View ${view} · ${esc(kicker)}</span></p>
    <h2 class="band-t">${split(title)}</h2>
    ${body ? `<p class="band-d">${esc(body)}</p>` : ''}
  </div>
</section>`;
}

// Zone heading: the zone letter sits in the heading line like a drawing's
// zone reference, and the sheet reference sits at the far end of the rule.
export function zoneHead({ letter, id, title, sheet, lede, level = 2 }) {
  return `<div class="zone-head">
    <span class="zone-tag" aria-hidden="true">${letter}</span>
    <h${level} id="${id}-h">${split(title)}</h${level}>
    <span class="zone-ref" aria-hidden="true">${sheet} · ${letter}</span>
  </div>${lede ? `<p class="zone-lede">${esc(lede)}</p>` : ''}`;
}

export function zone({ id, letter, cls = '', body }) {
  return `<section class="zone ${cls}" id="${id}" data-zone="${letter}" aria-labelledby="${id}-h">\n<div class="wrap">${body}</div>\n</section>`;
}

// Node markers, drawn on a 24-unit grid.
const MARK = {
  in: '<svg class="mk" viewBox="0 0 24 24" aria-hidden="true"><rect class="mk-f" x="6" y="6" width="12" height="12"/></svg>',
  gate: '<svg class="mk" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/></svg>',
  rule: '<svg class="mk mk-rule" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16"/><path d="M8 12h8M12 8v8"/></svg>',
  out: '<svg class="mk" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 9-9 9-9-9z"/></svg>',
};

// A system drawn as it runs: input, three gates, decision. The gate carrying
// the hard rule is the only accent, and the segment after it is cross-ticked:
// the line is held there for a person. State is drawn by stroke, not hue.
export function decisionLine(s, { full = false } = {}) {
  const ruleAt = s.gates.findIndex((g) => g.rule);
  const node = (kind, head, text, meta, seg) => `<li class="dl-node dl-${kind}" data-seg="${seg}">
      <span class="dl-mark">${MARK[kind]}</span>
      <span class="dl-head">${esc(head)}</span>
      <span class="dl-text">${esc(text)}</span>${full && meta ? `<span class="dl-meta">${esc(meta)}</span>` : ''}
    </li>`;
  const items = [
    node('in', 'In', s.input, '', 'solid'),
    ...s.gates.map((g, i) => node(g.rule ? 'rule' : 'gate', `Gate ${i + 1}${g.rule ? ' · rule' : ''}`, g.t, g.m, i === ruleAt ? 'held' : 'solid')),
    node('out', 'Decision', s.decision, s.outcomes.join(' · '), 'end'),
  ];
  return `<ol class="dline${full ? ' dline-full' : ''} plot" aria-label="${esc(s.name)} decision line">${items.join('')}</ol>`;
}

export function stateLegend() {
  return `<ul class="legend" aria-label="Line key">
    <li><span class="lg lg-solid" aria-hidden="true"></span>Cleared</li>
    <li><span class="lg lg-held" aria-hidden="true"></span>Held for a person</li>
    <li><span class="lg lg-gap" aria-hidden="true"></span>Not reached</li>
    <li><span class="lg lg-rule" aria-hidden="true"></span>The rule it won’t bend</li>
  </ul>`;
}

// A framed viewport for photography. Until a photograph is approved the frame
// is drawn empty and says so; it never borrows an image.
export function viewport({ view, caption, photo, slot, className = '', eager = false, sizes = '(min-width: 960px) 42vw, 100vw' }) {
  let media = `<div class="vp-empty" role="img" aria-label="Photograph to be added"><span>Photograph pending approval</span></div>`;
  if (photo) media = picture(photo, slot, { sizes, eager });
  return `<figure class="viewport ${className}">
    <div class="vp-frame${photo ? ' duo' : ''}">${media}<span class="vp-crop tl"></span><span class="vp-crop tr"></span><span class="vp-crop bl"></span><span class="vp-crop br"></span></div>
    <figcaption><span class="vp-view">View ${view}</span><span class="vp-cap">${esc(photo?.caption || caption)}</span><span class="vp-scale">NTS</span></figcaption>
  </figure>`;
}

// The architecture as a section cut: four layers, the Control layer on top.
export function layerSection() {
  return `<ol class="layers plot">${LAYERS.map((l) => `<li class="layer${l.accent ? ' layer-control' : ''}">
      <span class="layer-n" aria-hidden="true">${l.n}</span>
      <span class="layer-hatch hatch-${l.n}" aria-hidden="true"></span>
      <div class="layer-body"><h3>${esc(l.t)}</h3><p>${esc(l.d)}</p></div>
    </li>`).join('')}</ol>`;
}

// How you buy, drawn as a programme: a data-date line at Week 0, a fixed bar
// for the findings, and open bars for what is scoped together.
export function programme() {
  const cols = ['Week 0', 'Week 1', 'Week 2', 'Pilot', 'Deployed'];
  const bars = {
    '01': { from: 1, to: 1, kind: 'milestone', note: 'One artifact in' },
    '02': { from: 1, to: 3, kind: 'fixed', note: 'Fixed scope · fixed fee' },
    '03': { from: 4, to: 4, kind: 'open', note: 'Scoped together' },
    '04': { from: 5, to: 5, kind: 'run', note: 'With your team' },
  };
  return `<div class="prog plot" role="table" aria-label="Engagement programme">
    <div class="prog-row prog-head" role="row"><span role="columnheader" class="prog-label">Phase</span>${cols.map((c) => `<span role="columnheader">${c}</span>`).join('')}</div>
    ${PHASES.map((p) => { const b = bars[p.n]; return `<div class="prog-row" role="row">
      <div class="prog-label" role="rowheader"><span class="balloon" aria-hidden="true">${Number(p.n)}</span><b>${esc(p.t)}</b><span class="prog-when">${esc(p.when)}</span><p>${esc(p.d)}</p></div>
      <div class="prog-track" role="cell"><span class="bar bar-${b.kind}" style="--from:${b.from};--to:${b.to}"><span>${esc(b.note)}</span></span></div>
    </div>`; }).join('')}
    <span class="prog-datadate" aria-hidden="true"><span>Data date</span></span>
  </div>`;
}

// Plan view of each deployment boundary.
const PLAN = {
  'B.01': `<rect class="pl-edge" x="8" y="8" width="224" height="124"/><text x="18" y="26">YOUR PERIMETER</text><rect class="pl-sys" x="84" y="54" width="72" height="44"/><text x="94" y="80">DENORMAL</text>`,
  'B.02': `<rect class="pl-edge pl-dash" x="8" y="8" width="224" height="124"/><text x="18" y="26">YOUR TENANCY</text><rect class="pl-sys" x="84" y="54" width="72" height="44"/><text x="94" y="80">DENORMAL</text>`,
  'B.03': `<rect class="pl-edge pl-dash" x="8" y="8" width="224" height="124"/><text x="18" y="26">INDIA REGION</text><rect class="pl-sys" x="84" y="54" width="72" height="44"/><text x="94" y="80">DENORMAL</text><path class="pl-io" d="M232 76h-76"/><text x="170" y="116">TERMS DOCUMENTED</text>`,
};
export function boundaries() {
  return `<div class="bounds">${DEPLOYMENT.options.map((o) => `<article class="bound">
      <svg class="plan plot" viewBox="0 0 240 140" aria-hidden="true">${PLAN[o.id]}</svg>
      <p class="bound-id"><span class="mono">${o.id}</span><span class="bound-tag${o.tag === 'Recommended' ? ' is-rec' : ''}">${esc(o.tag)}</span></p>
      <h3>${esc(o.t)}</h3>
      <p>${esc(o.d)}</p>
      <p class="bound-foot">${esc(o.foot)}</p>
    </article>`).join('')}</div>`;
}

export function commitments() {
  return `<dl class="commit">${DEPLOYMENT.commitments.map((c) => `<div><dt>${esc(c.t)}</dt><dd>${esc(c.d)}</dd></div>`).join('')}</dl>`;
}

// What is not built yet, clouded the way a drawing marks an open revision.
export function notBuilt({ compact = false } = {}) {
  return `<ul class="clouds${compact ? ' clouds-compact' : ''}">${DEPLOYMENT.notBuilt.map((n) => `<li class="cloud">
      <svg class="delta" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 2l10 18H2z"/><text x="12" y="17">B</text></svg>
      <div><b>${esc(n.t)}</b>${compact ? '' : `<p>${esc(n.d)}</p>`}</div>
    </li>`).join('')}</ul>`;
}

// A figure drawn as a dimension: extension lines, arrowheads and the value
// set on the line, the way a drawing states a measured fact.
export function dimension(p) {
  return `<figure class="dim">
    <div class="dim-line" aria-hidden="true"><span class="dim-ext"></span><span class="dim-arrow"></span><span class="dim-ext"></span></div>
    <span class="dim-v">${esc(p.v)}</span>
    <figcaption><b>${esc(p.l)}</b><span>${esc(p.d)}</span></figcaption>
  </figure>`;
}

export function rulePlate(s, { long = false } = {}) {
  return `<div class="rule-plate"><span class="rule-k">The line it won’t cross</span><b class="rule-short">${esc(s.rule.short)}</b>${long ? `<p>${esc(s.rule.long)}</p>` : ''}</div>`;
}

export function startPlate({ id = 'start', sheet = 'DL-000', letter = 'G' } = {}) {
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent(START.subject)}`;
  return `<section class="zone zone-start" id="${id}" data-zone="${letter}" aria-labelledby="${id}-h">
    <div class="wrap">
      <div class="start">
        <div class="start-main">
          <p class="start-k"><span class="zone-tag zone-tag-inv" aria-hidden="true">${letter}</span>${esc(START.kicker)}</p>
          <h2 id="${id}-h">${split(START.title)}</h2>
          <p class="start-body">${esc(START.body)}</p>
          <a class="btn btn-ink" href="${mail}">${esc(START.cta)}<span aria-hidden="true"> →</span></a>
          <p class="start-mail">${SITE.email} · ${esc(SITE.city)}</p>
        </div>
        <div class="start-side">
          <table class="sendlist"><caption>What would you send?</caption>
            <tbody>${START.examples.map((x) => `<tr><th scope="row">${esc(x.a)}</th><td>${esc(x.s)}</td></tr>`).join('')}</tbody>
          </table>
          <ol class="weeks" aria-label="Two-week findings">
            <li><span>Week 0</span>One artifact in</li><li><span>Week 1</span>Read and checked</li><li><span>Week 2</span>Written findings out</li>
          </ol>
        </div>
      </div>
    </div>
  </section>`;
}

export function sysMark(s, size = 32) {
  return glyph(s.slug, { size });
}
