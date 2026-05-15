// ContractsPage.jsx
function ContractsPage() {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <React.Fragment>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Awarded Contracts</div>
          <h1>Real contracts. <em>Real clients.</em> Documented wins.</h1>
          <p className="lead">A representative selection of contracts I helped clients win. Every award shown here represents a complete proposal process — from blank page to signed contract — written and managed by me.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contracts">
            {window.PS_CONTRACTS.map(c => (
              <a className="contract-card" href={`#/contracts/${c.slug}`} key={c.slug}>
                <div className="contract-head">
                  <div>
                    <div className="contract-eyebrow">Contract {c.n} · {c.agencyType}</div>
                    <div className="contract-title">{c.title}</div>
                    <div className="contract-sub">{c.client} · {c.agency} · {c.sub}</div>
                  </div>
                  <span className="contract-badge"><span className="dot"></span>Contract Awarded</span>
                </div>
                <div className="contract-foot">
                  <span className="read">Read case study <span>→</span></span>
                  <span style={{fontFamily:'var(--font-display)',fontSize:'22px',color:'var(--fg-1)'}}>{c.valueDisplay}</span>
                </div>
              </a>
            ))}
          </div>
          <p style={{fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg-3)', marginTop: 32, textAlign: 'center', fontStyle: 'italic'}}>
            This portfolio is a work in progress. Additional awarded contracts are being documented and will be added as they are finalized.
          </p>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Want results like these for your business?</h2>
          <p className="lead">Send me your solicitation and I will tell you within 48 hours whether it is worth bidding — at no cost for the first review.</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => openBooking()}>Book a consultation <span>→</span></button>
            <a className="btn btn-secondary" href="#/services">See all services</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
window.ContractsPage = ContractsPage;
