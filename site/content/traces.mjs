// Illustrative synthetic inputs; mechanisms trace to systems.mjs.
export const TRACES = [
  {
    "slug": "pci",
    "abbr": "PCI",
    "name": "Power Contract Intelligence",
    "caption": "A substation supply tender pack.",
    "steps": [
      {
        "k": "In",
        "state": "solid",
        "d": "The pack is parsed file by file; one scanned appendix comes back empty and is recorded as empty, not skipped."
      },
      {
        "k": "Gate 1 · Qualification",
        "state": "solid",
        "d": "Due-diligence items scored and a health score set; the qualification stage is answered by a reviewer."
      },
      {
        "k": "Gate 2 · Strategy",
        "state": "solid",
        "d": "The liquidated-damages clause is rated against the universal set and a deviation is drafted with its citation."
      },
      {
        "k": "Gate 3 · Compliance",
        "state": "rule",
        "d": "The performance-guarantee clause cannot be verified against the source text, so it is counted as a gap, not as compliant."
      },
      {
        "k": "Decision",
        "state": "held",
        "d": "Conditional bid is on the table; the reviewer decides, and the gap becomes a pre-bid query."
      }
    ]
  },
  {
    "slug": "sentinel",
    "abbr": "Sentinel",
    "name": "Sentinel",
    "caption": "A site photograph of work at height.",
    "steps": [
      {
        "k": "In",
        "state": "solid",
        "d": "A photograph from the site app, queued offline and uploaded when the phone reconnects."
      },
      {
        "k": "Gate 1 · Classify",
        "state": "solid",
        "d": "Classified as a work-at-height hazard; a report and checklist are drafted."
      },
      {
        "k": "Gate 2 · Ground",
        "state": "rule",
        "d": "A follow-up question scores below 30 out of 100 on grounding, so the sources are shown and no answer is generated."
      },
      {
        "k": "Gate 3 · Permit",
        "state": "solid",
        "d": "The work-at-height permit is checked against its five photo-verifiable controls."
      },
      {
        "k": "Decision",
        "state": "held",
        "d": "Proceed with caution; the supervisor decides."
      }
    ]
  },
  {
    "slug": "labour-compliance",
    "abbr": "Labour",
    "name": "Labour Compliance",
    "caption": "One contractor’s records for one month.",
    "steps": [
      {
        "k": "In",
        "state": "solid",
        "d": "The contractor opens a single-use link and uploads the ECR, the ESIC challan and the wage register."
      },
      {
        "k": "Gate 1 · Collect",
        "state": "solid",
        "d": "Uploads are hashed and sealed on arrival; an unreadable scan goes to review, not into the records."
      },
      {
        "k": "Gate 2 · Reconcile",
        "state": "solid",
        "d": "Contributions differ from the attestation by more than 2%, so a mismatch is flagged."
      },
      {
        "k": "Gate 3 · Approve",
        "state": "rule",
        "d": "The agent queues a reminder to the contractor as a proposal. It cannot send or apply anything itself."
      },
      {
        "k": "Decision",
        "state": "held",
        "d": "The officer approves or rejects the proposal in the inbox."
      }
    ]
  },
  {
    "slug": "nexusref",
    "name": "NexusRef",
    "abbr": "NexusRef",
    "caption": "A project email with an attached letter.",
    "steps": [
      {
        "k": "In",
        "state": "solid",
        "d": "Incoming correspondence and its attachment are brought into the project workflow."
      },
      {
        "k": "Gate 1 · Route",
        "state": "solid",
        "d": "Configured routes, sender and content help identify the filing context."
      },
      {
        "k": "Gate 2 · Scope",
        "state": "solid",
        "d": "Suggested project and folder IDs are checked against the available tenant records."
      },
      {
        "k": "Gate 3 · Confidence",
        "state": "rule",
        "d": "No folder is identified and classification confidence is below 0.4, so the result is marked for triage."
      },
      {
        "k": "Decision",
        "state": "held",
        "d": "The project team reviews the uncertain classification and resolves the filing context."
      }
    ]
  },
  {
    "slug": "onelegal",
    "abbr": "OneLegal",
    "name": "OneLegal",
    "caption": "An EPC contract with particular conditions.",
    "steps": [
      {
        "k": "In",
        "state": "solid",
        "d": "The contract set is read against the EPC playbook questions, each answer cited to its clause."
      },
      {
        "k": "Gate 1 · Playbook",
        "state": "solid",
        "d": "The time-bar on extension notices is found and cited."
      },
      {
        "k": "Gate 2 · Risk matrix",
        "state": "solid",
        "d": "The delay-damages cap is scored against the market baseline for the family."
      },
      {
        "k": "Gate 3 · Seal",
        "state": "rule",
        "d": "The evidence set has not been sealed, so drafting refuses to run before any model is called."
      },
      {
        "k": "Decision",
        "state": "held",
        "d": "Counsel seals the set; the extension-of-time notice then drafts from sealed evidence only."
      }
    ]
  }
];
