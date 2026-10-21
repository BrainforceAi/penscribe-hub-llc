# Contact form and scheduling setup

The `/api/contact` endpoint is implemented by `worker.js`. It accepts the service-page inquiry forms (multipart, with up to 3 attachments totalling 10 MB: PDF, Word, Excel, CSV, text, or images) as well as the older JSON forms. It validates required fields, uses a honeypot, supports optional Cloudflare KV rate limiting, sends notification email through Resend (attachments included, subject prefixed `URGENT:` when the deadline box is ticked), and posts the same lead to a Google Apps Script webhook for Google Sheets. When Resend is configured, the email decides whether the visitor sees success; if neither Resend nor the Sheets webhook is configured the form returns an error and shows the direct email link.

**Nothing is delivered until `RESEND_API_KEY` (or `GOOGLE_SHEETS_WEBHOOK`) is set as a secret on the Worker.** After setting it, submit a test inquiry from a service page and confirm it arrives at isaac@thepenscribe.com.

## Cloudflare secrets

```sh
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put GOOGLE_SHEETS_WEBHOOK
npx wrangler secret put FORM_TO_EMAIL       # isaac@thepenscribe.com
npx wrangler secret put FORM_FROM_EMAIL     # verified sender, e.g. Website <website@thepenscribe.com>
```

For stronger abuse control, create a KV namespace and add the generated ID in `wrangler.toml` using the documented `LEAD_LIMIT` example.

## Google Sheet Apps Script

Create a sheet named `Leads` with these nine columns, in this order: `Created`, `Name`, `Email`, `Company`, `Phone`, `Service`, `Message`, `Source`, `IP`.

In **Extensions → Apps Script**, add a `doPost(e)` handler that parses the submitted JSON and appends those nine fields. Before appending user-provided text, neutralize values beginning with `=`, `+`, `-`, or `@` by prefixing them with an apostrophe. This prevents spreadsheet-formula injection when the sheet is opened.

Deploy the Apps Script as a web app and store the full deployment URL ending in `/exec` as `GOOGLE_SHEETS_WEBHOOK`. The deployment ID alone will not work.

## Calendly

The public scheduling URL is configured as `https://calendly.com/brainforceai/30min` in `SITE.calendly` at the top of `site.js`. Scheduling CTAs and the contact widget open it securely in a new tab.

## Preview deployment

Run `npx wrangler versions upload`, review the generated preview URL, and only promote that version after approval.
