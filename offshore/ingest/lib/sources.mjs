import { getPath, interpolate, sleep } from "./util.mjs";
/**
 * Each adapter returns raw adverts in one shape:
 * { sourceId, title, company, location, countryHint, description, postedAt, expiresAt, applyUrl, attribution }
 * Nothing is generated here: every field is copied from what the source returned.
 */
const polite = (src) => sleep(src.delayMs ?? 250);
async function get(fetchFn, url, init, what) {
  const res = await fetchFn(url, init); if (!res.ok) throw new Error(`${what}: HTTP ${res.status}`); return res;
}
const need = (env, names, id) => { const miss = names.filter(n => !env[n]); if (miss.length) throw new Error(`${id}: missing ${miss.join(", ")}`); };

/* ---- minimal XML/RSS reader for flat partner feeds (no dependencies) ---- */
const unwrap = s => s.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim();
export function parseXmlItems(xml, itemTag = "job") {
  const out = [], re = new RegExp(`<${itemTag}\\b[^>]*>([\\s\\S]*?)<\\/${itemTag}>`, "gi"); let m;
  while ((m = re.exec(xml))) { const o = {}, tr = /<([A-Za-z0-9_:-]+)\b[^>]*>([\s\S]*?)<\/\1>/g; let t; while ((t = tr.exec(m[1]))) o[t[1]] = unwrap(t[2]); out.push(o); }
  return out;
}

async function feedAdapter(src, ctx) {
  const { env, fetchFn } = ctx, map = src.map || {}; if (src.requiresEnv) need(env, src.requiresEnv, src.id);
  const headers = Object.fromEntries(Object.entries(src.headers || {}).map(([k, v]) => [k, interpolate(v, env)]));
  const pages = src.pagination ? Math.max(1, src.pagination.maxPages || 20) : 1, out = [];
  for (let p = 0; p < pages; p++) {
    let url = interpolate(src.url, env); if (src.pagination) url += (url.includes("?") ? "&" : "?") + `${src.pagination.param || "page"}=${(src.pagination.start ?? 1) + p}`;
    const res = await get(fetchFn, url, { headers }, src.id); let items;
    if (src.type === "xml" || src.type === "rss") items = parseXmlItems(await res.text(), src.itemTag || (src.type === "rss" ? "item" : "job"));
    else { const j = await res.json(); items = src.itemsPath ? getPath(j, src.itemsPath) : Array.isArray(j) ? j : j.jobs || j.items || j.results; }
    if (!Array.isArray(items) || !items.length) break;
    for (const r of items) out.push({ sourceId: String(getPath(r, map.id) ?? ""), title: getPath(r, map.title), company: getPath(r, map.company), location: getPath(r, map.location), countryHint: getPath(r, map.country), description: getPath(r, map.description), postedAt: getPath(r, map.postedAt), expiresAt: getPath(r, map.expiresAt), applyUrl: getPath(r, map.applyUrl), attribution: src.attribution || "" });
    if (!src.pagination) break; await polite(src);
  }
  return out;
}

/* ---- Adzuna: official API. Its terms require attribution and a link back, so adverts keep both. ---- */
async function adzuna(src, ctx) {
  const { env, fetchFn } = ctx; need(env, ["ADZUNA_APP_ID", "ADZUNA_APP_KEY"], src.id); const out = [];
  for (const cc of src.countries || ["gb"]) for (const q of src.queries || ["offshore"]) for (let page = 1; page <= (src.maxPages || 5); page++) {
    const url = `https://api.adzuna.com/v1/api/jobs/${cc}/search/${page}?app_id=${env.ADZUNA_APP_ID}&app_key=${env.ADZUNA_APP_KEY}&results_per_page=50&what=${encodeURIComponent(q)}&max_days_old=${src.maxDaysOld || 30}&sort_by=date&content-type=application/json`;
    const j = await (await get(fetchFn, url, {}, `${src.id}/${cc}`)).json(); const rows = j.results || []; if (!rows.length) break;
    for (const r of rows) out.push({ sourceId: "adzuna:" + r.id, title: r.title, company: r.company && r.company.display_name, location: r.location && r.location.display_name, countryHint: cc, description: r.description, postedAt: r.created, applyUrl: r.redirect_url, attribution: "Adzuna" });
    await polite(src);
  }
  return out;
}

/* ---- Reed (UK): official API, link back and attribution required ---- */
async function reed(src, ctx) {
  const { env, fetchFn } = ctx; need(env, ["REED_API_KEY"], src.id); const out = [], auth = "Basic " + Buffer.from(env.REED_API_KEY + ":").toString("base64");
  for (const q of src.queries || ["offshore"]) for (let skip = 0, n = 0; n < (src.maxPages || 5); skip += 100, n++) {
    const url = `https://www.reed.co.uk/api/1.0/search?keywords=${encodeURIComponent(q)}&resultsToTake=100&resultsToSkip=${skip}`;
    const j = await (await get(fetchFn, url, { headers: { Authorization: auth } }, src.id)).json(); const rows = j.results || []; if (!rows.length) break;
    for (const r of rows) out.push({ sourceId: "reed:" + r.jobId, title: r.jobTitle, company: r.employerName, location: r.locationName, countryHint: "gb", description: r.jobDescription, postedAt: r.date, expiresAt: r.expirationDate, applyUrl: r.jobUrl, attribution: "Reed" });
    await polite(src);
  }
  return out;
}


/* ---- Careerjet v4: official API (Basic auth, key as user name). Careerjet requires attribution and its tracking link,
   so adverts keep both. The key only works from IP addresses registered in your Careerjet publisher account. ---- */
async function careerjet(src, ctx) {
  const { env, fetchFn, warn = () => { } } = ctx; need(env, ["CAREERJET_API_KEY"], src.id);
  const auth = "Basic " + Buffer.from(env.CAREERJET_API_KEY + ":").toString("base64");
  const ip = encodeURIComponent(env.CAREERJET_USER_IP || "127.0.0.1"), ua = encodeURIComponent(src.userAgent || "OffshoreLinkJobImporter/1.0"), size = Math.min(100, src.pageSize || 100), out = [];
  for (const loc of src.locales || []) for (const q of src.queries || ["offshore"]) {
    const maxPages = Math.min(10, src.maxPages || 5); let skipLocale = false;
    for (let page = 1; page <= maxPages && !skipLocale; page++) {
      const url = `https://search.api.careerjet.net/v4/query?locale_code=${loc.code}&keywords=${encodeURIComponent(q)}${loc.location ? "&location=" + encodeURIComponent(loc.location) : ""}&sort=date&page=${page}&page_size=${size}&fragment_size=${src.fragmentSize || 500}&user_ip=${ip}&user_agent=${ua}`;
      const res = await fetchFn(url, { headers: { Authorization: auth } });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})), msg = body.error || body.message || "";
        if (res.status === 400) { warn(`${src.id}: locale ${loc.code} skipped (${msg || "unsupported"})`); skipLocale = true; continue; }
        throw new Error(`${src.id}: HTTP ${res.status} ${msg}`.trim());   // 401/403 = key or IP not authorised: fail the whole source, never delete anything
      }
      const j = await res.json();
      if (j.type !== "JOBS") { if (j.type === "LOCATIONS") warn(`${src.id}: ${loc.code} location "${loc.location}" not found`); break; }
      for (const r of j.jobs || []) out.push({ sourceId: r.url, title: r.title, company: r.company, location: r.locations, countryHint: loc.country, description: r.description, postedAt: r.date, applyUrl: r.url, attribution: "Careerjet" });
      if (page >= (j.pages || 1) || !(j.jobs || []).length) break; await polite(src);
    }
  }
  return out;
}

export const ADAPTERS = { json: feedAdapter, xml: feedAdapter, rss: feedAdapter, adzuna, reed, careerjet };
export async function fetchFromSource(src, ctx) {
  const a = ADAPTERS[src.type]; if (!a) throw new Error(`${src.id}: unknown source type "${src.type}"`); return a(src, ctx);
}
