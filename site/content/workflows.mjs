// Descriptions derived from the verified product mechanisms in systems.mjs.
export const WORKFLOWS = {
  "pci": {
    "area": "Tendering",
    "audience": "Bid teams · commercial teams",
    "headline": "See the risk before you bid.",
    "summary": "Bring the tender pack into one review. Find the contractual risks, prepare deviations and pre-bid queries, and give the bid team a clearer basis for its decision.",
    "challenge": "Conditions, schedules and appendices arrive as separate files. The difficult part is seeing which terms change the commercial position, what is missing and what needs a question before submission.",
    "input": "Tender documents, conditions and schedules",
    "delivers": [
      {
        "t": "A clause-level review",
        "d": "Risks and compliance positions linked to the source text, with silent and ambiguous terms identified."
      },
      {
        "t": "A submission workbook",
        "d": "A deviation register, bid risk register, pre-bid queries and pricing assumptions in one export."
      },
      {
        "t": "A basis for the bid decision",
        "d": "Qualification, strategy and compliance reviews for the people deciding whether and how to bid."
      }
    ],
    "flow": [
      "Bring in the tender pack",
      "Review qualification and terms",
      "Prepare deviations and queries",
      "Decide the bid position"
    ],
    "review": "Your team determines qualification, accepts commercial exposure and approves the submission. A clause that cannot be verified is recorded as a gap.",
    "example": "A tender clause cannot be verified against its source. It appears as a gap for review and a possible pre-bid query; it is not presented as compliant."
  },
  "onelegal": {
    "area": "Contracts & claims",
    "audience": "Counsel · contracts and claims teams",
    "headline": "Build the position from the record.",
    "summary": "Review the contract, organise the evidence and prepare notices and claims from a record counsel has reviewed and sealed.",
    "challenge": "The contract, correspondence and evidence may tell different parts of the same story. A legal position needs a clear link between what is asserted and the record relied upon.",
    "input": "Contracts and a curated evidence set",
    "delivers": [
      {
        "t": "A contract risk review",
        "d": "Playbook questions and a clause-level risk matrix across supported contract families."
      },
      {
        "t": "A defined evidence record",
        "d": "Counsel curates and seals the material that governed drafting may use."
      },
      {
        "t": "Draft notices and claims",
        "d": "EOT, delay, cost and variation notices, and a Statement of Claim, prepared from sealed evidence."
      }
    ],
    "flow": [
      "Review the contract",
      "Curate the evidence",
      "Seal the record",
      "Review the draft"
    ],
    "review": "Counsel selects the evidence and reviews the legal position. Filing, signing, serving and sending remain human actions; the system does not perform them.",
    "example": "Drafting is requested before the evidence set is sealed. The request is refused before a model is called, so the draft cannot proceed on an unapproved record."
  },
  "sentinel": {
    "area": "Site safety",
    "audience": "Site teams · EHS and permit reviewers",
    "headline": "Make the observation actionable.",
    "summary": "Turn a site photograph into a structured hazard report, retrieve cited countermeasures and review permit controls with the evidence in view.",
    "challenge": "An observation is useful when it becomes a record someone can assess and act on. The photograph, hazard, advice and permit checks need to stay connected.",
    "input": "Site photos, clips and permit evidence",
    "delivers": [
      {
        "t": "A structured hazard report",
        "d": "Photo or clip evidence supports classification, report drafting and the observation record."
      },
      {
        "t": "Cited countermeasures",
        "d": "Retrieved safety literature is linked to the response, with a grounding score showing whether enough support was found."
      },
      {
        "t": "Permit and risk reviews",
        "d": "Photo-based permit checks and point-of-work risk assessments support the responsible person’s review."
      }
    ],
    "flow": [
      "Capture the observation",
      "Classify the hazard",
      "Check sources and controls",
      "Review the response"
    ],
    "review": "The responsible person assesses the finding and decides the site response. Where source support is below the grounding floor, the system does not generate an answer.",
    "example": "The retrieved material scores below 30/100. The system returns the sources it found and insufficient-source status, rather than generating advice."
  },
  "labour-compliance": {
    "area": "Labour compliance",
    "audience": "Principal employers · compliance teams",
    "headline": "Close the month with the record in view.",
    "summary": "Collect contractor records, reconcile wages and contributions, and bring proposed reminders, notices and register updates to a person for approval.",
    "challenge": "Monthly records arrive from different contractors in different formats. The employer needs to see missing submissions and reconciliation differences before deciding what follows.",
    "input": "Contractor uploads and portal attestations",
    "delivers": [
      {
        "t": "A contractor evidence set",
        "d": "Scoped upload links collect records for one contractor and one month, including phone photographs."
      },
      {
        "t": "Reconciliation findings",
        "d": "Wages, contributions and headcount are checked against the officer’s portal attestation; mismatches are flagged."
      },
      {
        "t": "An approval inbox",
        "d": "Reminders, notices and updates arrive as proposals. A person approves or rejects each before it is applied."
      }
    ],
    "flow": [
      "Collect monthly records",
      "Reconcile the evidence",
      "Prepare proposals",
      "Approve or reject"
    ],
    "review": "Your officer reviews exceptions and approves proposed actions. Generated forms are drafts for review; they do not establish that statutory obligations have been discharged.",
    "example": "A reconciliation difference is flagged and a proposal is queued. No change is applied until a person approves it."
  },
  "nexusref": {
    "area": "Project correspondence",
    "audience": "Project teams · document controllers",
    "headline": "Keep the project record connected.",
    "summary": "Bring incoming correspondence into a project register. Route mail and attachments, assign formal references and keep revisions identifiable, with uncertain classification marked for review.",
    "challenge": "Project mail arrives across inboxes, with attachments, repeated subjects and changing revisions. The team needs a connected record that can be found, referenced and reviewed in context.",
    "input": "Project emails, letters and attachments",
    "delivers": [
      {
        "t": "A project correspondence register",
        "d": "Incoming mail and attachments are connected to their project and filing context."
      },
      {
        "t": "Formal references and revisions",
        "d": "References include the project, type, year and sequence, with a version suffix for revisions."
      },
      {
        "t": "Visible classification uncertainty",
        "d": "Missing folders and classification confidence below 0.4 are marked for triage."
      }
    ],
    "flow": [
      "Collect correspondence",
      "Route and classify",
      "Reference and register",
      "Review filing exceptions"
    ],
    "review": "Routine administrative filing can run under configured rules. Your team reviews uncertain classification and remains responsible for issued positions and outgoing correspondence.",
    "example": "A message has no clear folder and the classifier assigns confidence below 0.4. The classification is marked for triage so the team can resolve its filing context."
  }
};
