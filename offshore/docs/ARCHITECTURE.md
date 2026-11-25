# Offshore recruitment site: architecture and roadmap

## Status
`offshore/` is a **clickable front-end prototype** (static HTML/CSS/JS) plus a working **job-ingestion script**.
Brand name, logo, colours, partner logos, prices and copy are placeholders (edit `BRAND` in `assets/app.js` and the CSS variables at the top of `assets/styles.css`).
Open `offshore/index.html` in a browser, or run `npx serve offshore`.

## Recommended production stack
| Layer | Choice | Why |
|---|---|---|
| Front end | Next.js (React) + Tailwind | SEO (server rendering), job-posting schema, fast pages |
| Database | PostgreSQL (Supabase or Neon) | Jobs, applicants, applications, alerts |
| File storage | S3 / Supabase Storage (private bucket, signed URLs) | CVs and passports |
| Auth | Supabase Auth / Auth.js | Applicant accounts, admin roles |
| Ingestion | Scheduled job (cron / GitHub Actions / Vercel Cron) running `ingest.mjs` logic | Automated listing and expiry |
| Email | Resend / Postmark | Confirmations, status updates, job alerts |
| Payments | Stripe + Paystack/Flutterwave | CV packages |
| Hosting | Vercel + CDN | |

## Automated job feed (how it works)
1. `ingest/sources.json` lists feeds (JSON/RSS/XML API). Run `node offshore/ingest/ingest.mjs` every 15–30 minutes.
2. Each job is normalised, **links, emails and phone numbers are stripped** from the description, and it is auto-categorised.
3. Jobs outside the approved countries are rejected; duplicates are merged by hash (title + company + country).
4. Jobs past their closing date are not written, and a job that disappears from its source feed is removed on the next run. The front end also hides expired jobs.
5. In production, write to the database instead of `data/jobs.json`, and email alerts to matching subscribers.

### Legal and compliance points to settle before launch
- **Permission to republish.** Copying descriptions from another company's website without its consent or a licence can breach its terms and copyright. Prefer official APIs, partner feeds or written agreements. Credit-free republishing is safest with your own partners' feeds.
- **Applying on behalf of candidates.** Keep the explicit consent checkbox, record when consent was given, and only submit to the employer the application the candidate chose.
- **Data protection (GDPR/NDPR/POPIA).** Encrypt CVs and IDs, set retention periods, and publish a privacy policy.
- **Sanctions screening** for Russia (and similar), and any country that is subject to restrictions.
- **No candidate fees.** Keep the scam warning and fair-recruitment policy.

## Next steps
1. Choose brand name, logo, palette; swap placeholders.
2. Get at least one real, permitted job feed and map it in `sources.json`.
3. Build the Next.js app + database; move the application form to a real backend with CV upload.
4. Admin dashboard: review applications, mark "submitted to employer", send status emails.
5. Payments for CV services; certification partner URL; legal pages; analytics; multi-language.

## Form delivery (applications, CV orders, document services, contact)
Every form is sent by `sendForm()` in `assets/app.js` to one email address. Set it once:
```js
const SITE = { notifyEmail: "applications@your-domain.com", ... }
```
Transport is FormSubmit (formsubmit.co): no server, supports attachments (limit set to 5 MB in `SITE.maxFileMB`). The first submission triggers a one-time activation email to that address. Until `notifyEmail` is set the forms run in prototype mode and send nothing.
For production, move delivery to your own backend (for example the Worker + Resend pattern in the repo root's `worker.js`) so CVs and passport scans do not pass through a third party, and to allow larger files.

## Courses, currency and checkout
- **Catalogue:** `data/courses.js` holds all 85 courses from the training partner (OPITO, TPTI, STCW): overview, who should attend, objectives, prerequisites, outline, certification, assessment, inclusions, schedule and location. Re-generate with `node offshore/ingest/sync-courses.mjs` (uses the partner's public product feed). Republish only with the partner's written permission.
- **Prices:** stored in the partner's currency (THB) and converted in the browser to the visitor's currency. Country is taken from the saved choice, then browser language, then time zone, and the visitor can change it at any time (`data/currencies.js`). Add your margin with `PRICING.markupPercent` in `assets/app.js`.
- **Exchange rates:** `data/rates.js`, refreshed with `node offshore/ingest/update-rates.mjs` (run daily). If a currency is missing, prices fall back to US dollars.
- **Cart and checkout:** `cert.html` (course page), `checkout.html` (cart, details, order). Orders are emailed to `SITE.notifyEmail` as an "order request" and you reply with an invoice. **No payment gateway is connected yet.** To take card payments, add Stripe, Paystack or Flutterwave and charge the amount computed in `initCheckout()` in the visitor's currency.
- In Node on this sandbox, run the scripts with `NODE_USE_ENV_PROXY=1`.
