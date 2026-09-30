// Brochure pages for NexusRef and Supply Chain Control Tower, added at build
// time to the Claude Design export, which covers the other five systems.
//
// The markup is the export's own product page (Labour Compliance, page 08)
// with the content parameterised: same strip, glyph plate, decision line,
// four stops, proof figures and folio. Marks follow the house construction —
// 32-unit glyph, 24-unit stop icons, square caps, mitred joins — and each mark
// gives the accent to the one part that does the checking.
//
// Every figure below was checked against the product's code:
//   NexusRef (~/NexusRef, committed HEAD)
//     triage below 0.4 ........ packages/domain/src/index.ts (triage: !folderId || confidence < 0.4)
//     rule > sender > content . apps/web/lib/inbound-router.ts (applyRules first), index.ts sender match
//     tenant ids .............. apps/web/lib/ai-runtime.ts (visibleFolderIds, project in tenant)
//     model routes only when no party matched ... ai-runtime.ts
//     -NNNN-vN, revision bump . index.ts reference format; api/communications/revise
//     M365 ledger, files once . apps/web/lib/mailbox-filing.ts (idempotency ledger)
//     share links ............. apps/web/lib/share-store.ts (expiry, revoke, scrypt, 3 counters)
//     359 tests / 32 scope .... 39 *.test.ts files at HEAD; lib/__tests__/workspace-scope.test.ts
//   Supply Chain Control Tower (~/supply-chain-control-tower)
//     flow .................... app/process_map.py STAGE_ORDER (spec → RFQ/quotes/TBE → award → PO → shipment → GRN)
//     0.85 auto-match ......... app/store/matching.py:25, 190
//     no model in matcher ..... app/store/matching.py:1-8 (difflib + token overlap)
//     slip bands 20/40/70 ..... app/expediting.py _urgency (ok|watch|nudge|escalate), rule-based with reasons
//     follow-up drafts ........ app/expediting.py draft_followup_email
//     8 shipment stages ....... app/logistics.py _STAGE_ORDER (manufacturing → delivered)
//     OTD from receipts ....... app/store/grn.py:492-521 (vendor_deliveries); 6-dimension scorecard app/vendor_intel.py _build_components
//     risk register, 6 signals  app/risk_register.py seed_project (missing spec, milestone, expedite, over budget, single source, approval)
//     approvals recorded ...... app/approvals.py:275-291 (pending, or auto_approved for a head)
//     90-day long lead ........ app/planning.py:37
//     60/40 TBE blend ......... app/tbe.py:282, 348-355
//     $50k / 1.10x / single ... app/approvals.py:49-50, 244-308
//     7 Incoterms ............. app/schemas.py:389

const MONO = "font:600 8.5px/1.2 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase";
const A = '#EA580C';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 32-unit glyphs, after src/components/Glyph.astro. Both put
// the accent in a fill, so they take no accent stroke width.
const GLYPH = {
  // A filed record with its reference tab struck through the margin. The tag
  // is the accent because the number, not the letter, is what survives.
  nexusref: () => `<rect x="3" y="9" width="6.5" height="4" fill="${A}" stroke="none"></rect><rect x="9.5" y="4" width="19.5" height="24"></rect><line x1="13.5" y1="14" x2="25" y2="14"></line><line x1="13.5" y1="19" x2="25" y2="19"></line><line x1="13.5" y1="24" x2="21" y2="24"></line>`,
  // Four stages ascending at 45 degrees — BOM, vendor selection, purchase
  // order, monitoring. The last is solid: monitoring is where an order is
  // watched until the site receipt closes it. (Glyph.astro draws three.)
  tower: () => `<rect x="3" y="23.5" width="4.5" height="4.5"></rect><line x1="7.5" y1="23.5" x2="10" y2="21"></line><rect x="10" y="16.5" width="4.5" height="4.5"></rect><line x1="14.5" y1="16.5" x2="17" y2="14"></line><rect x="17" y="9.5" width="4.5" height="4.5"></rect><line x1="21.5" y1="9.5" x2="24" y2="7"></line><rect x="24" y="2.5" width="4.5" height="4.5" fill="${A}" stroke="none"></rect>`,
};

const acc = `stroke="${A}" stroke-width="2"`;
const ICON = {
  // Precedence: the first branch that matches decides where it lands.
  route: `<line x1="2" y1="12" x2="7" y2="12"></line><path d="M7 12 V5 H14"></path><line x1="7" y1="12" x2="14" y2="12"></line><path d="M7 12 V19 H14"></path><rect x="14" y="3" width="8" height="4" fill="${A}" stroke="none"></rect><rect x="14" y="10" width="8" height="4"></rect><rect x="14" y="17" width="8" height="4"></rect>`,
  // A reference tag; the accent is the version, which moves on revision.
  tag: `<path d="M2 5.5 H15.5 L22 12 L15.5 18.5 H2 Z"></path><line x1="5.5" y1="12" x2="10" y2="12"></line><rect x="12.5" y="9" width="3" height="6" fill="${A}" stroke="none"></rect>`,
  // A message claimed once: the tick is the ledger entry.
  mail: `<rect x="2.5" y="4.5" width="14" height="11"></rect><path d="M2.5 4.5 L9.5 10.5 L16.5 4.5"></path><path d="M13.5 18.5 L16 21 L21.5 15" ${acc}></path>`,
  // A document going out on a link that runs down.
  share: `<rect x="3" y="3" width="10" height="14"></rect><line x1="8" y1="10" x2="21" y2="10"></line><path d="M18 7 L21 10 L18 13"></path><line x1="3" y1="21" x2="9" y2="21" ${acc}></line><line x1="11.5" y1="21" x2="13" y2="21"></line>`,
  // A scorecard: dimensions as bars against the line a vendor must clear.
  score: `<line x1="4" y1="3" x2="4" y2="21"></line><line x1="4" y1="6" x2="18" y2="6"></line><line x1="4" y1="10" x2="13" y2="10"></line><line x1="4" y1="14" x2="20" y2="14"></line><line x1="4" y1="18" x2="9" y2="18"></line><line x1="15" y1="3" x2="15" y2="21" ${acc}></line>`,
  // A risk raised: a 45-degree diamond carrying the mark.
  risk: `<path d="M12 2 L22 12 L12 22 L2 12 Z"></path><path d="M12 7 V13.5 M12 16 V17.5" ${acc}></path>`,
  // A shipment on its stage track, works to site; the accent is where it is now.
  track: `<line x1="2" y1="18" x2="22" y2="18"></line><path d="M2 14.5 V21.5 M8.7 15.5 V20.5 M15.3 15.5 V20.5 M22 14.5 V21.5"></path><line x1="12" y1="10" x2="12" y2="18"></line><rect x="8.5" y="3" width="7" height="7" fill="${A}" stroke="none"></rect>`,
  // A crate received and checked: the tick is the match to the order.
  crate: `<rect x="2" y="5" width="20" height="4"></rect><rect x="3.5" y="9" width="17" height="11"></rect><path d="M8.5 14.5 L11 17 L16 12" ${acc}></path>`,
};

const PRODUCTS = [
  {
    n: '06', page: '09', slug: 'nexusref', name: 'NexusRef', abbr: 'NexusRef', code: 'NexusRef // The record', short: 'Project correspondence',
    tag: 'Every letter has a number.',
    desc: 'A correspondence register for large projects. Inbound mail is filed to a project and folder, given a formal sequenced reference and logged; when the case for where it belongs is thin, it is flagged for a person.',
    input: 'Inbound mail', decision: 'Filing', stopAt: 2, stopRule: '<0.4 → triage',
    gates: [['Route', 'rule › sender › content'], ['Validate', 'tenant ids only'], ['Confidence', 'scored per letter']],
    outcomes: ['Filed', 'Triage'],
    guard: 'Model routes only when no party matched',
    stops: [
      ['FILE', 'Filing and routing', 'Rule, then sender; the model picks a folder only if no party matched.', 'rule › sender', 'route'],
      ['REF', 'Reference numbering', 'Sequenced per project, type and year; a revision bumps the version.', '-NNNN-vN', 'tag'],
      ['SYNC', 'Mailbox sync', 'Microsoft 365 mail is claimed in a ledger, so a repeat files once.', 'files once', 'mail'],
      ['SHARE', 'Share links', 'Expiring, revocable, password-hashed links for outside parties.', '3 counters', 'share'],
    ],
    proof: [
      ['0.4', 'Triage floor', 'Below it, a letter is flagged for review rather than filed as certain.'],
      ['359', 'Tests', 'Including a 32-test suite that holds each tenant and project to its own records.'],
    ],
    reads: 'Transmittals · RFIs and technical queries · NCRs and inspection requests · Variations and claims · Drawings and submittals · Microsoft 365 / Entra ID',
  },
  {
    n: '07', page: '10', slug: 'tower', name: 'Supply Chain Control Tower', abbr: 'Control Tower', code: 'Control Tower // Procurement', short: 'Procurement to site receipt',
    tag: 'Traced from spec to site receipt.',
    desc: 'A procurement cockpit for manufacturers and capital projects. Every line runs from the bill of materials through vendor selection and the purchase order to monitoring: quotes are ranked, high-risk orders go through approval, and open orders are watched for slip.',
    input: 'Bill of materials', decision: 'Expediting', stopAt: 1, stopRule: '≥ $50k → approval',
    gates: [['Vendor selection', 'RFQ · 60/40 TBE'], ['Purchase order', 'drafted from award'], ['Monitoring', 'slip scored by rule']],
    outcomes: ['Watch', 'Nudge', 'Escalate'],
    guard: 'Every approval decision recorded',
    stops: [
      ['OTD', 'Supplier performance', 'OTD measured from actual receipts; every vendor scored on six weighted dimensions.', '6 dimensions', 'score'],
      ['RISK', 'Risk register', 'Raised from live signals — late milestones, over-budget lines, single sources.', '6 live signals', 'risk'],
      ['EXPEDITE', 'Expediting and logistics', 'Orders scored for slip get drafted follow-ups; shipments tracked works to site.', '8 stages', 'track'],
      ['GRN', 'Goods receipt', 'Site receipts against the challan, matched to the PO without a model.', 'auto ≥ 0.85', 'crate'],
    ],
    proof: [
      ['0.85', 'Auto-match threshold', 'Only a clear winner with matching units and quantity posts without review.'],
      ['0', 'Model calls in the matcher', 'Vendor, code, description, quantity and unit are scored by fixed weights.'],
    ],
    reads: 'Seven Incoterms · GRN and delivery challan · Technical bid evaluation · OTD and quality PPM · Free-issue vs contractor material',
  },
];

const svg = (view, sw, body) => `<svg sc-camel-view-box="0 0 ${view} ${view}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="square" stroke-linejoin="miter" style="display:block;width:100%;height:100%" aria-hidden="true">${body}</svg>`;
const label = (t, c, extra = '') => `<span style="white-space:nowrap;${MONO};color:${c}${extra}">${t}</span>`;
const cross = (s) => `<span aria-hidden="true" style="position:absolute;${s};width:11px;height:11px;background:linear-gradient(#A1A1AA,#A1A1AA) center/100% 1px no-repeat,linear-gradient(#A1A1AA,#A1A1AA) center/1px 100% no-repeat"></span>`;
const pips = (active, total) => `<span aria-hidden="true" style="display:flex;gap:3px;margin-bottom:1px">${Array.from({ length: total }, (_, i) => i === active ? `<span style="display:block;width:7px;height:7px;background:${A}"></span>` : '<span style="display:block;width:7px;height:7px;box-shadow:inset 0 0 0 1px #A1A1AA"></span>').join('')}</span>`;
const B = "font-size:13.5px;font-weight:700;line-height:1.2;letter-spacing:-.015em;color:#18181B";
const xbox = '<span aria-hidden="true" style="position:relative;display:block;flex:0 0 auto;width:9px;height:9px;box-shadow:inset 0 0 0 1.5px #18181B"><span style="position:absolute;left:3.75px;top:1px;width:1.5px;height:7px;background:#18181B;transform:rotate(45deg)"></span><span style="position:absolute;left:3.75px;top:1px;width:1.5px;height:7px;background:#18181B;transform:rotate(-45deg)"></span></span>';
const MARKS = ['background:#18181B', 'box-shadow:inset 0 0 0 1.5px #18181B;background:linear-gradient(90deg,#18181B 50%,transparent 50%)', 'box-shadow:inset 0 0 0 1.5px #18181B'];

function outcomes(list) {
  let s = `<span style="grid-row:2 / 4;grid-column:5;position:relative;display:block;height:${list.length === 2 ? 43 : 64}px">
          <span aria-hidden="true" style="position:absolute;left:1px;top:4px;width:15px;height:15px;transform:rotate(45deg);background:${A}"></span>
          <span aria-hidden="true" style="position:absolute;left:16px;top:11px;width:12px;height:2px;background:#18181B"></span>
          <span aria-hidden="true" style="position:absolute;left:26px;top:11px;width:2px;height:${(list.length - 1) * 21 + 2}px;background:#18181B"></span>`;
  list.forEach((t, i) => {
    const top = 4 + i * 21;
    s += `\n          <span aria-hidden="true" style="position:absolute;left:26px;top:${top + 7}px;width:10px;height:2px;background:#18181B"></span>`;
    s += `\n          <span style="position:absolute;left:42px;right:0;top:${top}px;display:flex;align-items:center;gap:8px;height:16px"><span style="display:block;flex:0 0 auto;width:10px;height:10px;${MARKS[Math.min(i, 2)]}"></span><span style="white-space:nowrap;${B}">${esc(t)}</span></span>`;
  });
  return s + '\n        </span>';
}

// `opts` renumbers and re-margins the page for another edition of the brochure
// (v3 drops OneLegal, so these become systems 05 and 06 of six, with a binding
// margin). The defaults are this site's twelve-page edition.
function page(p, pat, opts = {}) {
  const { systems = 7, sheets = 12, left = '13mm' } = opts;
  p = { ...p, ...(opts.n ? { n: opts.n } : {}), ...(opts.page ? { page: opts.page } : {}) };
  const idx = +p.n - 1;
  const gateHead = (i) => label(`Gate ${i + 1}`, i === 2 ? '#18181B' : '#5C5C66');
  const dia = (i) => `<span aria-hidden="true" style="position:relative;display:block"><span style="position:absolute;left:3px;top:5px;width:14px;height:14px;transform:rotate(45deg);background:${i === 2 ? '#18181B' : '#FAFAFA'};box-shadow:inset 0 0 0 2px #18181B"></span></span>`;
  const gate = ([t, m], i) => `<span style="display:flex;flex-direction:column;gap:4px;padding-right:12px;min-width:0"><span style="${B}">${esc(t)}</span><span style="font:500 10px/1.3 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.01em;color:#52525B">${esc(m)}</span>${i === p.stopAt ? `<span style="display:flex;align-items:center;gap:6px;white-space:nowrap;font:600 9.5px/1.3 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.01em;color:#18181B">${xbox}${esc(p.stopRule)}</span>` : ''}</span>`;
  const stop = ([k, t, d, m, icon], i) => `
    <div style="display:flex;flex-direction:column;background:#FFFFFF;padding:13px 15px">
      <span style="display:flex;justify-content:space-between;gap:10px">${label(k, A)}${label('A' + (i + 1), '#A1A1AA')}</span>
      <b style="display:block;margin-top:10px;font-size:14px;font-weight:700;line-height:1.25;letter-spacing:-.02em">${esc(t)}</b>
      <span style="display:block;margin-top:5px;font-size:12px;line-height:1.45;color:#3F3F46">${esc(d)}</span>
      <span style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-top:auto;padding-top:14px"><span style="position:relative;display:block;flex:0 0 auto;width:40px;height:40px;color:#3F3F46"><span style="position:absolute;inset:0">${svg(24, 1.6, ICON[icon])}</span></span><span style="text-align:right;font:600 10px/1.35 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.03em;color:#C2410C">${esc(m)}</span></span>
    </div>`;
  const proof = ([v, l, d], i) => {
    const c = i === 0 ? '#1D4ED8' : '#0E7490';
    return `<div style="min-width:0"><span style="display:block;font:800 40px/1 Archivo,system-ui,sans-serif;font-stretch:115%;letter-spacing:-.045em;color:#18181B">${esc(v)}</span><span style="display:block;width:48px;height:3px;margin-top:11px;background:${c}"></span><span style="display:block;margin-top:9px"><span style="display:block;font:600 8.5px/1.35 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:${c}">${esc(l)}</span></span><span style="display:block;margin-top:6px;font-size:12px;line-height:1.45;color:#3F3F46;text-wrap:pretty">${esc(d)}</span></div>`;
  };
  const plateLabel = (pos, t, c) => `<span style="position:absolute;${pos}">${label(t, c).replace('font:600 8.5px', 'font:600 7.5px')}</span>`;

  return `<section class="page" data-screen-label="${p.page} ${esc(p.name)}" style="position:relative;isolation:isolate;display:flex;flex-direction:column;background:#FAFAFA;color:#18181B;padding:11mm 13mm 9mm${left === '13mm' ? '' : ' ' + left};font-family:Archivo,system-ui,sans-serif;font-size:15px;line-height:1.5;letter-spacing:-.005em;overflow:hidden">
  ${cross('top:4mm;left:4mm')}${cross('top:4mm;right:4mm')}${cross('bottom:4mm;left:4mm')}${cross('bottom:4mm;right:4mm')}
  <sc-if value="{{ showGrid }}" hint-placeholder-val="{{ false }}"><span aria-hidden="true" style="position:absolute;z-index:-1;top:11mm;bottom:9mm;left:${left};right:13mm;background:repeating-linear-gradient(90deg,rgba(24,24,27,.05) 0 1px,transparent 1px calc(100% / 12));box-shadow:inset -1px 0 0 rgba(24,24,27,.05)"></span></sc-if>
  <div style="display:flex;align-items:flex-end;gap:16px;padding-bottom:8px;border-bottom:2px solid #18181B">
    <span style="font:800 14px/1 Archivo,system-ui,sans-serif;font-stretch:125%;letter-spacing:-.04em;color:#18181B">denormal</span>
    ${label(esc(p.code), A)}
    <span aria-hidden="true" style="display:block;flex:1 1 auto;min-width:40px;height:9px;margin-bottom:-8px"><svg width="100%" height="9" style="display:block;overflow:visible"><defs><pattern id="rm${pat}" width="6" height="9" sc-camel-pattern-units="userSpaceOnUse"><rect x="0" y="5" width="1" height="4" fill="#A1A1AA"></rect></pattern><pattern id="rM${pat}" width="48" height="9" sc-camel-pattern-units="userSpaceOnUse"><rect x="0" y="0" width="1" height="9" fill="#18181B"></rect></pattern></defs><rect width="100%" height="9" fill="url(#rm${pat})"></rect><rect width="100%" height="9" fill="url(#rM${pat})"></rect></svg></span>
    ${pips(idx, systems)}${label(`System ${p.n} of ${String(systems).padStart(2, '0')}`, '#5C5C66')}
  </div>
  <div style="display:grid;grid-template-columns:minmax(0,1fr) 256px;gap:36px;margin-top:22px">
    <div style="display:flex;flex-direction:column;min-width:0">
      <div style="display:flex;align-items:flex-start;gap:18px">
        <span style="flex:0 0 auto;font:800 60px/.8 Archivo,system-ui,sans-serif;font-stretch:125%;letter-spacing:-.06em;color:${A}">${p.n}</span>
        <div style="flex:1 1 auto;min-width:0">
          <h2 style="margin:0;font:800 36px/1 Archivo,system-ui,sans-serif;font-stretch:110%;letter-spacing:-.035em;color:#18181B;text-wrap:balance">${esc(p.name)}</h2>
          <p style="margin:9px 0 0;font:700 18px/1.25 Archivo,system-ui,sans-serif;letter-spacing:-.02em;color:${A}">${esc(p.tag)}</p>
        </div>
      </div>
      <p style="margin:16px 0 0;max-width:68ch;font-size:14.5px;line-height:1.55;color:#3F3F46;text-wrap:pretty">${esc(p.desc)}</p>
      <span aria-hidden="true" style="display:block;flex:1 0 20px"></span>
      <div style="position:relative;display:grid;grid-template-columns:88px repeat(3,minmax(0,1fr)) 176px;grid-template-rows:11px 24px auto 16px;row-gap:8px;padding-top:12px">
        <span aria-hidden="true" style="position:absolute;left:9px;right:168px;top:42px;height:2px;background:#18181B"></span>
        ${label('In', '#1D4ED8')}
        ${gateHead(0)}
        ${gateHead(1)}
        ${gateHead(2)}
        <span style="display:flex;gap:8px">${label('Decision', A)}${label(esc(p.decision), '#5C5C66')}</span>
        <span aria-hidden="true" style="position:relative;display:block"><span style="position:absolute;left:0;top:1px;width:18px;height:22px;background:#FFFFFF;box-shadow:inset 0 0 0 2px #18181B,inset 0 5px 0 0 #1D4ED8"></span></span>
        ${dia(0)}
        ${dia(1)}
        ${dia(2)}
        ${outcomes(p.outcomes)}
        <b style="display:block;padding-right:10px;${B}">${esc(p.input)}</b>
        ${p.gates.map(gate).join('\n        ')}
        <span aria-hidden="true" style="grid-column:2 / 5;position:relative;display:block;margin-right:12px"><span style="position:absolute;left:0;right:0;top:7px;height:2px;background:#15803D"></span><span style="position:absolute;left:0;top:3px;width:2px;height:10px;background:#15803D"></span><span style="position:absolute;right:0;top:3px;width:2px;height:10px;background:#15803D"></span><span style="position:absolute;left:14px;top:2px;padding:0 8px;background:#FAFAFA">${label('Guardrail · ' + esc(p.guard), '#15803D')}</span></span>
      </div>
    </div>
    <div style="position:relative;flex:0 0 auto;width:256px;height:256px;background:#FFFFFF;box-shadow:inset 0 0 0 1px #C6C6CD;color:#27272A">
      <span aria-hidden="true" style="position:absolute;left:127.5px;top:12px;bottom:12px;width:1px;background:#D8D8DE"></span>
      <span aria-hidden="true" style="position:absolute;top:127.5px;left:12px;right:12px;height:1px;background:#D8D8DE"></span>
      <span aria-hidden="true" style="position:absolute;inset:32px;background:linear-gradient(90deg,#E6E6EA 1px,transparent 1px) 0 0/24px 24px,linear-gradient(#E6E6EA 1px,transparent 1px) 0 0/24px 24px;box-shadow:inset 0 0 0 1px #C6C6CD"></span>
      <span aria-hidden="true" style="position:absolute;left:32px;right:32px;top:25px;height:4px;background:repeating-linear-gradient(90deg,#8B8B95 0 1px,transparent 1px 6px)"></span>
      <span aria-hidden="true" style="position:absolute;top:32px;bottom:32px;left:25px;width:4px;background:repeating-linear-gradient(180deg,#8B8B95 0 1px,transparent 1px 6px)"></span>
      <span style="position:absolute;inset:32px">${svg(32, 1.1, GLYPH[p.slug]())}</span>
      ${plateLabel('top:10px;left:32px', 'G.' + p.n, A)}
      ${plateLabel('top:10px;right:14px', '32 × 32 u', '#5C5C66')}
      ${plateLabel('bottom:11px;left:32px', esc(p.abbr), '#18181B')}
      ${plateLabel('bottom:11px;right:14px', '1 u = 6', '#5C5C66')}
    </div>
  </div>
  <div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-top:auto;padding-top:22px">${label('What it does', '#18181B')}${label('Four stops, end to end', '#5C5C66')}</div>
  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;margin-top:9px;background:#C6C6CD;border-top:1px solid #C6C6CD;border-bottom:1px solid #C6C6CD">${p.stops.map(stop).join('')}
  </div>
  <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.6fr);gap:30px;margin-top:20px">
    ${p.proof.map(proof).join('\n    ')}
    <div style="min-width:0;display:flex;flex-direction:column;border-top:2px solid #18181B">
      <div style="display:grid;grid-template-columns:84px minmax(0,1fr);gap:12px;padding:9px 0;border-bottom:1px solid #D8D8DE">${label('Reads against', '#5C5C66')}<span style="font:500 10px/1.55 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.01em;color:#27272A">${esc(p.reads)}</span></div>
    </div>
  </div>
  <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-top:auto;padding-top:12px">${label(esc(p.abbr), '#52525B')}<span style="display:flex;align-items:baseline;gap:7px"><span style="font:700 17px/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:-.02em;color:#18181B">${p.page}</span>${label('/ ' + sheets, '#5C5C66')}</span></div>
</section>
`;
}

// Takes one match of `re` in `html` (exactly `count` expected) and hands it to
// `fn`; fails the build loudly if the export has moved.
function one(html, re, fn, what, count = 1) {
  const hits = html.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')) || [];
  if (hits.length !== count) throw new Error(`brochure: expected ${count} × ${what}, found ${hits.length}`);
  return html.replace(re, fn);
}

export function addProductPages(html) {
  // Cover and contents: clone Labour Compliance's entry and re-point it.
  const reglyph = (s, p) => s.replace(/(<svg[^>]*>)[\s\S]*?(<\/svg>)/, (m, open, close) => open + GLYPH[p.slug]() + close);

  html = one(html, /<div style="display:flex;flex-direction:column;background:#FAFAFA;padding:13px 14px 2px 14px">\s*<span[^\n]*Sys\.05[\s\S]*?<\/div>/, (card) => card + PRODUCTS.map((p) =>
    '\n    ' + reglyph(card, p).replace('Sys.05', 'Sys.' + p.n).replace('p. 08', 'p. ' + p.page)
      .replace('>Labour Compliance<', '>' + esc(p.name) + '<').replace('>Contract labour month-close<', '>' + esc(p.short) + '<')).join(''), 'cover card');
  html = one(html, /(display:grid;grid-template-columns:)repeat\(5,(minmax\(0,1fr\)\);gap:1px;margin-top:auto)/, '$1repeat(7,$2', 'cover grid');

  html = one(html, /<div style="display:grid;grid-template-columns:58px 44px auto[^"]*">\s*<span[^>]*>05<\/span>[\s\S]*?<\/div>/, (row) => row + PRODUCTS.map((p) =>
    '\n      ' + reglyph(row, p).replace('>05</span>', '>' + p.n + '</span>').replace(/>08<\/span>(\s*<\/div>)$/, '>' + p.page + '</span>$1')
      .replace('>Labour Compliance<', '>' + esc(p.name) + '<').replace('>Contract labour month-close<', '>' + esc(p.short) + '<')).join(''), 'contents row');

  // Contents leaders: a 1px repeating gradient, which Chrome drops from the PDF
  // on rows that land on a fractional pixel (OneLegal and Labour already lost
  // theirs). A dashed SVG line prints as a vector on every row.
  html = one(html, /<span aria-hidden="true" style="display:block;height:1px;align-self:center;background:repeating-linear-gradient\(90deg,#A1A1AA 0 1px,transparent 1px 4px\)"><\/span>/g,
    '<span aria-hidden="true" style="display:block;height:1px;align-self:center"><svg width="100%" height="1" style="display:block;overflow:visible"><line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="#A1A1AA" stroke-width="1" stroke-dasharray="1 3"></line></svg></span>', 'contents leaders', 7);

  html = one(html, /Five systems · shipped capability only/, 'Seven systems · shipped capability only', 'cover tagline');
  html = one(html, /Five systems · ten pages/, 'Seven systems · twelve pages', 'contents tagline');
  html = one(html, /(<span[^>]*>)09(<\/span><span[^>]*>Deployment, and what it depends on)/, '$111$2', 'contents deployment');
  html = one(html, /(<span[^>]*>)10(<\/span><span[^>]*>Start with one document)/, '$112$2', 'contents next step');

  // Every product page: seven pips and "of 07".
  html = one(html, /<span aria-hidden="true" style="display:flex;gap:3px;margin-bottom:1px">((?:<span style="display:block;width:7px;height:7px;[^"]*"><\/span>){5})<\/span>/g, (m, inner) => {
    const active = inner.split('</span>').findIndex((s) => s.includes('background:#EA580C'));
    return pips(active, 7);
  }, 'page pips', 5);
  html = one(html, /System (0[1-5]) of 05/g, 'System $1 of 07', 'system counter', 5);

  // Folios: 10 pages become 12; Deployment and Next step move to 11 and 12.
  html = one(html, /\/ 10</g, '/ 12<', 'folio total', 9);
  html = one(html, /(font:700 17px\/1 'JetBrains Mono'[^>]*>)(09|10)(<\/span>)/g, (m, a, n, b) => a + (n === '09' ? '11' : '12') + b, 'back-matter folio', 2);
  html = one(html, /data-screen-label="09 Deployment"/, 'data-screen-label="11 Deployment"', 'deployment label');
  html = one(html, /data-screen-label="10 Next step"/, 'data-screen-label="12 Next step"', 'next step label');

  html = one(html, /six months of near-miss reports, or a month of ECR and muster dumps\./, 'six months of near-miss reports, a month of ECR and muster dumps, a month of project correspondence, or a set of delivery challans.', 'next step artifacts');

  // The two pages go in after Labour Compliance, before Deployment.
  html = one(html, /<section class="page" data-screen-label="11 Deployment"/, (m) => PRODUCTS.map((p, i) => page(p, 10 + i)).join('') + m, 'deployment page');
  return html;
}

// The two pages on their own, as plain HTML: the canvas runtime's attribute
// spellings become real SVG attributes and the grid toggle is dropped, so the
// file opens and prints without the export's runtime.
export function standalonePages() {
  const body = PRODUCTS.map((p, i) => page(p, 10 + i)).join('')
    .replace(/sc-camel-view-box=/g, 'viewBox=').replace(/sc-camel-pattern-units=/g, 'patternUnits=')
    .replace(/<sc-if [^>]*>[\s\S]*?<\/sc-if>/g, '');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Denormal — NexusRef and Supply Chain Control Tower</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=JetBrains+Mono:wght@400..700&display=swap" rel="stylesheet">
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body { margin: 0; background: #E4E4E7; -webkit-font-smoothing: antialiased; }
  section.page { width: 297mm; height: 210mm; margin: 24px auto; box-shadow: 0 1px 0 #C6C6CD, 0 24px 48px -32px rgba(24,24,27,.45); }
  b, h2, p { font-family: inherit; }
  @media print {
    body { background: none; }
    section.page { margin: 0; box-shadow: none; break-after: page; }
    * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  }
</style>
</head>
<body>
${body}</body>
</html>
`;
}

// For editing other brochure editions in place.
export { PRODUCTS, GLYPH, page as renderPage };
