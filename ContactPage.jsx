// ContactPage.jsx
const { useState: useStateContact } = React;

function ContactPage() {
  const [form, setForm] = useStateContact({
    name: '', email: '', company: '', solicitation: '', agency: 'Federal', service: '', message: '',
  });
  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    const subject = `Consultation request: ${form.company || form.name || 'New inquiry'}`;
    const body = [
      `From: ${form.name} <${form.email}>`,
      `Company: ${form.company}`,
      `Agency type: ${form.agency}`,
      `Solicitation: ${form.solicitation || 'Not provided'}`,
      `Interested in: ${form.service || 'Not specified'}`,
      '',
      'Message:',
      form.message,
    ].join('\r\n');
    window.location.href = `mailto:isaac@thepenscribe.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <React.Fragment>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Contact</div>
          <h1>Tell us about your <em>opportunity.</em></h1>
          <p className="lead">The first review is free. Our team responds within one business day. If the contract is not winnable, we will tell you that in writing before you spend a dollar on proposal development.</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="contact-grid">
            <div className="contact-card">
              <form onSubmit={onSubmit}>
                <div className="row-2">
                  <div className="field">
                    <label>Your name</label>
                    <input required value={form.name} onChange={onChange('name')} placeholder="Edith Neal"/>
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input required type="email" value={form.email} onChange={onChange('email')} placeholder="you@company.com"/>
                  </div>
                </div>
                <div className="row-2">
                  <div className="field">
                    <label>Company</label>
                    <input required value={form.company} onChange={onChange('company')} placeholder="Your business name"/>
                  </div>
                  <div className="field">
                    <label>Agency type</label>
                    <select value={form.agency} onChange={onChange('agency')}>
                      <option>Federal</option>
                      <option>State</option>
                      <option>Municipal</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Solicitation number or link <span style={{color:'var(--fg-4)',fontWeight:400,textTransform:'none',letterSpacing:0}}>(optional)</span></label>
                  <input value={form.solicitation} onChange={onChange('solicitation')} placeholder="e.g. FA480325A0013 or sam.gov link"/>
                  <div className="help">If you have an RFP or RFQ on the table, share it for a free go or no-go review.</div>
                </div>
                <div className="field">
                  <label>Interested in</label>
                  <select value={form.service} onChange={onChange('service')}>
                    <option value="">Choose one (optional)</option>
                    <option>Proposal Preparation</option>
                    <option>RFP and Solicitation Analysis</option>
                    <option>SAM.gov Registration</option>
                    <option>SBA Certifications</option>
                    <option>Capability Statement</option>
                    <option>Other or not sure yet</option>
                  </select>
                </div>
                <div className="field">
                  <label>Message</label>
                  <textarea required value={form.message} onChange={onChange('message')} placeholder="Tell us about your business, your past government contracting experience, and the contract you are trying to win."></textarea>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap'}}>
                  <div style={{fontFamily:'var(--font-sans)',fontSize:13,color:'var(--fg-3)'}}>This opens your email client with the message pre-filled.</div>
                  <button type="submit" className="btn btn-primary">Send to our team <span>→</span></button>
                </div>
              </form>
            </div>

            <div className="contact-info">
              <dl>
                <div>
                  <dt>Email</dt>
                  <dd><a href="mailto:isaac@thepenscribe.com">isaac@thepenscribe.com</a></dd>
                </div>
                <div>
                  <dt>Upwork</dt>
                  <dd>
                    <a href="https://www.upwork.com/freelancers/~018a7b32ee0a61e4d0" target="_blank" rel="noopener">Top Rated profile</a>
                    <br/>
                    <span style={{fontSize:13,color:'var(--fg-3)'}}>For contract engagements through the platform.</span>
                  </dd>
                </div>
                <div>
                  <dt>LinkedIn</dt>
                  <dd><a href="https://www.linkedin.com/in/isaac-adetoyese" target="_blank" rel="noopener">/in/isaac-adetoyese</a></dd>
                </div>
                <div>
                  <dt>Working hours</dt>
                  <dd>
                    Monday through Friday
                    <br/>
                    <span style={{fontSize:14,color:'var(--fg-3)'}}>Sub-72 hour deadline requests considered case by case. Mark your subject line URGENT.</span>
                  </dd>
                </div>
              </dl>

              <div className="response-promise">
                <div className="lbl">Response Promise</div>
                <p>Our team replies to every legitimate inquiry within one business day. If your solicitation deadline is within 5 business days, mark your email <strong>URGENT</strong> in the subject line and we will prioritize it.</p>
              </div>

              <div style={{marginTop: 28, padding: '20px 24px', background: 'var(--ps-tint)', borderRadius: 8, border: '1px solid var(--border-1)'}}>
                <div style={{fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-4)', marginBottom: 8}}>First engagement</div>
                <div style={{fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 6}}>The first review is always free.</div>
                <div style={{fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5}}>Send us your RFP. We will evaluate it and tell you whether it is worth bidding before you commit to anything. No invoice. No obligation.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
window.ContactPage = ContactPage;
