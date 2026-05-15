// Contracts.jsx — expandable case-study cards.
const { useState: useStateContracts } = React;

const CONTRACTS = [
  {
    n: '01',
    title: 'Laundry and Dry Cleaning Services',
    client: 'Tebebi LLC',
    agency: '20th Contracting Squadron, Shaw AFB, SC',
    sub: 'Federal · USAF · September 2025',
    value: 'Firm-Fixed Unit Price',
    fields: [
      ['Solicitation', 'FA480325A0013'],
      ['Set-Aside', '100% Small Business'],
      ['Contract Type', 'Firm-Fixed Unit Price'],
      ['Role', 'Proposal Strategist & Writer'],
    ],
    body: [
      "Recurring laundry and dry cleaning services for the 23d Force Support Squadron — JSLIST protective coats, A3 bags, sleeping bags, helmet covers, parkas, and general garrison items.",
      "I managed the full proposal lifecycle. Developed the technical approach, service execution plan, quality control framework, and compliance documentation. Structured pricing across all 10 CLINs. The contract was awarded at the lowest technically acceptable price.",
    ],
  },
  {
    n: '02',
    title: 'Lot Cleaning Services for Code Enforcement',
    client: 'Seven Cleaning Service, LLC',
    agency: 'City of Winter Park, Florida',
    sub: 'Municipal · July 2024',
    value: '$138,540 / year est.',
    fields: [
      ['Procurement Agent', 'Rebecca Watt'],
      ['Contract Type', 'Fixed Unit Price'],
      ['Cert Stack', 'SBA WOSB · EDWOSB · MBE · WBE'],
      ['Role', 'Proposal Strategist & Writer'],
    ],
    body: [
      "Comprehensive lot cleaning for the City of Winter Park's Code Enforcement division — mowing, trimming, debris removal, herbicide application, and grading.",
      "I developed the complete response: cover letter, company history, scope response, technical specs, performance metrics, equipment list, and full fee table across four service categories. Positioned the client's SBA WOSB and EDWOSB certifications to maximize evaluation standing. This was the client's first municipal contract.",
    ],
  },
  {
    n: '03',
    title: 'Employment Advertising Services',
    client: '3XG Enterprises LLC',
    agency: 'Richmond Behavioral Health Authority, Richmond, VA',
    sub: 'State · February 2025 · highest technical rating',
    value: 'Up to $124,800 / year',
    fields: [
      ['RFP Number', '2025-HR-0004'],
      ['Term', '2-year initial · 4 × 2-year renewals'],
      ['Contract Type', 'Fixed-Price, Performance-Based'],
      ['Role', 'Strategist, Writer, Oral Deck Designer'],
    ],
    body: [
      "Programmatic advertising, geo-fencing, social media, streaming TV/audio, email, and SEO for RBHA's job postings. Required real-time analytics and ATS integration.",
      "I managed the engagement from RFP analysis through final award. Built six tabs to spec, with two tiered pricing packages and full compliance attachments. Positioned the client's five-year existing relationship with RBHA as the central differentiator.",
      "The proposal received the highest technical rating among all competing vendors. Following a successful oral presentation using the deck I prepared, RBHA awarded the contract.",
    ],
  },
  {
    n: '04',
    title: 'Laundry Services Blanket Purchase Agreement',
    client: 'Tebebi LLC',
    agency: '711th Human Performance Wing, Wright-Patterson AFB, OH',
    sub: 'Federal · USAF · Performance start April 2026',
    value: 'BPA · 5-year term',
    fields: [
      ['Solicitation', 'COMBO-AFRL-PZLEQ-2026-0003'],
      ['NAICS', '812332 — Industrial Launderers'],
      ['Volume', '~235 lbs / week across 3 categories'],
      ['Role', 'Proposal Strategist & Writer'],
    ],
    body: [
      "Weekly laundry services for the 711th HPW. Three categories — Operational Equipment, Facility Equipment, Residential Housing — with 160°F thermal treatment, separate infectious-disease handling, EPA-approved vehicle sanitation, and 24-hour emergency delivery.",
      "I wrote the compliance narrative to mirror the PWS section by section, leaving no evaluation gap for the contracting officer. Tebebi's second Air Force base laundry contract with proposals I prepared.",
    ],
  },
];

function ContractCard({ c, open, onToggle }) {
  return (
    <div className={`contract-card ${open ? 'open' : ''}`} onClick={onToggle}>
      <div className="contract-head">
        <div>
          <div className="contract-eyebrow">Contract {c.n}</div>
          <div className="contract-title">{c.title}</div>
          <div className="contract-sub">{c.client} · {c.agency} · {c.sub}</div>
        </div>
        <span className="contract-badge"><span className="dot"></span>Contract Awarded</span>
      </div>
      {open && (
        <div>
          <div className="contract-detail">
            {c.fields.map(([k, v]) => (
              <div key={k}><div className="k">{k}</div><div className="v">{v}</div></div>
            ))}
          </div>
          <div className="contract-body">
            {c.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}

function Contracts() {
  const [openIdx, setOpenIdx] = useStateContracts(2); // RBHA expanded by default — best showcase
  return (
    <section className="section" id="contracts" style={{background: 'var(--ps-tint)'}}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Awarded Contracts</div>
          <h2>A working portfolio of federal and municipal wins.</h2>
          <p className="lead">Click any contract to read the full case study — scope, my contribution, and outcome.</p>
        </div>
        <div className="contracts">
          {CONTRACTS.map((c, i) => (
            <ContractCard
              key={c.n}
              c={c}
              open={i === openIdx}
              onToggle={() => setOpenIdx(i === openIdx ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

window.Contracts = Contracts;
