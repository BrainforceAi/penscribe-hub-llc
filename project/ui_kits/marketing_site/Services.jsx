// Services.jsx — two-column services grid with Lucide icons.
const SERVICES = [
  ['shield-check',  'SAM.gov Registration', 'Full setup and activation of your System for Award Management profile, required for all federal contracting.'],
  ['fingerprint',   'UEI, CAGE Code & DUNS', 'Obtaining your Unique Entity Identifier, CAGE Code, and DUNS number to establish federal vendor identity.'],
  ['file-text',     'Capability Statement', 'A professional one-page capability statement tailored to your target agencies, NAICS codes, and competencies.'],
  ['search',        'Contract Opportunity Research', 'Targeted research on federal, state, and local bid opportunities that match your business profile and capacity.'],
  ['landmark',      'State & Local Vendor Registration', 'Registration on state procurement portals and local vendor databases for non-federal contracting.'],
  ['pen-tool',      'Proposal Preparation', 'End-to-end proposal writing — technical volumes, pricing narratives, compliance matrices, and past performance.'],
  ['award',         'SBA Certifications', 'Guidance and application support for 8(a), HUBZone, WOSB, EDWOSB, SDVOSB, and VOSB certifications.'],
  ['users',         'DBE & MBE Certifications', 'Support for Disadvantaged Business Enterprise and Minority Business Enterprise certifications at state and local level.'],
  ['file-search',   'RFP & Solicitation Analysis', 'Detailed breakdown of RFPs and RFQs — risks, requirements, evaluation criteria, and go or no-go recommendations.'],
  ['briefcase',     'Past Performance Documentation', 'Writing and formatting of past performance references and contract summaries for proposals and capability packages.'],
  ['layers',        'Subcontracting Plans', 'Development of small business subcontracting plans required for large prime contracts.'],
  ['inbox',         'Sources Sought & RFI Responses', 'Drafting responses to Sources Sought notices and RFIs to position your firm ahead of formal solicitations.'],
];

function Services() {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Services</div>
          <h2>A full suite of government contracting support.</h2>
          <p className="lead">Beyond proposal writing, I provide everything small and mid-size businesses need to enter and grow in federal, state, and local contracting.</p>
        </div>
        <div className="services-grid">
          {SERVICES.map(([icon, name, desc]) => (
            <div className="service-item" key={name}>
              <i data-lucide={icon} className="ico"></i>
              <div>
                <h4>{name}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Services = Services;
