// Site-wide copy for the new denormal.in. Everything here is either a
// statement of how Denormal Labs works or a fact checked against the product
// repositories (see systems.mjs). No person is named; no customer, deployment,
// certification or statistic is implied.

export const SITE = {
  name: 'Denormal Labs',
  origin: 'https://denormal.in',
  email: 'hello@denormal.in',
  city: 'New Delhi, India',
  description: 'Denormal Labs builds human-centered, lean digital workflows for infrastructure, power and complex operations. Empower people to innovate, make informed decisions and create lasting impact.',
};

export const NAV = [
  { href: '/systems/', label: 'Systems' },
  { href: '/how-we-work/', label: 'How we work' },
  { href: '/deployment/', label: 'Deployment' },
  { href: '/about/', label: 'About' },
];

export const HERO = {
  kicker: 'Our core purpose',
  title: 'Empower. Innovate. Sustain.',
  lines: ['Empower.', 'Innovate. Sustain.'],
  lede: 'Human-centered, lean digital workflows to empower people, enable innovation and create lasting impact.',
  primary: { label: 'Start with one document', href: '#start' },
  secondary: { label: 'See the five systems', href: '/systems/' },
};

// Why describes the future we work towards; How describes our method;
// What is the portfolio that puts the method into practice.
export const PURPOSE = {
  vision: {
    title: 'A better tomorrow, built around people.',
    statement: 'A future where human-centered technology makes complex work leaner, empowers people to innovate, and helps them stand by decisions that create lasting impact.',
    foot: 'Clarity to act. Confidence to decide. Room to innovate.',
  },
  mission: {
    title: 'Complex operations. Lean digital workflows.',
    statement: 'We transform complex operations into lean digital workflows by removing friction, improving efficiency and making decisions easier to audit, explain and defend.',
    method: 'Six moves from the Lean tradition, starting with the work and keeping judgment with people.',
  },
};

// Who the systems are designed for. Never presented as customers.
export const AUDIENCE = ['Manufacturing', 'Infrastructure Sector', 'Power producers', 'EPC contractors', 'Public sector enterprises'];

export const SYSTEMS_INTRO = {
  title: 'Five systems. Each has a line it won’t cross.',
  body: 'Each system is drawn as it runs: an input, three gates that check a specific condition, and a decision that routes the work. One gate in every system carries a rule it will not bend, and a person decides what happens next.',
};

// The architecture every system shares. Labels are descriptions of the
// mechanisms verified per system, not a separate product.
export const LAYERS = [
  { n: '04', t: 'Control', d: 'Consequential decisions stay with people. Approval and exception paths reflect the specific workflow.', accent: true },
  { n: '03', t: 'Bounded models', d: 'Models read, classify and draft, only over the passages they were shown. Where a model is optional, the system runs without it.' },
  { n: '02', t: 'Deterministic gates', d: 'Rules the code enforces: grounding floors, reconciliation tolerances, tenant checks, sealed evidence.' },
  { n: '01', t: 'Your documents, inside your boundary', d: 'Tender packs, correspondence, contracts, site photos, contractor records, on the infrastructure you choose.' },
];

export const PHASES = [
  { n: '01', t: 'One document', when: 'Week 0', d: 'Agree the scope and sharing arrangements for one real artifact: a tender pack, project correspondence, a contract set, six months of near-miss reports, or a month of contractor records.' },
  { n: '02', t: 'Written findings', when: 'Within two weeks', d: 'A findings document covering the risks, the gaps and the waste in the process, each finding cited to its source. Fixed scope, fixed fee.' },
  { n: '03', t: 'Pilot', when: 'Scoped together', d: 'If the findings show you something new, we scope a pilot on your documents, inside the boundary you choose.' },
  { n: '04', t: 'Deployed', when: 'With your team', d: 'The system runs where your data lives, with your people deciding. We stay alongside it rather than handing it over.' },
];

export const PRINCIPLES = [
  { t: 'Evidence before assertion', d: 'Every finding is cited to the passage, row or photo it came from. What cannot be cited is reported as a gap.' },
  { t: 'A line it won’t cross', d: 'Each system carries one rule the code enforces, whatever the model says.' },
  { t: 'Authority stays with you', d: 'Routine administration can be automated under agreed rules. Consequential decisions and issued positions remain with your team.' },
  { t: 'Your boundary first', d: 'Your servers by default. External calls are named in writing before deployment.' },
];

// What the systems will not do. Each line traces to a verified rule.
export const REFUSALS = [
  { sys: 'PCI', t: 'Count an unverified clause as compliant.' },
  { sys: 'OneLegal', t: 'Draft from evidence counsel has not sealed, or file, sign or serve anything.' },
  { sys: 'NexusRef', t: 'Present uncertain classification without a triage flag.' },
  { sys: 'Sentinel', t: 'Answer below a grounding score of 30 out of 100.' },
  { sys: 'Labour Compliance', t: 'Apply any change a person has not approved.' },
];

export const DEPLOYMENT = {
  title: 'Where your data lives is your choice.',
  lede: 'Choose the operating boundary. We document every data path before go-live.',
  options: [
    { id: 'B.01', tag: 'Recommended', t: 'On your servers', d: 'Inside your perimeter, governed by your identity, storage, backup and retention controls.', foot: 'Hardware you own · audit you control' },
    { id: 'B.02', tag: 'Also good', t: 'In your cloud', d: 'Inside your tenancy. You retain the account, audit trail and control plane.', foot: 'Provider you approve · controls you retain' },
    { id: 'B.03', tag: 'On request', t: 'Hosted by us', d: 'Scoped to an India region, with residency, subprocessors and access controls written into the agreement.', foot: 'Region agreed · terms documented' },
  ],
  commitments: [
    { t: 'No training', d: 'Customer material is not used to train product models.' },
    { t: 'External calls disclosed', d: 'Service and payload are identified in writing before deployment.' },
    { t: 'Network-only option', d: 'If nothing may leave your network, we scope it that way.' },
  ],
  notBuilt: [
    { t: 'Hosting on MeitY-empanelled infrastructure', d: 'Our own hosting is an India region but not an empanelled offering. Deploying into your tenancy sidesteps this.' },
    { t: 'Encryption at rest, applied by the application', d: 'On your infrastructure, the disk and volume encryption you already run covers this. As a hosted service, it is work we still owe you.' },
    { t: 'Portfolio-wide enterprise identity controls', d: 'Authentication and integration differ by product. Directory integration, access roles and the controls needed for your deployment must be verified in its scope.' },
    { t: 'A formal retention, deletion and legal-hold policy', d: 'Deployed with you, retention follows your policy on your storage. As a product feature, it is not there yet.' },
  ],
};

export const START = {
  kicker: 'Fixed scope · fixed fee',
  title: 'Start with one document.',
  body: 'Tell us about one real artifact. We agree the scope, fee and how it will be shared. Within two weeks of receiving the agreed record, we return a written findings document covering the risks, the gaps and the waste in the process, each finding cited to its source. No deployment, integration or procurement exercise. If the findings show you something new, we scope a pilot together.',
  examples: [
    { a: 'A tender pack', s: 'Power Contract Intelligence' },
    { a: 'A contract set', s: 'OneLegal' },
    { a: 'Project correspondence', s: 'NexusRef' },
    { a: 'Six months of near-miss reports', s: 'Sentinel' },
    { a: 'A month of contractor records', s: 'Labour Compliance' },
  ],
  cta: 'Discuss one document',
  subject: 'One document',
};

// The method the systems encode, from the Lean tradition they are built on.
export const MISSION = [
  { n: '01', t: 'Digitize the process', lean: 'Gemba', d: 'Start where the work is done, with the records it already produces.' },
  { n: '02', t: 'Map the value stream', lean: 'VSM', d: 'Every step from input to sign-off, drawn as it actually runs.' },
  { n: '03', t: 'Automate the standard work', lean: 'Standard work', d: 'The current best way, written down, then repeated by the system.' },
  { n: '04', t: 'Remove waste and rework', lean: 'Muda', d: 'Activity that consumes time and adds no value is taken out.' },
  { n: '05', t: 'Error-proof the load-bearing steps', lean: 'Poka-yoke', d: 'A check that makes the wrong result impossible to pass downstream.' },
  { n: '06', t: 'Keep judgment with people', lean: 'Jidoka', d: 'The system raises the problem and calls a person, and every decision is auditable from input to sign-off.' },
];

export const ABOUT = {
  welcome: 'Welcome home.',
  invitation: 'Let’s build something meaningful, together.',
  title: 'Technology shaped around people.',
  lede: 'We build intuitive, human-centered digital workflows that give you the clarity to innovate, confidence to stand by your choices and tools to create lasting impact.',
  body: [
    'We start with the people doing the work: the tender that has to be priced by Friday, the correspondence a project has to keep connected, the contractor records that have to be reconciled. We map the process before building the technology, remove waste and rework, and keep consequential decisions with people.',
    'We write down what each system does, what it refuses to do, and what is not built yet. If a claim on this site does not survive being checked against the code, we would rather correct it than keep it.',
  ],
};

export const VALUES = [
  { n:'01', t:'Lean Software, Deep Care', d:'We remove bloat, unnecessary complexity and administrative friction so people can focus on work that matters. Lean means intentional, thoughtful craftsmanship.' },
  { n:'02', t:'Clarity in Complexity', d:'Complex work needs a clear structure. We make the process, evidence and decision points easier to understand, so teams can act with confidence.' },
  { n:'03', t:'Efficiency Meets Empathy', d:'Efficiency should give people time and energy back. We build sustainable workflows that respect attention and support teams without making burnout the price of progress.' },
  { n:'04', t:'Value Addition That Matters', d:'Every feature, architectural choice and process should add useful value for the people who rely on it. We favour meaningful outcomes over more software.' },
];
