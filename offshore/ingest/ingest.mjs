#!/usr/bin/env node
/**
 * Daily job feed: fetch -> clean -> keep only real offshore adverts in approved countries -> add new, remove inactive -> publish.
 * Usage: node offshore/ingest/ingest.mjs [--dry] [--allow-shrink] [--config path] [--state path] [--out dir]
 * Env (only for sources you enable): ADZUNA_APP_ID, ADZUNA_APP_KEY, REED_API_KEY, PARTNER_FEED_TOKEN, ...
 * Node 18+, no dependencies. In this sandbox run with NODE_USE_ENV_PROXY=1.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadCountries, makeResolver } from "./lib/geo.mjs";
import { runIngest, DEFAULTS } from "./lib/engine.mjs";

const here = path.dirname(fileURLToPath(import.meta.url)), offshore = path.resolve(here, "..");
const readJson = async (p, d) => { try { return JSON.parse(await readFile(p, "utf8")); } catch { return d; } };

export async function main(argv = process.argv.slice(2), env = process.env, fetchFn = fetch) {
  const arg = n => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const configPath = arg("--config") || path.join(here, "sources.json"), statePath = arg("--state") || path.join(here, "state/jobs-state.json"), outDir = arg("--out") || path.join(offshore, "data");
  const config = await readJson(configPath, null); if (!config) throw new Error("Cannot read " + configPath);
  const state = await readJson(statePath, { jobs: {} }); state.jobs ||= {};
  const countries = await loadCountries(offshore), resolve = makeResolver(countries, config.excludeCountrySlugs ?? DEFAULTS.excludeCountrySlugs);
  const { report, publicJobs } = await runIngest({ config, state, resolve, fetchFn, env, today: new Date(), log: console.error, allowShrink: argv.includes("--allow-shrink") });
  const payload = { generatedAt: new Date().toISOString(), count: publicJobs.length, maxAgeDays: config.maxAgeDays ?? DEFAULTS.maxAgeDays, jobs: publicJobs };
  if (!argv.includes("--dry")) {
    await mkdir(outDir, { recursive: true }); await mkdir(path.dirname(statePath), { recursive: true });
    await writeFile(path.join(outDir, "jobs.json"), JSON.stringify(payload)); await writeFile(path.join(outDir, "jobs.js"), `window.JOBS_DATA=${JSON.stringify(payload)};\n`);
    await writeFile(statePath, JSON.stringify(state)); await writeFile(path.join(path.dirname(statePath), "last-run.json"), JSON.stringify(report, null, 2));
  }
  const fails = Object.entries(report.sources).filter(([, s]) => s.error);
  console.log(`Active ${report.active}/${report.target} (shortfall ${report.shortfall}) | +${report.added} new, ${report.refreshed} refreshed, removed ${JSON.stringify(report.removed)}\nRejected ${JSON.stringify(report.rejected)}\nSources ${JSON.stringify(report.sources)}`);
  if (!Object.keys(report.sources).length) console.log("No sources are enabled, so the site shows no vacancies. See docs/JOBS-FEED.md.");
  return { report, payload, failed: fails.length };
}
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) main().then(r => { if (r.failed) process.exitCode = 1; }).catch(e => { console.error(e.message); process.exit(1); });
