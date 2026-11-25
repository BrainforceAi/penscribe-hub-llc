#!/usr/bin/env node
/**
 * DESIGN PREVIEW ONLY. Builds a jobs.js from a FICTIONAL sample feed and flags it demo:true, which makes the site show a
 * red "DEMO DATA" banner. Writes only to the folder you pass; it never touches data/jobs.js.
 * Usage: node offshore/ingest/demo/build-demo.mjs <output-folder>
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCountries, makeResolver } from "../lib/geo.mjs";
import { normalise, toPublic, DEFAULTS } from "../lib/engine.mjs";
import { day } from "../lib/util.mjs";
const here = path.dirname(fileURLToPath(import.meta.url)), offshore = path.resolve(here, "../..");
const out = process.argv[2]; if (!out) { console.error("Give an output folder (never data/)."); process.exit(1); }
if (path.resolve(out) === path.resolve(offshore, "data")) { console.error("Refusing to write demo data into data/."); process.exit(1); }
const feed = JSON.parse(await readFile(path.join(here, "../samples/demo-feed.json"), "utf8"));
const resolve = makeResolver(await loadCountries(offshore), []), today = new Date(), ctx = { resolve, config: DEFAULTS, today };
const jobs = [];
feed.jobs.forEach((r, i) => {
  const res = normalise({ sourceId: r.id, title: r.title, company: r.company, location: r.location, description: r.description, postedAt: day(new Date(today - (i % 12) * 864e5)), expiresAt: i % 4 === 0 ? day(new Date(+today + (10 + (i * 3) % 45) * 864e5)) : "", applyUrl: "" }, { id: "demo" }, ctx);
  if (!res.job) return; const j = res.job; j.firstSeen = day(today); jobs.push({ ...toPublic(j, false), demo: true });
});
await mkdir(out, { recursive: true });
const payload = { generatedAt: today.toISOString(), count: jobs.length, maxAgeDays: 45, demo: true, jobs };
await writeFile(path.join(out, "jobs.js"), `window.JOBS_DATA=${JSON.stringify(payload)};\n`);
console.log(`DEMO jobs.js written to ${out}: ${jobs.length} fictional jobs (flagged demo:true)`);
