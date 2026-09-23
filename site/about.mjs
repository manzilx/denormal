// The About page. The home page is a single canvas exported from Claude
// Design; this page is hand-built to its tokens — Archivo display, JetBrains
// Mono labels, hard edges, one orange — and carries the About copy from the
// previous site. Voice stays "we"; no person is named.

const PALETTE = {
  light: { bg: '#FAFAFA', head: 'rgba(250,250,250,.86)', ink: '#18181B', ink3: '#3F3F46', muted: '#71717A',
           faint: '#A1A1AA', line: '#E4E4E7', card: '#FFFFFF', tint: '#FFF7ED', link: '#C2410C', btnInk: '#FAFAFA' },
  dark:  { bg: '#0C0C0E', head: 'rgba(12,12,14,.86)', ink: '#F4F4F5', ink3: '#D4D4D8', muted: '#A1A1AA',
           faint: '#71717A', line: '#27272A', card: '#141417', tint: '#1C0D06', link: '#FB923C', btnInk: '#0C0C0E' },
};
const ACCENT = '#EA580C';

const BEFORE = [
  ['01', 'Projects', 'Capital project leadership', 'Functional leadership of a portfolio of capital projects in emissions compliance and power generation, across their commercial life rather than a single phase of it.', 'EPC', 'infrastructure and power'],
  ['02', 'Commercial', 'Settlements and margin recovery', 'Negotiating commercial settlements, recovering margin on running contracts, and closing new ones — the side of a project where the paperwork becomes money.', 'Contracts', 'negotiated and closed'],
  ['03', 'Claims', 'Claims, disputes and arbitration', 'Dispute and arbitration support across national highway concession programmes under FIDIC-family contracts, including extension-of-time and change-order claims.', 'FIDIC', 'concession programmes'],
  ['04', 'Process', 'Lean ways of working', 'Process re-engineering and adoption across a function: the operating cadence, the review discipline, and the reporting that makes either of them stick.', 'Lean', 'cadence and adoption'],
  ['05', 'Teaching', 'Training the function', 'In-house training in commercial acumen — which is where you learn precisely which parts of a process people get wrong, and why.', 'Training', 'commercial acumen'],
];
const BUILD = [
  ['01', 'Start from the real process', 'Decision gates, roles, evidence, approvals, Lean flow and the audit trail — mapped as they actually run, not as the manual describes them.', 'From', 'the operating side'],
  ['02', 'Convert it into architecture', 'The workflow becomes screens, schemas, APIs, prompts, fallbacks and exports — with the load-bearing decisions written as deterministic code.', 'Into', 'schemas and gates'],
  ['03', 'Pressure-test it against the work', 'Then check it against operating experience rather than a demo script, because the failure modes that matter are the ones a practitioner already knows.', 'Against', 'real operations'],
];
const CREDS = ['MBA Executive, FMS Delhi', 'B.Tech Civil Engineering, NERIST', 'CIDC', 'ASSOCHAM', 'IACCM'];

export function renderAbout({ theme, fontCss }) {
  const c = PALETTE[theme];
  const home = theme === 'light' ? '/' : '/dark/';
  const other = theme === 'light' ? '/dark/about/' : '/about/';
  const mono = "'JetBrains Mono',ui-monospace,monospace";
  const nav = [['02', 'Lean', home + '#lean'], ['03', 'Systems', home + '#systems'], ['04', 'Deployment', home + '#deploy'], ['06', 'About', null]];

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>About — Denormal Labs</title>
<meta name="description" content="Over two decades of EPC, infrastructure and power-sector leadership came before the technology. How Denormal Labs builds, and where the models sit.">
<meta property="og:image" content="https://denormal.in/og.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
${fontCss}
*{box-sizing:border-box;margin:0;padding:0;border-radius:0}
${theme === 'dark' ? 'html{color-scheme:dark}' : ''}
body{background:${c.bg};color:${c.ink};font:400 16px/1.55 Archivo,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:${c.link};text-decoration:none} a:hover{color:${ACCENT}}
::selection{background:${theme === 'light' ? '#B5D7EE' : '#1B3A52'};color:${c.ink}}
.wrap{max-width:1320px;margin:0 auto;padding:0 clamp(20px,4vw,56px)}
.mono{font:600 11px/1.2 ${mono};letter-spacing:.14em;text-transform:uppercase}
header{position:sticky;top:0;z-index:50;background:${c.head};backdrop-filter:blur(12px) saturate(1.2);-webkit-backdrop-filter:blur(12px) saturate(1.2)}
header .wrap{height:64px;display:flex;align-items:center;gap:24px}
.logo{display:inline-flex;flex-direction:column;gap:5px;color:${c.ink};flex:0 0 auto}
.logo b{font:800 22px/1 Archivo,system-ui,sans-serif;font-stretch:125%;letter-spacing:-.05em}
.rule{position:relative;display:block;height:9px}
.rule i{position:absolute;background:${c.ink}}
.labs{font:600 10px/1 ${mono};letter-spacing:.3em;color:${c.muted}}
nav{display:flex;gap:2px;margin-left:auto}
nav a{display:flex;align-items:center;gap:7px;padding:8px 11px;white-space:nowrap;font:600 11px/1 ${mono};letter-spacing:.13em;text-transform:uppercase;color:${c.ink}}
nav a span{font-weight:500;color:${c.faint}}
nav a[aria-current]{color:${c.link};box-shadow:inset 0 -2px 0 ${ACCENT}}
.toggle{display:flex;align-items:center;gap:8px;margin-left:auto;padding:10px 11px;white-space:nowrap;box-shadow:inset 0 0 0 2px ${c.ink};color:${c.ink};font:600 11px/1 ${mono};letter-spacing:.12em;text-transform:uppercase}
.toggle:hover{background:${c.ink};color:${c.bg}}
.toggle i{display:block;width:12px;height:12px;box-shadow:inset 0 0 0 2px currentColor;background:linear-gradient(90deg,currentColor 50%,transparent 50%)}
.cta{display:flex;align-items:center;gap:22px;margin-left:10px;padding:11px 14px;white-space:nowrap;background:${c.ink};color:${c.btnInk};font:600 11px/1 ${mono};letter-spacing:.12em;text-transform:uppercase}
.cta:hover{background:${ACCENT};color:#fff}
@media (max-width:1039.98px){nav{display:none}}
@media (max-width:560px){.cta{display:none}.labs{display:none}}
section{padding:clamp(56px,8vw,112px) 0;box-shadow:0 1px 0 ${c.line}}
.kicker{display:flex;align-items:center;gap:14px;color:${c.link}}
.kicker::before{content:"";width:8px;height:8px;background:${ACCENT};flex:0 0 8px}
h1{margin-top:28px;max-width:13ch;font:800 clamp(40px,5vw,72px)/.95 Archivo,system-ui,sans-serif;font-stretch:110%;letter-spacing:-.045em;text-wrap:balance}
h1 em{font-style:normal;color:${ACCENT}}
h2{margin-top:18px;max-width:16ch;font:800 clamp(30px,3.6vw,52px)/.98 Archivo,system-ui,sans-serif;font-stretch:112%;letter-spacing:-.045em;text-wrap:balance}
.lede{margin-top:28px;max-width:62ch;font-size:clamp(17px,1.4vw,20px);line-height:1.55;color:${c.ink3};text-wrap:pretty}
.meta{margin-top:10px;color:${c.muted}}
.head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 40px}
.grid{margin-top:44px;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:2px;background:${c.line};box-shadow:0 0 0 2px ${c.line}}
.cell{background:${c.card};padding:26px 24px 24px;display:flex;flex-direction:column;gap:12px}
.cell .n{color:${c.link}}
.cell h3{font:700 20px/1.15 Archivo,system-ui,sans-serif;letter-spacing:-.02em}
.cell p{font-size:15px;line-height:1.55;color:${c.ink3};flex:1}
.foot{display:flex;align-items:baseline;gap:10px;padding-top:16px;box-shadow:0 -1px 0 ${c.line}}
.foot b{font:800 18px/1 Archivo,system-ui,sans-serif;font-stretch:112%;letter-spacing:-.03em}
.foot span{font:500 11px/1.3 ${mono};letter-spacing:.06em;color:${c.muted}}
.steps{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
.steps .num{font:800 44px/.9 ${mono};letter-spacing:-.06em;color:${ACCENT}}
.cols{margin-top:44px;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:clamp(28px,5vw,80px)}
@media (max-width:860px){.cols{grid-template-columns:1fr}}
.cols p{font-size:17px;line-height:1.65;color:${c.ink3};text-wrap:pretty}
.cols p+p{margin-top:18px}
.note{padding:26px;background:${c.tint};box-shadow:inset 3px 0 0 ${ACCENT}}
.note p{color:${c.ink}}
.chips{margin-top:24px;display:flex;flex-wrap:wrap;gap:8px}
.chips span{padding:9px 12px;box-shadow:inset 0 0 0 2px ${c.line};font:600 11px/1 ${mono};letter-spacing:.08em;color:${c.ink}}
.based{margin-top:36px;display:flex;flex-wrap:wrap;gap:12px 40px;align-items:baseline}
.based b{font:700 20px/1.2 Archivo,system-ui,sans-serif;letter-spacing:-.02em}
.based p{max-width:52ch;color:${c.ink3}}
footer{padding:36px 0 48px}
footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;color:${c.muted}}
</style>
</head>
<body>
<header><div class="wrap">
  <a class="logo" href="${home}" aria-label="Denormal Labs home"><b>denormal</b>
    <span class="rule" aria-hidden="true"><i style="left:0;right:0;bottom:0;height:2px"></i><i style="left:0;top:0;bottom:0;width:2px"></i><i style="left:calc(33.333% - 1px);bottom:0;width:2px;height:9px"></i><i style="left:calc(66.666% - 1px);bottom:0;width:2px;height:9px"></i><i style="right:0;bottom:0;width:2px;height:9px"></i><i style="left:2px;bottom:2px;top:0;width:calc(33.333% - 3px);background:${ACCENT}"></i></span></a>
  <span class="labs">LABS</span>
  <nav aria-label="Primary">${nav.map(([n, l, h]) => h
    ? `<a href="${h}"><span>${n}</span>${l}</a>`
    : `<a href="#top" aria-current="page"><span>${n}</span>${l}</a>`).join('')}</nav>
  <a class="toggle" href="${other}" aria-label="Switch to ${theme === 'light' ? 'dark' : 'light'} mode"><i aria-hidden="true"></i>${theme === 'light' ? 'Dark' : 'Light'}</a>
  <a class="cta" href="${home}#start">Send one document<span aria-hidden="true">→</span></a>
</div></header>

<main id="top">
<section><div class="wrap">
  <span class="mono kicker">00 · About // Denormal Labs</span>
  <h1>Built from the <em>operating</em> side.</h1>
  <p class="lede">Over two decades in EPC, infrastructure and power-sector contract leadership came before any of this software existed. The processes these systems encode — the tender, the claim, the delay, the permit, the statutory clock — are processes we ran, argued and answered for. That is the whole reason the portfolio looks the way it does.</p>
  <p class="lede" style="margin-top:22px"><a class="mono" href="${home}#systems">← See the five systems</a></p>
</div></section>

<section><div class="wrap">
  <div class="head"><div><span class="mono kicker">Before the software</span><h2>Two decades on the other side of the desk.</h2></div><span class="mono meta">Manufacturing // Complex projects</span></div>
  <div class="grid">${BEFORE.map(([n, k, t, b, fb, fs]) => `
    <article class="cell"><span class="mono n">${n} // ${k}</span><h3>${t}</h3><p>${b}</p><div class="foot"><b>${fb}</b><span>${fs}</span></div></article>`).join('')}
  </div>
</div></section>

<section><div class="wrap">
  <div class="head"><div><span class="mono kicker">How we build</span><h2>The process comes first. It always did.</h2></div><span class="mono meta">Process → Architecture → Pressure test</span></div>
  <div class="grid steps">${BUILD.map(([n, t, b, fk, fv]) => `
    <article class="cell"><span class="num">${n}</span><h3>${t}</h3><p>${b}</p><div class="foot"><span class="mono">${fk}</span><b>${fv}</b></div></article>`).join('')}
  </div>
</div></section>

<section><div class="wrap">
  <div class="head"><div><span class="mono kicker">Where the models sit</span><h2>Last thing chosen. First thing constrained.</h2></div><span class="mono meta">The technology serves the process</span></div>
  <div class="cols">
    <div>
      <p>A language model is the last component we pick and the first one we put a fence around. The decisions that carry consequence — whether a finding is grounded enough to state, whether an evidence set is sealed, what a statute actually requires and by when — are deterministic code with tests against them. The model reads, classifies and drafts around that, and what it returns carries its source, its grounding and its audit row.</p>
      <p>This ordering is not a technical preference. It is what years of being personally accountable for an output teaches you to build.</p>
    </div>
    <div class="note"><p>It is also why the sensitive path can be scoped to run without reaching a model vendor at all. Where nothing may leave your network, we deploy it that way — and before anything goes live, we document in writing which service each system calls and what it receives.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="mono kicker">Credentials</span>
  <div class="chips">${CREDS.map((x) => `<span>${x}</span>`).join('')}</div>
  <div class="based"><span class="mono" style="color:${c.muted}">Based in</span><b>New Delhi, India.</b><p>Working with manufacturers and complex-project owners wherever the process is the problem.</p></div>
</div></section>
</main>

<footer><div class="wrap"><span class="mono">© 2026 Denormal Labs</span><span class="mono">Process first · evidence attached</span><a class="mono" href="mailto:hello@denormal.in">hello@denormal.in</a></div></footer>
</body></html>
`;
}
