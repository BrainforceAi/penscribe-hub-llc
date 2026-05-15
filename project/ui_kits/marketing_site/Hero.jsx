// Hero.jsx — above-the-fold value statement + dual CTA + credentials.
function Hero({ onBookCall }) {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="eyebrow">Government Contracting Consultancy</div>
        <h1>
          You bring the business.<br/>
          <em>I bring the contract.</em>
        </h1>
        <p className="lead">
          I help small and mid-size service businesses enter and win federal, state, and municipal contracts. End-to-end ownership of the proposal, from solicitation analysis to submission. 90% award rate.
        </p>
        <div className="cta-row">
          <button className="btn btn-primary" onClick={onBookCall}>Book a consultation <span>→</span></button>
          <a className="btn btn-secondary" href="#contracts">See the contracts I have won</a>
        </div>
        <div className="creds">
          <span className="cert-chip">CPCM Certified</span>
          <span className="cert-chip">FAC-C Certified</span>
          <span className="cert-chip">Top Rated · Upwork</span>
          <span className="cert-chip">90% Win Rate</span>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
