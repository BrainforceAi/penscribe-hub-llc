// HomePage.jsx
function HomePage() {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  return (
    <React.Fragment>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="eyebrow">Government Contracting Consultancy</div>
          <h1>You bring the business.<br/><em>I bring the contract.</em></h1>
          <p className="lead">I help small and mid-size service businesses enter and win federal, state, and municipal contracts. End-to-end ownership of the proposal — from solicitation analysis to submission. 90% award rate.</p>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={() => openBooking()}>Book a consultation <span>→</span></button>
            <a className="btn btn-secondary" href="#/contracts">See the contracts I have won</a>
          </div>
          <div className="creds">
            <span className="cert-chip">CPCM Certified</span>
            <span className="cert-chip">FAC-C Certified</span>
            <span className="cert-chip">Top Rated · Upwork</span>
            <span className="cert-chip">90% Win Rate</span>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="stat-strip">
        <div className="container">
          <div className="stat-strip-inner">
            <div className="s"><div className="num">90%</div><div className="lab">Proposal Win Rate</div><div className="sub">Across all submitted proposals</div></div>
            <div className="s"><div className="num">$124K</div><div className="lab">Largest Annual Award</div><div className="sub">Richmond Behavioral Health Authority, 2025</div></div>
            <div className="s"><div className="num">3</div><div className="lab">Agency Types Served</div><div className="sub">Federal · State · Municipal</div></div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">How I Work</div>
            <h2>A four-step process designed to win.</h2>
            <p className="lead">Every engagement follows the same structure. Here is what working with me looks like from start to finish.</p>
          </div>
          <div className="process-grid">
            {window.PS_PROCESS.map(step => (
              <div className="process-step" key={step.n}>
                <div className="n">{step.n}</div>
                <div><h3>{step.t}</h3><p>{step.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured contracts */}
      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Awarded Contracts</div>
            <h2>A working portfolio of federal and municipal wins.</h2>
            <p className="lead">Each card is a real contract awarded to a real client. Click any one for the full case study.</p>
          </div>
          <div className="contracts">
            {window.PS_CONTRACTS.map(c => (
              <a className="contract-card" href={`#/contracts/${c.slug}`} key={c.slug}>
                <div className="contract-head">
                  <div>
                    <div className="contract-eyebrow">Contract {c.n}</div>
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
        </div>
      </section>

      {/* Lead magnet */}
      <section className="lead-magnet">
        <div className="container">
          <div className="lead-magnet-inner">
            <div>
              <div className="eyebrow">No-Cost First Review</div>
              <h2>Send me your solicitation. I will tell you if it is worth bidding.</h2>
              <p>Most businesses spend weeks writing proposals they cannot win. The first thing I do for any new client is a free go or no-go review: I read your RFP, evaluate fit against your capabilities, and tell you in writing within 48 hours whether to bid. No commitment to engage further.</p>
            </div>
            <div className="form-card">
              <div className="lbl">Free RFP Review</div>
              <h3>Submit a solicitation</h3>
              <form onSubmit={(e) => { e.preventDefault(); openBooking('Free RFP go/no-go review'); }}>
                <div className="field">
                  <label>Your email</label>
                  <input type="email" required placeholder="you@company.com" />
                </div>
                <div className="field">
                  <label>Solicitation number or link</label>
                  <input type="text" required placeholder="e.g. FA480325A0013" />
                </div>
                <button type="submit" className="btn btn-primary" style={{justifyContent:'center'}}>Send to Isaac <span>→</span></button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Services</div>
            <h2>A full suite of government contracting support.</h2>
            <p className="lead">Beyond proposal writing, I provide everything small and mid-size businesses need to enter and grow in federal, state, and local contracting.</p>
          </div>
          <div className="services-grid">
            {window.PS_SERVICES.slice(0, 6).map(s => (
              <a className={`service-item ${s.featured ? 'linked' : ''}`} key={s.slug}
                 href={s.featured ? `#/services/${s.slug}` : '#/services'}
                 onClick={(e) => { if (!s.featured) { e.preventDefault(); window.location.hash = '#/services'; } }}>
                <i data-lucide={s.icon} className="ico"></i>
                <div>
                  <h4>{s.name}</h4>
                  <p>{s.short}</p>
                </div>
                {s.featured && <i data-lucide="arrow-right" className="arr" style={{width:18,height:18,strokeWidth:1.5}}></i>}
              </a>
            ))}
          </div>
          <div style={{marginTop: 32, textAlign: 'center'}}>
            <a className="btn btn-secondary" href="#/services">See all 12 services</a>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="testimonial">
        <div className="testimonial-inner">
          <span className="quote-mark">"</span>
          <div className="q">Our proposal had the highest rating of all the vendors and I have been invited for a final in-person interview.</div>
          <div className="attr">
            Broderick Thomas<span className="sep">·</span>CEO, 3XG Enterprises LLC<span className="sep">·</span>Richmond, VA
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container">
          <div className="eyebrow">Ready to Win Your Next Contract?</div>
          <h2>If you have an opportunity and you are ready to compete, let's talk.</h2>
          <p className="lead">From SAM.gov registration through full proposal development and submission — I handle the work so you can focus on delivering.</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => openBooking()}>Book a consultation <span>→</span></button>
            <a className="btn btn-secondary" href="#/contact">Use the contact form</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
window.HomePage = HomePage;
