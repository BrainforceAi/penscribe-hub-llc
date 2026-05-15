// App-print.jsx — renders every page in sequence for PDF export.
function NotFoundPage() { return null; }
window.NotFoundPage = NotFoundPage;

function PageBreak({ label }) {
  return (
    <div className="print-section-divider" data-label={label}>
      <div className="container">
        <div className="eyebrow" style={{paddingTop: 48, paddingBottom: 8}}>{label}</div>
      </div>
    </div>
  );
}

function PrintApp() {
  React.useEffect(() => {
    setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 50);
  }, []);

  const services = window.PS_SERVICES.filter(s => s.featured);
  const contracts = window.PS_CONTRACTS;

  return (
    <React.Fragment>
      {/* Print cover */}
      <section className="print-cover">
        <div className="container">
          <div className="cover-mark">
            <img src="../assets/penscribe-logo-on-white.jpg" alt=""/>
            <div className="word">
              <div className="t">THE</div>
              <div className="p">PENSCRIBE</div>
            </div>
          </div>
          <div className="cover-eyebrow">Government Contracting Consultancy</div>
          <h1>You bring the business.<br/><em>I bring the contract.</em></h1>
          <p className="cover-lead">I help small and mid-size service businesses enter and win federal, state, and municipal contracts. End-to-end ownership of the proposal — from solicitation analysis to submission. 90% award rate.</p>
          <div className="cover-creds">
            <span className="cert-chip">CPCM Certified</span>
            <span className="cert-chip">FAC-C Certified</span>
            <span className="cert-chip">Top Rated · Upwork</span>
            <span className="cert-chip">90% Win Rate</span>
          </div>
          <div className="cover-foot">
            <div>isaac@thepenscribehub.com</div>
            <div>thepenscribehub.com</div>
            <div>Confidential</div>
          </div>
        </div>
      </section>

      {/* HOME */}
      <PageBreak label="01 · Home" />
      <div className="print-page"><HomePage /></div>

      {/* ABOUT */}
      <PageBreak label="02 · About" />
      <div className="print-page"><AboutPage /></div>

      {/* SERVICES INDEX */}
      <PageBreak label="03 · Services" />
      <div className="print-page"><ServicesPage /></div>

      {/* SERVICE DETAILS */}
      {services.map(s => (
        <React.Fragment key={s.slug}>
          <PageBreak label={`Service · ${s.name}`} />
          <div className="print-page"><ServiceDetailPage slug={s.slug} /></div>
        </React.Fragment>
      ))}

      {/* CONTRACTS INDEX */}
      <PageBreak label="04 · Contracts" />
      <div className="print-page"><ContractsPage /></div>

      {/* CONTRACT DETAILS */}
      {contracts.map(c => (
        <React.Fragment key={c.slug}>
          <PageBreak label={`Contract ${c.n} · ${c.title}`} />
          <div className="print-page"><ContractDetailPage slug={c.slug} /></div>
        </React.Fragment>
      ))}

      {/* CONTACT */}
      <PageBreak label="05 · Contact" />
      <div className="print-page"><ContactPage /></div>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PrintApp />);

// Wait for fonts + a tick, then print.
(async function autoPrint() {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) {}
  await new Promise(r => setTimeout(r, 800));
  if (window.lucide) window.lucide.createIcons();
  await new Promise(r => setTimeout(r, 300));
  window.print();
})();
