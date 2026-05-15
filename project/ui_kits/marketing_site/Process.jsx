// Process.jsx — four-step "How I Work" section.
const PROCESS_STEPS = [
  {
    n: '01', t: 'Opportunity Analysis',
    d: "I review the full solicitation, evaluate fit against your capabilities, identify evaluation criteria and scoring weights, flag compliance risks, and give you a clear go or no-go recommendation before any writing begins. You never waste money bidding on contracts you cannot win.",
  },
  {
    n: '02', t: 'Strategy & Research',
    d: "I map your strengths against the agency's stated priorities, research competing vendors, develop your win themes, and build the pricing strategy. This is where the proposal is won before a single word is written.",
  },
  {
    n: '03', t: 'Proposal Development',
    d: "I write all required volumes including technical approach, management plan, past performance, pricing narrative, and compliance matrix. Every section is written to evaluation criteria, not just to answer the question.",
  },
  {
    n: '04', t: 'Submission & Support',
    d: "I conduct a final compliance review before submission. After award or rejection I can provide debrief analysis to identify what worked and what to improve on the next bid.",
  },
];

function Process() {
  return (
    <section className="section" id="process">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">How I Work</div>
          <h2>A four-step process designed to win.</h2>
          <p className="lead">Every engagement follows the same structure. Here is what working with me looks like from start to finish.</p>
        </div>
        <div className="process-grid">
          {PROCESS_STEPS.map(step => (
            <div className="process-step" key={step.n}>
              <div className="n">{step.n}</div>
              <div>
                <h3>{step.t}</h3>
                <p>{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Process = Process;
