// ServicesPage.jsx
function ServicesPage() {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  const featured = window.PS_SERVICES.filter(s => s.featured);
  const rest = window.PS_SERVICES.filter(s => !s.featured);
  return (
    <React.Fragment>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Services</div>
          <h1>Everything you need to enter and win <em>government contracts.</em></h1>
          <p className="lead">From the day you decide to pursue federal work to the day you sign your fifth renewal, the work is roughly the same — and I handle every piece of it for you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow" style={{marginBottom: 24}}>Core Services</div>
          <div className="services-grid">
            {featured.map(s => (
              <a className="service-item linked" key={s.slug} href={`#/services/${s.slug}`}>
                <i data-lucide={s.icon} className="ico"></i>
                <div>
                  <h4>{s.name}</h4>
                  <p>{s.short}</p>
                </div>
                <i data-lucide="arrow-right" className="arr" style={{width:18,height:18,strokeWidth:1.5}}></i>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint" style={{paddingTop: 64}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom: 24}}>Additional Services</div>
          <div className="services-grid">
            {rest.map(s => (
              <div className="service-item" key={s.slug}>
                <i data-lucide={s.icon} className="ico"></i>
                <div>
                  <h4>{s.name}</h4>
                  <p>{s.short}</p>
                </div>
                <div></div>
              </div>
            ))}
          </div>
          <div style={{marginTop: 40, textAlign: 'center'}}>
            <button className="btn btn-primary" onClick={() => openBooking()}>Discuss your needs <span>→</span></button>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
window.ServicesPage = ServicesPage;
