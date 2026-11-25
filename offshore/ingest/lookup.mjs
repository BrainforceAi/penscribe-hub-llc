#!/usr/bin/env node
/** Staff tool: find where a job came from, so you can submit an applicant's application to the employer. Usage: node offshore/ingest/lookup.mjs <job id or part of title> */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const state = JSON.parse(await readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), "state/jobs-state.json"), "utf8").catch(() => '{"jobs":{}}'));
const q = (process.argv[2] || "").toLowerCase(); if (!q) { console.error("Usage: lookup.mjs <job id or title>"); process.exit(1); }
const hits = Object.values(state.jobs).filter(j => j.id === q || j.title.toLowerCase().includes(q));
if (!hits.length) console.log("No active job matches. It may have closed and been removed.");
for (const j of hits.slice(0, 20)) console.log(`${j.id}  ${j.title} | ${j.company || "(employer not named)"} | ${j.country}\n   source: ${j.source} (${j.sourceId})  first seen ${j.firstSeen}  last seen ${j.lastSeen}\n   original advert: ${j.applyUrl || "(none supplied)"}`);
