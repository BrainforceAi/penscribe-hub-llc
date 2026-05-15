// AboutPage.jsx
function AboutPage() {
  return (
    <React.Fragment>
      <section className="page-hero">
        <div className="container-narrow">
          <div className="eyebrow">About Us</div>
          <h1>The Penscribe.<br/><em>The team behind the 90% win rate.</em></h1>
          <p className="lead">We are a government contracting consultancy built around one mission: helping service businesses win federal, state, and municipal contracts. This is our track record, and this is how we work.</p>
        </div>
      </section>

      <section className="bio-letter">
        <div className="container-narrow prose">
          <p>The Penscribe is a government contracting consultancy. Our job is to write the proposals that win your contracts.</p>
          <p>Our clients come to us without any government contracting experience. They have a real business (laundry, cleaning, advertising, professional services) and they want a piece of the largest buyer on earth. Government agencies award billions every year to small businesses. The businesses that receive those awards do not win by luck. They win because their proposals are better. We make their proposals better.</p>
          <p>Across every solicitation our team has written on behalf of clients, we have maintained a <strong>90% award rate</strong>. The contracts in our portfolio range from a $138,540 municipal award to multi-million dollar federal engagements. Our clients range from women-owned small businesses earning their first government dollar to mid-size firms expanding from commercial into federal procurement.</p>
          <p>What we bring is not magic. It is method. We read solicitations the way contracting officers read them. We write to evaluation criteria, not to the questions. We price to win and to deliver. We treat compliance as table stakes, not a feature. And we tell every client, in writing, before any work begins, whether a contract is worth bidding on at all.</p>
          <p>We do not work with every business that contacts us. The ones we work with are ready to compete. They have the capacity to deliver. They have made the operational decisions a contracting officer needs to see. And they understand that winning a government contract is the start of work, not the end of it.</p>
          <p>If that sounds like your business, we would like to hear from you.</p>
          <p className="signature">The Penscribe Team</p>
        </div>

        <div className="container-narrow">
          <div className="creds-grid">
            <div className="cred-cell">
              <div className="k">Certifications</div>
              <div className="v" style={{fontSize: 22}}>CPCM and FAC-C</div>
              <div className="sub">Certified Professional Contracts Manager. FAC-C credentialed in federal acquisition.</div>
            </div>
            <div className="cred-cell">
              <div className="k">Platform Standing</div>
              <div className="v" style={{fontSize: 22}}>Top Rated</div>
              <div className="sub">Top Rated on Upwork with verified client testimonials and documented contract awards.</div>
            </div>
            <div className="cred-cell">
              <div className="k">Win Rate</div>
              <div className="v">90%</div>
              <div className="sub">Award rate across all proposals submitted on behalf of clients.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why clients win */}
      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Why clients win</div>
            <h2>Four things our team does that most consultants skip.</h2>
          </div>
          <div className="process-grid">
            <div className="process-step">
              <div className="n">01</div>
              <div>
                <h3>We tell you when not to bid</h3>
                <p>Every engagement starts with a written go or no-go recommendation. If the contract is not winnable because of capability gaps, competition, or a wired incumbent, we tell you before you spend a dollar on proposal development. Most consultants skip this step because it costs them a fee. We do it because it is the only way to maintain a 90% win rate.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="n">02</div>
              <div>
                <h3>We write to the scoring sheet</h3>
                <p>Every proposal is evaluated against criteria. Most proposals answer the questions. Our proposals answer how the evaluator will score them. That is not the same thing. Knowing which sections carry the most weight, and writing to those weights explicitly, is where proposals are won before the contracting officer opens the cover page.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="n">03</div>
              <div>
                <h3>We manage compliance end-to-end</h3>
                <p>A non-compliant proposal is disqualified regardless of quality. We track every requirement from Section L and Section M, build a compliance matrix, and conduct a final compliance review before submission. Our clients do not lose on technicalities.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="n">04</div>
              <div>
                <h3>We position you, not just describe you</h3>
                <p>The winning proposal does not just meet requirements. It makes you the lowest-risk, highest-confidence choice in the field. We develop win themes that position your specific capabilities, certifications, and past performance against what the evaluator is actually looking for. That is what made 3XG Enterprises the highest-rated proposal among all vendors for RBHA.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container">
          <h2>Ready to see what a winning proposal looks like for your business?</h2>
          <p className="lead">The first consultation is free. Send us a note about your business and the solicitation you are considering. Our team responds within one business day.</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => openBooking()}>Book a consultation <span>→</span></button>
            <a className="btn btn-secondary" href="#/contracts">See contracts we have won</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
window.AboutPage = AboutPage;
