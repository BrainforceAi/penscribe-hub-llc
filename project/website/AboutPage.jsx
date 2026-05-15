// AboutPage.jsx
function AboutPage() {
  return (
    <React.Fragment>
      <section className="page-hero">
        <div className="container-narrow">
          <div className="eyebrow">About</div>
          <h1>Isaac Adetoyese.<br/><em>Proposal strategist for the businesses that are ready.</em></h1>
        </div>
      </section>

      <section className="bio-letter">
        <div className="container-narrow prose">
          <p>I am a government contracting consultant who writes the proposals that win federal, state, and municipal contracts for small and mid-size service businesses.</p>
          <p>My clients typically come to me without any government contracting experience. They have a real business — laundry, cleaning, advertising, professional services — and they want a piece of the largest customer on earth. They have heard that government work is good, recurring revenue. They are right. They have also heard that the proposal process is impenetrable. That is where I come in.</p>
          <p>Across every solicitation I have written on behalf of a client, I have maintained a <strong>90% award rate</strong>. The contracts in my portfolio range from a $138,540 municipal lot-cleaning award to a five-year federal Blanket Purchase Agreement at Wright-Patterson Air Force Base. The clients range from women-owned small businesses with no prior government revenue to mid-size firms expanding from commercial into federal.</p>
          <p>What I bring is not magic. It is method. I read the solicitation the way the contracting officer reads it. I write to the evaluation criteria, not to the questions. I price to win and to deliver. I treat compliance as table stakes, not a feature. And I tell my clients, in writing and before any work begins, whether a contract is worth bidding on at all.</p>
          <p>I do not work with every business that contacts me. The ones I work with are ready to compete — they have the capacity to deliver, they have made the operational decisions a contracting officer wants to see, and they understand that winning a government contract is the start of work, not the end of it.</p>
          <p>If that sounds like your business, I would like to hear from you.</p>
          <p className="signature">— Isaac</p>
        </div>

        <div className="container-narrow">
          <div className="creds-grid">
            <div className="cred-cell">
              <div className="k">Certifications</div>
              <div className="v" style={{fontSize: 22}}>CPCM · FAC-C</div>
              <div className="sub">Certified Professional Contracts Manager and FAC-C credentialed in federal acquisition.</div>
            </div>
            <div className="cred-cell">
              <div className="k">Platform Status</div>
              <div className="v" style={{fontSize: 22}}>Top Rated</div>
              <div className="sub">Top Rated on Upwork with verified client testimonials and contract documentation.</div>
            </div>
            <div className="cred-cell">
              <div className="k">Track Record</div>
              <div className="v">90%</div>
              <div className="sub">Award rate across all proposals submitted on behalf of clients to date.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container">
          <h2>Ready to talk about your opportunity?</h2>
          <p className="lead">Send me a note about your business and any solicitation you are considering. The first review is free.</p>
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
