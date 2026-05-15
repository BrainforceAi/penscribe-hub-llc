// AboutPage.jsx
function AboutPage() {
  return (
    <React.Fragment>
      <section className="page-hero">
        <div className="container-narrow">
          <div className="eyebrow">About</div>
          <h1>Isaac Adetoyese.<br/><em>The consultant behind the 90% win rate.</em></h1>
          <p className="lead">I write proposals that win federal, state, and municipal contracts for small and mid-size service businesses. This is the track record, and this is how I work.</p>
        </div>
      </section>

      <section className="bio-letter">
        <div className="container-narrow prose">
          <p>I am a government contracting consultant. My job is simple: I write the proposals that win your contracts.</p>
          <p>My clients come to me without any government contracting experience. They have a real business (laundry, cleaning, advertising, professional services) and they want a piece of the largest buyer on earth. Government agencies award billions every year to small businesses. The businesses that receive those awards do not win by luck. They win because their proposals are better. I make their proposals better.</p>
          <p>Across every solicitation I have written on behalf of a client, I have maintained a <strong>90% award rate</strong>. The contracts in my portfolio range from a $138,540 municipal award to a five-year federal Blanket Purchase Agreement at Wright-Patterson Air Force Base. My clients range from women-owned small businesses earning their first government dollar to mid-size firms expanding from commercial into federal procurement.</p>
          <p>What I bring is not magic. It is method. I read the solicitation the way the contracting officer reads it. I write to the evaluation criteria, not to the questions. I price to win and to deliver. I treat compliance as table stakes, not a feature. And I tell every client, in writing, before any work begins, whether a contract is worth bidding on at all.</p>
          <p>I do not work with every business that contacts me. The ones I work with are ready to compete. They have the capacity to deliver. They have made the operational decisions a contracting officer needs to see. And they understand that winning a government contract is the start of work, not the end of it.</p>
          <p>If that sounds like your business, I would like to hear from you.</p>
          <p className="signature">Isaac</p>
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
              <div className="sub">Award rate across all proposals submitted on behalf of clients since the practice opened.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why clients win */}
      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Why clients win</div>
            <h2>Three things I do that most consultants skip.</h2>
          </div>
          <div className="process-grid">
            <div className="process-step">
              <div className="n">01</div>
              <div>
                <h3>I tell you when not to bid</h3>
                <p>Every engagement starts with a written go or no-go recommendation. If the contract is not winnable because of capability gaps, competition, or a wired incumbent, I tell you before you spend a dollar on proposal development. Most consultants skip this step because it costs them a fee. I do it because it is the only way to maintain a 90% win rate.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="n">02</div>
              <div>
                <h3>I write to the scoring sheet</h3>
                <p>Every proposal is evaluated against criteria. Most proposals answer the questions. My proposals answer how the evaluator will score them. That is not the same thing. Knowing which sections carry the most weight, and writing to those weights explicitly, is where proposals are won before the contracting officer opens the cover page.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="n">03</div>
              <div>
                <h3>I manage compliance end-to-end</h3>
                <p>A non-compliant proposal is disqualified regardless of quality. I track every requirement from Section L and Section M, build a compliance matrix, and conduct a final compliance review before submission. My clients do not lose on technicalities.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="n">04</div>
              <div>
                <h3>I position you, not just describe you</h3>
                <p>The winning proposal does not just meet requirements. It makes you the lowest-risk, highest-confidence choice in the field. I develop win themes that position your specific capabilities, certifications, and past performance against what the evaluator is actually looking for. That is what made 3XG Enterprises the highest-rated proposal among all vendors for RBHA.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container">
          <h2>Ready to see what a winning proposal looks like for your business?</h2>
          <p className="lead">The first conversation is free. Send me a note about your business and the solicitation you are considering. I respond within one business day.</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => openBooking()}>Book a consultation <span>→</span></button>
            <a className="btn btn-secondary" href="#/contracts">See contracts I have won</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
window.AboutPage = AboutPage;
