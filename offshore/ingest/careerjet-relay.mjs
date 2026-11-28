#!/usr/bin/env node
// Collects offshore jobs from Careerjet and sends them to the website. Run it on a machine with a FIXED public
// IP address (a small VPS), because Careerjet only answers requests from IP addresses registered to your key.
// Base44 and GitHub change address between runs, so they cannot be registered.
//
//   CAREERJET_KEY=...  SITE_URL=https://lean-web-flow-forge.base44.app  INGEST_TOKEN=...  \
//   PUBLIC_IP=203.0.113.10  node careerjet-relay.mjs
//
// PUBLIC_IP is the server's own public address (the one you register in your Careerjet publisher account).
// Schedule it once a day, for example:  17 5 * * *  cd /opt/relay && node careerjet-relay.mjs >> relay.log 2>&1
// The website applies the same rules as its own sync: approved countries only, offshore roles only, no duplicates.

const { CAREERJET_KEY, SITE_URL, INGEST_TOKEN, PUBLIC_IP } = process.env;
if (!CAREERJET_KEY || !SITE_URL || !INGEST_TOKEN || !PUBLIC_IP) {
  console.error("Set CAREERJET_KEY, SITE_URL, INGEST_TOKEN and PUBLIC_IP first.");
  process.exit(1);
}

const LOCALES = {
  gb: "en_GB", us: "en_US", ca: "en_CA", au: "en_AU", ie: "en_IE", nl: "nl_NL", no: "no_NO", dk: "da_DK", za: "en_ZA",
  br: "pt_BR", mx: "es_MX", ar: "es_AR", co: "es_CO", ae: "en_AE", sa: "en_SA", qa: "en_QA", kw: "en_KW", om: "en_OM",
  bh: "en_BH", iq: "en_IQ", tt: "en_TT", az: "en_AZ", kz: "en_KZ", gy: "en_GY",
};
const QUERIES = ["offshore", "oil and gas rig", "drilling rig", "subsea", "marine vessel crew", "roustabout", "FPSO"];
const PAGES = 3;
const auth = "Basic " + Buffer.from(`${CAREERJET_KEY}:`).toString("base64");
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const collected = new Map();
let calls = 0;
let blocked = false;

outer: for (const [code, locale] of Object.entries(LOCALES)) {
  for (const keywords of QUERIES) {
    for (let page = 1; page <= PAGES; page += 1) {
      calls += 1;
      const url = `https://search.api.careerjet.net/v4/query?locale_code=${locale}&keywords=${encodeURIComponent(keywords)}&sort=date&page=${page}&page_size=100&fragment_size=500&user_ip=${encodeURIComponent(PUBLIC_IP)}&user_agent=${encodeURIComponent("OffshoreRecruit/1.0")}`;
      const response = await fetch(url, { headers: { Authorization: auth }, signal: AbortSignal.timeout(30000) }).catch(() => null);
      if (!response) break;
      if (response.status === 401 || response.status === 403) {
        console.error("Careerjet refused this address:", (await response.text()).slice(0, 200));
        blocked = true;
        break outer;
      }
      if (!response.ok) break;
      const payload = await response.json().catch(() => ({}));
      const jobs = payload.type === "JOBS" ? payload.jobs || [] : [];
      for (const job of jobs) {
        if (job.url && !collected.has(job.url)) {
          collected.set(job.url, { title: job.title, company: job.company, location: job.locations, countryHint: code, apply_url: job.url, source: "careerjet.com", posted_at: job.date, description: job.description });
        }
      }
      if (jobs.length < 50) break;
      await wait(400);
    }
  }
}

const rows = [...collected.values()];
console.log(`${new Date().toISOString()} calls ${calls}, collected ${rows.length}${blocked ? ", stopped: address not registered" : ""}`);

let created = 0;
for (let i = 0; i < rows.length; i += 250) {
  const response = await fetch(`${SITE_URL.replace(/\/$/, "")}/api/jobs/ingest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${INGEST_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ jobs: rows.slice(i, i + 250) }),
    signal: AbortSignal.timeout(120000),
  });
  const result = await response.json().catch(() => ({}));
  console.log("site:", response.status, JSON.stringify(result));
  created += result.created || 0;
}
console.log(`done, ${created} new jobs added`);
