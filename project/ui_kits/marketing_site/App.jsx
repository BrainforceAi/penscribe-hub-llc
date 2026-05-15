// App.jsx — composes the marketing site.
const { useState: useStateApp } = React;

function BookingModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="eyebrow" style={{color: 'var(--ps-brand)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700}}>Discovery call</div>
        <h3 style={{marginTop: 8}}>Tell me about your opportunity.</h3>
        <p>I will review your solicitation, evaluate fit, and tell you within 48 hours whether to bid. There is no charge for the initial review.</p>
        <div style={{marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12}}>
          <input className="" placeholder="Your name" style={{padding: '12px 14px', border: '1px solid var(--border-1)', borderRadius: 4, fontFamily: 'var(--font-sans)', fontSize: 14}}/>
          <input className="" placeholder="Company" style={{padding: '12px 14px', border: '1px solid var(--border-1)', borderRadius: 4, fontFamily: 'var(--font-sans)', fontSize: 14}}/>
          <input className="" placeholder="Solicitation number (optional)" style={{padding: '12px 14px', border: '1px solid var(--border-1)', borderRadius: 4, fontFamily: 'var(--font-sans)', fontSize: 14}}/>
        </div>
        <div style={{display: 'flex', gap: 12, marginTop: 20, alignItems: 'center'}}>
          <button className="btn btn-primary">Send to Isaac <span>→</span></button>
          <button className="modal-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showBooking, setShowBooking] = useStateApp(false);
  const onBookCall = () => setShowBooking(true);
  return (
    <React.Fragment>
      <Nav onBookCall={onBookCall} />
      <Hero onBookCall={onBookCall} />
      <StatStrip />
      <Process />
      <Contracts />
      <Services />
      <Testimonial />
      <CTA onBookCall={onBookCall} />
      <Footer />
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
