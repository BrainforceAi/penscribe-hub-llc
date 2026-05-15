// HomePage.jsx
function HomePage() {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  return (
    <React.Fragment>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="overline">
            <div className="pulse"></div>
            <div className="eyebrow" style={{color: 'var(--ps-success)'}}>90% win rate across all submitted proposals.</div>
          </div>
          <h1>Your competitors are winning<br/>federal contracts right now.<br/><em>You should be next.</em></h1>
          <p className="lead">We write the proposals that win. Federal, state, and municipal contracts for small and mid-size service businesses. You bring the opportunity. We deliver the award.</p>
          <div className="cta-row">
            <button className="btn btn-primary" style={{fontSize: 16, padding: '16px 28px'}} onClick={() => openBooking()}>
              Book a free consultation <span>→</span>
            </button>
            <a className="btn btn-secondary" href="#/contracts">See contracts we have won</a>
          </div>
          <div className="creds">
            <span className="cert-chip">CPCM Certified</span>
            <span className="cert-chip">FAC-C Certified</span>
            <span className="cert-chip">Top Rated on Upwork</span>
            <span className="cert-chip">90% Win Rate</span>
            <span className="cert-chip">Federal, State and Municipal</span>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="stat-strip">
        <div className="container">
          <div className="stat-strip-inner">
            <div className="s">
              <div className="num">90%</div>
              <div className="lab">Proposal Win Rate</div>
              <div className="sub">Across every submitted proposal. Not cherry-picked.</div>
            </div>
            <div className="s">
              <div className="num">$2.4M</div>
              <div className="lab">Largest Contract Value</div>
              <div className="sub">A single engagement. Full proposal lifecycle managed by our team.</div>
            </div>
            <div className="s">
              <div className="num">50+</div>
              <div className="lab">Government Agencies Served</div>
              <div className="sub">Federal departments, state authorities, and municipal buyers across the country.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk reversal bar */}
      <section className="risk-bar">
        <div className="container">
          <div className="risk-bar-inner">
            <div className="risk-item">
              <div className="rk">First Review</div>
              <div className="rv">Free, no commitment</div>
            </div>
            <div className="risk-item">
              <div className="rk">Response Time</div>
              <div className="rv">Within one business day</div>
            </div>
            <div className="risk-item">
              <div className="rk">No-bid recommendation</div>
              <div className="rv">If it is not winnable, we will tell you before you spend a dollar</div>
            </div>
            <div className="risk-item">
              <div className="rk">Track Record</div>
              <div className="rv">9 out of 10 proposals win</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured contracts */}
      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Selected Contracts</div>
            <h2>A small sample of the contracts we have won for clients.</h2>
            <p className="lead">These four case studies represent a fraction of our awarded portfolio. Every contract below started with a business that had never touched government procurement. Every one ended with a signed award.</p>
          </div>
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
          <p style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--fg-3)',marginTop:24,fontStyle:'italic'}}>
            Additional contracts from our portfolio are being documented and will be published shortly.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">How We Work</div>
            <h2>Four decisions that determine whether you win or lose before a single word is written.</h2>
            <p className="lead">Every engagement follows the same structure. Here is what working with our team looks like from the moment you bring us a solicitation to the day you receive the award notice.</p>
          </div>
          <div className="process-grid">
            {window.PS_PROCESS.map(step => (
              <div className="process-step" key={step.n}>
                <div className="n">{step.n}</div>
                <div>
                  <h3>{step.t}</h3>
                  <p>{step.d}</p>
                  {step.outcome && <span className="outcome">{step.outcome}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="testimonial">
        <div className="testimonial-inner">
          <span className="quote-mark">"</span>
          <div className="q">Our proposal had the highest rating of all the vendors and we have been invited for a final in-person interview.</div>
          <div className="attr">
            Broderick Thomas, CEO of 3XG Enterprises LLC, Richmond, VA
            <div className="result">They won. Up to $124,800 per year.</div>
          </div>
        </div>
      </section>

      {/* Lead magnet */}
      <section className="lead-magnet">
        <div className="container">
          <div className="lead-magnet-inner">
            <div>
              <div className="eyebrow">No-Cost First Review</div>
              <h2>Send us your solicitation. We will tell you if it is worth bidding. In writing. In 48 hours. Free.</h2>
              <p>Most businesses spend weeks writing proposals they were never going to win. The very first thing we do for every new client is a free go or no-go review. Our team reads your RFP, evaluates fit against your capabilities, and delivers a written recommendation within 48 hours. No obligation to engage further.</p>
            </div>
            <div className="form-card">
              <div className="lbl">Free RFP Review</div>
              <h3>Submit a solicitation now</h3>
              <form onSubmit={(e) => { e.preventDefault(); openBooking('Free RFP go or no-go review'); }}>
                <div className="field">
                  <label>Your email</label>
                  <input type="email" required placeholder="you@company.com" />
                </div>
                <div className="field">
                  <label>Solicitation number or link</label>
                  <input type="text" required placeholder="e.g. FA480325A0013" />
                </div>
                <button type="submit" className="btn btn-primary" style={{justifyContent:'center'}}>Send to our team <span>→</span></button>
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
            <h2>From zero government presence to awarded contract. We handle every step.</h2>
            <p className="lead">You do not need to understand the procurement process to win a government contract. That is our job. Here is what our team does for clients from day one through signed award.</p>
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
            <a className="btn btn-secondary" href="#/services">See all 12 services →</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container">
          <div className="eyebrow">Ready to Win?</div>
          <h2>If there is a solicitation on the table and you are ready to compete, this is where it starts.</h2>
          <p className="lead">The first review is free. Our team responds within one business day. If the contract is not winnable, we will tell you that too. You only pay when we move forward together.</p>
          <div className="row">
            <button className="btn btn-primary" style={{fontSize: 16, padding: '16px 28px'}} onClick={() => openBooking()}>
              Book a consultation <span>→</span>
            </button>
            <a className="btn btn-secondary" href="#/contact">Send us a message</a>
          </div>
        </div>
      </section>

    </React.Fragment>
  );
}
window.HomePage = HomePage;
