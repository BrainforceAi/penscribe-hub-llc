// Footer.jsx — slim footer with contact, social, certifications.
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-mark">
              <img src="../../assets/penscribe-logo-on-blue.jpg" alt="The PenScribe" />
              <div className="word"><div className="t">THE</div><div className="p">PENSCRIBE</div></div>
            </div>
            <p className="footer-bio">Government contracting consultancy. Proposal strategy and writing for service businesses entering federal, state, and municipal procurement.</p>
          </div>
          <div>
            <h5>Find Me</h5>
            <ul>
              <li><a href="#">Upwork profile</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="mailto:isaac@penscribe.example">Email Isaac</a></li>
            </ul>
          </div>
          <div>
            <h5>Services</h5>
            <ul>
              <li><a href="#services">Proposal preparation</a></li>
              <li><a href="#services">SAM.gov registration</a></li>
              <li><a href="#services">SBA certifications</a></li>
              <li><a href="#services">RFP analysis</a></li>
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
          <div>© 2026 The PenScribe Hub. All rights reserved.</div>
          <div>Confidential · CPCM, FAC-C Certified</div>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
