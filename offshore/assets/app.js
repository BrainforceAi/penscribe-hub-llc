/* Shared layout + page logic for the prototype. Brand is a placeholder (decided later). */
const BRAND = { name: "OffshoreLink", tagline: "Offshore careers, delivered", email: "info@your-domain.com", whatsapp: "https://wa.me/0000000000" };
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } } };

/* ---------- data ---------- */
const today = () => new Date().toISOString().slice(0, 10);
// Expired jobs are removed client-side as a safety net, even before the next ingestion run.
const JOBS = ((window.JOBS_DATA && window.JOBS_DATA.jobs) || []).filter(j => j.expiresAt >= today());
const plural = n => `${n} open job${n === 1 ? "" : "s"}`;
const catName = id => (CATEGORIES.find(c => c.id === id) || {}).name || id;
const countries = REGIONS.flatMap(r => r.countries.map(c => ({ ...c, region: r.name })));
const daysAgo = d => { const n = Math.round((new Date(today()) - new Date(d)) / 864e5); return n <= 0 ? "Today" : n === 1 ? "Yesterday" : n + " days ago"; };

/* ---------- layout ---------- */
const NAV = [["index.html", "Home"], ["jobs.html", "Jobs"], ["locations.html", "Locations"], ["partners.html", "Partners"], ["cv-services.html", "CV Services"], ["certification.html", "Certification"], ["resources.html", "Resources"], ["about.html", "About"], ["contact.html", "Contact"]];
const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="#14b8a6"/><path d="M20 7v18M13 12h14M10 25l10-4 10 4M6 31c4-3 7 3 11 0s7 3 11 0 4-1 6 0" stroke="#0a1f33" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`;

function layout() {
  const page = location.pathname.split("/").pop() || "index.html";
  const hdr = `<div class="alert-strip">We never charge applicants a fee for a job. <a href="scam-warning.html">Read our scam warning</a></div>
  <header class="site"><div class="wrap"><a class="brand" href="index.html">${LOGO}<span>${BRAND.name}</span></a>
  <button class="menu-btn" aria-label="Menu" onclick="$('nav.main').classList.toggle('open')">Menu</button>
  <nav class="main">${NAV.map(([h, t]) => `<a href="${h}" class="${h === page ? "active" : ""}">${t}</a>`).join("")}</nav></div></header>`;
  const ftr = `<footer class="site"><div class="wrap"><div class="cols">
  <div><a class="brand" href="index.html" style="padding:0">${LOGO}<span>${BRAND.name}</span></a><p>${BRAND.tagline}. Recruiting offshore talent for oil, gas and marine operators across 6 regions.</p></div>
  <div><h4>Candidates</h4><a href="jobs.html">Browse jobs</a><a href="cv-services.html">CV services</a><a href="certification.html">Certification</a><a href="resources.html">Career guides</a></div>
  <div><h4>Company</h4><a href="about.html">About us</a><a href="partners.html">Our partners</a><a href="locations.html">Locations</a><a href="contact.html">Contact</a></div>
  <div><h4>Legal</h4><a href="scam-warning.html">Scam warning</a><a href="#" onclick="return false">Privacy policy</a><a href="#" onclick="return false">Terms of use</a><a href="#" onclick="return false">Refund policy</a></div></div>
  <div class="legal">© ${new Date().getFullYear()} ${BRAND.name}. Prototype: brand, logo and copy are placeholders. Jobs shown are sample data.</div></div></footer>
  <a class="wa" href="${BRAND.whatsapp}" target="_blank" rel="noopener">💬 WhatsApp</a>
  <div class="cookie" id="cookie">We use cookies to improve your experience. <button class="btn small dark" id="ck">Accept</button></div>`;
  document.body.insertAdjacentHTML("afterbegin", hdr);
  document.body.insertAdjacentHTML("beforeend", ftr);
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
    <form id="apply"><input type="hidden" name="jobId" value="${esc(j.id)}">
      <div class="row"><div><label>Full name *</label><input name="name" required></div><div><label>Email *</label><input type="email" name="email" required></div></div>
      <div class="row"><div><label>Phone / WhatsApp *</label><input name="phone" required></div><div><label>Nationality *</label><input name="nat" required></div></div>
      <div class="row"><div><label>Current country *</label><input name="cur" required></div><div><label>Years offshore *</label><input type="number" min="0" max="50" name="yrs" required></div></div>
      <label>Certificates held</label><select name="certs" multiple size="4">${CERTS.map(c => `<option>${c}</option>`).join("")}</select>
      <label>Upload CV (PDF/DOC) *</label><input type="file" name="cv" accept=".pdf,.doc,.docx" required>
      <label>Short note (optional)</label><textarea name="note"></textarea>
      <label class="check"><input type="checkbox" required> I authorise ${BRAND.name} to submit my application and CV to the employer on my behalf and to store my data for this purpose.</label>
      <p style="margin:14px 0 0"><button class="btn" style="width:100%">Submit application</button></p></form></div></div>`;
  $("#save").onclick = () => { const s = store.get("saved", []); const i = s.indexOf(j.id); i < 0 ? s.push(j.id) : s.splice(i, 1); store.set("saved", s); $("#save").textContent = i < 0 ? "★ Saved" : "☆ Save job"; };
  $("#apply").onsubmit = e => {
    e.preventDefault(); const f = new FormData(e.target); const apps = store.get("applications", []);
    const ref = "APP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    apps.push({ ref, jobId: j.id, title: j.title, name: f.get("name"), email: f.get("email"), status: "Received", at: new Date().toISOString() }); store.set("applications", apps);
    e.target.parentElement.innerHTML = `<div class="success"><h3>Application received ✔</h3><p>Reference <b>${ref}</b>.<br>We'll review your details and submit them to the employer. You'll get status updates by email (Received → Shortlisted → Interview → Placed).</p><a class="btn small" href="cv-services.html">Improve your CV</a></div>`;
  };
}

function initLocations() {
  $("#regions").innerHTML = REGIONS.map(r => `<section class="region"><h2>${r.name}</h2><div class="grid g3">${r.countries.map(c => `<div class="card" id="${c.slug}">
    <div style="font-size:2rem">${c.flag}</div><h3>${c.name}</h3><p style="margin:.2em 0 10px;color:var(--muted)">${c.info}</p>
    <div class="facts" style="grid-template-columns:1fr"><div><b>Main fields</b>${c.basins}</div><div><b>Typical rotation</b>${c.rotation}</div><div><b>Visa</b>${c.visa}</div><div><b>Medical</b>${c.medical}</div></div>
    <a class="btn small outline" href="jobs.html?loc=${c.slug}">${plural(JOBS.filter(j => j.countrySlug === c.slug).length)} →</a></div>`).join("")}</div></section>`).join("");
}

function initForms() {
  $$("form[data-demo]").forEach(f => f.onsubmit = e => { e.preventDefault(); f.innerHTML = `<div class="success"><h3>Thank you ✔</h3><p>${f.dataset.demo}</p></div>`; });
}

document.addEventListener("DOMContentLoaded", () => {
  layout(); initForms();
  ({ home: initHome, jobs: initJobs, job: initJob, locations: initLocations }[document.body.dataset.page] || (() => { }))();
});
