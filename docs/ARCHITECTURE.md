# TalentGrid Architecture

## Current repository implementation
- `index.html`: browser UI, presently a single static client application.
- `api/jobs.js`: Vercel serverless job retrieval/normalization endpoint.
- `api/vault.js`: retired endpoint returning HTTP 410.
- `vercel.json`: serverless function duration and response security headers.
- Browser storage: boards, job results and saved jobs use browser-local storage. This is not a server database or multi-user persistence.

This describes the implementation observed in the repository, not a claim that target modules are implemented.

## Target logical architecture
- **Discovery adapters:** ATS/public board sources and future approved integrations.
- **Normalization:** canonical job fields, source metadata, dates, location and employment types.
- **Company identity layer:** canonical company records and alias/domain matching.
- **Signal layer:** observed/reposted/changed/removed events, source reliability and freshness.
- **Opportunity intelligence:** deterministic configurable score and explanation.
- **Account research:** account and contact records with source/verification metadata.
- **CRM layer:** stages, activities, tasks, follow-up dates and history.
- **Brief generation:** grounded summaries and editable outreach context.
- **Feedback:** outcomes to calibrate signals and scoring.

## Architecture principles
1. Company is the primary prospecting object; postings are evidence.
2. Preserve original source data and normalized representation.
3. Evidence and provenance accompany every actionable signal.
4. Identity resolution must avoid both false merges and duplicate accounts.
5. Data persistence and migration must be planned before multi-user use.
6. No feature may silently discard existing data.
7. Human-controlled outreach and decision-making.
8. Secure handling of credentials and personal data.

## Target canonical entities
Company, JobPosting, JobSource, SignalEvent, Contact, CRMAccount, Activity, Task, Opportunity, User/Owner and Settings.

## Current limitations
No shared database, authentication, team permissions, background scheduler or email automation is provisioned in this repository's current implementation. Treat these as future architectural decisions, not assumed infrastructure.
