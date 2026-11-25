#!/usr/bin/env node
/**
 * Job ingestion: fetch -> normalise -> strip links/contacts -> categorise ->
 * restrict to approved countries -> de-duplicate -> drop expired -> write output.
 * Usage:  node offshore/ingest/ingest.mjs   (run on a schedule, e.g. every 30 min via cron/GitHub Actions)
 * Node 18+, no dependencies.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const off = path.join(root, "offshore");

// load approved locations and categories
const sandbox = { window: {} };
vm.runInNewContext(await readFile(path.join(off, "data/locations.js"), "utf8"), sandbox);
const COUNTRIES = sandbox.window.REGIONS.flatMap(r => r.countries.map(c => ({ ...c, region: r.name })));
const byName = n => COUNTRIES.find(c => n && (n.toLowerCase().includes(c.name.toLowerCase().split(":")[0].trim()) || c.slug === n.toLowerCase()));

const RULES = [
  ["subsea", /rov|diver|subsea|saturation/i], ["drilling", /driller|derrick|roughneck|mud|drilling|toolpusher|wellsite/i],
  ["marine", /master|mate\b|deck|dp operator|vessel|marine|bosun|ab seaman|ship/i], ["hse", /hse|safety|medic|nurse|environment/i],
  ["engineering", /engineer|designer|inspector/i], ["operations", /operator|production|ccr|oim|offshore installation manager|supervisor/i],
  ["maintenance", /mechanic|electrician|rigger|welder|fitter|technician|instrument/i], ["logistics", /crane|storekeeper|helideck|logistic|warehouse|banksman/i],
  ["catering", /cook|chef|steward|camp boss|catering|baker/i], ["entry", /roustabout|trainee|entry|apprentice|graduate|deck hand/i]
];
const categorise = t => (RULES.find(([, re]) => re.test(t)) || ["operations"])[0];

// remove anything that points back to the source: URLs, emails, phones, "apply at/via" phrases
export function clean(text = "") {
  return String(text)
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+|www\.\S+/gi, "")
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.]+\b/g, "")
    .replace(/\+?\d[\d\s().-]{8,}\d/g, "")
    .replace(/(apply|applications?)\s+(now\s+)?(at|via|on|through|by visiting)[^.\n]*[.\n]?/gi, "")
    .replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}
const hash = s => createHash("sha1").update(s.toLowerCase().replace(/\W+/g, "")).digest("hex").slice(0, 12);
const pick = (o, k) => (k && k in o ? o[k] : undefined);
const today = new Date();

async function fetchSource(src) {
  if (src.file) return JSON.parse(await readFile(path.join(off, src.file.replace(/^offshore\//, "")), "utf8"));
  const headers = Object.fromEntries(Object.entries(src.headers || {}).map(([k, v]) => [k, v.replace(/\$\{(\w+)\}/g, (_, n) => process.env[n] || "")]));
  const res = await fetch(src.url, { headers });
  if (!res.ok) throw new Error(`${src.id}: HTTP ${res.status}`);
  return res.json();
}

const cfg = JSON.parse(await readFile(path.join(off, "ingest/sources.json"), "utf8"));
const seen = new Map();
const stats = { fetched: 0, rejectedLocation: 0, expired: 0, duplicates: 0 };

for (const src of cfg.sources.filter(s => s.enabled)) {
  let items;
  try { items = await fetchSource(src); } catch (e) { console.error("SOURCE FAILED:", e.message); continue; }
  for (const raw of Array.isArray(items) ? items : items.jobs || []) {
    stats.fetched++;
    const m = src.map, title = clean(pick(raw, m.title)), loc = byName(pick(raw, m.location));
    if (!title) continue;
    if (!loc) { stats.rejectedLocation++; continue; }
    const posted = new Date(pick(raw, m.postedAt) || today);
    const expires = new Date(pick(raw, m.expiresAt) || posted.getTime() + cfg.defaultExpiryDays * 864e5);
    if (expires < today) { stats.expired++; continue; }
    const desc = clean(pick(raw, m.description));
    const key = hash(`${title}|${pick(raw, m.company)}|${loc.slug}`);
    if (seen.has(key)) { stats.duplicates++; continue; }
    seen.set(key, {
      id: key, title, category: categorise(title), country: loc.name, countrySlug: loc.slug, region: loc.region,
      company: clean(pick(raw, m.company)) || "Confidential operator", rotation: loc.rotation,
      description: desc, postedAt: posted.toISOString().slice(0, 10), expiresAt: expires.toISOString().slice(0, 10), source: src.id
    });
  }
}

const jobs = [...seen.values()].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
const payload = { generatedAt: today.toISOString(), count: jobs.length, jobs };
await writeFile(path.join(off, "data/jobs.json"), JSON.stringify(payload, null, 2));
await writeFile(path.join(off, "data/jobs.js"), `window.JOBS_DATA=${JSON.stringify(payload)};\n`);
console.log(`Wrote ${jobs.length} jobs`, stats);
