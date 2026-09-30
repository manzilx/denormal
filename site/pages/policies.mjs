import { layout } from '../templates/layout.mjs';
import { esc } from '../lib/html.mjs';

export function renderPolicy(p) {
  const sections=p.sections.map((s,i)=>`<section class="policy-section" id="${s.id}" aria-labelledby="${s.id}-h"><span class="mono">${String(i+1).padStart(2,'0')}</span><div><h2 id="${s.id}-h">${esc(s.title)}</h2>${s.paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}</div></section>`).join('');
  const main=`<section class="policy-hero zone"><div class="wrap"><p class="mono">${p.code} / Website policy · Updated 30 September 2026</p><h1>${esc(p.title)}</h1><p class="policy-lede">${esc(p.lede)}</p></div></section><div class="wrap policy-layout"><nav class="policy-contents" aria-label="On this page"><p class="mono">On this page</p><ol>${p.sections.map(s=>`<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join('')}</ol><a class="policy-contact" href="mailto:hello@denormal.in">Contact Denormal ↗</a></nav><div class="policy-body">${sections}${p.sources?`<aside class="policy-sources"><h2>Reference frameworks</h2><ul>${p.sources.map(s=>`<li><a href="${s.href}">${esc(s.label)} ↗</a></li>`).join('')}</ul></aside>`:''}<p class="policy-related"><a href="/deployment/">Deployment and product boundaries ↗</a><a href="/about/#values">What Denormal stands for ↗</a></p></div></div>`;
  return layout({path:p.path,title:p.title,description:p.lede,main});
}
