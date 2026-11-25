#!/usr/bin/env node
/**
 * Answers "how many offshore jobs can Careerjet get us?" with real data, and lists them.
 * Run it from the machine whose IP is registered in your Careerjet account:
 *   CAREERJET_API_KEY=... CAREERJET_USER_IP=<this machine's IP> node offshore/ingest/careerjet-survey.mjs
 * Writes ingest/state/careerjet-survey.csv (every job found) and prints totals. Changes nothing on the site.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadCountries, makeResolver } from "./lib/geo.mjs";
import { runIngest, DEFAULTS } from "./lib/engine.mjs";

const here = path.dirname(fileURLToPath(import.meta.url)), offshore = path.resolve(here, "..");
const csv = v => `"${String(v ?? "").replace(/"/g, '""').replace(/\s+/g, " ")}"`;

export async function survey({ config, fetchFn = fetch, env = process.env, today = new Date() }) {
  const src = (config.sources || []).find(s => s.type === "careerjet"); if (!src) throw new Error("No careerjet source in sources.json");
  const countries = await loadCountries(offshore), resolve = makeResolver(countries, config.excludeCountrySlugs ?? DEFAULTS.excludeCountrySlugs);
  const reported = {};   // what Careerjet itself says it has: hits per locale + query
  const spy = async (url, init) => { const res = await fetchFn(url, init); if (!res.ok) return res; const u = new URL(url), key = `${u.searchParams.get("locale_code")} | ${u.searchParams.get("keywords")}`;
    return { ok: true, status: res.status, json: async () => { const j = await res.json(); if (j.type === "JOBS" && u.searchParams.get("page") === "1") reported[key] = j.hits; return j; } }; };
  const state = { jobs: {} };
  const { report, publicJobs } = await runIngest({ config: { ...config, sources: [{ ...src, enabled: true }], targetActive: 1e9, shrinkGuard: 0 }, state, resolve, fetchFn: spy, env, today, allowShrink: true });
  const err = report.sources.careerjet && report.sources.careerjet.error; if (err) throw new Error(err);
  const byCountry = {}; for (const j of publicJobs) byCountry[j.country] = (byCountry[j.country] || 0) + 1;
  return { report, publicJobs, byCountry, reported };
}

async function main() {
  const config = JSON.parse(await readFile(path.join(here, "sources.json"), "utf8"));
  let r; try { r = await survey({ config }); } catch (e) { console.error("SURVEY FAILED: " + e.message + "\nIf this says 'Unauthorized access from IP', register this machine's IP in your Careerjet publisher account."); process.exit(1); }
  const total = r.publicJobs.length, cap = config.targetActive ?? DEFAULTS.targetActive;
  console.log(`\nCareerjet returned ${Object.values(r.reported).reduce((a, b) => a + b, 0).toLocaleString()} raw matches across all searches (many are repeats or not offshore).`);
  console.log(`After removing duplicates, non-offshore adverts, unapproved countries and adverts older than ${config.maxAgeDays ?? DEFAULTS.maxAgeDays} days:\n`);
  console.log(`  ${total} usable offshore jobs  (target ${cap}${total >= cap ? ", reached" : `, short by ${cap - total}`})\n`);
  console.log("By country:"); for (const [c, n] of Object.entries(r.byCountry).sort((a, b) => b[1] - a[1])) console.log("  " + String(n).padStart(5) + "  " + c);
  console.log("\nRejected:", JSON.stringify(r.report.rejected)); if (r.report.sources.careerjet.warnings) console.log("Warnings:\n  " + r.report.sources.careerjet.warnings.join("\n  "));
  const rows = [["title", "company", "country", "category", "listed", "stated rotation", "original advert"], ...r.publicJobs.map(j => [j.title, j.company, j.country, j.category, j.listedAt, j.rotation || "", j.url || ""])];
  const file = path.join(here, "state/careerjet-survey.csv"); await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, rows.map(x => x.map(csv).join(",")).join("\n"));
  console.log(`\nFull list written to ${file}`);
}
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) main();
