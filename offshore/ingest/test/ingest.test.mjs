import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCountries, makeResolver } from "../lib/geo.mjs";
import { runIngest, normalise } from "../lib/engine.mjs";
import { parseXmlItems } from "../lib/sources.mjs";
import { statedRotation, isRelevant } from "../lib/relevance.mjs";
import { clean } from "../lib/util.mjs";

const here = path.dirname(fileURLToPath(import.meta.url)), offshore = path.resolve(here, "../..");
const fx = f => readFile(path.join(here, "fixtures", f), "utf8");
const resolve = makeResolver(await loadCountries(offshore), ["russia"]);
const TODAY = new Date("2026-11-25T06:00:00Z");
const feedSrc = { id: "p", type: "json", url: "https://feed.test/jobs.json", itemsPath: "jobs", enabled: true, map: { id: "id", title: "title", company: "company", location: "location", description: "description", postedAt: "postedAt", expiresAt: "expiresAt", applyUrl: "applyUrl" } };
const jsonFetch = body => async () => ({ ok: true, status: 200, json: async () => JSON.parse(body), text: async () => body });
const run = (config, state, fetchFn, env = {}, today = TODAY, extra = {}) => runIngest({ config, state, resolve, fetchFn, env, today, ...extra });

test("keeps only real, relevant adverts in approved countries, with no invented fields", async () => {
  const src = await fx("partner.json"), state = { jobs: {} };
  const { report, publicJobs } = await run({ sources: [feedSrc] }, state, jsonFetch(src));
  const titles = publicJobs.map(j => j.title).sort();
  assert.deepEqual(titles, ["Test Driller", "Test Offshore Cook", "Test Offshore Medic"]);
  assert.equal(report.rejected.notOffshore, 1, "barista rejected");
  assert.equal(report.rejected.notApprovedCountry, 1, "Nigeria rejected");
  assert.equal(report.rejected.expired, 1, "expired welder rejected");
  assert.equal(report.rejected.tooOld, 1, "over-age crane operator rejected");
  assert.equal(report.rejected.noDescription, 1, "empty advert rejected");
  const input = JSON.parse(src).jobs.map(j => j.title);
  for (const j of publicJobs) assert.ok(input.includes(j.title), "every title comes from the source: " + j.title);
});

test("rotation and closing date only appear when the advert states them", async () => {
  const { publicJobs } = await run({ sources: [feedSrc] }, { jobs: {} }, jsonFetch(await fx("partner.json")));
  const d = publicJobs.find(j => j.title === "Test Driller"), c = publicJobs.find(j => j.title === "Test Offshore Cook");
  assert.equal(d.rotation, "14/14"); assert.equal(d.expiresAt, "2026-12-31");
  assert.equal(c.rotation, undefined, "no rotation invented from the country"); assert.equal(c.expiresAt, undefined, "no closing date invented");
  assert.equal(statedRotation("Great job, apply today"), "");
  assert.equal(statedRotation("3 weeks on / 3 weeks off schedule"), "3 on / 3 off");
});

test("public records contain no links, emails or phone numbers and no source URL", async () => {
  const { publicJobs } = await run({ sources: [feedSrc] }, { jobs: {} }, jsonFetch(await fx("partner.json")));
  for (const j of publicJobs) { assert.doesNotMatch(JSON.stringify(j), /https?:\/\/|www\.|@example\.com|\+44/); assert.equal(j.url, undefined); }
  assert.equal(clean("Email a@b.co or visit www.x.com or call +1 234 567 8901 now"), "Email or visit or call now");
});

test("aggregator adverts keep attribution and the link, as their terms require", async () => {
  const src = { id: "adzuna", type: "adzuna", countries: ["gb"], queries: ["offshore"], maxPages: 1, enabled: true, delayMs: 0 };
  const body = await fx("adzuna.json"), calls = [];
  const fetchFn = async url => { calls.push(url); return { ok: true, status: 200, json: async () => (calls.length === 1 ? JSON.parse(body) : { results: [] }) }; };
  const { publicJobs } = await run({ sources: [src] }, { jobs: {} }, fetchFn, { ADZUNA_APP_ID: "id", ADZUNA_APP_KEY: "key" });
  assert.equal(publicJobs.length, 2); assert.ok(publicJobs.every(j => j.attribution === "Adzuna" && /adzuna\.com/.test(j.url)));
  assert.ok(publicJobs.find(j => j.title === "Test Offshore Electrician"), "html tags stripped from title");
  assert.ok(publicJobs.find(j => j.title === "Test Offshore Electrician").country === "Australia");
});

test("Reed dates (dd/mm/yyyy) and XML/CDATA feeds are read correctly", async () => {
  const r = { id: "reed", type: "reed", queries: ["offshore"], maxPages: 1, enabled: true, delayMs: 0 }; let n = 0;
  const a = await run({ sources: [r] }, { jobs: {} }, async () => ({ ok: true, status: 200, json: async () => (n++ ? { results: [] } : JSON.parse(await fx("reed.json"))) }), { REED_API_KEY: "k" });
  assert.equal(a.publicJobs[0].expiresAt, "2026-12-30"); assert.equal(a.publicJobs[0].listedAt, "2026-11-22");
  const items = parseXmlItems(await fx("partner.xml"), "job"); assert.equal(items.length, 2); assert.equal(items[0].title, "Test Roustabout");
  const xmlSrc = { id: "x", type: "xml", url: "https://x.test/jobs.xml", itemTag: "job", enabled: true, map: { id: "reference", title: "title", company: "company", location: "location", description: "description", postedAt: "date", applyUrl: "url" } };
  const b = await run({ sources: [xmlSrc] }, { jobs: {} }, async () => ({ ok: true, status: 200, text: async () => await fx("partner.xml") }));
  assert.deepEqual(b.publicJobs.map(j => j.title).sort(), ["Test Roustabout", "Test Storekeeper"]);
  assert.match(b.publicJobs.find(j => j.title === "Test Roustabout").description, /^Offshore roustabout/);
});

test("daily lifecycle: new jobs appear, vanished jobs are removed after two missed days, still-listed jobs stay", async () => {
  const state = { jobs: {} }, all = JSON.parse(await fx("partner.json")), cfg = { sources: [feedSrc], removeAfterMissedRuns: 2 };
  const day1 = JSON.stringify({ jobs: all.jobs.filter(j => ["P-1", "P-2"].includes(j.id)) });
  let r = await run(cfg, state, jsonFetch(day1), {}, new Date("2026-11-25T06:00:00Z")); assert.equal(r.publicJobs.length, 2); assert.equal(r.report.added, 2);
  const day2 = JSON.stringify({ jobs: all.jobs.filter(j => ["P-2", "P-7"].includes(j.id)) });
  r = await run(cfg, state, jsonFetch(day2), {}, new Date("2026-11-26T06:00:00Z"));
  assert.deepEqual(r.publicJobs.map(j => j.title).sort(), ["Test Driller", "Test Offshore Cook", "Test Offshore Medic"], "driller missed once: still listed; medic added");
  r = await run(cfg, state, jsonFetch(day2), {}, new Date("2026-11-27T06:00:00Z"));
  assert.deepEqual(r.publicJobs.map(j => j.title).sort(), ["Test Offshore Cook", "Test Offshore Medic"], "driller missed twice: removed");
  assert.equal(r.report.removed.missing, 1);
});

test("a feed that fails never empties the site", async () => {
  const state = { jobs: {} }, cfg = { sources: [feedSrc] };
  await run(cfg, state, jsonFetch(await fx("partner.json")), {}, new Date("2026-11-25T06:00:00Z"));
  const before = Object.keys(state.jobs).length; assert.ok(before >= 3);
  const down = async () => ({ ok: false, status: 503 });
  for (const d of ["2026-11-26", "2026-11-27", "2026-11-28"]) { const r = await run(cfg, state, down, {}, new Date(d + "T06:00:00Z")); assert.ok(r.report.sources.p.error); assert.equal(r.publicJobs.length, before); }
});

test("jobs expire on their stated closing date and age out after maxAgeDays", async () => {
  const state = { jobs: {} }, cfg = { sources: [feedSrc], maxAgeDays: 45 }, body = jsonFetch(await fx("partner.json"));
  await run(cfg, state, body, {}, new Date("2026-11-25T06:00:00Z"));
  let r = await run(cfg, state, async () => ({ ok: false, status: 500 }), {}, new Date("2027-01-02T06:00:00Z"));
  assert.ok(!r.publicJobs.some(j => j.title === "Test Driller"), "closing date 2026-12-31 has passed");
  r = await run(cfg, state, async () => ({ ok: false, status: 500 }), {}, new Date("2027-01-20T06:00:00Z"));
  assert.equal(r.publicJobs.length, 0, "everything older than 45 days is gone");
});

test("the same job from two sources is listed once; the cap is respected", async () => {
  const dupe = JSON.stringify({ jobs: [{ id: "A", title: "Test Driller", company: "Fixture Drilling Co", location: "Aberdeen", description: "Offshore drilling on a North Sea rig, full details here.", postedAt: "2026-11-24" }] });
  const s2 = { ...feedSrc, id: "p2" }; const fetchFn = jsonFetch(dupe);
  const r = await run({ sources: [feedSrc, s2] }, { jobs: {} }, fetchFn); assert.equal(r.publicJobs.length, 1); assert.equal(r.report.rejected.duplicate, 1);
  const many = JSON.stringify({ jobs: Array.from({ length: 30 }, (_, i) => ({ id: "M" + i, title: "Test Roustabout " + i, company: "Fixture", location: "Aberdeen", description: "Offshore roustabout on a North Sea platform, details follow here.", postedAt: "2026-11-" + String(1 + (i % 20)).padStart(2, "0") })) });
  const c = await run({ sources: [feedSrc], targetActive: 10 }, { jobs: {} }, jsonFetch(many)); assert.equal(c.publicJobs.length, 10); assert.equal(c.report.shortfall, 0);
  const small = await run({ sources: [feedSrc], targetActive: 1000 }, { jobs: {} }, jsonFetch(many)); assert.equal(small.report.shortfall, 970, "shortfall is reported honestly, never padded");
});

test("refuses to publish if the feed suddenly collapses", async () => {
  const state = { jobs: {} }; for (let i = 0; i < 300; i++) state.jobs["j" + i] = { id: "j" + i, source: "p", title: "T" + i, postedAt: "2026-11-20", firstSeen: "2026-11-20", missedRuns: 1 };
  await assert.rejects(() => run({ sources: [feedSrc] }, state, jsonFetch(JSON.stringify({ jobs: [{ id: "1", title: "Test Driller", company: "F", location: "Aberdeen", description: "Offshore drilling rig role in the North Sea region.", postedAt: "2026-11-24" }] }))), /Refusing to publish/);
});

test("Russia is excluded by default; unmatched or ambiguous places are rejected", () => {
  assert.equal(resolve("Sakhalin, Russia"), null); assert.equal(resolve("Lagos, Nigeria"), null); assert.equal(resolve("Georgetown"), null);
  assert.equal(resolve("Aberdeen").slug, "united-kingdom"); assert.equal(resolve("Dubai, UAE").slug, "uae"); assert.equal(resolve("Remote", "gb").slug, "united-kingdom");
  assert.equal(isRelevant("Cashier", "Offshore petrol station"), false);
});

/* ---------------- Careerjet ---------------- */
const cjSrc = { id: "careerjet", type: "careerjet", queries: ["offshore"], maxPages: 3, pageSize: 100, delayMs: 0, enabled: true, locales: [{ code: "en_GB", country: "gb" }, { code: "xx_XX", country: "us" }] };
const CJ_ENV = { CAREERJET_API_KEY: "test-key-123", CAREERJET_USER_IP: "198.51.100.7" };
const cjResponder = (calls, { forbid = false } = {}) => async (url, init) => {
  calls.push({ url, init }); const u = new URL(url);
  if (forbid) return { ok: false, status: 403, json: async () => ({ error: "Unauthorized access from IP 192.0.2.1", type: "ERROR" }) };
  if (u.searchParams.get("locale_code") === "xx_XX") return { ok: false, status: 400, json: async () => ({ error: "Unsupported locale code" }) };
  return { ok: true, status: 200, json: async () => JSON.parse(await fx("careerjet.json")) };
};

test("Careerjet: sends documented request (Basic auth, user_ip, user_agent) and keeps attribution + tracking link", async () => {
  const calls = [], r = await run({ sources: [cjSrc] }, { jobs: {} }, cjResponder(calls), CJ_ENV);
  const first = calls[0], u = new URL(first.url);
  assert.equal(u.origin + u.pathname, "https://search.api.careerjet.net/v4/query");
  assert.equal(first.init.headers.Authorization, "Basic " + Buffer.from("test-key-123:").toString("base64"), "key is the Basic-auth user name, empty password");
  assert.equal(u.searchParams.get("user_ip"), "198.51.100.7"); assert.match(u.searchParams.get("user_agent"), /Importer/);
  assert.equal(u.searchParams.get("sort"), "date"); assert.equal(u.searchParams.get("page_size"), "100"); assert.equal(u.searchParams.get("locale_code"), "en_GB");
  assert.deepEqual(r.publicJobs.map(j => j.title).sort(), ["Test Offshore Rigger", "Test Subsea Technician"], "unrelated office job rejected");
  const rig = r.publicJobs.find(j => j.title === "Test Offshore Rigger");
  assert.equal(rig.attribution, "Careerjet"); assert.match(rig.url, /^https:\/\/jobviewtrack\.com\//); assert.equal(rig.country, "United Kingdom"); assert.equal(rig.category, "logistics");
  assert.equal(rig.listedAt, "2026-11-24", "date from Careerjet's header-style format"); assert.equal(rig.rotation, undefined);
  assert.equal(r.publicJobs.find(j => j.title === "Test Subsea Technician").country, "Norway");
});

test("Careerjet: an unsupported locale is skipped with a warning, the rest still import", async () => {
  const r = await run({ sources: [cjSrc] }, { jobs: {} }, cjResponder([]), CJ_ENV);
  assert.ok(r.report.sources.careerjet.warnings.some(w => /xx_XX/.test(w))); assert.equal(r.publicJobs.length, 2);
});

test("Careerjet: key or IP not authorised fails the source with Careerjet's message and removes nothing", async () => {
  const state = { jobs: {} }; await run({ sources: [cjSrc] }, state, cjResponder([]), CJ_ENV, new Date("2026-11-25T06:00:00Z"));
  const before = Object.keys(state.jobs).length; assert.equal(before, 2);
  for (const d of ["2026-11-26", "2026-11-27", "2026-11-28"]) { const r = await run({ sources: [cjSrc] }, state, cjResponder([], { forbid: true }), CJ_ENV, new Date(d + "T06:00:00Z")); assert.match(r.report.sources.careerjet.error, /403 Unauthorized access from IP/); assert.equal(r.publicJobs.length, before); }
});

test("Careerjet: missing key is reported clearly", async () => {
  const r = await run({ sources: [cjSrc] }, { jobs: {} }, cjResponder([]), {}); assert.match(r.report.sources.careerjet.error, /missing CAREERJET_API_KEY/);
});

test("Careerjet: stops paging at the last page", async () => {
  const calls = [], multi = async url => { calls.push(url); return { ok: true, status: 200, json: async () => ({ type: "JOBS", pages: 2, jobs: JSON.parse(await fx("careerjet.json")).jobs }) }; };
  await run({ sources: [{ ...cjSrc, locales: [{ code: "en_GB", country: "gb" }], maxPages: 10 }] }, { jobs: {} }, multi, CJ_ENV); assert.equal(calls.length, 2);
});

test("Careerjet survey reports usable counts by country and Careerjet's own totals", async () => {
  const { survey } = await import("../careerjet-survey.mjs");
  const cfg = { sources: [{ ...cjSrc, locales: [{ code: "en_GB", country: "gb" }] }] }, calls = [];
  const r = await survey({ config: cfg, fetchFn: cjResponder(calls), env: CJ_ENV, today: TODAY });
  assert.equal(r.publicJobs.length, 2); assert.deepEqual(r.byCountry, { "United Kingdom": 1, Norway: 1 }); assert.equal(Object.values(r.reported)[0], 3, "uses Careerjet's reported hits");
  await assert.rejects(() => survey({ config: cfg, fetchFn: cjResponder([], { forbid: true }), env: CJ_ENV, today: TODAY }), /403 Unauthorized access from IP/);
});
