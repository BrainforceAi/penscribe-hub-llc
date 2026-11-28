#!/usr/bin/env node
// Collects real offshore jobs for every approved country from JobsPipe and writes them as a JSON list.
// Docs: https://jobspipe.dev/llms.txt   (POST https://api.jobspipe.dev/v1/jobs/search, Bearer key)
//
//   JOBSPIPE_API_KEY=jp_live_... node offshore/ingest/jobspipe-offshore.mjs out.json [perCall=60] [maxCredits=300]
//
// Each job returned for the first time costs 1 credit; jobs already paid for cost nothing, so re-runs are cheap.
// Only roles whose TITLE is clearly offshore work are kept, and only in the approved country list.

import { writeFileSync } from "node:fs";

const KEY = process.env.JOBSPIPE_API_KEY;
if (!KEY) { console.error("Set JOBSPIPE_API_KEY first."); process.exit(1); }
const OUT = process.argv[2] || "jobspipe-offshore.json";
const PER_CALL = Math.max(1, Math.min(100, Number(process.argv[3]) || 60));
const MAX_CREDITS = Number(process.argv[4]) || 300;

// ISO code -> approved country slug (same list as src/lib/jobs-geo.js HINT_CODES)
export const CODES = { GB: "united-kingdom", US: "usa-gulf-of-mexico", CA: "canada", AU: "australia", IE: "ireland", NL: "netherlands", NO: "norway", DK: "denmark", ZA: "south-africa", BR: "brazil", MX: "mexico", AR: "argentina", CO: "colombia", AE: "uae", SA: "saudi-arabia", QA: "qatar", KW: "kuwait", OM: "oman", BH: "bahrain", IQ: "iraq", TT: "trinidad-tobago", AZ: "azerbaijan", KZ: "kazakhstan", GY: "guyana", SR: "suriname" };

export const TITLE_TERMS = ["offshore", "roustabout", "driller", "drilling rig", "rig crew", "rigger", "toolpusher", "subsea", "ROV", "FPSO", "deckhand", "dynamic positioning", "wireline", "mooring", "wellsite", "platform operator", "OIM"];
export const OFFSHORE_TITLE = /offshore|off-shore|roustabout|driller|drilling|rig\b|rigger|toolpusher|derrick|subsea|\brov\b|fpso|deckhand|deck hand|dynamic positioning|\bdpo\b|wireline|mooring|well ?site|platform|\boim\b|vessel|marine/i;
export const NOT_FIELD = /researcher|professor|phd|lecturer|sales|account manager|recruit|attorney|lawyer|counsel|marketing|software|accountant|payroll|hr business|talent/i;

const chunk = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));
const since = new Date(Date.now() - 45 * 864e5).toISOString().slice(0, 10);
const seen = new Map();
let left = null, charged = 0;

for (const group of chunk(Object.keys(CODES), 5)) {
  if (charged >= MAX_CREDITS || (left != null && left < 100)) { console.error("credit guard reached, stopping"); break; }
  const res = await fetch("https://api.jobspipe.dev/v1/jobs/search", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ job_title_or: TITLE_TERMS, job_country_code_or: group, posted_at_gte: since, limit: PER_CALL }),
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) { console.error(group.join(","), "HTTP", res.status, (await res.text()).slice(0, 200)); continue; }
  const { metadata = {}, data = [] } = await res.json();
  charged += metadata.credits_charged || 0; left = metadata.credits_remaining ?? left;
  let kept = 0;
  for (const j of data) {
    const slug = CODES[(j.country_code || "").toUpperCase()];
    if (!slug || j.status === "closed" || !OFFSHORE_TITLE.test(j.job_title || "") || NOT_FIELD.test(j.job_title || "")) continue;
    if (!seen.has(j.url || j.id)) { seen.set(j.url || j.id, { title: j.job_title, company: j.company || "", location: [j.location, j.country].filter(Boolean).join(", "), country: j.country, slug, posted_at: String(j.date_posted || "").slice(0, 10), apply_url: j.url, description: String(j.description || "").replace(/\s+/g, " ").slice(0, 200) }); kept++; }
  }
  console.error(`${group.join(",")}: ${data.length} returned, ${kept} kept, charged ${metadata.credits_charged}, left ${left}`);
}
const jobs = [...seen.values()];
writeFileSync(OUT, JSON.stringify(jobs));
console.error(`done: ${jobs.length} jobs, ${charged} credits used, ${left} left`);
