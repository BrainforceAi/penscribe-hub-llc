#!/usr/bin/env node
// Prints company, title, location and salary for senior backend roles from the JobsPipe jobs API.
// Docs: https://jobspipe.dev/llms.txt  (POST https://api.jobspipe.dev/v1/jobs/search, Bearer key)
//
// Usage:
//   JOBSPIPE_API_KEY=jp_live_... node offshore/ingest/jobspipe-senior-backend.mjs [limit]
// The key is read from the environment so it never lands in the repository.
// Each job returned uses 1 credit (the free tier gives 1,000 once), so the default limit is small.

const KEY = process.env.JOBSPIPE_API_KEY;
if (!KEY) {
  console.error("Set JOBSPIPE_API_KEY first, e.g.  JOBSPIPE_API_KEY=jp_live_... node " + process.argv[1]);
  process.exit(1);
}
const limit = Math.max(1, Math.min(100, Number(process.argv[2]) || 10));

const res = await fetch("https://api.jobspipe.dev/v1/jobs/search", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    job_title_or: ["senior backend engineer", "senior backend developer", "senior back-end engineer"],
    limit,
  }),
  signal: AbortSignal.timeout(30000),
});

if (!res.ok) {
  console.error(`JobsPipe returned HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}

const { metadata = {}, data = [] } = await res.json();

// Salary comes as free text (salary_string) and/or parsed yearly min/max in the posting's currency.
const money = (job) => {
  if (job.salary_string) return job.salary_string;
  const { min_annual_salary: min, max_annual_salary: max, salary_currency: cur } = job;
  if (min == null && max == null) return "not stated";
  const fmt = (n) => Number(n).toLocaleString("en-US");
  const range = min != null && max != null && min !== max ? `${fmt(min)}-${fmt(max)}` : fmt(min ?? max);
  return `${range} ${cur || ""} a year`.trim();
};

console.log(`Senior backend roles: showing ${data.length} of ${metadata.total_results ?? "more than shown"}\n`);
for (const job of data) {
  console.log(`${job.company || "Employer not named"} | ${job.job_title || ""} | ${job.location || "location not stated"} | ${money(job)}`);
}
