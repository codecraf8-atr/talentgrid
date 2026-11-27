# TalentGrid

**Hiring intelligence. Prospecting. Relationships.**

TalentGrid is an internal staffing business-development intelligence and account-management workspace. Its purpose is to help a staffing business consistently identify, qualify, research, approach, follow up with, and convert companies into staffing clients.

> **Locked product direction:** TalentGrid is not a job aggregator, ATS, LinkedIn replacement, candidate database, or full CRM. Hiring signals are inputs to company-level prospecting.

## Product journey

**Discover → Qualify → Research → Engage → Convert**

## Locked modules

1. **Opportunity Radar** — company-centric hiring activity, consolidation, deduplication, source evidence, role/location filters and company exclusions.
2. **Opportunity Intelligence** — transparent prioritisation based on service/role fit, hiring intensity, signal freshness, persistence and source reliability.
3. **Account & Decision-maker Research** — persistent company context, contact research records and validation links.
4. **Prospect Brief & Outreach Context** — evidence-grounded account briefs and editable outreach suggestions.
5. **Prospecting CRM** — account pipeline, contacts, activities, tasks, reminders, nurture, recycling and conversion.

## Locked development order

0. Reliability and data foundation.
1. Company-centric Opportunity Radar.
2. Opportunity Intelligence.
3. Prospecting CRM.
4. Decision-maker research and Prospect Brief.
5. Feedback and commercial intelligence calibration.

See [Product Blueprint](docs/PRODUCT_BLUEPRINT.md) and [Roadmap](docs/ROADMAP.md).

## Repository architecture (current implementation)

- Static browser application: `index.html`.
- Vercel serverless job-fetch endpoint: `api/jobs.js`.
- Disabled legacy vault endpoint: `api/vault.js` (returns HTTP 410).
- Vercel configuration: `vercel.json`.
- Package configuration: `package.json`.
- Browser-local storage is currently used for boards, fetched jobs and saved jobs; this is not a shared database.

The repository's current implementation is a prototype/early operational dashboard. The locked product blueprint describes the target system and does not imply that every target capability has already been implemented.

## Supported public-board adapters (current API implementation)

| Provider | Identifier / configuration |
|---|---|
| Greenhouse | Board token |
| Lever | Site identifier |
| Ashby | Board identifier |
| SmartRecruiters | Company identifier |
| Recruitee | Company subdomain |
| Workday | Public Workday career-page URL; tenant/site inferred |
| Custom JSON | Public HTTPS endpoint returning jobs array or supported wrapper |

The server endpoint also has optional server-side integrations for JobVetta and Job Opportunities API, configured through environment variables. See [API Reference](docs/API_REFERENCE.md).

## Deployment

The application is configured for Vercel. The Vercel project is named `talentgrid`; deployments are linked to this repository.

- Runtime configuration: [vercel.json](vercel.json)
- Deployment and environment guidance: [Deployment](docs/DEPLOYMENT.md)
- Operational checklist: [Operations](docs/OPERATIONS.md)

## Documentation

- [Product Blueprint](docs/PRODUCT_BLUEPRINT.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Data Model](docs/DATA_MODEL.md)
- [API Reference](docs/API_REFERENCE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [QA Plan](docs/QA_PLAN.md)
- [Operations and Security](docs/OPERATIONS.md)
- [Decision Log](docs/DECISIONS.md)

## Local development

Requirements: Node.js 20+ and the Vercel CLI (available via the project package).

```bash
npm install
npm run dev
# or
npx vercel dev
```

## Current limitations and security

- Data is browser-local and not synchronised across users or devices.
- No provisioned database, authentication system, scheduled refresh, email automation or team collaboration exists in this repository's current architecture.
- The fetch endpoint accepts board configuration in a POST body; the custom adapter can request public HTTPS URLs. Public deployment for untrusted users requires additional authentication, rate limiting, outbound allowlisting and abuse controls.
- Public hiring activity is not proof of a staffing-vendor requirement.
- The system must retain evidence/source attribution and avoid unsupported claims about employers or contacts.
- Automated LinkedIn scraping, mass outreach and autonomous agent actions are outside the locked scope.

## Product discipline

Reliability precedes expansion. Every feature must support the locked journey and be backed by functional QA. Do not introduce scope drift without explicit approval and evidence.
