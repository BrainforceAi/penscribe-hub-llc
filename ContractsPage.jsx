// ContractsPage.jsx
function ContractsPage() {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <React.Fragment>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Awarded Contracts</div>
          <h1>Real contracts. <em>Real clients.</em> Every dollar documented.</h1>
          <p className="lead">Not hypotheticals. Not case studies from other consultants. Every contract below was won by a real client, with a proposal I wrote. Each one started with a business that had never touched government procurement.</p>
        </div>
      </section>

      {/* Stats above fold */}
      <section className="stat-strip">
        <div className="container">
          <div className="stat-strip-inner">
            <div className="s">
              <div className="num">4</div>
              <div className="lab">Contracts on the Board</div>
              <div className="sub">Federal, state, and municipal. More being documented.</div>
            </div>
            <div className="s">
              <div className="num">90%</div>
              <div className="lab">Win Rate Across All Bids</div>
              <div className="sub">Every submitted proposal. Not cherry-picked.</div>
            </div>
            <div className="s">
              <div className="num">$124K</div>
              <div className="lab">Largest Annual Award</div>
              <div className="sub">Highest-rated proposal among all vendors, Richmond VA, 2025.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contracts">
            {window.PS_CONTRACTS.map(c => (
              <a className="contract-card" href={`#/contracts/${c.slug}`} key={c.slug}>
                <div className="contract-head">
                  <div>
                    <div className="contract-eyebrow">Contract {c.n}, {c.agencyType}</div>
                    <div className="contract-title">{c.title}</div>
                    <div className="contract-sub">{c.client}, {c.agency}</div>
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
            Additional contracts are being documented and will be published as they are finalized.
          </p>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Your contract should be on this page.</h2>
          <p className="lead">Send me your solicitation and I will tell you within 48 hours whether it is worth bidding. The first review costs you nothing. Not bidding costs you everything.</p>
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
