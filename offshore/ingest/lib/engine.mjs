import { clean, truncate, hash, day, daysBetween, parseDate } from "./util.mjs";
import { isRelevant, categorise, statedRotation } from "./relevance.mjs";
import { fetchFromSource } from "./sources.mjs";

export const DEFAULTS = { targetActive: 1000, maxAgeDays: 45, removeAfterMissedRuns: 2, descriptionChars: 1500, minDescriptionChars: 40, excludeCountrySlugs: ["russia"], shrinkGuard: 0.5 };

/** Turns one raw advert into a record, or says why it was rejected. Nothing is invented. */
export function normalise(raw, src, ctx) {
  const { resolve, config, today } = ctx;
  const title = clean(raw.title || "").replace(/\s+/g, " ");
  if (!title || title.length < 3) return { reject: "noTitle" };
  const description = clean(raw.description || ""); if (description.length < config.minDescriptionChars) return { reject: "noDescription" };
  if (!isRelevant(title, description)) return { reject: "notOffshore" };
  const country = resolve(raw.location, raw.countryHint) || resolve(description.slice(0, 300), null); if (!country) return { reject: "notApprovedCountry" };
  const postedAt = parseDate(raw.postedAt), expiresAt = parseDate(raw.expiresAt);
  if (expiresAt && expiresAt < day(today)) return { reject: "expired" };
  if (postedAt && daysBetween(postedAt, today) > config.maxAgeDays) return { reject: "tooOld" };
  const company = clean(raw.company || "");
  const key = `${title}|${company}|${country.slug}`;
  return { job: { id: hash(key), key, source: src.id, sourceId: String(raw.sourceId || ""), title, company, country: country.name, countrySlug: country.slug, region: country.region, category: categorise(title), rotation: statedRotation(title + " " + description), description: truncate(description, config.descriptionChars), postedAt, expiresAt, applyUrl: raw.applyUrl || "", attribution: raw.attribution || "" } };
}

/** The public record has only fields the advert supplied. Source links are published only where a source's terms require attribution. */
export function toPublic(j, requiresLink) {
  const o = { id: j.id, title: j.title, company: j.company, country: j.country, countrySlug: j.countrySlug, region: j.region, category: j.category, description: j.description, listedAt: j.postedAt || j.firstSeen };
  if (j.rotation) o.rotation = j.rotation; if (j.expiresAt) o.expiresAt = j.expiresAt;
  if (requiresLink && j.attribution) { o.attribution = j.attribution; if (j.applyUrl) o.url = j.applyUrl; }
  return o;
}

/**
 * One daily run. `state.jobs` is the private memory of everything seen.
 * - new adverts are added; adverts still in a feed are refreshed
 * - an advert missing from a feed that WORKED today is counted; it is removed after N consecutive misses
 * - a feed that FAILED today never causes removals (an outage must not empty the site)
 * - expired, over-age and over-cap adverts are removed
 */
export async function runIngest({ config, state, resolve, fetchFn, env, today = new Date(), log = () => { }, allowShrink = false }) {
  config = { ...DEFAULTS, ...config }; const date = day(today), report = { date, sources: {}, rejected: {}, added: 0, refreshed: 0, removed: { missing: 0, expired: 0, tooOld: 0, overCap: 0 } };
  const ctx = { resolve, config, today }, seen = new Set(), okSources = new Set(), prevActive = Object.keys(state.jobs).length, bySrc = Object.fromEntries((config.sources || []).map(s => [s.id, s]));
  for (const src of (config.sources || []).filter(s => s.enabled)) {
    let raws; try { raws = await fetchFromSource(src, { env, fetchFn }); okSources.add(src.id); report.sources[src.id] = { fetched: raws.length }; }
    catch (e) { report.sources[src.id] = { error: e.message }; log("SOURCE FAILED: " + e.message); continue; }
    let kept = 0;
    for (const raw of raws) {
      const r = normalise(raw, src, ctx); if (r.reject) { report.rejected[r.reject] = (report.rejected[r.reject] || 0) + 1; continue; }
      const j = r.job; if (seen.has(j.id)) { report.rejected.duplicate = (report.rejected.duplicate || 0) + 1; continue; }
      seen.add(j.id); kept++; const old = state.jobs[j.id];
      if (old) { state.jobs[j.id] = { ...old, ...j, firstSeen: old.firstSeen, lastSeen: date, missedRuns: 0 }; report.refreshed++; }
      else { state.jobs[j.id] = { ...j, firstSeen: date, lastSeen: date, missedRuns: 0 }; report.added++; }
    }
    report.sources[src.id].kept = kept;
  }
  for (const j of Object.values(state.jobs)) {
    if (seen.has(j.id)) continue; if (okSources.has(j.source)) j.missedRuns = (j.missedRuns || 0) + 1;
    if (j.missedRuns >= config.removeAfterMissedRuns) { delete state.jobs[j.id]; report.removed.missing++; }
  }
  for (const j of Object.values(state.jobs)) {
    if (j.expiresAt && j.expiresAt < date) { delete state.jobs[j.id]; report.removed.expired++; }
    else if (daysBetween(j.postedAt || j.firstSeen, date) > config.maxAgeDays) { delete state.jobs[j.id]; report.removed.tooOld++; }
  }
  let active = Object.values(state.jobs).sort((a, b) => String(b.postedAt || b.firstSeen).localeCompare(String(a.postedAt || a.firstSeen)));
  if (active.length > config.targetActive) { for (const j of active.slice(config.targetActive)) { delete state.jobs[j.id]; report.removed.overCap++; } active = active.slice(0, config.targetActive); }
  if (!allowShrink && prevActive >= 200 && active.length < prevActive * config.shrinkGuard) throw new Error(`Refusing to publish: active jobs fell from ${prevActive} to ${active.length}. Check the sources, then re-run with --allow-shrink.`);
  report.active = active.length; report.target = config.targetActive; report.shortfall = Math.max(0, config.targetActive - active.length);
  const pub = active.map(j => toPublic(j, !!(bySrc[j.source] && bySrc[j.source].requiresAttribution !== false && j.attribution)));
  return { report, publicJobs: pub };
}
