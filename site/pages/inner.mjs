// Inner sheets: the systems register, one sheet per system, How we work,
// Deployment, About and the 404.
import { esc } from '../lib/html.mjs';
import { layout } from '../templates/layout.mjs';
import { zone, zoneHead, split, cover, decisionLine, stateLegend, layerSection, programme, boundaries, commitments, notBuilt, dimension, rulePlate, startPlate, sysMark } from '../templates/components.mjs';
import { glyph } from '../glyphs.mjs';
import { SYSTEMS } from '../content/systems.mjs';
import { PRINCIPLES, REFUSALS, DEPLOYMENT, MISSION, ABOUT, PURPOSE, VALUES } from '../content/site.mjs';
import { PHOTOS } from '../content/photos.mjs';
import { WORKFLOWS } from '../content/workflows.mjs';
import { industrialProcess, systemsCover, workflowExplorer, workflowOutputs, workflowProcess, workflowReview } from '../templates/portfolio.mjs';

const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);

function pageHero({ id = 'top', sheet, code, title, line, lede, side = '' }) {
  return `<section class="zone page-hero" id="${id}" data-zone="A" aria-labelledby="${id}-h">
  <div class="wrap page-hero-grid">
    <div class="page-hero-copy">
      <p class="page-code"><span class="zone-tag" aria-hidden="true">A</span><span class="mono">${esc(code || sheet)}</span></p>
      <h1 id="${id}-h">${split(title)}</h1>
      ${line ? `<p class="line">${esc(line)}</p>` : ''}
      ${lede ? `<p class="lede">${esc(lede)}</p>` : ''}
    </div>
    ${side ? `<div class="page-hero-side">${side}</div>` : ''}
  </div>
</section>`;
}

// ── /systems/ ─────────────────────────────────────────────────────────────
export function renderSystemsIndex() {
  const sheet='DL-100';
  const main=[
    systemsCover(),
    zone({id:'explore',letter:'B',cls:'workflow-zone',body:`${zoneHead({letter:'B',id:'explore',title:'Start with the work.',sheet,lede:'Choose the process you need to improve. See what goes in, what comes back and the decision that remains with your team.'})}${workflowExplorer({prefix:'systems-workflow'})}`}),
    zone({id:'process',letter:'C',cls:'industrial-zone',body:`${zoneHead({letter:'C',id:'process',title:'Ground. Constrain. Decide. Prove.',sheet,lede:'A shared discipline, applied differently in each workflow.'})}${industrialProcess()}`}),
    zone({id:'approach',letter:'D',cls:'workflow-approach',body:`${zoneHead({letter:'D',id:'approach',title:'Evidence in. Judgment with you.',sheet})}<div class="workflow-principles"><article><span class="mono">01 / The starting point</span><h3>Your working record.</h3><p>The tender pack, contract, project correspondence, site observation or contractor records your team already produces.</p></article><article><span class="mono">02 / The result</span><h3>A reviewable finding.</h3><p>A risk review, connected register, draft or proposal with the evidence and product-specific checks made visible.</p></article><article><span class="mono">03 / The responsibility</span><h3>A person decides.</h3><p>Your team reviews the finding and determines the next action. Deployment and data paths are agreed for the workflow.</p></article></div><div class="workflow-approach-links"><a href="/how-we-work/">Our Lean method ↗</a><a href="/deployment/">Deployment options ↗</a><a href="/about/#values">What Denormal stands for ↗</a></div>`}),
    startPlate({sheet,letter:'E'}),
  ].join('\n');
  return layout({path:'/systems/',title:'Systems',cover:true,description:'Explore Denormal Labs workflows for tender review, contracts and claims, project correspondence, site safety and labour compliance.',zones:z(['top','explore','process','approach','start'],['Systems','Choose a workflow','Our discipline','Human review','Start']),main});
}

// ── /systems/<slug>/ ──────────────────────────────────────────────────────
export function renderSystem(s,i) {
  const sheet=`DL-10${i+1}`;
  const w=WORKFLOWS[s.slug];
  const prev=SYSTEMS[(i+SYSTEMS.length-1)%SYSTEMS.length];
  const next=SYSTEMS[(i+1)%SYSTEMS.length];
  const main=[
    cover({cls:'workflow-cover',kicker:w.area.toLowerCase()===s.name.toLowerCase()?s.name:`${w.area} / ${s.name}`,title:w.headline,lede:w.summary,photo:PHOTOS[s.slug],slot:s.slug,next:'brief',actions:'<a class="btn btn-plate" href="#does">See what you get <span aria-hidden="true">↓</span></a>',base:`<p class="workflow-cover-audience"><span class="mono">Designed for</span>${esc(w.audience)}</p>`}),
    `<section class="zone system-context" id="brief" aria-label="The work in front of you"><div class="wrap"><p class="mono">The work in front of you</p><p>${esc(w.challenge)}</p></div></section>`,
    zone({id:'does',letter:'B',cls:'workflow-zone',body:`${zoneHead({letter:'B',id:'does',title:'What your team gets.',sheet})}${workflowOutputs(s)}`}),
    zone({id:'decides',letter:'C',cls:'workflow-approach',body:`${zoneHead({letter:'C',id:'decides',title:'From the record to the review.',sheet})}${workflowProcess(s)}`}),
    zone({id:'refuses',letter:'D',body:`${zoneHead({letter:'D',id:'refuses',title:'The decision stays with people.',sheet})}${workflowReview(s)}`}),
    zone({id:'proof',letter:'E',cls:'workflow-approach',body:`${zoneHead({letter:'E',id:'proof',title:'The detail behind the workflow.',sheet,lede:'Product-specific checks and boundaries you can inspect.'})}<div class="dims">${s.proof.map(dimension).join('')}</div><details class="system-technical"><summary>Review the product checks <span aria-hidden="true">+</span></summary>${decisionLine(s,{full:true})}</details><p class="boundary-note"><b>Deployment.</b> ${esc(s.boundary)} <a href="/deployment/">View deployment options ↗</a></p>`}),
    `<nav class="zone zone-contd" aria-label="Other systems"><div class="wrap"><div class="contd"><a href="/systems/${prev.slug}/"><span class="mono">← ${esc(WORKFLOWS[prev.slug].area)}</span><b>${esc(prev.name)}</b></a><a href="/systems/${next.slug}/"><span class="mono">${esc(WORKFLOWS[next.slug].area)} →</span><b>${esc(next.name)}</b></a></div><p class="workflow-all"><a href="/systems/">All workflows ↗</a></p></div></nav>`,
    startPlate({sheet,letter:'F'}),
  ].join('\n');
  return layout({path:`/systems/${s.slug}/`,title:s.name,cover:true,description:`${s.name}: ${w.summary}`,zones:z(['top','does','decides','refuses','proof','start'],[s.name,'What you get','Workflow','Human review','Product detail','Start']),main});
}

// ── /how-we-work/ ─────────────────────────────────────────────────────────
export function renderHowWeWork() {
  const sheet = 'DL-200';
  const main = [
    pageHero({ sheet, code:'How / Our mission', title: PURPOSE.mission.title, line: PURPOSE.mission.statement }),
    zone({ id: 'method', letter: 'B', body: `${zoneHead({ letter:'B', id:'method', title:'Six moves. One continuous flow.', sheet, lede:PURPOSE.mission.method })}
      <ol class="ops">${MISSION.map(m=>`<li><span class="n">${m.n}</span><b>${esc(m.t)}</b><p>${esc(m.d)}</p><span class="lean">${esc(m.lean)}</span></li>`).join('')}</ol>` }),
    zone({ id: 'programme', letter: 'C', cls: 'zone-alt', body: `${zoneHead({ letter: 'C', id: 'programme', title: 'One document first. Then a decision.', sheet, lede:'A fixed piece of work, returned on time, before anything larger is agreed.' })}${programme()}` }),
    zone({ id: 'principles', letter: 'D', body: `${zoneHead({ letter: 'D', id: 'principles', title: 'How we hold ourselves.', sheet })}
      <div class="principles">${PRINCIPLES.map((p) => `<div><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></div>`).join('')}</div>` }),
    zone({ id: 'refusals', letter: 'E', cls: 'zone-alt', body: `${zoneHead({ letter: 'E', id: 'refusals', title: 'What the systems will not do.', sheet, lede: 'Each line is a rule the code enforces, not a promise in a policy.' })}
      <table class="refusals"><tbody>${REFUSALS.map((r) => `<tr><th scope="row">${esc(r.sys)}</th><td><span class="will-not">Will not</span> ${esc(lower(r.t))}</td></tr>`).join('')}</tbody></table>` }),
    startPlate({ sheet, letter: 'F' }),
  ].join('\n');
  return layout({ path: '/how-we-work/', title: 'How we work', description: PURPOSE.mission.statement, zones: z(['top', 'method', 'programme', 'principles', 'refusals', 'start'], ['Mission', 'Lean method', 'Programme', 'Principles', 'Refusals', 'Start']), main });
}

// ── /deployment/ ──────────────────────────────────────────────────────────
export function renderDeployment() {
  const sheet = 'DL-300';
  const main = [
    cover({ cls: 'cover-sys', kicker: sheet, title: DEPLOYMENT.title, line: DEPLOYMENT.lede, photo: PHOTOS.deployment, slot: 'deployment', next: 'boundaries',
      base: `<ul class="cover-for"><li class="mono">Boundaries</li>${DEPLOYMENT.options.map((o) => `<li>${o.id} ${esc(o.t)}</li>`).join('')}</ul>` }),
    zone({ id: 'boundaries', letter: 'B', cls: 'zone-alt', body: `${zoneHead({ letter: 'B', id: 'boundaries', title: 'Three boundaries, in plan.', sheet })}${boundaries()}` }),
    zone({ id: 'commitments', letter: 'C', body: `${zoneHead({ letter: 'C', id: 'commitments', title: 'Whichever you choose.', sheet })}${commitments()}` }),
    zone({ id: 'notbuilt', letter: 'D', cls: 'zone-alt', body: `${zoneHead({ letter: 'D', id: 'notbuilt', title: 'Not built yet.', sheet, lede: 'We would rather write this list down than have you find it during a security review. Each item is clouded until it ships.' })}${notBuilt()}` }),
    startPlate({ sheet, letter: 'E' }),
  ].join('\n');
  return layout({ path: '/deployment/', title: 'Deployment', cover: true, description: 'Run Denormal Labs systems on your servers, in your cloud, or hosted by us in an India region, and see what is not built yet.', zones: z(['top', 'boundaries', 'commitments', 'notbuilt', 'start'], ['Deployment', 'Boundaries', 'Commitments', 'Not built yet', 'Start']), main });
}

// ── /about/ ───────────────────────────────────────────────────────────────
export function renderAbout() {
  const sheet = 'DL-400';
  const credits = Object.values(PHOTOS);
  const main = [
    pageHero({ sheet, title: ABOUT.title, line: ABOUT.lede }),
    zone({ id: 'why', letter: 'B', cls: 'zone-alt', body: `${zoneHead({ letter: 'B', id: 'why', title: 'From the operating side.', sheet })}<div class="prose">${ABOUT.body.map((p) => `<p>${esc(p)}</p>`).join('')}<p class="about-welcome"><strong>${esc(ABOUT.welcome)}</strong> ${esc(ABOUT.invitation)}</p></div>` }),
    zone({ id:'values', letter:'C', cls:'values-zone', body:`${zoneHead({letter:'C',id:'values',title:'What Denormal stands for.',sheet,lede:'Four principles that shape what we build and how we work.'})}<div class="values-grid">${VALUES.map(v=>`<article><span class="mono">${v.n} / Our values</span><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></article>`).join('')}</div>` }),
    zone({ id: 'method', letter: 'D', body: `${zoneHead({ letter: 'D', id: 'method', title: 'Six moves. One continuous flow.', sheet, lede: PURPOSE.mission.method })}
      <ol class="ops">${MISSION.map((m) => `<li><span class="n">${m.n}</span><b>${esc(m.t)}</b><p>${esc(m.d)}</p><span class="lean">${esc(m.lean)}</span></li>`).join('')}</ol>` }),
    zone({ id: 'credits', letter: 'E', cls: 'zone-alt', body: `${zoneHead({ letter: 'E', id: 'credits', title: 'Photographs.', sheet })}
      ${credits.length ? `<ul class="credits">${credits.map((c) => `<li>${c.source ? `${esc(c.caption)}: photograph by <a href="${esc(c.source)}">${esc(c.author)}</a>, <a href="${esc(c.licenceUrl)}">${esc(c.licence)}</a>` : `${esc(c.caption)}: ${esc(c.licence.toLowerCase())}, ${esc(c.author)}`}${c.note ? `, ${esc(c.note)}` : ''}, shown toned in two colours.</li>`).join('')}</ul>` : '<p class="zone-lede">Photography is being selected; each image will be credited here with its source and licence.</p>'}` }),
    startPlate({ sheet, letter: 'F' }),
  ].join('\n');
  return layout({ path: '/about/', title: 'About', description: ABOUT.lede, zones: z(['top', 'why', 'values', 'method', 'credits', 'start'], ['About', 'Why', 'Values', 'Method', 'Photographs', 'Start']), main });
}

export function render404() {
  const main = pageHero({ sheet: 'DL-404', title: 'Sheet not found.', line: 'This sheet is not in the drawing register. The register below lists every sheet that is.' })
    + `<section class="zone"><div class="wrap"><p class="more"><a href="/">Back to the general arrangement, DL-000 →</a></p></div></section>`;
  return layout({ path: '/404', title: 'Sheet not found', main, noindex: true });
}

function z(ids, labels) {
  return ids.map((id, i) => ({ id, letter: String.fromCharCode(65 + i), label: labels[i] }));
}
