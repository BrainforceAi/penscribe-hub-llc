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
          <h1>From first registration to <em>signed contract.</em> Every step covered.</h1>
          <p className="lead">You do not need to understand government procurement to win government contracts. That is my job. Below is everything I do for clients from day one through award.</p>
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
            <button className="btn btn-primary" onClick={() => openBooking()}>Discuss your situation <span>→</span></button>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Not sure which service you need? Start here.</h2>
          <p className="lead">Send me a short note about your business and where you are in the process. I will tell you exactly what you need and what it will cost. The first conversation is free.</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => openBooking()}>Get a recommendation <span>→</span></button>
            <a className="btn btn-secondary" href="#/contracts">See what winning looks like</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
window.ServicesPage = ServicesPage;
