// ServiceDetailPage.jsx
function ServiceDetailPage({ slug }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  const s = window.PS_SERVICES.find(s => s.slug === slug);
  if (!s) return <NotFoundPage />;
  const others = window.PS_SERVICES.filter(x => x.featured && x.slug !== slug).slice(0, 3);
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

          {s.deliverables && (
            <div className="deliverables">
              <h4>What You Get</h4>
              <ul>
                {s.deliverables.map(d => <li key={d}>{d}</li>)}
              </ul>
            </div>
          )}

          {s.process && (
            <React.Fragment>
              <h2>Timeline</h2>
              <p>{s.process}</p>
            </React.Fragment>
          )}

          <h2>How to start</h2>
          <p>Send me a short note describing your business and your situation. If there is a specific solicitation on the table, include it. I will respond within one business day with next steps — and if the first conversation is enough, there is no charge for it.</p>
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
