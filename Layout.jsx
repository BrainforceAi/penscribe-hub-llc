// Layout.jsx — Nav, Footer, BookingModal, hash router.
const { useEffect, useState } = React;

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

function parseRoute(hash) {
  const h = (hash || '#/').replace(/^#/, '') || '/';
  const parts = h.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'about') return { name: 'about' };
  if (parts[0] === 'services' && parts.length === 1) return { name: 'services' };
  if (parts[0] === 'services' && parts[1]) return { name: 'service-detail', slug: parts[1] };
  if (parts[0] === 'contracts' && parts.length === 1) return { name: 'contracts' };
  if (parts[0] === 'contracts' && parts[1]) return { name: 'contract-detail', slug: parts[1] };
  if (parts[0] === 'contact') return { name: 'contact' };
  return { name: '404' };
}
window.parseRoute = parseRoute;
window.useHashRoute = useHashRoute;

// ===== Booking modal =====
function BookingModal() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  useEffect(() => {
    const onOpen = (e) => { setSubject((e && e.detail && e.detail.subject) || ''); setOpen(true); };
    const onClose = () => setOpen(false);
    window.addEventListener('ps:open-booking', onOpen);
    window.addEventListener('ps:close-booking', onClose);
    return () => {
      window.removeEventListener('ps:open-booking', onOpen);
      window.removeEventListener('ps:close-booking', onClose);
    };
  }, []);
  if (!open) return null;
  const body = `Hi,%0D%0A%0D%0AWe would like to discuss${subject ? ` "${subject}"` : ' a government contracting opportunity'}.%0D%0A%0D%0AAbout our business:%0D%0A%0D%0A%0D%0ARelevant solicitation (if any):%0D%0A%0D%0A%0D%0AThank you,%0D%0A`;
  const mailto = `mailto:isaac@thepenscribe.com?subject=${encodeURIComponent('Consultation request' + (subject ? ': ' + subject : ''))}&body=${body}`;
  return (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="eyebrow">Start the conversation</div>
        <h3 style={{marginTop: 8}}>Tell us about your opportunity.</h3>
        <p>Send us a short note about your business, the solicitation (if you have one), and your timeline. Our team will reply within one business day. There is no charge for the first review.</p>
        <div style={{marginTop: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'}}>
          <a className="btn btn-primary" href={mailto}>Open email <span>→</span></a>
          <a className="btn btn-secondary" href="#/contact" onClick={() => setOpen(false)}>Use the contact form</a>
        </div>
        <button className="modal-close" onClick={() => setOpen(false)}>Close</button>
      </div>
    </div>
  );
}
window.BookingModal = BookingModal;
window.openBooking = (subject) => window.dispatchEvent(new CustomEvent('ps:open-booking', { detail: { subject } }));

// ===== Nav =====
function NavLink({ href, current, children }) {
  const path = (current.replace(/^#/, '') || '/').split('/')[1] || '';
  const linkPath = href.replace(/^#\//, '').split('/')[0] || '';
  const active = path === linkPath;
  return <a href={href} className={active ? 'active' : ''}>{children}</a>;
}

function Nav() {
  const hash = useHashRoute();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [hash]);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#/" className="nav-mark">
          <img src="project/assets/penscribe-logo-on-white.jpg" alt="The Penscribe" />
          <div className="word">
            <div className="t">THE</div>
            <div className="p">PENSCRIBE</div>
          </div>
        </a>
        <button className={`nav-hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink href="#/about" current={hash}>About</NavLink>
          <NavLink href="#/services" current={hash}>Services</NavLink>
          <NavLink href="#/contracts" current={hash}>Contracts Won</NavLink>
          <NavLink href="#/contact" current={hash}>Contact</NavLink>
          <button className="btn btn-primary" style={{padding: '10px 18px', fontSize: 14}} onClick={() => { setMenuOpen(false); openBooking(); }}>
            Book a consultation <span>→</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
window.Nav = Nav;

// ===== Footer =====
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-mark">
              <img src="project/assets/penscribe-logo-on-blue.jpg" alt="The Penscribe" />
              <div className="word"><div className="t">THE</div><div className="p">PENSCRIBE</div></div>
            </div>
            <p className="footer-bio">Government contracting consultancy. Full-cycle proposal strategy and writing for service businesses entering federal, state, and municipal procurement. 90% proposal win rate across all engagements.</p>
          </div>
          <div>
            <h5>Navigate</h5>
            <ul>
              <li><a href="#/about">About Us</a></li>
              <li><a href="#/services">Services</a></li>
              <li><a href="#/contracts">Contracts Won</a></li>
              <li><a href="#/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li><a href="https://www.upwork.com/freelancers/~018a7b32ee0a61e4d0" target="_blank" rel="noopener">Upwork profile</a></li>
              <li><a href="https://www.linkedin.com/in/isaac-adetoyese" target="_blank" rel="noopener">LinkedIn</a></li>
              <li><a href="mailto:isaac@thepenscribe.com">isaac@thepenscribe.com</a></li>
            </ul>
          </div>
          <div>
            <h5>Credentials</h5>
            <ul>
              <li>CPCM Certified</li>
              <li>FAC-C Certified</li>
              <li>Top Rated on Upwork</li>
              <li>90% proposal win rate</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>2026 The Penscribe. All rights reserved.</div>
          <div>CPCM, FAC-C Certified</div>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
