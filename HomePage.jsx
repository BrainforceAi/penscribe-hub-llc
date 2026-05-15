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
            <div className="eyebrow" style={{color: 'var(--ps-success)'}}>4 contracts awarded. 90% win rate.</div>
          </div>
          <h1>Your competitors are winning<br/>federal contracts right now.<br/><em>You should be next.</em></h1>
          <p className="lead">I write the proposals that win. Federal, state, and municipal contracts for small and mid-size service businesses. You bring the opportunity. I deliver the award.</p>
          <div className="cta-row">
            <button className="btn btn-primary" style={{fontSize: 16, padding: '16px 28px'}} onClick={() => openBooking()}>
              Book a free consultation <span>→</span>
            </button>
            <a className="btn btn-secondary" href="#/contracts">See every contract I have won</a>
          </div>
          <div className="creds">
            <span className="cert-chip">CPCM Certified</span>
            <span className="cert-chip">FAC-C Certified</span>
            <span className="cert-chip">Top Rated on Upwork</span>
            <span className="cert-chip">90% Win Rate</span>
            <span className="cert-chip">DoD, USAF, State and Municipal</span>
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
              <div className="sub">Across every submitted proposal to date.</div>
            </div>
            <div className="s">
              <div className="num">$124K</div>
              <div className="lab">Largest Annual Award</div>
              <div className="sub">Richmond Behavioral Health Authority, 2025. Highest-rated proposal among all vendors.</div>
            </div>
            <div className="s">
              <div className="num">3</div>
              <div className="lab">Agency Types Won</div>
              <div className="sub">Federal, State, and Municipal contracts on the board.</div>
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
              <div className="rv">If it is not winnable, I will tell you before you spend a dollar</div>
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
            <div className="eyebrow">Awarded Contracts</div>
            <h2>Real money. Real agencies. Real clients who were exactly where you are now.</h2>
            <p className="lead">Every card below is a contract signed, a check cashed, and a business that now has a seat at the government procurement table. Click any case study to see how it was won.</p>
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
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">How I Work</div>
            <h2>Four decisions that determine whether you win or lose before you write a single word.</h2>
            <p className="lead">Every engagement follows the same structure. Here is what working with me looks like from the moment you bring me a solicitation to the day you receive the award notice.</p>
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
          <div className="q">Our proposal had the highest rating of all the vendors and I have been invited for a final in-person interview.</div>
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
              <h2>Send me your solicitation. I will tell you if it is worth bidding. In writing. In 48 hours. Free.</h2>
              <p>Most businesses spend weeks writing proposals they were never going to win. The very first thing I do for every new client is a free go or no-go review. I read your RFP, evaluate fit against your capabilities, and give you a written recommendation within 48 hours. No obligation to engage further.</p>
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
            <h2>From zero government presence to awarded contract. I handle every step.</h2>
            <p className="lead">You do not need to understand the procurement process to win a government contract. That is my job. Here is what I do for clients from day one through signed award.</p>
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
          <p className="lead">The first review is free. I respond within one business day. If the contract is not winnable, I will tell you that too. You only pay when we move forward.</p>
          <div className="row">
            <button className="btn btn-primary" style={{fontSize: 16, padding: '16px 28px'}} onClick={() => openBooking()}>
              Book a consultation <span>→</span>
            </button>
            <a className="btn btn-secondary" href="#/contact">Send me a message</a>
          </div>
        </div>
      </section>

    </React.Fragment>
  );
}
window.HomePage = HomePage;
