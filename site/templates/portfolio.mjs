import { esc } from '../lib/html.mjs';
import { SYSTEMS } from '../content/systems.mjs';
import { WORKFLOWS } from '../content/workflows.mjs';
import { PHOTOS } from '../content/photos.mjs';
import { picture, cover } from './components.mjs';

export function systemsCover() {
  return cover({ cls:'systems-cover', kicker:'Systems / Lean digital workflows',
    title:'Complex work. Clearer workflows.',
    lede:'Tender review. Site safety. Labour compliance. Project correspondence. Contracts and claims. Five workflows that put people and the working record first.',
    photo:PHOTOS['systems-plant'], slot:'systems-plant', next:'explore',
    media:picture(PHOTOS['systems-plant'],'systems-plant',{eager:true,sizes:'(max-aspect-ratio: 3/2) 150vh, 100vw'})+`<div class="systems-field-graphic" data-industrial-motion aria-hidden="true"><span class="mono">Method / illustrative</span><svg viewBox="0 0 440 360"><path class="field-grid" d="M20 20h400v320H20zM20 100h400M20 180h400M20 260h400M100 20v320M180 20v320M260 20v320M340 20v320"/><path class="field-route" d="M60 260h110V180h100V100h110"/><g class="field-nodes"><circle cx="60" cy="260" r="7"/><circle cx="170" cy="180" r="7"/><circle cx="270" cy="100" r="7"/><circle cx="380" cy="100" r="7"/></g><circle class="field-traveller" r="4"/></svg><div class="field-coordinates mono">Ground / Constrain / Decide / Prove</div></div>`,
    actions:'<a class="btn btn-plate" href="#explore">Find your workflow <span aria-hidden="true">↓</span></a>',
    base:'<p class="systems-cover-note">From the source document to the person deciding.</p>',
  });
}

export function workflowExplorer({ prefix='workflow', compact=false }={}) {
  return `<div class="workflow-explorer${compact?' is-compact':''}">
    <div class="workflow-nav" role="tablist" aria-label="Choose an operational workflow" aria-orientation="vertical">${SYSTEMS.map((s,i)=>{
      const w=WORKFLOWS[s.slug];
      return `<button id="${prefix}-tab-${s.slug}" type="button" role="tab" aria-selected="${i===0}" aria-controls="${prefix}-panel-${s.slug}" tabindex="${i===0?0:-1}"><span class="workflow-number mono">${s.n}</span><span><b>${esc(w.area)}</b><small>${esc(s.name)}</small></span><span class="workflow-arrow" aria-hidden="true">↗</span></button>`;
    }).join('')}</div>
    <div class="workflow-panels">${SYSTEMS.map((s,i)=>{
      const w=WORKFLOWS[s.slug];
      const photo=PHOTOS[s.slug];
      const sizes=`(min-width: 960px) max(60vw, ${Math.ceil(440*photo.w/photo.h)}px), max(100vw, ${Math.ceil(360*photo.w/photo.h)}px)`;
      return `<section class="workflow-panel" role="tabpanel" id="${prefix}-panel-${s.slug}" aria-labelledby="${prefix}-tab-${s.slug}" tabindex="0"${i?' hidden':''}>
        <div class="workflow-image duo">${picture(photo,s.slug,{sizes})}<div class="workflow-overlay"><p class="mono">${esc(s.name)}</p><h3>${esc(w.headline)}</h3></div><span class="workflow-image-index" aria-hidden="true">${s.n}</span><span class="workflow-caption mono">${esc(photo.caption)}</span></div>
        <p class="workflow-input"><span class="mono">Start with</span>${esc(w.input)}</p>
        <div class="workflow-summary"><p>${esc(w.summary)}</p><a class="workflow-link" href="/systems/${s.slug}/">Explore ${esc(s.abbr)} <span aria-hidden="true">↗</span></a></div>
        <div class="workflow-outputs">${w.delivers.map((d,k)=>`<div><span class="mono">0${k+1} / ${compact?'Output':'What you get'}</span><h4>${esc(d.t)}</h4>${compact?'':`<p>${esc(d.d)}</p>`}</div>`).join('')}</div>
        ${compact?'':`<p class="workflow-audience"><span class="mono">Designed for</span>${esc(w.audience)}</p>`}
      </section>`;
    }).join('')}</div>
  </div>${compact?'<p class="workflow-all"><a href="/systems/">Explore all five workflows <span aria-hidden="true">↗</span></a></p>':''}`;
}

export function workflowOutputs(s) {
  const w=WORKFLOWS[s.slug];
  return `<div class="system-deliverables">${w.delivers.map((d,i)=>`<article><span class="mono">0${i+1}</span><h3>${esc(d.t)}</h3><p>${esc(d.d)}</p></article>`).join('')}</div>`;
}

export function workflowProcess(s) {
  const w=WORKFLOWS[s.slug];
  return `<p class="system-input"><span class="mono">Start with</span>${esc(w.input)}</p><ol class="system-process" aria-label="${esc(s.name)} workflow">${w.flow.map((t,i)=>`<li><span class="process-orbit" aria-hidden="true"><i></i></span><span class="mono">0${i+1}</span><h3>${esc(t)}</h3>${i===w.flow.length-1?'<p>A person decides.</p>':''}</li>`).join('')}</ol>`;
}

export function workflowReview(s) {
  const w=WORKFLOWS[s.slug];
  return `<div class="system-review"><div><p class="mono">Human review</p><p>${esc(w.review)}</p></div><div><p class="mono">The product boundary</p><p>${esc(s.rule.long)}</p></div></div><details class="system-example"><summary>See an illustrative review scenario <span aria-hidden="true">+</span></summary><p><span class="mono">Illustrative / synthetic scenario</span>${esc(w.example)}</p></details>`;
}

export function industrialProcess() {
  const stages=[
    {t:'Ground',d:'Start with the actual record: the document, correspondence, photograph or monthly return.'},
    {t:'Constrain',d:'Apply the product’s checks and make uncertainty visible before the finding is relied upon.'},
    {t:'Decide',d:'Keep consequential judgment with the responsible person. Automate routine administration within agreed rules.'},
    {t:'Prove',d:'Keep the finding connected to its source and the review record available in that workflow.'},
  ];
  return `<div class="industrial-process"><figure class="industrial-photo duo" data-industrial-motion>${picture(PHOTOS['refinery-detail'],'refinery-detail',{sizes:'(min-width:960px) 65vw, 100vw'})}<div class="process-plates" aria-hidden="true">${stages.map((s,i)=>`<div class="process-plate" style="--step:${i}"><span class="mono">0${i+1}</span><b>${s.t}</b><i></i></div>`).join('')}</div><figcaption class="mono">${esc(PHOTOS['refinery-detail'].caption)}<span>Workflow graphic / illustrative</span></figcaption></figure><div class="industrial-method"><p class="mono">From the record to a reviewable result</p><ol>${stages.map((s,i)=>`<li><span class="method-node mono">0${i+1}</span><div><h3>${s.t}</h3><p>${s.d}</p></div></li>`).join('')}</ol><a href="/how-we-work/">Explore our six Lean moves ↗</a></div></div>`;
}
