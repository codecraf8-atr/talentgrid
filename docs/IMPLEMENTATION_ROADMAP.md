# Implementation roadmap
This branch hardens custom-fetch redirects/DNS destinations, limits request rates and response sizes, adds a health endpoint and proposed persistence schema. Database, auth, queues and scheduling remain unprovisioned and inactive.
1. Audit all boards/adapters and implement retry, throttling, health taxonomy, structured logs and tests.
2. Provision PostgreSQL, migrate local data with export/rollback, enforce tenancy/RLS.
3. Worker/queue/scheduler, idempotent ingestion, snapshots, new/change/removal detection.
4. Incremental React/TypeScript refactor preserving current features.
5. Historical evidence-backed hiring intelligence scoring.
6. Auth, workspace sharing and alerts.
7. AI classification/search/summaries only after data quality.
Release gates: provider tests, redirect/SSRF/size/rate tests, Playwright regression, migration dry run, backup/restore and rollback.
