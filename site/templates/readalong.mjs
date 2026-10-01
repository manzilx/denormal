// The read-along: a synthetic record read the way each system reads one, so
// the technology under the story is seen working rather than named. Three
// voices, kept apart on purpose:
//   machine (mono, streams in, always cites its source)
//   rule    (the signal-coloured gate line: the one rule each system won't bend)
//   person  (sans, still; the visitor makes the call)
// Each demo shows outcomes and the system's published rule only (systems.mjs
// `rule`), never internals: no thresholds, catalogues, formats or methods.
// Every record is synthetic.
import { esc } from '../lib/html.mjs';
import { picture } from './components.mjs';
import { PHOTOS } from '../content/photos.mjs';

const DEMOS = [
  {
    slug: 'pci', name: 'Power Contract Intelligence', tab: 'Tendering',
    doc: {
      head: ['Section 7 · Conditions of contract', 'p. 14'], title: 'Supply of 132 kV substation equipment',
      items: [
        { c: '7.1', t: 'Scope', d: 'Design, supply, testing and commissioning of 132 kV substation equipment as listed in Schedule A.' },
        { c: '7.2', t: 'Liquidated damages', d: 'Delay beyond the completion date attracts liquidated damages of 0.5% of the contract price per week, up to 10% of the contract price.' },
        { c: '7.3', t: 'Payment', d: '90% on delivery and inspection; 10% on commissioning, payable within 30 days of a valid invoice.' },
        { c: '7.4', t: 'Performance guarantee', d: 'The Contractor shall furnish a performance guarantee in the form and amount set out in Annexure G.' },
        { c: '7.5', t: 'Taxes and duties', d: 'Prices include all taxes and duties applicable on the bid due date.' },
      ],
      foot: 'Annexure G · scanned · no text recovered',
    },
    lines: [
      { voice: 'read', cite: 'pack index', text: 'Parsed 6 files. 1 empty: Annexure G, scanned, no text recovered. Recorded as empty, not skipped.' },
      { voice: 'read', c: '7.2', v: 'Deviation', cite: 'p.14 §7.2', text: '§7.2 Liquidated damages. 0.5% a week, capped at 10%. Verdict: DEVIATION. Deviation drafted.' },
      { voice: 'read', c: '7.3', v: 'Acceptable', cite: 'p.14 §7.3', text: '§7.3 Payment. 90/10, 30 days. Verdict: ACCEPTABLE.' },
      { voice: 'read', c: '7.5', v: 'Compliant', cite: 'p.14 §7.5', text: '§7.5 Taxes and duties. Verdict: COMPLIANT.' },
      { voice: 'read', cite: 'searched §7.1–7.5', text: 'Change in law. No clause in Section 7. Verdict: SILENT. Silence is recorded as a finding.' },
      { voice: 'rule', c: '7.4', v: 'Gap', cite: 'p.14 §7.4 → Annexure G', text: '§7.4 Performance guarantee. Refers to Annexure G, which has no text to verify against. Counted as a GAP, not as compliant.' },
      { voice: 'held', text: 'Position: conditional bid. 1 deviation, 1 gap; the gap is drafted as a pre-bid query. Held for you.' },
    ],
    choices: [
      { label: 'Approve conditional bid', out: 'Approved as a conditional bid. The deviation goes into the register and the gap goes out as a pre-bid query.' },
      { label: 'Return for review', out: 'Returned for review. Nothing is issued until someone approves it.' },
    ],
  },
  {
    slug: 'sentinel', name: 'Sentinel', tab: 'Site safety',
    doc: {
      head: ['Site observation · Block B, level 3', '06:40'], title: 'Scaffold at the slab edge', photo: 'sentinel',
      items: [
        { c: 'note', t: 'Note from site', d: 'East side of the level 3 slab. Guard rail looks incomplete near the hoist opening.' },
        { c: 'ask', t: 'Follow-up question', d: 'Can the night shift carry on with formwork here tonight?' },
      ],
      foot: 'Photo and note sent from the site app',
    },
    lines: [
      { voice: 'read', c: 'note', v: 'Work at height', cite: 'photo · observation note', text: 'Photo read as work at height near an open edge. A hazard report and a checklist are drafted.' },
      { voice: 'read', cite: 'site safety guidance', text: 'Guidance for edge protection found and cited alongside the report.' },
      { voice: 'rule', c: 'ask', v: 'No answer', cite: 'sources shown', text: 'Follow-up question. The sources do not support an answer, so none is generated. The sources are shown instead.' },
      { voice: 'held', text: 'Suggested response: proceed with caution. The site response is decided by the supervisor. Held for you.' },
    ],
    choices: [
      { label: 'Proceed with caution', out: 'Recorded: proceed with caution, decided by the supervisor. The checklist goes to the crew.' },
      { label: 'Stop the work', out: 'Recorded: work stopped at the edge, decided by the supervisor.' },
    ],
  },
  {
    slug: 'labour-compliance', name: 'Labour Compliance', tab: 'Labour compliance',
    doc: {
      head: ['Contractor B · monthly return', 'March'], title: 'Records received this month',
      items: [
        { c: 'wages', t: 'Wage register', d: 'Received. Headcount and wages paid for the month.' },
        { c: 'contrib', t: 'Contribution statement', d: 'Received. Contributions declared for the same workers.' },
        { c: 'attest', t: 'Contractor attestation', d: 'Received. The total the contractor attests was paid.' },
      ],
      foot: 'Uploaded by the contractor',
    },
    lines: [
      { voice: 'read', c: 'wages', v: 'Received', cite: 'contractor uploads', text: 'Three records received for March from Contractor B and kept with the month.' },
      { voice: 'read', c: 'attest', v: 'Mismatch', cite: 'register vs attestation', text: 'Contributions reconciled against the attestation. They do not agree, so a mismatch is flagged.' },
      { voice: 'rule', c: 'contrib', v: 'Proposal', cite: 'approval inbox', text: 'A reminder to the contractor is drafted as a proposal. Nothing is sent or applied until a person approves it.' },
      { voice: 'held', text: 'Proposal waiting in the approval inbox. Held for you.' },
    ],
    choices: [
      { label: 'Approve the reminder', out: 'Approved. The reminder goes to Contractor B and the decision is recorded; it cannot be decided again.' },
      { label: 'Reject', out: 'Rejected. Nothing is sent, and the decision is recorded.' },
    ],
  },
  {
    slug: 'nexusref', name: 'NexusRef', tab: 'Project correspondence',
    doc: {
      head: ['Incoming mail · project inbox', '09:12'], title: 'Re: Revised drawings, pump house',
      items: [
        { c: 'mail', t: 'Message', d: 'Please find the revised pump house drawings attached for your review and comments.' },
        { c: 'att', t: 'Attachment', d: 'letter-114.pdf · cover letter with a drawing list' },
        { c: 'file', t: 'Filing', d: 'Project and folder to be identified.' },
      ],
      foot: 'Received in the shared project inbox',
    },
    lines: [
      { voice: 'read', c: 'mail', v: 'Registered', cite: 'mail · 1 attachment', text: 'Message and attached letter brought into the project register.' },
      { voice: 'read', c: 'att', v: 'Referenced', cite: 'register entry', text: 'A formal reference is assigned and the revision is kept identifiable.' },
      { voice: 'rule', c: 'file', v: 'Triage', cite: 'classification', text: 'No folder can be identified with confidence, so the filing is marked for triage and review.' },
      { voice: 'held', text: 'The filing context waits for the project team. Held for you.' },
    ],
    choices: [
      { label: 'File to pump house', out: 'Filed by the project team. Replies and issued positions stay with your team.' },
      { label: 'Leave in triage', out: 'Left in triage for the document controller. Nothing is filed.' },
    ],
  },
  {
    slug: 'onelegal', name: 'OneLegal', tab: 'Contract risk & claims',
    doc: {
      head: ['EPC contract · particular conditions', 'Playbook run'], title: 'Contract risk review',
      items: [
        { c: '20.1', t: 'Notice of claim', d: 'The Contractor shall give notice within 28 days of becoming aware of the event, failing which no extension of time shall be granted.' },
        { c: '8.7', t: 'Delay damages', d: 'Delay damages are payable for each day of delay, capped at 10% of the Contract Price.' },
        { c: '17.6', t: 'Indirect loss', d: 'Neither Party shall be liable to the other for loss of use, loss of profit or any indirect or consequential loss.' },
      ],
      foot: 'Evidence set for the delay claim · 4 documents · not sealed',
    },
    lines: [
      { voice: 'read', cite: 'playbook · EPC family', text: 'Playbook selected for an EPC contract. Its questions run clause by clause, and every answer is cited.' },
      { voice: 'read', c: '20.1', v: 'High risk', cite: 'cl. 20.1', text: 'Is an extension claim time-barred? Yes: 28 days, then no extension. Scored HIGH against the market baseline.' },
      { voice: 'read', c: '8.7', v: 'Baseline', cite: 'cl. 8.7', text: 'Are delay damages capped? Yes, at 10% of the price. Within the market baseline.' },
      { voice: 'read', c: '17.6', v: 'Baseline', cite: 'cl. 17.6', text: 'Is indirect loss excluded? Yes, for both parties. Within the market baseline.' },
      { voice: 'rule', c: 'seal', v: 'No draft', cite: 'evidence set · unsealed', text: 'A delay event follows. Draft the extension-of-time notice: the evidence set is not sealed, so no draft is produced.' },
      { voice: 'held', text: 'Risk review complete; the notice waits for counsel to seal the evidence. Held for you.' },
    ],
    choices: [
      { label: 'Seal the evidence set', out: 'Sealed by counsel. The notice drafts from the sealed record only; signing, sending and confirming the deadline stay with counsel.' },
      { label: 'Return to counsel', out: 'Returned to counsel. Nothing is drafted.' },
    ],
  },
];

const TAG = { read: 'Reads', rule: 'Rule', held: 'Held' };

function panel(d, i) {
  const photo = d.doc.photo ? `<div class="ra-photo duo">${picture(PHOTOS[d.doc.photo], d.doc.photo, { sizes: '(min-width: 900px) 30vw, 90vw' })}</div>` : '';
  return `<div class="ra-stage immersive" data-ra-panel="${d.slug}" role="tabpanel" id="ra-panel-${d.slug}" aria-labelledby="ra-tab-${d.slug}"${i ? ' hidden' : ''}>
      <article class="ra-doc" aria-label="Synthetic record for ${esc(d.name)}">
        <header class="ra-doc-h mono"><span>${esc(d.doc.head[0])}</span><span>${esc(d.doc.head[1])}</span></header>
        <p class="ra-doc-t">${esc(d.doc.title)}</p>
        ${photo}
        <ol class="ra-clauses">${d.doc.items.map((k) => `<li data-c="${k.c}"><b>${/^\d/.test(k.c) ? `${k.c} ` : ''}${esc(k.t)}.</b> ${esc(k.d)}<span class="ra-v mono" aria-hidden="true"></span></li>`).join('')}</ol>
        <p class="ra-doc-foot mono" data-c="seal">${esc(d.doc.foot)}<span class="ra-v mono" aria-hidden="true"></span></p>
      </article>
      <div class="ra-out">
        <div class="ra-out-h mono"><span>Read-out · ${esc(d.name)}</span><span class="ra-status" data-ra-status aria-live="polite">Ready</span></div>
        <ol class="ra-lines">${d.lines.map((l) => `<li class="ra-line ra-${l.voice}"${l.c ? ` data-c="${l.c}"` : ''}${l.v ? ` data-v="${esc(l.v)}"` : ''}>
          <span class="ra-tag mono">${TAG[l.voice]}</span>
          <span class="ra-body"><span class="ra-text mono" aria-hidden="true"></span><span class="ra-full">${esc(l.text)}</span>${l.cite ? `<span class="ra-cite mono">[${esc(l.cite)}]</span>` : ''}</span>
        </li>`).join('')}</ol>
        <div class="ra-decide">
          <p class="ra-q">Your call.</p>
          <div class="ra-choices">${d.choices.map((c, k) => `<button type="button" class="btn ${k ? 'ra-return' : 'btn-plate'}" data-ra-choice data-out="${esc(c.out)}">${esc(c.label)}</button>`).join('')}</div>
          <p class="ra-decided" data-ra-decided aria-live="polite"></p>
        </div>
        <div class="ra-foot"><button type="button" class="ra-run mono" data-ra-run>Run again ↺</button><span class="mono">Synthetic record · illustrative · nothing is sent</span></div>
      </div>
    </div>`;
}

export function readAlong() {
  return `<div class="readalong" data-readalong>
    <div class="ra-head">
      <p class="mono ra-k">Read-along · five systems</p>
      <h3 class="ra-title"><span class="ra-b" data-ra-beat="read">It reads.</span> <span class="ra-b" data-ra-beat="rule">The rule checks.</span> <span class="ra-b" data-ra-beat="held">You decide.</span></h3>
      <p class="ra-lede">A synthetic record, read the way each system reads one. Findings are cited to where they came from, the one rule the system won't bend is applied in plain view, and the decision waits for a person.</p>
    </div>
    <div class="ra-tabs" role="tablist" aria-label="Choose a system">${DEMOS.map((d, i) => `<button type="button" role="tab" id="ra-tab-${d.slug}" aria-controls="ra-panel-${d.slug}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}" data-ra-tab="${d.slug}"><span class="mono">0${i + 1}</span>${esc(d.tab)}</button>`).join('')}</div>
    ${DEMOS.map(panel).join('')}
  </div>`;
}
