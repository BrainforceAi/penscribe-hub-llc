// StatStrip.jsx — full-bleed brand-blue stats bar.
function StatStrip() {
  return (
    <section className="stat-strip">
      <div className="container">
        <div className="stat-strip-inner">
          <div className="s">
            <div className="num">90%</div>
            <div className="lab">Proposal Win Rate</div>
            <div className="sub">Across all submitted proposals</div>
          </div>
          <div className="s">
            <div className="num">$124K</div>
            <div className="lab">Largest Annual Award</div>
            <div className="sub">Richmond Behavioral Health Authority, 2025</div>
          </div>
          <div className="s">
            <div className="num">3</div>
            <div className="lab">Agency Types Served</div>
            <div className="sub">Federal · State · Municipal</div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.StatStrip = StatStrip;
