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

## Automated job feed
See `docs/JOBS-FEED.md`. Daily GitHub Action, real sources only, adds new and removes inactive adverts, target about 1,000, never fabricates.

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

## Documents and services (merged checklist + price list)
`document-services.html` is one flow: (1) pick a role and tick the documents you already have, (2) see what is missing, with the services that get each item (`data/docmap.js`), (3) browse the full price list and add only the documents wanted. Each category shows "N of M selected" and an "Add N selected to cart" button, so nobody thinks they are buying a whole section.
- **Prices:** edit `data/price-list.md`, then run `node offshore/ingest/build-price-list.mjs` to regenerate `data/docprices.js` (18 categories, 349 services, 4 packages, terms). Prices are USD and shown converted to the visitor's currency.
- `documents.html` redirects to the merged page so old links keep working.
- Cart holds courses and documents together; checkout adapts its fields to what is in the cart.

## Guided document flow (replaces the single long page)
`document-services.html` is a three-step flow: **job → what you have → your plan**. Step 2 shows the 10 core documents per role (`DOC_CORE` in `data/docplan.js`), the rest sit behind "Show more". Step 3 recommends one service per missing item (the first entry in `DOC_MAP`), ticks the must-haves, lets the applicant see other options, and suggests a better-value package when a CV is needed (savings computed from `PKG_COVERS`). Labels are rewritten into plain language by `plainName()` and `describe()` in `assets/app.js`. The full catalogue lives on `all-services.html`. After a job application, `docPrompt()` links to the flow with the role pre-selected. `track()` records funnel steps (see `docs/USER-TESTING.md`).

## Any job title (step 1 of the document flow)
Applicants type their job title (suggestions come from `data/jobtitles.js` plus the live jobs). `matchJob()` in `assets/app.js` maps it to one of nine document profiles in `data/checklists.js` (driller, marine, subsea, technician, lifting, hse, engineer, support, general): exact dictionary match first, then the keyword rules (`JOB_RULES`, ordered, first match wins), and finally the `general` profile, which lists the documents almost every offshore job needs. For an unrecognised title the applicant sees a notice and can pick the closest group, and the plan still works. Add titles to `JOB_TITLES` or tune `JOB_RULES` when you see new ones; the typed title is saved and pre-fills "Target role" at checkout.
Also fixed: `ingest/ingest.mjs` now categorises Able Seaman, Crane Operator, Rigger and Helideck roles correctly.
