// CTA.jsx — closing call-to-action band.
function CTA({ onBookCall }) {
  return (
    <section className="cta-band" id="about">
      <div className="container">
        <div className="eyebrow">Ready to Win Your Next Contract?</div>
        <h2>If you have an opportunity and you are ready to compete, let's talk.</h2>
        <p className="lead">I work with service businesses who are serious about entering or growing in government contracting. From SAM.gov registration through full proposal development and submission.</p>
        <div className="row">
          <button className="btn btn-primary" onClick={onBookCall}>Book a consultation <span>→</span></button>
          <a className="btn btn-secondary" href="mailto:isaac@penscribe.example">Email Isaac directly</a>
        </div>
      </div>
    </section>
  );
}

window.CTA = CTA;
