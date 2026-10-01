import { esc } from '../lib/html.mjs';
import { layout } from '../templates/layout.mjs';
import { zone, zoneHead, band, commitments, notBuilt, startPlate } from '../templates/components.mjs';
import { HERO, AUDIENCE, PURPOSE, DEPLOYMENT, PRINCIPLES } from '../content/site.mjs';
import { aerial, ticker, figures, stackScene, kinetic } from '../templates/scenes.mjs';
import { PHOTOS } from '../content/photos.mjs';
import { workflowExplorer } from '../templates/portfolio.mjs';
import { picture, split } from '../templates/components.mjs';
import { processRefinery, boundaryAtlas } from '../templates/immersive.mjs';
import { readAlong } from '../templates/readalong.mjs';

const SHEET = 'DL-000';
const ZONES = [
  { id: 'top', letter: 'A', label: 'Core purpose' },
  { id: 'why', letter: 'B', label: 'Why · Our vision' },
  { id: 'how', letter: 'C', label: 'How · Our mission and Lean method' },
  { id: 'systems', letter: 'D', label: 'What · Our systems' },
  { id: 'field', letter: 'E', label: 'People and process' },
  { id: 'architecture', letter: 'F', label: 'Architecture' },
  { id: 'deploy', letter: 'G', label: 'Deployment' },
  { id: 'start', letter: 'H', label: 'Start with one document' },
];

function hero() {
  const frames = [
    { slot: 'landing', label: 'Power & infrastructure', word: 'Operations', caption: PHOTOS.landing.caption },
    { slot: 'people-decisions', label: 'People & decisions', word: 'People', caption: PHOTOS['people-decisions'].caption },
    { slot: 'process-inspection', label: 'Process & control', word: 'Process', caption: PHOTOS['process-inspection'].caption },
  ];
  return `<section class="cover cover-home cinema" id="top" data-zone="A" aria-labelledby="top-h">
    <div class="cover-media cinema-media">${frames.map((f,i) => `<div class="cinema-frame duo${i === 0 ? ' is-active' : ''}" data-frame="${i}">${i === 0 ? aerial(PHOTOS.landing, 'landing') : picture(PHOTOS[f.slot], f.slot)}<span class="cinema-word" aria-hidden="true">${f.word}</span></div>`).join('')}</div>
    <div class="cover-shade" aria-hidden="true"></div>
    <div class="cover-body wrap">
      <p class="cover-kicker"><span class="mono">${esc(HERO.kicker)}</span></p>
      <h1 id="top-h" class="cover-title purpose-title">${HERO.lines.map((line,i) => split(line, i === 0 ? 0 : 1)).join('<br>')}</h1>
      <div class="cinema-bottom"><p class="cover-lede">${esc(HERO.lede)}</p><div class="actions"><a class="btn btn-plate" href="#start">${esc(HERO.primary.label)}</a><a class="cinema-link" href="#why">Discover our purpose <span aria-hidden="true">↗</span></a></div></div>
    </div>
    <div class="cinema-reel wrap"><span class="mono cinema-caption" data-scene-caption>${esc(frames[0].caption)}</span><div class="scene-select" role="group" aria-label="Industrial scenes">${frames.map((f,i) => `<button type="button" data-scene="${i}" aria-pressed="${i===0}" data-caption="${esc(f.caption)}"><span class="mono">0${i+1}</span><span>${f.label}</span><i aria-hidden="true"></i></button>`).join('')}</div></div>
    <div class="cover-base"><div class="cover-base-in wrap"><ul class="cover-for"><li class="mono">Designed for</li>${AUDIENCE.map(a=>`<li>${esc(a)}</li>`).join('')}</ul><a class="cinema-scroll mono" href="#why">Scroll to explore <span aria-hidden="true">↓</span></a></div></div>
  </section>`;
}

function why() {
  const vision = PURPOSE.vision;
  return zone({ id:'why', letter:'B', cls:'purpose-zone vision-zone', body:`
    <p class="purpose-k mono">01 / Why · Our vision</p>
    ${zoneHead({letter:'B', id:'why', title:vision.title, sheet:SHEET})}
    <div class="vision-grid"><div class="vision-copy"><p class="purpose-statement">${esc(vision.statement)}</p><p class="vision-foot mono">${esc(vision.foot)}</p><a class="values-home-link" href="/about/#values">What Denormal stands for ↗</a><a class="purpose-next" href="#how">How we make it happen <span aria-hidden="true">↘</span></a></div>
      <figure class="purpose-visual duo">${picture(PHOTOS['engineering-team'],'engineering-team',{sizes:'(min-width: 960px) 65vw, 100vw'})}<figcaption class="mono">${esc(PHOTOS['engineering-team'].caption)}</figcaption></figure></div>` });
}

function how() {
  const mission = PURPOSE.mission;
  return zone({ id:'how', letter:'C', cls:'purpose-zone mission-zone', body:`
    <p class="purpose-k mono">02 / How · Our mission</p>
    ${zoneHead({letter:'C', id:'how', title:mission.title, sheet:SHEET})}
    <p class="mission-statement purpose-statement">${esc(mission.statement)}</p>
    <div class="lean-intro"><h3>Six moves. One continuous flow.</h3><p>${esc(mission.method)} Explore each move below.</p></div>
    ${processRefinery()}
    <a class="purpose-next" href="#systems">What this makes possible <span aria-hidden="true">↘</span></a>` });
}

function systems() {
  return zone({ id:'systems', letter:'D', cls:'workflow-zone', body:`<p class="purpose-k mono">03 / What · Our systems</p>${zoneHead({letter:'D',id:'systems',title:'Built around the work you do.',sheet:SHEET,lede:'Five focused workflows for infrastructure, power and complex operations. Start with the work in front of you.'})}${workflowExplorer({prefix:'home-workflow',compact:true})}${readAlong()}` });
}

function field() {
  const work = [
    { slot:'site-planning', n:'01', title:'Start where the work happens.', text:'On site, with the teams who know the process.' },
    { slot:'field-check', n:'02', title:'Check the process.', text:'The evidence, the controls and the record of what was checked.' },
    { slot:'field-decision', n:'03', title:'Keep the decision.', text:'A person reviews the finding and decides what happens next.' },
  ];
  return zone({ id:'field', letter:'E', cls:'zone-field people-zone', body:`${zoneHead({letter:'E', id:'field', title:'People run the process.', sheet:SHEET, lede:'The work happens at the drawing table, on the factory floor and out on site. We build systems around that work, with judgment staying with whoever is responsible for it.'})}
    <div class="people-grid">${work.map(w=>`<figure class="people-card"><div class="people-photo duo">${picture(PHOTOS[w.slot], w.slot, { sizes:'(min-width: 960px) 60vw, 100vw' })}</div><figcaption><span class="mono">${w.n} / ${esc(PHOTOS[w.slot].caption)}</span><h3>${w.title}</h3><p>${w.text}</p></figcaption></figure>`).join('')}</div><p class="people-credit"><a href="/about/#credits">Photography credits</a> · Stock imagery illustrating work and processes.</p>` });
}

function figs() {
  return `<section class="figs-zone" id="figures" aria-label="Figures fixed by design"><div class="wrap">
    <p class="figs-k mono">Fixed by design · each figure traceable to the code that sets it</p>
    ${figures()}
  </div></section>`;
}

function deploy() {
  return zone({ id: 'deploy', letter: 'G', cls:'atlas-zone', body: `${zoneHead({ letter: 'G', id: 'deploy', title: DEPLOYMENT.title, sheet: SHEET, lede: DEPLOYMENT.lede })}
    ${boundaryAtlas()}
    ${commitments()}
    <div class="notbuilt-row"><h3 class="h-small">Not built yet</h3>${notBuilt({ compact: true })}</div>
    <p class="more"><a href="/deployment/">Deployment, sheet DL-300 →</a></p>` });
}

export function renderHome() {
  return layout({
    path: '/',
    title: 'General arrangement',
    zones: ZONES,
    cover: true,
    main: [
      hero(), why(), how(), systems(), figs(), ticker(), field(), kinetic(),
      band({ photo: PHOTOS['engineering-team'], slot: 'engineering-team', view: 'B', kicker: PHOTOS['engineering-team'].caption, title: PRINCIPLES[0].t + '.', body: PRINCIPLES[0].d }),
      stackScene({ id: 'architecture', letter: 'F', sheet: SHEET }),
      band({ photo: PHOTOS.hero, slot: 'hero', view: 'C', kicker: PHOTOS.hero.caption, title: PRINCIPLES[3].t + '.', body: PRINCIPLES[3].d }),
      deploy(), startPlate({ sheet: SHEET, letter: 'H' }),
    ].join('\n'),
  });
}
