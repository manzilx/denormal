// A printable portfolio brief using the same current systems as the website.
// The former export pipeline is retained in site/legacy/ for reference.
import { layout } from '../templates/layout.mjs';
import { SYSTEMS } from '../content/systems.mjs';
import { WORKFLOWS } from '../content/workflows.mjs';
import { esc } from '../lib/html.mjs';
import { glyph } from '../glyphs.mjs';
export function renderPortfolioBrief() {
  return layout({path:'/brochure/',title:'Portfolio brief',noindex:true,description:'The Denormal Labs portfolio: five focused digital workflows.',main:`<section class="policy-hero zone"><div class="wrap"><p class="mono">Denormal Labs / Portfolio brief</p><h1>We fix processes using tech.</h1><p class="policy-lede">Ground → Constrain → Decide → Prove</p><p>Human-centered, lean digital workflows to empower people, enable innovation and create lasting impact.</p></div></section><div class="wrap portfolio-brief">${SYSTEMS.map(s=>`<section class="brief-system"><p class="mono">System ${s.n} / ${esc(s.short)}</p><h2>${glyph(s.slug)}${esc(s.name)}</h2><p>${esc(WORKFLOWS[s.slug].summary)}</p><ul>${WORKFLOWS[s.slug].delivers.map(d=>`<li><b>${esc(d.t)}</b> — ${esc(d.d)}</li>`).join('')}</ul><p class="brief-rule">${esc(s.rule.long)}</p><a href="/systems/${s.slug}/">Explore ${esc(s.abbr)} ↗</a></section>`).join('')}</div>`});
}
