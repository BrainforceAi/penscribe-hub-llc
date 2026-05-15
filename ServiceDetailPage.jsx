// ServiceDetailPage.jsx
function ServiceDetailPage({ slug }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  const s = window.PS_SERVICES.find(s => s.slug === slug);
  if (!s) return React.createElement(window.NotFoundPage);
  const others = window.PS_SERVICES.filter(x => x.featured && x.slug !== slug).slice(0, 3);

  // Extended content for SBA certifications page
  const isSBA = slug === 'sba-certifications';

  return (
    <React.Fragment>
      <section className="service-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="#/services">Services</a><span className="sep">/</span>{s.name}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '64px 1fr', gap: 24, alignItems: 'start', marginTop: 24}}>
            <i data-lucide={s.icon} style={{width: 52, height: 52, color: 'var(--ps-brand)', strokeWidth: 1.5}}></i>
            <div>
              <div className="eyebrow">Service</div>
              <h1 style={{fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 54, lineHeight: 1.05, letterSpacing: '-0.015em', marginTop: 10, color: 'var(--fg-1)'}}>{s.name}</h1>
              <p style={{fontFamily: 'var(--font-serif)', fontSize: 20, lineHeight: 1.5, color: 'var(--fg-2)', marginTop: 18, maxWidth: 760}}>{s.short}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="prose-section">
        <div className="container-narrow">
          <p>{s.long}</p>

          {isSBA && (
            <React.Fragment>
              <h2 style={{fontFamily:'var(--font-serif)',fontWeight:600,fontSize:28,marginTop:40,marginBottom:16}}>Federal SBA certifications I work with</h2>
              <div className="deliverables">
                <h4>Small Business Administration Programs</h4>
                <ul>
                  <li>8(a) Business Development Program</li>
                  <li>HUBZone (Historically Underutilized Business Zone)</li>
                  <li>WOSB (Women-Owned Small Business)</li>
                  <li>EDWOSB (Economically Disadvantaged WOSB)</li>
                  <li>SDVOSB (Service-Disabled Veteran-Owned Small Business)</li>
                  <li>VOSB (Veteran-Owned Small Business)</li>
                </ul>
              </div>

              <h2 style={{fontFamily:'var(--font-serif)',fontWeight:600,fontSize:28,marginTop:40,marginBottom:16}}>State and local certifications I work with</h2>
              <p>Set-aside opportunity is not limited to federal contracting. State and local agencies run their own certification programs that unlock dedicated bidding pools for qualified businesses. I evaluate eligibility and handle applications at every level.</p>
              <div className="deliverables">
                <h4>State and Local Programs</h4>
                <ul>
                  <li>DBE: Disadvantaged Business Enterprise (state DOT programs)</li>
                  <li>MBE: Minority Business Enterprise (state and local)</li>
                  <li>WBE: Women Business Enterprise (state and local)</li>
                  <li>SBE: Small Business Enterprise (local procurement programs)</li>
                  <li>ACDBE: Airport Concession DBE (FAA-governed airport procurement)</li>
                  <li>State-specific DVBE and VBE programs for veteran-owned businesses</li>
                  <li>Local Vendor Preference programs at the municipality level</li>
                </ul>
              </div>

              <p>Many of these certifications stack. A business that qualifies as WOSB, MBE, and DBE simultaneously becomes eligible for three separate pools of set-aside work. I evaluate which combination applies to your business and prepare all applications in the correct order.</p>
            </React.Fragment>
          )}

          {s.deliverables && !isSBA && (
            <div className="deliverables">
              <h4>What You Get</h4>
              <ul>
                {s.deliverables.map(d => <li key={d}>{d}</li>)}
              </ul>
            </div>
          )}

          {isSBA && s.deliverables && (
            <React.Fragment>
              <h2 style={{fontFamily:'var(--font-serif)',fontWeight:600,fontSize:28,marginTop:40,marginBottom:16}}>What I deliver</h2>
              <div className="deliverables">
                <h4>Full Application Support</h4>
                <ul>
                  {s.deliverables.map(d => <li key={d}>{d}</li>)}
                </ul>
              </div>
            </React.Fragment>
          )}

          {s.process && (
            <React.Fragment>
              <h2 style={{fontFamily:'var(--font-serif)',fontWeight:600,fontSize:28,marginTop:40,marginBottom:16}}>Timeline</h2>
              <p>{s.process}</p>
            </React.Fragment>
          )}

          <h2 style={{fontFamily:'var(--font-serif)',fontWeight:600,fontSize:28,marginTop:40,marginBottom:16}}>How to start</h2>
          <p>Send me a short note describing your business and your situation. I will respond within one business day with exactly which certifications you qualify for and what the application process looks like. The first consultation is free.</p>
          <div style={{marginTop: 32, display: 'flex', gap: 14, flexWrap: 'wrap'}}>
            <button className="btn btn-primary" onClick={() => openBooking(s.name)}>Request {s.name.toLowerCase()} <span>→</span></button>
            <a className="btn btn-secondary" href="#/contact">Use the contact form</a>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="related-services">
          <div className="container">
            <h3>Other core services</h3>
            <div className="related-grid">
              {others.map(o => (
                <a className="related-card" href={`#/services/${o.slug}`} key={o.slug}>
                  <h4>{o.name}</h4>
                  <p>{o.short}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </React.Fragment>
  );
}
window.ServiceDetailPage = ServiceDetailPage;
