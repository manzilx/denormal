export type ProductSlug =
  | 'power-contract-intelligence'
  | 'sentinel'
  | 'control-tower'
  | 'quality-ai'
  | 'peaklogic'
  | 'nexusref'
  | 'onelegal'
  | 'foretell'
  | 'sachiv'
  | 'atelier';

export interface Capability {
  code: string;
  title: string;
  body: string;
}

export interface PipelineStage {
  number: string;
  title: string;
  body: string;
  stats: [string, string][];
}

export interface ProofMetric {
  value: string;
  label: string;
  body: string;
  accent: 'cyan' | 'orange' | 'green' | 'blue';
}

export interface Product {
  slug: ProductSlug;
  featured: boolean;
  index: string;
  name: string;
  eyebrow: string;
  tagline: string;
  brief: string;
  console: { input: string; output: string; status: string };
  cardStat: [string, string];
  capabilities: Capability[];
  stages: PipelineStage[];
  stack: string[];
  standards: string[];
  proofs: ProofMetric[];
}

// Order is the narrative the home page tells, and the number each product
// carries is its position in it. Reorder this array and the cards, console
// rows, detail pages and about page all renumber together.
const productEntries: Omit<Product, 'index'>[] = [
  {
    slug: 'power-contract-intelligence', featured: true, name: 'Power Contract Intelligence', eyebrow: 'PCI // PRE-AWARD',
    tagline: 'Cited to what it was shown.',
    brief: 'A pre-award tender workspace for power-sector supply and services bids. The tender pack goes in; risks, deviations, pre-bid queries and a clause map come out, and three review gates carry it to a go/no-go and a submission workbook.',
    console: { input: 'Tender pack', output: 'risks \u2192 go/no-go', status: 'SHOWN-CHUNKS ONLY' },
    cardStat: ['13', 'queries every pack is read against'],
    capabilities: [
      { code: '01 // INGEST', title: 'The whole pack, or none of it', body: 'Ten document formats parse per-file, so one unreadable appendix cannot sink a batch. A completeness ledger records what parsed, what was empty and what was truncated.' },
      { code: '02 // RETRIEVE', title: 'Thirteen fixed tender questions', body: 'Every pack is read against the same domain queries \u2014 penalties, warranty, local content, change in law, termination \u2014 so no tender is analysed ad hoc.' },
      { code: '03 // GROUND', title: 'Citations that resolve only to what was shown', body: 'The citation index is built from the chunks actually sent to the model, and reviewer-facing quotes are clamped to what grounded the finding.' },
      { code: '04 // GATE', title: 'Three reviewed gates to a decision', body: 'Qualification and go/no-go, then bid strategy and general-conditions review, then risk, compliance and submission \u2014 each answered by a reviewer, not inferred.' },
      { code: '05 // ISSUE', title: 'A workbook a committee can read', body: 'Deviation register, risk register, pre-bid queries, pricing assumptions and the gate records export as a multi-sheet workbook and a print pack.' }
    ],
    stages: [
      { number: '01', title: 'Parse', body: 'The tender pack becomes text with a ledger of exactly what did and did not make it in.', stats: [['FORMATS', '10 supported'], ['SILENT LOSS', 'designed out']] },
      { number: '02', title: 'Retrieve', body: 'Chunks are ranked against thirteen fixed tender questions, on-device by default.', stats: [['QUERIES', '13 fixed'], ['EMBEDDINGS', 'local by default']] },
      { number: '03', title: 'Propose', body: 'The model writes risks, deviations and positions, and must cite the chunks it was given.', stats: [['MODEL', 'content only'], ['NUMBERS', 'never']] },
      { number: '04', title: 'Verify', body: 'Coverage claims are re-checked against the full source by literal match before a reviewer sees them.', stats: [['CHECK', 'substring'], ['NOT', 'embeddings']] }
    ],
    stack: ['React 19 / Express 5', 'SQLite or PostgreSQL', 'DeepSeek, optional', 'On-device lexical embeddings', 'ExcelJS export', 'Runs with no API key'],
    standards: ['General and special conditions', 'Bill of quantities', 'Service-level schedules', 'Local content requirements', 'Change in law', 'Pre-award scope only'],
    proofs: [
      { value: '13', label: 'Fixed tender queries', body: 'Every pack is read against the same domain questions, so coverage does not depend on who ran it.', accent: 'cyan' },
      { value: '247', label: 'Tests', body: 'Covering grounding, provenance, ownership and corrupt-payload handling.', accent: 'blue' }
    ]
  },
  {
    slug: 'onelegal', featured: true, name: 'OneLegal', eyebrow: 'ONELEGAL // CLAIMS',
    tagline: 'Evidence you can seal.',
    brief: 'A contract-and-litigation workbench for in-house counsel and commercial claims teams. Counsel curates and cryptographically seals an evidence set before governed drafting can run over it.',
    console: { input: 'Sealed evidence', output: 'governed drafting', status: 'SEAL VERIFIED' },
    cardStat: ['~300', 'playbook questions across 11 families'],
    capabilities: [
      { code: '01 // PLAYBOOK', title: 'Contract question coverage', body: 'Eleven contract families provide roughly 300 canonical questions across FIDIC, IChemE, Orgalime, NTPC and common commercial forms.' },
      { code: '02 // RETRIEVE', title: 'Four-pass hybrid retrieval', body: 'HyDE, raw question history, BM25 clause matching and reference-graph expansion fuse before cross-encoder reranking and anchor injection.' },
      { code: '03 // VERIFY', title: 'Citation and number guards', body: 'Every citation resolves to retrieved evidence; numerical claims, caps and silent answers pass dedicated verification.' },
      { code: '04 // SEAL', title: 'Governed litigation drafting', body: 'Evidence discover, curate, seal and verify form an append-only hashed audit chain with approval gates and jurisdiction packs.' },
      { code: '05 // OPERATE', title: 'Matter-scoped workbench', body: 'Contract compare, practice profiles, counterparty intelligence, exports and per-feature model routing stay isolated by matter.' }
    ],
    stages: [
      { number: '01', title: 'Discover', body: 'A contract set is ingested into an isolated matter and mapped against the playbook.', stats: [['FAMILIES', '11'], ['QUESTIONS', '~300']] },
      { number: '02', title: 'Curate', body: 'Counsel reviews the risk matrix, citations and cross-clause evidence before freezing the set.', stats: [['VERDICTS', '5 buckets'], ['RETRIEVAL', '4 passes']] },
      { number: '03', title: 'Seal', body: 'A cryptographic manifest freezes the evidence IDs used for downstream drafting.', stats: [['EDIT', 'HTTP 409'], ['CHAIN', 'append-only']] },
      { number: '04', title: 'Draft', body: 'Notices, EOT claims and Statements of Claim can only draw from the sealed evidence.', stats: [['EXPORT', 'PDF / DOCX'], ['JURISDICTION', 'India + E&W']] }
    ],
    stack: ['FastAPI / Python 3.12', 'Next.js 14', 'ChromaDB per matter', 'BM25 + Voyage reranker', 'Provider-routed LLM', 'LM Studio local default'],
    standards: ['FIDIC Red / Silver', 'IChemE Red / Green / Burgundy', 'Orgalime SE 01 / S 2012 / SI 14 / SC 18', 'NTPC GCC', 'England & Wales CPR', 'India jurisdiction pack'],
    proofs: [{ value: '64:1', label: 'Retrieval burial ratio', body: 'A 10-chunk contract is evaluated inside a 630-chunk FIDIC Silver Book.', accent: 'green' }, { value: '445', label: 'Test functions', body: 'The workbench’s verification surface spans 32 files.', accent: 'blue' }]
  },
  {
    slug: 'peaklogic', featured: true, name: 'Peak Logic', eyebrow: 'PEAK LOGIC // CONTROLS',
    tagline: 'Float you can defend.',
    brief: 'A CPM scheduling and forensic delay-analysis platform for planners and claims consultants on complex projects. It grades a P6 schedule before producing a defensible net extension-of-time entitlement.',
    console: { input: 'XER', output: 'graded → net EOT', status: 'PARITY LOCKED' },
    cardStat: ['518', 'activities in the reference project'],
    capabilities: [
      { code: '01 // IMPORT', title: 'Dependency-free schedule intake', body: 'A hand-written XER parser imports P6 schedules, while XLSX and CSV paths support adjacent workflows.' },
      { code: '02 // CPM', title: 'P6-aware critical path engine', body: 'Forward/backward pass, float, calendars, constraints, positive and negative lag, and parallel paths are calculated in working days.' },
      { code: '03 // TIA', title: 'Iterative SCL Protocol analysis', body: 'Delay events apply one at a time against the current schedule, producing a cumulative waterfall and net EOT with Malmaison attribution.' },
      { code: '04 // GATE', title: 'Schedule quality before claims', body: 'Twelve EPC-retuned issue codes and A–F scoring block TIA until the schedule passes or an audited override is recorded.' },
      { code: '05 // PARITY', title: 'Three implementations, one answer', body: 'Postgres, in-memory and client preview CPM implementations stay aligned through hand-calculated golden fixtures.' }
    ],
    stages: [
      { number: '01', title: 'Import', body: 'The XER becomes a validated activity and dependency network with calendars and constraints.', stats: [['REFERENCE', '518 activities'], ['DEPENDENCIES', '672']] },
      { number: '02', title: 'Grade', body: 'Schedule quality issues and proportional severity are computed before any claim analysis.', stats: [['ISSUES', '12 codes'], ['BUDGET', '10 ms / 5,000']] },
      { number: '03', title: 'Analyze', body: 'Each delay event receives a fresh CPM pass in an iterative SCL Protocol TIA.', stats: [['RULE', 'Malmaison'], ['OUTPUT', 'net EOT']] },
      { number: '04', title: 'Prove', body: 'Waterfalls, attribution, baselines and parity fixtures expose how the number was produced.', stats: [['BASELINES', '3'], ['CASE', '1 × 660 MW']] }
    ],
    stack: ['pnpm + Turborepo', 'Next.js 15.5 / React 19', 'NestJS 11 / Fastify', 'Python 3.12 compute engine', 'PostgreSQL 16 + Prisma', 'Redis 7 + BullMQ + Railway'],
    standards: ['P6 XER constraints', 'SCL Protocol TIA', 'Malmaison concurrency', 'CPM / calendars / float', 'DCMA-14 inspired quality gate', 'Append-only AuditLog'],
    proofs: [{ value: '10ms', label: 'Quality budget', body: 'The schedule-quality pass targets 5,000 activities on the import critical path.', accent: 'cyan' }, { value: '672', label: 'Reference dependencies', body: 'The flagship seeded power-plant project is a real imported XER case.', accent: 'blue' }]
  },
  {
    slug: 'sentinel', featured: true, name: 'Sentinel', eyebrow: 'SENTINEL // EHS',
    tagline: 'Safety intelligence that refuses to guess.',
    brief: 'A mobile-first EHS platform for plants and construction sites. It turns hazard evidence into cited countermeasures, with a hard refusal path when the source base is not strong enough.',
    console: { input: 'Hazard capture', output: 'cited countermeasure', status: '30/100 FLOOR' },
    cardStat: ['2,833', 'RAG chunks across 3 authorities'],
    capabilities: [
      { code: '01 // CAPTURE', title: 'Evidence-first hazard capture', body: 'Photo or video keyframes become a hazard class, drafted report, checklist, reasoning trace and audit row.' },
      { code: '02 // GROUND', title: 'Hybrid safety retrieval', body: 'BM25 and dense Chroma retrieval fuse through RRF and reranking, returning grounding, coverage and a citation chain.' },
      { code: '03 // PERMIT', title: 'Permit-to-work photo audits', body: 'Five shipped permit types use five photo-verifiable controls each, with OSHA/NFPA citations and PASS, FAIL or UNCERTAIN outcomes.' },
      { code: '04 // RISK', title: 'POWRA risk assessments', body: 'Five activity templates provide AI advice, while any HIGH residual hazard forces a server-recomputed stop outcome.' },
      { code: '05 // SIGNAL', title: 'Operational safety analytics', body: 'Hotspots, repeats, leading indicators, subcontractor breakdown and near-miss health roll up into the safety dashboard.' }
    ],
    stages: [
      { number: '01', title: 'Capture', body: 'A worker records the point-of-work evidence from the mobile client.', stats: [['CLIENT', 'iOS + web'], ['MODE', 'offline queue']] },
      { number: '02', title: 'Ground', body: 'The retrieval layer finds authoritative countermeasures and measures source coverage.', stats: [['CORPUS', '3 authorities'], ['FLOOR', '30 / 100']] },
      { number: '03', title: 'Advise', body: 'Models classify and draft; deterministic policy recomputes high-risk outcomes.', stats: [['PERMITS', '5 types'], ['POWRA', '5 templates']] },
      { number: '04', title: 'Prove', body: 'The final report, citation chain and capture session remain auditable.', stats: [['VIDEOS', '178 OSHA'], ['TRAIL', 'tamper-evident']] }
    ],
    stack: ['FastAPI / Python 3.12', 'SQLite, tenant-scoped', 'ChromaDB + rank_bm25', 'Gemini with local fallback', 'Voyage embeddings + reranker', 'Fly.io Mumbai + Cloudflare R2'],
    standards: ['OSHA 29 CFR 1910 / 1926', 'HSE UK ACOPs and HSG', 'NFPA 51 / 51B / 70E / 652 / 10', 'NIOSH', 'OSH Code 2020 §22', 'Lean 8 wastes / PDCA'],
    proofs: [{ value: '30/100', label: 'Grounding floor', body: 'Below it, Sentinel returns “insufficient sources” instead of synthesising an answer.', accent: 'orange' }, { value: '21', label: 'Hazard taxonomy', body: 'The shipped hazard and waste taxonomy anchors classification and reporting.', accent: 'cyan' }]
  },
  {
    slug: 'quality-ai', featured: true, name: 'Quality AI', eyebrow: 'QUALITY AI // QUALITY ASSURANCE',
    tagline: 'The model reads. The engine decides.',
    brief: 'Document-grounded quality control for manufacturing and project work packages. Three requirement sources become one governing requirement and an enforced ITP path to NCR closure.',
    console: { input: '3 specifications', output: '1 governing requirement', status: '409 ON BYPASS' },
    cardStat: ['99', 'API routes'],
    capabilities: [
      { code: '01 // RECONCILE', title: 'Deterministic requirement governance', body: 'Cited atomisation is classified into six flags, then a deterministic precedence rule picks the governing requirement.' },
      { code: '02 // ENFORCE', title: 'ITP hold-point gating', body: 'Heuristic and specification-directed ITP generators produce H/W/R/S interventions; skip-ahead is rejected with HTTP 409.' },
      { code: '03 // RECTIFY', title: 'Evidence-gated NCR closure', body: 'Failed inspections create NCRs, route concessions by source, enforce repair limits and require a passed re-inspection.' },
      { code: '04 // GOLDEN THREAD', title: 'Audited downstream impact', body: 'Revision diff, supersede, verification matrices, TQs, PDI, MDCC and four-sheet audit exports preserve provenance.' }
    ],
    stages: [
      { number: '01', title: 'Atomise', body: 'Ingestion turns client specs, standards and codes into individually testable requirements.', stats: [['SOURCES', '6 showcase docs'], ['CITATION', 'clause + span']] },
      { number: '02', title: 'Constrain', body: 'The model output is schema-checked and re-checked against its supplied context.', stats: [['FLAGS', '6 exact'], ['CONSTRUCTOR', 'citation required']] },
      { number: '03', title: 'Decide', body: 'Rust precedence, hold-point gating and the NCR state machine execute deterministically.', stats: [['CORE', 'Rust 2021'], ['BYPASS', 'HTTP 409']] },
      { number: '04', title: 'Prove', body: 'Append-only Postgres audit triggers and foreign-key evidence make state change inspectable.', stats: [['AUDIT', 'same transaction'], ['DB', '18 migrations']] }
    ],
    stack: ['Rust 2021 / axum / sqlx', 'PostgreSQL', 'Python FastAPI ingestion', 'Next.js 15 / React 19', 'DeepSeek at temperature 0.0', 'Railway, four services'],
    standards: ['ASME IX / B31.3', 'EN 13445 / 12952 / 10204 / 265', 'ISO 15614', 'API / NACE / IBR', 'ITP / NCR / TQ / CAPA', 'PDI / MDCC / COPQ'],
    proofs: [{ value: '0', label: 'LLM decisions on load-bearing paths', body: 'The model reads, classifies and drafts; deterministic Rust makes the decisions.', accent: 'cyan' }, { value: '149', label: 'Counted test functions', body: 'The supplied verification count includes 100 Rust tests and 49 Python tests.', accent: 'blue' }]
  },
  {
    slug: 'control-tower', featured: false, name: 'Control Tower', eyebrow: 'CONTROL TOWER // PROCUREMENT',
    tagline: 'Traced from spec to site receipt.',
    brief: 'A procurement and supply-chain cockpit for manufacturers and complex capital projects. It carries a line from the bill of materials through sourcing and award to the goods receipt recorded at the site store, and keeps the whole path auditable.',
    console: { input: 'Delivery challan', output: 'matched receipt \u2192 stock ledger', status: 'AUTO \u2265 0.85' },
    cardStat: ['13', 'stages traced, BOM to delivery'],
    capabilities: [
      { code: '01 // PLAN', title: 'Bill of materials as the spine', body: 'Every line carries a lifecycle state from missing specification through requisitioned and ordered to delivered, with long-lead items flagged.' },
      { code: '02 // SOURCE', title: 'Requisition to purchase order', body: 'Requisition, RFQ, quote comparison and weighted technical bid evaluation produce a combined rank that drives the award and drafts the order.' },
      { code: '03 // RECEIVE', title: 'Goods receipt at the site store', body: 'A device-enrolled field API captures receipts against the delivery challan, matched to open orders by a scored matcher that contains no model at all.' },
      { code: '04 // GOVERN', title: 'Approval gates on high-risk writes', body: 'Large orders, single-source awards and over-budget quotes freeze their payload behind an approval, which the committer later replays verbatim.' },
      { code: '05 // TRACE', title: 'Audit chain and reconciliation', body: 'Site and ERP receipt channels accumulate separately and stay independently auditable, under entity tracing, pivots and export.' }
    ],
    stages: [
      { number: '01', title: 'Plan', body: 'The bill of materials and procurement plan establish what the project owes itself, and by when.', stats: [['STATES', '5 per line'], ['LONG LEAD', '\u2265 365 days']] },
      { number: '02', title: 'Source', body: 'Sourcing runs to an award that is scored, not asserted, with delivery terms carried as a first-class field.', stats: [['INCOTERMS', '7 supported'], ['EVALUATION', 'weighted TBE']] },
      { number: '03', title: 'Receive', body: 'Receipts sync from the site idempotently, so a replay is a no-op and a conflict returns the server watermark.', stats: [['AUTO-MATCH', '0.85'], ['OVER-RECEIPT', '1.05 headroom']] },
      { number: '04', title: 'Prove', body: 'Confirmation commits durably first, then applies effects, with a startup sweep that repairs any crash in between.', stats: [['CHAIN', '13 stages'], ['LEDGER', 'append-only']] }
    ],
    stack: ['FastAPI / Python', 'Next.js 14 / React 18', 'SQLite in WAL for the store ledger', 'Snapshotted in-memory domain state', 'DeepSeek tool-calling, no retrieval layer', 'Docker + Caddy, or Fly.io'],
    standards: ['Incoterms EXW \u2192 DDP', 'GRN and delivery challan', 'Technical bid evaluation', 'On-time delivery and quality PPM', 'Free-issue vs contractor material', 'UOM canonicalisation'],
    proofs: [
      { value: '0.85', label: 'Auto-match threshold', body: 'The receipt matcher is deterministic by design and contains no model; extraction is the only stage that calls one.', accent: 'orange' },
      { value: '13', label: 'Traced stages', body: 'The audit chain runs from bill-of-materials line to delivery, with entity tracing and export.', accent: 'cyan' }
    ]
  },
  {
    slug: 'nexusref', featured: false, name: 'NexusRef', eyebrow: 'NEXUSREF // THE RECORD',
    tagline: 'Every letter has a number.',
    brief: 'A correspondence and document repository for large projects. Every letter, transmittal, query, order and drawing is filed against a project and folder, given a formal sequenced reference, routed through approvals, and logged.',
    console: { input: 'Inbound mail', output: 'filed \u2192 referenced', status: 'SENDER WINS' },
    cardStat: ['0.4', 'confidence floor before triage'],
    capabilities: [
      { code: '01 // FILE', title: 'Deterministic-first routing', body: 'A matched sender always decides the destination, because the address is the routing key. The model is only consulted when no party matched.' },
      { code: '02 // REFERENCE', title: 'A sequence that cannot drift', body: 'Formal references are issued from the highest existing sequence across every reference-bearing table, with versioned bumps on revision.' },
      { code: '03 // INGEST', title: 'Mailbox sync that repeats safely', body: 'Microsoft 365 polling and change webhooks reconcile through an idempotent runner, so a redelivered message files once.' },
      { code: '04 // SHARE', title: 'Counterparties without accounts', body: 'Expiring, revocable share links with hashed passwords scope a single folder, and count every view, download and upload.' },
      { code: '05 // ANSWER', title: 'Questions against the record', body: 'Retrieval is a lexical ranker with inverse-document-frequency weighting \u2014 inspectable and reproducible, with recency as a boost that never substitutes for a match.' }
    ],
    stages: [
      { number: '01', title: 'Receive', body: 'Mail arrives from a synced mailbox or an inbound webhook with a verified signature.', stats: [['SOURCE', 'M365 + webhook'], ['REPLAY', 'idempotent']] },
      { number: '02', title: 'Route', body: 'The sender decides where it belongs; the model only fills what identity could not.', stats: [['KEY', 'the address'], ['MODEL', 'fallback only']] },
      { number: '03', title: 'Validate', body: 'Any model answer is re-checked against that tenant\u2019s own project and folder ids.', stats: [['SCOPE', 'tenant ids'], ['BELOW 0.4', 'triage']] },
      { number: '04', title: 'Log', body: 'The reference is issued, approvals route, and the audit trail records who did what.', stats: [['REFERENCE', 'sequenced'], ['TRAIL', 'persisted']] }
    ],
    stack: ['TypeScript monorepo', 'Next.js 15 / React 19', 'Prisma + PostgreSQL', 'Microsoft Entra ID', 'S3 or local disk', 'Deterministic twin for every AI surface'],
    standards: ['Formal reference numbering', 'Transmittals and queries', 'Approval workflows', 'Document control', 'External collaboration', 'Audit trail'],
    proofs: [
      { value: '0.4', label: 'Confidence floor', body: 'Below it, mail goes to triage rather than being filed in the wrong place.', accent: 'orange' },
      { value: '321', label: 'Tests', body: 'Including a dedicated cross-tenant scope suite.', accent: 'green' }
    ]
  },
  {
    slug: 'foretell', featured: false, name: 'Foretell', eyebrow: 'FORETELL // CASH',
    tagline: 'The model never touches a number.',
    brief: 'A cash-collection forecasting and latest-estimate review workbench for project-finance controllers. An invoice register and a baseline go in; probabilistic collection forecasts, cash at risk and shortfall probability come out.',
    console: { input: 'Invoice register', output: 'P10 \u2192 P50 \u2192 P90', status: 'SEEDED \u00b7 REPRODUCIBLE' },
    cardStat: ['10,000', 'simulation floor to publish'],
    capabilities: [
      { code: '01 // IMPORT', title: 'A register, as it actually arrives', body: 'Header detection and fuzzy column mapping across eight required and nineteen optional fields, with locale-aware numbers and day-first dates, and a per-row issue list.' },
      { code: '02 // FORECAST', title: 'Survival analysis, not a guess', body: 'Kaplan\u2013Meier on observed payment delays with censoring, pooled across portfolio, business, purpose, project and customer, then calibrated and given conformal intervals.' },
      { code: '03 // GOVERN', title: 'A review cycle with a memory', body: 'Baselines freeze, rebaselining demands a reason and an effective date, and a same-date correction becomes a new numbered revision rather than an edit.' },
      { code: '04 // EVIDENCE', title: 'Findings that cite a row', body: 'Uploaded files are split into locator-tagged segments, so an extracted blocker points at a sheet and row or a line of a document.' },
      { code: '05 // PROVE', title: 'Model health you can check', body: 'A strictly prequential backtest scores each invoice using only what was known before its cutoff, and reports calibration and interval coverage.' }
    ],
    stages: [
      { number: '01', title: 'Import', body: 'The register and plan are parsed, mapped and fingerprinted.', stats: [['FIELDS', '8 required'], ['FINGERPRINT', 'per dataset']] },
      { number: '02', title: 'Forecast', body: 'Delay distributions are pooled, calibrated and sampled with correlated shocks.', stats: [['METHOD', 'Kaplan\u2013Meier'], ['SEED', 'fixed']] },
      { number: '03', title: 'Review', body: 'A latest estimate is published against a frozen baseline, with a reason on every revision.', stats: [['PUBLISH', '10,000 sims'], ['INTERACTIVE', '180']] },
      { number: '04', title: 'Prove', body: 'The server recomputes the fingerprint on publish and refuses a mismatch.', stats: [['MISMATCH', 'HTTP 409'], ['BACKTEST', 'prequential']] }
    ],
    stack: ['TypeScript / Next.js 16', 'Drizzle on Cloudflare D1', 'R2 object storage', 'DeepSeek, optional', 'Deterministic forecast engine', 'Works with no API key'],
    standards: ['Latest estimate discipline', 'Baseline and rebaseline', 'Cash at risk', 'P10 / P50 / P90', 'Prequential backtesting', 'Versioned review register'],
    proofs: [
      { value: '10,000', label: 'Simulations to publish', body: 'A published forecast runs a hard floor; the interactive view uses 180 and says so.', accent: 'blue' },
      { value: '409', label: 'On a fingerprint mismatch', body: 'The register cannot show what it was not computed from, so publish refuses rather than warns.', accent: 'orange' }
    ]
  },
  {
    slug: 'sachiv', featured: false, name: 'Sachiv', eyebrow: 'SACHIV // STATUTORY',
    tagline: 'Every due date carries its section.',
    brief: 'Corporate secretarial compliance under the Indian Companies Act, 2013, built for a Company Secretary rather than a generic compliance team. It computes what each company owes the Registrar, when, and what it costs if it slips \u2014 and cites the provision behind every line.',
    console: { input: 'Company file', output: 'obligations \u2192 exposure', status: 'PROVISION CITED' },
    cardStat: ['~150', 'Companies Act sections cited'],
    capabilities: [
      { code: '01 // CALENDAR', title: 'Statutory calendar with stated basis', body: 'Annual and event-driven filings across 27 e-forms, where each due date reports whether it runs from the actual general meeting or the last permissible one.' },
      { code: '02 // EVENTS', title: 'Events that start a clock', body: 'Twenty-two recordable events raise their own filings \u2014 a director appointed, a charge created, a special resolution passed.' },
      { code: '03 // APPLICABILITY', title: 'What the company is caught by', body: 'Ten statutory tests decide whether independent directors, a woman director, key managerial personnel, secretarial audit, CSR or a vigil mechanism apply.' },
      { code: '04 // EXPOSURE', title: 'Additional fee and penalty, computed apart', body: 'The additional-fee slabs and the adjudicated penalty are calculated and reported separately, with company and officer figures kept distinct.' },
      { code: '05 // PLAYBOOK', title: 'Practitioner playbooks and drafting', body: 'Nineteen playbooks carry prerequisites, steps, attachments, signatories and common mistakes; six document types draft from deterministic templates.' }
    ],
    stages: [
      { number: '01', title: 'Compute', body: 'A pure statutory engine derives every date, fee and applicability conclusion with no model involved.', stats: [['ENGINE', '6,058 lines'], ['MODEL', 'not imported']] },
      { number: '02', title: 'Cite', body: 'Each obligation carries its provision and instrument, and the basis line that explains the date.', stats: [['SECTIONS', '~150'], ['FORMS', '27']] },
      { number: '03', title: 'Rank', body: 'Guidance orders what the engine already computed; it never computes a date or a rupee itself.', stats: [['REGISTERS', '16'], ['PENALTY RULES', '23']] },
      { number: '04', title: 'Draft', body: 'Notices, resolutions and minutes complete from templates, so a broken model call still yields a whole document.', stats: [['DRAFT TYPES', '6'], ['OFFLINE', 'zero keys']] }
    ],
    stack: ['Next.js 15.5 / React 19', 'Embedded SQLite, no separate backend', 'Zod validation', 'Vitest, typecheck and build in CI', 'DeepSeek, optional', 'Runs fully without an API key'],
    standards: ['Companies Act, 2013', 'Section 403 additional-fee slabs', '27 ROC e-forms', '16 statutory registers', 'Charge ladder, s.77 to s.87', 'Company and officer penalties'],
    proofs: [
      { value: '198', label: 'Statutory engine tests', body: 'The date, fee, penalty and applicability logic is covered by its own suite, run in CI on every push.', accent: 'green' },
      { value: '0', label: 'Figures the model produces', body: 'Every number is computed deterministically and passed to the model as context; it explains and drafts, never recomputes.', accent: 'blue' }
    ]
  },
  {
    slug: 'atelier', featured: false, name: 'AtelierOS', eyebrow: 'ATELIEROS // PRODUCTION',
    tagline: 'Images inspire. Specs ship.',
    brief: 'A design-to-production operating system for independent fashion labels. The sketch stays the ground truth as a structured garment record moves through renders, revisions and a factory tech pack.',
    console: { input: 'Sketch', output: 'spec → tech pack', status: 'ISOLATION 1.0' },
    cardStat: ['1.0', 'cross-brand memory isolation'],
    capabilities: [
      { code: '01 // SKETCH', title: 'Sketch-first design loop', body: 'An iPad and Apple Pencil canvas grounds vision extraction while moodboards remain style-only references.' },
      { code: '02 // REFINE', title: 'Decoupled refine-by-chat', body: 'Image editing and spec rewriting run concurrently, so a flaky reasoning call cannot discard a good image edit.' },
      { code: '03 // SPEC', title: 'Production-ready garment records', body: 'Technical flats, graded POM tolerances, BOM consumption and itemised costing carry a style toward production.' },
      { code: '04 // EXPORT', title: 'Factory and buyer outputs', body: 'Tech packs, line sheets and range plans preserve the structured record through delivery.' },
      { code: '05 // MEMORY', title: 'Brand-scoped memory', body: 'Hybrid retrieval learns brand DNA, winning silhouettes, rejected directions, fabrics and palettes without cross-brand leakage.' }
    ],
    stages: [
      { number: '01', title: 'Sketch', body: 'The drawn silhouette becomes the input image and the ground truth of the design.', stats: [['CLIENT', 'iPad / web / Android'], ['MODE', 'sketch-first']] },
      { number: '02', title: 'Render', body: 'Vision extraction and image generation stay grounded in the brand’s taught materials and DNA.', stats: [['IMAGE', 'separate lane'], ['MEMORY', 'brand scoped']] },
      { number: '03', title: 'Specify', body: 'Chat revisions update a versioned garment record, colorways and production measurements.', stats: [['POM', 'toleranced'], ['LIFECYCLE', '4 states']] },
      { number: '04', title: 'Ship', body: 'The record exports to factory, buyer and range-planning documents.', stats: [['EXPORTS', '3 families'], ['OFFLINE', 'zero keys']] }
    ],
    stack: ['FastAPI / Python 3.14', 'SQLite + content-addressed blobs', 'Per-task model routing', 'Hybrid RAG with hashing embedder', 'SwiftUI / Next.js / Kotlin Compose', 'launchd service on one Mac'],
    standards: ['Concept → development → sampled → production', 'Graded POM tolerances', 'BOM and fabric consumption', 'FOB → wholesale → retail', 'Indian bridal namespace', 'Factory tech pack PDF'],
    proofs: [{ value: '1.0', label: 'Cross-brand memory isolation', body: 'The offline evaluation has a stop-the-line gate below exactly 1.0.', accent: 'blue' }, { value: '85–90%', label: 'Paid image-call reduction', body: 'The sketch-first pivot removes most paid generations for a kept design.', accent: 'orange' }]
  }
];

export const sharedStages: PipelineStage[] = [
  { number: '01', title: 'Ground', body: 'Start from the source record: a photo, contract set, specification, schedule or sketch.', stats: [['INPUT', 'evidence'], ['RULE', 'cite it']] },
  { number: '02', title: 'Constrain', body: 'Put the model inside a structured contract with schemas, thresholds, provenance and refusal paths.', stats: [['MODEL', 'on a leash'], ['STATE', 'guarded']] },
  { number: '03', title: 'Decide', body: 'Let deterministic engines, precedence rules and state machines make the load-bearing decisions.', stats: [['CORE', 'deterministic'], ['BYPASS', 'blocked']] },
  { number: '04', title: 'Prove', body: 'Return the answer with its evidence, audit row, version, citation or parity fixture attached.', stats: [['OUTPUT', 'inspectable'], ['TRAIL', 'append-only']] }
];

export const portfolioMetrics: ProofMetric[] = [
  { value: '0', label: 'LLM decisions on any load-bearing path', body: 'Precedence, hold-point gating and the NCR state machine in Quality AI are deterministic Rust.', accent: 'cyan' },
  { value: '30/100', label: 'Grounding floor', body: 'Below it Sentinel returns “insufficient sources” instead of an answer.', accent: 'orange' },
  { value: '64:1', label: 'Retrieval burial ratio', body: 'OneLegal evaluates a 10-chunk contract inside a 630-chunk FIDIC Silver Book.', accent: 'green' },
  { value: '1.0', label: 'Cross-brand memory isolation', body: 'AtelierOS holds it at exactly 1.0 with a stop-the-line gate below that value.', accent: 'blue' },
  { value: '10ms', label: 'Budget to grade 5,000 activities', body: 'Peak Logic’s quality pass gates every delay analysis on the import critical path.', accent: 'cyan' },
  { value: '0.85', label: 'Receipt auto-match threshold', body: 'Control Tower matches goods receipts to open orders with a scored matcher that contains no model.', accent: 'orange' },
  { value: '~150', label: 'Companies Act sections cited', body: 'Sachiv states the provision and the basis behind every due date it computes.', accent: 'green' },
  { value: '13', label: 'Fixed tender queries', body: 'Power Contract Intelligence reads every pack against the same domain questions rather than ad hoc.', accent: 'blue' },
  { value: '10,000', label: 'Simulations behind a published forecast', body: 'Foretell seeds them, so the same register reproduces the same number.', accent: 'cyan' },
  { value: '0.4', label: 'Confidence floor before triage', body: 'NexusRef would rather queue a letter for a human than file it in the wrong project.', accent: 'orange' }
];

export const products: Product[] = productEntries.map((entry, i) => ({
  ...entry,
  index: String(i + 1).padStart(2, '0')
}));

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

// Counted test functions, per product, from each repo's own suite. Kept as an
// explicit table so the console figure stays auditable rather than asserted.
// Products whose suites are counted by file rather than by function are 0 here,
// which is why the headline is stated as a floor ("+") and never as a total.
export const testFunctionCounts: Partial<Record<ProductSlug, number>> = {
  onelegal: 445,
  atelier: 521,
  sachiv: 198,
  'quality-ai': 149,
  'control-tower': 77,
  'power-contract-intelligence': 247,
  nexusref: 321,
  foretell: 111
};

const countedTests = Object.values(testFunctionCounts).reduce((a, b) => a + b, 0);
export const testSurface = `${(Math.floor(countedTests / 100) * 100).toLocaleString('en-US')}+`;

export const productCount = products.length;
export const productCountWord = NUMBER_WORDS[productCount] ?? String(productCount);
export const productCountPadded = String(productCount).padStart(2, '0');

// The home page leads with a focused set; the full body of work lives on
// /portfolio/. Order above puts the featured five first, so their numbers stay
// contiguous on the home page and the rest continue from 06 on the portfolio.
export const featuredProducts = products.filter((p) => p.featured);
export const featuredCount = featuredProducts.length;
export const featuredCountWord = NUMBER_WORDS[featuredCount] ?? String(featuredCount);
export const featuredCountPadded = String(featuredCount).padStart(2, '0');

// Counted the same way as testSurface, but over the featured set only, so the
// console figure describes what the page beside it is actually showing.
const featuredTests = featuredProducts.reduce((sum, p) => sum + (testFunctionCounts[p.slug] ?? 0), 0);
export const featuredTestSurface = `${(Math.floor(featuredTests / 100) * 100).toLocaleString('en-US')}+`;
export const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);
