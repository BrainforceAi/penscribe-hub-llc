/* Shared layout + page logic for the prototype. Brand is a placeholder (decided later). */
const BRAND = { name: "OffshoreLink", tagline: "Offshore careers, delivered", email: "info@your-domain.com", whatsapp: "https://wa.me/0000000000" };
/* Certification partner link: change here only */
const CERT_PARTNER = { url: "https://vhca.vercel.app/" };
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
const NAV = [["index.html", "Home"], ["jobs.html", "Jobs"], ["locations.html", "Locations"], ["partners.html", "Partners"], ["cv-services.html", "CV Services"], ["document-services.html", "Documents"], ["certification.html", "Certification"], ["resources.html", "Resources"], ["about.html", "About"], ["contact.html", "Contact"]];
const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="#14b8a6"/><path d="M20 7v18M13 12h14M10 25l10-4 10 4M6 31c4-3 7 3 11 0s7 3 11 0 4-1 6 0" stroke="#0a1f33" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`;

function layout() {
  const page = location.pathname.split("/").pop() || "index.html";
  const hdr = `<div class="alert-strip">We never charge applicants a fee for a job. <a href="scam-warning.html">Read our scam warning</a></div>
  <header class="site"><div class="wrap"><a class="brand" href="index.html">${LOGO}<span>${BRAND.name}</span></a>
  <button class="menu-btn" aria-label="Menu" onclick="$('nav.main').classList.toggle('open')">Menu</button>
  <nav class="main">${NAV.map(([h, t]) => `<a href="${h}" class="${h === page ? "active" : ""}">${t}</a>`).join("")}</nav></div></header>`;
  const ftr = `<footer class="site"><div class="wrap"><div class="cols">
  <div><a class="brand" href="index.html" style="padding:0">${LOGO}<span>${BRAND.name}</span></a><p>${BRAND.tagline}. Recruiting offshore talent for oil, gas and marine operators across 6 regions.</p></div>
  <div><h4>Candidates</h4><a href="jobs.html">Browse jobs</a><a href="cv-services.html">CV services</a><a href="document-services.html">Document services</a><a href="certification.html">Certification</a><a href="resources.html">Career guides</a></div>
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
    <form id="apply">${HONEY}<input type="hidden" name="jobId" value="${esc(j.id)}">
      <div class="row"><div><label>Full name *</label><input name="name" required></div><div><label>Email *</label><input type="email" name="email" required></div></div>
      <div class="row"><div><label>Phone / WhatsApp *</label><input name="phone" required></div><div><label>Nationality *</label><input name="nat" required></div></div>
      <div class="row"><div><label>Current country *</label><input name="cur" required></div><div><label>Years offshore *</label><input type="number" min="0" max="50" name="yrs" required></div></div>
      <label>Certificates held</label><select name="certs" multiple size="4">${CERTS.map(c => `<option>${c}</option>`).join("")}</select>
      <label>Upload CV (PDF/DOC) *</label><input type="file" name="cv" accept=".pdf,.doc,.docx" required><p class="hint">PDF or Word, up to ${SITE.maxFileMB} MB.</p>
      <label>Short note (optional)</label><textarea name="note"></textarea>
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
      form.parentElement.innerHTML = `<div class="success"><h3>Application received ✔</h3><p>Reference <b>${ref}</b>.<br>We'll review your details and submit them to the employer. You'll get status updates by email (Received → Shortlisted → Interview → Placed).</p>${demoNote(r)}<a class="btn small" href="cv-services.html">Improve your CV</a></div>`;
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

/* ---------- certification pages ---------- */
const certCard = c => `<a class="card link" href="cert.html?slug=${c.slug}"><span class="tag">${esc(c.category)}</span><h3>${esc(c.name)}</h3><p style="margin:.3em 0 10px;color:var(--muted)">${esc(c.summary)}</p><div class="meta" style="color:var(--muted);font-size:.9rem">⏱ ${esc(c.duration)} · ${esc(c.level)}</div><span class="btn small outline" style="margin-top:10px">Course details →</span></a>`;
function initCerts() { $("#cert-grid").innerHTML = CERT_COURSES.map(certCard).join(""); }
function initCert() {
  const c = CERT_COURSES.find(x => x.slug === new URLSearchParams(location.search).get("slug")), root = $("#cert-root");
  if (!c) { root.innerHTML = `<div class="card empty"><h2>Course not found</h2><a class="btn" href="certification.html">All certifications</a></div>`; return; }
  document.title = `${c.name} | ${BRAND.name}`;
  const rel = CERT_COURSES.filter(x => x.slug !== c.slug && (x.category === c.category || x.sector === c.sector)).slice(0, 3);
  root.innerHTML = `<div class="article"><div class="crumbs"><a href="certification.html">← All certifications</a></div><div class="card">
    <span class="tag">${esc(c.category)}</span><h1 style="font-size:1.9rem">${esc(c.name)}</h1>
    <div class="cert-meta"><span class="tag green">⏱ ${esc(c.duration)}</span><span class="tag amber">${esc(c.level)}</span><span class="tag">${esc(c.sector)}</span></div>
    <p>${esc(c.overview)}</p>
    <h2>Who it is for</h2><p>${esc(c.whoFor)}</p>
    <h2>What is covered</h2><ul>${c.covered.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    <h2>Format</h2><p>${esc(c.format)}</p>
    <h2>Validity and renewal</h2><p>${esc(c.validity)}</p>
    <h2>Requirements</h2><p>${esc(c.prereq)}</p>
    <div class="disclaimer">Course dates, centres and prices are set by our certification partner. Before you pay anyone, confirm the training centre is approved by the awarding body for this course, and check the exact certificate your employer asks for.</div>
    <p style="margin-top:18px"><a class="btn" href="${CERT_PARTNER.url}" target="_blank" rel="noopener sponsored">Book with our partner ↗</a> <a class="btn outline" href="resource.html?slug=start-an-offshore-career">Read: starting an offshore career</a></p></div>
    ${rel.length ? `<h2 style="margin-top:28px">Related certifications</h2><div class="related">${rel.map(certCard).join("")}</div>` : ""}</div>`;
}

/* ---------- resources ---------- */
function initResources() {
  $("#res-grid").innerHTML = RESOURCES.map(r => `<a class="card link" href="resource.html?slug=${r.slug}"><div class="icon">${r.icon}</div><span class="tag">${esc(r.tag)}</span><h3>${esc(r.title)}</h3><p style="margin:.3em 0 10px;color:var(--muted)">${esc(r.summary)}</p><span class="meta" style="color:var(--muted);font-size:.88rem">${esc(r.read)} read</span> <span class="btn small outline" style="margin-left:8px">Read guide →</span></a>`).join("");
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

/* ---------- document services ---------- */
function initDocs() {
  $("#svc-grid").innerHTML = DOC_SERVICES.map(s => `<div class="card svc" id="${s.id}"><div class="icon">${s.icon}</div><h3>${s.name}</h3><p>${s.desc}</p><ul class="ticks">${s.includes.map(i => `<li>${i}</li>`).join("")}</ul><div class="meta2">⏱ ${s.time} · Quoted on request</div><a class="btn small outline" href="#apply" data-pick="${s.id}">Apply for this service</a></div>`).join("");
  $("#svc-checks").innerHTML = DOC_SERVICES.map(s => `<label class="check"><input type="checkbox" name="Services" value="${s.name}" data-id="${s.id}"> ${s.name}</label>`).join("");
  const pick = id => { const b = $(`#svc-checks [data-id="${id}"]`); if (b) b.checked = true; };
  $$("[data-pick]").forEach(a => a.addEventListener("click", () => pick(a.dataset.pick)));
  const pre = new URLSearchParams(location.search).get("svc"); if (pre) pick(pre);
}

document.addEventListener("DOMContentLoaded", () => {
  layout(); initForms();
  ({ home: initHome, jobs: initJobs, job: initJob, locations: initLocations, certs: initCerts, cert: initCert, resources: initResources, resource: initResource, docs: initDocs }[document.body.dataset.page] || (() => { }))();
});
