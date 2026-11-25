# Ingestion
```
node offshore/ingest/ingest.mjs
```
Reads enabled sources in `sources.json`, writes `data/jobs.json` and `data/jobs.js`.
Sample data lives in `samples/sample-feed.json` (includes a duplicate, an expired job and non-approved countries to prove the filters).
Schedule it with cron or CI. See `../docs/ARCHITECTURE.md` for the legal notes on sources.
