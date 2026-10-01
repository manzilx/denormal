import { esc } from '../lib/html.mjs';
import { MISSION, DEPLOYMENT } from '../content/site.mjs';

// Abstract models of the method and deployment choices; no live telemetry.
export function processRefinery() {
  const labels = ['Observe the work', 'Follow the value', 'Find the repeatable', 'Take out the waste', 'Make the checks visible', 'Bring in judgment'];
  const records = Array.from({length:18}, (_,i) => {
    const x = 5 + ((i * 37) % 83), y = 9 + ((i * 53) % 72);
    return `<span class="ref-record${i%5===0?' ref-waste':''}" style="--sx:${x}%;--sy:${y}%;--ex:${10+(i%6)*14}%;--ey:${22+Math.floor(i/6)*24}%;--turn:${(i*29)%110-55}deg;--delay:${i*28}ms"><i></i><i></i><i></i><b class="mono">${String(i+1).padStart(2,'0')}</b></span>`;
  }).join('');
  return `<div class="refinery immersive" data-refinery data-phase="0" style="--order:0">
    <div class="ref-toolbar"><span class="mono">The process refinery</span><button class="ref-autoplay mono" type="button" data-ref-autoplay aria-pressed="true" aria-label="Pause process sequence"><i aria-hidden="true"></i><span>Auto sequence</span></button></div>
    <div class="ref-stage">
      <span class="ref-ghost" aria-hidden="true">LEAN</span>
      <div class="ref-orbit ref-orbit-one" aria-hidden="true"></div><div class="ref-orbit ref-orbit-two" aria-hidden="true"></div>
      <div class="ref-camera" aria-hidden="true"><div class="ref-plane"><div class="ref-floor"></div><div class="ref-streams"><i></i><i></i><i></i></div>${records}<div class="ref-gate"><span>CHECK</span><i></i></div><div class="ref-review"><svg viewBox="0 0 80 80"><circle cx="40" cy="26" r="10"/><path d="M20 62v-8c0-12 40-12 40 0v8M11 71h58"/></svg><span>A PERSON<br>DECIDES</span></div></div></div>
      <div class="ref-readout"><span class="mono">Method / conceptual view</span><p data-ref-caption>${labels[0]}</p><span class="ref-progress" aria-hidden="true"><i></i></span></div>
      <span class="ref-vertical mono" aria-hidden="true">Less friction. More room to think.</span>
    </div>
    <div class="ref-selector" role="tablist" aria-label="Explore the six Lean moves">${MISSION.map((m,i)=>`<button id="lean-tab-${i}" type="button" role="tab" aria-selected="${i===0}" aria-controls="lean-panel-${i}" tabindex="${i===0?0:-1}" data-ref-step="${i}" data-caption="${labels[i]}"><span class="mono">${m.n}</span><b>${esc(m.lean)}</b><i aria-hidden="true"></i></button>`).join('')}</div>
    <div class="ref-details">${MISSION.map((m,i)=>`<article id="lean-panel-${i}" role="tabpanel" aria-labelledby="lean-tab-${i}" ${i?'hidden':''} data-ref-panel="${i}"><span class="ref-big mono">${m.n}<small>/ 06</small></span><div><h3>${esc(m.t)}</h3><p>${esc(m.d)}</p></div><span class="ref-detail-note mono">${labels[i]}<br><span aria-hidden="true">↗</span></span></article>`).join('')}</div>
  </div>`;
}

export function boundaryAtlas() {
  const captions = ['Hardware you own.\nControls you govern.', 'Your tenancy.\nYour control plane.', 'India region.\nTerms agreed in writing.'];
  const labels = ['Your perimeter', 'Your cloud tenancy', 'Agreed hosted boundary'];
  return `<div class="boundary-atlas immersive" data-atlas data-boundary="0">
    <div class="atlas-top"><span class="mono">Deployment / boundary atlas</span><span class="mono">Choose the perimeter</span></div>
    <div class="atlas-choices" role="tablist" aria-label="Explore deployment boundaries">${DEPLOYMENT.options.map((o,i)=>`<button id="boundary-tab-${i}" role="tab" type="button" data-boundary-choice="${i}" data-caption="${esc(captions[i])}" data-label="${labels[i]}" aria-selected="${i===0}" aria-controls="boundary-panel-${i}" tabindex="${i===0?0:-1}"><span class="mono">${o.id}</span><b>${esc(o.t)}</b><span class="atlas-choice-tag mono">${esc(o.tag)}</span></button>`).join('')}</div>
    <div class="atlas-stage">
      <span class="atlas-ghost" aria-hidden="true">YOUR<br>BOUNDARY.</span>
      <div class="atlas-coordinates mono" aria-hidden="true"><span>Scope / agreed</span><span>Data paths / documented</span></div>
      <div class="atlas-camera" aria-hidden="true"><div class="atlas-model">
        <div class="atlas-floor"><div class="atlas-floor-grid"></div><span class="atlas-floor-label mono" data-boundary-label>Your perimeter</span><svg class="atlas-paths" viewBox="0 0 600 400"><path class="atlas-route" d="M60 200H540M140 90V310H460V90Z"/><path class="atlas-packet" d="M60 200H540"/><path class="atlas-packet packet-two" d="M140 90V310H460V90"/></svg><i class="atlas-corner corner-a"></i><i class="atlas-corner corner-b"></i><i class="atlas-corner corner-c"></i><i class="atlas-corner corner-d"></i></div>
        <div class="atlas-volume"></div>
        ${['Records','Workflow','Review'].map((t,i)=>`<div class="atlas-rack rack-${i}"><div class="rack-front">${Array.from({length:5},()=>'<i><b></b><b></b><b></b><span></span></i>').join('')}<strong class="mono">${t}</strong></div><div class="rack-side"></div><div class="rack-top"></div></div>`).join('')}
        <div class="atlas-halo"></div>
      </div></div>
      <div class="atlas-scope"><span class="mono">The operating boundary</span><p data-boundary-caption>Hardware you own.<br>Controls you govern.</p></div>
      <span class="atlas-scene-note mono">Conceptual deployment model · select a view above</span>
    </div>
    <div class="atlas-details">${DEPLOYMENT.options.map((o,i)=>`<article id="boundary-panel-${i}" role="tabpanel" aria-labelledby="boundary-tab-${i}" data-boundary-panel="${i}" ${i?'hidden':''}><span class="atlas-detail-code mono">${o.id}</span><div><h3>${esc(o.t)}</h3><p>${esc(o.d)}</p></div><span class="atlas-detail-foot mono">${esc(o.foot)}</span></article>`).join('')}</div>
  </div>`;
}
