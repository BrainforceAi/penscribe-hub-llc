# Job feed: how the vacancies stay real, current and about 1,000

## The rule
**Every job on the site comes from a real source. Nothing is generated.** The importer copies title, employer, location and description from an advert, and it only shows a rotation or a closing date if the advert states one. If the sources supply fewer than 1,000 suitable jobs, the site shows fewer. It never pads the list.

Until a real source is connected, the site shows **no vacancies** (a "we're refreshing our feed" message). The fictional demo jobs exist only for design previews and are always shown under a red **DEMO DATA** banner. They are never written to `data/jobs.js`.

## What runs every day
`.github/workflows/jobs-daily.yml` runs `node offshore/ingest/ingest.mjs` at 05:17 UTC (and on demand from the GitHub "Actions" tab). It:
1. Runs the safety tests (they must pass first).
2. Fetches every enabled source.
3. Rejects adverts that are empty, not offshore / oil & gas / marine, outside the approved countries, expired, or older than 45 days.
4. Strips links, emails and phone numbers from descriptions. Merges duplicates (same title + employer + country).
5. **Adds** new adverts and refreshes ones still listed.
6. **Removes** adverts that: vanished from a feed that worked for 2 days running; passed their stated closing date; or are older than 45 days.
7. Keeps the newest 1,000 (`targetActive`) and writes `data/jobs.js`, which is the file the website reads.
8. Commits the result, so your host redeploys.

Safety nets: a source that is **down never removes jobs** (an outage can't empty the site); if the total would fall by more than half the run **refuses to publish** and fails, so you get an email from GitHub; the website also hides closed or over-age adverts between runs and shows a warning if the feed is more than 3 days old.

Check health any time in `offshore/ingest/state/last-run.json` (how many added, removed, rejected, per-source errors, shortfall against 1,000).

## Getting to about 1,000 (this is the part only you can do)
I could not connect real sources from here: they need your accounts, keys or agreements. Pick sources in `ingest/sources.json`, set `"enabled": true`, and add the keys as GitHub secrets (Settings → Secrets and variables → Actions).

| Source | What it gives | Keys / terms |
|---|---|---|
| **Direct partner feeds** (JSON, XML, RSS) from offshore employers, recruiters or oil & gas job boards | The best match for "no link" listings and the Gulf, Norway and West Africa-style coverage | A written agreement with each partner. Put their feed URL and field names in a `partner-*` entry |
| **Careerjet** API (global, worldwide job search) | Your key is already set up as the first source. Wide coverage in many of your countries; the importer keeps only offshore / oil and gas / marine adverts | Secret `CAREERJET_API_KEY`. **The key only works from IP addresses registered in your Careerjet publisher account** (see below). Terms require their tracking link and attribution, so these jobs show "Source: Careerjet" and a link |
| **Adzuna** API (UK, US, Australia, Canada, Netherlands, South Africa, Brazil, Mexico) | Wide coverage of general job ads, filtered to offshore by the importer | Free key at developer.adzuna.com. Secrets `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`. **Terms require attribution and a link back, so these jobs show "Source: Adzuna" and a link to the original** |
| **Reed** API (UK) | UK offshore / marine roles | Key at reed.co.uk/developers. Secret `REED_API_KEY`. Same attribution and link rule |

Be realistic: general aggregators carry a few hundred genuinely offshore adverts per country at best, and none cover the Gulf well. Expect to reach 1,000 only with several direct partner feeds. Do **not** scrape other job sites without their permission; it can breach their terms and copyright.

## Careerjet: the IP address rule (read this before the first run)
Careerjet answered the first live test with `Unauthorized access from IP ...`: the key is restricted to registered server IPs. To make the daily job work:
1. In your Careerjet publisher account, find the API key's **authorised / allowed IP addresses** setting and register the public IP of the machine that will run the daily job. If you can't find it, ask Careerjet support to register it or to lift the restriction.
2. GitHub's free hosted runners use a different IP every run, so they cannot be registered. Run the job from a machine with a **fixed public IP** (a small VPS is enough): either install a GitHub **self-hosted runner** on it and set the repository variable `JOBS_RUNNER` to `self-hosted`, or simply run it from that machine's `cron`:
   ```bash
   17 5 * * *  cd /path/to/repo && git pull -q && CAREERJET_API_KEY=... CAREERJET_USER_IP=<that machine's IP> node offshore/ingest/ingest.mjs && git add offshore/data offshore/ingest/state && git commit -qm "Daily jobs" && git push -q
   ```
3. Add the secret `CAREERJET_API_KEY` (Settings → Secrets and variables → Actions) and the variable `CAREERJET_USER_IP` (that machine's IP). The key is never stored in the repository.
4. **Confirm Careerjet's terms in writing.** Their API is designed for live searches by your visitors (the `user_ip` field is "the user whose action triggered the call"). Storing their results in a daily file is a different use, and I could not find a public terms page to check. Ask Careerjet that daily storage and display is allowed, and that your plan to show jobs without their branding is not (the tracking link and attribution are kept by default).
5. Because the key was pasted into a chat, **regenerate it** in your publisher account once everything works.

## Applying for someone
Applications arrive by email with the job's ID and title. To find the original advert (kept private, never shown to the public):
```bash
node offshore/ingest/lookup.mjs <job id or title>
```
If the job is gone, the lookup says so, which is also your cue to tell the applicant it has closed.

## Keep the private file private
`offshore/ingest/state/jobs-state.json` holds every advert's original link. The repo root `.assetsignore` stops Cloudflare publishing `offshore/ingest/`, but **if you host the offshore site from a separate repo or host, make sure `ingest/` is not deployed there either.**

## Countries
Only countries in `data/locations.js` are accepted. Russia is excluded by default (`excludeCountrySlugs` in `sources.json`) because of sanctions; remove it there only after legal advice.

## Commands
```bash
node --test offshore/ingest/test/ingest.test.mjs        # safety rules
node offshore/ingest/ingest.mjs --dry                   # try a run without writing anything
node offshore/ingest/demo/build-demo.mjs /tmp/demo      # fictional preview data into a folder you choose
```
In this sandbox prefix with `NODE_USE_ENV_PROXY=1`.
