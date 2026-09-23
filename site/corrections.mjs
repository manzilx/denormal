// Text corrections applied to the Claude Design exports at build time, as
// [find, replace, reason]. `find` is a string (every occurrence) or a RegExp.
// They run in order over every page, site and brochure alike; an entry that
// matches nothing on a page is simply skipped there.
//
// Each one corrects a claim the product's own code does not support, checked
// against the repositories on 2026-09-23. They live here rather than in the
// export so a fresh export from Claude Design cannot silently undo them —
// and BANNED below fails the build if a disproved claim reaches dist/ anyway.

export const CORRECTIONS = [
  // ── The headline mechanic ────────────────────────────────────────────────
  // Two of the five have no gate that halts work (PCI flags, Peak Logic rules
  // on entitlement), so "every one stops the line" is untrue. Every one does
  // carry one rule it will not bend, and a person decides what follows.
  ['>Five systems. Every one stops the line.<', '>Five systems. Every one has a line it won’t cross.<', 'headline'],
  ['One gate in every system is a hard stop.', 'One gate in every system carries a rule it will not bend.', 'headline standfirst'],
  ['· hard stop</span>', '· hard rule</span>', 'gate badge'],
  ['Hard stop · ', 'Hard rule · ', 'hero markup demo'],
  ["'Line stopped at gate ' + (s.stopAt + 1) + ', ' + g.t + ': ' + s.stopRule + '. Nothing downstream runs until a person clears it.'",
   "'Held at gate ' + (s.stopAt + 1) + ', ' + g.t + ': ' + s.stopRule + '. A person decides what happens next.'", 'status line'],

  // ── Power Contract Intelligence ─────────────────────────────────────────
  // R1/R2/R3 are tabs, not enforced transitions; nothing is held for a stamp.
  // An unverified citation is counted as a gap (R3RiskComplianceGate.jsx:254).
  ['no stamp → held', 'unverified → gap', 'PCI rule'],
  ['committee stamp', 'cited or gap', 'PCI gate 3'],
  // Contingency is computed from the risk register, not a fixed 8% (BidPricing.jsx:148).
  ['8% suggested', 'from risk register', 'PCI pricing'],
  // No 13-question taxonomy exists; nine R2 clause groups do (catalog.js:50-60).
  ['Fixed tender queries', 'Clause groups', 'PCI proof label'],
  ['Every pack is read against the same domain questions, so coverage does not depend on who ran it.',
   'Every pack is read against the same clause catalogue, across six contract types, so coverage does not depend on who ran it.', 'PCI proof body'],
  ["{v:'13',l:'Clause groups'", "{v:'9',l:'Clause groups'", 'PCI proof value (site)'],
  [/>13((?:\s|<[^>]+>)+)Clause groups</, '>9$1Clause groups<', 'PCI proof value (brochure)'],

  // ── Peak Logic ──────────────────────────────────────────────────────────
  // No blocking grade gate in the Python app or the TS monorepo. The rule it
  // does apply is entitlement: culpable delay earns no EOT (tia.py:468-501),
  // which happens in the waterfall — gate 2, not gate 1.
  ["stopAt:0, stopRule:'critical → blocked'", "stopAt:1, stopRule:'culpable → no EOT'", 'Peak Logic rule (site)'],
  ['critical → blocked', 'culpable → no EOT', 'Peak Logic rule (brochure)'],
  [/(A–F · 90\/75\/60\/40<\/span>)(<span style="display:flex;align-items:center;gap:6px;[^"]*"><span aria-hidden="true"[^>]*>(?:<span[^>]*><\/span>)*<\/span>culpable → no EOT<\/span>)(<\/span>\s*<span[^>]*><span[^>]*>Waterfall<\/span><span[^>]*>event-by-event CPM<\/span>)/,
   '$1$3$2', 'Peak Logic rule moves to gate 2 (brochure)'],
  // AuditLog is defined in the Prisma schema and never written; DCMA appears
  // only in a compiled build artefact. Both replaced with shipped capability.
  ['DCMA-14 inspired gate', 'Float thresholds', 'Peak Logic reads'],
  ['Append-only AuditLog', 'Monte Carlo P50 / P80 / P95', 'Peak Logic reads'],
  ["'DCMA-14',", "'Malmaison',", 'standards marquee'],
  // The AI page is conversational Q&A with what-if CPM, not schedule building
  // (pages/09_schedule_ai.py). No "planner approves" step exists.
  ['AI schedule building', 'Schedule AI', 'Peak Logic A1'],
  ['Scope and WBS drafted into a CPM network; the planner approves the logic.',
   'Ask the programme questions in plain language; what-if scenarios re-run CPM.', 'Peak Logic A1 body'],
  ['planner approves', 'what-if CPM', 'Peak Logic A1 tag'],
  ["{k:'Build',a:'A1',t:'Schedule AI'", "{k:'Ask',a:'A1',t:'Schedule AI'", 'Peak Logic A1 key (site)'],
  [/>BUILD(<\/span><span[^>]*>A1<\/span><\/span>\s*<b[^>]*>Schedule AI<)/, '>ASK$1', 'Peak Logic A1 key (brochure)'],
  // No 10ms / 5,000-activity quality pass in the source. The A–F grade is real
  // (narrative.py:270-280).
  ['Quality budget', 'Health grade', 'Peak Logic proof label'],
  ['The schedule-quality pass targets 5,000 activities on the import critical path.',
   'Bands at 90, 75, 60 and 40, so a weak baseline is visible to both sides before anything is claimed on it.', 'Peak Logic proof body'],
  ["{v:'10ms',l:'Health grade'", "{v:'A–F',l:'Health grade'", 'Peak Logic proof value (site)'],
  [/>10ms((?:\s|<[^>]+>)+)Health grade</, '>A–F$1Health grade<', 'Peak Logic proof value (brochure)'],

  // ── Sentinel ────────────────────────────────────────────────────────────
  // The OSH Code is in Labour Compliance's corpus, not Sentinel's. Sentinel
  // does ship five permit types (permits.py:52-508).
  ['OSH Code 2020 §22', 'Five permit types', 'Sentinel reads'],
  // 21 = 13 hazard types + 8 Lean waste types (lean.py:35). The body already
  // says so; the label said hazards only.
  ['Hazard taxonomy', 'Hazard and waste types', 'Sentinel proof label'],

  // ── Labour Compliance ───────────────────────────────────────────────────
  // No count of 29 Acts exists anywhere in the code.
  ['29 Acts · 4 Codes', 'Acts · 4 Codes', 'Labour gate 2'],
  ['Registers, returns and checklists; 29 Acts, 4 Codes.',
   'Registers, returns and checklists across the central Acts and the four Labour Codes.', 'Labour A2 body'],
  ["m:'29 + 4'", "m:'Acts + 4 Codes'", 'Labour A2 tag (site)'],
  ['>29 + 4<', '>Acts + 4 Codes<', 'Labour A2 tag (brochure)'],
];

// Claims shown to be false. If any of these reaches dist/, the build fails.
export const BANNED = [
  'stops the line', 'is a hard stop', 'hard stop<', 'Hard stop ·', 'Nothing downstream runs',
  'no stamp', 'committee stamp', 'Fixed tender queries', '8% suggested',
  'critical → blocked', 'DCMA-14 inspired', 'Append-only AuditLog', 'AI schedule building',
  'planner approves', 'Quality budget', 'OSH Code 2020 §22', 'Hazard taxonomy', '29 Acts', '29 + 4',
];
