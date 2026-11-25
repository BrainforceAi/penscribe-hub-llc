/* Shared layout + page logic for the prototype. Brand is a placeholder (decided later). */
const BRAND = { name: "OffshoreLink", tagline: "Offshore careers, delivered", email: "info@your-domain.com", whatsapp: "https://wa.me/0000000000" };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } } };

/* ---------- form delivery ----------
   All forms deliver to ONE email address. Set SITE.notifyEmail to go live.
   Default transport is FormSubmit (formsubmit.co): no server needed, supports attachments.
   The first submission sends a one-time activation email to that address. */
const SITE = { notifyEmail: "", maxFileMB: 5, allowed: ["pdf", "doc", "docx", "jpg", "jpeg", "png"] };
const delay = ms => new Promise(r => setTimeout(r, ms));
const HONEY = `<input type="text" name="_honey" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">`;
function checkFiles(form) {
  let total = 0;
  for (const i of $$("input[type=file]", form)) for (const f of i.files) {
    total += f.size; const ext = f.name.split(".").pop().toLowerCase();
    if (!SITE.allowed.includes(ext)) return `"${f.name}" is not a supported file type. Use PDF, Word, JPG or PNG.`;
  }
  return total > SITE.maxFileMB * 1048576 ? `Your files total more than ${SITE.maxFileMB} MB. Please attach smaller files.` : "";
}
function formPayload(form, subject, extra = {}) {
  const fd = new FormData(), multi = {};
  for (const [k, v] of new FormData(form)) { if (v instanceof File) { if (v.size) fd.append(k, v); } else (multi[k] = multi[k] || []).push(v); }
  for (const [k, a] of Object.entries(multi)) fd.append(k, a.join(", "));
  for (const [k, v] of Object.entries(extra)) fd.append(k, v);
  fd.append("_subject", subject); fd.append("_template", "table"); fd.append("_captcha", "false");
  return fd;
}
async function sendForm(form, subject, extra) {
  const bad = checkFiles(form); if (bad) throw new Error(bad);
  const fd = formPayload(form, subject, extra);
  if (!SITE.notifyEmail) { await delay(700); return { demo: true }; }
  const res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(SITE.notifyEmail), { method: "POST", body: fd, headers: { Accept: "application/json" } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || String(data.success) === "false") throw new Error("We could not send your form. Please try again, or email us at " + BRAND.email + ".");
  return { demo: false };
}
const demoNote = r => r.demo ? `<p class="hint">Prototype mode: no receiving email is connected yet, so nothing was actually sent.</p>` : "";
function errBox(form, msg) { let e = $(".err", form); if (!e) { e = document.createElement("div"); e.className = "err"; e.setAttribute("role", "alert"); form.appendChild(e); } e.textContent = msg; }

/* ---------- data ---------- */
const today = () => new Date().toISOString().slice(0, 10);
// Expired jobs are removed client-side as a safety net, even before the next ingestion run.
const JOBS = ((window.JOBS_DATA && window.JOBS_DATA.jobs) || []).filter(j => j.expiresAt >= today());
const plural = n => `${n} open job${n === 1 ? "" : "s"}`;
const catName = id => (CATEGORIES.find(c => c.id === id) || {}).name || id;
const countries = REGIONS.flatMap(r => r.countries.map(c => ({ ...c, region: r.name })));
const daysAgo = d => { const n = Math.round((new Date(today()) - new Date(d)) / 864e5); return n <= 0 ? "Today" : n === 1 ? "Yesterday" : n + " days ago"; };

/* ---------- layout ---------- */
const NAV = [["index.html", "Home"], ["jobs.html", "Jobs"], ["locations.html", "Locations"], ["partners.html", "Partners"], ["cv-services.html", "CV Services"], ["document-services.html", "Documents"], ["certification.html", "Courses"], ["resources.html", "Resources"], ["about.html", "About"], ["contact.html", "Contact"]];
const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="#14b8a6"/><path d="M20 7v18M13 12h14M10 25l10-4 10 4M6 31c4-3 7 3 11 0s7 3 11 0 4-1 6 0" stroke="#0a1f33" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`;

function layout() {
  const page = location.pathname.split("/").pop() || "index.html";
  const hdr = `<div class="alert-strip">We never charge applicants a fee for a job. <a href="scam-warning.html">Read our scam warning</a></div>
  <header class="site"><div class="wrap"><a class="brand" href="index.html">${LOGO}<span>${BRAND.name}</span></a>
  <button class="menu-btn" aria-label="Menu" onclick="$('nav.main').classList.toggle('open')">Menu</button>
  <nav class="main">${NAV.map(([h, t]) => `<a href="${h}" class="${h === page ? "active" : ""}">${t}</a>`).join("")}<a href="checkout.html" class="cartlink ${page === "checkout.html" ? "active" : ""}" aria-label="Cart">🛒 <span id="cart-n">0</span></a></nav></div></header>`;
  const ftr = `<footer class="site"><div class="wrap"><div class="cols">
  <div><a class="brand" href="index.html" style="padding:0">${LOGO}<span>${BRAND.name}</span></a><p>${BRAND.tagline}. Recruiting offshore talent for oil, gas and marine operators across 6 regions.</p></div>
  <div><h4>Candidates</h4><a href="jobs.html">Browse jobs</a><a href="cv-services.html">CV services</a><a href="document-services.html">Get your documents ready</a><a href="all-services.html">All document services</a><a href="certification.html">Courses</a><a href="resources.html">Career guides</a></div>
  <div><h4>Company</h4><a href="about.html">About us</a><a href="partners.html">Our partners</a><a href="locations.html">Locations</a><a href="contact.html">Contact</a></div>
  <div><h4>Legal</h4><a href="scam-warning.html">Scam warning</a><a href="#" onclick="return false">Privacy policy</a><a href="#" onclick="return false">Terms of use</a><a href="#" onclick="return false">Refund policy</a></div></div>
  <div class="legal">© ${new Date().getFullYear()} ${BRAND.name}. Prototype: brand, logo and copy are placeholders. Jobs shown are sample data.</div></div></footer>
  <a class="wa" href="${BRAND.whatsapp}" target="_blank" rel="noopener">💬 WhatsApp</a>
  <div class="cookie" id="cookie">We use cookies to improve your experience. <button class="btn small dark" id="ck">Accept</button></div>`;
  document.body.insertAdjacentHTML("afterbegin", hdr);
  document.body.insertAdjacentHTML("beforeend", ftr);
  cartBadge();
  if (!store.get("cookie_ok")) { $("#cookie").style.display = "block"; $("#ck").onclick = () => { store.set("cookie_ok", 1); $("#cookie").style.display = "none"; }; }
}

/* ---------- job rendering ---------- */
const jobCard = j => `<a class="card link job" href="job.html?id=${encodeURIComponent(j.id)}">
  <div><h3>${esc(j.title)}</h3><div class="meta">${esc(j.company)} · 📍 ${esc(j.country)} · ${esc(j.rotation)}</div>
  <div style="margin-top:8px"><span class="tag">${esc(catName(j.category))}</span><span class="tag amber">Closes ${esc(j.expiresAt)}</span></div></div>
  <div class="meta" style="text-align:right;white-space:nowrap">${daysAgo(j.postedAt)}<br><span class="btn small outline" style="margin-top:8px">View &amp; apply</span></div></a>`;

function initHome() {
  $("#stat-jobs").textContent = JOBS.length;
  $("#stat-countries").textContent = countries.length;
  $("#stat-cats").textContent = CATEGORIES.length;
  $("#cat-grid").innerHTML = CATEGORIES.map(c => `<a class="card link cat-card" href="jobs.html?cat=${c.id}"><div class="icon">${c.icon}</div><h3>${c.name}</h3><p class="meta" style="margin:0">${c.blurb}</p><div class="count">${plural(JOBS.filter(j => j.category === c.id).length)}</div></a>`).join("");
  $("#latest").innerHTML = JOBS.slice(0, 6).map(jobCard).join("");
  $("#loc-grid").innerHTML = ["united-kingdom", "norway", "uae", "saudi-arabia", "brazil", "usa-gulf-of-mexico", "australia", "south-africa"].map(s => countries.find(c => c.slug === s)).map(c => `<a class="card link" href="locations.html#${c.slug}"><div style="font-size:2rem">${c.flag}</div><h3>${c.name}</h3><div class="meta">${plural(JOBS.filter(j => j.countrySlug === c.slug).length)}</div></a>`).join("");
  $("#hs-cat").innerHTML = `<option value="">All categories</option>` + CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  $("#hs-loc").innerHTML = `<option value="">All locations</option>` + countries.map(c => `<option value="${c.slug}">${c.name}</option>`).join("");
  $("#hs").onsubmit = e => { e.preventDefault(); const p = new URLSearchParams({ q: $("#hs-q").value, cat: $("#hs-cat").value, loc: $("#hs-loc").value }); location.href = "jobs.html?" + p; };
  $("#partner-logos").innerHTML = Array.from({ length: 6 }, (_, i) => `<div class="logo-tile">Partner logo ${i + 1}</div>`).join("");
}

function initJobs() {
  const q = new URLSearchParams(location.search);
  const st = { q: q.get("q") || "", cat: q.get("cat") || "", loc: q.get("loc") || "", rot: "", sort: "new", days: "" };
  $("#f-q").value = st.q;
  $("#f-cat").innerHTML = `<option value="">All categories</option>` + CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  $("#f-loc").innerHTML = `<option value="">All locations</option>` + REGIONS.map(r => `<optgroup label="${r.name}">${r.countries.map(c => `<option value="${c.slug}">${c.name}</option>`).join("")}</optgroup>`).join("");
  $("#f-cat").value = st.cat; $("#f-loc").value = st.loc;
  const pills = $("#cat-pills");
  pills.innerHTML = `<button class="pill" data-c="">All</button>` + CATEGORIES.map(c => `<button class="pill" data-c="${c.id}">${c.icon} ${c.name}</button>`).join("");
  const render = () => {
    st.q = $("#f-q").value.trim().toLowerCase(); st.cat = $("#f-cat").value; st.loc = $("#f-loc").value; st.sort = $("#f-sort").value; st.days = $("#f-days").value;
    $$(".pill", pills).forEach(p => p.classList.toggle("on", p.dataset.c === st.cat));
    let list = JOBS.filter(j => (!st.q || (j.title + " " + j.company + " " + j.description + " " + j.country).toLowerCase().includes(st.q)) && (!st.cat || j.category === st.cat) && (!st.loc || j.countrySlug === st.loc) && (!st.days || (new Date(today()) - new Date(j.postedAt)) / 864e5 <= +st.days));
    list.sort((a, b) => st.sort === "new" ? b.postedAt.localeCompare(a.postedAt) : st.sort === "close" ? a.expiresAt.localeCompare(b.expiresAt) : a.title.localeCompare(b.title));
    $("#count").textContent = `${list.length} job${list.length === 1 ? "" : "s"} found`;
    $("#joblist").innerHTML = list.length ? list.map(jobCard).join("") : `<div class="card empty">No jobs match your filters. <br><a href="#alert">Create a job alert</a> and we'll email you when one appears.</div>`;
  };
  $$("#filters input,#filters select").forEach(el => el.addEventListener("input", render));
  pills.onclick = e => { const b = e.target.closest(".pill"); if (b) { $("#f-cat").value = b.dataset.c; render(); } };
  $("#reset").onclick = () => { $("#filters").reset(); render(); };
  $("#alert-form").onsubmit = e => { e.preventDefault(); const a = store.get("alerts", []); a.push({ email: $("#al-email").value, cat: $("#f-cat").value, loc: $("#f-loc").value }); store.set("alerts", a); $("#alert-form").innerHTML = `<div class="success"><b>Alert created ✔</b><br>We'll notify you when matching jobs are listed.</div>`; };
  render();
}

/* after an application: nudge towards the documents that employers for this role usually ask for */
function docPrompt(j) {
  try {
    const rid = CAT_ROLE[j.category], role = rid && DOC_ROLES.find(r => r.id === rid); if (!role) return `<a class="btn small" href="document-services.html">Get your documents ready</a>`;
    const top = DOC_CORE[rid].slice(0, 4);
    return `<div class="docprompt"><h4>Get ready for the offer</h4><p>Employers hiring ${esc(role.name.toLowerCase())} usually ask for about <b>${DOC_CORE[rid].length} documents</b>, such as ${top.map(t => esc(t.replace(/ \(.*\)$/, ""))).join(", ")}. Check which ones you still need. It takes about two minutes.</p><a class="btn" href="document-services.html?job=${encodeURIComponent(j.title)}&cat=${esc(j.category)}&from=application">Check my documents →</a></div>`;
  } catch { return `<a class="btn small" href="document-services.html">Get your documents ready</a>`; }
}

function initJob() {
  const id = new URLSearchParams(location.search).get("id");
  const j = JOBS.find(x => x.id === id);
  const box = $("#job-root");
  if (!j) { box.innerHTML = `<div class="card empty"><h2>This job is no longer available</h2><p>It may have expired or been filled. Vacancies are removed automatically when they close.</p><a class="btn" href="jobs.html">Browse open jobs</a></div>`; return; }
  document.title = `${j.title} in ${j.country} | ${BRAND.name}`;
  const saved = store.get("saved", []);
  const paras = j.description.split(/\n+/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join("");
  box.innerHTML = `<div class="detail"><div class="card"><a href="jobs.html">← All jobs</a>
    <h1 style="font-size:2rem;margin-top:10px">${esc(j.title)}</h1>
    <div><span class="tag">${esc(catName(j.category))}</span><span class="tag green">${esc(j.country)}</span><span class="tag amber">Closes ${esc(j.expiresAt)}</span></div>
    <div class="facts"><div><b>Operator</b>${esc(j.company)}</div><div><b>Location</b>${esc(j.country)}</div><div><b>Rotation</b>${esc(j.rotation)}</div><div><b>Posted</b>${daysAgo(j.postedAt)}</div></div>
    <h3>Job description</h3>${paras}
    <button class="btn outline small" id="save">${saved.includes(j.id) ? "★ Saved" : "☆ Save job"}</button></div>
  <div class="card" style="position:sticky;top:84px"><h3>Apply for this job</h3>
    <p class="meta" style="color:var(--muted);margin-top:0">Fill in the form once. Our team reviews your details and submits your application to the employer for you.</p>
    <form id="apply">${HONEY}<input type="hidden" name="jobId" value="${esc(j.id)}">
      <div class="row"><div><label>Full name *</label><input name="name" required></div><div><label>Email *</label><input type="email" name="email" required></div></div>
      <div class="row"><div><label>Phone / WhatsApp *</label><input name="phone" required></div><div><label>Nationality *</label><input name="nat" required></div></div>
      <div class="row"><div><label>Current country *</label><input name="cur" required></div><div><label>Years offshore *</label><input type="number" min="0" max="50" name="yrs" required></div></div>
      <label>Certificates held</label><select name="certs" multiple size="4">${CERTS.map(c => `<option>${c}</option>`).join("")}</select>
      <label>Upload CV (PDF/DOC) *</label><input type="file" name="cv" accept=".pdf,.doc,.docx" required><p class="hint">PDF or Word, up to ${SITE.maxFileMB} MB.</p>
      <label>Short note (optional)</label><textarea name="note"></textarea>
      <p class="notice" style="margin-top:12px">Don't include bank details, card numbers or passwords. We never ask for them when you apply. <a href="document-services.html">See the documents you need</a>.</p>
      <label class="check"><input type="checkbox" required> I authorise ${BRAND.name} to submit my application and CV to the employer on my behalf and to store my data for this purpose.</label>
      <p style="margin:14px 0 0"><button class="btn" style="width:100%">Submit application</button></p></form></div></div>`;
  $("#save").onclick = () => { const s = store.get("saved", []); const i = s.indexOf(j.id); i < 0 ? s.push(j.id) : s.splice(i, 1); store.set("saved", s); $("#save").textContent = i < 0 ? "★ Saved" : "☆ Save job"; };
  $("#apply").onsubmit = async e => {
    e.preventDefault(); const form = e.target, btn = $("button", form), label = btn.textContent;
    btn.disabled = true; btn.textContent = "Sending…";
    const ref = "APP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    try {
      const r = await sendForm(form, `Job application ${ref}: ${j.title} (${j.country})`, { "Reference": ref, "Job": `${j.title} | ${j.company} | ${j.country}`, "Job link": location.href });
      const apps = store.get("applications", []); apps.push({ ref, jobId: j.id, title: j.title, status: "Received", at: new Date().toISOString() }); store.set("applications", apps);
      form.parentElement.innerHTML = `<div class="success"><h3>Application received ✔</h3><p>Reference <b>${ref}</b>.<br>We'll review your details and submit them to the employer. You'll get status updates by email (Received → Shortlisted → Interview → Placed).</p>${demoNote(r)}${docPrompt(j)}</div>`;
    } catch (err) { btn.disabled = false; btn.textContent = label; errBox(form, err.message); }
  };
}

function initLocations() {
  $("#regions").innerHTML = REGIONS.map(r => `<section class="region"><h2>${r.name}</h2><div class="grid g3">${r.countries.map(c => `<div class="card" id="${c.slug}">
    <div style="font-size:2rem">${c.flag}</div><h3>${c.name}</h3><p style="margin:.2em 0 10px;color:var(--muted)">${c.info}</p>
    <div class="facts" style="grid-template-columns:1fr"><div><b>Main fields</b>${c.basins}</div><div><b>Typical rotation</b>${c.rotation}</div><div><b>Visa</b>${c.visa}</div><div><b>Medical</b>${c.medical}</div></div>
    <a class="btn small outline" href="jobs.html?loc=${c.slug}">${plural(JOBS.filter(j => j.countrySlug === c.slug).length)} →</a></div>`).join("")}</div></section>`).join("");
}

function initForms() {
  $$("form[data-send]").forEach(f => {
    f.insertAdjacentHTML("afterbegin", HONEY);
    f.onsubmit = async e => {
      e.preventDefault(); const btn = $("button:not([type=button])", f), label = btn.textContent;
      btn.disabled = true; btn.textContent = "Sending…";
      try { const r = await sendForm(f, f.dataset.send, { "Page": location.href }); f.innerHTML = `<div class="success"><h3>Thank you ✔</h3><p>${f.dataset.thanks}</p>${demoNote(r)}</div>`; }
      catch (err) { btn.disabled = false; btn.textContent = label; errBox(f, err.message); }
    };
  });
  const q = new URLSearchParams(location.search);
  $$("[data-q]").forEach(el => { const v = q.get(el.dataset.q); if (v && [...el.options].some(o => o.value === v)) el.value = v; });
}

/* ---------- currency, cart, courses ---------- */
const PRICING = { markupPercent: 0 }; /* your margin on top of the partner price, e.g. 15 for +15% */
const TZ_COUNTRY = { "Africa/Lagos": "NG", "Africa/Accra": "GH", "Africa/Nairobi": "KE", "Africa/Johannesburg": "ZA", "Africa/Cairo": "EG", "Africa/Luanda": "AO", "Africa/Maputo": "MZ", "Africa/Windhoek": "NA", "Africa/Dar_es_Salaam": "TZ", "Africa/Kampala": "UG", "Africa/Lusaka": "ZM", "Africa/Douala": "CM", "Africa/Libreville": "GA", "Africa/Abidjan": "CI", "Africa/Dakar": "SN", "Africa/Casablanca": "MA", "Africa/Algiers": "DZ", "Africa/Tripoli": "LY",
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Karachi": "PK", "Asia/Dhaka": "BD", "Asia/Colombo": "LK", "Asia/Manila": "PH", "Asia/Jakarta": "ID", "Asia/Kuala_Lumpur": "MY", "Asia/Bangkok": "TH", "Asia/Ho_Chi_Minh": "VN", "Asia/Singapore": "SG", "Asia/Shanghai": "CN", "Asia/Hong_Kong": "HK", "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Qatar": "QA", "Asia/Kuwait": "KW", "Asia/Muscat": "OM", "Asia/Bahrain": "BH", "Asia/Baghdad": "IQ", "Asia/Amman": "JO", "Asia/Baku": "AZ", "Asia/Almaty": "KZ", "Asia/Yangon": "MM", "Asia/Brunei": "BN",
  "Europe/London": "GB", "Europe/Dublin": "IE", "Europe/Amsterdam": "NL", "Europe/Paris": "FR", "Europe/Berlin": "DE", "Europe/Madrid": "ES", "Europe/Rome": "IT", "Europe/Lisbon": "PT", "Europe/Brussels": "BE", "Europe/Athens": "GR", "Europe/Oslo": "NO", "Europe/Copenhagen": "DK", "Europe/Stockholm": "SE", "Europe/Zurich": "CH", "Europe/Warsaw": "PL", "Europe/Bucharest": "RO", "Europe/Istanbul": "TR", "Europe/Moscow": "RU", "Europe/Kiev": "UA", "Europe/Kyiv": "UA",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US", "America/Houston": "US", "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA", "America/Halifax": "CA", "America/St_Johns": "CA", "America/Sao_Paulo": "BR", "America/Mexico_City": "MX", "America/Argentina/Buenos_Aires": "AR", "America/Bogota": "CO", "America/Santiago": "CL", "America/Lima": "PE", "America/Guyana": "GY", "America/Paramaribo": "SR", "America/Port_of_Spain": "TT", "America/Jamaica": "JM",
  "Australia/Perth": "AU", "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU", "Australia/Darwin": "AU", "Pacific/Auckland": "NZ" };
const countryByCode = c => COUNTRIES.find(x => x.code === c);
function detectCountry() {
  const saved = store.get("country"); if (saved && countryByCode(saved)) return saved;
  for (const l of (navigator.languages || [navigator.language || ""])) { const m = /-([A-Za-z]{2})$/.exec(l); if (m && countryByCode(m[1].toUpperCase())) return m[1].toUpperCase(); }
  try { const z = TZ_COUNTRY[Intl.DateTimeFormat().resolvedOptions().timeZone]; if (z) return z; } catch { }
  return "ZZ";
}
const myCountry = () => countryByCode(detectCountry()) || countryByCode("ZZ");
function localPrice(thb) {
  let cur = myCountry().cur, r = cur === RATES.base ? 1 : RATES.rates[cur];
  if (!r) { cur = "USD"; r = RATES.rates.USD; }
  const raw = thb * r * (1 + PRICING.markupPercent / 100);
  return { amt: raw >= 10 ? Math.round(raw) : Math.round(raw * 100) / 100, cur };
}
const fmtMoney = (amt, cur) => { const d = amt < 10 && amt % 1 ? 2 : 0; try { return new Intl.NumberFormat("en", { style: "currency", currency: cur, minimumFractionDigits: d, maximumFractionDigits: d }).format(amt); } catch { return cur + " " + amt; } };
const priceOf = thb => { const p = localPrice(thb); return fmtMoney(p.amt, p.cur); };
function currencyBar(el, onChange) {
  const draw = () => {
    const c = myCountry(), cur = localPrice(1).cur;
    el.innerHTML = `<div class="curbar"><span>💱 Prices shown in <b>${cur}</b>. Your country:</span> <select id="cb-country" aria-label="Your country of residence">${COUNTRIES.map(x => `<option value="${x.code}" ${x.code === c.code ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select>
      <span class="hint">Converted from Thai baht (the training provider's price) at the rate of ${esc(RATES.asOf)}. The final amount is confirmed on your invoice.</span></div>`;
    $("#cb-country", el).onchange = e => { store.set("country", e.target.value); draw(); onChange(); };
  };
  draw();
}
const cart = {
  get() { return store.get("cart", []).map(i => i.t ? i : { t: "c", slug: i.slug, qty: i.qty }); },
  set(v) { store.set("cart", v); cartBadge(); },
  add(slug, qty = 1) { const c = this.get(), i = c.find(x => x.t === "c" && x.slug === slug); i ? i.qty = Math.min(20, i.qty + qty) : c.push({ t: "c", slug, qty }); this.set(c); },
  addDocs(ids) { const c = this.get(); ids.forEach(id => { if (!c.some(x => x.t === "d" && x.id === id)) c.push({ t: "d", id }); }); this.set(c); },
  removeDoc(id) { this.set(this.get().filter(x => !(x.t === "d" && x.id === id))); },
  hasDoc(id) { return this.get().some(x => x.t === "d" && x.id === id); },
  count() { return this.get().reduce((a, x) => a + (x.t === "d" ? 1 : x.qty), 0); }
};
/* documents are priced in USD and converted to the visitor's currency, like courses */
function localFromUSD(usd) {
  let cur = myCountry().cur, r = cur === "USD" ? 1 : RATES.rates[cur] / RATES.rates.USD;
  if (!r || !isFinite(r)) { cur = "USD"; r = 1; }
  const raw = usd * r; return { amt: raw >= 10 ? Math.round(raw) : Math.round(raw * 100) / 100, cur };
}
const docMoney = usd => { const p = localFromUSD(usd); return fmtMoney(p.amt, p.cur); };
const usdFmt = usd => "$" + usd.toLocaleString("en-US");
const docPriceHTML = usd => `<b>${usdFmt(usd)}</b>` + (localFromUSD(1).cur !== "USD" ? ` <span class="approx">≈ ${docMoney(usd)}</span>` : "");
let _docIdx;
const docItem = id => { if (!_docIdx) { _docIdx = {}; DOC_CATALOG.forEach(c => c.items.forEach(i => _docIdx[i.id] = { ...i, cat: c.name, kind: "item" })); DOC_PACKAGES.forEach(p => _docIdx[p.id] = { ...p, cat: "Documentation package", kind: "package" }); } return _docIdx[id]; };
function cartLines() {
  const cur = localFromUSD(1).cur, lines = [];
  for (const i of cart.get()) {
    if (i.t === "d") { const d = typeof DOC_CATALOG !== "undefined" && docItem(i.id); if (d) lines.push({ t: "d", id: i.id, name: d.name, cat: d.cat, qty: 1, unit: localFromUSD(d.usd).amt, usd: d.usd }); }
    else { const c = typeof COURSES !== "undefined" && courseBySlug(i.slug); if (c) lines.push({ t: "c", slug: i.slug, name: c.name, sku: c.sku, qty: i.qty, unit: localPrice(c.priceTHB).amt, thb: c.priceTHB }); }
  }
  return { cur, lines, sum: lines.reduce((a, l) => a + l.unit * l.qty, 0) };
}
function cartBadge() { const n = $("#cart-n"); if (n) n.textContent = cart.count(); }
const courseBySlug = slug => COURSES.find(c => c.slug === slug);
const courseCard = c => `<a class="card link course" href="cert.html?slug=${esc(c.slug)}"><div><span class="tag">${esc(c.category)}</span>${c.approval ? `<span class="tag green">Approved by ${esc(c.approval)}</span>` : ""}</div>
  <h3>${esc(c.name)}</h3><p class="summary">${esc(c.summary)}</p><div class="foot"><div><small>Price</small><br><b class="amt">${priceOf(c.priceTHB)}</b></div><span class="btn small outline">Learn more →</span></div></a>`;

function initCourses() {
  const q = new URLSearchParams(location.search), PAGE = 24; let shown = PAGE;
  const cats = [...new Set(COURSES.map(c => c.category))];
  $("#f-cat").innerHTML = `<option value="">All categories (${COURSES.length})</option>` + cats.map(c => `<option value="${esc(c)}">${esc(c)} (${COURSES.filter(x => x.category === c).length})</option>`).join("");
  $("#f-q").value = q.get("q") || ""; if (q.get("cat") && cats.some(c => c.toLowerCase() === q.get("cat").toLowerCase())) $("#f-cat").value = cats.find(c => c.toLowerCase() === q.get("cat").toLowerCase());
  const render = () => {
    const term = $("#f-q").value.trim().toLowerCase(), cat = $("#f-cat").value, sort = $("#f-sort").value;
    let list = COURSES.filter(c => (!cat || c.category === cat) && (!term || (c.name + " " + c.sku + " " + c.aka + " " + c.summary).toLowerCase().includes(term)));
    list.sort((a, b) => sort === "lo" ? a.priceTHB - b.priceTHB : sort === "hi" ? b.priceTHB - a.priceTHB : a.name.localeCompare(b.name));
    $("#count").textContent = `${list.length} course${list.length === 1 ? "" : "s"}`;
    $("#cert-grid").innerHTML = list.slice(0, shown).map(courseCard).join("") || `<div class="card empty" style="grid-column:1/-1">No courses match your search.</div>`;
    $("#more").style.display = list.length > shown ? "" : "none";
  };
  ["input", "change"].forEach(ev => $$("#filters input,#filters select").forEach(el => el.addEventListener(ev, () => { shown = PAGE; render(); })));
  $("#more").onclick = () => { shown += PAGE; render(); };
  currencyBar($("#curbar"), render); render();
}

function initCourse() {
  const c = courseBySlug(new URLSearchParams(location.search).get("slug")), root = $("#cert-root");
  if (!c) { root.innerHTML = `<div class="card empty"><h2>Course not found</h2><a class="btn" href="certification.html">Browse all courses</a></div>`; return; }
  document.title = `${c.name} | ${BRAND.name}`;
  const block = (h, html) => html ? `<h2>${h}</h2><div class="rich">${html}</div>` : "";
  const sched = [["When", c.when], ["Class size (min/max)", c.classSize], ["Location", c.locations]].filter(x => x[1]);
  const rel = COURSES.filter(x => x.slug !== c.slug && x.category === c.category).sort((a, b) => Math.abs(a.priceTHB - c.priceTHB) - Math.abs(b.priceTHB - c.priceTHB)).slice(0, 3);
  const draw = () => {
    root.innerHTML = `<div class="detail"><div><div class="crumbs"><a href="certification.html">← All courses</a></div><div class="card article-body">
      <div><span class="tag">${esc(c.category)}</span>${c.approval ? `<span class="tag green">Approved by ${esc(c.approval)}</span>` : ""}${c.sku ? `<span class="tag amber">Course code ${esc(c.sku)}</span>` : ""}</div>
      <h1 style="font-size:1.8rem;margin-top:10px">${esc(c.name)}</h1>${c.note ? `<p class="notice">${esc(c.note)}</p>` : ""}
      ${block("Course overview", c.overview)}${block("Who should attend", c.who)}${block("Aims and objectives", c.aims)}${block("Physical and stressful demands", c.demands)}${block("Prerequisites", c.prereq)}${block("Course outline", c.outline)}${block("Certification", c.certification)}${block("Assessment", c.competency)}${block("What is included", c.included)}
      ${sched.length ? `<h2>Schedule, class size and location</h2><div class="facts">${sched.map(([k, v]) => `<div><b>${k}</b>${esc(v)}</div>`).join("")}</div>` : ""}
      ${c.aka ? `<p class="hint">Also searched as: ${esc(c.aka)}</p>` : ""}</div></div>
    <aside class="card buybox"><small>Price per delegate</small><div class="price" id="bb-price">${priceOf(c.priceTHB)}</div>
      <p class="hint" style="margin:0 0 8px">Shown in your currency (${localPrice(1).cur}). Taxes, if any, are added on your invoice.</p>
      <label for="bb-qty">Delegates</label><select id="bb-qty">${Array.from({ length: 10 }, (_, i) => `<option>${i + 1}</option>`).join("")}</select>
      <p style="margin:14px 0 8px"><button class="btn" style="width:100%" id="bb-buy">Buy now</button></p><p style="margin:0"><button class="btn outline" style="width:100%" id="bb-add">Add to cart</button></p>
      <div id="bb-msg" class="hint" role="status"></div>
      <ul class="ticks" style="margin-top:14px"><li>Book and pay directly with us</li><li>Certificate issued on successful completion</li><li>Invoice and payment link within one working day</li></ul>
      <div class="disclaimer">📍 <b>Training takes place in Thailand</b> (${esc(c.locations || "see schedule")}). Travel, visa and accommodation are arranged by you unless stated. Check your employer accepts this certificate before you book.</div>
      <div id="bb-cur" style="margin-top:12px"></div></aside></div>
    ${rel.length ? `<h2 style="margin:28px 0 12px">Related courses</h2><div class="grid g3">${rel.map(courseCard).join("")}</div>` : ""}`;
    $("#bb-add").onclick = () => { cart.add(c.slug, +$("#bb-qty").value); $("#bb-msg").innerHTML = `Added ✔ <a href="checkout.html">View cart and checkout</a>`; };
    $("#bb-buy").onclick = () => { cart.add(c.slug, +$("#bb-qty").value); location.href = "checkout.html"; };
    currencyBar($("#bb-cur"), draw);
  };
  draw();
}

function initCheckout() {
  const root = $("#co-root"); track("checkout_viewed");
  const empty = () => { root.innerHTML = `<div class="card empty"><h2>Your cart is empty</h2><p>Choose a course or the documents you need.</p><a class="btn" href="certification.html">Browse courses</a> <a class="btn outline" href="document-services.html">Documents &amp; services</a></div>`; };
  if (!cartLines().lines.length) { empty(); return; }
  root.innerHTML = `<div class="detail"><form class="card" id="co-form"><h2 style="margin-top:0">Your details</h2>
    <div class="row"><div><label for="k-name">Full name *</label><input id="k-name" name="Name" required></div><div><label for="k-email">Email *</label><input id="k-email" name="Email" type="email" required></div></div>
    <div class="row"><div><label for="k-phone">Phone / WhatsApp *</label><input id="k-phone" name="Phone" required></div><div><label for="k-nat">Nationality *</label><input id="k-nat" name="Nationality" required></div></div>
    <div data-for="c"><label for="k-names">Delegate names (for courses) *</label><textarea id="k-names" name="Delegate names" placeholder="One name per line, exactly as on the passport (printed on the certificate)"></textarea>
      <label for="k-month">Preferred training month</label><input id="k-month" name="Preferred month" type="month"></div>
    <div data-for="d"><div class="row"><div><label for="k-role">Target job or role</label><input id="k-role" name="Target role" placeholder="e.g. Driller"></div><div><label for="k-dest">Destination country</label><input id="k-dest" name="Destination"></div></div>
      <label for="k-by">Date you need your documents by</label><input id="k-by" name="Needed by" type="date"></div>
    <label for="k-pay">Preferred payment method</label><select id="k-pay" name="Preferred payment"><option>Card (payment link)</option><option>Bank transfer</option><option>Mobile money</option><option>Other (we will contact you)</option></select>
    <label for="k-note">Notes for our team</label><textarea id="k-note" name="Notes"></textarea>
    <div data-for="c"><label class="check"><input type="checkbox"> I understand course training takes place in Thailand and that travel, visa and accommodation are my responsibility unless stated.</label>
      <label class="check"><input type="checkbox"> I am medically fit for the physical elements of my course(s).</label></div>
    <div data-for="d"><label class="check"><input type="checkbox"> I confirm that all qualifications, experience and information I provide are genuine and verifiable. I authorise ${BRAND.name} to contact third parties (employers, institutions, providers) on my behalf where a service needs it.</label>
      <label class="check"><input type="checkbox"> I understand official government charges, medical costs, training tuition, exam and certification fees and other third-party expenses are <b>not included</b> and will be agreed before any work starts, and that no service guarantees employment, certification, medical clearance or immigration approval.</label></div>
    <label class="check"><input type="checkbox" required> I agree to the terms and refund policy.</label>
    <div class="notice" style="margin-top:12px"><b>No payment is taken on this page.</b> We email your invoice and a secure payment link within one working day. Do not send passports, medical or bank details by chat or email until we confirm a secure channel. Never pay anyone who contacts you from another address.</div>
    <p><button class="btn" style="width:100%">Place order request</button></p></form>
    <aside class="card buybox" id="co-summary"></aside></div>`;
  const form = $("#co-form");
  { const dj = store.get("doc_job"); if (dj && dj.title && $("#k-role")) $("#k-role").value = dj.title; }
  const applyMode = () => { const L = cartLines().lines, has = { c: L.some(l => l.t === "c"), d: L.some(l => l.t === "d") };
    $$("[data-for]", form).forEach(el => { const on = has[el.dataset.for]; el.hidden = !on; $$("input,textarea,select", el).forEach(i => { i.disabled = !on; if (el.dataset.for === "c" && i.id === "k-names") i.required = on; if (i.type === "checkbox") i.required = on; }); }); };
  const summary = () => {
    const t = cartLines(), courses = t.lines.filter(l => l.t === "c"), docs = t.lines.filter(l => l.t === "d");
    $("#co-summary").innerHTML = `<h3>Order summary</h3>
      ${courses.length ? `<h4 class="grp">Courses</h4>` + courses.map(r => `<div class="li"><div><b>${esc(r.name)}</b><div class="qty"><button type="button" data-d="-1" data-s="${esc(r.slug)}" aria-label="Fewer">−</button><span>${r.qty}</span><button type="button" data-d="1" data-s="${esc(r.slug)}" aria-label="More">+</button> <button type="button" class="rm" data-rm="${esc(r.slug)}">Remove</button></div></div><div class="amt">${fmtMoney(r.unit * r.qty, t.cur)}<br><small>${r.qty} × ${fmtMoney(r.unit, t.cur)}</small></div></div>`).join("") : ""}
      ${docs.length ? `<h4 class="grp">Documents &amp; services (${docs.length})</h4>` + docs.map(r => `<div class="li"><div><b>${esc(r.name)}</b><div class="hint" style="margin:2px 0">${esc(r.cat)} · ${usdFmt(r.usd)}</div><button type="button" class="rm-doc" data-rmd="${esc(r.id)}">Remove</button></div><div class="amt">${fmtMoney(r.unit, t.cur)}</div></div>`).join("") : ""}
      <div class="li total"><b>Total</b><div class="amt">${fmtMoney(t.sum, t.cur)}</div></div>
      ${docs.length ? `<p class="hint">Documents are priced in US dollars and shown converted. Official fees and third-party costs are extra and agreed first.</p>` : ""}<div id="co-cur" style="margin-top:10px"></div>`;
    currencyBar($("#co-cur"), summary); applyMode();
  };
  summary();
  $("#co-summary").onclick = e => {
    const d = e.target.dataset, c = cart.get();
    if (d.rm) cart.set(c.filter(x => !(x.t === "c" && x.slug === d.rm)));
    else if (d.rmd) cart.removeDoc(d.rmd);
    else if (d.s) { const i = c.find(x => x.t === "c" && x.slug === d.s); i.qty = Math.max(1, Math.min(20, i.qty + +d.d)); cart.set(c); }
    else return;
    cartLines().lines.length ? summary() : empty();
  };
  form.onsubmit = async e => {
    e.preventDefault(); const btn = $("button:not([type=button])", form), label = btn.textContent; btn.disabled = true; btn.textContent = "Sending…";
    const t = cartLines(), ref = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(), cn = myCountry();
    const cl = t.lines.filter(l => l.t === "c").map(r => `${r.qty} × ${r.name} [${r.sku}] @ ${fmtMoney(r.unit, t.cur)} = ${fmtMoney(r.unit * r.qty, t.cur)} (base ${r.thb * r.qty} THB)`).join("\n");
    const dl = t.lines.filter(l => l.t === "d").map(r => `• ${r.name} (${r.cat}) $${r.usd} = ${fmtMoney(r.unit, t.cur)}`).join("\n");
    const usdDocs = t.lines.filter(l => l.t === "d").reduce((a, l) => a + l.usd, 0);
    const extra = { "Order reference": ref, "Total": fmtMoney(t.sum, t.cur) + " (" + t.cur + ")", "Residence country": cn.name, "Exchange rate date": RATES.asOf };
    if (cl) { extra["Courses"] = cl; } if (dl) { extra["Documents and services"] = dl; extra["Documents total (USD)"] = "$" + usdDocs; }
    try {
      const r = await sendForm(form, `Order ${ref}`, extra); track("order_submitted", { total: Math.round(t.sum), cur: t.cur });
      const orders = store.get("orders", []); orders.push({ ref, total: fmtMoney(t.sum, t.cur), at: new Date().toISOString() }); store.set("orders", orders); cart.set([]);
      root.innerHTML = `<div class="success" style="max-width:640px;margin:0 auto"><h2>Order request received ✔</h2><p>Reference <b>${ref}</b><br>Total <b>${fmtMoney(t.sum, t.cur)}</b></p><p>We'll email your invoice and payment link within one working day. Any official or third-party fees will be quoted and agreed before work starts.</p>${demoNote(r)}<a class="btn" href="document-services.html">Back to documents</a></div>`;
    } catch (err) { btn.disabled = false; btn.textContent = label; errBox(form, err.message); }
  };
}

/* ---------- resources ---------- */
function initResources() {
  $("#res-grid").innerHTML = RESOURCES.map(r => `<a class="card link" href="resource.html?slug=${r.slug}"><div class="icon">${r.icon}</div><span class="tag">${esc(r.tag)}</span><h3>${esc(r.title)}</h3><p style="margin:.3em 0 10px;color:var(--muted)">${esc(r.summary)}</p><span class="meta" style="color:var(--muted);font-size:.88rem">${esc(r.read)} read</span> <span class="btn small outline" style="margin-left:8px">Read guide →</span></a>`).join("") + `<a class="card link" href="document-services.html"><div class="icon">📋</div><span class="tag amber">Checklist</span><h3>Documents you need</h3><p style="margin:.3em 0 10px;color:var(--muted)">Tick what you already have, then see what is missing and get it done.</p><span class="btn small outline">Open checklist →</span></a>`;
}
function initResource() {
  const r = RESOURCES.find(x => x.slug === new URLSearchParams(location.search).get("slug")), root = $("#res-root");
  if (!r) { root.innerHTML = `<div class="card empty"><h2>Guide not found</h2><a class="btn" href="resources.html">All resources</a></div>`; return; }
  document.title = `${r.title} | ${BRAND.name}`;
  const sec = x => `<h2>${x.h}</h2>` + (x.p ? x.p.map(t => `<p>${t}</p>`).join("") : "") + (x.list ? `<ul>${x.list.map(t => `<li>${t}</li>`).join("")}</ul>` : "") +
    (x.table ? `<div class="tbl-wrap"><table><thead><tr>${x.table[0].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${x.table.slice(1).map(row => `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : "");
  const more = RESOURCES.filter(x => x.slug !== r.slug).slice(0, 3);
  root.innerHTML = `<div class="article"><div class="crumbs"><a href="resources.html">← All resources</a></div><div class="card"><span class="tag">${esc(r.tag)}</span> <span class="meta" style="color:var(--muted);font-size:.88rem">${esc(r.read)} read</span>
    <h1 style="font-size:2rem;margin-top:8px">${esc(r.title)}</h1><p class="lead">${r.intro}</p>${r.sections.map(sec).join("")}
    <div class="cta-band" style="margin-top:28px;padding:26px"><h3 style="color:#fff">Next step</h3><a class="btn" href="${r.cta.href}">${r.cta.text}</a></div></div>
    <h2 style="margin-top:28px">More guides</h2><div class="related">${more.map(x => `<a class="card link" href="resource.html?slug=${x.slug}"><span class="tag">${esc(x.tag)}</span><h3>${esc(x.title)}</h3><p style="margin:0;color:var(--muted);font-size:.92rem">${esc(x.summary)}</p></a>`).join("")}</div></div>`;
}

/* ---------- funnel tracking ----------
   Counts each step locally (for ?debug=funnel) and forwards to Google Analytics (gtag) or Plausible if you add them. */
function track(ev, data = {}) {
  try { const f = store.get("funnel", {}); f[ev] = (f[ev] || 0) + 1; store.set("funnel", f); } catch { }
  try { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: ev, ...data }); if (window.gtag) window.gtag("event", ev, data); if (window.plausible) window.plausible(ev, { props: data }); } catch { }
}
function funnelDebug() {
  if (!/debug=funnel/.test(location.search)) return;
  const order = ["doc_role_selected", "doc_checklist_done", "doc_plan_viewed", "doc_added_to_cart", "checkout_viewed", "order_submitted"], f = store.get("funnel", {});
  const el = document.createElement("pre"); el.style.cssText = "position:fixed;left:8px;bottom:8px;background:#000c;color:#9fe;padding:10px;font:12px/1.5 monospace;z-index:999;border-radius:8px";
  el.textContent = "FUNNEL (this device)\n" + order.map(k => k.padEnd(20) + (f[k] || 0)).join("\n"); document.body.appendChild(el);
}

/* ---------- plain-language labels for the price list ---------- */
function plainName(n) {
  let m;
  if ((m = /^(.*) Registration Assistance$/i.exec(n))) return `Register you for your ${m[1]}`;
  if ((m = /^(.*?) (?:Training )?Enrolment(?: Assistance)?$/i.exec(n))) return `Book your ${m[1]} course`;
  if ((m = /^(.*) Application Assistance$/i.exec(n))) return `We handle your ${m[1]} application`;
  if ((m = /^(.*) Renewal Assistance$/i.exec(n))) return `We handle your ${m[1]} renewal`;
  if ((m = /^(.*) Replacement Assistance$/i.exec(n))) return `We replace your ${m[1]}`;
  if ((m = /^(.*) Request Assistance$/i.exec(n))) return `We request your ${m[1]} for you`;
  if ((m = /^(.*) Coordination$/i.exec(n))) return `We arrange your ${m[1]}`;
  if ((m = /^(.*) Organization$/i.exec(n))) return `We organise your ${m[1]}`;
  if ((m = /^(.*) Verification$/i.exec(n))) return `We verify your ${m[1]}`;
  if ((m = /^(.*) Preparation$/i.exec(n)) && !/Interview/.test(n)) return `We prepare your ${m[1]}`;
  if (/(CV|Cover Letter|Biography|Portfolio|Summary|Profile|Reference List|Statement of Availability)$/.test(n)) return `We write your ${n}`;
  return n;
}
function describe(n) {
  if (/Enrolment|Registration/i.test(n)) return "We register you with an approved training provider and handle the paperwork. Course and exam fees are paid to the provider.";
  if (/Application Assistance|Renewal Assistance|Replacement Assistance/i.test(n)) return "We prepare, submit and follow up your application. Official government fees are extra.";
  if (/Coordination/i.test(n)) return "We book and manage it with an approved provider. Medical and other third-party fees are extra.";
  if (/(CV|Cover Letter|Biography|Portfolio|Summary|Profile|List|Statement)$/.test(n)) return "Written by our team from your details. You review and approve it.";
  return "Done for you by our team at the fixed price shown.";
}
const priceLine = usd => { const loc = localFromUSD(1).cur !== "USD"; return loc ? `<b>${docMoney(usd)}</b><small>${usdFmt(usd)}</small>` : `<b>${usdFmt(usd)}</b>`; };
function cartBarHTML() { const t = cartLines(), n = t.lines.length; return n ? `<div class="wrap"><span>🛒 <b>${n}</b> item${n === 1 ? "" : "s"} in your cart · <b>${fmtMoney(t.sum, t.cur)}</b></span><a class="btn small" href="checkout.html">Checkout →</a></div>` : ""; }
function showBar(html) { const bar = $("#cartbar"); bar.innerHTML = html; bar.hidden = !html; document.body.classList.toggle("has-cartbar", !!html); }
const packageByName = n => DOC_PACKAGES.find(p => p.name === n);

/* ---------- job title -> document profile ---------- */
function jobTitleIndex() {
  const m = new Map(); JOB_TITLES.forEach(([t, r]) => m.set(t.toLowerCase(), { t, r }));
  /* site jobs: keep the dictionary's answer if there is one, else trust the keyword rules, else the job's category */
  (typeof JOBS !== "undefined" ? JOBS : []).forEach(j => { const k = j.title.toLowerCase(); if (m.has(k)) return; const rule = JOB_RULES.find(([re]) => re.test(k)), r = rule ? rule[1] : CAT_ROLE[j.category]; if (r) m.set(k, { t: j.title, r }); });
  return [...m.values()];
}
function matchJob(text) {
  const t = String(text || "").trim().toLowerCase().replace(/\s+/g, " "); if (t.length < 2) return null;
  const hit = jobTitleIndex().find(x => x.t.toLowerCase() === t); if (hit) return { role: hit.r, how: "exact", title: hit.t };
  for (const [re, r] of JOB_RULES) if (re.test(t)) return { role: r, how: "keyword", title: String(text).trim() };
  return { role: "general", how: "none", title: String(text).trim() };
}
const ROLE_ORDER = ["driller", "marine", "subsea", "technician", "lifting", "hse", "engineer", "support", "general"];

/* ---------- guided document flow ---------- */
function initWizard() {
  const q = new URLSearchParams(location.search), roles = DOC_ROLES;
  const fromApp = q.get("from") === "application";
  let role = null, jobText = "", how = "group";
  { const jq = q.get("job"), m = jq && matchJob(jq);
    if (m && m.how !== "none") { role = roles.find(r => r.id === m.role); jobText = m.title; how = m.how; }
    else { role = roles.find(r => r.id === (q.get("role") || CAT_ROLE[q.get("cat")] || "")) || null; if (m) { jobText = m.title; if (!role) { role = roles.find(r => r.id === "general"); how = "none"; } } } }
  let step = role ? 2 : 1, more = false, pkgOn = false, added = 0; let pick = {}, alt = {};
  const key = r => "checklist_" + r.id, have = () => new Set(store.get(key(role), []));
  const byName = {}; DOC_CATALOG.forEach(c => c.items.forEach(i => byName[i.name] = docItem(i.id)));
  const MUST = { E: 1, R: 1 };
  const itemsFor = () => role.categories.flatMap(c => c.items.map(([t, p]) => ({ t, p, cat: c.name })));
  const core = () => { const set = DOC_CORE[role.id]; return set.map(t => itemsFor().find(i => i.t === t)).filter(Boolean); };
  const extras = () => itemsFor().filter(i => !DOC_CORE[role.id].includes(i.t));
  const shown = () => core().concat(more ? extras() : []);
  const tr = (i) => ["Your job", "Your documents", "Your plan"][i - 1];

  const progress = () => { $("#wiz-progress").innerHTML = [1, 2, 3].map(i => `<div class="wp ${i === step ? "now" : ""} ${i < step ? "done" : ""}"><span>${i < step ? "✓" : i}</span>${tr(i)}</div>`).join(""); };

  const groupBtns = (act, small) => ROLE_ORDER.map(id => roles.find(r => r.id === id)).filter(Boolean).map(r => `<button type="button" class="role-btn ${small ? "sm" : ""}" data-act="${act}" data-r="${r.id}"><span class="ic">${ROLE_INFO[r.id].icon}</span><b>${esc(r.id === "general" ? "Other / not sure" : r.name)}</b>${small ? "" : `<small>${esc(ROLE_INFO[r.id].eg)}</small>`}</button>`).join("");
  const view1 = () => `<h2>What is your job?</h2><p class="lead">Type your job title. Any job works, even if it is not on our job list.</p>
    <div class="jobbox"><input id="job-q" type="text" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="job-sug" aria-label="Your job title" placeholder="e.g. Process Engineer, ROV Pilot, Camp Boss" value="${esc(jobText)}"><ul id="job-sug" class="sug" role="listbox" hidden></ul></div>
    <p class="hint" id="job-hint" style="min-height:1.4em"></p>
    <p style="margin-top:6px"><button type="button" class="btn" data-act="typed">Continue →</button></p>
    <div class="or"><span>or choose the closest group</span></div>
    <div class="role-grid">${groupBtns("role", false)}</div>`;
  const bindJobBox = () => {
    const inp = $("#job-q"), ul = $("#job-sug"); if (!inp) return; let items = [], act = -1;
    const roleName = id => (roles.find(r => r.id === id) || {}).name || "";
    const close = () => { ul.hidden = true; inp.setAttribute("aria-expanded", "false"); act = -1; };
    const draw = () => { const t = inp.value.trim().toLowerCase(); if (t.length < 2) return close();
      const all = jobTitleIndex(); items = all.filter(x => x.t.toLowerCase().startsWith(t)).concat(all.filter(x => !x.t.toLowerCase().startsWith(t) && x.t.toLowerCase().includes(t))).slice(0, 8);
      if (!items.length) return close();
      ul.innerHTML = items.map((x, i) => `<li role="option" data-i="${i}" class="${i === act ? "on" : ""}"><span>${esc(x.t)}</span><small>${esc(roleName(x.r))}</small></li>`).join(""); ul.hidden = false; inp.setAttribute("aria-expanded", "true"); };
    const choose = text => { const m = matchJob(text); if (!m) { $("#job-hint").textContent = "Please type at least two letters of your job title."; inp.focus(); return; } chooseTyped(m); };
    inp.addEventListener("input", () => { act = -1; draw(); $("#job-hint").textContent = ""; });
    inp.addEventListener("keydown", e => { if (e.key === "ArrowDown") { e.preventDefault(); act = Math.min(items.length - 1, act + 1); draw(); } else if (e.key === "ArrowUp") { e.preventDefault(); act = Math.max(-1, act - 1); draw(); } else if (e.key === "Escape") close(); else if (e.key === "Enter") { e.preventDefault(); choose(act >= 0 && items[act] ? items[act].t : inp.value); } });
    ul.addEventListener("mousedown", e => { const li = e.target.closest("li"); if (li) { e.preventDefault(); choose(items[+li.dataset.i].t); } });
    inp.addEventListener("blur", () => setTimeout(close, 120));
    $('[data-act="typed"]').onclick = () => choose(inp.value);
  };
  const chooseTyped = m => { role = roles.find(r => r.id === m.role); jobText = m.title; how = m.how; pick = {}; alt = {}; more = false; pkgOn = false; store.set("doc_job", { title: jobText, role: role.id }); track("doc_role_selected", { role: role.id, via: "typed", match: m.how }); go(2); };

  const jobHeader = () => {
    const label = jobText ? `<b>${esc(jobText)}</b>${how === "group" ? "" : ` · ${esc(role.id === "general" ? "general offshore list" : "matched to " + role.name)}`}` : `<b>${esc(role.name)}</b>`;
    const regroup = (how === "keyword" || how === "none") ? `<details class="alts" ${how === "none" ? "open" : ""} style="margin:6px 0 10px"><summary>${how === "none" ? "Pick the closest group for a more exact list" : "Not the right group?"}</summary><div class="chips-row">${ROLE_ORDER.filter(id => id !== "general").map(id => roles.find(r => r.id === id)).filter(Boolean).map(r => `<button type="button" class="pill ${r.id === role.id ? "on" : ""}" data-act="regroup" data-r="${r.id}">${ROLE_INFO[r.id].icon} ${esc(r.name)}</button>`).join("")}</div></details>` : "";
    return `${how === "none" ? `<div class="notice" style="margin-bottom:10px">We don't have a specific list for “${esc(jobText)}” yet, so these are the documents almost every offshore job needs. Your plan will still work. Choose the closest group below for a more exact list.</div>` : ""}<div class="crumb">Showing documents for ${label} · <button type="button" class="link-btn2" data-act="change">Change</button></div>${regroup}`; };
  const view2 = () => { const d = have(), list = shown(), n = list.filter(i => d.has(i.t)).length, nExtra = extras().length;
    return `${fromApp ? `<div class="notice" style="margin-bottom:14px">✅ Your application is in. Most employers ask for these documents before making an offer. Check which ones you have.</div>` : ""}
    ${jobHeader()}
    <h2>Which of these do you already have?</h2><p class="lead">Tap each one you have. Anything you don't tap, we'll help you get.</p>
    <div class="have-list">${list.map(i => `<button type="button" class="have-tile" data-act="have" data-t="${esc(i.t)}" aria-pressed="${d.has(i.t)}"><span class="tick">${d.has(i.t) ? "✓" : ""}</span><span class="tx">${esc(i.t)}</span><span class="pri ${MUST[i.p] ? "must" : ""}">${MUST[i.p] ? "Must have" : "Nice to have"}</span></button>`).join("")}</div>
    ${!more && nExtra ? `<p><button type="button" class="btn small outline" data-act="more">Show ${nExtra} more optional documents</button></p>` : ""}
    <div class="wiz-nav"><span class="hint"><b>${n}</b> of ${list.length} ticked</span><button type="button" class="btn" data-act="plan">See my plan →</button></div>`; };

  const planRows = () => { const d = have(), seen = shown().filter(i => !d.has(i.t));
    const rows = seen.filter(i => DOC_MAP[i.t]).map((i, idx) => { const opts = DOC_MAP[i.t].map(n => byName[n]).filter(Boolean), chosen = byName[alt[i.t]] || opts[0], must = !!MUST[i.p];
      return { ...i, idx, opts, chosen, must, on: i.t in pick ? pick[i.t] : must, inCart: cart.hasDoc(chosen.id) }; });
    rows.sort((a, b) => (b.must - a.must) || ({ E: 0, R: 1, N: 2, A: 3 }[a.p] - { E: 0, R: 1, N: 2, A: 3 }[b.p]));
    return { rows, self: seen.filter(i => !DOC_MAP[i.t]), seenCount: seen.length }; };
  const recoPkg = rows => { const needsCV = rows.some(r => r.t === "Updated professional CV (offshore format)"); if (!needsCV) return null;
    const pk = packageByName(PKG_FOR_ROLE[role.id] || PKG_FOR_ROLE._default); if (!pk) return null;
    const sep = PKG_COVERS[pk.name].reduce((a, n) => a + (byName[n]?.usd || 0), 0); return { pk, sep, save: sep - pk.usd }; };
  const covered = r => pkgOn && CV_SERVICES.includes(r.chosen.name);

  const view3 = () => { const { rows, self } = planRows(), reco = recoPkg(rows), pk = reco && reco.pk;
    if (!rows.length) return `<div class="success"><h3>You're document-ready ✔</h3><p>You have everything we asked about for this role.</p><a class="btn" href="jobs.html?cat=${role.cat}">See jobs for this role</a></div><p style="margin-top:14px"><button type="button" class="link-btn2" data-act="back">← Change my answers</button></p>`;
    const sel = rows.filter(r => r.on && !r.inCart && !covered(r)), usd = sel.reduce((a, r) => a + r.chosen.usd, 0) + (pkgOn && pk && !cart.hasDoc(pk.id) ? pk.usd : 0);
    const rowHTML = r => `<div class="plan-row ${r.on && !covered(r) ? "on" : ""} ${r.inCart || covered(r) ? "done" : ""}">
      ${r.inCart ? `<span class="okmark">✓</span>` : covered(r) ? `<span class="okmark">✓</span>` : `<label class="plan-check" aria-label="Include"><input type="checkbox" data-act-chk="${esc(r.t)}" ${r.on ? "checked" : ""}></label>`}
      <div class="plan-main"><div class="for">${esc(r.t)} <span class="pri ${r.must ? "must" : ""}">${r.must ? "Must have" : "Nice to have"}</span></div>
        <div class="what">${esc(plainName(r.chosen.name))}</div>
        <div class="hint" style="margin:2px 0 0">${covered(r) ? "Included in the package you chose." : r.inCart ? "In your cart." : esc(describe(r.chosen.name))}</div>
        ${r.opts.length > 1 && !r.inCart && !covered(r) ? `<details class="alts"><summary>Other options (${r.opts.length - 1})</summary>${r.opts.map(o => `<label class="alt"><input type="radio" name="alt${r.idx}" data-alt="${esc(r.t)}" value="${esc(o.name)}" ${o.id === r.chosen.id ? "checked" : ""}> <span>${esc(plainName(o.name))}</span><span class="pr">${priceLine(o.usd)}</span></label>`).join("")}</details>` : ""}
      </div><div class="plan-price">${covered(r) ? "<small>included</small>" : priceLine(r.chosen.usd)}</div></div>`;
    return `<div class="crumb"><button type="button" class="link-btn2" data-act="back">← Change my answers</button> · <b>${esc(jobText || role.name)}</b></div>
      <h2>Your document plan</h2><p class="lead">Based on your answers, here is what we recommend. We've ticked the must-haves. Untick anything you don't need.</p>
      <div id="doc-cur" style="margin:0 0 14px"></div>
      ${reco ? `<div class="card reco ${pkgOn ? "chosen" : ""}"><div><span class="tag amber">Better value</span><h3 style="margin:6px 0 4px">${esc(pk.name)}</h3><p class="hint" style="margin:0 0 6px">Includes your offshore CV and ${PKG_COVERS[pk.name].length - 1} more documents: ${esc(pk.includes.slice(0, 4).join(", "))} and more.</p>${reco.save > 0 ? `<p style="margin:0"><b>${usdFmt(pk.usd)}</b> instead of about ${usdFmt(reco.sep)} if bought separately. <span class="ok">You save about ${usdFmt(reco.save)}.</span></p>` : ""}</div>
        <div class="reco-act">${cart.hasDoc(pk.id) ? `<span class="ok">✓ In your cart</span>` : `<button type="button" class="btn ${pkgOn ? "outline" : ""}" data-act="pkg">${pkgOn ? "✓ Chosen (tap to undo)" : "Choose this package"}</button>`}<a href="all-services.html#packages" class="hint">Compare all packages</a></div></div>` : ""}
      <div class="plan-list">${rows.map(rowHTML).join("")}</div>
      ${self.length ? `<p class="hint">You provide these yourself: ${self.map(i => esc(i.t)).join("; ")}.</p>` : ""}
      <p class="hint">Need something else? <a href="all-services.html">Browse all 349 services</a>. Official fees (government, medical, training tuition, exams) and other third-party costs are extra and agreed with you before we start. No service guarantees a job, certificate, medical clearance or visa. <a href="all-services.html#terms">Full terms</a>.</p>`;
  };

  const bar = () => {
    if (step === 3) { const { rows } = planRows(), reco = recoPkg(rows), pk = reco && reco.pk;
      const sel = rows.filter(r => r.on && !r.inCart && !covered(r)), withPkg = pkgOn && pk && !cart.hasDoc(pk.id), n = sel.length + (withPkg ? 1 : 0);
      const cur = localFromUSD(1).cur, local = sel.reduce((a, r) => a + localFromUSD(r.chosen.usd).amt, 0) + (withPkg ? localFromUSD(pk.usd).amt : 0);
      if (n > 0) return `<div class="wrap"><span><b>${n}</b> selected · <b>${fmtMoney(local, cur)}</b></span><button type="button" class="btn" data-act="addsel">Add ${n} to cart →</button></div>`; }
    return cartBarHTML(); };
  const render = () => { progress();
    $("#wiz").innerHTML = step === 1 ? view1() : step === 2 ? view2() : view3();
    if (step === 1) bindJobBox();
    if (step === 3) currencyBar($("#doc-cur"), render);
    showBar(bar()); };
  const rerenderKeepScroll = () => { const y = scrollY; render(); scrollTo(0, y); };
  const refocus = sel => { const el = $(sel); if (el) el.focus({ preventScroll: true }); };
  const go = n => { step = n; if (n === 3) track("doc_plan_viewed", { role: role.id }); render(); $("#wiz").scrollIntoView({ block: "start", behavior: "smooth" }); };

  $("#wiz").addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return; const act = b.dataset.act;
    if (act === "role") { role = roles.find(r => r.id === b.dataset.r); jobText = ""; how = "group"; pick = {}; alt = {}; more = false; pkgOn = false; track("doc_role_selected", { role: role.id, via: "group" }); go(2); }
    else if (act === "typed") { return; }
    else if (act === "regroup") { role = roles.find(r => r.id === b.dataset.r); how = jobText ? "keyword" : "group"; pick = {}; alt = {}; more = false; pkgOn = false; if (jobText) store.set("doc_job", { title: jobText, role: role.id }); track("doc_role_selected", { role: role.id, via: "regroup" }); rerenderKeepScroll(); }
    else if (act === "change") { go(1); }
    else if (act === "have") { const d = have(), t = b.dataset.t; d.has(t) ? d.delete(t) : d.add(t); store.set(key(role), [...d]); const y = scrollY; render(); scrollTo(0, y); refocus(`.have-tile[data-t="${CSS.escape(t)}"]`); }
    else if (act === "more") { more = true; rerenderKeepScroll(); }
    else if (act === "plan") { track("doc_checklist_done", { role: role.id, ticked: have().size }); pick = {}; alt = {}; go(3); }
    else if (act === "back") { go(2); }
    else if (act === "pkg") { pkgOn = !pkgOn; rerenderKeepScroll(); }
  });
  $("#wiz").addEventListener("change", e => { const c = e.target;
    if (c.dataset.actChk !== undefined) { const t = c.dataset.actChk; pick[t] = c.checked; rerenderKeepScroll(); refocus(`[data-act-chk="${CSS.escape(t)}"]`); }
    else if (c.dataset.alt) { const t = c.dataset.alt, v = c.value; alt[t] = v; rerenderKeepScroll(); refocus(`[data-alt="${CSS.escape(t)}"][value="${CSS.escape(v)}"]`); } });
  $("#cartbar").addEventListener("click", e => { const b = e.target.closest("[data-act=addsel]"); if (!b) return;
    const { rows } = planRows(), reco = recoPkg(rows), pk = reco && reco.pk;
    const ids = rows.filter(r => r.on && !r.inCart && !covered(r)).map(r => r.chosen.id); if (pkgOn && pk) ids.push(pk.id);
    cart.addDocs(ids); track("doc_added_to_cart", { count: ids.length, role: role.id }); rerenderKeepScroll(); });
  render();
}

/* ---------- browse everything ---------- */
function initCatalog() {
  currencyBar($("#doc-cur"), () => { renderCatalog(); renderPkgs(); showBar(cartBarHTML()); });
  const sel = new Set(), open = new Set(); let filter = "";
  const itemRow = it => { const inCart = cart.hasDoc(it.id);
    return `<li class="svc-row ${inCart ? "incart" : ""}">${inCart ? `<span class="in">✓</span><span class="nm">${esc(it.name)}</span>` : `<label class="check"><input type="checkbox" data-pick="${it.id}" ${sel.has(it.id) ? "checked" : ""}> <span class="nm">${esc(it.name)}</span></label>`}<span class="pr">${priceLine(it.usd)}</span>${inCart ? `<button type="button" class="link-btn" data-rm="${it.id}">Remove</button>` : ""}</li>`; };
  const secInner = c => {
    const items = c.items.filter(i => !filter || i.name.toLowerCase().includes(filter)); if (!items.length) return null;
    const picked = c.items.filter(i => sel.has(i.id) && !cart.hasDoc(i.id)), inCart = c.items.filter(i => cart.hasDoc(i.id)).length, sub = picked.reduce((a, i) => a + i.usd, 0);
    return `${c.note ? `<p class="notice" style="margin:0 0 8px">${esc(c.note)}</p>` : ""}${/Enrolment|Training|Certification/.test(c.name) ? `<p class="hint">Enrolment fees cover our help with booking and paperwork. Course tuition and exam fees are paid to the training provider. <a href="certification.html">Or buy the course from us</a>.</p>` : ""}
      <ul class="svc-list">${items.map(itemRow).join("")}</ul>
      <div class="sec-foot"><div class="cnt"><b>${picked.length}</b> of ${c.items.length} documents selected${sub ? ` · ${priceLine(sub)}` : ""}${inCart ? ` · <span class="ok">${inCart} already in cart</span>` : ""}</div>
      <button type="button" class="btn" data-addsel="${c.id}" ${picked.length ? "" : "disabled"}>${picked.length ? `Add ${picked.length} selected to cart` : "Select documents above"}</button></div>`;
  };
  const badge = c => { const n = c.items.filter(i => cart.hasDoc(i.id)).length; return n ? `<span class="tag green">${n} in cart</span>` : ""; };
  const renderCatalog = () => {
    const html = DOC_CATALOG.map(c => { const inner = secInner(c); if (inner === null) return ""; const isOpen = open.has(c.id) || !!filter;
      return `<details class="sec" id="${c.id}" ${isOpen ? "open" : ""}><summary><span class="ic">${c.icon}</span><span class="t">${c.n}. ${esc(c.name)}</span><span class="meta">${c.items.length} documents</span><span class="bd">${badge(c)}</span></summary><div class="sec-body">${inner}</div></details>`; }).join("");
    $("#cat-root").innerHTML = html || `<div class="card empty">No documents match "${esc(filter)}".</div>`; };
  const refreshAll = () => { $$("#cat-root details.sec").forEach(d => { const c = DOC_CATALOG.find(x => x.id === d.id); if (!c) return; const inner = secInner(c); if (inner !== null) { $(".sec-body", d).innerHTML = inner; $(".bd", d).innerHTML = badge(c); } }); };
  $("#cat-root").addEventListener("toggle", e => { const d = e.target; if (d.tagName === "DETAILS" && !filter) d.open ? open.add(d.id) : open.delete(d.id); }, true);
  $("#cat-root").onchange = e => { const id = e.target.dataset.pick; if (!id) return; e.target.checked ? sel.add(id) : sel.delete(id); const d = e.target.closest("details"); $(".sec-body", d).innerHTML = secInner(DOC_CATALOG.find(x => x.id === d.id)); };
  $("#cat-root").onclick = e => { const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.addsel) { const c = DOC_CATALOG.find(x => x.id === b.dataset.addsel), ids = c.items.filter(i => sel.has(i.id) && !cart.hasDoc(i.id)).map(i => i.id); ids.forEach(i => sel.delete(i)); cart.addDocs(ids); track("doc_added_to_cart", { count: ids.length, source: "catalogue" }); }
    else if (b.dataset.rm) cart.removeDoc(b.dataset.rm); else return;
    refreshAll(); renderPkgs(); showBar(cartBarHTML()); };
  $("#cat-q").oninput = e => { filter = e.target.value.trim().toLowerCase(); renderCatalog(); };
  $("#cat-open").onclick = () => { DOC_CATALOG.forEach(c => open.add(c.id)); renderCatalog(); };
  $("#cat-close").onclick = () => { open.clear(); $("#cat-q").value = ""; filter = ""; renderCatalog(); };
  const renderPkgs = () => { $("#pkg-root").innerHTML = DOC_PACKAGES.map((p, i) => { const inCart = cart.hasDoc(p.id), sep = (PKG_COVERS[p.name] || []).reduce((a, n) => a + (DOC_CATALOG.flatMap(c => c.items).find(x => x.name === n)?.usd || 0), 0);
    return `<div class="card pkg ${i === 1 ? "featured" : ""}">${i === 1 ? '<span class="badge">MOST CHOSEN</span>' : ""}<h3>${esc(p.name)}</h3><div class="price">${usdFmt(p.usd)}</div>${localFromUSD(1).cur !== "USD" ? `<div class="approx">≈ ${docMoney(p.usd)}</div>` : ""}${sep > p.usd ? `<p class="hint" style="margin:4px 0 0">About ${usdFmt(sep)} if bought separately</p>` : ""}<h4>Includes</h4><ul class="ticks">${p.includes.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      ${inCart ? `<button class="btn outline" data-prm="${p.id}">✓ In cart · Remove</button>` : `<button class="btn ${i === 1 ? "" : "dark"}" data-padd="${p.id}">Add package to cart</button>`}</div>`; }).join(""); };
  $("#pkg-root").onclick = e => { const b = e.target.closest("button"); if (!b) return; if (b.dataset.padd) { cart.addDocs([b.dataset.padd]); track("doc_added_to_cart", { count: 1, source: "package" }); } else if (b.dataset.prm) cart.removeDoc(b.dataset.prm); renderPkgs(); showBar(cartBarHTML()); };
  $("#terms-list").innerHTML = DOC_TERMS.map(t => `<li>${esc(t)}</li>`).join("");
  renderCatalog(); renderPkgs(); showBar(cartBarHTML());
  const h = location.hash.slice(1); if (h === "terms") { $("#terms").open = true; $("#terms").scrollIntoView(); } else if (h === "packages") $("#packages").scrollIntoView(); else if (DOC_CATALOG.some(c => c.id === h)) { open.add(h); renderCatalog(); $("#" + h).scrollIntoView(); }
}

document.addEventListener("DOMContentLoaded", () => {
  layout(); initForms(); funnelDebug();
  ({ home: initHome, jobs: initJobs, job: initJob, locations: initLocations, certs: initCourses, cert: initCourse, checkout: initCheckout, resources: initResources, resource: initResource, docs: initWizard, catalog: initCatalog }[document.body.dataset.page] || (() => { }))();
});
