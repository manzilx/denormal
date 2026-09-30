// Verified portfolio. Basis references are for maintainers, not rendered claims.
// NexusRef checked against ~/NexusRef on 2026-09-30; other product bases retained.
export const SYSTEMS = [
  {
    "slug": "pci",
    "n": "01",
    "name": "Power Contract Intelligence",
    "abbr": "PCI",
    "code": "PCI // Pre-award",
    "short": "Pre-award tender review",
    "line": "Reads a tender pack and returns every risk and deviation cited to the page it came from.",
    "lede": "A pre-award workspace for power-sector supply and services bids. The tender pack goes in; risks, deviations, pre-bid queries and a clause map come out, and three review stages carry it to a go/no-go and a submission workbook.",
    "input": "Tender pack",
    "decision": "Go / no-go",
    "outcomes": [
      "Bid",
      "Conditional bid",
      "No bid"
    ],
    "gates": [
      {
        "t": "Qualification",
        "m": "KYC and a /100 health score"
      },
      {
        "t": "Strategy",
        "m": "18 universal clauses plus type-specific ones"
      },
      {
        "t": "Compliance",
        "m": "every position cited or counted as a gap",
        "rule": true
      }
    ],
    "rule": {
      "short": "Unverified → gap",
      "long": "A clause the extraction cannot verify against the source is counted as a gap, never as compliant. Citations resolve only to the passages the model was actually shown."
    },
    "stops": [
      {
        "k": "Parse",
        "t": "The whole pack",
        "d": "Eleven document formats parsed per file, with a record of what parsed, what was empty, what failed and what was truncated."
      },
      {
        "k": "Review",
        "t": "Three review stages",
        "d": "Qualification and go/no-go, then bid strategy, then risk, compliance and submission, each answered by a reviewer."
      },
      {
        "k": "Grade",
        "t": "Six verdicts per position",
        "d": "Compliant, acceptable, deviation, silent, ambiguous or not assessed; silence is a finding."
      },
      {
        "k": "Issue",
        "t": "A workbook a committee can read",
        "d": "Deviation register, bid risk register, pre-bid queries and pricing assumptions export as one workbook."
      }
    ],
    "proof": [
      {
        "v": "9",
        "l": "Clause groups",
        "d": "Every pack is read against the same catalogue across six contract types, so coverage does not depend on who ran it.",
        "basis": "src/data/clauses/catalog.js:50-60; contractTypes.js:52-169"
      },
      {
        "v": "0",
        "l": "API keys required",
        "d": "Runs with on-device lexical retrieval and no model key; a language model is optional.",
        "basis": "config.js:3,17; llm.js:240; workspace.js:325-326"
      }
    ],
    "reads": [
      "General and special conditions",
      "Bill of quantities",
      "Service-level schedules",
      "Local content requirements",
      "Change in law",
      "Pre-award scope only"
    ],
    "boundary": "Runs entirely inside your perimeter with no API key. If a model is enabled, the provider and payload are named before deployment.",
    "basis": {
      "formats": "IngestionPanel.jsx:11; parser.js:239-263 (.pdf .doc .docx .txt .md .csv .xlsx .eml .json .rtf .html/.htm)",
      "verdicts": "R1QualificationGate.jsx:415",
      "health": "R1QualificationGate.jsx:431; workspace.js:158",
      "gap": "R3RiskComplianceGate.jsx:247-254",
      "shown": "llm.js:47-48,325; complianceReview.js:710",
      "sixVerdicts": "complianceReview.js:10",
      "completeness": "workspace.js:330-336",
      "core18": "src/data/clauses/core.js"
    }
  },
  {
    "slug": "sentinel",
    "n": "02",
    "name": "Sentinel",
    "abbr": "Sentinel",
    "code": "Sentinel // EHS",
    "short": "Site safety and permits",
    "line": "Turns a site photo into a cited countermeasure, and says so when the sources are too thin to answer.",
    "lede": "A mobile-first safety platform for plants and construction sites. A photograph becomes a classified hazard, a drafted report and a countermeasure cited to the safety literature; permits are audited from photos, and a risk assessment stops work when a high residual hazard remains.",
    "input": "Site photo",
    "decision": "Risk verdict",
    "outcomes": [
      "Safe",
      "Proceed with caution",
      "Stop"
    ],
    "gates": [
      {
        "t": "Classify",
        "m": "13 hazard and 8 waste types"
      },
      {
        "t": "Ground",
        "m": "answers only above 30/100",
        "rule": true
      },
      {
        "t": "Permit",
        "m": "5 photo-verifiable controls"
      }
    ],
    "rule": {
      "short": "< 30 → no answer",
      "long": "Below a grounding score of 30 out of 100, Sentinel returns the sources it found and does not generate an answer."
    },
    "stops": [
      {
        "k": "Capture",
        "t": "Photo or clip",
        "d": "A photo, or a safety clip sampled to five evenly spaced keyframes; the iOS app queues captures offline."
      },
      {
        "k": "Ground",
        "t": "Cited or silent",
        "d": "Dense and BM25 retrieval fused and reranked, with a grounding score, coverage and a citation chain."
      },
      {
        "k": "Permit",
        "t": "Permit-to-work photo audits",
        "d": "Five permit types, five controls each; a permit passes, fails or is conditional."
      },
      {
        "k": "Assess",
        "t": "Point-of-work risk assessment",
        "d": "Five activity templates; any hazard left at high residual risk forces a stop, recomputed on the server."
      }
    ],
    "proof": [
      {
        "v": "30/100",
        "l": "Grounding floor",
        "d": "Below it, Sentinel returns “insufficient sources” instead of an answer.",
        "basis": "api/app/config.py:39; rag.py:678-681; video_rag.py:951-954"
      },
      {
        "v": "21",
        "l": "Hazard and waste types",
        "d": "Thirteen hazard types and eight Lean waste types anchor classification and reporting.",
        "basis": "api/app/lean.py:3-35"
      }
    ],
    "reads": [
      "OSHA 29 CFR 1910 / 1926",
      "HSE UK ACOPs and HSG",
      "Lean Enterprise Institute",
      "Five permit types",
      "Lean 8 wastes"
    ],
    "boundary": "The hosted reference runs in the Mumbai region; every create, update and delete is written to an audit log.",
    "basis": {
      "permits": "permits.py:54,170,283,396,507,622,766",
      "powra": "powra.py:64-268,400-412,445; main.py:3609",
      "keyframes": "vision.py:51-52; config.py:41; main.py:2595-2596",
      "retrieval": "rag.py:333,371,400,442",
      "corpus": "api/data/chroma_safety: 2,833 chunks — OSHA 1,110, HSE 1,719, LEI 4 (no NFPA, NIOSH or OSH Code)",
      "offline": "ios/KaizenForge/OfflineQueue.swift",
      "audit": "audit.py:8-43 (append by convention, not tamper-evident)",
      "region": "api/fly.toml:7 (bom)"
    }
  },
  {
    "slug": "labour-compliance",
    "n": "03",
    "name": "Labour Compliance",
    "abbr": "Labour",
    "code": "Labour Compliance // Contract labour",
    "short": "Contract-labour month-close",
    "line": "Closes the contract-labour month with every reminder and notice waiting for a person to approve it.",
    "lede": "Supervised month-close for principal employers of contract labour. Contractors upload their monthly records through a single-use link; registers and checklists are drafted, wages and contributions are reconciled against the officer’s portal attestation, and nothing is applied until a person approves it.",
    "input": "Contractor records",
    "decision": "Approval",
    "outcomes": [
      "Approve",
      "Reject"
    ],
    "gates": [
      {
        "t": "Collect",
        "m": "single-use link per contractor and month"
      },
      {
        "t": "Reconcile",
        "m": "±2% on wages and contributions"
      },
      {
        "t": "Approve",
        "m": "agents can only propose",
        "rule": true
      }
    ],
    "rule": {
      "short": "Proposal → human decides",
      "long": "The agents can only queue proposals. Nothing is applied, and nothing is recorded as sent, until a person approves it; a decided proposal cannot be decided again."
    },
    "stops": [
      {
        "k": "Collect",
        "t": "Contractor records by link",
        "d": "A single-use link scoped to one contractor and one month; ECR, ESIC challan and wage register, and a phone photo is fine."
      },
      {
        "k": "Comply",
        "t": "Acts and the four Codes",
        "d": "The central Acts and the four Labour Codes with the 2026 Central Rules; Code items are screening prompts."
      },
      {
        "k": "Reconcile",
        "t": "Against the attestation",
        "d": "Wages and contributions within ±2%, headcount exact; a mismatch is flagged for decision."
      },
      {
        "k": "Decide",
        "t": "Keyboard-first inbox",
        "d": "Approve or reject each proposal; approvals write to a hash-sealed evidence vault."
      }
    ],
    "proof": [
      {
        "v": "0",
        "l": "Changes applied without approval",
        "d": "Agents queue proposals; only a person’s decision applies one.",
        "basis": "lib/agents/runner.ts:35; lib/agents/chat.ts:60; lib/proposals.ts:46-73"
      },
      {
        "v": "±2%",
        "l": "Reconciliation tolerance",
        "d": "On wages and contributions against the attestation; headcount must match exactly.",
        "basis": "lib/reconcile.ts:10-13,36-43"
      }
    ],
    "reads": [
      "Contract Labour (R&A) Act",
      "EPF & MP Act",
      "ESI Act",
      "Four Labour Codes and Central Rules 2026",
      "Oil Mines Regulations 2017, upstream sites"
    ],
    "boundary": "Contractor uploads are hashed and sealed on arrival; invite tokens are stored only as hashes.",
    "basis": {
      "invite": "lib/invites.ts:29-51; app/c/[token]/page.tsx; upload route 410 on expiry",
      "acts": "lib/applicability.ts:46-99; lib/corpus.ts:16",
      "calendar": "applicability.ts:56-57 (ECR/ESI day 15); Code obligations unscheduled, calendar.ts:84",
      "vault": "lib/vault/ingest.ts:26-45",
      "inbox": "components/InboxClient.tsx:25-39,65-66",
      "templates": "lib/forms.ts:22-43 (9 templates, all DRAFT / NOT LEGALLY VALIDATED)",
      "approver": "InboxClient.tsx:19 — approver identity is not authenticated yet"
    }
  },
  {
    "slug": "nexusref",
    "n": "04",
    "name": "NexusRef",
    "abbr": "NexusRef",
    "code": "NexusRef // Correspondence",
    "short": "Project correspondence",
    "line": "Connects project correspondence to its register, reference and revision.",
    "lede": "A project-correspondence workspace for incoming mail, letters and attachments. Configured routing and classification help put the record in the right project; formal references and revisions keep it identifiable, and uncertain classification is marked for review.",
    "input": "Project correspondence",
    "decision": "Review the filing",
    "outcomes": [
      "Registered",
      "Review needed"
    ],
    "gates": [
      {
        "t": "Route",
        "m": "configured rules, sender and content"
      },
      {
        "t": "Scope",
        "m": "project and folder IDs checked against the tenant"
      },
      {
        "t": "Confidence",
        "m": "classification below 0.4 marked for triage",
        "rule": true
      }
    ],
    "rule": {
      "short": "Uncertain → triage",
      "long": "Classification without a folder, or with confidence below 0.4, is marked for triage. That flag identifies uncertainty for review; it is not a blanket prohibition on automatic mailbox filing."
    },
    "stops": [
      {
        "k": "Collect",
        "t": "Mail and its attachments",
        "d": "Incoming correspondence is brought into a project register with the files that accompany it."
      },
      {
        "k": "Route",
        "t": "Rules before model suggestions",
        "d": "Configured routes, recognised senders and content help identify the project and folder. Model suggestions are checked against the available tenant records."
      },
      {
        "k": "Reference",
        "t": "A reference that carries its context",
        "d": "Tenant, project, correspondence type, year and sequence form the reference; a version suffix distinguishes revisions."
      },
      {
        "k": "Review",
        "t": "Uncertainty kept visible",
        "d": "Low-confidence classification is marked for triage so the team can review the filing context."
      }
    ],
    "proof": [
      {
        "v": "0.4",
        "l": "Classification triage floor",
        "d": "A missing folder or classification confidence below 0.4 is marked for review.",
        "basis": "packages/domain/src/index.ts:3132-3141; apps/web/lib/ai-runtime.ts:790 · checked 2026-09-30"
      },
      {
        "v": "vN",
        "l": "Revision suffix",
        "d": "Formal references carry the tenant, project, type, year, sequence and version.",
        "basis": "packages/domain/src/index.ts:1578-1583 · checked 2026-09-30"
      }
    ],
    "reads": [
      "Project mail and attachments",
      "Configured correspondence routes",
      "Tenant-scoped project and folder IDs",
      "Formal references and revisions"
    ],
    "boundary": "Mailbox access, storage and optional model providers are agreed for the deployment. Automatic administrative filing follows the configured workflow; issued positions and outgoing correspondence remain with your team.",
    "basis": {
      "reference": "packages/domain/src/index.ts:1578-1583 · checked 2026-09-30",
      "triage": "packages/domain/src/index.ts:3132-3141; apps/web/lib/ai-runtime.ts:790 · checked 2026-09-30",
      "scope": "apps/web/lib/ai-runtime.ts:698-715 · checked 2026-09-30",
      "filing": "apps/web/lib/mailbox-filing.ts:214-305 · checked 2026-09-30"
    }
  },
  {
    "slug": "onelegal",
    "n": "05",
    "name": "OneLegal",
    "abbr": "OneLegal",
    "code": "OneLegal // Claims",
    "short": "Contracts and claims",
    "line": "Drafts notices and claims only from an evidence set that counsel has sealed.",
    "lede": "A contract-and-claims workbench for in-house counsel and commercial claims teams. Contracts are read against a playbook; counsel curates and seals an evidence set, and governed drafting can only run over what is under the seal.",
    "input": "Contract set",
    "decision": "Remedy route",
    "outcomes": [
      "Notice",
      "Statement of Claim"
    ],
    "gates": [
      {
        "t": "Playbook",
        "m": "11 contract families · 301 questions"
      },
      {
        "t": "Risk matrix",
        "m": "each clause 1–5 against a market baseline"
      },
      {
        "t": "Seal",
        "m": "SHA-256 manifest before drafting",
        "rule": true
      }
    ],
    "rule": {
      "short": "Unsealed → no draft",
      "long": "Drafting refuses to run over an evidence set that has not been sealed, before any model is called. Once sealed, an edit is refused."
    },
    "stops": [
      {
        "k": "Playbook",
        "t": "Contract question coverage",
        "d": "EPC/FIDIC, IChemE, Orgalime, NTPC GCC and common commercial forms, 301 questions in all."
      },
      {
        "k": "Retrieve",
        "t": "Three-pass retrieval",
        "d": "Hypothetical-answer, context-aware and keyword passes fuse dense and BM25 results before reranking."
      },
      {
        "k": "Seal",
        "t": "An evidence set counsel signs off",
        "d": "A SHA-256 manifest freezes the evidence used for drafting."
      },
      {
        "k": "Draft",
        "t": "Notices and a Statement of Claim",
        "d": "EOT, delay, cost and variation notices, and a Statement of Claim, drawn only from sealed evidence."
      }
    ],
    "proof": [
      {
        "v": "301",
        "l": "Playbook questions",
        "d": "Across eleven contract families, each scored against its own market baseline.",
        "basis": "services/playbooks.py:67-426"
      },
      {
        "v": "6",
        "l": "Actions no automation may take",
        "d": "Filing, signing, serving, sending, deleting a record and confirming a deadline go to counsel by hand.",
        "basis": "litigation_boundary.py:45-52,236-281"
      }
    ],
    "reads": [
      "EPC / FIDIC Silver and Yellow baseline",
      "IChemE Red / Green / Burgundy",
      "Orgalime",
      "NTPC GCC",
      "England & Wales",
      "India jurisdiction pack"
    ],
    "boundary": "Model routing is per feature; which provider handles each feature is set with you and written down before deployment.",
    "basis": {
      "seal": "litigation_evidence.py:150-168; routes/litigation.py:1073-1079,1155-1159",
      "blocked": "llm_gateway.py:234-239; litigation_drafting.py:398-401; tests/test_litigation_drafting.py:307-315",
      "retrieval": "retrieval.py:847,867,874,691-702,1165-1175",
      "verdict": "summary_verdict.py:1-9,35 (GREEN/YELLOW/RED)",
      "jurisdictions": "litigation_jurisdiction.py:30",
      "notices": "routes/draft.py:3490,1673,2307; routes/vault.py:4739",
      "routing": "model_router.py:45,138-150 (defaults to xAI Grok; LM Studio optional)"
    }
  }
];
