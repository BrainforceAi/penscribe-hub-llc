import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
/** Approved countries come from data/locations.js, so the site and the importer can never disagree. */
export async function loadCountries(offshoreDir) {
  const sb = { window: {} }; vm.runInNewContext(await readFile(path.join(offshoreDir, "data/locations.js"), "utf8"), sb);
  return sb.window.REGIONS.flatMap(r => r.countries.map(c => ({ ...c, region: r.name })));
}
/* unambiguous place names only (no "Georgetown", "Victoria", bare "Perth") */
const ALIASES = {
  "united-kingdom": ["UK", "England", "Scotland", "Wales", "Great Britain", "Aberdeen", "Aberdeenshire", "Great Yarmouth", "Lowestoft", "Teesside", "Peterhead", "Inverness"],
  "usa-gulf-of-mexico": ["USA", "US", "U.S.", "United States", "Texas", "Louisiana", "Houston", "Lafayette", "Houma", "New Iberia", "Morgan City", "Mobile, AL", "Gulf of Mexico"],
  norway: ["Stavanger", "Bergen", "Oslo", "Kristiansund", "Haugesund", "Sandnes"], denmark: ["Esbjerg", "Copenhagen"],
  netherlands: ["Den Helder", "Rotterdam", "Amsterdam", "Holland", "The Hague", "IJmuiden"], ireland: ["Dublin", "Cork", "Republic of Ireland"],
  uae: ["UAE", "Abu Dhabi", "Dubai", "Sharjah", "Ras Al Khaimah", "Das Island", "Mussafah"],
  "saudi-arabia": ["Saudi", "KSA", "Dammam", "Al Khobar", "Dhahran", "Ras Tanura", "Jubail", "Riyadh"], qatar: ["Doha", "Ras Laffan", "Mesaieed"],
  kuwait: ["Kuwait City", "Ahmadi"], oman: ["Muscat", "Sohar", "Duqm"], bahrain: ["Manama"], iraq: ["Basra", "Basrah", "Baghdad"],
  brazil: ["Rio de Janeiro", "Macaé", "Macae", "Niterói", "Santos", "Brasil"], mexico: ["Ciudad del Carmen", "Campeche", "Dos Bocas", "Mexico City", "Villahermosa"],
  guyana: ["Georgetown, Guyana"], suriname: ["Paramaribo"], "trinidad-tobago": ["Trinidad", "Tobago", "Port of Spain", "Point Lisas"],
  canada: ["Newfoundland", "St. John's", "Halifax", "Nova Scotia", "Calgary", "Alberta", "Labrador"], colombia: ["Cartagena", "Bogotá", "Bogota"],
  argentina: ["Buenos Aires", "Neuquén", "Neuquen", "Tierra del Fuego"],
  australia: ["Western Australia", "Perth, WA", "Perth WA", "Karratha", "Darwin", "Northern Territory", "Melbourne", "Queensland", "Victoria, Australia"],
  "south-africa": ["Cape Town", "Saldanha", "Richards Bay", "Durban", "Port Elizabeth", "Gqeberha"], azerbaijan: ["Baku"], kazakhstan: ["Atyrau", "Aktau", "Astana"], russia: ["Moscow", "Sakhalin"]
};
const HINT = { gb: "united-kingdom", uk: "united-kingdom", us: "usa-gulf-of-mexico", au: "australia", ca: "canada", nl: "netherlands", za: "south-africa", br: "brazil", mx: "mexico", no: "norway", dk: "denmark", ie: "ireland", ae: "uae", sa: "saudi-arabia", qa: "qatar", kw: "kuwait", om: "oman", bh: "bahrain", iq: "iraq", ar: "argentina", co: "colombia", tt: "trinidad-tobago", az: "azerbaijan", kz: "kazakhstan", gy: "guyana", sr: "suriname" };
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Returns the approved country for a free-text location, or null. A source's country code is only a fallback. */
export function makeResolver(countries, excludeSlugs = []) {
  const rules = countries.filter(c => !excludeSlugs.includes(c.slug)).map(c => {
    const words = [c.name.split(":")[0].replace(/&/g, "and").trim(), c.name.split(":")[0].trim(), ...(ALIASES[c.slug] || [])];
    return { c, re: new RegExp("(?:^|[^a-z])(?:" + [...new Set(words)].map(esc).join("|") + ")(?:$|[^a-z])", "i") };
  });
  return (location, hintCode) => {
    const t = String(location || ""); for (const r of rules) if (r.re.test(t)) return r.c;
    const slug = HINT[String(hintCode || "").toLowerCase()]; return slug ? (rules.find(r => r.c.slug === slug) || {}).c || null : null;
  };
}
