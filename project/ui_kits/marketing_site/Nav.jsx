// Nav.jsx — sticky top nav with wordmark, links, primary CTA.
const { useEffect, useState } = React;

function Nav({ onBookCall }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-mark">
          <img src="../../assets/penscribe-logo-on-white.jpg" alt="The PenScribe" />
          <div className="word">
            <div className="t">THE</div>
            <div className="p">PENSCRIBE</div>
          </div>
        </a>
        <div className="nav-links">
          <a href="#process">Process</a>
          <a href="#contracts">Contracts</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <button className="btn btn-primary" style={{padding: '10px 18px', fontSize: 14}} onClick={onBookCall}>
            Book a consultation <span>→</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

window.Nav = Nav;
