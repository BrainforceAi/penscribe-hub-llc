import { createHash } from "node:crypto";
/** Strip markup and anything that points back to the source: URLs, emails, phone numbers, "apply at ..." phrases. */
export function clean(text = "") {
  return String(text)
    .replace(/<br\s*\/?>|<\/p>|<\/li>/gi, "\n").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
    .replace(/https?:\/\/\S+|www\.\S+/gi, "")
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.]+\b/g, "")
    .replace(/\+?\d[\d\s().-]{8,}\d/g, "")
    .replace(/(apply|applications?)\s+(now\s+)?(at|via|on|through|by visiting)[^.\n]*[.\n]?/gi, "")
    .replace(/[ \t]{2,}/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
export const truncate = (s, n) => (s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…");
export const hash = s => createHash("sha1").update(String(s).toLowerCase().replace(/[^a-z0-9]+/g, "")).digest("hex").slice(0, 12);
export const day = d => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
export const daysBetween = (a, b) => Math.round((new Date(day(b)) - new Date(day(a))) / 864e5);
/** Accepts ISO strings, timestamps and dd/mm/yyyy. Returns YYYY-MM-DD or null. Never guesses. */
export function parseDate(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim(); let m;
  if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s))) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  const d = new Date(/^\d+$/.test(s) ? Number(s) : s); return isNaN(d) ? null : d.toISOString().slice(0, 10);
}
export const getPath = (o, p) => (p ? String(p).split(".").reduce((a, k) => (a == null ? a : a[k]), o) : undefined);
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const interpolate = (s, env) => String(s).replace(/\$\{(\w+)\}/g, (_, n) => env[n] ?? "");
