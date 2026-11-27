# TalentGrid API Reference (Current Repository)

## `POST /api/jobs`
Primary serverless job-fetch endpoint.

### Request
JSON object:
- `boards`: array of board configurations (bounded by endpoint to 30).
- `query`: optional search query for provider API integrations.
- `region`: optional provider-region filter.

Board providers accepted by current implementation: `greenhouse`, `lever`, `ashby`, `smartrecruiters`, `recruitee`, `custom`, `workday`.

Board configuration fields vary by adapter but include provider, identifier/key, company/name, board id, country, and custom endpoint where relevant.

### Response
JSON response includes:
- `jobs`: normalized and URL-deduplicated jobs.
- `results`: per-board status and counts.
- `providerDiagnostics`: diagnostics for configured external providers.
- `fetchedAt`: timestamp.
- `total`: job count.

Per-board failures are returned as diagnostics rather than necessarily failing the entire request. A fatal handler error returns HTTP 500.

### Adapter notes
- Greenhouse: public boards API.
- Lever: public postings API.
- Ashby: public posting API.
- SmartRecruiters: public company postings; current implementation requests a bounded first page.
- Recruitee: public offers endpoint.
- Workday: accepts a public career-page URL and uses inferred tenant/site; pagination is bounded.
- Custom: public HTTPS JSON endpoint. Supported payloads include an array or supported jobs/results/data wrappers.

### Provider integrations and environment variables
- `JOBVETTA_API_KEY`
- `JOA_API_KEY` or `JOBOPPORTUNITIES_API_KEY`

These keys are read server-side. Provider integration behavior and payload shape are implementation-specific; verify against current provider docs before changing.

### Limits in current code
- Maximum 30 board configurations per request.
- Maximum 500 normalized rows per board (provider may return fewer).
- Request timeout is bounded.
- Custom connector requires HTTPS and basic private/local host rejection; this is not a substitute for a robust outbound allowlist/SSRF defence.
- CORS currently permits `*` unless `ALLOWED_ORIGIN` is set.
- No authentication or rate limiting is implemented in this endpoint.

## `/api/vault`
Legacy endpoint is disabled and returns HTTP 410. Do not use it for secrets.

## Future API surface (design-only; not implemented)
Potential services for companies/accounts, signals, scoring, CRM activities/tasks, briefs and outcomes must be designed with authentication, authorization, validation, auditability and persistence before implementation.
