// ContractDetailPage.jsx
function ContractDetailPage({ slug }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  const c = window.PS_CONTRACTS.find(c => c.slug === slug);
  if (!c) return <NotFoundPage />;
  const idx = window.PS_CONTRACTS.findIndex(x => x.slug === slug);
  const next = window.PS_CONTRACTS[(idx + 1) % window.PS_CONTRACTS.length];
  return (
    <React.Fragment>
      <section className="service-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="#/contracts">Contracts</a><span className="sep">/</span>Contract {c.n}
          </div>
          <div style={{marginTop: 24}}>
            <div className="eyebrow">Contract {c.n} · {c.agencyType}</div>
            <h1 style={{fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.015em', marginTop: 10, color: 'var(--fg-1)', maxWidth: 1100}}>{c.title}</h1>
            <p style={{fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--fg-3)', marginTop: 16}}>{c.client} · {c.agency}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="detail-layout">
            <div className="detail-prose">
              <h2>Scope of Work</h2>
              {c.scopeParas.map((p, i) => <p key={i}>{p}</p>)}

              <h2>My Contribution</h2>
              {c.contributionParas.map((p, i) => <p key={i}>{p}</p>)}

              <h2>{c.outcomeHead}</h2>
              <p>{c.outcomeBody}</p>

              {c.quote && (
                <div style={{marginTop: 40, padding: '32px 36px', background: 'var(--ps-blue-50)', borderLeft: '3px solid var(--ps-brand)', borderRadius: 4}}>
                  <div style={{fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 24, lineHeight: 1.4, color: 'var(--fg-1)'}}>"{c.quote.text}"</div>
                  <div style={{fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ps-brand)', marginTop: 18}}>
                    {c.quote.author} · {c.quote.role}
                  </div>
                </div>
              )}
            </div>

            <aside className="detail-sidebar">
              <div className="detail-meta-card">
                <span className="badge"><span className="dot"></span>Contract Awarded</span>
                <dl>
                  {c.fields.map(([k, v, mono]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd className={mono ? 'mono' : ''}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="cta-block">
                  <p>Have a similar opportunity? Send it to me and I will tell you if it is worth bidding.</p>
                  <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}} onClick={() => openBooking(`Contract similar to ${c.title}`)}>
                    Discuss your opportunity <span>→</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="related-services">
        <div className="container">
          <h3>Next contract</h3>
          <a className="contract-card" href={`#/contracts/${next.slug}`} style={{display: 'block'}}>
            <div className="contract-head">
              <div>
                <div className="contract-eyebrow">Contract {next.n} · {next.agencyType}</div>
                <div className="contract-title">{next.title}</div>
                <div className="contract-sub">{next.client} · {next.agency} · {next.sub}</div>
              </div>
              <span className="contract-badge"><span className="dot"></span>Contract Awarded</span>
            </div>
          </a>
        </div>
      </section>
    </React.Fragment>
  );
}
window.ContractDetailPage = ContractDetailPage;
