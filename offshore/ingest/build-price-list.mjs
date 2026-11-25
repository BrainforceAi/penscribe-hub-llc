#!/usr/bin/env node
/** Builds data/docprices.js from data/price-list.md. Edit the markdown, then run: node offshore/ingest/build-price-list.mjs */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data");
const md = (await readFile(path.join(dir, "price-list.md"), "utf8")).split("\n");
const ICONS = ["🪪", "📄", "⚖️", "🩺", "⚓", "🦺", "🛢️", "🚢", "⚙️", "🔥", "🤿", "🏗️", "🌿", "🌬️", "📦", "🛠️", "🎯", "🗂️"];
const slug = s => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const money = s => Number(s.replace(/[^0-9.]/g, ""));
const catalog = [], packages = [], terms = [];
let cur = null, pkg = null, mode = "";
for (const raw of md) {
  const line = raw.trim();
  let m;
  if ((m = /^## (\d+)\. (.+)$/.exec(line))) {
    const n = +m[1], name = m[2]; mode = n === 19 ? "pkg" : n === 20 ? "terms" : "cat";
    if (mode === "cat") { cur = { id: "c" + n, n, name, icon: ICONS[n - 1] || "📁", note: "", items: [] }; catalog.push(cur); }
    continue;
  }
  if (mode === "cat" && /^\*.*\*$/.test(line)) { cur.note = line.replace(/^\*|\*$/g, ""); continue; }
  if (mode === "cat" && (m = /^\|\s*(.+?)\s*\|\s*\$([\d,]+)\s*\|$/.exec(line))) { cur.items.push({ id: `${cur.id}-${slug(m[1])}`, name: m[1], usd: money(m[2]) }); continue; }
  if (mode === "pkg") {
    if ((m = /^### (.+?) — \$([\d,]+)$/.exec(line))) { pkg = { id: "p-" + slug(m[1]), name: m[1], usd: money(m[2]), includes: [] }; packages.push(pkg); continue; }
    if (pkg && line.startsWith("- ")) pkg.includes.push(line.slice(2));
  }
  if (mode === "terms" && line.startsWith("- ")) terms.push(line.slice(2));
}
const ids = new Set(); for (const it of catalog.flatMap(c => c.items)) { if (ids.has(it.id)) throw new Error("Duplicate id " + it.id); ids.add(it.id); }
await writeFile(path.join(dir, "docprices.js"), `/* Generated from data/price-list.md by ingest/build-price-list.mjs. Prices in USD. */\nwindow.DOC_CATALOG = ${JSON.stringify(catalog)};\nwindow.DOC_PACKAGES = ${JSON.stringify(packages)};\nwindow.DOC_TERMS = ${JSON.stringify(terms)};\n`);
console.log(`${catalog.length} categories, ${catalog.reduce((a, c) => a + c.items.length, 0)} items, ${packages.length} packages, ${terms.length} terms`);
console.log(catalog.map(c => `${c.n}:${c.items.length}`).join(" "));
